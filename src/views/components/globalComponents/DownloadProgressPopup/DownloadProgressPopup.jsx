import React, { useState, useEffect, useRef, useContext } from 'react';
import Context from '../../../../context/context';
import './DownloadProgressPopup.scss';
import UpDownArrow from '../../../../assets/svg/my_templates/UpDownArrowSvg';

const DownloadProgressPopup = () => {
	const {
		galleryInfo: {
			downloadSessions,
			showDownloadProgressPopup,
			removeDownloadSession,
			hideDownloadProgressPopup,
		},
	} = useContext(Context);

	const [isExpanded, setIsExpanded] = useState(false);
	const [activeDownloads, setActiveDownloads] = useState(new Map()); // For rendering only
	const [currentSessionIndex, setCurrentSessionIndex] = useState(0); // Track which session to display
	const [showCompletionMessage, setShowCompletionMessage] = useState(false); // Show completion message
	const intervalRefs = useRef(new Map()); // Map of sessionId -> interval ref
	const startedSessions = useRef(new Set()); // Track which sessions have been started
	const previousSessions = useRef(new Set()); // Track previous session IDs
	const sessionStatesRef = useRef(new Map()); // ✅ LIVE state for each session — immune to re-renders

	// Helper function to get download name from session data
	const getDownloadName = (downloadSession) => {
		// First try to get name from session data
		if (downloadSession.name) {
			return downloadSession.name;
		}

		// Fallback based on type
		if (downloadSession.type === 'single') {
			return 'Single Image';
		} else if (downloadSession.type === 'multiple') {
			return `${downloadSession.totalFiles} Images`;
		} else if (downloadSession.type === 'album') {
			return downloadSession.albumName || 'Album Download';
		} else if (downloadSession.type === 'clientSelection') {
			return 'Client Selection';
		}

		// Final fallback
		return 'Download';
	};

	// Download handlers
	const handleDownloadComplete = (sessionId) => {
		window.dispatchEvent(
			new CustomEvent('downloadCompleted', {
				detail: { sessionId },
			}),
		);
	};

	const handleDownloadCancel = (sessionId) => {
		removeDownloadSession(sessionId);
	};

	const handleCloseDownloadProgressPopup = () => {
		hideDownloadProgressPopup();
	};

	// Navigation helpers for sequential display
	const getCurrentSession = () => {
		const downloadStates = Array.from(activeDownloads.values());
		return downloadStates[currentSessionIndex] || null;
	};

	const getTotalSessions = () => {
		return Array.from(activeDownloads.values()).length;
	};

	const goToNextSession = () => {
		const totalSessions = getTotalSessions();
		if (totalSessions > 0) {
			setCurrentSessionIndex((prev) => (prev + 1) % totalSessions);
		}
	};

	const goToPreviousSession = () => {
		const totalSessions = getTotalSessions();
		if (totalSessions > 0) {
			setCurrentSessionIndex((prev) => (prev - 1 + totalSessions) % totalSessions);
		}
	};

	const goToSession = (index) => {
		const totalSessions = getTotalSessions();
		if (index >= 0 && index < totalSessions) {
			setCurrentSessionIndex(index);
		}
	};

	// ✅ Helper to update both React state (for UI) and ref state (for logic)
	const updateDownloadState = (sessionId, updates) => {
		// Update ref state — used during async download
		const currentRefState = sessionStatesRef.current.get(sessionId);
		if (currentRefState) {
			sessionStatesRef.current.set(sessionId, { ...currentRefState, ...updates });
		}

		// Update React state — for rendering
		setActiveDownloads((prev) => {
			const newMap = new Map(prev);
			const currentState = newMap.get(sessionId);
			if (currentState) {
				newMap.set(sessionId, { ...currentState, ...updates });
			}
			return newMap;
		});
	};

	// Initialize download states for new sessions
	useEffect(() => {
		const currentSessionIds = new Set(downloadSessions.map((s) => s.id));

		const newSessions = downloadSessions.filter(
			(session) => !previousSessions.current.has(session.id),
		);

		newSessions.forEach((session) => {
			if (!activeDownloads.has(session.id) && !startedSessions.current.has(session.id)) {
				const downloadState = {
					sessionId: session.id,
					files: session.files || [],
					type: session.type || 'single',
					name: session.name,
					albumName: session.albumName,
					downloadItems: session.downloadItems, // Preserve download items for album downloads
					folderName: session.folderName,
					maxZipSize: session.maxZipSize,
					status: 'preparing',
					overallProgress: 0,
					completedFiles: 0,
					totalFiles: session.totalFiles || session.files?.length || 0,
					startTime: Date.now(),
					error: null,
				};

				// ✅ Initialize in both React state and ref state
				setActiveDownloads((prev) => new Map(prev.set(session.id, downloadState)));
				sessionStatesRef.current.set(session.id, { ...downloadState });

				startedSessions.current.add(session.id);
				startDownloadSession(session.id, downloadState);
			}
		});

		// Clean up removed sessions
		setActiveDownloads((prev) => {
			const newMap = new Map();
			prev.forEach((state, id) => {
				if (currentSessionIds.has(id)) {
					newMap.set(id, state);
				} else {
					// ✅ Clean up ref state
					sessionStatesRef.current.delete(id);

					// Clean up other refs
					startedSessions.current.delete(id);
					previousSessions.current.delete(id);

					// Clear any intervals
					if (intervalRefs.current.has(id)) {
						clearInterval(intervalRefs.current.get(id));
						intervalRefs.current.delete(id);
					}
				}
			});
			return newMap;
		});

		previousSessions.current = currentSessionIds;
	}, [downloadSessions]);

	// Handle session index when sessions change
	useEffect(() => {
		const totalSessions = getTotalSessions();
		if (currentSessionIndex >= totalSessions && totalSessions > 0) {
			setCurrentSessionIndex(Math.max(0, totalSessions - 1));
		}
	}, [downloadSessions, currentSessionIndex]);

	// Start download session
	const startDownloadSession = async (sessionId, initialState) => {
		try {
			updateDownloadState(sessionId, { status: 'downloading' });

			// Start progress monitoring
			const progressIntervalId = setInterval(async () => {
				try {
					const currentState = sessionStatesRef.current.get(sessionId);
					if (!currentState) {
						console.warn(
							`Session ${sessionId} not found in ref state, stopping progress monitoring`,
						);
						clearInterval(progressIntervalId);
						intervalRefs.current.delete(sessionId);
						return;
					}

					// Stop monitoring if session is completed or failed
					if (
						currentState.status === 'completed' ||
						currentState.status === 'failed' ||
						currentState.status === 'cancelled'
					) {
						clearInterval(progressIntervalId);
						intervalRefs.current.delete(sessionId);
						return;
					}

					// Calculate progress based on completed files
					const completedCount =
						currentState.files?.filter((file) => file.status === 'completed').length ||
						0;

					const progress =
						currentState.totalFiles > 0
							? (completedCount / currentState.totalFiles) * 100
							: 0;

					updateDownloadState(sessionId, {
						completedFiles: completedCount,
						overallProgress: Math.min(progress, 100),
					});

					// Check if all files are completed
					if (completedCount >= currentState.totalFiles && currentState.totalFiles > 0) {
						updateDownloadState(sessionId, {
							status: 'completed',
							overallProgress: 100,
						});
						handleDownloadComplete(sessionId);
						clearInterval(progressIntervalId);
						intervalRefs.current.delete(sessionId);
					}
				} catch (error) {
					console.error(`Progress monitoring error for session ${sessionId}:`, error);
				}
			}, 500); // Reduced interval for more responsive updates

			intervalRefs.current.set(sessionId, progressIntervalId);

			// Process downloads based on type
			if (initialState.type === 'single' || initialState.type === 'multiple') {
				await processImageDownloads(sessionId, initialState);
			} else if (initialState.type === 'album') {
				await processAlbumDownload(sessionId, initialState);
			} else if (initialState.type === 'clientSelection') {
				await processClientSelectionDownload(sessionId, initialState);
			}
		} catch (error) {
			console.error(`Download session error for ${sessionId}:`, error);
			updateDownloadState(sessionId, {
				status: 'failed',
				error: error.message,
			});
		}
	};

	// Process individual image downloads
	const processImageDownloads = async (sessionId, downloadState) => {
		const files = downloadState.files || [];

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			try {
				updateDownloadState(sessionId, {
					files: files.map((f, index) =>
						index === i ? { ...f, status: 'downloading' } : f,
					),
				});

				// Trigger actual download
				if (file.url) {
					try {
						// Use fetch to download the file as a blob
						const response = await fetch(file.url, {
							method: 'GET',
							headers: {
								Accept: 'image/*,*/*',
							},
						});

						if (!response.ok) {
							throw new Error(`HTTP error! status: ${response.status}`);
						}

						const blob = await response.blob();

						// Create object URL and trigger download
						const objectUrl = window.URL.createObjectURL(blob);
						const link = document.createElement('a');
						link.href = objectUrl;
						link.download = file.name || `image_${i + 1}`;
						link.style.display = 'none';
						document.body.appendChild(link);

						// Trigger the download
						link.click();

						// Clean up
						setTimeout(() => {
							document.body.removeChild(link);
							window.URL.revokeObjectURL(objectUrl);
						}, 100);
					} catch (fetchError) {
						console.error(`Fetch error for ${file.name}:`, fetchError);
						const link = document.createElement('a');
						link.href = file.url;
						link.download = file.name || `image_${i + 1}`;
						link.target = '_blank';
						link.style.display = 'none';
						document.body.appendChild(link);
						link.click();
						setTimeout(() => {
							document.body.removeChild(link);
						}, 100);
					}

					// Add a small delay to make progress visible
					await new Promise((resolve) => setTimeout(resolve, 1000));
				} else {
					console.warn(`No URL provided for file: ${file.name}`);
				}

				// Mark as completed
				updateDownloadState(sessionId, {
					files: files.map((f, index) =>
						index === i ? { ...f, status: 'completed', progress: 100 } : f,
					),
				});
			} catch (error) {
				console.error(`Error downloading file ${file.name}:`, error);
				updateDownloadState(sessionId, {
					files: files.map((f, index) =>
						index === i ? { ...f, status: 'failed', error: error.message } : f,
					),
				});
			}
		}
	};

	// Process album download (ZIP creation) with efficient background processing
	const processAlbumDownload = async (sessionId, downloadState) => {
		try {
			updateDownloadState(sessionId, { status: 'downloading' });

			// Use Electron API for ZIP creation if available
			if (
				window.electronApi &&
				downloadState.downloadItems &&
				downloadState.downloadItems.length > 0
			) {
				// Detect if this is an original download for optimization
				const isOriginalDownload =
					downloadState.originalDownload ||
					downloadState.type === 'original' ||
					downloadState.downloadItems.some((item) => item.size > 5 * 1024 * 1024);

				// Set up progress tracking
				let progressInterval;
				let currentProgress = 0;

				// Start progress tracking with adaptive intervals
				const progressIntervalMs = isOriginalDownload ? 500 : 200;
				progressInterval = setInterval(() => {
					if (currentProgress < 90) {
						const increment = isOriginalDownload
							? Math.random() * 2
							: Math.random() * 5;
						currentProgress += increment;
						updateDownloadState(sessionId, {
							overallProgress: Math.min(currentProgress, 90),
						});
					}
				}, progressIntervalMs);

				// Set up progress listener for real-time updates
				const progressListener = (data) => {
					if (data.sessionId === sessionId) {
						if (data.phase === 'progress') {
							updateDownloadState(sessionId, {
								overallProgress: Math.min(data.progress || 0, 90),
							});
						} else if (data.phase === 'complete') {
							updateDownloadState(sessionId, {
								status: 'completed',
								overallProgress: 100,
								files: downloadState.files.map((f) => ({
									...f,
									status: 'completed',
									progress: 100,
								})),
							});
							handleDownloadComplete(sessionId);
						}
					}
				};

				// Register progress listener
				window.electronApi.onDownloadProgress(progressListener);

				try {
					// Use the efficient createZipFromUrls method with high parallel limit
					const result = await window.electronApi.createZipFromUrls({
						items: downloadState.downloadItems,
						folderName: downloadState.folderName || 'Album_Download',
						maxZipSize: downloadState.maxZipSize || 3 * 1024 * 1024 * 1024, // 3GB
						sessionId: sessionId,
						parallelLimit: isOriginalDownload ? 50 : 100, // High parallel limit for efficiency
					});

					// Clear progress interval
					if (progressInterval) {
						clearInterval(progressInterval);
					}

					if (result.success) {
						updateDownloadState(sessionId, {
							status: 'completed',
							overallProgress: 100,
							files: downloadState.files.map((f) => ({
								...f,
								status: 'completed',
								progress: 100,
							})),
						});
						handleDownloadComplete(sessionId);
					} else {
						throw new Error(result.error || 'ZIP creation failed');
					}
				} catch (zipError) {
					// Clear progress interval
					if (progressInterval) {
						clearInterval(progressInterval);
					}
					// Remove progress listener
					window.electronApi.removeDownloadProgressListener();
					throw zipError;
				}
			} else if (downloadState.files && downloadState.files[0]?.url) {
				// Fallback: direct download if URL is available
				const file = downloadState.files[0];
				const link = document.createElement('a');
				link.href = file.url;
				link.download = file.name || 'album.zip';
				link.style.display = 'none';
				document.body.appendChild(link);
				link.click();
				setTimeout(() => {
					document.body.removeChild(link);
				}, 100);

				updateDownloadState(sessionId, {
					status: 'completed',
					overallProgress: 100,
					files: downloadState.files.map((f) => ({
						...f,
						status: 'completed',
						progress: 100,
					})),
				});
			} else {
				// Final fallback: simulate ZIP creation
				await new Promise((resolve) => setTimeout(resolve, 2000));
				updateDownloadState(sessionId, {
					status: 'completed',
					overallProgress: 100,
					files: downloadState.files.map((f) => ({
						...f,
						status: 'completed',
						progress: 100,
					})),
				});
			}
		} catch (error) {
			console.error('Album download error:', error);
			updateDownloadState(sessionId, {
				status: 'failed',
				error: error.message,
			});
		}
	};

	// Process client selection download
	const processClientSelectionDownload = async (sessionId, downloadState) => {
		try {
			updateDownloadState(sessionId, { status: 'downloading' });

			// Handle client selection download
			if (downloadState.files && downloadState.files[0]?.url) {
				// Direct download if URL is available
				const file = downloadState.files[0];
				const link = document.createElement('a');
				link.href = file.url;
				link.download = file.name || 'client-selection.zip';
				link.style.display = 'none';
				document.body.appendChild(link);
				link.click();
				setTimeout(() => {
					document.body.removeChild(link);
				}, 100);

				updateDownloadState(sessionId, {
					status: 'completed',
					overallProgress: 100,
				});
			} else {
				// Fallback: simulate client selection download
				await new Promise((resolve) => setTimeout(resolve, 1500));

				updateDownloadState(sessionId, {
					status: 'completed',
					overallProgress: 100,
				});
			}
		} catch (error) {
			updateDownloadState(sessionId, {
				status: 'failed',
				error: error.message,
			});
		}
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			intervalRefs.current.forEach((intervalId) => {
				clearInterval(intervalId);
			});
			intervalRefs.current.clear();

			// Remove progress listener on unmount
			if (window.electronApi && window.electronApi.removeDownloadProgressListener) {
				window.electronApi.removeDownloadProgressListener();
			}
		};
	}, []);

	// Test function for debugging - can be called from browser console
	window.testDownload = async (url, filename = 'test-download.jpg') => {
		try {
			const response = await fetch(url, {
				method: 'GET',
				headers: {
					Accept: 'image/*,*/*',
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const blob = await response.blob();

			const objectUrl = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = objectUrl;
			link.download = filename;
			link.style.display = 'none';
			document.body.appendChild(link);
			link.click();
			setTimeout(() => {
				document.body.removeChild(link);
				window.URL.revokeObjectURL(objectUrl);
			}, 100);
		} catch (error) {
			console.error('Test download failed:', error);
		}
	};

	const handleClose = () => {
		setIsExpanded(false);
		handleCloseDownloadProgressPopup();
	};

	const handleCancelSession = (sessionId) => {
		// Clear interval if exists
		if (intervalRefs.current.has(sessionId)) {
			clearInterval(intervalRefs.current.get(sessionId));
			intervalRefs.current.delete(sessionId);
		}

		// Remove progress listener
		if (window.electronApi && window.electronApi.removeDownloadProgressListener) {
			window.electronApi.removeDownloadProgressListener();
		}

		// Update state to cancelled
		updateDownloadState(sessionId, { status: 'cancelled' });

		// Remove session after a short delay
		setTimeout(() => {
			handleDownloadCancel(sessionId);
		}, 500);
	};

	const getStatusText = (status) => {
		switch (status) {
			case 'preparing':
				return 'Preparing download...';
			case 'downloading':
				return 'Downloading...';
			case 'completed':
				return 'Download completed';
			case 'failed':
				return 'Download failed';
			case 'cancelled':
				return 'Download cancelled';
			default:
				return 'Unknown status';
		}
	};

	const getCompletedFilesCount = (files) => {
		return files?.filter((f) => f.status === 'completed').length || 0;
	};

	const formatTime = (ms) => {
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);

		if (hours > 0) {
			return `${hours}h ${minutes % 60}m`;
		} else if (minutes > 0) {
			return `${minutes}m ${seconds % 60}s`;
		} else {
			return `${seconds}s`;
		}
	};

	const getEstimatedTime = (downloadState) => {
		if (!downloadState || downloadState.completedFiles === 0) return 'Calculating...';

		const elapsed = Date.now() - downloadState.startTime;
		const rate = downloadState.completedFiles / elapsed;
		const remaining = (downloadState.totalFiles - downloadState.completedFiles) / rate;

		return formatTime(remaining);
	};

	const getTotalProgress = () => {
		const states = Array.from(activeDownloads.values());
		if (states.length === 0) return 0;
		const totalProgress = states.reduce((sum, state) => sum + state.overallProgress, 0);
		return Math.round(totalProgress / states.length);
	};

	const getOverallStatus = () => {
		// Show completion message if all downloads are finished
		if (showCompletionMessage) {
			const states = Array.from(activeDownloads.values());
			const allCompleted = states.every((state) => state.status === 'completed');
			const allFailed = states.every((state) => state.status === 'failed');

			if (allCompleted) return 'Download completed!';
			if (allFailed) return 'Download failed!';
			return 'Download finished!';
		}

		const states = Array.from(activeDownloads.values());
		if (states.length === 0) return 'No downloads';
		const hasDownloading = states.some((s) => s.status === 'downloading');
		const hasCompleted = states.some((s) => s.status === 'completed');
		const hasFailed = states.some((s) => s.status === 'failed');
		if (hasDownloading)
			return `Downloading ${states.length} item${states.length > 1 ? 's' : ''}`;
		if (hasCompleted && !hasDownloading && !hasFailed) return 'All downloads completed';
		if (hasFailed) return 'Some downloads failed';
		return 'Processing...';
	};

	// Auto-close popup when all downloads are completed
	useEffect(() => {
		const states = Array.from(activeDownloads.values());
		if (states.length === 0) return;

		const allCompleted = states.every((state) => state.status === 'completed');
		const allFailed = states.every((state) => state.status === 'failed');
		const allFinished = allCompleted || allFailed;

		if (allFinished && !showCompletionMessage) {
			// Show completion message first
			setShowCompletionMessage(true);

			// Wait 3 seconds to show completion message, then close
			const timer = setTimeout(() => {
				hideDownloadProgressPopup();
				setShowCompletionMessage(false);
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [activeDownloads, hideDownloadProgressPopup, showCompletionMessage]);

	// Ensure popup shows if there are active downloads, even if state is inconsistent
	const hasActiveDownloads = activeDownloads.size > 0;
	const shouldShowPopup = showDownloadProgressPopup || hasActiveDownloads;

	if (!shouldShowPopup || !downloadSessions || downloadSessions.length === 0) {
		return null;
	}

	const downloadStates = Array.from(activeDownloads.values());
	const currentSession = getCurrentSession();
	const totalSessions = getTotalSessions();

	return (
		<div className="download-progress-popup">
			{!isExpanded ? (
				<div className="download-progress-header">
					<div className="download-info">
						<div className="download-title">{getOverallStatus()}</div>
						<div className="download-progress">
							<div className="progress-bar">
								<div
									className="progress-fill"
									style={{
										width: `${
											showCompletionMessage
												? 100
												: currentSession
												? currentSession.overallProgress
												: 0
										}%`,
									}}
								/>
							</div>
							<span className="progress-text">
								{showCompletionMessage
									? 100
									: currentSession
									? Math.round(currentSession.overallProgress)
									: 0}
								%
							</span>
						</div>
						<div className="download-details">
							{showCompletionMessage
								? `${currentSession ? currentSession.totalFiles : 0} of ${
										currentSession ? currentSession.totalFiles : 0
								  } files`
								: `${
										currentSession
											? getCompletedFilesCount(currentSession.files)
											: 0
								  } of ${currentSession ? currentSession.totalFiles : 0} files`}
							{totalSessions > 1 &&
								` • ${currentSessionIndex + 1} of ${totalSessions} downloads`}
						</div>
					</div>
					<div className="download-controls">
						<button
							className="control-btn expand"
							onClick={() => setIsExpanded(true)}
							style={{ cursor: 'pointer' }}
						>
							<UpDownArrow />
						</button>
					</div>
				</div>
			) : (
				<div className="download-progress-expanded">
					<div className="download-progress-header">
						<div className="download-title">{getOverallStatus()}</div>
						<button
							className="control-btn close"
							onClick={handleClose}
							style={{ cursor: 'pointer' }}
						>
							×
						</button>
					</div>

					{totalSessions > 1 && (
						<div className="session-navigation">
							<button
								className="nav-btn prev"
								onClick={goToPreviousSession}
								disabled={totalSessions <= 1}
							>
								‹
							</button>
							<span className="session-indicator">
								{currentSessionIndex + 1} of {totalSessions}
							</span>
							<button
								className="nav-btn next"
								onClick={goToNextSession}
								disabled={totalSessions <= 1}
							>
								›
							</button>
						</div>
					)}

					{currentSession && (
						<div className="current-session">
							<div className="session-info">
								<div className="session-name">
									{getDownloadName(currentSession)}
								</div>
								<div className="session-status">
									{getStatusText(currentSession.status)}
								</div>
							</div>

							<div className="session-progress">
								<div className="progress-bar">
									<div
										className="progress-fill"
										style={{
											width: `${currentSession.overallProgress}%`,
										}}
									/>
								</div>
								<span className="progress-text">
									{Math.round(currentSession.overallProgress)}%
								</span>
							</div>

							<div className="session-details">
								{getCompletedFilesCount(currentSession.files)} of{' '}
								{currentSession.totalFiles} files
								{currentSession.status === 'downloading' && (
									<span className="estimated-time">
										• {getEstimatedTime(currentSession)} remaining
									</span>
								)}
							</div>

							{currentSession.status === 'downloading' && (
								<button
									className="cancel-btn"
									onClick={() => handleCancelSession(currentSession.sessionId)}
								>
									Cancel Download
								</button>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default DownloadProgressPopup;
