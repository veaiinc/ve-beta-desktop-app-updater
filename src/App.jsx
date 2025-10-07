import { Routes, Route } from 'react-router-dom';
import useWorkspaceMode from './hooks/useWorkspaceMode';
import { useEffect, useState } from 'react';
import VoiceAgentParent from './views/features/voiceAgent/VoiceAgentParent';
import useVoiceIntegration from './hooks/useVoiceIntegration';
import NotchDropVoiceActivator from './components/NotchDropVoiceActivator';
import UploadProgressPopup from './views/components/globalComponents/UploadProgressPopup/UploadProgressPopup';
import DownloadProgressPopup from './views/components/globalComponents/DownloadProgressPopup/DownloadProgressPopup';
import UpdateReadyPopup from './views/components/globalComponents/UpdateReadyPopup/UpdateReadyPopup';
// Removed complex translucency utilities - now using simplified CSS approach
import { GlassModeProvider, useGlassMode } from './context/GlassModeContext.jsx';
import { initializeGlassModeSync } from './helpers/glassModeSync';

// AppContent component that uses glass mode context
const AppContent = () => {
	const { routes } = useWorkspaceMode();
	const [updateStatus, setUpdateStatus] = useState(null);
	const [isUpdatePopupVisible, setIsUpdatePopupVisible] = useState(false);
	const [updateProgress, setUpdateProgress] = useState(null);
	// const [showUpdateNotification, setShowUpdateNotification] = useState(false); // Commented out for auto restart

	// NotchDrop Voice Integration - DIRECT APPROACH
	const [showVoiceFromNotch, setShowVoiceFromNotch] = useState(false);

	// Use glass mode context instead of local state
	const { isGlassModeEnabled } = useGlassMode();

	// Initialize glass mode sync on app start
	useEffect(() => {
		initializeGlassModeSync();
	}, []);

	// Voice integration for NotchDrop (disabled when LiveKit is active)
	const [disableOldVoiceIntegration, setDisableOldVoiceIntegration] = useState(false);
	const voiceIntegration = useVoiceIntegration();

	// Listen for NotchDrop voice activation
	useEffect(() => {
		const handleNotchDropVoice = (event, data) => {
			console.log('🎤 DIRECT: Received NotchDrop voice activation:', data);

			if (
				data &&
				(data.type === 'ACTIVATE_VOICE_AGENT' || data.source === 'notchdrop_voice_button')
			) {
				console.log('🚀 DIRECT: Activating voice agent from NotchDrop');
				setShowVoiceFromNotch(true);

				// Auto-start the voice agent after a short delay
				setTimeout(() => {
					console.log('🎤 DIRECT: Auto-clicking voice agent start button');

					// Find and click the voice agent start button
					const actionButtons = document.querySelectorAll('.action-button');
					if (actionButtons.length > 0) {
						console.log('🎤 Found action button, clicking to start voice agent...');
						actionButtons[0].click();
					} else {
						// Try alternative selectors
						const micButtons = document.querySelectorAll(
							'[class*="mic"], button[data-enabled="false"]',
						);
						if (micButtons.length > 0) {
							console.log('🎤 Found mic button, clicking...');
							micButtons[0].click();
						}
					}
				}, 1000); // Wait 1 second for component to mount
			}
		};

		// Listen for multiple IPC events from NotchDrop
		if (window.electronApi && window.electronApi.ipcRenderer) {
			// Listen for the askAI message (where our voice activation is sent)
			window.electronApi.ipcRenderer.on('send-chat-message-to-askai', handleNotchDropVoice);

			// Also listen for direct voice activation events
			window.electronApi.ipcRenderer.on('notchdrop:showVoiceAgent', (event, data) => {
				console.log('🎤 DIRECT: Direct voice agent show request');
				setShowVoiceFromNotch(true);
			});

			window.electronApi.ipcRenderer.on('notchdrop:activate-voice-agent', (event, data) => {
				console.log('🎤 DIRECT: Voice agent activation request');
				setShowVoiceFromNotch(true);
			});
		}

		// Also listen for custom events
		const handleCustomVoiceEvent = (event) => {
			console.log('🎤 DIRECT: Custom voice activation event');
			setShowVoiceFromNotch(true);
		};

		window.addEventListener('notchdrop-voice-activate', handleCustomVoiceEvent);
		window.addEventListener('show-voice-agent', handleCustomVoiceEvent);
		window.addEventListener('start-voice-agent', handleCustomVoiceEvent);

		return () => {
			if (window.electronApi && window.electronApi.ipcRenderer) {
				window.electronApi.ipcRenderer.removeListener(
					'send-chat-message-to-askai',
					handleNotchDropVoice,
				);
				window.electronApi.ipcRenderer.removeListener(
					'notchdrop:showVoiceAgent',
					handleNotchDropVoice,
				);
				window.electronApi.ipcRenderer.removeListener(
					'notchdrop:activate-voice-agent',
					handleNotchDropVoice,
				);
			}
			window.removeEventListener('notchdrop-voice-activate', handleCustomVoiceEvent);
			window.removeEventListener('show-voice-agent', handleCustomVoiceEvent);
			window.removeEventListener('start-voice-agent', handleCustomVoiceEvent);
		};
	}, []);

	// Essential voice integration for NotchDrop (disabled when LiveKit is active)
	useEffect(() => {
		// Expose voiceIntegration to window for NotchDrop access only when not using LiveKit
		if (voiceIntegration && !disableOldVoiceIntegration && !window.voiceIntegration) {
			window.voiceIntegration = voiceIntegration;
			// console.log('✅ voiceIntegration exposed to window.voiceIntegration');
		} else if (disableOldVoiceIntegration && window.voiceIntegration) {
			delete window.voiceIntegration;
			// console.log('🚫 Old voice integration disabled - using LiveKit instead');
		}
		return () => {
			if (window.voiceIntegration) {
				delete window.voiceIntegration;
			}
		};
	}, [voiceIntegration, disableOldVoiceIntegration]);

	// Monitor voice connection state and update NotchDrop
	useEffect(() => {
		if (voiceIntegration && window.electronApi) {
			const { isConnected } = voiceIntegration;

			if (isConnected) {
				// console.log('🔄 Voice connected - notifying NotchDrop...');
				window.electronApi.notchdrop.updateVoiceConnectionState('connected');
			} else {
				// console.log('🔄 Voice disconnected - notifying NotchDrop...');
				window.electronApi.notchdrop.updateVoiceConnectionState('disconnected');
			}
		}
	}, [voiceIntegration?.isConnected]);

	// Handle NotchDrop voice disconnect
	useEffect(() => {
		const handleNotchDropVoiceDisconnect = async (event) => {
			// console.log(`🔌 NotchDrop voice disconnect: ${event.type}`);
			if (voiceIntegration && voiceIntegration.disconnect) {
				try {
					// console.log('🔌 Disconnecting voice agent from NotchDrop X button...');
					await voiceIntegration.disconnect();
					console.log('✅ Voice agent disconnected successfully from NotchDrop!');
				} catch (error) {
					console.error(`❌ NotchDrop voice disconnect failed: ${error.message}`);
				}
			}
		};

		window.addEventListener('notchdrop-voice-disconnect', handleNotchDropVoiceDisconnect);

		return () => {
			window.removeEventListener(
				'notchdrop-voice-disconnect',
				handleNotchDropVoiceDisconnect,
			);
		};
	}, [voiceIntegration]);

	// Listen for old voice integration disable/enable events
	useEffect(() => {
		const handleDisableOldVoiceIntegration = (event) => {
			// console.log('🚫 Received disable old voice integration event:', event.detail);
			setDisableOldVoiceIntegration(event.detail.disable);
		};

		window.addEventListener('disable-old-voice-integration', handleDisableOldVoiceIntegration);

		return () => {
			window.removeEventListener(
				'disable-old-voice-integration',
				handleDisableOldVoiceIntegration,
			);
		};
	}, []);

	const handleCheckForUpdates = async () => {
		try {
			console.log('🔍 Manual update check initiated...');
			const result = await window?.electronApi?.checkForUpdatesManual();

			if (result.success) {
				console.log('✅ Update check initiated successfully');
			} else {
				console.warn('⚠️ Update check failed:', result.error);
			}
		} catch (error) {
			console.error('❌ Error checking for updates:', error);
		}
	};

	const handleRestartApp = async () => {
		if (!window?.electronApi?.restartApp) {
			return { success: false, error: 'Restart API unavailable' };
		}

		try {
			return await window.electronApi.restartApp();
		} catch (error) {
			console.error('❌ Error restarting app:', error);
			return { success: false, error: error?.message || 'Unexpected restart error' };
		}
	};

	useEffect(() => {
		// Only show popup when update is fully downloaded
		if (updateStatus?.status === 'downloaded') {
			setIsUpdatePopupVisible(true);
		}
		// Don't hide the popup during downloading phase - only hide for other states
		else if (updateStatus?.status && updateStatus.status !== 'downloading') {
			setIsUpdatePopupVisible(false);
		}
	}, [updateStatus]);

	useEffect(() => {
		// Set up update status listener
		if (window?.electronApi?.onUpdateStatus) {
			const handleUpdateStatus = (data) => {
				console.log('📱 Update status received:', data);
				setUpdateStatus(data);

				// Track download progress
				if (data.status === 'downloading' && data.progress !== undefined) {
					setUpdateProgress({
						percent: Math.round(data.progress),
						bytesPerSecond: data.bytesPerSecond,
						total: data.total,
						transferred: data.transferred,
					});
				} else if (data.status !== 'downloading') {
					setUpdateProgress(null);
				}

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

					case 'downloading':
						console.log(`📥 Downloading update: ${Math.round(data.progress || 0)}%`);
						break;

					case 'downloaded':
						console.log(`✅ Update downloaded: ${data.version}`);
						console.log('📣 Update ready for installation');
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
						console.log('💡 Suggestion:', data.details?.suggestion);
						break;

					case 'permission-error':
						console.error('🔐 Permission error:', data.error);
						console.log('💡 Suggestion:', data.details?.suggestion);
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

	// Glass mode is now handled by CSS classes - no complex initialization needed

	return (
		<div className="app-content glass-app">
			{/* NotchDrop Voice Activator - handles LiveKit voice integration */}
			<NotchDropVoiceActivator />

			{/* Test Permission Overlay Button - Remove in production */}
			{/* {process.env.NODE_ENV === 'development' && (
				<button
					onClick={() => window.electronApi?.permission?.showWindow()}
					style={{
						position: 'fixed',
						top: '20px',
						left: '20px',
						background: '#42e09b',
						color: '#121212',
						border: 'none',
						padding: '12px 24px',
						borderRadius: '8px',
						cursor: 'pointer',
						fontSize: '14px',
						fontWeight: '600',
						zIndex: 9999,
						boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
					}}
				>
					Test Permission Overlay
				</button>
			)} */}
		

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

			{/* NotchDrop Voice Agent Integration - DIRECT */}
			{showVoiceFromNotch && <VoiceAgentParent />}

			{/* Global Upload Progress Popup - persists across all routes */}
			<UploadProgressPopup />

			{/* Global Download Progress Popup - persists across all routes */}
			<DownloadProgressPopup />

			{/* Update Progress Indicator */}
			{updateProgress && (
				<div
					style={{
						position: 'fixed',
						top: '20px',
						right: '20px',
						background: '#2196F3',
						color: 'white',
						padding: '16px',
						borderRadius: '8px',
						boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
						zIndex: 9999,
						maxWidth: '300px',
						fontSize: '14px',
					}}
				>
					<div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
						📥 Downloading Update...
					</div>
					<div style={{ marginBottom: '8px' }}>{updateProgress.percent}% complete</div>
					<div
						style={{
							width: '100%',
							height: '4px',
							background: 'rgba(255,255,255,0.3)',
							borderRadius: '2px',
							overflow: 'hidden',
						}}
					>
						<div
							style={{
								width: `${updateProgress.percent}%`,
								height: '100%',
								background: 'white',
								transition: 'width 0.3s ease',
							}}
						/>
					</div>
					{updateProgress.bytesPerSecond && (
						<div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>
							{Math.round(updateProgress.bytesPerSecond / 1024)} KB/s
						</div>
					)}
				</div>
			)}

			{isUpdatePopupVisible && updateStatus?.status === 'downloaded' && (
				<UpdateReadyPopup
					updateInfo={updateStatus}
					onRestart={handleRestartApp}
					onDismiss={() => setIsUpdatePopupVisible(false)}
				/>
			)}
		</div>
	);
};

// Main App component with GlassModeProvider
const App = () => {
	return (
		<GlassModeProvider>
			<AppContent />
		</GlassModeProvider>
	);
};

export default App;
