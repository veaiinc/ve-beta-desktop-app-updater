import { useContext, useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import fallbackRoute from '../routes/fallbackRoute';
import useLogout from './useLogout';
import Context from '../context/context';

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

const routeImports = {
	publicRoutes: () => import('../routes/publicRoutes'),
	stableRoutes: () => import('../routes/stableRoutes'),
	betaRoutes: () => import('../routes/betaRoutes'),
	internalRoutes: () => import('../routes/internalRoutes'),
	workspaceNotFoundRoute: () => import('../routes/workspaceNotFound'),
};

const routeMap = {
	null: 'fallbackRoute',
	stable: 'stableRoutes',
	beta: 'betaRoutes',
	internal: 'internalRoutes',
};

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
		internalRoutes: null,
		fallbackRoute,
		workspaceNotFoundRoute: null,
	});
	const [workspaceNotFound, setWorkspaceNotFound] = useState(false);

	const workspaceMode = tennantSettingsData?.workspaceMode ?? null; // stable, beta, internal, suspended
	const isPublicRoute = publicRoutesList.some((routePath) =>
		matchPath({ path: routePath, end: true }, pathname),
	);
	const routeType = isPublicRoute
		? 'publicRoutes'
		: workspaceNotFound
		? 'workspaceNotFoundRoute'
		: routeMap[workspaceMode];
	const routes = routesInfo[routeType] ?? routesInfo['fallbackRoute'];
	const loading = isPublicRoute || workspaceNotFound ? false : workspaceMode === null; // since public routes don't have workspace mode. Until workspace mode becomes stable/beta, loading is true.

	const fetchWorkspaceMode = async () => {
		try {
			if (workspaceMode === null) {
				const response = await getTenantSettings();
				const success = response[0] === true;
				if (!success) {
					const { code } = response[1];
					if (code === 401) logOut();
					else if (code === 404) setWorkspaceNotFound(true);
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	const importRoutes = async (routeType) => {
		if (routeType === 'fallbackRoute') return;
		if (routesInfo[routeType] === null && routeImports[routeType]) {
			const { default: importedRoutes } = await routeImports[routeType]();
			setRoutesInfo((prev) => ({
				...prev,
				[routeType]: importedRoutes,
			}));
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

	return { loading, routes, workspaceMode, workspaceNotFound };
};

export default useWorkspaceMode;
