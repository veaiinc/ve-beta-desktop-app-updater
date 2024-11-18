import React, { memo, useState, useCallback } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
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
	handlecurrentCalendarDateChange,
	handleMonthChange,
	handleYearChange,
	handelSelectedDate,
	isCreateEventOpen,
	toggleCreateEvent,
}) => {
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
				<CreateEvent toggleCreateEvent={toggleCreateEvent} />
			) : (
				<div className="calendarSidebarContainer">
					<CalendarSelector
						currentCalendarDate={currentCalendarDate}
						selectedMonth={selectedMonth}
						selectedYear={selectedYear}
						selectedDate={selectedDate}
						handlecurrentCalendarDateChange={handlecurrentCalendarDateChange}
						handleMonthChange={handleMonthChange}
						handleYearChange={handleYearChange}
						handelSelectedDate={handelSelectedDate}
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
