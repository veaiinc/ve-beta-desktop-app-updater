import { Routes, Route } from 'react-router-dom';
import routes from './routes';
import React, { memo, useContext, useEffect } from 'react';
import ExpiredSubscriptionModal from './views/components/modalsV2/subscription/ExpiredSubscriptionModal';
import ExpiredTokenModal from './views/components/modalsV2/subscription/ExpiredTokenModal';
import Cookies from 'js-cookie';
import Context from './context/context';
import AccessDeniedPopup from './views/components/accessPopups/accessDeniedPopup';
import VoiceWrapper from './views/layouts/VoiceWrapper';
import CustomToast from './views/components/globalComponents/CustomToast';
function App() {
	const currentRoute = window.location.pathname;

	const {
		themeInfo: { theme },
	} = useContext(Context);

	// If route is exactly '/' - landing page, force dark theme, otherwise use normal theme logic
	const themePreference =
		currentRoute === '/'
			? 'dark'
			: theme || localStorage?.getItem('theme') || Cookies.get('theme') || 'dark';

	let themeAttribute = themePreference;
	if (themePreference === 'systemDefault') {
		themeAttribute = window.matchMedia('(prefers-color-scheme: dark)').matches
			? 'dark'
			: 'light';
	}

	useEffect(() => {
		if (window.navigator.appVersion.indexOf('Mac') !== -1) {
			document.getElementsByTagName('html')[0].classList.add('macos');
		} else {
			document.getElementsByTagName('html')[0].classList.add('otheros');
		}
		// document.getElementsByTagName('html')[0].classList.add('theme-dark');
		// const theme = localStorage.getItem('theme') || Cookies.get('theme') || 'dark';
		document.documentElement.setAttribute('theme', themeAttribute);
	}, [theme]);

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
			<VoiceWrapper />
			<CustomToast />
		</>
	);
}

export default memo(App);
