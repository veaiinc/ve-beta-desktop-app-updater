import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Context from '../../context/context';
import useLogout from './useLogout';

const calculateTokenTimeLeft = (token) => {
	if (!token) return { isExpired: true };

	try {
		// Get payload from JWT token
		const payload = JSON.parse(atob(token.split('.')[1]));
		const expiryTimestamp = payload.exp; // JWT exp is in seconds
		const now = Date.now();
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
	} catch (error) {
		console.error('Error parsing token:', error);
		return { isExpired: true };
	}
};

const useTokenExpiry = () => {
	const [tokenInfo, setTokenInfo] = useState({});
	const timerRef = useRef({ timer: null, interval: null });
	const logout = useLogout();
	let {
		subscriptionInfo: { updateTokenExpiryState },
	} = useContext(Context);
	// Cleanup on unmount
	useEffect(() => {
		handleExpiryCheckLogic();
		return () => {
			cleanupTimers();
		};
	}, []);

	const handleExpiryCheckLogic = useCallback(() => {
		const token = localStorage.getItem('usertoken');
		const validateExpiryData = calculateTokenTimeLeft(token);

		setTokenInfo((prev) => ({ ...prev, ...validateExpiryData }));
		updateTokenExpiryState({ tokenExpiryData: validateExpiryData });
		cleanupTimers();

		if (validateExpiryData.isExpired) {
			updateTokenExpiryState({ expiredTokenModal: true });
			setTimeout(() => {
				logout();
				updateTokenExpiryState({ expiredTokenModal: false });
			}, 5000);
			return;
		}

		// Set up next check based on time remaining
		if (validateExpiryData.hoursLeft > 24) {
			timerRef.current.timer = setTimeout(handleExpiryCheckLogic, 24 * 60 * 60 * 1000);
		} else if (validateExpiryData.hoursLeft > 6) {
			timerRef.current.timer = setTimeout(handleExpiryCheckLogic, 6 * 60 * 60 * 1000);
		} else if (validateExpiryData.hoursLeft > 1) {
			timerRef.current.interval = setInterval(handleExpiryCheckLogic, 60 * 60 * 1000);
		} else if (validateExpiryData.secondsLeft > 60) {
			timerRef.current.interval = setInterval(handleExpiryCheckLogic, 60 * 1000);
		} else {
			timerRef.current.interval = setInterval(handleExpiryCheckLogic, 1000);
		}
	}, []);

	const cleanupTimers = useCallback(() => {
		if (timerRef.current.timer) {
			clearTimeout(timerRef.current.timer);
			timerRef.current.timer = null;
		}
		if (timerRef.current.interval) {
			clearInterval(timerRef.current.interval);
			timerRef.current.interval = null;
		}
	}, []);

	return { ...tokenInfo };
};

export default useTokenExpiry;
