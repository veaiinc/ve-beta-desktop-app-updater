import { useEffect, useState } from 'react';

// Checks workspace migration status via Google Apps Script endpoint
// Returns: { migrationLoading, migrationInProgress }
const useMigrationGate = () => {
	const [migrationLoading, setMigrationLoading] = useState(false);
	const [migrationInProgress, setMigrationInProgress] = useState(false);

	useEffect(() => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			if (!usertoken || !workspaceId) return; // Only check after login

			let aborted = false;
			setMigrationLoading(true);
			const url = `https://script.google.com/macros/s/AKfycbxbBbrHJzhGLvbb35_g9dzJbTMcRluKwVdNrUlXnod-MdWz11NMfN98kWl9LQgAlJtW/exec?workspaceId=${encodeURIComponent(
				workspaceId,
			)}`;

			fetch(url)
				.then((res) => res.json())
				.then((data) => {
					if (aborted) return;
					const code = Number(data?.statusCode);
					setMigrationInProgress(code === 102);
				})
				.catch(() => {
					if (aborted) return;
					setMigrationInProgress(false);
				})
				.finally(() => {
					if (aborted) return;
					setMigrationLoading(false);
				});

			return () => {
				aborted = true;
			};
		} catch (err) {
			setMigrationLoading(false);
			setMigrationInProgress(false);
		}
	}, []);

	return { migrationLoading, migrationInProgress };
};

export default useMigrationGate;
