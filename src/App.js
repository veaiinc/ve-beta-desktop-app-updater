import { Routes, Route } from 'react-router-dom';
import routes from './routes';
import React, { memo, useEffect } from 'react';
import ExpiredSubscriptionModal from './views/components/modalsV2/subscription/ExpiredSubscriptionModal';

function App() {
	useEffect(() => {
		if (window.navigator.appVersion.indexOf('Mac') !== -1) {
			document.getElementsByTagName('html')[0].classList.add('macos');
		} else {
			document.getElementsByTagName('html')[0].classList.add('otheros');
		}
		document.getElementsByTagName('html')[0].classList.add('theme-dark');
		document.documentElement.setAttribute('theme', 'dark');
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
		</>
	);
}

export default memo(App);
