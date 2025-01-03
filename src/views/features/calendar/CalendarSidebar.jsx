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
	isCreateEventOpen,
	categoryList,
	selectedCategory,
	categoryFilter,
	selectedSlot,
	updateCalendarInfo,
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
				<CalendarAiChat toggleAskAi={toggleAskAi} selectedDate={selectedDate} />
			) : isCreateEventOpen ? (
				<CreateEvent
					categoryList={categoryList}
					selectedCategory={selectedCategory}
					selectedSlot={selectedSlot}
					updateCalendarInfo={updateCalendarInfo}
				/>
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
					<CalendarCategories
						categoryList={categoryList}
						selectedCategory={selectedCategory}
						categoryFilter={categoryFilter}
						updateCalendarInfo={updateCalendarInfo}
					/>
					<MeetingDetails selectedDate={selectedDate} />
				</div>
			)}
		</>
	);
};

export default memo(CalendarSidebar);
