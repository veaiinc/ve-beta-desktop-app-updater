import React, { memo } from 'react';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
const CalendarViewType = ({ activeView, selectedMonth, selectedYear, updateCalendarInfo }) => {
	const views = {
		Month: <MonthView selectedMonth={selectedMonth} selectedYear={selectedYear} />,
		Week: <WeekView updateCalendarInfo={updateCalendarInfo} />,
		Day: <DayView />,
	};
	return views[activeView] || '';
};

export default memo(CalendarViewType);
