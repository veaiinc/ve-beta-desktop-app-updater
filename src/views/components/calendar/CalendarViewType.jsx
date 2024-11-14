import React, { memo } from 'react';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
const CalendarViewType = ({ activeView }) => {
	const views = {
		Month: <MonthView />,
		Week: <WeekView />,
		Day: <DayView />,
	};
	return views[activeView] || '';
};

export default memo(CalendarViewType);
