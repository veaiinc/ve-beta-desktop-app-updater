import { Routes, Route } from 'react-router-dom';
import betaRoutes from './routes';
import { useContext, useEffect } from 'react';
import ExpiredSubscriptionModal from './views/components/modalsV2/subscription/ExpiredSubscriptionModal';
import ExpiredTokenModal from './views/components/modalsV2/subscription/ExpiredTokenModal';
import Cookies from 'js-cookie';
import Context from './context/context';
import AccessDeniedPopup from './views/components/accessPopups/accessDeniedPopup';
// import VoiceWrapper from './views/layouts/VoiceWrapper';
import CustomToast from './views/components/globalComponents/CustomToast';
// import Spinner from './views/components/loaders/Spinner';
import useWorkspaceMode from './views/hooks/useWorkspaceMode';

const stableRoutes = betaRoutes?.filter(
	(route) =>
		route.routeType === 'public' ||
		route.path === '/home' ||
		route.path === '/settings/:type' ||
		route.path === '/chat/:sessionId' ||
		route.path === '/share-and-earn' ||
		route.path === '/create-workspace',
);

function App() {
	const currentRoute = window.location.pathname;
	const { workspaceMode, loading, error } = useWorkspaceMode(); // stable, beta, internal
	const {
		themeInfo: { theme },
	} = useContext(Context);

	const getThemePreference = () => {
		if (currentRoute.startsWith('/builder')) {
			return 'light';
		}
		if (currentRoute === '/') {
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
		if (currentRoute.startsWith('/builder')) {
			htmlElement.removeAttribute('theme');
		} else {
			htmlElement.setAttribute('theme', themeAttribute);
		}
	}, [theme, currentRoute]);

	const routes =
		loading || error !== false ? [] : workspaceMode === 'stable' ? stableRoutes : betaRoutes;

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
			{/* <VoiceWrapper /> */}
			<CustomToast />
		</>
	);
}

export default App;
