import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthWrapper = ({ children }) => {
	const navigate = useNavigate();

	useEffect(() => {
		if (!localStorage.getItem('usertoken')) {
			return navigate('/user/login');
		}
	}, [navigate]);

	return children;
};

export default AuthWrapper;
