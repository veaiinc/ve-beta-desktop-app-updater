import { memo, useState } from 'react';
import '../../../assets/scss/calendar/GoogleCalenderSettings.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as PlusSvg } from '../../../assets/svg/calendar/add.svg';

const GoogleCalendarSettings = ({ isOpen, onClose, connectedCalendars }) => {
	const [isSharingEnabled, setIsSharingEnabled] = useState(false);

	if (!isOpen) return null;

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
								<div className="google-calendar-settings_disconnect">
									Disconnect
								</div>
							</div>
						))}
					</div>

					<div className="google-calendar-settings_section">
						<div className="google-calendar-settings_account">
							<div className="google-calendar-settings_account-info">
								<h4 className="google-calendar-settings_account-heading">
									Share VE calendar events
								</h4>
								<span className="google-calendar-settings_account-description">
									Share your VE calendar events to other Google calendar
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
									Show Google calendar events in my VE calendar
								</h4>
								<span className="google-calendar-settings_account-description">
									The status of imported calendar events (busy/free) stays the
									same.
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
					<div className="google-calendar-settings_buttons">
						<button
							className="google-calendar-settings_button google-calendar-settings_button--cancel"
							onClick={onClose}
						>
							Cancel
						</button>
						<button className="google-calendar-settings_button google-calendar-settings_button--save">
							Create
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(GoogleCalendarSettings);
