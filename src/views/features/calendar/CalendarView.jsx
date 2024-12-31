import React, { memo, useMemo, useState, useContext, useEffect, useCallback } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import '../../../assets/scss/calendar/calendarView.scss';
import CalendarWrapper from '../../components/calendar/CalendarWrapper';
import CalendarHeader from '../../components/calendar/CalendarHeader';
import CustomTimeGutterHeader from '../../components/calendar/CustomTimeGutterHeader';
import CustomEventCard from '../../components/calendar/CustomEventCard';
import CustomEventWrapper from '../../components/calendar/CustomEventWrapper';
// import CustomEventContainer from '../../components/calendar/CustomEventContainer';
import MonthEventWrapper from '../../components/calendar/MonthEventWrapper';
import UpdatedPageLoader from '../../components/loaders/UpdatedPageLoader';
import Context from '../../../context/context';
import moment from 'moment';
// import EventDetailsDrawer from '../../components/calendar/EventDetailsDrawer';
import EventDetailsModal from '../../components/modalsV2/calendar/EventDetailsModal';

const initialState = {
	eventsList: [],
	eventListError: null,
	isLoading: true,
	isEventCreated: false,
	updateEventsList: false,
	selectedEvent: null,
};

const CalendarView = ({
	currentCalendarDate,
	selectedWeek,
	selectedDate,
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
		fetchEventsList();
		if (calendarEvent?._id) {
			handleSendEventToAi();
		}
	}, [calendarEvent]);

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
				start: moment(event?.startDateTime).local().toDate(), // Convert to local time
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

	const fetchEventsList = useCallback(async () => {
		setInfo((prevInfo) => ({ ...prevInfo, isLoading: true, eventListError: null }));
		await getCalendarEventsList();
	}, []);

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
		updateCalendarInfo('selectedSlot', event?.start);
	}, []);

	const onClose = useCallback(() => {
		updateCalendarInfo('isEventSelected', false);
		setInfo((prev) => ({ ...prev, selectedEvent: null }));
	}, [info, updateCalendarInfo]);

	return (
		<>
			{info?.isLoading ? (
				<UpdatedPageLoader />
			) : (
				<div className="calendarViewParentContainer">
					<div className="scheduler">
						<CalendarWrapper
							events={info?.eventsList || []}
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
						/>
					</div>
					{/* <EventDetailsDrawer
						selectedEvent={info?.selectedEvent}
						isEventSelected={isEventSelected}
						updateCalendarInfo={updateCalendarInfo}
					/> */}
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
			)}
		</>
	);
};

export default memo(CalendarView);
