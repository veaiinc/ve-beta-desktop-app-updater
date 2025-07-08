import { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { fetchDomainName } from '../helpers';
import Context from '../context/context';

const useActiveWorkspace = () => {
	const {
		profileInfo: { tennantSettingsData, getTenantSettings },
	} = useContext(Context);

	useEffect(() => {
		if (!tennantSettingsData) getTenantSettings();
	}, [tennantSettingsData]);

	const workspaceIds = tennantSettingsData?.workspaceIds;
	const length = workspaceIds?.length;
	const activeWorkspaceId = workspaceIds[length - 1]; // last workspaceId will be set as active workspaceId in localstorage and cookies

	useEffect(() => {
		if (!activeWorkspaceId) return;
		localStorage.setItem('workspaceId', activeWorkspaceId);
		const domain = fetchDomainName();
		Cookies.set('workspaceId', activeWorkspaceId, {
			sameSite: 'lax',
			domain,
		});
	}, [activeWorkspaceId]);
};

export default useActiveWorkspace;
