import React, { memo } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarSelector from '../../components/calendar/CalendarSelector';
import AskAI from '../../components/calendar/AskAI';
import CalendarCategories from '../../components/calendar/CalendarCategories';
import MeetingDetails from '../../components/calendar/MeetingDetails';

const CalendarSidebar = () => {
	return (
		<div className="calendarSidebarContainer">
			<CalendarSelector />
			<AskAI />
			<CalendarCategories />
			<MeetingDetails />
		</div>
	);
};

export default memo(CalendarSidebar);
