import { useContext, useEffect, useState } from 'react';
import Context from '../../context/context';

const useWorkspaceMode = () => {
	const [info, setInfo] = useState({
		loading: true,
		error: false,
	});

	const {
		profileInfo: { tennantSettingsData, getTenantSettings },
	} = useContext(Context);

	const workspaceMode = tennantSettingsData?.workspaceMode ?? null;

	const fetchWorkspaceModes = async (workspaceId) => {
		try {
			if (!tennantSettingsData) {
				const response = await getTenantSettings();
				const success = response[0] === true;
				if (!success) {
					const error = response[1];
					console.log(error);
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
		const workspaceId = localStorage.getItem('workspaceId');
		fetchWorkspaceModes(workspaceId);
	}, []);

	return { workspaceMode, ...info };
};

export default useWorkspaceMode;
