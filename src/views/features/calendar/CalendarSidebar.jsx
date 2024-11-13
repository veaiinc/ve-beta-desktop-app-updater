import React, { memo, useState, useCallback } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarSelector from '../../components/calendar/CalendarSelector';
import AskAI from '../../components/calendar/AskAI';
import CalendarCategories from '../../components/calendar/CalendarCategories';
import MeetingDetails from '../../components/calendar/MeetingDetails';
import CalendarAiChat from '../../components/calendar/CalendarAiChat';

const CalendarSidebar = () => {
	const [info, setInfo] = useState({
		askAi: false,
	});

	const toggleAskAi = useCallback(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			askAi: !prevInfo.askAi,
		}));
	}, []);
	return (
		<>
			{info?.askAi ? (
				<CalendarAiChat toggleAskAi={toggleAskAi} />
			) : (
				<div className="calendarSidebarContainer">
					<CalendarSelector />
					<AskAI toggleAskAi={toggleAskAi} />
					<CalendarCategories />
					<MeetingDetails />
				</div>
			)}
		</>
	);
};

export default memo(CalendarSidebar);
