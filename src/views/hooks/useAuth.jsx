import { useCallback, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Context from '../../context/context';
import useLogout from './useLogout';

const useAuth = () => {
	const navigate = useNavigate();
	const logOut = useLogout();
	const {
		profileInfo: { getUserDetails, userDetailsData },
	} = useContext(Context);

	useEffect(() => {
		getUserDetailsData();
	}, []);

	const getUserDetailsData = async () => {
		const res = await getUserDetails();
		if (res?.statusCode === 401) {
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
	return checkUserAuthState;
};

export default useAuth;
