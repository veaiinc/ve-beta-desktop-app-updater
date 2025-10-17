import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Add useNavigate
import Context from '../context/context';

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
};

const MappedApps = {
	workflow: 'docs',
	conversationalAgent: 'ai-assistant',
	classicGallery: 'galleries',
	liteGallery: 'lite-gallery',
	template: 'my-templates',
	task: 'tasks',
	form: 'forms',
	calendar: 'calendar',
	automation: 'automation',
	contact: 'contacts',
};

const useSubscription = () => {
	const {
		subscriptionInfo: {
			currentPlan,
			getCurrentSubscriptionPlan,
			updateSubscriptionState,
			updateStateValues,
			reFetchSubscription,
			updateRenewBanner,
		},
	} = useContext(Context);
	const timerRef = useRef({ timer: null, interval: null });
	const location = useLocation();
	const navigate = useNavigate(); // Initialize useNavigate

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			cleanupTimers();
		};
	}, []);

	useEffect(() => {
		if (!currentPlan) {
			getCurrentSubscriptionPlan();
		}
	}, [location.pathname, currentPlan]);

	useEffect(() => {
		if (reFetchSubscription) {
			getCurrentSubscriptionPlan();
			updateStateValues({ reFetchSubscription: false });
		}
	}, [reFetchSubscription]);

	useEffect(() => {
		if (currentPlan) {
			handleExpiryCheckLogic();
		}
	}, [currentPlan]);

	useEffect(() => {
		const currentPath = location?.pathname?.split('/')[1];

		if (currentPlan?.apps?.length) {
			let shouldShowRenewBanner = currentPlan?.apps?.some((eachApp) => {
				if (currentPath === 'contact' && eachApp?.app === 'contact') {
					return eachApp?.isPaidPlan === false;
				}
				return MappedApps?.[eachApp?.app] === currentPath && eachApp?.isPaidPlan === false;
			});

			updateRenewBanner({ renewBanner: shouldShowRenewBanner });
		}
	}, [currentPlan, location?.pathname]);

	const handleExpiryCheckLogic = useCallback(() => {
		if (currentPlan) {
			const validateExpiryData = calculateTimeLeft(currentPlan?.expiresAt || 0);

			const {
				storageLimitInBytes = 0,
				tenantUsersLimit = 0,
				storageUsedInBytes = 0,
				tenantUsers = 0,
				liteImageLimit = 0,
				liteImageUsed = 0,
				liteImageLimitWithAiFace = 0,
				cumulativeStorageUsedInBytes = 0,
			} = currentPlan;
			const storageLimitInGB = parseFloat(storageLimitInBytes / (1024 * 1024 * 1024));
			const totalStorageUsedInGB = parseFloat(storageUsedInBytes / (1024 * 1024 * 1024));
			const cumulativeStorageUsedInGB = parseFloat(
				cumulativeStorageUsedInBytes / (1024 * 1024 * 1024),
			);
			const obj = {
				storageLimitInGB,
				tenantUsersLimit,
				totalStorageUsedInGB,
				tenantUsers,
				liteImageLimit,
				liteImageUsed,
				liteImageLimitWithAiFace,
				...restrictMapper,
			};
			let uploadAllowedForClassicGallery = false;
			if (storageLimitInGB) {
				uploadAllowedForClassicGallery = totalStorageUsedInGB <= storageLimitInGB;
			}
			let uploadAllowed = false;
			if (storageLimitInGB) {
				uploadAllowed = cumulativeStorageUsedInGB <= storageLimitInGB * 1.5;
			}
			let imagesAllowed = false;
			if (liteImageLimit) {
				imagesAllowed = liteImageUsed < liteImageLimit;
			}
			updateSubscriptionState({
				validateExpiryData: {
					...obj,
					uploadAllowed,
					imagesAllowed,
					uploadAllowedForClassicGallery,
				},
			});

			// Check if subscription is expired and redirect
			if (validateExpiryData.isExpired) {
				navigate('/settings/pricing');
				localStorage.setItem('showSettingsSidebar', 'false');
				cleanupTimers();
				return;
			}

			cleanupTimers();
			if (validateExpiryData.hoursLeft > 24) {
				timerRef.current.timer = setTimeout(handleExpiryCheckLogic, 24 * 60 * 60 * 1000); // More than 24 hrs - check after 24 hrs
			} else if (validateExpiryData.hoursLeft > 6) {
				timerRef.current.timer = setTimeout(handleExpiryCheckLogic, 6 * 60 * 60 * 1000); // Between 6 and 24 hours - check after 6 hours
			} else if (validateExpiryData.hoursLeft > 1) {
				timerRef.current.interval = setInterval(handleExpiryCheckLogic, 60 * 60 * 1000); // Between 1 and 6 hours - check every hour
			} else if (validateExpiryData.secondsLeft > 60) {
				timerRef.current.interval = setInterval(handleExpiryCheckLogic, 60 * 1000); // Between 1 minute and 1 hour - check every minute
			} else {
				timerRef.current.interval = setInterval(handleExpiryCheckLogic, 1000); // Less than 1 minute - check every second
			}
		}
	}, [currentPlan, navigate]); // Add navigate to dependencies

	const cleanupTimers = useCallback(() => {
		// 🚨 CRITICAL FIX: Comprehensive timer cleanup
		if (timerRef.current.timer) {
			clearTimeout(timerRef.current.timer);
			timerRef.current.timer = null;
		}
		if (timerRef.current.interval) {
			clearInterval(timerRef.current.interval);
			timerRef.current.interval = null;
		}
		
		// 🚨 CRITICAL FIX: Clear all possible timer references
		timerRef.current = { timer: null, interval: null };
	}, []);
	
	// 🚨 CRITICAL FIX: Add cleanup on unmount
	useEffect(() => {
		return () => {
			cleanupTimers();
		};
	}, [cleanupTimers]);
};

export default useSubscription;
