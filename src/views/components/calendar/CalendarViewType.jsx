import React, { memo } from 'react';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
const CalendarViewType = ({
	activeView,
	selectedDate,
	selectedMonth,
	selectedYear,
	isEventSelected,
	updateCalendarInfo,
}) => {
	const views = {
		Month: <MonthView selectedMonth={selectedMonth} selectedYear={selectedYear} />,
		Week: (
			<WeekView
				selectedDate={selectedDate}
				isEventSelected={isEventSelected}
				updateCalendarInfo={updateCalendarInfo}
			/>
		),
		Day: <DayView />,
	};
	return views[activeView] || '';
};

export default memo(CalendarViewType);
