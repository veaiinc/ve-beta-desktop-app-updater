import { useContext, useEffect, useState } from 'react';
import Context from '../../context/context';
import { matchPath, useLocation } from 'react-router-dom';
import useLogout from './useLogout';
import PageLoader from '../features/app/PageLoader';

export const publicRoutesList = [
	'/',
	'/manifesto',
	'/contact-us',
	'/api',
	'/about-us',
	'/careers',
	'/forefront',
	'/onboarding',
	'/verify-user',
	'/referral/:referralCode',
	'/privacy-policy',
	'/terms-of-service',
	'/cookie-policy',
	'/changelog',
	'/user/verify-oauth-user',
];

const fallbackRoute = [
	{
		path: '*',
		element: <PageLoader />,
	},
];

const useWorkspaceMode = () => {
	const { pathname } = useLocation();
	const logOut = useLogout();

	const {
		profileInfo: { tennantSettingsData, getTenantSettings },
	} = useContext(Context);

	const [routesInfo, setRoutesInfo] = useState({
		publicRoutes: null,
		stableRoutes: null,
		betaRoutes: null,
		fallbackRoute,
	});

	const workspaceMode = tennantSettingsData?.workspaceMode ?? null; // stable, beta, internal
	const isPublicRoute = publicRoutesList.some((routePath) =>
		matchPath({ path: routePath, end: true }, pathname),
	);
	const routeType = isPublicRoute
		? 'publicRoutes'
		: workspaceMode === 'stable'
		? 'stableRoutes'
		: workspaceMode === 'beta'
		? 'betaRoutes'
		: 'fallbackRoute';
	const routes = routesInfo[routeType] ?? routesInfo['fallbackRoute'];
	const loading = isPublicRoute ? false : workspaceMode === null; // since public routes don't have workspace mode. Until workspace mode becomes stable/beta, loading is true.

	const fetchWorkspaceMode = async () => {
		try {
			if (workspaceMode === null) {
				const response = await getTenantSettings();
				const success = response[0] === true;
				if (!success) {
					const { code } = response[1];
					if (code === 401) logOut();
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	const importRoutes = async (routeType) => {
		switch (routeType) {
			case 'publicRoutes':
				if (routesInfo['publicRoutes'] === null) {
					const { default: publicRoutes } = await import('../../routes/publicRoutes');
					setRoutesInfo((prev) => ({
						...prev,
						publicRoutes,
					}));
				}
				break;
			case 'stableRoutes':
				if (routesInfo['stableRoutes'] === null) {
					const { default: stableRoutes } = await import('../../routes/stableRoutes');
					setRoutesInfo((prev) => ({
						...prev,
						stableRoutes,
					}));
				}
				break;
			case 'betaRoutes':
				if (routesInfo['betaRoutes'] === null) {
					const { default: betaRoutes } = await import('../../routes/betaRoutes');
					setRoutesInfo((prev) => ({
						...prev,
						betaRoutes,
					}));
				}
				break;
			case 'fallbackRoute':
				return;
		}
	};

	useEffect(() => {
		// Fetch workspaceMode only for protected routes
		if (isPublicRoute) return;
		fetchWorkspaceMode();
	}, [isPublicRoute]);

	useEffect(() => {
		importRoutes(routeType);
	}, [routeType]);

	return { loading, routes, workspaceMode };
};

export default useWorkspaceMode;
