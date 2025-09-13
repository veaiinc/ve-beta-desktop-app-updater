import React from 'react';
import { CloseIcon } from './DynamicIslandIcons';
import './NotificationOverlay.scss';

const NotificationOverlay = ({
	notifications,
	showOverlay,
	onDismissNotification,
	onClearAll,
	onNotificationAction,
}) => {
	if (!showOverlay || !notifications || notifications.length === 0) {
		return null;
	}

	return (
		<div className="notification-overlay">
			<div className="notification-container">
				{notifications.map((notification) => (
					<div
						key={notification.id}
						className={`notification-item notification-item--${
							notification.type || 'meeting'
						}`}
					>
						<div className="notification-content">
							<div className="notification-title">{notification.title}</div>
							<div className="notification-message">{notification.message}</div>
						</div>
						{notification.actions && notification.actions.length > 0 && (
							<div className="notification-actions">
								{notification.actions.map((action, index) => (
									<button
										key={index}
										className="notification-action-btn"
										onClick={() => onNotificationAction(notification.id, index)}
									>
										{action.text}
									</button>
								))}
							</div>
						)}
						<button
							className="notification-close"
							onClick={() => onDismissNotification(notification.id)}
							title="Dismiss"
						>
							<CloseIcon />
						</button>
					</div>
				))}
				{notifications.length > 1 && (
					<button className="notification-clear-all" onClick={onClearAll}>
						Clear All
					</button>
				)}
			</div>
		</div>
	);
};

export default NotificationOverlay;
