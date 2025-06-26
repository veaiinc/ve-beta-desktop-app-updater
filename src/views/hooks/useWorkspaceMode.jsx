import { useContext, useEffect } from 'react';
import Context from '../../context/context';
import { matchPath, useLocation } from 'react-router-dom';

// routes
import publicRoutes, { publicRoutesList } from '../../routes/publicRoutes';
import stableRoutes from '../../routes/stableRoutes';
import betaRoutes from '../../routes/betaRoutes';
import fallbackRoute from '../../routes/fallbackRoute';

const useWorkspaceMode = () => {
	const { pathname } = useLocation();

	const {
		profileInfo: { tennantSettingsData, getTenantSettings },
	} = useContext(Context);

	const workspaceMode = tennantSettingsData?.workspaceMode ?? null; // stable, beta, internal
	const isPublicRoute = publicRoutesList.some((routePath) =>
		matchPath({ path: routePath, end: true }, pathname),
	);
	const loading = isPublicRoute ? false : workspaceMode === null; // since public routes don't have workspace mode. Until workspace mode becomes stable/beta, loading is true.
	const routes = isPublicRoute
		? publicRoutes
		: workspaceMode === 'stable'
		? stableRoutes
		: workspaceMode === 'beta'
		? betaRoutes
		: fallbackRoute; // handles reload in protected routes

	const fetchWorkspaceMode = async () => {
		try {
			if (workspaceMode === null) {
				const response = await getTenantSettings();
				const success = response[0] === true;
				if (!success) {
					const error = response[1];
					console.error(error);
				}
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		// Fetch workspaceMode only for protected routes
		if (isPublicRoute) return;
		fetchWorkspaceMode();
	}, [isPublicRoute]);

	return { loading, routes, workspaceMode };
};

export default useWorkspaceMode;
