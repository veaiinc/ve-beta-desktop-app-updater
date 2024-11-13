import React, { memo } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarHeader from '../../components/calendar/CalendarHeader';

const CalendarView = () => {
	return (
		<div className="calendarViewParentContainer">
			<CalendarHeader />
		</div>
	);
};

export default memo(CalendarView);
