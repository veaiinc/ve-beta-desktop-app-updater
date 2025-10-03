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
		const initializeAuth = async () => {
			// First check auth state to determine if user should be redirected
			const shouldProceed = checkUserAuthState();

			// Always fetch user details for authenticated users
			// The workspace onboard status will be checked separately
			if (shouldProceed) {
				await getUserDetailsData();
			} else {
				// If user is not authenticated, just set loading to false
				setInfo((prev) => ({
					...prev,
					authLoading: false,
				}));
			}
		};

		initializeAuth();
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
			return false; // Return false to indicate no further processing needed
		}

		// For workspace-specific onboard status, we need to check after getting workspace list
		// So we don't redirect here based on isOnboard from localStorage alone
		// The EarlyAccess component will handle the workspace-specific onboard check
		const isOnboard = JSON.parse(localStorage.getItem('isOnboard') || 'false');
		const currentPath = window.location.pathname;

		// Only redirect to early-access if we're certain the user is not onboarded
		// and we're not already on early-access or onboarding pages
		if (!isOnboard && currentPath !== '/early-access') {
			navigate('/early-access');
		}

		return true; // Always return true for authenticated users to allow getUserDetails
	}, [navigate]);

	const { authLoading } = info;
	return { authLoading };
};

export default useAuth;
