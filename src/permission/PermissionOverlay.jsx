import { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, Monitor, Camera, Settings, CheckCircle, AlertCircle, Music, Calendar } from 'lucide-react';
import './permissionOverlay.scss';

const PermissionOverlay = () => {
	const [microphonePermission, setMicrophonePermission] = useState(false);
	const [screenPermission, setScreenPermission] = useState(false);
	const [cameraPermission, setCameraPermission] = useState(false);
	const [mediaPermission, setMediaPermission] = useState(false);
	const [calendarPermission, setCalendarPermission] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [currentStep, setCurrentStep] = useState(1); // 1: Permissions, 2: Shortcuts, 3: AI Intelligence, 4: Super Agents, 5: Proactive AI
	const [permissionDetails, setPermissionDetails] = useState({
		microphone: { status: 'unknown', message: '' },
		screen: { status: 'unknown', message: '' },
		camera: { status: 'unknown', message: '' },
		media: { status: 'unknown', message: '' },
		calendar: { status: 'unknown', message: '' },
	});
	const [isCheckingPermissions, setIsCheckingPermissions] = useState(false);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [lastPermissionCheck, setLastPermissionCheck] = useState(Date.now());
	const [permissionRequestMessage, setPermissionRequestMessage] = useState('');
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
		// For onboarding screens (2-5), don't check permissions after step 1
		if (currentStep > 1) {
			setIsLoading(false);
			return;
		}

		// Check current permissions on mount immediately for permission steps
		console.log('🚀 PermissionOverlay mounted, checking permissions...');
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
	}, [currentStep]);

	// Check permissions when we reach step 1 (permissions screen)
	useEffect(() => {
		if (currentStep === 1) {
			checkPermissions();
			startPermissionMonitoring();
		} else {
			stopPermissionMonitoring();
		}
	}, [currentStep]);

	// Show success message when required permissions are granted
	useEffect(() => {
		if (microphonePermission && cameraPermission && !isLoading) {
			setShowSuccessMessage(true);
			setPermissionRequestMessage(
				'✅ Essential permissions granted! You can proceed to the next step.',
			);
			setTimeout(() => setPermissionRequestMessage(''), 5000);
		}

		return () => {
			if (successTimeoutRef.current) {
				clearTimeout(successTimeoutRef.current);
			}
		};
	}, [microphonePermission, cameraPermission, isLoading]);

	// Real-time permission monitoring
	const startPermissionMonitoring = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		intervalRef.current = setInterval(() => {
			// Only check if we're not already checking and it's been at least 500ms
			const now = Date.now();
			if (!isCheckingPermissions && now - lastPermissionCheck >= 500) {
				console.log('🔄 Auto-checking permissions...');
				checkPermissions();
			}
		}, 1000); // Check every 1 second for more responsive updates
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

			console.log('🔍 Checking permissions...');

			// Check microphone permission
			const micResult = await window.electronApi.permission.checkMicrophonePermission();
			console.log('🎤 Microphone result:', micResult);
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
			console.log('🖥️ Screen result:', screenResult);
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
			console.log('📷 Camera result:', cameraResult);
			setCameraPermission(cameraResult.hasPermission);
			setPermissionDetails((prev) => ({
				...prev,
				camera: {
					status: cameraResult.permission || 'unknown',
					message: cameraResult.message || '',
				},
			}));

			// Check media permission (Photos/Media Library)
			const mediaResult = await window.electronApi.permission.checkMediaPermission?.() || { hasPermission: false, permission: 'not-determined', message: 'Media permission check not available' };
			console.log('🎵 Media result:', mediaResult);
			setMediaPermission(mediaResult.hasPermission);
			setPermissionDetails((prev) => ({
				...prev,
				media: {
					status: mediaResult.permission || 'unknown',
					message: mediaResult.message || '',
				},
			}));

			// Check calendar permission
			const calendarResult = await window.electronApi.permission.checkCalendarPermission?.() || { hasPermission: false, permission: 'not-determined', message: 'Calendar permission check not available' };
			console.log('📅 Calendar result:', calendarResult);
			setCalendarPermission(calendarResult.hasPermission);
			setPermissionDetails((prev) => ({
				...prev,
				calendar: {
					status: calendarResult.permission || 'unknown',
					message: calendarResult.message || '',
				},
			}));

			console.log('✅ Permission check completed:', {
				microphone: micResult.hasPermission,
				screen: screenResult.hasPermission,
				camera: cameraResult.hasPermission,
				media: mediaResult.hasPermission,
				calendar: calendarResult.hasPermission,
				platform: finalIsMac ? 'macOS' : 'Windows/Linux',
				details: {
					microphone: micResult,
					screen: screenResult,
					camera: cameraResult,
					media: mediaResult,
					calendar: calendarResult,
				},
			});

			setIsLoading(false);
		} catch (error) {
			console.error('❌ Error checking permissions:', error);
			setIsLoading(false);
		} finally {
			setIsCheckingPermissions(false);
		}
	};

	// const getPermissionStatusText = (status) => {
	// 	switch (status) {
	// 		case 'granted':
	// 			return 'Granted';
	// 		case 'denied':
	// 			return 'Denied';
	// 		case 'not-determined':
	// 			return 'Not Requested';
	// 		case 'restricted':
	// 			return 'Restricted';
	// 		default:
	// 			return 'Unknown';
	// 	}
	// };

	// const getPermissionStatusClass = (status) => {
	// 	switch (status) {
	// 		case 'granted':
	// 			return 'status-granted';
	// 		case 'denied':
	// 			return 'status-denied';
	// 		case 'not-determined':
	// 			return 'status-not-determined';
	// 		case 'restricted':
	// 			return 'status-restricted';
	// 		default:
	// 			return 'status-unknown';
	// 	}
	// };

	// Improved permission action handlers
	const handleMicrophoneAction = async () => {
	try {
		console.log('🎤 Opening microphone settings...');

		// Open microphone settings directly
		const result = await window.electronApi.openMicrophoneSettings();
		if (result && result.success) {
			console.log('✅ Microphone settings opened successfully');
			setPermissionRequestMessage(
				'📋 Microphone settings opened. Please enable "Ve.AI" in Privacy & Security > Microphone, then return here.',
			);
			setTimeout(() => setPermissionRequestMessage(''), 8000);

			// Start aggressive permission monitoring after opening settings
			console.log('🔄 Starting aggressive permission monitoring for microphone...');
			stopPermissionMonitoring(); // Stop existing monitoring
			startPermissionMonitoring(); // Restart with fresh interval
			
			// Also do immediate re-checks
			setTimeout(() => {
				console.log('🔄 Re-checking permissions after opening microphone settings (1s)...');
				checkPermissions();
			}, 1000);
			setTimeout(() => {
				console.log('🔄 Re-checking permissions after opening microphone settings (3s)...');
				checkPermissions();
			}, 3000);
		} else {
			console.error('❌ Failed to open microphone settings:', result?.error);
			setPermissionRequestMessage(
				'❌ Unable to open settings. Please manually go to System Settings > Privacy & Security > Microphone.',
			);
			setTimeout(() => setPermissionRequestMessage(''), 8000);
		}
	} catch (error) {
		console.error('❌ Error opening microphone settings:', error);
		setPermissionRequestMessage(
			'❌ Unable to open settings. Please manually go to System Settings > Privacy & Security > Microphone.',
		);
		setTimeout(() => setPermissionRequestMessage(''), 8000);
	}
	};

	const handleScreenAction = async () => {
		try {
			console.log('🖥️ Opening screen recording settings...');

		// Directly open system settings for screen recording
		const result = await window.electronApi.openScreenRecordingSettings();
			if (result.success) {
				console.log('✅ Screen recording settings opened successfully');
				setPermissionRequestMessage(
					'📋 Screen recording settings opened. Please enable "Ve.AI" in Privacy & Security > Screen Recording, then return here.',
				);
				setTimeout(() => setPermissionRequestMessage(''), 8000);

				// Start aggressive permission monitoring after opening settings
				console.log('🔄 Starting aggressive permission monitoring for screen recording...');
				stopPermissionMonitoring(); // Stop existing monitoring
				startPermissionMonitoring(); // Restart with fresh interval
				
				// Also do immediate re-checks
				setTimeout(() => {
					console.log('🔄 Re-checking permissions after opening screen settings (1s)...');
					checkPermissions();
				}, 1000);
				setTimeout(() => {
					console.log('🔄 Re-checking permissions after opening screen settings (3s)...');
					checkPermissions();
				}, 3000);
			} else {
				console.error('❌ Failed to open screen recording settings:', result.error);
				setPermissionRequestMessage(
					'❌ Unable to open settings. Please manually go to System Settings > Privacy & Security > Screen Recording.',
				);
				setTimeout(() => setPermissionRequestMessage(''), 8000);
			}
		} catch (error) {
			console.error('❌ Error opening screen recording settings:', error);
			setPermissionRequestMessage(
				'❌ Unable to open settings. Please manually go to System Settings > Privacy & Security > Screen Recording.',
			);
			setTimeout(() => setPermissionRequestMessage(''), 8000);
		}
	};

	const handleCameraAction = async () => {
		try {
			console.log('📷 Opening camera settings...');

			// Open camera settings directly
			const result = await window.electronApi.openCameraSettings();
			if (result && result.success) {
				console.log('✅ Camera settings opened successfully');
				setPermissionRequestMessage(
					'📋 Camera settings opened. Please enable "Ve.AI" in Privacy & Security > Camera, then return here.',
				);
				setTimeout(() => setPermissionRequestMessage(''), 8000);

			// Start aggressive permission monitoring after opening settings
			console.log('🔄 Starting aggressive permission monitoring for camera...');
			stopPermissionMonitoring(); // Stop existing monitoring
			startPermissionMonitoring(); // Restart with fresh interval
			
			// Also do immediate re-checks
			setTimeout(() => {
				console.log('🔄 Re-checking permissions after opening camera settings (1s)...');
				checkPermissions();
			}, 1000);
			setTimeout(() => {
				console.log('🔄 Re-checking permissions after opening camera settings (3s)...');
				checkPermissions();
			}, 3000);
			} else {
				console.error('❌ Failed to open camera settings:', result?.error);
				setPermissionRequestMessage(
					'❌ Unable to open settings. Please manually go to System Settings > Privacy & Security > Camera.',
				);
				setTimeout(() => setPermissionRequestMessage(''), 8000);
			}
		} catch (error) {
			console.error('❌ Error opening camera settings:', error);
			setPermissionRequestMessage(
				'❌ Unable to open settings. Please manually go to System Settings > Privacy & Security > Camera.',
			);
			setTimeout(() => setPermissionRequestMessage(''), 8000);
		}
	};

	const handleMediaAction = async () => {
		try {
			console.log('🎵 Opening media library settings...');

			// Open specific media library settings using the new API
			const result = await window.electronApi.openMediaSettings();
			if (result && result.success) {
				console.log('✅ Media library settings opened successfully');
				const settingsName = result.method === 'Privacy_Media' ? 'Media Library' : 'Photos';
				setPermissionRequestMessage(
					`📋 ${settingsName} settings opened. Please enable "Ve.AI" in Privacy & Security > ${settingsName}, then return here.`,
				);
				setTimeout(() => setPermissionRequestMessage(''), 8000);

			// Start aggressive permission monitoring after opening settings
			console.log('🔄 Starting aggressive permission monitoring for media...');
			stopPermissionMonitoring(); // Stop existing monitoring
			startPermissionMonitoring(); // Restart with fresh interval
			
			// Also do immediate re-checks
			setTimeout(() => {
				console.log('🔄 Re-checking permissions after opening media settings (1s)...');
				checkPermissions();
			}, 1000);
			setTimeout(() => {
				console.log('🔄 Re-checking permissions after opening media settings (3s)...');
				checkPermissions();
			}, 3000);
			} else {
				console.error('❌ Failed to open media library settings:', result?.error);
				setPermissionRequestMessage(
					'❌ Unable to open settings. Please manually go to System Settings > Privacy & Security > Photos.',
				);
				setTimeout(() => setPermissionRequestMessage(''), 8000);
			}
		} catch (error) {
			console.error('❌ Error opening media library settings:', error);
			setPermissionRequestMessage(
				'❌ Unable to open settings. Please manually go to System Settings > Privacy & Security > Photos.',
			);
			setTimeout(() => setPermissionRequestMessage(''), 8000);
		}
	};

	const handleCalendarAction = async () => {
		try {
			console.log('📅 Opening calendar settings...');

			// Open specific calendar settings using the new API
			const result = await window.electronApi.openCalendarSettings();
			if (result && result.success) {
				console.log('✅ Calendar settings opened successfully');
				setPermissionRequestMessage(
					'📋 Calendar settings opened. Please enable "Ve.AI" in Privacy & Security > Calendars, then return here.',
				);
				setTimeout(() => setPermissionRequestMessage(''), 8000);

			// Start aggressive permission monitoring after opening settings
			console.log('🔄 Starting aggressive permission monitoring for calendar...');
			stopPermissionMonitoring(); // Stop existing monitoring
			startPermissionMonitoring(); // Restart with fresh interval
			
			// Also do immediate re-checks
			setTimeout(() => {
				console.log('🔄 Re-checking permissions after opening calendar settings (1s)...');
				checkPermissions();
			}, 1000);
			setTimeout(() => {
				console.log('🔄 Re-checking permissions after opening calendar settings (3s)...');
				checkPermissions();
			}, 3000);
			} else {
				console.error('❌ Failed to open calendar settings:', result?.error);
				setPermissionRequestMessage(
					'❌ Unable to open settings. Please manually go to System Settings > Privacy & Security > Calendars.',
				);
				setTimeout(() => setPermissionRequestMessage(''), 8000);
			}
		} catch (error) {
			console.error('❌ Error opening calendar settings:', error);
			setPermissionRequestMessage(
				'❌ Unable to open settings. Please manually go to System Settings > Privacy & Security > Calendars.',
			);
			setTimeout(() => setPermissionRequestMessage(''), 8000);
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
		// Permissions are now optional - users can proceed without granting them
		// Removed mandatory permission check to allow users to continue regardless of permission status
		setCurrentStep(currentStep + 1);
	};

	const handleBack = () => {
		setCurrentStep(currentStep - 1);
	};

	const handleFinish = () => {
		// Close the permission overlay regardless of screen recording permission
		// Screen recording is optional, only mic and camera are required
		console.log('🎉 Setup completed! Closing permission overlay...');
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

	// const debugPermissions = async () => {
	// 	try {
	// 		console.log('🔍 Debugging permissions...');
	// 		const debugResult = await window.electronApi.permission.debugPermissions();
	// 		console.log('🔍 Debug permissions result:', debugResult);

	// 		if (debugResult.success) {
	// 			console.log('🔍 Platform:', debugResult.debugInfo.platform);
	// 			console.log('🔍 Is Mac Runtime:', debugResult.debugInfo.isMacRuntime);
	// 			console.log('🔍 Permissions:', debugResult.debugInfo.permissions);
	// 		} else {
	// 			console.error('❌ Debug permissions failed:', debugResult.error);
	// 		}
	// 	} catch (error) {
	// 		console.error('❌ Error debugging permissions:', error);
	// 	}
	// };

	if (isLoading && currentStep >= 4) {
		return (
			<div className="permission-overlay">
				<div className="permission-container">
					<div className="loading-spinner">Loading...</div>
				</div>
			</div>
		);
	}

	// AI-Powered Meeting Intelligence screen
	const renderAIMeetingIntelligenceScreen = () => (
		<div className="onboarding-overlay">
			<div className="onboarding-container">
				<div className="onboarding-card">
					{/* Ve Logo */}
					{/* <div className="ve-logo">
						<span className="ve-text">ve</span>
					</div> */}

					{/* Title */}
					<h1 className="onboarding-title">AI-Powered Meeting Intelligence</h1>

					{/* Feature Image */}

					<div className="feature-image-container">
						<img
							src={'./page1.png'}
							alt="AI-Powered Meeting Intelligences"
							className="feature-image"
						/>
					</div>

					{/* Description */}
					<p className="onboarding-description">
						Ve.ai listens to your meetings in real time and captures key moments like
						questions, decisions, and action items. You'll get instant summaries,
						searchable transcripts, and follow-up tasks without lifting a finger.
					</p>

					{/* Navigation Buttons */}
					<div className="onboarding-navigation">
						{/* Navigation Dots */}
						<div className="onboarding-dots">
							<span className="dot"></span>
							<span className="dot"></span>
							<span className="dot active"></span>
							<span className="dot"></span>
							<span className="dot"></span>
						</div>
						<div style={{ display: 'flex', gap: '16px' }}>
							<button className="back-btn" onClick={handleBack}>
								Back
							</button>
							<button className="next-btn" onClick={handleNext}>
								Next
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	// Super Agents screen
	const renderSuperAgentsScreen = () => (
		<div className="onboarding-overlay">
			<div className="onboarding-container">
				<div className="onboarding-card">
					{/* Ve Logo */}
					{/* <div className="ve-logo">
						<span className="ve-text">ve</span>
					</div> */}

					{/* Title */}
					<h1 className="onboarding-title">Super Agents at Your Command</h1>

					{/* Feature Image */}
					<div className="feature-image-container">
						<img
							src="./page2.png"
							alt="Super Agents at Your Command"
							className="feature-image"
						/>
					</div>

					{/* Description */}
					<p className="onboarding-description">
						Super Agents are intelligent AI assistants that work alongside you in and
						out of meetings. They help you manage your calendar, handle tasks, search
						across your connected tools and even send or draft emails.
					</p>

					{/* Navigation Buttons */}
					<div className="onboarding-navigation">
						{/* Navigation Dots */}
						<div className="onboarding-dots">
							<span className="dot"></span>
							<span className="dot"></span>
							<span className="dot"></span>
							<span className="dot active"></span>
							<span className="dot"></span>
						</div>

						<div style={{ display: 'flex', gap: '16px' }}>
							<button className="back-btn" onClick={handleBack}>
								Back
							</button>
							<button className="next-btn" onClick={handleNext}>
								Next
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	// Proactive AI screen
	const renderProactiveAIScreen = () => (
		<div className="onboarding-overlay">
			<div className="onboarding-container">
				<div className="onboarding-card">
					{/* Ve Logo */}
					{/* <div className="ve-logo">
						<span className="ve-text">ve</span>
					</div> */}

					{/* Title */}
					<h1 className="onboarding-title">Proactive AI - Act before you ask</h1>

					{/* Feature Image */}
					<div className="feature-image-container">
						<img
							src="./page3.png"
							alt="Proactive AI - Act before you ask"
							className="feature-image"
						/>
					</div>

					{/* Description */}
					<p className="onboarding-description">
						VE goes beyond responding to prompts. It proactively surfaces insights,
						highlights risks, and suggests next steps, keeping you one step ahead
						without extra effort.
					</p>

					{/* Navigation Buttons */}
					<div className="onboarding-navigation">
						{/* Navigation Dots */}
						<div className="onboarding-dots">
							<span className="dot"></span>
							<span className="dot"></span>
							<span className="dot"></span>
							<span className="dot"></span>
							<span className="dot active"></span>
						</div>

						<div style={{ display: 'flex', gap: '16px' }}>
							<button className="back-btn" onClick={handleBack}>
								Back
							</button>
							<button className="next-btn" onClick={handleFinish}>
								Finish
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	// Shortcuts screen component
	const renderShortcutsScreen = () => (
		<div className="permission-overlay">
			<div className="permission-container">
				{/* Logo */}
				<div className="logo-section">
					<div className="logo">
						<img src={'./Logo.png'} alt="logo" />
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
						{/* Navigation Dots */}
						<div className="onboarding-dots">
							<span className="dot"></span>
							<span className="dot active"></span>
							<span className="dot"></span>
							<span className="dot"></span>
							<span className="dot"></span>
						</div>

						<div style={{ display: 'flex', gap: '16px' }}>
							<button className="back-button" onClick={handleBack}>
								Back
							</button>
							<div className="next-button-container">
								<button className="next-button" onClick={handleNext}>
									Next
								</button>
							</div>
						</div>
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
						<img src={'./Logo.png'} alt="logo" />
					</div>
				</div>

				{/* Main Content */}
				<div className="content-section">
					<div className="main-title-container">
						<h1 className="main-title">Let's get you set up</h1>

						<p className="subtitle">
							We’ll need permission to assess your screen and microphone to continue
							{finalIsMac &&
								' Click the buttons below to grant permissions, then return here.'}
						</p>

						{/* {isCheckingPermissions && (
							<div className="checking-permissions">
								<div className="spinner"></div>
								<span>Checking permissions...</span>
							</div>
						)} */}
						{/* {permissionRequestMessage && (
							<div className="permission-request-message">
								<span>{permissionRequestMessage}</span>
							</div>
						)} */}
					</div>
					{showSuccessMessage && (
						<div className="success-message">
							<CheckCircle stroke="#79ECC9" size={20} />
							<p className="success-text">
							Essential  permissions granted (Mic, Cam, Calendar)! Ready to proceed.
							</p>
						</div>
					)}

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
										{/* <span
											className={`status-badge ${getPermissionStatusClass(
												permissionDetails.microphone.status,
											)}`}
										>
											{getPermissionStatusText(
												permissionDetails.microphone.status,
											)}
										</span> */}
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
									disabled={microphonePermission || isCheckingPermissions}
								>
									{microphonePermission ? (
										<>
											<CheckCircle stroke="#79ECC9" size={16} />
											{/* <span>Granted</span> */}
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
										{/* <span
											className={`status-badge ${getPermissionStatusClass(
												permissionDetails.camera.status,
											)}`}
										>
											{getPermissionStatusText(
												permissionDetails.camera.status,
											)}
										</span> */}
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
									disabled={cameraPermission || isCheckingPermissions}
								>
									{cameraPermission ? (
										<>
											<CheckCircle stroke="#79ECC9" size={16} />
											{/* <span>Granted</span> */}
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
							{/* Calendar Permission */}
						<div className="permission-item">
							<div className="permission-info">
								<div className="permission-icon">
									<Calendar size={20} />
								</div>
								<div className="permission-details">
									<h3 className="permission-title">Calendar</h3>
									<p className="permission-description">
										Allow Ve to access your calendar events
									</p>
									<div className="permission-status">
										{permissionDetails.calendar.message && (
											<span className="status-message">
												{permissionDetails.calendar.message}
											</span>
										)}
									</div>
								</div>
							</div>
							<div className="permission-action">
								<button
									className={getActionButtonClass(
										calendarPermission,
										permissionDetails.calendar.status,
									)}
									onClick={handleCalendarAction}
									disabled={calendarPermission || isCheckingPermissions}
								>
									{calendarPermission ? (
										<>
											<CheckCircle stroke="#79ECC9" size={16} />
										</>
									) : (
										<>
											<Settings size={16} />
											<span>
												{getActionButtonText(
													calendarPermission,
													permissionDetails.calendar.status,
												)}
											</span>
										</>
									)}
								</button>
							</div>
						</div>


						{/* Screen Sharing Permission */}
						{finalIsMac && (
							<div className="permission-item">
								<div className="permission-info">
									<div className="permission-icon">
										<Monitor size={20} />
									</div>
									<div className="permission-details">
										<h3 className="permission-title">Screen Recording</h3>
										<p className="permission-description">
											Allow Ve to capture your screen for enhanced features
										</p>
										<div className="permission-status">
											{/* <span
												className={`status-badge ${getPermissionStatusClass(
													permissionDetails.screen.status,
												)}`}
											>
												{getPermissionStatusText(
													permissionDetails.screen.status,
												)}
											</span> */}
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
										disabled={screenPermission || isCheckingPermissions}
									>
										{screenPermission ? (
											<>
												<CheckCircle stroke="#79ECC9" size={16} />
												{/* <span>Granted</span> */}
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

					
						{/* Media Permission */}
						<div className="permission-item">
							<div className="permission-info">
								<div className="permission-icon">
									<Music size={20} />
								</div>
								<div className="permission-details">
									<h3 className="permission-title">Media Library</h3>
									<p className="permission-description">
										Allow Ve to access your  media
									</p>
									<div className="permission-status">
										{permissionDetails.media.message && (
											<span className="status-message">
												{permissionDetails.media.message}
											</span>
										)}
									</div>
								</div>
							</div>
							<div className="permission-action">
								<button
									className={getActionButtonClass(
										mediaPermission,
										permissionDetails.media.status,
									)}
									onClick={handleMediaAction}
									disabled={mediaPermission || isCheckingPermissions}
								>
									{mediaPermission ? (
										<>
											<CheckCircle stroke="#79ECC9" size={16} />
										</>
									) : (
										<>
											<Settings size={16} />
											<span>
												{getActionButtonText(
													mediaPermission,
													permissionDetails.media.status,
												)}
											</span>
										</>
									)}
								</button>
							</div>
						</div>

					
					</div>
					{/* Navigation */}
					<div className="navigation-buttons">
						{/* Navigation Dots */}
						<div className="onboarding-dots">
							<span className="dot active"></span>
							<span className="dot"></span>
							<span className="dot"></span>
							<span className="dot"></span>
							<span className="dot"></span>
						</div>

						<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
							{/* <button className="back-button" onClick={handleFinish}>
								Cancel
							</button> */}
							<div className="next-button-container">
								<button className="next-button" onClick={handleNext}>
									Next
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	// Render based on current step
	return (
		<>
			{currentStep === 1 && renderPermissionsScreen()}
			{currentStep === 2 && renderShortcutsScreen()}
			{currentStep === 3 && renderAIMeetingIntelligenceScreen()}
			{currentStep === 4 && renderSuperAgentsScreen()}
			{currentStep === 5 && renderProactiveAIScreen()}
		</>
	);
};

export default PermissionOverlay;
