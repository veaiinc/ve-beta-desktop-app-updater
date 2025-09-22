import { useState, useEffect } from 'react';
import { Mic, Monitor, Camera } from 'lucide-react';
import './permissionOverlay.scss';

const PermissionOverlay = () => {
	const [microphonePermission, setMicrophonePermission] = useState(false);
	const [screenPermission, setScreenPermission] = useState(false);
	const [cameraPermission, setCameraPermission] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [currentStep, setCurrentStep] = useState(1); // 1: Permissions, 2: Shortcuts
	const [permissionDetails, setPermissionDetails] = useState({
		microphone: { status: 'unknown', message: '' },
		screen: { status: 'unknown', message: '' },
		camera: { status: 'unknown', message: '' },
	});

	const RUNTIME_PLATFORM = process.env.VE_FORCE_PLATFORM || process.platform;
	const isMac = RUNTIME_PLATFORM === 'darwin';

	// Additional fallback check for better macOS detection
	const isMacFallback = process.platform === 'darwin' || navigator.platform.includes('Mac');
	const finalIsMac = isMac || isMacFallback;

	// Debug logging to help troubleshoot platform detection
	console.log('🔍 PermissionOverlay Platform Debug:', {
		processPlatform: process.platform,
		runtimePlatform: RUNTIME_PLATFORM,
		isMac: isMac,
		isMacFallback: isMacFallback,
		finalIsMac: finalIsMac,
		envForcePlatform: process.env.VE_FORCE_PLATFORM,
		userAgent: navigator.userAgent,
		navigatorPlatform: navigator.platform,
	});

	useEffect(() => {
		// Check current permissions on mount
		checkPermissions();

		// Listen for window close events
		const handleBeforeUnload = () => {
			window.dispatchEvent(new CustomEvent('permission-window-closed'));
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, []);

	const checkPermissions = async () => {
		try {
			// Check microphone permission
			const micResult = await window.electronApi.permission.checkMicrophonePermission();
			setMicrophonePermission(micResult.hasPermission);
			setPermissionDetails((prev) => ({
				...prev,
				microphone: {
					status: micResult.permission || 'unknown',
					message: micResult.message || '',
				},
			}));

			// Check screen permission
			const screenResult = await window.electronApi.permission.checkScreenPermission();
			setScreenPermission(screenResult.hasPermission);
			setPermissionDetails((prev) => ({
				...prev,
				screen: {
					status: screenResult.permission || 'unknown',
					message: screenResult.message || '',
				},
			}));

			// Check camera permission
			const cameraResult = await window.electronApi.permission.checkCameraPermission();
			setCameraPermission(cameraResult.hasPermission);
			setPermissionDetails((prev) => ({
				...prev,
				camera: {
					status: cameraResult.permission || 'unknown',
					message: cameraResult.message || '',
				},
			}));

			setIsLoading(false);
		} catch (error) {
			console.error('Error checking permissions:', error);
			setIsLoading(false);
		}
	};

	const getPermissionStatusText = (status) => {
		switch (status) {
			case 'granted':
				return 'Granted';
			case 'denied':
				return 'Denied';
			case 'not-determined':
				return 'Not Requested';
			case 'restricted':
				return 'Restricted';
			default:
				return 'Unknown';
		}
	};

	const getPermissionStatusClass = (status) => {
		switch (status) {
			case 'granted':
				return 'status-granted';
			case 'denied':
				return 'status-denied';
			case 'not-determined':
				return 'status-not-determined';
			case 'restricted':
				return 'status-restricted';
			default:
				return 'status-unknown';
		}
	};

	// const handleMicrophoneToggle = async () => {
	// 	try {
	// 		console.log('🔈 Microphone toggle clicked');

	// 		// Re-check current permission first
	// 		const micStatus = await window.electronApi.permission.checkMicrophonePermission();
	// 		const hasMic = !!micStatus?.hasPermission;

	// 		if (hasMic) {
	// 			// Already granted; keep it true and do not toggle off
	// 			setMicrophonePermission(true);
	// 			checkAllPermissionsGranted();
	// 			return;
	// 		}

	// 		// Request microphone permission
	// 		const result = await window.electronApi.permission.requestMicrophonePermission();
	// 		if (result?.granted) {
	// 			setMicrophonePermission(true);
	// 			checkAllPermissionsGranted();
	// 		} else {
	// 			await window.electronApi.permission.showMicrophonePermissionHelp();
	// 			setMicrophonePermission(false);
	// 		}
	// 	} catch (error) {
	// 		console.error('Error handling microphone permission:', error);
	// 		try {
	// 			await window.electronApi.permission.showMicrophonePermissionHelp();
	// 		} catch (helpError) {
	// 			console.error('Error showing microphone help:', helpError);
	// 		}
	// 	}
	// };

	// const handleScreenToggle = async () => {
	// 	try {
	// 		console.log('🖥️ Screen permission toggle clicked');
	// 		// Re-check current screen permission
	// 		const screenStatus = await window.electronApi.permission.checkScreenPermission();
	// 		const hasScreen = !!screenStatus?.hasPermission;

	// 		if (hasScreen) {
	// 			setScreenPermission(true);
	// 			checkAllPermissionsGranted();
	// 			return;
	// 		}

	// 		// Attempt request (may not be grantable programmatically on macOS)
	// 		const result = await window.electronApi.permission.requestScreenPermission();
	// 		if (result?.granted) {
	// 			setScreenPermission(true);
	// 			checkAllPermissionsGranted();
	// 		} else {
	// 			await window.electronApi.permission.showScreenPermissionHelp();
	// 			setScreenPermission(false);
	// 		}
	// 	} catch (error) {
	// 		console.error('Error handling screen permission:', error);
	// 		try {
	// 			await window.electronApi.permission.showScreenPermissionHelp();
	// 		} catch (helpError) {
	// 			console.error('Error showing screen recording help:', helpError);
	// 		}
	// 	}
	// };

	// const handleScreenRecordingToggle = async () => {
	// 	try {
	// 		console.log('🎞️ Screen recording toggle clicked');
	// 		const screenStatus = await window.electronApi.permission.checkScreenPermission();
	// 		const hasScreen = !!screenStatus?.hasPermission;
	// 		if (hasScreen) {
	// 			setScreenPermission(true);
	// 			checkAllPermissionsGranted();
	// 			return;
	// 		}
	// 		const result = await window.electronApi.permission.requestScreenPermission();
	// 		if (result?.granted) {
	// 			setScreenPermission(true);
	// 			checkAllPermissionsGranted();
	// 		} else {
	// 			await window.electronApi.permission.showScreenPermissionHelp();
	// 			setScreenPermission(false);
	// 		}
	// 	} catch (error) {
	// 		console.error('Error handling screen recording permission:', error);
	// 		try {
	// 			await window.electronApi.permission.showScreenPermissionHelp();
	// 		} catch (helpError) {
	// 			console.error('Error showing screen recording help:', helpError);
	// 		}
	// 	}
	// };

	// const checkAllPermissionsGranted = () => {
	// 	if (microphonePermission && screenPermission) {
	// 		console.log('🔐 All permissions granted! Notifying main app...');
	// 		// Emit event to notify main app that permissions are granted
	// 		window.dispatchEvent(new CustomEvent('permission-granted'));
	// 		// Close the permission overlay after a short delay
	// 		setTimeout(() => {
	// 			window.electronApi.permission.closeWindow();
	// 		}, 1000);
	// 	}
	// };

	// const handleContinue = () => {
	// 	// Close the permission overlay
	// 	window.electronApi.permission.closeWindow();
	// };

	const handleNext = () => {
		setCurrentStep(2);
	};

	const handleBack = () => {
		setCurrentStep(1);
	};

	const handleFinish = () => {
		// Close the permission overlay
		window.electronApi.permission.closeWindow();
	};

	if (isLoading) {
		return (
			<div className="permission-overlay">
				<div className="permission-container">
					<div className="loading-spinner">Loading...</div>
				</div>
			</div>
		);
	}

	// Shortcuts screen component
	const renderShortcutsScreen = () => (
		<div className="permission-overlay">
			<div className="permission-container">
				{/* Logo */}
				<div className="logo-section">
					<div className="logo">
						<img src={'./ve-black-circle-logo.png'} alt="logo" />
					</div>
				</div>

				{/* Main Content */}
				<div className="content-section">
					<div className="main-title-container">
						<h1 className="main-title">Control at Your Fingertips</h1>
						<p className="subtitle">
							Toggle features instantly with these shortcuts. Control your experience
							and stay in the zone.
						</p>
					</div>

					{/* Shortcuts List */}
					<div className="shortcuts-list">
						{/* Live Intelligence */}
						<div className="shortcut-item">
							<div className="shortcut-info">
								<h3 className="shortcut-title">Live Intelligence</h3>
								<p className="shortcut-description">
									Pull up Ve's real-time insights on your screen.
								</p>
							</div>
							<div className="shortcut-key">
								<kbd>{finalIsMac ? '⌘' : 'Ctrl'}</kbd> + <kbd>\</kbd>
							</div>
						</div>

						{/* Notch */}
						<div className="shortcut-item">
							<div className="shortcut-info">
								<h3 className="shortcut-title">Notch</h3>
								<p className="shortcut-description">
									Toggle the floating island anytime.
								</p>
							</div>
							<div className="shortcut-key">
								<kbd>{finalIsMac ? '⌘' : 'Ctrl'}</kbd> + <kbd>N</kbd>
							</div>
						</div>

						{/* Ask Ve */}
						<div className="shortcut-item">
							<div className="shortcut-info">
								<h3 className="shortcut-title">Ask Ve</h3>
								<p className="shortcut-description">
									Highlight and press to get instant answers.
								</p>
							</div>
							<div className="shortcut-key">
								<kbd>{finalIsMac ? '⌘' : 'Ctrl'}</kbd> + <kbd>↵</kbd>
							</div>
						</div>

						{/* Ve App */}
						<div className="shortcut-item">
							<div className="shortcut-info">
								<h3 className="shortcut-title">Ve App</h3>
								<p className="shortcut-description">
									Quickly tuck Ve away or bring it back.
								</p>
							</div>
							<div className="shortcut-key">
								<kbd>{finalIsMac ? '⌘' : 'Ctrl'}</kbd> + <kbd>•</kbd>
							</div>
						</div>
					</div>

					{/* Navigation Buttons */}
					<div className="navigation-buttons">
						<button className="back-button" onClick={handleBack}>
							Back
						</button>
						<button className="finish-button" onClick={handleFinish}>
							Finish
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	// Permissions screen component
	const renderPermissionsScreen = () => (
		<div className="permission-overlay">
			<div className="permission-container">
				{/* Logo */}
				<div className="logo-section">
					<div className="logo">
						<img src={'./ve-black-circle-logo.png'} alt="logo" />
					</div>
				</div>

				{/* Main Content */}
				<div className="content-section">
					<div className="main-title-container">
						<h1 className="main-title">Let's get you set up</h1>
						<p className="subtitle">
							We'll need permission to access your screen, microphone, and camera to
							continue
						</p>
					</div>

					{/* Permission Items */}
					<div className="permissions-list">
						{/* Microphone Permission */}
						<div className="permission-item">
							<div className="permission-info">
								<div className="permission-icon">
									<Mic size={20} />
								</div>
								<div className="permission-details">
									<h3 className="permission-title">Microphone</h3>
									<p className="permission-description">
										Allow Ve to access your microphone
									</p>
									<div className="permission-status">
										<span
											className={`status-badge ${getPermissionStatusClass(
												permissionDetails.microphone.status,
											)}`}
										>
											{getPermissionStatusText(
												permissionDetails.microphone.status,
											)}
										</span>
										{permissionDetails.microphone.message && (
											<span className="status-message">
												{permissionDetails.microphone.message}
											</span>
										)}
									</div>
								</div>
							</div>
							<div className="permission-toggle">
								<button
									className={`toggle-switch ${
										microphonePermission ? 'active' : ''
									}`}
									onClick={() => {
										window.electronApi
											.openMicrophoneSettings()
											.then((result) => {
												console.log('System settings result:', result);
												// Refresh permissions after opening settings
												setTimeout(checkPermissions, 1000);
											})
											.catch((error) => {
												console.error(
													'Failed to open system settings:',
													error,
												);
											});
									}}
									style={{ pointerEvents: 'auto' }}
								>
									<div className="toggle-handle"></div>
								</button>
							</div>
						</div>

						{/* Screen Recording Permission */}
						{finalIsMac && (
							<div className="permission-item">
								<div className="permission-info">
									<div className="permission-icon">
										<Monitor size={20} />
									</div>
									<div className="permission-details">
										<h3 className="permission-title">Screen Recording</h3>
										<p className="permission-description">
											Allow Ve to access your screen
										</p>
										<div className="permission-status">
											<span
												className={`status-badge ${getPermissionStatusClass(
													permissionDetails.screen.status,
												)}`}
											>
												{getPermissionStatusText(
													permissionDetails.screen.status,
												)}
											</span>
											{permissionDetails.screen.message && (
												<span className="status-message">
													{permissionDetails.screen.message}
												</span>
											)}
										</div>
									</div>
								</div>
								<div className="permission-toggle">
									<button
										className={`toggle-switch ${
											screenPermission ? 'active' : ''
										}`}
										onClick={() => {
											window.electronApi
												.openScreenSettings()
												.then((result) => {
													console.log('System settings result:', result);
													// Refresh permissions after opening settings
													setTimeout(checkPermissions, 1000);
												})
												.catch((error) => {
													console.error(
														'Failed to open system settings:',
														error,
													);
												});
										}}
										style={{ pointerEvents: 'auto' }}
									>
										<div className="toggle-handle"></div>
									</button>
								</div>
							</div>
						)}

						{/* Camera Permission */}
						<div className="permission-item">
							<div className="permission-info">
								<div className="permission-icon">
									<Camera size={20} />
								</div>
								<div className="permission-details">
									<h3 className="permission-title">Camera</h3>
									<p className="permission-description">
										Allow Ve to access your camera
									</p>
									<div className="permission-status">
										<span
											className={`status-badge ${getPermissionStatusClass(
												permissionDetails.camera.status,
											)}`}
										>
											{getPermissionStatusText(
												permissionDetails.camera.status,
											)}
										</span>
										{permissionDetails.camera.message && (
											<span className="status-message">
												{permissionDetails.camera.message}
											</span>
										)}
									</div>
								</div>
							</div>
							<div className="permission-toggle">
								<button
									className={`toggle-switch ${cameraPermission ? 'active' : ''}`}
									onClick={() => {
										window.electronApi
											.openCameraSettings()
											.then((result) => {
												console.log('System settings result:', result);
												// Refresh permissions after opening settings
												setTimeout(checkPermissions, 1000);
											})
											.catch((error) => {
												console.error(
													'Failed to open system settings:',
													error,
												);
											});
									}}
									style={{ pointerEvents: 'auto' }}
								>
									<div className="toggle-handle"></div>
								</button>
							</div>
						</div>

						{/* Next Button */}
						<div className="next-button-container">
							<button className="next-button" onClick={handleNext}>
								Next
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	// Render based on current step
	return currentStep === 1 ? renderPermissionsScreen() : renderShortcutsScreen();
};

export default PermissionOverlay;
