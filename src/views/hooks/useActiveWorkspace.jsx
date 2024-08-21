import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const useActiveWorkspace = () => {
	const [workspaceId, setActiveWorkspaceId] = useState(() => {
		return localStorage.getItem('workspaceId');
	});

	useEffect(() => {
		localStorage.setItem('workspaceId', workspaceId);
		Cookies.set('workspaceID', workspaceId, {
			// sameSite: 'lax',
			sameSite: 'none',
			domain: window.location.hostname === 'localhost' ? 'localhost' : 've.co',
		});
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
