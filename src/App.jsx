import { Routes, Route, useLocation } from 'react-router-dom';
import useWorkspaceMode from './hooks/useWorkspaceMode';
import { useEffect, useState } from 'react';
import useVoiceIntegration from './hooks/useVoiceIntegration';
import NotchDropVoiceActivator from './components/NotchDropVoiceActivator';
// import PerformanceMonitor from './components/PerformanceMonitor';
import DragHandle from './components/DragHandle';
// Removed complex translucency utilities - now using simplified CSS approach
import { GlassModeProvider, useGlassMode } from './context/GlassModeContext.jsx';
import { initializeGlassModeSync } from './helpers/glassModeSync';
import { useNotchDropSync } from './hooks/useNotchDropSync';
import useLoginWindowResize from './hooks/useLoginWindowResize';

// ✅ REVERTED: Back to regular imports (lazy loading broke production)
import VoiceAgentParent from './views/features/voiceAgent/VoiceAgentParent';
import UploadProgressPopup from './views/components/globalComponents/UploadProgressPopup/UploadProgressPopup';
import DownloadProgressPopup from './views/components/globalComponents/DownloadProgressPopup/DownloadProgressPopup';
import UpdateReadyPopup from './views/components/globalComponents/UpdateReadyPopup/UpdateReadyPopup';
import WindowChrome from './components/WindowChrome.jsx';

const parseIntervalMinutes = (value, fallback = 60) => {
	const parsed = Number.parseInt(value, 10);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const UPDATE_CHECK_INTERVAL_MINUTES = parseIntervalMinutes(
	import.meta.env.VITE_UPDATE_CHECK_INTERVAL_MINUTES,
);
const UPDATE_CHECK_INTERVAL_MS = UPDATE_CHECK_INTERVAL_MINUTES * 60 * 1000;

// AppContent component that uses glass mode context
const AppContent = () => {
	const { routes } = useWorkspaceMode();
	const location = useLocation();

	// Global NotchDrop sync - keeps NotchDrop updated with meeting data across all routes
	useNotchDropSync();

	// Manage window width: 481px for login, 1366px after login
	useLoginWindowResize();

	const [updateStatus, setUpdateStatus] = useState(null);
	const [isUpdatePopupVisible, setIsUpdatePopupVisible] = useState(false);
	const [updateProgress, setUpdateProgress] = useState(null);
	// const [showUpdateNotification, setShowUpdateNotification] = useState(false); // Commented out for auto restart

	// NotchDrop Voice Integration - DIRECT APPROACH
	const [showVoiceFromNotch, setShowVoiceFromNotch] = useState(false);

	// Determine if user is authenticated based on route and token
	const isAuthenticated = () => {
		const token = localStorage.getItem('usertoken');
		const isPublicRoute = [
			'/',
			'/verify-user',
			'/onboarding',
			'/download-app',
			'/privacy-policy',
			'/terms-of-service',
			'/cookie-policy',
			'/changelog',
			'/user/verify-oauth-user',
		].includes(location.pathname);
		const isReferralRoute = location.pathname.startsWith('/referral/');

		// User is authenticated if they have a token and are not on public routes
		return token && token.trim() !== '' && !isPublicRoute && !isReferralRoute;
	};

	const [showWindowChrome, setShowWindowChrome] = useState(!isAuthenticated());

	// Use glass mode context instead of local state
	const { isGlassModeEnabled } = useGlassMode();

	// Initialize glass mode sync on app start
	useEffect(() => {
		initializeGlassModeSync();
	}, []);

	// Voice integration for NotchDrop (disabled when LiveKit is active)
	const [disableOldVoiceIntegration, setDisableOldVoiceIntegration] = useState(false);
	const voiceIntegration = useVoiceIntegration();

	// ⚡ PERFORMANCE FIX: Consolidated voice activation listeners
	useEffect(() => {
		// Single handler for all voice activation events
		const handleVoiceActivation = (event, data) => {
			// Check if this is a valid voice activation
			const isValidActivation =
				!data ||
				data.type === 'ACTIVATE_VOICE_AGENT' ||
				data.source === 'notchdrop_voice_button';

			if (isValidActivation) {
				setShowVoiceFromNotch(true);

				// Use requestAnimationFrame for better performance than setTimeout
				requestAnimationFrame(() => {
					// Find and click the voice agent start button
					const actionButtons = document.querySelectorAll('.action-button');
					if (actionButtons.length > 0) {
						actionButtons[0].click();
					}
				});
			}
		};

		// ⚡ OPTIMIZATION: Single consolidated listener instead of 6 separate ones
		if (window.electronApi?.ipcRenderer) {
			window.electronApi.ipcRenderer.on('send-chat-message-to-askai', handleVoiceActivation);
			window.electronApi.ipcRenderer.on('notchdrop:showVoiceAgent', handleVoiceActivation);
			window.electronApi.ipcRenderer.on(
				'notchdrop:activate-voice-agent',
				handleVoiceActivation,
			);
		}

		// Single custom event handler for DOM events
		const handleCustomVoiceEvent = () => setShowVoiceFromNotch(true);
		window.addEventListener('notchdrop-voice-activate', handleCustomVoiceEvent);
		window.addEventListener('show-voice-agent', handleCustomVoiceEvent);
		window.addEventListener('start-voice-agent', handleCustomVoiceEvent);

		return () => {
			if (window.electronApi?.ipcRenderer) {
				window.electronApi.ipcRenderer.removeListener(
					'send-chat-message-to-askai',
					handleVoiceActivation,
				);
				window.electronApi.ipcRenderer.removeListener(
					'notchdrop:showVoiceAgent',
					handleVoiceActivation,
				);
				window.electronApi.ipcRenderer.removeListener(
					'notchdrop:activate-voice-agent',
					handleVoiceActivation,
				);
			}
			window.removeEventListener('notchdrop-voice-activate', handleCustomVoiceEvent);
			window.removeEventListener('show-voice-agent', handleCustomVoiceEvent);
			window.removeEventListener('start-voice-agent', handleCustomVoiceEvent);
		};
	}, []);

	// ⚡ PERFORMANCE FIX: Combined voice integration setup
	useEffect(() => {
		// Expose voiceIntegration to window for NotchDrop access
		if (voiceIntegration && !disableOldVoiceIntegration && !window.voiceIntegration) {
			window.voiceIntegration = voiceIntegration;
		} else if (disableOldVoiceIntegration && window.voiceIntegration) {
			delete window.voiceIntegration;
		}

		// Monitor voice connection state and update NotchDrop
		if (voiceIntegration?.isConnected && window.electronApi?.notchdrop) {
			window.electronApi.notchdrop.updateVoiceConnectionState(
				voiceIntegration.isConnected ? 'connected' : 'disconnected',
			);
		}

		return () => {
			if (window.voiceIntegration) {
				delete window.voiceIntegration;
			}
		};
	}, [voiceIntegration, disableOldVoiceIntegration, voiceIntegration?.isConnected]);

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

	// ⚡ PERFORMANCE FIX: Optimized update status listener
	useEffect(() => {
		if (!window?.electronApi?.onUpdateStatus) return;

		const handleUpdateStatus = (data) => {
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
		};

		window.electronApi.onUpdateStatus(handleUpdateStatus);

		return () => {
			window.electronApi?.removeUpdateStatusListener?.();
		};
	}, []);

	// Mirror auto-update logs from main process into renderer console
	useEffect(() => {
		if (!window?.electronApi?.onAutoUpdateLog) {
			return undefined;
		}

		const handleAutoUpdateLog = (entry) => {
			if (!entry) {
				return;
			}

			const { level = 'info', formatted, message, timestamp } = entry;
			const output = formatted || message || '';
			const prefix = timestamp ? `[AutoUpdate ${timestamp}]` : '[AutoUpdate]';
			const logger = console[level] || console.log;
			logger(`${prefix} ${output}`);
		};

		window.electronApi.onAutoUpdateLog(handleAutoUpdateLog);

		return () => {
			window.electronApi?.removeAutoUpdateLogListener?.();
		};
	}, []);

	// Schedule periodic update checks based on configurable interval
	useEffect(() => {
		if (!window?.electronApi?.checkForUpdatesManual) {
			console.warn('⚠️ Update scheduler: electronApi.checkForUpdatesManual is unavailable');
			return undefined;
		}

		console.log(
			`🕒 Update scheduler initialized - interval: ${UPDATE_CHECK_INTERVAL_MINUTES} minute(s)`,
		);

		const intervalId = setInterval(() => {
			console.log(
				`🕒 Update scheduler tick - checking for updates (every ${UPDATE_CHECK_INTERVAL_MINUTES} minute(s))`,
			);
			handleCheckForUpdates();
		}, UPDATE_CHECK_INTERVAL_MS);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	// Update window chrome visibility when route or authentication state changes
	useEffect(() => {
		setShowWindowChrome(!isAuthenticated());
	}, [location.pathname]);

	// Glass mode is now handled by CSS classes - no complex initialization needed

	return (
		<div className="app-content glass-app" style={{ height: '100%' }}>
			{/* ⚡ PERFORMANCE MONITOR - tracks app performance in development */}
			{/* <PerformanceMonitor /> */}

			{/* Drag Handle - provides window dragging functionality */}
			<DragHandle />

			{/* NotchDrop Voice Activator - handles LiveKit voice integration */}
			<NotchDropVoiceActivator />

			{showWindowChrome && <WindowChrome />}

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
			)}   */}
			{/* <button
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
				</button> */}

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
