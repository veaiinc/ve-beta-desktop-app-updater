import { Routes, Route, useLocation } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import ExpiredSubscriptionModal from './views/components/modalsV2/subscription/ExpiredSubscriptionModal';
import ExpiredTokenModal from './views/components/modalsV2/subscription/ExpiredTokenModal';
import Cookies from 'js-cookie';
import Context from './context/context';
import AccessDeniedPopup from './views/components/accessPopups/accessDeniedPopup';
import CustomToast from './views/components/globalComponents/CustomToast';
import useWorkspaceMode from './views/hooks/useWorkspaceMode';
import publicRoutes from './routes/publicRoutes';
import stableRoutes from './routes/stableRoutes';
import betaRoutes from './routes/betaRoutes';

function App() {
	const { pathname } = useLocation();
	const { workspaceMode } = useWorkspaceMode(); // stable, beta, internal
	const protectedRoutes =
		workspaceMode === 'stable' ? stableRoutes : workspaceMode === 'beta' ? betaRoutes : [];
	const routes = [...publicRoutes, ...protectedRoutes];

	const {
		themeInfo: { theme },
	} = useContext(Context);

	const getThemePreference = () => {
		if (pathname.startsWith('builder')) {
			return 'light';
		}
		if (pathname === '/') {
			return 'dark';
		}
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
		const htmlElement = document.documentElement;
		if (window.navigator.appVersion.indexOf('Mac') !== -1) {
			htmlElement.classList.add('macos');
		} else {
			htmlElement.classList.add('otheros');
		}
		if (pathname.startsWith('/builder')) {
			htmlElement.removeAttribute('theme');
		} else {
			htmlElement.setAttribute('theme', themeAttribute);
		}
	}, [theme]);

	return (
		<>
			<Routes>
				{routes?.map((route, index) => (
					<Route
						key={index}
						path={route?.path}
						element={route?.element}
						exact={route?.exact}
					/>
				))}
			</Routes>
			<ExpiredSubscriptionModal />
			<ExpiredTokenModal />
			<AccessDeniedPopup />
			<CustomToast />
		</>
	);
}

export default App;
