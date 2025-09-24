import { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, Monitor, Camera, Settings, CheckCircle, AlertCircle } from 'lucide-react';
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
	const [isCheckingPermissions, setIsCheckingPermissions] = useState(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [lastPermissionCheck, setLastPermissionCheck] = useState(Date.now());
	const intervalRef = useRef(null);
	const successTimeoutRef = useRef(null);

	// Get platform information safely from electronApi
	const platformInfo = window.electronApi?.platform || {
		name: 'unknown',
		isMac: navigator.platform.includes('Mac'),
		isWindows: navigator.platform.includes('Win'),
		isLinux: navigator.platform.includes('Linux'),
	};

	const finalIsMac = platformInfo.isMac;

	// Debug logging to help troubleshoot platform detection
	console.log('🔍 PermissionOverlay Platform Debug:', {
		electronApiPlatform: window.electronApi?.platform,
		platformInfo,
		finalIsMac,
		navigatorPlatform: navigator.platform,
		userAgent: navigator.userAgent,
		permissionDetails,
	});

	useEffect(() => {
		// Check current permissions on mount
		checkPermissions();

		// Start real-time permission monitoring
		startPermissionMonitoring();

		// Listen for window close events
		const handleBeforeUnload = () => {
			window.dispatchEvent(new CustomEvent('permission-window-closed'));
		};

		// Add keyboard shortcut for developer tools
		const handleKeyDown = (event) => {
			// F12 or Ctrl+Shift+I or Cmd+Shift+I to open dev tools
			if (
				event.key === 'F12' ||
				((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'I')
			) {
				event.preventDefault();
				openDevTools();
			}
		};

		// Add context menu for developer tools
		const handleContextMenu = (event) => {
			// Check if Ctrl/Cmd is held while right-clicking for dev tools access
			if (event.ctrlKey || event.metaKey) {
				event.preventDefault();
				openDevTools();
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('contextmenu', handleContextMenu);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('contextmenu', handleContextMenu);
			stopPermissionMonitoring();
		};
	}, []);

	// Auto-close overlay when all permissions are granted
	useEffect(() => {
		if (microphonePermission && screenPermission && cameraPermission && !isLoading) {
			setShowSuccessMessage(true);
			successTimeoutRef.current = setTimeout(() => {
				console.log('🎉 All permissions granted! Auto-closing overlay...');
				window.electronApi.permission.closeWindow();
			}, 2000); // Show success message for 2 seconds before closing
		}

		return () => {
			if (successTimeoutRef.current) {
				clearTimeout(successTimeoutRef.current);
			}
		};
	}, [microphonePermission, screenPermission, cameraPermission, isLoading]);

	// Real-time permission monitoring
	const startPermissionMonitoring = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		intervalRef.current = setInterval(() => {
			// Only check if we're not already checking and it's been at least 2 seconds
			const now = Date.now();
			if (!isCheckingPermissions && now - lastPermissionCheck >= 2000) {
				checkPermissions();
			}
		}, 3000); // Check every 3 seconds
	}, [isCheckingPermissions, lastPermissionCheck]);

	const stopPermissionMonitoring = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	const checkPermissions = async () => {
		if (isCheckingPermissions) return; // Prevent concurrent checks

		try {
			setIsCheckingPermissions(true);
			setLastPermissionCheck(Date.now());

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
		} finally {
			setIsCheckingPermissions(false);
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

	// Improved permission action handlers
	const handleMicrophoneAction = async () => {
		try {
			console.log('🎤 Opening microphone settings...');
			const result = await window.electronApi.openMicrophoneSettings();
			if (result.success) {
				console.log('✅ Microphone settings opened successfully');
				// Start more frequent checking after opening settings
				setTimeout(() => checkPermissions(), 1000);
			} else {
				console.error('❌ Failed to open microphone settings:', result.error);
			}
		} catch (error) {
			console.error('❌ Error opening microphone settings:', error);
		}
	};

	const handleScreenAction = async () => {
		try {
			console.log('🖥️ Opening screen recording settings...');
			const result = await window.electronApi.openScreenSettings();
			if (result.success) {
				console.log('✅ Screen recording settings opened successfully');
				// Start more frequent checking after opening settings
				setTimeout(() => checkPermissions(), 1000);
			} else {
				console.error('❌ Failed to open screen recording settings:', result.error);
			}
		} catch (error) {
			console.error('❌ Error opening screen recording settings:', error);
		}
	};

	const handleCameraAction = async () => {
		try {
			console.log('📷 Opening camera settings...');
			const result = await window.electronApi.openCameraSettings();
			if (result.success) {
				console.log('✅ Camera settings opened successfully');
				// Start more frequent checking after opening settings
				setTimeout(() => checkPermissions(), 1000);
			} else {
				console.error('❌ Failed to open camera settings:', result.error);
			}
		} catch (error) {
			console.error('❌ Error opening camera settings:', error);
		}
	};

	const getActionButtonText = (hasPermission, status) => {
		if (hasPermission) return 'Granted ✓';
		if (status === 'denied') return 'Open Settings';
		if (status === 'not-determined') return 'Grant Permission';
		return 'Open Settings';
	};

	const getActionButtonClass = (hasPermission, status) => {
		if (hasPermission) return 'permission-action-button granted';
		if (status === 'denied') return 'permission-action-button denied';
		return 'permission-action-button pending';
	};
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

	const openDevTools = () => {
		try {
			// Open dev tools for the current permission window
			window.electronApi.openDevTools({ targetWindow: 'current', mode: 'detach' });
			console.log('🛠️ Developer tools opened for permission overlay');
		} catch (error) {
			console.error('❌ Error opening developer tools:', error);
		}
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
								<kbd>{finalIsMac ? '⌘' : 'Ctrl'}</kbd> <kbd>\</kbd>
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
								<kbd>{finalIsMac ? '⌘' : 'Ctrl'}</kbd> <kbd>N</kbd>
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
								<kbd>{finalIsMac ? '⌘' : 'Ctrl'}</kbd> <kbd>↵</kbd>
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
								<kbd>{finalIsMac ? '⌘' : 'Ctrl'}</kbd> <kbd>•</kbd>
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
						{showSuccessMessage ? (
							<div className="success-message">
								<CheckCircle size={20} />
								<p className="success-text">
									All permissions granted! Closing in a moment...
								</p>
							</div>
						) : (
							<p className="subtitle">
								We'll need permission to access your screen, microphone, and camera.
								{finalIsMac &&
									' Click the buttons below to open system settings, then return here.'}
							</p>
						)}
						{isCheckingPermissions && (
							<div className="checking-permissions">
								<div className="spinner"></div>
								<span>Checking permissions...</span>
							</div>
						)}
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
							<div className="permission-action">
								<button
									className={getActionButtonClass(
										microphonePermission,
										permissionDetails.microphone.status,
									)}
									onClick={handleMicrophoneAction}
									disabled={microphonePermission}
								>
									{microphonePermission ? (
										<>
											<CheckCircle size={16} />
											<span>Granted</span>
										</>
									) : (
										<>
											<Settings size={16} />
											<span>
												{getActionButtonText(
													microphonePermission,
													permissionDetails.microphone.status,
												)}
											</span>
										</>
									)}
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
								<div className="permission-action">
									<button
										className={getActionButtonClass(
											screenPermission,
											permissionDetails.screen.status,
										)}
										onClick={handleScreenAction}
										disabled={screenPermission}
									>
										{screenPermission ? (
											<>
												<CheckCircle size={16} />
												<span>Granted</span>
											</>
										) : (
											<>
												<Settings size={16} />
												<span>
													{getActionButtonText(
														screenPermission,
														permissionDetails.screen.status,
													)}
												</span>
											</>
										)}
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
							<div className="permission-action">
								<button
									className={getActionButtonClass(
										cameraPermission,
										permissionDetails.camera.status,
									)}
									onClick={handleCameraAction}
									disabled={cameraPermission}
								>
									{cameraPermission ? (
										<>
											<CheckCircle size={16} />
											<span>Granted</span>
										</>
									) : (
										<>
											<Settings size={16} />
											<span>
												{getActionButtonText(
													cameraPermission,
													permissionDetails.camera.status,
												)}
											</span>
										</>
									)}
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
	return <>{currentStep === 1 ? renderPermissionsScreen() : renderShortcutsScreen()}</>;
};

export default PermissionOverlay;
