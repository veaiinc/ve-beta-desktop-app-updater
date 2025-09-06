import React, { useEffect, useState } from 'react';
import './NotchDropUI.scss';

const NotchDropUI = () => {
	const [contentType, setContentType] = useState('normal'); // normal, menu, settings
	const [status, setStatus] = useState('closed'); // closed, opened, popping
	const [hapticFeedback, setHapticFeedback] = useState(true);
	const [isConnected, setIsConnected] = useState(false);
	const [items, setItems] = useState([]); // For tray items

	useEffect(() => {
		// Check if we're in Electron environment
		if (window.electronAPI && window.electronAPI.dynamicIsland) {
			setIsConnected(true);

			// Listen for dynamic island state changes
			window.electronAPI.dynamicIsland.onStateChange((data) => {
				setStatus(data.expanded ? 'opened' : 'closed');
			});

			// Load initial haptic feedback setting
			loadHapticFeedbackSetting();
		}

		return () => {
			// Clean up listeners
			if (window.electronAPI?.dynamicIsland?.removeStateChangeListener) {
				window.electronAPI.dynamicIsland.removeStateChangeListener();
			}
		};
	}, []);

	// Load haptic feedback setting from service
	const loadHapticFeedbackSetting = async () => {
		try {
			if (window.electronAPI?.notchdrop?.getHapticFeedback) {
				const result = await window.electronAPI.notchdrop.getHapticFeedback();
				if (result.success) {
					setHapticFeedback(result.enabled);
				}
			}
		} catch (error) {
			console.error('Error loading haptic feedback setting:', error);
		}
	};

	// Handle share actions
	const handleAirDrop = async () => {
		console.log('🛩️ AirDrop clicked');
		try {
			// Trigger haptic feedback if enabled
			if (hapticFeedback) {
				// Could implement haptic feedback here
			}

			// Open AirDrop sharing
			if (window.electronAPI?.notchdrop?.handleFiles) {
				// This would integrate with file sharing
				console.log('Opening AirDrop...');
			}
		} catch (error) {
			console.error('Error with AirDrop:', error);
		}
	};

	const handleShare = async () => {
		console.log('📤 Share clicked');
		try {
			if (hapticFeedback) {
				// Haptic feedback
			}

			// Open generic share dialog
			if (window.electronAPI?.notchdrop?.handleFiles) {
				console.log('Opening share dialog...');
			}
		} catch (error) {
			console.error('Error with Share:', error);
		}
	};

	const handleTray = () => {
		console.log('📂 Tray clicked');
		// Show tray items or open tray management
		setContentType('menu'); // Switch to menu view
	};

	// Menu actions
	const handleSettings = () => {
		console.log('⚙️ Settings clicked');
		setContentType('settings');
	};

	const handleClose = async () => {
		console.log('❌ Close clicked');
		try {
			if (window.electronAPI?.dynamicIsland?.collapse) {
				await window.electronAPI.dynamicIsland.collapse();
				setStatus('closed');
				setContentType('normal');
			}
		} catch (error) {
			console.error('Error closing NotchDrop:', error);
		}
	};

	// Settings actions
	const handleBackToNormal = () => {
		console.log('⬅️ Back to normal view');
		setContentType('normal');
	};

	const handleHapticToggle = async (enabled) => {
		console.log('🔊 Haptic feedback toggled:', enabled);
		setHapticFeedback(enabled);

		// Save this setting to the service
		try {
			if (window.electronAPI?.notchdrop?.setHapticFeedback) {
				await window.electronAPI.notchdrop.setHapticFeedback(enabled);
			}
		} catch (error) {
			console.error('Error saving haptic feedback setting:', error);
		}
	};

	// Render different content based on contentType
	const renderContent = () => {
		switch (contentType) {
			case 'normal':
				return (
					<div className="notch-content normal">
						<div className="content-row">
							{/* AirDrop Button */}
							<div className="share-button airdrop" onClick={handleAirDrop}>
								<div className="button-icon">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M6 22h12l-6-6-6 6zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
									</svg>
								</div>
								<div className="button-label">AirDrop</div>
							</div>

							{/* Share Button */}
							<div className="share-button generic" onClick={handleShare}>
								<div className="button-icon">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
									</svg>
								</div>
								<div className="button-label">Share</div>
							</div>

							{/* Tray Button */}
							<div className="share-button tray" onClick={handleTray}>
								<div className="button-icon">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="currentColor"
									>
										<path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 1 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z" />
									</svg>
								</div>
								<div className="button-label">Tray</div>
								{items.length > 0 && (
									<div className="item-count">{items.length}</div>
								)}
							</div>
						</div>
					</div>
				);

			case 'menu':
				return (
					<div className="notch-content menu">
						<div className="menu-header">
							<h3>Menu</h3>
						</div>
						<div className="menu-buttons">
							<button className="menu-button settings" onClick={handleSettings}>
								Settings
							</button>
							<button className="menu-button close" onClick={handleClose}>
								Close
							</button>
						</div>
					</div>
				);

			case 'settings':
				return (
					<div className="notch-content settings">
						<div className="settings-header">
							<h3>Settings</h3>
						</div>
						<div className="settings-content">
							<div className="setting-item">
								<label className="setting-label">
									<span>Haptic Feedback</span>
									<div className="toggle-switch">
										<input
											type="checkbox"
											checked={hapticFeedback}
											onChange={(e) => handleHapticToggle(e.target.checked)}
										/>
										<span className="toggle-slider"></span>
									</div>
								</label>
							</div>
							<button className="menu-button back" onClick={handleBackToNormal}>
								Back
							</button>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div
			className={`notchdrop-ui ${status} ${contentType}`}
			onMouseEnter={() => {
				if (status === 'closed' && isConnected) {
					setStatus('popping');
				}
			}}
			onMouseLeave={() => {
				if (status === 'popping' && isConnected) {
					setStatus('closed');
				}
			}}
		>
			{renderContent()}
		</div>
	);
};

export default NotchDropUI;
