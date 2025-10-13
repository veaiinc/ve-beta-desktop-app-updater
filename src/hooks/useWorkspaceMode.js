import { useContext, useEffect, useState } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import fallbackRoute from '../routes/fallbackRoute';
import Context from '../context/context';
import { fetchDomainName } from '../helpers';
import useBroadcastChannel from './useBroadcastChannel';
import logout from '../helpers/logout';

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
	'/pricing',
	'/referral/:referralCode',
	'/privacy-policy',
	'/terms-of-service',
	'/cookie-policy',
	'/changelog',
	'/user/verify-oauth-user',
	'/download-app',
];

const routeImports = {
	publicRoutes: () => import('../routes/publicRoutes'),
	stableRoutes: () => import('../routes/stableRoutes'),
	betaRoutes: () => import('../routes/betaRoutes'),
	internalRoutes: () => import('../routes/internalRoutes'),
	workspaceNotFoundRoute: () => import('../routes/workspaceNotFoundRoute'),
	suspendedRoute: () => import('../routes/suspendedRoute'),
};

const routeMap = {
	null: 'fallbackRoute',
	stable: 'stableRoutes',
	beta: 'betaRoutes',
	internal: 'internalRoutes',
	suspended: 'suspendedRoute',
};

const useWorkspaceMode = () => {
	const { pathname } = useLocation();
	const channel = useBroadcastChannel();
	const {
		profileInfo: { tennantSettingsData, getTenantSettings },
		subscriptionInfo: { updateTokenExpiryState },
	} = useContext(Context);

	const [routesInfo, setRoutesInfo] = useState({
		publicRoutes: null,
		stableRoutes: null,
		betaRoutes: null,
		internalRoutes: null,
		fallbackRoute,
		workspaceNotFoundRoute: null,
		suspendedRoute: null,
	});
	const [workspaceNotFound, setWorkspaceNotFound] = useState(false);

	const workspaceMode = tennantSettingsData?.workspaceMode ?? null;
	const isPublicRoute = publicRoutesList.some((routePath) =>
		matchPath({ path: routePath, end: true }, pathname),
	);
	const routeType = isPublicRoute
		? 'publicRoutes'
		: workspaceNotFound
		? 'workspaceNotFoundRoute'
		: routeMap[workspaceMode];
	const routes = routesInfo[routeType] ?? routesInfo['fallbackRoute'];
	const workspaceModeLoading =
		isPublicRoute || workspaceNotFound ? false : workspaceMode === null;
	const workspaceId = localStorage.getItem('workspaceId');

	const fetchMode = async () => {
		try {
			if (workspaceId === null || workspaceId === undefined) {
				logout();
			}
			if (workspaceMode === null || workspaceMode === undefined) {
				const response = await getTenantSettings();
				const success = response[0] === true;
				if (!success) {
					const { code } = response[1];
					if (code === 401) {
						updateTokenExpiryState({ expiredTokenModal: true });
						channel.postMessage('reload');
					} else if (code === 404) setWorkspaceNotFound(true);
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (workspaceMode) {
			localStorage.setItem('workspaceMode', workspaceMode);
		}
	}, [workspaceMode]);

	useEffect(() => {
		if (isPublicRoute) return;
		fetchMode();
	}, [isPublicRoute]);

	useEffect(() => {
		const workspaceIds = tennantSettingsData?.workspaceIds ?? [];
		if (!workspaceIds?.length) return;

		const activeWorkspaceId = workspaceIds[workspaceIds.length - 1];
		if (!activeWorkspaceId) return;

		localStorage.setItem('workspaceId', activeWorkspaceId);
		const domain = fetchDomainName();
		Cookies.set('workspaceId', activeWorkspaceId, {
			sameSite: 'lax',
			domain,
		});
	}, [tennantSettingsData?.workspaceIds]);

	useEffect(() => {
		const importRoutes = async (type) => {
			if (type === 'fallbackRoute') return;
			if (routesInfo[type] === null && routeImports[type]) {
				const { default: importedRoutes } = await routeImports[type]();
				setRoutesInfo((prev) => ({
					...prev,
					[type]: importedRoutes,
				}));
			}
		};
		importRoutes(routeType);
	}, [routeType]);

	return { workspaceModeLoading, routes, workspaceMode, workspaceNotFound };
};

export default useWorkspaceMode;
