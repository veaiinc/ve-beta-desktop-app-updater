import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../context/context';
import useBroadcastChannel from './useBroadcastChannel';
import logout from '../helpers/logout';

const useAuth = () => {
	const navigate = useNavigate();
	const channel = useBroadcastChannel();

	const {
		subscriptionInfo: { updateTokenExpiryState },
	} = useContext(Context);

	const [info, setInfo] = useState({
		authLoading: true,
	});

	const {
		profileInfo: { getUserDetails },
	} = useContext(Context);

	useEffect(() => {
		getUserDetailsData();
		checkUserAuthState();
	}, []);

	const getUserDetailsData = async () => {
		const { statusCode } = await getUserDetails();
		setInfo((prev) => ({
			...prev,
			authLoading: false,
		}));
		if (statusCode === 401) {
			updateTokenExpiryState({ expiredTokenModal: true });
			channel.postMessage('reload');
		}
	};

	const checkUserAuthState = useCallback(() => {
		const token = localStorage.getItem('usertoken');

		// Only redirect if we're not already on the landing page
		if (!token || token.trim() === '') {
			const currentPath = window.location.pathname;
			if (currentPath !== '/' && !currentPath.startsWith('/verify-user')) {
				window.location.replace('/');
			}
			return;
		}

		const isOnboard = JSON.parse(localStorage.getItem('isOnboard') || 'false');

		if (!isOnboard) {
			navigate('/early-access');
		}
	}, [navigate]);

	const { authLoading } = info;
	return { authLoading };
};

export default useAuth;
