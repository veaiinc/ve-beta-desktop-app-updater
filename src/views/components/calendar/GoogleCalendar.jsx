import { memo, useState, useCallback, useEffect, useContext } from 'react';
import '../../../assets/scss/calendar/googleCalendar.scss';
import Context from '../../../context/context';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';
import Spinner from '../loaders/Spinner';
import { message } from 'antd';

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

			getGoogleCalendarEvents,
			googleCalendarEvents,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		expanded: false,
		loading: false,
		selectedCalendar: null,
		watchLoading: false,
		eventsLoading: false,
		alreadyConnectedGoogleCalendars: [],
		watchRequested: false,
	});

	// Auto expand when there are items to display
	useEffect(() => {
		const hasItems =
			info.alreadyConnectedGoogleCalendars?.length > 0 || googleCalendarList?.length > 0;
		if (hasItems && !info.expanded) {
			setInfo((prev) => ({ ...prev, expanded: true }));
		}
	}, [info.alreadyConnectedGoogleCalendars, googleCalendarList]);

	// New useEffect to handle watch response
	useEffect(() => {
		const handleWatchResponse = async () => {
			// Only proceed if we've requested a watch and have a response
			if (info.watchRequested && info.selectedCalendar) {
				if (googleCalendarWatch?.id) {
					// Watch was successful, proceed to fetch events
					setInfo((prev) => ({
						...prev,
						watchLoading: false,
						eventsLoading: true,
					}));

					try {
						await getGoogleCalendarEvents();
					} catch (error) {
						console.error('Error fetching calendar events:', error);
						message.error('Failed to fetch calendar events. Please try again.');
					} finally {
						setInfo((prev) => ({
							...prev,
							eventsLoading: false,
							watchRequested: false, // Reset the watch requested flag
						}));
					}
				} else if (googleCalendarWatch === null && !info.watchLoading) {
					// Watch operation failed but didn't throw an error
					console.error('Failed to watch Google Calendar');
					message.error('Failed to watch Google Calendar. Please try again.');
					setInfo((prev) => ({
						...prev,
						watchLoading: false,
						watchRequested: false, // Reset the watch requested flag
					}));
				}
				// If watchLoading is still true, we're waiting for the API response
			}
		};

		handleWatchResponse();
	}, [googleCalendarWatch, info.watchRequested, info.selectedCalendar]);

	useEffect(() => {
		getConnectedThirdParties();
	}, []);

	useEffect(() => {
		if (connectThirdParties?.googleCalendar?.[0]) {
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
					await getGoogleCalendarEvents();
				} finally {
					setInfo((prev) => ({ ...prev, eventsLoading: false }));
				}
			}
		};

		if (connectedGoogleCalendars !== undefined) {
			fetchCalendarList();
		}
	}, [connectedGoogleCalendars]);

	const handleCalendarSelect = async (calendar) => {
		setInfo((prev) => ({
			...prev,
			selectedCalendar: calendar.id,
			watchLoading: true,
			watchRequested: true,
		}));

		try {
			// Call watchGoogleCalendar and let the useEffect handle the response
			await watchGoogleCalendar(calendar.id);
		} catch (error) {
			// Handle API call errors
			console.error('Error in calendar selection process:', error);
			message.error('Failed to watch the selected Google Calendar. Please try again.');
			setInfo((prev) => ({
				...prev,
				watchLoading: false,
				watchRequested: false,
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
