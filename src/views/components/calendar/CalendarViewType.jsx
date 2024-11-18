import React, { memo } from 'react';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
const CalendarViewType = ({ activeView, toggleCreateEvent }) => {
	const views = {
		Month: <MonthView />,
		Week: <WeekView toggleCreateEvent={toggleCreateEvent} />,
		Day: <DayView />,
	};
	return views[activeView] || '';
};

export default memo(CalendarViewType);
