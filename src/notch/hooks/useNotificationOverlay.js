import { useState, useCallback } from 'react';

const useNotificationOverlay = () => {
	const [notifications, setNotifications] = useState([]);
	const [showNotificationOverlay, setShowNotificationOverlay] = useState(false);

	const showNotification = useCallback((notification) => {
		const id = Date.now() + Math.random();
		const newNotification = {
			id,
			title: notification.title || 'Notification',
			message: notification.message || notification.body || '',
			type: notification.type || 'info',
			duration: notification.duration || 5000,
			actions: notification.actions || [],
			timestamp: Date.now(),
		};

		setNotifications((prev) => [...prev, newNotification]);
		setShowNotificationOverlay(true);

		// Auto-dismiss after duration
		if (newNotification.duration > 0) {
			setTimeout(() => {
				dismissNotification(id);
			}, newNotification.duration);
		}

		return id;
	}, []);

	const dismissNotification = useCallback((id) => {
		setNotifications((prev) => {
			const updated = prev.filter((n) => n.id !== id);
			// Hide overlay if no notifications left
			if (updated.length === 0) {
				setShowNotificationOverlay(false);
			}
			return updated;
		});
	}, []);

	const clearAllNotifications = useCallback(() => {
		setNotifications([]);
		setShowNotificationOverlay(false);
	}, []);

	const handleNotificationAction = useCallback(
		(notificationId, actionIndex, onAction) => {
			const notification = notifications.find((n) => n.id === notificationId);
			if (notification && notification.actions && notification.actions[actionIndex]) {
				const action = notification.actions[actionIndex];
				console.log('🔔 Notification action triggered:', action);

				// Call the provided action handler
				if (onAction) {
					onAction(action, notification);
				}
			}
		},
		[notifications],
	);

	return {
		notifications,
		showNotificationOverlay,
		showNotification,
		dismissNotification,
		clearAllNotifications,
		handleNotificationAction,
	};
};

export default useNotificationOverlay;
