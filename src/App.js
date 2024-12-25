import { Routes, Route } from 'react-router-dom';
import routes from './routes';
import React, { memo, useEffect } from 'react';
import ExpiredSubscriptionModal from './views/components/modalsV2/subscription/ExpiredSubscriptionModal';
import ExpiredTokenModal from './views/components/modalsV2/subscription/ExpiredTokenModal';
import Cookies from 'js-cookie';

function App() {
	useEffect(() => {
		if (window.navigator.appVersion.indexOf('Mac') !== -1) {
			document.getElementsByTagName('html')[0].classList.add('macos');
		} else {
			document.getElementsByTagName('html')[0].classList.add('otheros');
		}
		document.getElementsByTagName('html')[0].classList.add('theme-dark');
		const theme = localStorage.getItem('theme') || Cookies.get('theme') || 'dark';
		document.documentElement.setAttribute('theme', theme);
	}, []);

	return (
		<>
			<Routes>
				{routes.map((route, index) => (
					<Route
						key={index}
						path={route?.path}
						element={route?.component}
						exact={route?.exact}
					/>
				))}
			</Routes>
			<ExpiredSubscriptionModal />
			<ExpiredTokenModal />
		</>
	);
}

export default memo(App);
