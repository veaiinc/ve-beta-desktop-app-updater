import React, { memo, useState, useCallback } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarHeader from '../../components/calendar/CalendarHeader';
import CalendarViewType from '../../components/calendar/CalendarViewType';

const CalendarView = ({ activeView, selectedWeek, handleToggleView, getCurrentWeek }) => {
	return (
		<div className="calendarViewParentContainer">
			<CalendarHeader
				activeView={activeView}
				selectedWeek={selectedWeek}
				handleToggleView={handleToggleView}
				getCurrentWeek={getCurrentWeek}
			/>
			<CalendarViewType activeView={activeView} />
		</div>
	);
};

export default memo(CalendarView);
