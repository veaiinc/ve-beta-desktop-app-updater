import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
	const navigate = useNavigate();

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
