import { memo, useState } from 'react';
import '../../../assets/scss/calendar/GoogleCalenderSettings.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as PlusSvg } from '../../../assets/svg/calendar/add.svg';
const GoogleCalendarSettings = ({ isOpen, onClose, connectedCalendars }) => {
	const [isSharingEnabled, setIsSharingEnabled] = useState(false);

	if (!isOpen) return null;

	return (
		<div className="google-calendar-settings-overlay" onClick={onClose}>
			<div className="google-calendar-settings-modal" onClick={(e) => e.stopPropagation()}>
				<div className="google-calendar-settings-header">
					<h2>Calendar Settings</h2>
					<CloseSvg onClick={onClose} style={{ cursor: 'pointer' }} />
				</div>
				<div className="google-calendar-settings-content">
					<div className="settings-section">
						<h3 className="section-heading">Google Calendar</h3>
						{connectedCalendars?.map((calendar) => (
							<div key={calendar} className="connected-account">
								<div className="account-info">
									<span className="account-name">{calendar}</span>
								</div>
								<div className="disconnect-button">Disconnect</div>
							</div>
						))}
					</div>

					<div className="settings-section">
						<div className="connected-account">
							<div className="account-info">
								<h4 className="account-heading">Share VE calendar events</h4>
								<span className="account-description">
									Share your VE calendar events to other Google calendar
								</span>
							</div>
							<div
								className={`toggle-switch ${isSharingEnabled ? 'active' : ''}`}
								onClick={() => setIsSharingEnabled(!isSharingEnabled)}
							>
								<div className="toggle-slider"></div>
							</div>
						</div>
					</div>
					{/* <div className="add-new-account">
						<PlusSvg />
						<span className="add-new">Add another google email address</span>
					</div> */}
					<div className="settings-section">
						<div className="connected-account">
							<div className="account-info">
								<h4 className="account-heading">
									Show Google calendar events in my VE calendar
								</h4>
								<span className="account-description">
									The status of imported calendar events (busy/free) stays the
									same.
								</span>
							</div>
							<div
								className={`toggle-switch ${isSharingEnabled ? 'active' : ''}`}
								onClick={() => setIsSharingEnabled(!isSharingEnabled)}
							>
								<div className="toggle-slider"></div>
							</div>
						</div>
					</div>
					<div className="button-container">
						<button className="cancel-button" onClick={onClose}>
							Cancel
						</button>
						<button className="save-button">Create</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(GoogleCalendarSettings);
