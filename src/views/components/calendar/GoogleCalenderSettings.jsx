import { memo, useState, useContext } from 'react';
import '../../../assets/scss/calendar/GoogleCalenderSettings.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import Context from '../../../context/context';
import { message } from '../../components/globalComponents/CustomToast';

const GoogleCalendarSettings = ({
	isOpen,
	onClose,
	connectedCalendars,
	onToggleShowEvents,
	showGoogleEvents,
}) => {
	const [isSharingEnabled, setIsSharingEnabled] = useState(false);
	const [disconnecting, setDisconnecting] = useState(false);

	const {
		templates: { disconnectThirdParty },
		calendarInfo: { getConnectedGoogleCalendars },
	} = useContext(Context);

	if (!isOpen) return null;

	const handleToggleGoogleEvents = () => {
		onToggleShowEvents?.(!showGoogleEvents);
	};

	const handleDisconnect = async (calendarId) => {
		if (!calendarId) {
			message.error('Invalid calendar ID');
			return;
		}

		setDisconnecting(true);
		try {
			await disconnectThirdParty('google-calendar', calendarId);
			message.success('Calendar disconnected successfully');
			// Refresh the connected calendars list
			await getConnectedGoogleCalendars();
			onClose();
		} catch (error) {
			message.error('Failed to disconnect calendar. Please try again.');
			console.error('Error disconnecting calendar:', error);
		} finally {
			setDisconnecting(false);
		}
	};

	const handleSave = () => {
		// Close the settings modal
		onClose();
	};

	return (
		<div className="google-calendar-settings_overlay" onClick={onClose}>
			<div className="google-calendar-settings_modal" onClick={(e) => e.stopPropagation()}>
				<div className="google-calendar-settings_header">
					<h2 className="google-calendar-settings_title">Calendar Settings</h2>
					<CloseSvg onClick={onClose} style={{ cursor: 'pointer' }} />
				</div>
				<div className="google-calendar-settings_content">
					<div className="google-calendar-settings_section">
						<h3 className="google-calendar-settings_section-heading">
							Google Calendar
						</h3>
						{connectedCalendars?.map((calendar) => (
							<div key={calendar} className="google-calendar-settings_account">
								<div className="google-calendar-settings_account-info">
									<span className="google-calendar-settings_account-heading">
										{calendar}
									</span>
								</div>
								<div
									className="google-calendar-settings_disconnect"
									onClick={() => handleDisconnect(calendar)}
									style={{ cursor: disconnecting ? 'not-allowed' : 'pointer' }}
								>
									{disconnecting ? 'Disconnecting...' : 'Disconnect'}
								</div>
							</div>
						))}
					</div>

					<div className="google-calendar-settings_section">
						<div className="google-calendar-settings_account">
							<div className="google-calendar-settings_account-info">
								<h4 className="google-calendar-settings_account-heading">
									Share {connectedCalendars[0]} events to Google calendar
								</h4>
								<span className="google-calendar-settings_account-description">
									Share your {connectedCalendars[0]} calendar events to Google
									calendar
								</span>
							</div>
							<div
								className={`google-calendar-settings_toggle ${
									isSharingEnabled
										? 'google-calendar-settings_toggle--active'
										: ''
								}`}
								onClick={() => setIsSharingEnabled(!isSharingEnabled)}
							>
								<div className="google-calendar-settings_toggle-slider"></div>
							</div>
						</div>
					</div>
					{/* <div className="add-new-account">
						<PlusSvg />
						<span className="add-new">Add another google email address</span>
					</div> */}
					<div className="google-calendar-settings_section">
						<div className="google-calendar-settings_account">
							<div className="google-calendar-settings_account-info">
								<h4 className="google-calendar-settings_account-heading">
									Show Google calendar events in {connectedCalendars[0]} calendar
								</h4>
								<span className="google-calendar-settings_account-description">
									The status of imported calendar events (busy/free) stays the
									same.
								</span>
							</div>
							<div
								className={`google-calendar-settings_toggle ${
									showGoogleEvents
										? 'google-calendar-settings_toggle--active'
										: ''
								}`}
								onClick={handleToggleGoogleEvents}
							>
								<div className="google-calendar-settings_toggle-slider"></div>
							</div>
						</div>
					</div>
					<div className="google-calendar-settings_buttons">
						<button
							className="google-calendar-settings_button google-calendar-settings_button--cancel"
							onClick={onClose}
						>
							Cancel
						</button>
						<button
							className="google-calendar-settings_button google-calendar-settings_button--save"
							onClick={handleSave}
						>
							Create
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(GoogleCalendarSettings);
