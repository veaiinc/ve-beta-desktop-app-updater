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
	isEventSelected,
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
				selectedDate={selectedDate}
				selectedMonth={selectedMonth}
				selectedYear={selectedYear}
				isEventSelected={isEventSelected}
				updateCalendarInfo={updateCalendarInfo}
			/>
		</div>
	);
};

export default memo(CalendarView);
