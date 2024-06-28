import { useState, useEffect } from 'react';

const useActiveWorkspace = () => {
	const [workspaceId, setActiveWorkspaceId] = useState(() => {
		return localStorage.getItem('workspaceId');
	});

	useEffect(() => {
		localStorage.setItem('workspaceId', workspaceId);
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
