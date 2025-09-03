import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import useWorkspaceMode from './hooks/useWorkspaceMode';
import { useWindowStateRestoration } from './hooks/useWindowStateRestoration';

const App = () => {
	const { routes } = useWorkspaceMode();

	// Initialize window state restoration for dynamic island functionality
	useWindowStateRestoration();

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

	const handleForceDownload = async () => {
		try {
			console.log('Attempting force download to bypass checksum verification...');
			const result = await window?.electronApi?.forceDownloadUpdate();
			console.log('Force download result:', result);
			if (result?.success) {
				console.log('Force download initiated successfully');
			} else {
				console.error('Force download failed:', result?.error);
			}
		} catch (error) {
			console.error('Error in force download:', error);
		}
	};

	useEffect(() => {
		if (window.electronApi?.on) {
			window.electronApi.on('start-mic-monitoring', () => {
				window.electronApi.startMicMonitoring();
			});
		} else {
			console.error('❌ window.electronApi.on is not available');
		}

		return () => {};
	}, []);

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
						// Download starts automatically in both dev and production
						break;
					case 'not-available':
						console.log('No updates available');
						break;
					case 'downloaded':
						console.log(`Update downloaded: ${data.version}`);
						console.log('Update will be installed when the app is restarted');
						break;
					case 'download-completed':
						console.log(`Update ready: ${data.version}`);
						console.log(
							data.message || 'App will restart automatically in 3 seconds...',
						);
						break;
					case 'checksum-error':
						console.error('Checksum verification failed:', data.error);
						console.log('Attempting force download to bypass checksum verification...');
						handleForceDownload();
						break;
					case 'download-failed':
						console.error('Download failed:', data.error);
						console.log('Manual intervention may be required');
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
