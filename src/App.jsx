import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import useWorkspaceMode from './hooks/useWorkspaceMode';

const App = () => {
	const { routes } = useWorkspaceMode();

	const handleCheckForUpdates = async () => {
		try {
			const result = await window?.electronApi?.checkForUpdates();
			console.log('Update check result:', result);
		} catch (error) {
			console.error('Error checking for updates:', error);
		}
	};

	const handleDownloadUpdate = async () => {
		try {
			const result = await window?.electronApi?.downloadUpdate();
			console.log('Download result:', result);
		} catch (error) {
			console.error('Error downloading update:', error);
		}
	};

	useEffect(() => {
		// Set up update status listener
		if (window?.electronApi?.onUpdateStatus) {
			window.electronApi.onUpdateStatus((data) => {
				console.log('Update status:', data);
				// Handle different update statuses here
				switch (data.status) {
					case 'checking':
						console.log('Checking for updates...');
						break;
					case 'available':
						console.log(`Update available: ${data.version}`);
						// Automatically start download when update is available
						handleDownloadUpdate();
						break;
					case 'not-available':
						console.log('No updates available');
						break;
					case 'downloaded':
						console.log(`Update downloaded: ${data.version}`);
						console.log('Update will be installed when the app is restarted');
						break;
					case 'error':
						console.error('Update error:', data.error);
						// Handle specific error types
						if (data.error && data.error.includes('Code signature')) {
							console.log(
								'This is a code signing issue. In development, this is expected.',
							);
							console.log(
								'For production, ensure proper code signing is configured.',
							);
						}
						break;
				}
			});
		}

		// Check for updates on app start
		handleCheckForUpdates();

		// Cleanup listener on unmount
		return () => {
			if (window?.electronApi?.removeUpdateStatusListener) {
				window.electronApi.removeUpdateStatusListener();
			}
		};
	}, []);

	return (
		<Routes>
			{routes?.map((route) => (
				<Route key={route.path} path={route.path} element={route.element} />
			))}
		</Routes>
	);
};

export default App;
