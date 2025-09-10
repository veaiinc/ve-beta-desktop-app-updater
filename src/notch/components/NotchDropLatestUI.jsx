import React, { useEffect, useState, useRef } from 'react';
import './NotchDropLatestUI.scss';

const NotchDropLatestUI = () => {
	const containerRef = useRef(null);
	const [isConnected, setIsConnected] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const [files, setFiles] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [storageTime, setStorageTime] = useState('1 day');
	const [hapticFeedback, setHapticFeedback] = useState(true);

	useEffect(() => {
		// Check if we're in Electron environment
		if (window.electronAPI) {
			setIsConnected(true);
			loadSettings();
			setupEventListeners();
		}

		return () => {
			cleanupEventListeners();
		};
	}, []);

	const loadSettings = async () => {
		try {
			if (window.electronAPI?.notchdrop?.getHapticFeedback) {
				const result = await window.electronAPI.notchdrop.getHapticFeedback();
				if (result.success) {
					setHapticFeedback(result.enabled);
				}
			}
		} catch (error) {
			console.error('Error loading settings:', error);
		}
	};

	const setupEventListeners = () => {
		// Listen for dynamic island state changes
		if (window.electronAPI?.dynamicIsland?.onStateChange) {
			window.electronAPI.dynamicIsland.onStateChange((data) => {
				setIsExpanded(data.expanded);
			});
		}

		// Listen for file drop events
		if (window.electronAPI?.notchdrop?.onFileDropped) {
			window.electronAPI.notchdrop.onFileDropped((filePath) => {
				handleFileDropped(filePath);
			});
		}
	};

	const cleanupEventListeners = () => {
		if (window.electronAPI?.dynamicIsland?.removeStateChangeListener) {
			window.electronAPI.dynamicIsland.removeStateChangeListener();
		}
	};

	const handleFileDropped = (filePath) => {
		console.log('File dropped:', filePath);
		const newFile = {
			id: Date.now(),
			path: filePath,
			name: filePath.split('/').pop(),
			size: 'Unknown', // Would need to get from native side
			timestamp: new Date(),
			type: getFileType(filePath),
		};
		setFiles((prev) => [newFile, ...prev]);
		setIsLoading(false);
	};

	const getFileType = (filePath) => {
		const ext = filePath.split('.').pop().toLowerCase();
		const typeMap = {
			jpg: 'image',
			jpeg: 'image',
			png: 'image',
			gif: 'image',
			mp4: 'video',
			mov: 'video',
			avi: 'video',
			pdf: 'document',
			doc: 'document',
			docx: 'document',
			zip: 'archive',
			rar: 'archive',
			'7z': 'archive',
		};
		return typeMap[ext] || 'file';
	};

	const handleAirDrop = async () => {
		console.log('🛩️ AirDrop clicked');
		try {
			if (hapticFeedback) {
				// Trigger haptic feedback
			}

			// Open file picker for AirDrop
			if (window.electronAPI?.notchdrop?.openAirDrop) {
				await window.electronAPI.notchdrop.openAirDrop();
			}
		} catch (error) {
			console.error('Error with AirDrop:', error);
		}
	};

	const handleShare = async () => {
		console.log('📤 Share clicked');
		try {
			if (hapticFeedback) {
				// Trigger haptic feedback
			}

			// Open file picker for sharing
			if (window.electronAPI?.notchdrop?.openShare) {
				await window.electronAPI.notchdrop.openShare();
			}
		} catch (error) {
			console.error('Error with Share:', error);
		}
	};

	const handleFileClick = (file) => {
		console.log('File clicked:', file);
		if (window.electronAPI?.notchdrop?.openFile) {
			window.electronAPI.notchdrop.openFile(file.path);
		}
	};

	const handleDeleteFile = (fileId, event) => {
		event.stopPropagation();
		console.log('Delete file:', fileId);

		if (window.electronAPI?.notchdrop?.deleteFile) {
			window.electronAPI.notchdrop.deleteFile(fileId);
		}

		setFiles((prev) => prev.filter((f) => f.id !== fileId));
	};

	const handleSettings = () => {
		console.log('⚙️ Settings clicked');
		// This would open settings panel
	};

	const formatFileSize = (size) => {
		if (size === 'Unknown') return size;
		const bytes = parseInt(size);
		if (bytes < 1024) return bytes + ' B';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
		return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
	};

	const formatTime = (date) => {
		const now = new Date();
		const diff = now - date;
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);

		if (minutes < 1) return 'Just now';
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		return `${days}d ago`;
	};

	return (
		<div
			ref={containerRef}
			className={`notchdrop-latest-ui ${isExpanded ? 'expanded' : 'collapsed'} ${
				isLoading ? 'loading' : ''
			}`}
		>
			{/* Main Content Area */}
			<div className="notch-content">
				{/* Share Buttons */}
				<div className="share-section">
					<div className="share-button airdrop" onClick={handleAirDrop}>
						<div className="button-icon">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
								<path d="M6 22h12l-6-6-6 6zM21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
							</svg>
						</div>
						<div className="button-label">AirDrop</div>
					</div>

					<div className="share-button generic" onClick={handleShare}>
						<div className="button-icon">
							<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
								<path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
							</svg>
						</div>
						<div className="button-label">Share</div>
					</div>
				</div>

				{/* Tray Section */}
				<div className="tray-section">
					{files.length === 0 ? (
						<div className="empty-tray">
							<div className="empty-icon">
								<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
									<path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 1 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z" />
								</svg>
							</div>
							<div className="empty-text">
								Drag files here to keep them for {storageTime}
							</div>
							<div className="empty-subtext">Press Option to delete</div>
						</div>
					) : (
						<div className="file-list">
							{files.map((file) => (
								<div
									key={file.id}
									className="file-item"
									onClick={() => handleFileClick(file)}
								>
									<div className="file-icon">
										{file.type === 'image' && '🖼️'}
										{file.type === 'video' && '🎥'}
										{file.type === 'document' && '📄'}
										{file.type === 'archive' && '📦'}
										{file.type === 'file' && '📄'}
									</div>
									<div className="file-info">
										<div className="file-name">{file.name}</div>
										<div className="file-meta">
											{formatFileSize(file.size)} •{' '}
											{formatTime(file.timestamp)}
										</div>
									</div>
									<button
										className="delete-button"
										onClick={(e) => handleDeleteFile(file.id, e)}
										title="Delete file"
									>
										×
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Settings Panel */}
			<div className="settings-panel">
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
									onChange={(e) => setHapticFeedback(e.target.checked)}
								/>
								<span className="toggle-slider"></span>
							</div>
						</label>
					</div>
					<div className="setting-item">
						<label className="setting-label">
							<span>Storage Time</span>
							<select
								value={storageTime}
								onChange={(e) => setStorageTime(e.target.value)}
								className="storage-select"
							>
								<option value="1 hour">1 Hour</option>
								<option value="1 day">1 Day</option>
								<option value="2 days">2 Days</option>
								<option value="1 week">1 Week</option>
								<option value="forever">Forever</option>
							</select>
						</label>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotchDropLatestUI;
