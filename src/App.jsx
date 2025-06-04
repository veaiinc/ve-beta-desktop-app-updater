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

	// Theme logic with builder route handling
	const getThemePreference = () => {
		// Force light theme for builder routes
		if (currentRoute.startsWith('/builder')) {
			return 'light';
		}

		// Force dark theme for landing page
		if (currentRoute === '/') {
			return 'dark';
		}

		// Normal theme logic for other routes
		return theme || localStorage?.getItem('theme') || Cookies.get('theme') || 'dark';
	};

	const themePreference = getThemePreference();

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
		document.documentElement.setAttribute('theme', themeAttribute);
	}, [theme, currentRoute]); // Added currentRoute to dependency array

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
