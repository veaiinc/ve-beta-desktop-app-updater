import { memo, useState, useCallback } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarSelector from '../../components/calendar/CalendarSelector';
import CalendarCategories from '../../components/calendar/CalendarCategories';
import CalendarAiChat from '../../components/calendar/CalendarAiChat';
import GoogleCalendar from '../../components/calendar/GoogleCalendar';
import moment from 'moment';
import SessionCard from '../../components/calendar/SessionCard.jsx';

const CalendarSidebar = ({
	currentCalendarDate,
	selectedMonth,
	selectedYear,
	selectedDate,
	categoryList,
	selectedCategory,
	categoryFilter,
	updateCalendarInfo,
	schedulerList,
	selectedSession,
	sessionFilter,
	connectedCalendars,
	selectedCalendar,
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
			) : (
				<div className="calendarSidebarContainer">
					<div className="dateDisplay">{formattedDate}</div>
					<div className="calendarSidebarContent">
						<CalendarSelector
							currentCalendarDate={currentCalendarDate}
							selectedMonth={selectedMonth}
							selectedYear={selectedYear}
							selectedDate={selectedDate}
							updateCalendarInfo={updateCalendarInfo}
						/>
						<CalendarCategories
							categoryList={categoryList}
							selectedCategory={selectedCategory}
							categoryFilter={categoryFilter}
							updateCalendarInfo={updateCalendarInfo}
						/>
						<GoogleCalendar
							connectedCalendars={connectedCalendars}
							selectedCalendar={selectedCalendar}
							updateCalendarInfo={updateCalendarInfo}
						/>
						<SessionCard
							schedulerList={schedulerList}
							selectedSession={selectedSession}
							sessionFilter={sessionFilter}
							updateCalendarInfo={updateCalendarInfo}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default memo(CalendarSidebar);
