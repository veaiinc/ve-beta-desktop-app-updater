import { useContext, useEffect, useState } from 'react';
import Context from '../../context/context';
import { useLocation } from 'react-router-dom';

// routes
import publicRoutes, { publicRoutesList } from '../../routes/publicRoutes';
import stableRoutes from '../../routes/stableRoutes';
import betaRoutes from '../../routes/betaRoutes';

const initialState = {
	routes: null,
	error: false,
};

const routeMap = {
	stable: stableRoutes,
	beta: betaRoutes,
	public: [],
};

const useWorkspaceMode = () => {
	const { pathname } = useLocation();
	const [info, setInfo] = useState(initialState);

	const {
		profileInfo: { tennantSettingsData, getTenantSettings },
	} = useContext(Context);

	const workspaceMode = tennantSettingsData?.workspaceMode ?? null; // stable, beta, internal
	const isPublicRoute = publicRoutesList.includes(pathname);
	const loading = isPublicRoute ? false : workspaceMode === null ? true : false;
	const routes = isPublicRoute
		? [...publicRoutes]
		: workspaceMode === 'stable' && !loading
		? [...stableRoutes]
		: workspaceMode === 'beta' && !loading
		? [...betaRoutes]
		: null;

	const fetchWorkspaceMode = async () => {
		try {
			if (workspaceMode === null) {
				const response = await getTenantSettings();
				const success = response[0] === true;
				if (!success) {
					const error = response[1];
					console.error(error);
					setInfo((prev) => ({
						...prev,
						error,
					}));
				}
			}
		} catch (error) {
			setInfo((prev) => ({
				...prev,
				error,
			}));
		}
	};

	useEffect(() => {
		// Fetch workspaceMode only for protected routes
		if (isPublicRoute) return;
		fetchWorkspaceMode();
	}, [isPublicRoute]);

	return { ...info, loading, routes, workspaceMode };
};

export default useWorkspaceMode;
