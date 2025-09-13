import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../context/context';
import useBroadcastChannel from './useBroadcastChannel';
import logout from '../helpers/logout';

const useAuth = () => {
	const navigate = useNavigate();
	const channel = useBroadcastChannel();

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
			logout();
			window.electronApi.sendMessageFrmVeApp('unauthorized');
			channel.postMessage('reload');
		}
		window.electronApi.sendMessageFrmVeApp('authorized');
	};

	const checkUserAuthState = useCallback(() => {
		if (!localStorage.getItem('usertoken')) {
			window.location.replace('/');
		}
		const isOnboard = JSON.parse(localStorage.getItem('isOnboard'));

		if (!isOnboard) {
			navigate('/early-access');
		}
	}, []);

	const { authLoading } = info;
	return { authLoading };
};

export default useAuth;
