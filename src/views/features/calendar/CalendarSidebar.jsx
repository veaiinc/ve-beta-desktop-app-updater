import { memo, useState, useCallback, useEffect, useContext } from 'react';
import '../../../assets/scss/calendar/calendar.scss';
import CalendarSelector from '../../components/calendar/CalendarSelector';
import CalendarCategories from '../../components/calendar/CalendarCategories';
import CalendarAiChat from '../../components/calendar/CalendarAiChat';
import GoogleCalendar from '../../components/calendar/GoogleCalendar';
import moment from 'moment';
import SessionCard from '../../components/calendar/SessionCard.jsx';
import Context from '../../../context/context.js';
import GoogleCalendarIcon from '../../../assets/svg/Settings/google-calendar-logo.png';

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
	showGoogleEvents,
}) => {
	const {
		templates: { connectedThirdParties, getConnectedThirdParties },
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

	const currentDate = moment();
	const formattedDate = currentDate.format('ddd, MMM D');

	useEffect(() => {
		if (!connectedThirdParties) getConnectedThirdParties();
	}, []);

	const connectedEmailWithGoogleCalendar =
		connectedThirdParties?.data?.find(
			(appInfo) => appInfo.app === 'google-calendar' && appInfo.isActive === true,
		)?.email ?? null;

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
						{connectedEmailWithGoogleCalendar ? (
							<div className="connectedEmail">
								<img width={24} src={GoogleCalendarIcon} />
								<p>
									<span>{connectedEmailWithGoogleCalendar}</span>
									<br />
									<span>Connected to Google Calendar </span>
								</p>
							</div>
						) : (
							<GoogleCalendar
								connectedCalendars={connectedCalendars}
								selectedCalendar={selectedCalendar}
								updateCalendarInfo={updateCalendarInfo}
								showGoogleEvents={showGoogleEvents}
							/>
						)}
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
