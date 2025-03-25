import { Routes, Route } from 'react-router-dom';
import routes from './routes';
import React, { memo, useContext, useEffect } from 'react';
import ExpiredSubscriptionModal from './views/components/modalsV2/subscription/ExpiredSubscriptionModal';
import ExpiredTokenModal from './views/components/modalsV2/subscription/ExpiredTokenModal';
import Cookies from 'js-cookie';
import Context from './context/context';
import AccessDeniedPopup from './views/components/accessPopups/accessDeniedPopup';
function App() {
	const {
		themeInfo: { theme },
	} = useContext(Context);

	let themePreference = localStorage?.getItem('theme') || Cookies.get('theme') || 'systemDefault';
	if (themePreference === 'systemDefault') {
		themePreference = window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
	} else {
		themePreference = theme;
	}

	useEffect(() => {
		if (window.navigator.appVersion.indexOf('Mac') !== -1) {
			document.getElementsByTagName('html')[0].classList.add('macos');
		} else {
			document.getElementsByTagName('html')[0].classList.add('otheros');
		}
		// document.getElementsByTagName('html')[0].classList.add('theme-dark');
		// const theme = localStorage.getItem('theme') || Cookies.get('theme') || 'dark';
		document.documentElement.setAttribute('theme', themePreference);
	}, []);

	return (
		<>
			<Routes>
				{routes?.map((route, index) => (
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
			<AccessDeniedPopup />
		</>
	);
}

export default memo(App);
