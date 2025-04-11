import { memo, useState, useCallback, useEffect, useContext } from 'react';
import '../../../assets/scss/calendar/googleCalendar.scss';
import Context from '../../../context/context';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';
import { ReactComponent as Setting } from '../../../assets/svg/ai_agents/settings.svg';
import ConnectCalendarModal from '../modalsV2/calendar/ConnectCalendarModal';
import Spinner from '../loaders/Spinner';

const GoogleCalendar = () => {
	const {
		templates: { getConnectedThirdParties, connectThirdParties },
		calendarInfo: {
			getConnectedGoogleCalendars,
			connectedGoogleCalendars,

			getGoogleCalendarList,
			googleCalendarList,

			watchGoogleCalendar,
			googleCalendarWatch,

			getGoogleCalendarEventsList,
			googleCalendarEventList,
		},
	} = useContext(Context);

	//Do not remove this comment

	// 	Condition A = if connectedGoogleCalendars is empty array, that means Watch is not implemented for any google calendar.
	// 1. Call List of Google Calendars API ==> show the list of available google calendars.
	// 2. once a calendar is selected ==> call the Watch API with the selected calendar id.
	// 3. once Watch API is called successfully, call the Get Google Calendar Events API to get the google calendar events.

	// Condition B = if connectedGoogleCalendars is array with values, that means Watch is implemented for at least one google calendar.
	// 1. Call Get Google Calendar Events API to get the google calendar events directly.

	const [info, setInfo] = useState({
		expanded: false,
		loading: false,
		selectedCalendar: null,
		watchLoading: false,
		eventsLoading: false,
		alreadyConnectedGoogleCalendars: [],
	});

	// Auto expand when there are items to display
	useEffect(() => {
		const hasItems =
			info.alreadyConnectedGoogleCalendars?.length > 0 || googleCalendarList?.length > 0;
		if (hasItems && !info.expanded) {
			setInfo((prev) => ({ ...prev, expanded: true }));
		}
	}, [info.alreadyConnectedGoogleCalendars, googleCalendarList]);

	useEffect(() => {
		console.log('getConnectedThirdParties fetching==>');
		getConnectedThirdParties();
	}, []);

	useEffect(() => {
		if (connectThirdParties?.googleCalendar?.[0]) {
			console.log('Connected Calendars fetching==>');
			getConnectedGoogleCalendars();
		}
	}, [connectThirdParties]);

	useEffect(() => {
		const fetchCalendarList = async () => {
			if (connectedGoogleCalendars?.length === 0) {
				setInfo((prev) => ({ ...prev, loading: true }));
				try {
					await getGoogleCalendarList();
				} finally {
					setInfo((prev) => ({ ...prev, loading: false }));
				}
			} else {
				// If calendars are already connected, set the alreadyConnectedGoogleCalendars to the connectedGoogleCalendars and fetch events directly
				setInfo((prev) => ({
					...prev,
					alreadyConnectedGoogleCalendars: connectedGoogleCalendars,
					eventsLoading: true,
				}));
				try {
					await getGoogleCalendarEventsList();
				} finally {
					setInfo((prev) => ({ ...prev, eventsLoading: false }));
				}
			}
		};

		if (connectedGoogleCalendars !== undefined) {
			fetchCalendarList();
		}
	}, [connectedGoogleCalendars]);

	useEffect(() => {
		if (googleCalendarEventList) {
			console.log('Calendar Events:', googleCalendarEventList);
		}
	}, [googleCalendarEventList]);

	const handleCalendarSelect = async (calendar) => {
		setInfo((prev) => ({
			...prev,
			selectedCalendar: calendar.id,
			watchLoading: true,
		}));

		try {
			await watchGoogleCalendar(calendar.id);

			// After successful watch, fetch events
			setInfo((prev) => ({
				...prev,
				watchLoading: false,
				eventsLoading: true,
			}));

			await getGoogleCalendarEventsList();
		} finally {
			setInfo((prev) => ({
				...prev,
				watchLoading: false,
				eventsLoading: false,
			}));
		}
	};

	const toggleExpand = useCallback(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			expanded: !prevInfo?.expanded,
		}));
	}, []);

	return (
		<>
			<div className={`google-bar ${info?.expanded ? 'expanded' : ''}`}>
				<div className="header">
					<div className="google-logo">Google Calendar</div>
					<div className="controls">
						<Setting className="settings-icon" />
						<span className="expand-icon" onClick={toggleExpand}>
							<DownSvg />
						</span>
					</div>
				</div>
				<div className="content">
					{info.loading ? (
						<div className="loading-container">
							<Spinner width="24px" height="24px" />
							<span>Loading calendars...</span>
						</div>
					) : info.watchLoading ? (
						<div className="loading-container">
							<Spinner width="24px" height="24px" />
							<span>Connecting Google Calendar...</span>
						</div>
					) : info.eventsLoading ? (
						<div className="loading-container">
							<Spinner width="24px" height="24px" />
							<span>Fetching calendar events...</span>
						</div>
					) : info.alreadyConnectedGoogleCalendars?.length > 0 ? (
						info.alreadyConnectedGoogleCalendars?.map((calendarId) => (
							<div key={calendarId} className="connected-calendar">
								<div className="green-dot"></div>
								<span className="calendar-name">{calendarId}</span>
							</div>
						))
					) : googleCalendarList && !info.selectedCalendar ? (
						<>
							<div className="calendar-list-header">Select Calendar to Connect</div>
							{googleCalendarList?.map((calendar) => (
								<div
									key={calendar.id}
									className="item"
									onClick={() => handleCalendarSelect(calendar)}
								>
									<div className="item-left">
										<div
											className="circle"
											style={{
												backgroundColor: calendar.backgroundColor,
												borderColor: calendar.backgroundColor,
											}}
										/>
										<span className="calendar-name">{calendar.summary}</span>
									</div>
								</div>
							))}
						</>
					) : (
						info.selectedCalendar && (
							<div className="selected-calendar">
								{
									googleCalendarList?.find(
										(cal) => cal.id === info.selectedCalendar,
									)?.summary
								}
							</div>
						)
					)}
				</div>
			</div>
		</>
	);
};

export default memo(GoogleCalendar);
