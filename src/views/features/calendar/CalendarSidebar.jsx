import React, { memo, useState, useCallback, useContext, useEffect } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import Context from '../../../context/context';
import CalendarSelector from '../../components/calendar/CalendarSelector';
import AskAI from '../../components/calendar/AskAI';
import CalendarCategories from '../../components/calendar/CalendarCategories';
import MeetingDetails from '../../components/calendar/MeetingDetails';
import CalendarAiChat from '../../components/calendar/CalendarAiChat';
import CreateEvent from '../../components/calendar/CreateEvent';

const CalendarSidebar = ({
	currentCalendarDate,
	selectedMonth,
	selectedYear,
	selectedDate,
	isCreateEventOpen,
	updateCalendarInfo,
}) => {
	const {
		calendarInfo: { calendarChat, getCalendarChat },
	} = useContext(Context);

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
			) : isCreateEventOpen ? (
				<CreateEvent updateCalendarInfo={updateCalendarInfo} />
			) : (
				<div className="calendarSidebarContainer">
					<CalendarSelector
						currentCalendarDate={currentCalendarDate}
						selectedMonth={selectedMonth}
						selectedYear={selectedYear}
						selectedDate={selectedDate}
						updateCalendarInfo={updateCalendarInfo}
					/>
					<AskAI toggleAskAi={toggleAskAi} />
					<CalendarCategories />
					<MeetingDetails />
				</div>
			)}
		</>
	);
};

export default memo(CalendarSidebar);
