import { useContext, useEffect, useState } from 'react';
import Context from '../../context/context';
import { publicRoutesList } from '../../routes/publicRoutes';
import { useLocation } from 'react-router-dom';

const useWorkspaceMode = () => {
	const { pathname } = useLocation();
	const [info, setInfo] = useState({
		loading: true,
		error: false,
	});

	const {
		profileInfo: { tennantSettingsData, getTenantSettings },
	} = useContext(Context);

	const workspaceMode = tennantSettingsData?.workspaceMode ?? null;
	const isPublicRoute = publicRoutesList.includes(pathname);

	const fetchWorkspaceModes = async () => {
		try {
			if (!tennantSettingsData) {
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
		setInfo((prev) => ({ ...prev, loading: false }));
	};

	useEffect(() => {
		let isMounted = true;
		if (isPublicRoute || isMounted === false) return;
		fetchWorkspaceModes();
		return () => (isMounted = false);
	}, [isPublicRoute, tennantSettingsData]);

	return { workspaceMode, ...info };
};

export default useWorkspaceMode;
