import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { fetchDomainName } from '../../helpers';

const useActiveWorkspace = () => {
	const [workspaceId, setActiveWorkspaceId] = useState(() => {
		return localStorage.getItem('workspaceId') ?? false;
	});

	useEffect(() => {
		if (workspaceId) {
			localStorage.setItem('workspaceId', workspaceId);
			const host = fetchDomainName();
			Cookies.set('workspaceID', workspaceId, {
				sameSite: 'lax',
				domain: host,
			});
		}
	}, [workspaceId]);

	useEffect(() => {
		const handleStorageChange = (e) => {
			if (e.key === 'workspaceId') {
				setActiveWorkspaceId(e.newValue);
			}
		};

		window.addEventListener('storage', handleStorageChange);

		return () => {
			window.removeEventListener('storage', handleStorageChange);
		};
	}, []);

	return [workspaceId, setActiveWorkspaceId];
};

export default useActiveWorkspace;
