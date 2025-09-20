import { useState, useEffect } from 'react';
import { Mic, Monitor } from 'lucide-react';
import './permissionOverlay.scss';

const PermissionOverlay = () => {
	const [microphonePermission, setMicrophonePermission] = useState(false);
	const [screenPermission, setScreenPermission] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

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

			// Check screen permission
			const screenResult = await window.electronApi.permission.checkScreenPermission();
			setScreenPermission(screenResult.hasPermission);

			setIsLoading(false);
		} catch (error) {
			console.error('Error checking permissions:', error);
			setIsLoading(false);
		}
	};

	const handleMicrophoneToggle = async () => {
		try {
			if (!microphonePermission) {
				// Request microphone permission
				const result = await window.electronApi.permission.requestMicrophonePermission();
				if (result.granted) {
					setMicrophonePermission(true);
					checkAllPermissionsGranted();
				} else {
					// Show help dialog
					await window.electronApi.permission.showMicrophonePermissionHelp();
				}
			} else {
				// Permission is already granted, just toggle UI state
				setMicrophonePermission(false);
				checkAllPermissionsGranted();
			}
		} catch (error) {
			console.error('Error handling microphone permission:', error);
			// Show help dialog on error
			try {
				await window.electronApi.permission.showMicrophonePermissionHelp();
			} catch (helpError) {
				console.error('Error showing microphone help:', helpError);
			}
		}
	};

	const handleScreenToggle = async () => {
		try {
			if (!screenPermission) {
				// Request screen permission
				const result = await window.electronApi.permission.requestScreenPermission();
				if (result.granted) {
					setScreenPermission(true);
					checkAllPermissionsGranted();
				} else {
					// Show help dialog
					await window.electronApi.permission.showScreenPermissionHelp();
				}
			} else {
				// Permission is already granted, just toggle UI state
				setScreenPermission(false);
				checkAllPermissionsGranted();
			}
		} catch (error) {
			console.error('Error handling screen permission:', error);
			// Show help dialog on error
			try {
				await window.electronApi.permission.showScreenPermissionHelp();
			} catch (helpError) {
				console.error('Error showing screen help:', helpError);
			}
		}
	};

	const handleScreenRecordingToggle = async () => {
		try {
			if (!screenPermission) {
				// Request screen recording permission
				const result = await window.electronApi.permission.requestScreenPermission();
				if (result.granted) {
					setScreenPermission(true);
					checkAllPermissionsGranted();
				} else {
					// Show help dialog
					await window.electronApi.permission.showScreenPermissionHelp();
				}
			} else {
				// Permission is already granted, just toggle UI state
				setScreenPermission(false);
				checkAllPermissionsGranted();
			}
		} catch (error) {
			console.error('Error handling screen recording permission:', error);
			// Show help dialog on error
			try {
				await window.electronApi.permission.showScreenPermissionHelp();
			} catch (helpError) {
				console.error('Error showing screen recording help:', helpError);
			}
		}
	};

	const checkAllPermissionsGranted = () => {
		if (microphonePermission && screenPermission) {
			console.log('🔐 All permissions granted! Notifying main app...');
			// Emit event to notify main app that permissions are granted
			window.dispatchEvent(new CustomEvent('permission-granted'));
			// Close the permission overlay after a short delay
			setTimeout(() => {
				window.electronApi.permission.closeWindow();
			}, 1000);
		}
	};

	const handleContinue = () => {
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

	return (
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
							We'll need permission to assess your screen and microphone to continue
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
								</div>
							</div>
							<div className="permission-toggle">
								<button
									className={`toggle-switch ${
										microphonePermission ? 'active' : ''
									}`}
									onClick={handleMicrophoneToggle}
								>
									<div className="toggle-handle"></div>
								</button>
							</div>
						</div>

						{/* Screen Permission */}
						<div className="permission-item">
							<div className="permission-info">
								<div className="permission-icon">
									<Monitor size={20} />
								</div>
								<div className="permission-details">
									<h3 className="permission-title">Screen</h3>
									<p className="permission-description">
										Allow Ve to access your screen
									</p>
								</div>
							</div>
							<div className="permission-toggle">
								<button
									className={`toggle-switch ${screenPermission ? 'active' : ''}`}
									onClick={handleScreenToggle}
								>
									<div className="toggle-handle"></div>
								</button>
							</div>
						</div>

						{/*screen recording permission*/}
						<div className="permission-item">
							<div className="permission-info">
								<div className="permission-icon">
									<Monitor size={20} />
								</div>
								<div className="permission-details">
									<h3 className="permission-title">Screen Recording</h3>
									<p className="permission-description">
										Allow Ve to record your screen
									</p>
								</div>
							</div>
							<div className="permission-toggle">
								<button
									className={`toggle-switch ${screenPermission ? 'active' : ''}`}
									// onClick={handleScreenRecordingToggle}
									onClick={handleContinue}
								>
									<div className="toggle-handle"></div>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PermissionOverlay;
