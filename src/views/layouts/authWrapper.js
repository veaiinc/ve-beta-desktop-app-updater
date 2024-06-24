import React, { useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/scss/authWrapper.scss';
import Header from '../components/Header';
import { Helmet } from 'react-helmet';

const AuthWrapper = ({ title, children }) => {
	const navigate = useNavigate();

	useEffect(() => {
		if (!localStorage.getItem('usertoken')) {
			return navigate('/user/login');
		}
	}, [navigate]);

	return (
		<div className="authParentContainer">
			<Helmet>
				<meta charSet="utf-8" />
				<title>{title} | VE</title>
			</Helmet>
			<Header />
			<div className="childrenContainer">{children}</div>
		</div>
	);
};

export default memo(AuthWrapper);
