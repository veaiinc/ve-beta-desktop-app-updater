import React, { memo, useMemo, useState, useContext, useEffect, useCallback } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
// import CalendarHeader from '../../components/calendar/CalendarHeader';
// import CalendarViewType from '../../components/calendar/CalendarViewType';

import '../../../assets/scss/calendar/calendarView.scss';
import CalendarWrapper from '../../components/calendar/CalendarWrapper';
import CalendarHeader from '../../components/calendar/CalendarHeader';
import CustomTimeGutterHeader from '../../components/calendar/CustomTimeGutterHeader';
import CustomEventCard from '../../components/calendar/CustomEventCard';
import CustomEventWrapper from '../../components/calendar/CustomEventWrapper';
// import CustomEventContainer from '../../components/calendar/CustomEventContainer';
import EventDetailsDrawer from '../../components/calendar/EventDetailsDrawer';
import MonthEventWrapper from '../../components/calendar/MonthEventWrapper';
import UpdatedPageLoader from '../../components/loaders/UpdatedPageLoader';
import Context from '../../../context/context';
import moment from 'moment';

const initialState = {
	eventsList: [],
	eventListError: null,
	isLoading: true,
	isEventCreated: false,
	updateEventsList: false,
};

const CalendarView = ({
	selectedWeek,
	selectedDate,
	isEventSelected,
	categoryList,
	selectedCategory,
	categoryFilter,
	updateCalendarInfo,
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
		handleSendEventToAi();
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
				end: moment(event?.endDateTime).local().toDate(), // Convert to local time
				title: event?.title,
				description: event?.description,
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
		if (calendarEvent) {
			console.log('calling handleSendEventToAi');
			await sendEventToAi({
				event_id: calendarEvent?._id,
			});
		}
	}, [calendarEvent]);

	const components = useMemo(
		() => ({
			timeGutterHeader: CustomTimeGutterHeader,
			toolbar: (props) => (
				<CalendarHeader
					{...props}
					selectedDate={selectedDate}
					selectedWeek={selectedWeek}
					// userWorkSpaceList={userWorkSpaceList}
					tenantsUserList={tenantsUserList}
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
		[selectedDate, selectedWeek, tenantsUserList],
	);
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
							onSelectSlot={() => updateCalendarInfo('isCreateEventOpen', true)}
							onSelectEvent={(event) => updateCalendarInfo('isEventSelected', true)}
							date={selectedDate} //for syncing with calendarSelector current date
							popup
							components={components}
						/>
					</div>
					<EventDetailsDrawer
						isEventSelected={isEventSelected}
						updateCalendarInfo={updateCalendarInfo}
					/>
				</div>
			)}
		</>
	);
};

export default memo(CalendarView);
