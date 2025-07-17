import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogout from './useLogout';
import Context from '../context/context';

const useAuth = () => {
	const navigate = useNavigate();
	const logOut = useLogout();
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
			logOut();
		}
	};

	const checkUserAuthState = useCallback(() => {
		if (!localStorage.getItem('usertoken')) {
			window.location.replace('/');
		}
		const isOnboard = JSON.parse(localStorage.getItem('isOnboard'));

		if (!isOnboard) {
			return navigate('/early-access');
		}
	}, []);

	const { authLoading } = info;
	return { authLoading };
};

export default useAuth;
