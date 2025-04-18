import React, { memo, useState, useCallback } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarSelector from '../../components/calendar/CalendarSelector';
import CalendarCategories from '../../components/calendar/CalendarCategories';
import MeetingDetails from '../../components/calendar/MeetingDetails';
import CalendarAiChat from '../../components/calendar/CalendarAiChat';
import CreateEvent from '../../components/calendar/CreateEvent';
// import AskAI from '../../components/calendar/AskAI';
import GoogleCalendar from '../../components/calendar/GoogleCalendar';
import CalendarChatBox from '../../components/calendar/CalendarChatBox';
import moment from 'moment';
import ConnectIntegrationWidget from '../../components/globalComponents/ConnectIntegrationWidget.jsx';

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

	const currentDate = moment();
	const formattedDate = currentDate.format('ddd, MMM D');

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
					<div className="dateDisplay">{formattedDate}</div>
					<CalendarSelector
						currentCalendarDate={currentCalendarDate}
						selectedMonth={selectedMonth}
						selectedYear={selectedYear}
						selectedDate={selectedDate}
						updateCalendarInfo={updateCalendarInfo}
					/>
					{/* <AskAI toggleAskAi={toggleAskAi} /> */}
					<CalendarCategories
						categoryList={categoryList}
						selectedCategory={selectedCategory}
						categoryFilter={categoryFilter}
						updateCalendarInfo={updateCalendarInfo}
					/>
					<GoogleCalendar />
					{/* <MeetingDetails selectedDate={selectedDate} /> */}
				</div>
			)}
		</>
	);
};

export default memo(CalendarSidebar);
