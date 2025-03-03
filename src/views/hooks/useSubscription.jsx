import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Context from '../../context/context';
const calculateTimeLeft = (expiryTimestamp) => {
	const now = Date.now();
	// Convert expiryTimestamp to milliseconds if it's in seconds
	const expiryMs = expiryTimestamp * 1000;
	const timeLeftMs = expiryMs - now;
	const secondsLeft = timeLeftMs / 1000;
	const hoursLeft = timeLeftMs / (1000 * 60 * 60);
	return {
		isExpired: timeLeftMs <= 0,
		timeLeftMs,
		secondsLeft,
		hoursLeft,
		isExpiringSoon: hoursLeft <= 24,
	};
};

const restrictMapper = {
	restrictTasks: false,
	restrictWorkflows: false,
	restrictGalleries: true,
	restrictCalendar: false,
	restrictContacts: false,
	restrictClassicGallery: false,
	restrictConversationalAgent: false,
	restrictClassicGallery: false,
	restrictConversationalAgent: false,
};

const useSubscription = () => {
	let {
		subscriptionInfo: {
			currentPlan,
			getCurrentSubscriptionPlan,
			updateSubscriptionState,
			updateStateValues,
			reFetchSubscription,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({});
	const timerRef = useRef({ timer: null, interval: null }); // Use ref for timers to prevent memory leaks
	const location = useLocation();
	// Cleanup on unmount
	useEffect(() => {
		return () => {
			cleanupTimers();
		};
	}, []);

	useEffect(() => {
		if (reFetchSubscription || location.pathname) {
			getCurrentSubscriptionPlan();
		}
		if (reFetchSubscription) {
			updateStateValues({ reFetchSubscription: false });
		}
	}, [location.pathname, reFetchSubscription]);

	useEffect(() => {
		if (currentPlan) {
			handleExpiryCheckLogic();
		}
	}, [currentPlan]);

	const handleExpiryCheckLogic = useCallback(() => {
		if (currentPlan) {
			const validateExpiryData = calculateTimeLeft(
				currentPlan?.currentSubscriptionPlan?.expiresAt || 0,
			);

			const {
				storageLimitInBytes = 0,
				tenantUsersLimit = 0,
				storageUsedInBytes = 0,
				tenantUsers = 0,
				liteImageLimit = 0,
				liteImageUsed = 0,
				liteImageLimitWithAiFace = 0,
			} = currentPlan;
			const storageLimitInGB = (storageLimitInBytes / (1024 * 1024 * 1024)).toFixed(2);
			const totalStorageUsedInGB = (storageUsedInBytes / (1024 * 1024 * 1024)).toFixed(2);
			const obj = {
				// ...(validateExpiryData || {}),
				// ...(validateExpiryData || {}),
				storageLimitInGB,
				tenantUsersLimit,
				totalStorageUsedInGB,
				tenantUsers,
				liteImageLimit,
				liteImageUsed,
				liteImageLimitWithAiFace,
				...restrictMapper,
			};
			let uploadAllowed = false;
			if (storageLimitInGB) {
				uploadAllowed = totalStorageUsedInGB < storageLimitInGB;
			}
			let imagesAllowed = false;
			if (liteImageLimit) {
				imagesAllowed = liteImageUsed < liteImageLimit;
			}
			setInfo((prev) => ({ ...prev, ...obj, uploadAllowed, imagesAllowed }));
			updateSubscriptionState({
				validateExpiryData: { ...obj, uploadAllowed, imagesAllowed },
			});
			cleanupTimers();
			if (validateExpiryData?.isExpired) {
				return cleanupTimers;
			}
			if (validateExpiryData.hoursLeft > 24) {
				timerRef.current.timer = setTimeout(handleExpiryCheckLogic, 24 * 60 * 60 * 1000); //more than 24 hrs -check after 24 hrs
			}
			if (validateExpiryData?.hoursLeft > 6) {
				timerRef.current.timer = setTimeout(handleExpiryCheckLogic, 6 * 60 * 60 * 1000); // Between 6 and 24 hours - check after 6 hours
			} else if (validateExpiryData?.hoursLeft > 1) {
				timerRef.current.interval = setInterval(handleExpiryCheckLogic, 60 * 60 * 1000); // Between 1 and 6 hours - check every hour
			} else if (validateExpiryData?.secondsLeft > 60) {
				timerRef.current.interval = setInterval(handleExpiryCheckLogic, 60 * 1000); // Between 1 minute and 1 hour - check every minute
			} else {
				timerRef.current.interval = setInterval(handleExpiryCheckLogic, 1000); // Less than 1 minute - check every second
			}
		}
	}, [currentPlan]);
	const cleanupTimers = useCallback(() => {
		if (timerRef.current.timer) {
			clearTimeout(timerRef.current.timer);
			timerRef.current.timer = null;
		}
		if (timerRef.current.interval) {
			clearInterval(timerRef.current.interval);
			timerRef.current.interval = null;
		}
	}, [timerRef]);
	return { ...info };
};
export default useSubscription;
