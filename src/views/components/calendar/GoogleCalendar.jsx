import { memo, useState, useCallback, useEffect, useContext } from 'react';
import '../../../assets/scss/calendar/googleCalendar.scss';
import Context from '../../../context/context';
import { ReactComponent as DownSvg } from '../../../assets/svg/calendar/down.svg';
import { ReactComponent as PencilSvg } from '../../../assets/svg/calendar/pencil.svg';
import { ReactComponent as SettingsSvg } from '../../../assets/svg/calendar/settings.svg';
import PlusSvg from '../../../assets/svg/my_templates/PlusSvg';
import Spinner from '../loaders/Spinner';
import { message } from '../../components/globalComponents/CustomToast';
import ConnectIntegrationWidget from '../globalComponents/ConnectIntegrationWidget';
import GoogleCalendarSettings from './GoogleCalenderSettings';

const GoogleCalendar = ({ showGoogleEvents, updateCalendarInfo }) => {
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
			deleteCalendarEvent,
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
		selectedCalendars: [],
		showSettings: false,
		showConnectWidget: false,
		deletingEvent: false,
	});

	// Auto expand when there are items to display
	useEffect(() => {
		const hasItems =
			info?.alreadyConnectedGoogleCalendars?.length > 0 || googleCalendarList?.length > 0;
		if (hasItems && !info?.expanded) {
			setInfo((prev) => ({ ...prev, expanded: true }));
		}
	}, [info?.alreadyConnectedGoogleCalendars, googleCalendarList]);

	useEffect(() => {
		const fetchCalendarList = async () => {
			if (connectedGoogleCalendars?.length === 0) {
				setInfo((prev) => ({ ...prev, loading: true }));
				try {
					await getGoogleCalendarList();
				} finally {
					setInfo((prev) => ({ ...prev, loading: false }));
				}
			} else if (!googleCalendarEvents?.length) {
				// Only fetch events if we don't have them already
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
			} else {
				// If we already have events, just update the connected calendars
				setInfo((prev) => ({
					...prev,
					alreadyConnectedGoogleCalendars: connectedGoogleCalendars,
				}));
			}
		};

		if (connectedGoogleCalendars !== undefined) {
			fetchCalendarList();
		}
	}, [connectedGoogleCalendars]);

	// New useEffect to handle watch response
	useEffect(() => {
		const handleWatchResponse = async () => {
			if (info?.watchRequested && info?.selectedCalendar) {
				try {
					if (googleCalendarWatch?.id) {
						setInfo((prev) => ({
							...prev,
							watchLoading: false,
							eventsLoading: !googleCalendarEvents?.length,
						}));

						if (!googleCalendarEvents?.length) {
							try {
								await getGoogleCalendarEvents();
							} catch (error) {
								message.error('Failed to fetch calendar events. Please try again.');
								setTimeout(async () => {
									try {
										await getGoogleCalendarEvents();
									} catch (retryError) {
										message.error(
											'Failed to fetch events after retry. Please refresh the page.',
										);
									}
								}, 5000);
							}
						}
					} else if (googleCalendarWatch === null && !info?.watchLoading) {
						message.error('Failed to watch Google Calendar. Please try again.');

						setTimeout(async () => {
							try {
								await watchGoogleCalendar(info?.selectedCalendar);
							} catch (retryError) {
								message.error(
									'Failed to watch calendar after retry. Please refresh the page.',
								);
							}
						}, 5000);
					}
				} catch (error) {
					message.error(
						'An error occurred while processing the calendar watch. Please try again.',
					);
				} finally {
					setInfo((prev) => ({
						...prev,
						watchLoading: false,
						watchRequested: false,
					}));
				}
			}
		};

		handleWatchResponse();
	}, [googleCalendarWatch, info?.watchRequested, info?.selectedCalendar]);

	useEffect(() => {
		if (!connectThirdParties) {
			getConnectedThirdParties();
		}
	}, []);

	useEffect(() => {
		if (connectThirdParties?.googleCalendar?.[0] && !connectedGoogleCalendars?.length) {
			getConnectedGoogleCalendars();
		}
	}, [connectThirdParties]);

	const handleCheckboxChange = useCallback(() => {
		updateCalendarInfo('showGoogleEvents', !showGoogleEvents);
	}, [showGoogleEvents, updateCalendarInfo]);

	const toggleExpand = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			expanded: !prev.expanded,
		}));
	}, []);

	const toggleSettings = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			showSettings: !prev.showSettings,
		}));
	}, []);

	const handleConnectAnother = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			showConnectWidget: true,
		}));
	}, []);

	const handleConnectSuccess = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			showConnectWidget: false,
		}));
		// Refresh the connected calendars list
		getConnectedGoogleCalendars();
	}, [getConnectedGoogleCalendars]);

	const handleDeleteEvent = useCallback(
		async (eventId) => {
			if (!eventId) {
				message.error('Invalid event ID');
				return;
			}

			setInfo((prev) => ({ ...prev, deletingEvent: true }));
			try {
				await deleteCalendarEvent(eventId);
				message.success('Event deleted successfully');
				// Refresh the events list
				await getGoogleCalendarEvents();
				// Update the calendar view to reflect the deletion
				updateCalendarInfo('updateEventsList', true);
			} catch (error) {
				message.error('Failed to delete event. Please try again.');
				console.error('Error deleting event:', error);
			} finally {
				setInfo((prev) => ({ ...prev, deletingEvent: false }));
			}
		},
		[deleteCalendarEvent, getGoogleCalendarEvents, updateCalendarInfo],
	);

	return (
		<>
			{connectThirdParties != null && connectThirdParties?.googleCalendar?.length > 0 ? (
				<div className={`google-bar ${info?.expanded ? 'expanded' : ''}`}>
					<div className="header">
						<div className="google-logo">Google Calendar</div>
						<div className="controls">
							{/* <div className="addCategoryButton" onClick={toggleSettings}>
								<SettingsSvg />
							</div> */}
							<div className="expandIcon" onClick={toggleExpand}>
								<DownSvg />
							</div>
						</div>
					</div>
					<div className="content">
						{info?.loading ? (
							<div className="loading-container">
								<Spinner width="24px" height="24px" />
								<span>Loading calendars...</span>
							</div>
						) : info?.watchLoading ? (
							<div className="loading-container">
								<Spinner width="24px" height="24px" />
								<span>Connecting Google Calendar...</span>
							</div>
						) : info?.eventsLoading ? (
							<div className="loading-container">
								<Spinner width="24px" height="24px" />
								<span>Fetching calendar events...</span>
							</div>
						) : info?.alreadyConnectedGoogleCalendars?.length > 0 ? (
							<div className="categoriesContainer">
								{info?.alreadyConnectedGoogleCalendars?.map((calendarId) => (
									<div key={calendarId} className="categoryTypeContainer">
										<div className="typeWrapper">
											<span className="statusIndicator"></span>
											<label
												htmlFor={`${calendarId}-checkbox`}
												className="typeLabel"
											>
												{calendarId}
											</label>
											<input
												type="checkbox"
												className="checkBox"
												id={`${calendarId}-checkbox`}
												checked={showGoogleEvents}
												onChange={handleCheckboxChange}
												aria-checked={showGoogleEvents}
												aria-label={`${calendarId} calendar`}
											/>
										</div>
									</div>
								))}
								<div
									className="categoryTypeContainer connect-another-account"
									onClick={handleConnectAnother}
								>
									<div className="typeWrapper">
										<PlusSvg />
										<span>Connect Another Account</span>
									</div>
								</div>
							</div>
						) : googleCalendarList && !info?.selectedCalendar ? (
							<div className="categoriesContainer">
								{googleCalendarList?.map((calendar) => (
									<div key={calendar.id} className="categoryTypeContainer">
										<div className="typeWrapper">
											<span
												className="statusIndicator"
												style={{
													backgroundColor: calendar.backgroundColor,
												}}
											></span>
											<label
												htmlFor={`${calendar.id}-checkbox`}
												className="typeLabel"
											>
												{calendar.summary}
											</label>
											<input
												type="checkbox"
												className="checkBox"
												id={`${calendar.id}-checkbox`}
												checked={showGoogleEvents}
												onChange={(e) => {
													e.stopPropagation();
													handleCheckboxChange();
												}}
												aria-checked={showGoogleEvents}
												aria-label={`${calendar.summary} calendar`}
											/>
										</div>
									</div>
								))}
								<div
									className="categoryTypeContainer connect-another-account"
									onClick={handleConnectAnother}
								>
									<div className="typeWrapper">
										<PlusSvg />
										<span>Connect Another Account</span>
									</div>
								</div>
							</div>
						) : (
							info?.selectedCalendar && (
								<div className="selected-calendar">
									{
										googleCalendarList?.find(
											(cal) => cal?.id === info?.selectedCalendar,
										)?.summary
									}
								</div>
							)
						)}
					</div>
				</div>
			) : (
				<ConnectIntegrationWidget
					integrationType="google-calendar"
					buttonText="Connect"
					onSuccess={handleConnectSuccess}
				/>
			)}
			{info.showConnectWidget && (
				<ConnectIntegrationWidget
					integrationType="google-calendar"
					buttonText="Connect Another Account"
					onSuccess={handleConnectSuccess}
				/>
			)}
			<GoogleCalendarSettings
				isOpen={info.showSettings}
				onClose={toggleSettings}
				connectedCalendars={info.alreadyConnectedGoogleCalendars}
				onToggleShowEvents={(val) => updateCalendarInfo('showGoogleEvents', val)}
				showGoogleEvents={showGoogleEvents}
			/>
		</>
	);
};

export default memo(GoogleCalendar);
