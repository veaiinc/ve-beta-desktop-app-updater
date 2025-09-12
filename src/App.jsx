import { Routes, Route } from 'react-router-dom';
import useWorkspaceMode from './hooks/useWorkspaceMode';
import { useEffect, useState, useContext } from 'react';
import Context from './context/context';
import UploadProgressPopup from './components/UploadProgressPopup/UploadProgressPopup';

const App = () => {
	const { routes } = useWorkspaceMode();
	const [updateStatus, setUpdateStatus] = useState(null);
	// const [showUpdateNotification, setShowUpdateNotification] = useState(false); // Commented out for auto restart

	// Get upload session state from global context
	const {
		galleryInfo: {
			uploadSessions,
			showUploadProgressPopup,
			removeUploadSession,
			hideUploadProgressPopup,
			updateUploadSession,
		},
	} = useContext(Context);

	// Global upload handlers
	const handleUploadComplete = (sessionId) => {
		// Remove completed session from global context
		removeUploadSession(sessionId);
	};

	const handleUploadCancel = (sessionId) => {
		// Remove cancelled session from global context
		removeUploadSession(sessionId);
	};

	const handleCloseUploadProgressPopup = () => {
		// Hide the upload progress popup (but keep sessions for background processing)
		hideUploadProgressPopup();
	};

	const handleUpdateUploadSession = (sessionId, updates) => {
		// Update specific upload session in global context
		updateUploadSession(sessionId, updates);
	};

	const handleCheckForUpdates = async () => {
		try {
			const result = await window?.electronApi?.checkForUpdates();
			console.log('✅ Update check initiated:', result);
		} catch (error) {
			console.error('❌ Error checking for updates:', error);
		}
	};

	// Commented out for auto restart - no longer needed
	// const handleRestartApp = async () => {
	// 	try {
	// 		const result = await window?.electronApi?.restartApp();
	// 		if (!result?.success) {
	// 			console.warn('⚠️ Restart failed:', result?.error);
	// 		}
	// 	} catch (error) {
	// 		console.error('❌ Error restarting app:', error);
	// 	}
	// };

	useEffect(() => {
		// Set up update status listener
		if (window?.electronApi?.onUpdateStatus) {
			const handleUpdateStatus = (data) => {
				console.log('📱 Update status received:', data);
				setUpdateStatus(data);

				switch (data.status) {
					case 'checking':
						console.log('🔍 Checking for updates...');
						break;

					case 'available':
						console.log(`🆕 Update available: ${data.version}`);
						console.log('⬇️ Download starting automatically...');
						break;

					case 'not-available':
						console.log('✅ No updates available');
						break;

					case 'downloaded':
						console.log(`✅ Update downloaded: ${data.version}`);
						console.log('🔄 App will restart automatically in 3 seconds...');
						// setShowUpdateNotification(true); // Commented out for auto restart
						break;

					case 'download-failed':
						console.error('❌ Download failed:', data.error);
						break;

					case 'checksum-error':
						console.error('🔒 Checksum verification failed:', data.error);
						console.log('💡 Suggestion:', data.details?.suggestion);
						break;

					case 'network-error':
						console.error('🌐 Network error:', data.error);
						break;

					case 'not-found':
						console.error('🔍 Update file not found:', data.error);
						break;

					case 'error':
						console.error('❌ Update error:', data.error);
						break;

					case 'installation-error':
						console.error('🔧 Installation error:', data.error);
						console.log('💡 Suggestion:', data.details?.suggestion);
						break;

					default:
						console.log('📱 Unknown update status:', data.status);
				}
			};

			window.electronApi.onUpdateStatus(handleUpdateStatus);

			// Check for updates on app start (after a delay to let the app settle)
			setTimeout(() => {
				handleCheckForUpdates();
			}, 2000);
		}

		// Cleanup listener on unmount
		return () => {
			if (window?.electronApi?.removeUpdateStatusListener) {
				window.electronApi.removeUpdateStatusListener();
			}
		};
	}, []);

	return (
		<>
			{/* Update Notification - Commented out for auto restart */}
			{/* {showUpdateNotification && updateStatus?.status === 'downloaded' && (
				<div
					style={{
						position: 'fixed',
						top: '20px',
						right: '20px',
						background: '#4CAF50',
						color: 'white',
						padding: '16px',
						borderRadius: '8px',
						boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
						zIndex: 9999,
						maxWidth: '300px',
					}}
				>
					<div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🎉 Update Ready!</div>
					<div style={{ marginBottom: '12px' }}>
						Version {updateStatus.version} is ready to install.
					</div>
					<div style={{ display: 'flex', gap: '8px' }}>
						<button
							onClick={handleRestartApp}
							style={{
								background: 'white',
								color: '#4CAF50',
								border: 'none',
								padding: '6px 12px',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '14px',
								fontWeight: 'bold',
							}}
						>
							Restart Now
						</button>
						<button
							onClick={() => setShowUpdateNotification(false)}
							style={{
								background: 'transparent',
								color: 'white',
								border: '1px solid white',
								padding: '6px 12px',
								borderRadius: '4px',
								cursor: 'pointer',
								fontSize: '14px',
							}}
						>
							Later
						</button>
					</div>
				</div>
			)} */}

			<Routes>
				{routes?.map((route) => (
					<Route key={route.path} path={route.path} element={route.element} />
				))}
			</Routes>

			{/* Global Upload Progress Popup - persists across all routes */}
			{showUploadProgressPopup && uploadSessions?.length > 0 && (
				<UploadProgressPopup
					uploadSessions={uploadSessions}
					onClose={handleCloseUploadProgressPopup}
					onComplete={handleUploadComplete}
					onCancel={handleUploadCancel}
					onUpdateSession={handleUpdateUploadSession}
				/>
			)}
		</>
	);
};

export default App;
