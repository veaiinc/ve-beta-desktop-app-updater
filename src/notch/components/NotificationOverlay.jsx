import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CloseIcon, MicrophoneIcon } from './DynamicIslandIcons';
import './NotificationOverlay.scss';

const NotificationOverlay = ({
	notifications,
	showOverlay,
	onDismissNotification,
	onClearAll,
	onNotificationAction,
	onPauseTimer,
	onResumeTimer,
}) => {
	const [hoveredNotificationId, setHoveredNotificationId] = useState(null);
	const [resumedNotificationId, setResumedNotificationId] = useState(null);

	// Clear resumed state after a short delay to allow animation restart
	useEffect(() => {
		if (resumedNotificationId) {
			const timer = setTimeout(() => {
				setResumedNotificationId(null);
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [resumedNotificationId]);

	if (!showOverlay || !notifications || notifications.length === 0) {
		return null;
	}

	// Use a portal so the overlay is rendered at the document root.
	// This avoids clipping from ancestor transforms/overflow in the Dynamic Island container.
	const overlay = (
		<div className="notification-overlay">
			<div className="notification-container">
				{notifications.map((notification) => (
					<div
						key={notification.id}
						className={`notification-item notification-item--${
							notification.type || 'meeting'
						} ${hoveredNotificationId === notification.id ? 'paused' : ''} ${
							resumedNotificationId === notification.id ? 'resumed' : ''
						}`}
						onMouseEnter={() => {
							setHoveredNotificationId(notification.id);
							if (onPauseTimer) {
								onPauseTimer(notification.id);
							}
						}}
						onMouseLeave={() => {
							setHoveredNotificationId(null);
							setResumedNotificationId(notification.id);
							if (onResumeTimer) {
								onResumeTimer(notification.id);
							}
						}}
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
										className={`notification-action-btn ${
											action.type === 'join-meet' ? 'join-btn' : ''
										}`}
										onClick={() => onNotificationAction(notification.id, index)}
									>
										{action.type === 'join-meet' && (
											<MicrophoneIcon className="mic-icon" />
										)}
										{action.text}
									</button>
								))}
							</div>
						)}
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

	return ReactDOM.createPortal(overlay, document.body);
};

export default NotificationOverlay;
