import { Routes, Route } from 'react-router-dom';
import routes from './routes';
import React, { memo, useEffect, useContext } from 'react';
import Context from './context/context';
import ExpiredSubscriptionModal from './views/components/modalsV2/subscription/ExpiredSubscriptionModal';
import ExpiredTokenModal from './views/components/modalsV2/subscription/ExpiredTokenModal';
import AccessDeniedPopup from './views/components/accessPopups/accessDeniedPopup';
import RenewBanner from './views/components/globalComponents/RenewBanner';
function App() {
	const {
		subscriptionInfo: { renewBanner },
	} = useContext(Context);
	useEffect(() => {
		if (window.navigator.appVersion.indexOf('Mac') !== -1) {
			document.getElementsByTagName('html')[0].classList.add('macos');
		} else {
			document.getElementsByTagName('html')[0].classList.add('otheros');
		}
		document.getElementsByTagName('html')[0].classList.add('theme-dark');
	}, []);

	return (
		<>
			{renewBanner && <RenewBanner />}
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
			<AccessDeniedPopup />
		</>
	);
}

export default memo(App);
