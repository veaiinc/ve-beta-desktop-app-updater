import React, { memo, useMemo, useState, useContext, useEffect, useCallback } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import '../../../assets/scss/calendar/calendarView.scss';
import CalendarWrapper from '../../components/calendar/CalendarWrapper';
import CalendarHeader from '../../components/calendar/CalendarHeader';
import CustomTimeGutterHeader from '../../components/calendar/CustomTimeGutterHeader';
import CustomEventCard from '../../components/calendar/CustomEventCard';
import CustomEventWrapper from '../../components/calendar/CustomEventWrapper';
import MonthEventWrapper from '../../components/calendar/MonthEventWrapper';
import Context from '../../../context/context';
import moment from 'moment';
import EventDetailsModal from '../../components/modalsV2/calendar/EventDetailsModal';
// import CustomEventContainer from '../../components/calendar/CustomEventContainer';
// import UpdatedPageLoader from '../../components/loaders/UpdatedPageLoader';

const initialState = {
	eventsList: [],
	eventListError: null,
	isLoading: true,
	isEventCreated: false,
	updateEventsList: false,
	selectedEvent: null,
	categoryBasedEventsList: [],
};

const CalendarView = ({
	currentCalendarDate,
	selectedWeek,
	selectedDate,
	selectedMonth,
	isEventSelected,
	categoryList,
	selectedCategory,
	categoryFilter,
	updateCalendarInfo,
	selectedWorkflowId,
}) => {
	const {
		calendarInfo: {
			calendarEventsList,
			getCalendarEventsList,
			calendarEvent,
			resetCalendarState,
			sendEventToAi,
		},
		// profileInfo: { userWorkSpaceList, userDetailsData },
		companyInfo: { tenantsUserList, getTeamMembers },
	} = useContext(Context);

	const [info, setInfo] = useState({
		...initialState,
	});

	useEffect(() => {
		if (!tenantsUserList || tenantsUserList.length === 0) {
			getTeamMembers();
		}
	}, [tenantsUserList]);

	useEffect(() => {
		if (calendarEvent?._id) {
			handleSendEventToAi();
			getCalendarEventsList(selectedDate);
		}
	}, [calendarEvent]);

	useEffect(() => {
		getCalendarEventsList(selectedDate);
	}, [selectedMonth]);

	useEffect(() => {
		return () => {
			resetCalendarState();
			setInfo({ ...initialState });
		};
	}, []);

	useEffect(() => {
		if (calendarEventsList) {
			if (calendarEventsList?.error?.length) {
				return setInfo((prevInfo) => ({
					...prevInfo,
					eventListError: calendarEventsList?.error,
					isLoading: false,
				}));
			}

			// Map the calendarEventsList to the desired eventsList format
			const mappedEventsList = calendarEventsList?.map((event) => ({
				id: event?._id,
				start: moment(event?.startDateTime).local().toDate(),
				end: moment(event?.endDateTime).local().toDate(),
				title: event?.title,
				description: event?.description,
				...(event || {}),
			}));

			setInfo((prevInfo) => ({
				...prevInfo,
				eventsList: mappedEventsList,
				isLoading: false,
			}));
		}
	}, [calendarEventsList]);

	useEffect(() => {
		// Filter events based on categoryFilter
		const defaultCategory = categoryList?.find(
			(cat) =>
				cat?.name?.toLowerCase() === 'default' || cat?.type?.toLowerCase() === 'default',
		)?._id;

		// If default category is selected, show all events
		if (categoryFilter?.includes(defaultCategory)) {
			setInfo((prev) => ({ ...prev, categoryBasedEventsList: info?.eventsList }));
			return;
		}

		// Otherwise filter events based on selected categories
		const filteredEvents = info?.eventsList?.filter((event) => {
			const eventCategory = event?.calendarCategory;
			return categoryFilter?.includes(eventCategory?._id);
		});
		setInfo((prev) => ({ ...prev, categoryBasedEventsList: filteredEvents }));
	}, [categoryFilter, info?.eventsList, categoryList]);

	const handleSendEventToAi = useCallback(async () => {
		if (calendarEvent?._id) {
			await sendEventToAi({
				event_id: calendarEvent?._id,
			});
		}
	}, [calendarEvent]);

	const handleSelectEvent = useCallback(
		(event) => {
			updateCalendarInfo('isEventSelected', true);
			setInfo((prevInfo) => ({
				...prevInfo,
				selectedEvent: event,
			}));
		},
		[info?.selectedEvent],
	);

	const components = useMemo(
		() => ({
			timeGutterHeader: CustomTimeGutterHeader,
			toolbar: (props) => (
				<CalendarHeader
					{...props}
					currentCalendarDate={currentCalendarDate}
					selectedDate={selectedDate}
					selectedWeek={selectedWeek}
					selectedMonth={selectedMonth}
					tenantsUserList={tenantsUserList}
					updateCalendarInfo={updateCalendarInfo}
					selectedWorkflowId={selectedWorkflowId}
					// userWorkSpaceList={userWorkSpaceList}
				/>
			),
			week: {
				event: CustomEventCard,
			},
			month: {
				header: () => null,
				event: MonthEventWrapper,
			},
			eventWrapper: CustomEventWrapper,
			// eventContainerWrapper: CustomEventContainer,
		}),
		[selectedDate, selectedWeek, currentCalendarDate, selectedWorkflowId, tenantsUserList],
	);

	const updateCalenderEventsList = useCallback(
		(eventId, updateBody = {}) => {
			const updatedEventsList = [...(info?.eventsList || [])];
			for (let i = 0; i < updatedEventsList?.length; i++) {
				if (updatedEventsList?.[i]?.id === eventId) {
					updatedEventsList[i] = { ...updatedEventsList[i], ...updateBody };
				}
			}
			setInfo((prev) => ({ ...prev, eventsList: updatedEventsList }));
		},
		[info?.eventsList],
	);

	const filterDeletedEvent = useCallback(
		(eventId) => {
			const filteredEventsList = info?.eventsList?.filter((event) => event?.id !== eventId);
			setInfo((prev) => ({ ...prev, eventsList: filteredEventsList }));
		},
		[info?.eventsList],
	);

	const onSelectSlot = useCallback((event) => {
		updateCalendarInfo('isCreateEventOpen', true);
		updateCalendarInfo('selectedDate', event?.start);
		updateCalendarInfo('selectedSlot', event?.start);
	}, []);

	const onClose = useCallback(() => {
		updateCalendarInfo('isEventSelected', false);
		setInfo((prev) => ({ ...prev, selectedEvent: null }));
	}, [info, updateCalendarInfo]);

	return (
		<>
			{/* UpdatedPageLoader has been removed to Eliminate the loader from the calendar view */}
			<div className="calendarViewParentContainer">
				<div className="scheduler">
					<CalendarWrapper
						// events={info?.eventsList || []}
						events={info?.categoryBasedEventsList || []}
						defaultView={'month'}
						views={['month', 'week', 'day']}
						toolbar={true}
						className="custom"
						selectable
						onSelectSlot={(event) => onSelectSlot(event)}
						onSelectEvent={(event) => handleSelectEvent(event)}
						date={selectedDate}
						popup
						components={components}
						allDayMaxRows={1}
						// showAllEvents={true}
					/>
				</div>
				<EventDetailsModal
					selectedEvent={info?.selectedEvent}
					isEventSelected={isEventSelected}
					updateCalendarInfo={updateCalendarInfo}
					handleSelectEvent={setInfo}
					categoryList={categoryList}
					updateCalenderEventsList={updateCalenderEventsList}
					filterDeletedEvent={filterDeletedEvent}
					onClose={onClose}
				/>
			</div>
		</>
	);
};

export default memo(CalendarView);
