import { useState, useCallback, useEffect, useRef } from 'react';

const useNotificationOverlay = () => {
	const [notifications, setNotifications] = useState([]);
	const [showNotificationOverlay, setShowNotificationOverlay] = useState(false);
	const timeoutsRef = useRef(new Map());

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
			const timeoutHandle = setTimeout(() => {
				dismissNotification(id);
			}, newNotification.duration);
			timeoutsRef.current.set(id, timeoutHandle);
		}

		return id;
	}, []);

	const dismissNotification = useCallback((id) => {
		const timeoutsMap = timeoutsRef.current;
		if (timeoutsMap && timeoutsMap.has(id)) {
			const timeoutHandle = timeoutsMap.get(id);
			clearTimeout(timeoutHandle);
			timeoutsMap.delete(id);
		}

		setNotifications((prev) => {
			const updated = prev.filter((n) => n.id !== id);
			if (updated.length === 0) {
				setShowNotificationOverlay(false);
			}
			return updated;
		});
	}, []);

	const clearAllNotifications = useCallback(() => {
		const timeoutsMap = timeoutsRef.current;
		if (timeoutsMap) {
			for (const timeoutHandle of timeoutsMap.values()) clearTimeout(timeoutHandle);
			timeoutsMap.clear();
		}
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

	useEffect(() => {
		return () => {
			const timeoutsMap = timeoutsRef.current;
			if (timeoutsMap) {
				for (const timeoutHandle of timeoutsMap.values()) clearTimeout(timeoutHandle);
				timeoutsMap.clear();
			}
		};
	}, []);

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
