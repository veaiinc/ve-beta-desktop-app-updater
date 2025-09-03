import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import './overlay-notification.scss';

const OverlayNotification = ({ notifications, onDismiss }) => {
	if (!notifications || notifications.length === 0) return null;

	const getIcon = (type) => {
		switch (type) {
			case 'success':
				return <CheckCircle size={16} />;
			case 'error':
				return <AlertCircle size={16} />;
			case 'info':
			default:
				return <Info size={16} />;
		}
	};

	return (
		<div className="overlay-notification-container">
			{notifications.map((notification) => (
				<div
					key={notification.id}
					className={`overlay-notification overlay-notification--${notification.type}`}
				>
					<div className="overlay-notification__icon">{getIcon(notification.type)}</div>
					<div className="overlay-notification__content">
						<div className="overlay-notification__message">{notification.message}</div>
						{notification.description && (
							<div className="overlay-notification__description">
								{notification.description}
							</div>
						)}
					</div>
					<button
						className="overlay-notification__close"
						onClick={() => onDismiss(notification.id)}
						title="Close"
					>
						<X size={14} />
					</button>
				</div>
			))}
		</div>
	);
};

// Hook for managing notifications
export const useOverlayNotification = () => {
	const [notifications, setNotifications] = useState([]);

	const showNotification = (message, type = 'info', description = null, duration = 5000) => {
		const id = Date.now() + Math.random();
		const notification = {
			id,
			message,
			type,
			description,
			duration,
		};

		setNotifications((prev) => [...prev, notification]);

		// Auto dismiss after duration
		if (duration > 0) {
			setTimeout(() => {
				dismissNotification(id);
			}, duration);
		}

		return id;
	};

	const dismissNotification = (id) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	const clearAll = () => {
		setNotifications([]);
	};

	// Convenience methods
	const success = (message, description, duration) =>
		showNotification(message, 'success', description, duration);

	const error = (
		message,
		description,
		duration = 8000, // Longer duration for errors
	) => showNotification(message, 'error', description, duration);

	const info = (message, description, duration) =>
		showNotification(message, 'info', description, duration);

	return {
		notifications,
		showNotification,
		dismissNotification,
		clearAll,
		success,
		error,
		info,
	};
};

export default OverlayNotification;
