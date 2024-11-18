import React, { memo } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarHeader from '../../components/calendar/CalendarHeader';
import CalendarViewType from '../../components/calendar/CalendarViewType';

const CalendarView = ({
	activeView,
	selectedWeek,
	selectedDate,
	handleToggleView,
	getCurrentWeek,
	toggleCreateEvent,
}) => {
	return (
		<div className="calendarViewParentContainer">
			<CalendarHeader
				activeView={activeView}
				selectedWeek={selectedWeek}
				selectedDate={selectedDate}
				handleToggleView={handleToggleView}
				getCurrentWeek={getCurrentWeek}
			/>
			<CalendarViewType activeView={activeView} toggleCreateEvent={toggleCreateEvent} />
		</div>
	);
};

export default memo(CalendarView);
