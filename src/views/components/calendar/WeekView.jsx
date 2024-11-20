import React, { memo, useMemo, useState, useCallback } from 'react';
import '../../../assets/scss/calendar/weekView.scss';
import CalendarWrapper from './CalendarWrapper';
// import CalendarHeader from './CalendarHeader';
import CustomTimeGutterHeader from './CustomTimeGutterHeader';
import CustomEventCard from './CustomEventCard';
import CustomEventWrapper from './CustomEventWrapper';
// import CustomEventContainer from './CustomEventContainer';
import moment from 'moment';

const events = [
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

const WeekView = ({ selectedDate, updateCalendarInfo }) => {
	const components = useMemo(
		() => ({
			timeGutterHeader: CustomTimeGutterHeader,
			week: {
				event: CustomEventCard,
			},
			eventWrapper: CustomEventWrapper,
			// eventContainerWrapper: CustomEventContainer,
		}),
		[],
	);

	return (
		<div className="scheduler">
			<CalendarWrapper
				events={events}
				// view={'month'} //if pased defaultview will not work
				defaultView={'week'} //use active view state here to display views of calendar
				views={['month', 'week', 'day']}
				toolbar={false} //to hide inbuilt calendar header controls
				className="custom"
				selectable
				onSelectSlot={() => updateCalendarInfo('isCreateEventOpen', true)}
				onSelectEvent={(event) => alert(event.title)}
				// date={moment('2024-12-05').toDate()} //for syncing with calendarSelector current date
				date={selectedDate} //for syncing with calendarSelector current date
				popup //for monthview show +extra events
				components={components}
			/>
		</div>
	);
};

export default memo(WeekView);
