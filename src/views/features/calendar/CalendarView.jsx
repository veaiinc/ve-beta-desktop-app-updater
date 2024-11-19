import React, { memo } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarHeader from '../../components/calendar/CalendarHeader';
import CalendarViewType from '../../components/calendar/CalendarViewType';

const CalendarView = ({
	activeView,
	selectedWeek,
	selectedDate,
	getCurrentWeek,
	selectedMonth,
	selectedYear,
	updateCalendarInfo,
}) => {
	return (
		<div className="calendarViewParentContainer">
			<CalendarHeader
				activeView={activeView}
				selectedWeek={selectedWeek}
				selectedDate={selectedDate}
				getCurrentWeek={getCurrentWeek}
				updateCalendarInfo={updateCalendarInfo}
			/>
			<CalendarViewType
				activeView={activeView}
				selectedMonth={selectedMonth}
				selectedYear={selectedYear}
				updateCalendarInfo={updateCalendarInfo}
			/>
		</div>
	);
};

export default memo(CalendarView);
