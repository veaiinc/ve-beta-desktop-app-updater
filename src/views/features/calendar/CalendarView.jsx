import React, { memo, useMemo } from 'react';
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
import moment from 'moment';
import MonthEventWrapper from '../../components/calendar/MonthEventWrapper';

const events = [
	{
		title: 'Long Event',
		start: new Date(2024, 10, 15),
		end: new Date(2024, 10, 17),
	},
	{
		title: 'Long Event',
		start: new Date(2024, 10, 15),
		end: new Date(2024, 10, 17),
	},
	{
		title: 'Long Event',
		start: new Date(2024, 10, 15),
		end: new Date(2024, 10, 17),
	},
	{
		title: 'Long Event',
		start: new Date(2024, 10, 15),
		end: new Date(2024, 10, 17),
	},
	{
		title: 'Long Event',
		start: new Date(2024, 10, 15),
		end: new Date(2024, 10, 17),
	},
	{
		title: 'Long Event',
		start: new Date(2024, 10, 15),
		end: new Date(2024, 10, 17),
	},
	{
		title: 'Long Event',
		start: new Date(2024, 10, 15),
		end: new Date(2024, 10, 17),
	},
	{
		title: 'Long Event',
		start: new Date(2024, 10, 15),
		end: new Date(2024, 10, 17),
	},
	{
		title: 'Long Event',
		start: new Date(2024, 10, 15),
		end: new Date(2024, 10, 17),
	},
	{
		start: moment('2015-04-11').toDate(),
		end: moment('2015-04-13').toDate(),
		title: 'Conference',
		description: 'Big conference for important people',
		categories: ['Conference', 'Business'],
	},

	{
		start: moment('2024-11-18T03:00:00').toDate(),
		end: moment('2024-11-18T07:00:00').toDate(),
		title: 'MRI Registration ',
		description: 'Register for the MRI scan. Ensure all paperwork is complete.',
		categories: ['Medical', 'Appointment'],
	},
	{
		start: moment('2024-11-19T09:00:00').toDate(),
		end: moment('2024-11-19T10:30:00').toDate(),
		title: 'Team Meeting',
		description: 'Discuss project updates and next sprint planning.',
		categories: ['Work', 'Meeting'],
	},
	{
		start: moment('2024-11-20T14:00:00').toDate(),
		end: moment('2024-11-20T15:00:00').toDate(),
		title: 'Dentist Appointment',
		description: 'Routine dental check-up and cleaning.',
		categories: ['Personal', 'Health'],
	},
	{
		start: moment('2024-11-21T18:00:00').toDate(),
		end: moment('2024-11-21T19:30:00').toDate(),
		title: 'Yoga Class',
		description: 'Evening yoga session for stress relief and flexibility.',
		categories: ['Fitness', 'Personal'],
	},
	{
		start: moment('2024-11-22T08:30:00').toDate(),
		end: moment('2024-11-22T09:30:00').toDate(),
		title: 'Breakfast with Clients',
		description: 'Meet clients to discuss upcoming collaboration opportunities.',
		categories: ['Business', 'Networking'],
	},
];

const CalendarView = ({ selectedWeek, selectedDate, isEventSelected, updateCalendarInfo }) => {
	const components = useMemo(
		() => ({
			timeGutterHeader: CustomTimeGutterHeader,
			toolbar: (props) => (
				<CalendarHeader
					{...props}
					selectedDate={selectedDate}
					selectedWeek={selectedWeek}
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
		[selectedDate, selectedWeek, events],
	);
	return (
		<div className="calendarViewParentContainer">
			<div className="scheduler">
				<CalendarWrapper
					events={events}
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
	);
};

export default memo(CalendarView);
