import { useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogout from './useLogout';
import Context from '../context/context';

const useAuth = () => {
	const navigate = useNavigate();
	const logOut = useLogout();
	const {
		profileInfo: { userDetailsData, getUserDetails },
	} = useContext(Context);

	console.log(userDetailsData);

	useEffect(() => {
		getUserDetailsData();
		checkUserAuthState();
	}, []);

	const getUserDetailsData = async () => {
		const { statusCode } = await getUserDetails();
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
};

export default useAuth;
