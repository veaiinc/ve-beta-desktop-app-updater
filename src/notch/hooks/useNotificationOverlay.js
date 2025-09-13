import { useState, useCallback, useRef } from 'react';

const useNotificationOverlay = () => {
	const [notifications, setNotifications] = useState([]);
	const [showNotificationOverlay, setShowNotificationOverlay] = useState(false);
	const timersRef = useRef(new Map()); // Store timers for each notification
	const timerDataRef = useRef(new Map()); // Store timer data (remaining time, start time) for each notification

	const showNotification = useCallback((notification, onNotificationStart, onNotificationEnd) => {
		const id = Date.now() + Math.random();
		const newNotification = {
			id,
			title: notification.title || 'Notification',
			message: notification.message || notification.body || '',
			type: notification.type || 'info',
			duration: notification.duration || 5000,
			actions: notification.actions || [],
			timestamp: Date.now(),
			onNotificationStart,
			onNotificationEnd,
		};

		setNotifications((prev) => [...prev, newNotification]);
		setShowNotificationOverlay(true);

		// Call start callback
		if (onNotificationStart) {
			onNotificationStart(id);
		}

		// Auto-dismiss after duration
		if (newNotification.duration > 0) {
			const startTime = Date.now();
			const timer = setTimeout(() => {
				dismissNotification(id);
			}, newNotification.duration);
			timersRef.current.set(id, timer);
			timerDataRef.current.set(id, {
				originalDuration: newNotification.duration,
				remainingTime: newNotification.duration,
				startTime: startTime,
				isPaused: false,
				onNotificationEnd,
			});
		}

		return id;
	}, []);

	const dismissNotification = useCallback(
		(id) => {
			// Get timer data before clearing
			const timerData = timerDataRef.current.get(id);
			const notification = notifications.find((n) => n.id === id);

			// Clear timer if it exists
			const timer = timersRef.current.get(id);
			if (timer) {
				clearTimeout(timer);
				timersRef.current.delete(id);
			}

			// Clear timer data
			timerDataRef.current.delete(id);

			setNotifications((prev) => {
				const updated = prev.filter((n) => n.id !== id);
				// Hide overlay if no notifications left
				if (updated.length === 0) {
					setShowNotificationOverlay(false);

					// Call end callback for the last notification
					if (timerData?.onNotificationEnd || notification?.onNotificationEnd) {
						const callback =
							timerData?.onNotificationEnd || notification?.onNotificationEnd;
						setTimeout(() => callback(id), 100); // Small delay for smooth transition
					}
				}
				return updated;
			});
		},
		[notifications],
	);

	const clearAllNotifications = useCallback(() => {
		// Clear all timers
		timersRef.current.forEach((timer) => clearTimeout(timer));
		timersRef.current.clear();

		// Clear all timer data
		timerDataRef.current.clear();

		setNotifications([]);
		setShowNotificationOverlay(false);
	}, []);

	const pauseNotificationTimer = useCallback((id) => {
		const timer = timersRef.current.get(id);
		const timerData = timerDataRef.current.get(id);

		if (timer && timerData && !timerData.isPaused) {
			// Clear the current timer
			clearTimeout(timer);
			timersRef.current.delete(id);

			// Calculate remaining time
			const elapsed = Date.now() - timerData.startTime;
			const remainingTime = Math.max(0, timerData.remainingTime - elapsed);

			// Update timer data
			timerDataRef.current.set(id, {
				...timerData,
				remainingTime: remainingTime,
				isPaused: true,
			});

			console.log(`⏸️ Paused notification ${id}, remaining time: ${remainingTime}ms`);
		}
	}, []);

	const resumeNotificationTimer = useCallback(
		(id) => {
			const timerData = timerDataRef.current.get(id);

			if (timerData && timerData.isPaused && timerData.remainingTime > 0) {
				// Create new timer with remaining time
				const timer = setTimeout(() => {
					dismissNotification(id);
				}, timerData.remainingTime);

				timersRef.current.set(id, timer);

				// Update timer data
				timerDataRef.current.set(id, {
					...timerData,
					startTime: Date.now(),
					isPaused: false,
				});

				console.log(
					`▶️ Resumed notification ${id}, remaining time: ${timerData.remainingTime}ms`,
				);
			}
		},
		[dismissNotification],
	);

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
		pauseNotificationTimer,
		resumeNotificationTimer,
	};
};

export default useNotificationOverlay;
