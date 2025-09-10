import React from 'react';
import { useNotchDrop } from '../../hooks/useNotchDrop';

const NotchDropSettings = () => {
	const {
		isVisible,
		status,
		autoOpen,
		droppedFiles,
		isLoading,
		error,
		enable,
		disable,
		toggle,
		setStatus,
		setAutoOpenSetting,
		clearDroppedFiles,
		refresh,
		canToggle,
		hasError,
	} = useNotchDrop();

	const handleToggle = async () => {
		const result = await toggle();
		if (!result.success) {
			console.error('Failed to toggle NotchDrop:', result.error);
		}
	};

	const handleStatusChange = async (newStatus) => {
		const result = await setStatus(newStatus);
		if (!result.success) {
			console.error('Failed to set status:', result.error);
		}
	};

	const handleAutoOpenChange = async (enabled) => {
		const result = await setAutoOpenSetting(enabled);
		if (!result.success) {
			console.error('Failed to update auto-open setting:', result.error);
		}
	};

	return (
		<div
			className="notchdrop-settings"
			style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}
		>
			<div className="settings-header" style={{ marginBottom: '32px' }}>
				<h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '8px' }}>
					NotchDrop Settings
				</h1>
				<p style={{ color: '#666', fontSize: '16px' }}>
					Configure the NotchDrop functionality for file dropping and quick access
				</p>
			</div>

			{hasError && (
				<div
					className="error-banner"
					style={{
						backgroundColor: '#ffebee',
						border: '1px solid #f44336',
						borderRadius: '8px',
						padding: '16px',
						marginBottom: '24px',
						color: '#c62828',
					}}
				>
					<strong>Error:</strong> {error}
					<button
						onClick={refresh}
						style={{
							marginLeft: '16px',
							padding: '4px 12px',
							backgroundColor: '#f44336',
							color: 'white',
							border: 'none',
							borderRadius: '4px',
							cursor: 'pointer',
						}}
					>
						Retry
					</button>
				</div>
			)}

			<div className="settings-grid" style={{ display: 'grid', gap: '24px' }}>
				{/* Status Section */}
				<div
					className="status-section"
					style={{
						backgroundColor: '#f8f9fa',
						borderRadius: '12px',
						padding: '24px',
						border: '1px solid #e9ecef',
					}}
				>
					<h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
						Current Status
					</h2>

					<div className="status-info" style={{ marginBottom: '20px' }}>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: '8px',
							}}
						>
							<span style={{ fontWeight: '500' }}>Visibility:</span>
							<span
								style={{
									color: isVisible ? '#4caf50' : '#f44336',
									fontWeight: '600',
								}}
							>
								{isVisible ? 'Visible' : 'Hidden'}
							</span>
						</div>
						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<span style={{ fontWeight: '500' }}>Status:</span>
							<span
								style={{
									backgroundColor: '#e3f2fd',
									color: '#1976d2',
									padding: '4px 12px',
									borderRadius: '16px',
									fontSize: '14px',
									fontWeight: '500',
								}}
							>
								{status}
							</span>
						</div>
					</div>

					<div
						className="status-controls"
						style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
					>
						<button
							onClick={handleToggle}
							disabled={!canToggle || isLoading}
							style={{
								padding: '10px 20px',
								backgroundColor: '#2196f3',
								color: 'white',
								border: 'none',
								borderRadius: '8px',
								cursor: canToggle && !isLoading ? 'pointer' : 'not-allowed',
								opacity: canToggle && !isLoading ? 1 : 0.6,
								fontWeight: '500',
							}}
						>
							{isLoading ? 'Loading...' : isVisible ? 'Hide' : 'Show'}
						</button>

						<button
							onClick={() => handleStatusChange('opened')}
							disabled={!canToggle || isLoading}
							style={{
								padding: '10px 20px',
								backgroundColor: '#4caf50',
								color: 'white',
								border: 'none',
								borderRadius: '8px',
								cursor: canToggle && !isLoading ? 'pointer' : 'not-allowed',
								opacity: canToggle && !isLoading ? 1 : 0.6,
								fontWeight: '500',
							}}
						>
							Open
						</button>

						<button
							onClick={() => handleStatusChange('closed')}
							disabled={!canToggle || isLoading}
							style={{
								padding: '10px 20px',
								backgroundColor: '#ff9800',
								color: 'white',
								border: 'none',
								borderRadius: '8px',
								cursor: canToggle && !isLoading ? 'pointer' : 'not-allowed',
								opacity: canToggle && !isLoading ? 1 : 0.6,
								fontWeight: '500',
							}}
						>
							Close
						</button>
					</div>
				</div>

				{/* Settings Section */}
				<div
					className="settings-section"
					style={{
						backgroundColor: '#f8f9fa',
						borderRadius: '12px',
						padding: '24px',
						border: '1px solid #e9ecef',
					}}
				>
					<h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
						Preferences
					</h2>

					<div className="setting-item" style={{ marginBottom: '16px' }}>
						<label
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '12px',
								cursor: 'pointer',
								fontSize: '16px',
							}}
						>
							<input
								type="checkbox"
								checked={autoOpen}
								onChange={(e) => handleAutoOpenChange(e.target.checked)}
								disabled={isLoading}
								style={{
									width: '18px',
									height: '18px',
									cursor: isLoading ? 'not-allowed' : 'pointer',
								}}
							/>
							<span style={{ fontWeight: '500' }}>Auto-open on startup</span>
						</label>
						<p
							style={{
								marginLeft: '30px',
								marginTop: '4px',
								color: '#666',
								fontSize: '14px',
							}}
						>
							Automatically show NotchDrop when the application starts
						</p>
					</div>
				</div>

				{/* File History Section */}
				<div
					className="files-section"
					style={{
						backgroundColor: '#f8f9fa',
						borderRadius: '12px',
						padding: '24px',
						border: '1px solid #e9ecef',
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '16px',
						}}
					>
						<h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
							Dropped Files ({droppedFiles.length})
						</h2>
						{droppedFiles.length > 0 && (
							<button
								onClick={clearDroppedFiles}
								style={{
									padding: '6px 12px',
									backgroundColor: '#ff5722',
									color: 'white',
									border: 'none',
									borderRadius: '6px',
									cursor: 'pointer',
									fontSize: '14px',
									fontWeight: '500',
								}}
							>
								Clear All
							</button>
						)}
					</div>

					<div
						style={{
							maxHeight: '300px',
							overflowY: 'auto',
							border: '1px solid #dee2e6',
							borderRadius: '8px',
							backgroundColor: 'white',
						}}
					>
						{droppedFiles.length === 0 ? (
							<div
								style={{
									padding: '32px',
									textAlign: 'center',
									color: '#666',
								}}
							>
								<p style={{ margin: 0, fontSize: '16px' }}>No files dropped yet</p>
								<p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
									Drag and drop files onto the NotchDrop to see them here
								</p>
							</div>
						) : (
							<div style={{ padding: '16px' }}>
								{droppedFiles.map((file, index) => (
									<div
										key={index}
										style={{
											padding: '12px',
											borderBottom:
												index < droppedFiles.length - 1
													? '1px solid #f0f0f0'
													: 'none',
											wordBreak: 'break-all',
											fontSize: '14px',
										}}
									>
										{file}
									</div>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Information Section */}
				<div
					className="info-section"
					style={{
						backgroundColor: '#e3f2fd',
						borderRadius: '12px',
						padding: '24px',
						border: '1px solid #bbdefb',
					}}
				>
					<h2
						style={{
							fontSize: '20px',
							fontWeight: '600',
							marginBottom: '16px',
							color: '#1976d2',
						}}
					>
						How to Use NotchDrop
					</h2>

					<div style={{ color: '#1565c0' }}>
						<p style={{ marginBottom: '12px' }}>
							<strong>1. Show NotchDrop:</strong> Click the "Show" button above or use
							the toggle control
						</p>
						<p style={{ marginBottom: '12px' }}>
							<strong>2. Drop Files:</strong> Drag and drop any files onto the
							NotchDrop area at the top of your screen
						</p>
						<p style={{ marginBottom: '12px' }}>
							<strong>3. Quick Access:</strong> The NotchDrop provides quick access to
							dropped files and can be configured to auto-open on startup
						</p>
						<p style={{ marginBottom: '0' }}>
							<strong>4. Status Control:</strong> Use the status controls to open,
							close, or manage the NotchDrop state
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NotchDropSettings;
