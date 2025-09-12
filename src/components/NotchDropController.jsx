import React, { useState, useEffect } from 'react';
import { ipcRenderer } from 'electron';

const NotchDropController = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [status, setStatus] = useState('closed');
	const [autoOpen, setAutoOpen] = useState(true);
	const [droppedFiles, setDroppedFiles] = useState([]);

	useEffect(() => {
		// Initialize state
		checkVisibility();
		getStatus();
		getAutoOpenSetting();

		// Listen for NotchDrop events
		const handleStatusChanged = (event, newStatus) => {
			setStatus(newStatus);
		};

		const handleFileDropped = (event, filePath) => {
			setDroppedFiles((prev) => [...prev, filePath]);
		};

		const handleItemAdded = (event, itemData) => {};

		const handleItemRemoved = (event, itemData) => {};

		// Register event listeners
		ipcRenderer.on('notchdrop-status-changed', handleStatusChanged);
		ipcRenderer.on('notchdrop-file-dropped', handleFileDropped);
		ipcRenderer.on('notchdrop-item-added', handleItemAdded);
		ipcRenderer.on('notchdrop-item-removed', handleItemRemoved);

		return () => {
			// Cleanup event listeners
			ipcRenderer.removeListener('notchdrop-status-changed', handleStatusChanged);
			ipcRenderer.removeListener('notchdrop-file-dropped', handleFileDropped);
			ipcRenderer.removeListener('notchdrop-item-added', handleItemAdded);
			ipcRenderer.removeListener('notchdrop-item-removed', handleItemRemoved);
		};
	}, []);

	const checkVisibility = async () => {
		try {
			const result = await ipcRenderer.invoke('notchdrop-is-visible');
			if (result.success) {
				setIsVisible(result.visible);
			}
		} catch (error) {
			console.error('Error checking NotchDrop visibility:', error);
		}
	};

	const getStatus = async () => {
		try {
			const result = await ipcRenderer.invoke('notchdrop-get-status');
			if (result.success) {
				setStatus(result.status);
			}
		} catch (error) {
			console.error('Error getting NotchDrop status:', error);
		}
	};

	const getAutoOpenSetting = async () => {
		try {
			const result = await ipcRenderer.invoke('notchdrop-get-auto-open');
			if (result.success) {
				setAutoOpen(result.enabled);
			}
		} catch (error) {
			console.error('Error getting auto-open setting:', error);
		}
	};

	const handleEnable = async () => {
		try {
			const result = await ipcRenderer.invoke('notchdrop-enable');
			if (result.success) {
				setIsVisible(true);
			} else {
				console.error('Failed to enable NotchDrop:', result.error);
			}
		} catch (error) {
			console.error('Error enabling NotchDrop:', error);
		}
	};

	const handleDisable = async () => {
		try {
			const result = await ipcRenderer.invoke('notchdrop-disable');
			if (result.success) {
				setIsVisible(false);
			} else {
				console.error('Failed to disable NotchDrop:', result.error);
			}
		} catch (error) {
			console.error('Error disabling NotchDrop:', error);
		}
	};

	const handleToggle = async () => {
		try {
			const result = await ipcRenderer.invoke('notchdrop-toggle');
			if (result.success) {
				setIsVisible(!isVisible);
			} else {
				console.error('Failed to toggle NotchDrop:', result.error);
			}
		} catch (error) {
			console.error('Error toggling NotchDrop:', error);
		}
	};

	const handleSetStatus = async (newStatus) => {
		try {
			const result = await ipcRenderer.invoke('notchdrop-set-status', newStatus);
			if (result.success) {
				setStatus(newStatus);
			} else {
				console.error('Failed to set NotchDrop status:', result.error);
			}
		} catch (error) {
			console.error('Error setting NotchDrop status:', error);
		}
	};

	const handleAutoOpenChange = async (enabled) => {
		try {
			const result = await ipcRenderer.invoke('notchdrop-set-auto-open', enabled);
			if (result.success) {
				setAutoOpen(enabled);
			} else {
				console.error('Failed to update auto-open setting:', result.error);
			}
		} catch (error) {
			console.error('Error updating auto-open setting:', error);
		}
	};

	const clearDroppedFiles = () => {
		setDroppedFiles([]);
	};

	return (
		<div className="notchdrop-controller" style={{ padding: '20px', maxWidth: '600px' }}>
			<h2>NotchDrop Controller</h2>

			<div className="status-section" style={{ marginBottom: '20px' }}>
				<h3>Status</h3>
				<p>
					<strong>Visible:</strong> {isVisible ? 'Yes' : 'No'}
				</p>
				<p>
					<strong>Status:</strong> {status}
				</p>
			</div>

			<div className="controls-section" style={{ marginBottom: '20px' }}>
				<h3>Controls</h3>
				<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
					<button
						onClick={handleEnable}
						style={{
							padding: '8px 16px',
							backgroundColor: '#4CAF50',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						Enable
					</button>
					<button
						onClick={handleDisable}
						style={{
							padding: '8px 16px',
							backgroundColor: '#f44336',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						Disable
					</button>
					<button
						onClick={handleToggle}
						style={{
							padding: '8px 16px',
							backgroundColor: '#2196F3',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						Toggle
					</button>
				</div>
			</div>

			<div className="status-controls-section" style={{ marginBottom: '20px' }}>
				<h3>Status Controls</h3>
				<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
					<button
						onClick={() => handleSetStatus('closed')}
						style={{
							padding: '8px 16px',
							backgroundColor: status === 'closed' ? '#666' : '#ddd',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						Closed
					</button>
					<button
						onClick={() => handleSetStatus('opened')}
						style={{
							padding: '8px 16px',
							backgroundColor: status === 'opened' ? '#666' : '#ddd',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						Opened
					</button>
					<button
						onClick={() => handleSetStatus('popping')}
						style={{
							padding: '8px 16px',
							backgroundColor: status === 'popping' ? '#666' : '#ddd',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						Popping
					</button>
				</div>
			</div>

			<div className="settings-section" style={{ marginBottom: '20px' }}>
				<h3>Settings</h3>
				<label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
					<input
						type="checkbox"
						checked={autoOpen}
						onChange={(e) => handleAutoOpenChange(e.target.checked)}
					/>
					Auto-open on startup
				</label>
			</div>

			<div className="dropped-files-section">
				<h3>Dropped Files ({droppedFiles.length})</h3>
				{droppedFiles.length > 0 && (
					<button
						onClick={clearDroppedFiles}
						style={{
							marginBottom: '10px',
							padding: '4px 8px',
							backgroundColor: '#ff9800',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						Clear Files
					</button>
				)}
				<div
					style={{
						maxHeight: '200px',
						overflowY: 'auto',
						border: '1px solid #ddd',
						padding: '10px',
						borderRadius: '4px',
					}}
				>
					{droppedFiles.length === 0 ? (
						<p style={{ color: '#666', fontStyle: 'italic' }}>No files dropped yet</p>
					) : (
						<ul style={{ margin: 0, paddingLeft: '20px' }}>
							{droppedFiles.map((file, index) => (
								<li
									key={index}
									style={{ marginBottom: '5px', wordBreak: 'break-all' }}
								>
									{file}
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export default NotchDropController;
