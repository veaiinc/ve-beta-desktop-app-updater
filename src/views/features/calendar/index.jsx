import React, { memo } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarSidebar from './CalendarSidebar';
import CalendarView from './CalendarView';

const Calendar = () => {
	return (
		<div className="calendarParentContainer">
			<CalendarSidebar />
			<CalendarView />
		</div>
	);
};

export default memo(Calendar);
