import React, { useState, useEffect, useRef, useContext } from 'react';
import Context from '../../../../context/context';
import { uploadImage } from '../../../../helpers/uploadImage';
import ObjectID from 'bson-objectid';
import './UploadProgressPopup.scss';
import UpDownArrow from '../../../../assets/svg/my_templates/UpDownArrowSvg';

const UploadProgressPopup = () => {
	const {
		galleryInfo: {
			uploadSessions,
			showUploadProgressPopup,
			removeUploadSession,
			hideUploadProgressPopup,
			getUploadImagePolicy,
			uploadDesktopImages,
			getImageUploadStatus,
			tenantAlbums,
		},
	} = useContext(Context);

	const [isExpanded, setIsExpanded] = useState(false);
	const [activeUploads, setActiveUploads] = useState(new Map()); // For rendering only
	const [currentSessionIndex, setCurrentSessionIndex] = useState(0); // Track which session to display
	const intervalRefs = useRef(new Map()); // Map of sessionId -> interval ref
	const startedSessions = useRef(new Set()); // Track which sessions have been started
	const previousSessions = useRef(new Set()); // Track previous session IDs
	const processingFiles = useRef(new Set()); // Global across sessions, keyed by session
	const runningSessions = useRef(new Set()); // Track running sessions
	const sessionStatesRef = useRef(new Map()); // ✅ LIVE state for each session — immune to re-renders

	// Helper function to get album name from session data
	const getAlbumName = (uploadSession) => {
		// First try to get album name from session data (if it was included)
		if (uploadSession.albumName) {
			return uploadSession.albumName;
		}

		// Fallback: try to get album name from tenantAlbums using albumId
		if (uploadSession.albumId && tenantAlbums?.albums) {
			const album = tenantAlbums.albums.find((album) => album._id === uploadSession.albumId);
			if (album) {
				return album.title;
			}
		}

		// Final fallback
		return 'Unknown Album';
	};

	// Upload handlers
	const handleUploadComplete = (sessionId) => {
		removeUploadSession(sessionId);
		window.dispatchEvent(
			new CustomEvent('uploadCompleted', {
				detail: { sessionId },
			}),
		);
	};

	const handleUploadCancel = (sessionId) => {
		removeUploadSession(sessionId);
	};

	const handleCloseUploadProgressPopup = () => {
		hideUploadProgressPopup();
	};

	// Navigation helpers for sequential display
	const getCurrentSession = () => {
		const uploadStates = Array.from(activeUploads.values());
		return uploadStates[currentSessionIndex] || null;
	};

	const getTotalSessions = () => {
		return Array.from(activeUploads.values()).length;
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
	const updateUploadState = (sessionId, updates) => {
		// Update ref state — used during async upload
		const currentRefState = sessionStatesRef.current.get(sessionId);
		if (currentRefState) {
			sessionStatesRef.current.set(sessionId, { ...currentRefState, ...updates });
		}

		// Update React state — for rendering
		setActiveUploads((prev) => {
			const newMap = new Map(prev);
			const currentState = newMap.get(sessionId);
			if (currentState) {
				newMap.set(sessionId, { ...currentState, ...updates });
			}
			return newMap;
		});
	};

	// Initialize upload states for new sessions
	useEffect(() => {
		const currentSessionIds = new Set(uploadSessions.map((s) => s.id));

		const newSessions = uploadSessions.filter(
			(session) => !previousSessions.current.has(session.id),
		);

		newSessions.forEach((session) => {
			if (!activeUploads.has(session.id) && !startedSessions.current.has(session.id)) {
				const uploadState = {
					sessionId: session.id,
					files: session.files || [],
					settings: session.settings || {},
					galleryId: session.galleryId,
					albumId: session.albumId,
					uploadBatchID: session.uploadBatchID,
					tenantId: session.tenantId,
					status: 'preparing',
					overallProgress: 0,
					processedCount: 0,
					uploadedCount: 0,
					totalFiles: session.files?.length || 0,
					startTime: Date.now(),
					error: null,
				};

				// ✅ Initialize in both React state and ref state
				setActiveUploads((prev) => new Map(prev.set(session.id, uploadState)));
				sessionStatesRef.current.set(session.id, { ...uploadState });

				startedSessions.current.add(session.id);
				startUploadSession(session.id, uploadState);
			}
		});

		// Clean up removed sessions
		setActiveUploads((prev) => {
			const newMap = new Map();
			prev.forEach((state, id) => {
				if (currentSessionIds.has(id)) {
					newMap.set(id, state);
				} else {
					// ✅ Clean up ref state
					sessionStatesRef.current.delete(id);

					// Clean up other refs
					startedSessions.current.delete(id);
					runningSessions.current.delete(id);
					previousSessions.current.delete(id);

					// Clean up processing files
					processingFiles.current.forEach((fileKey) => {
						if (state.files) {
							state.files.forEach((fileData) => {
								const sessionFileKey = `${id}-${fileData.file.name}-${fileData.file.size}`;
								if (sessionFileKey === fileKey) {
									processingFiles.current.delete(fileKey);
								}
							});
						}
					});
				}
			});
			return newMap;
		});

		previousSessions.current = currentSessionIds;
	}, [uploadSessions]);

	// Handle session index when sessions change
	useEffect(() => {
		const totalSessions = getTotalSessions();

		if (totalSessions > 0 && currentSessionIndex >= totalSessions) {
			// If current index is out of bounds, reset to last session
			const newIndex = Math.max(0, totalSessions - 1);
			setCurrentSessionIndex(newIndex);
		}
	}, [activeUploads, currentSessionIndex]);

	// Process single image
	const processSingleImage = async (originalFile, settings) => {
		try {
			const imageBuffer = await originalFile.arrayBuffer();
			const uint8Array = new Uint8Array(imageBuffer);

			const { metadata, width, height, format, originalDateTime } =
				await window.electronApi.extractImageMetadata({
					imageBuffer: imageBuffer,
				});

			if (!width || !height) {
				throw new Error('Unable to extract image dimensions');
			}

			let processedFile = originalFile;
			let thumbnailFile = null;
			let thumbnail100hFile = null;

			const watermarkUrl = settings.watermarkUrl;

			// Process optimized version
			const resultOptimized = await window.electronApi.processImageWithSharp({
				imageBuffer: imageBuffer,
				watermarkUrl: settings.isWaterMarkApply ? watermarkUrl : null,
				watermarkPosition: settings.watermarkPosition,
				scale: settings.scaleWatermark || 0.15,
				opacity: settings.watermarkOpacity || 1,
				isWaterMarkApply: settings.isWaterMarkApply || false,
				resizeOptions: { width: 1200 },
				quality: 85,
				forceJpeg: true,
			});

			if (!resultOptimized.success) throw new Error(resultOptimized.error);

			const processedBuffer = Uint8Array.from(atob(resultOptimized.processedImage), (c) =>
				c.charCodeAt(0),
			);
			processedFile = new File([processedBuffer], originalFile.name, { type: 'image/jpeg' });

			// Process thumbnail 300w
			const resultThumbnail = await window.electronApi.processImageWithSharp({
				imageBuffer: imageBuffer,
				watermarkUrl: null,
				resizeOptions: { width: 300 },
				quality: 70,
				forceJpeg: true,
				isWaterMarkApply: false,
			});

			if (!resultThumbnail.success) throw new Error(resultThumbnail.error);

			const thumbnailBuffer = Uint8Array.from(atob(resultThumbnail.processedImage), (c) =>
				c.charCodeAt(0),
			);
			thumbnailFile = new File(
				[thumbnailBuffer],
				`thumb_${originalFile.name.split('.')[0]}.jpg`,
				{ type: 'image/jpeg' },
			);

			// Process thumbnail 100h
			const resultThumbnail100h = await window.electronApi.processImageWithSharp({
				imageBuffer: imageBuffer,
				watermarkUrl: null,
				resizeOptions: { height: 100, fit: 'cover', position: 'center' },
				quality: 70,
				forceJpeg: true,
				isWaterMarkApply: false,
			});

			if (!resultThumbnail100h.success) throw new Error(resultThumbnail100h.error);

			const thumbnail100hBuffer = Uint8Array.from(
				atob(resultThumbnail100h.processedImage),
				(c) => c.charCodeAt(0),
			);
			thumbnail100hFile = new File(
				[thumbnail100hBuffer],
				`thumb100_${originalFile.name.split('.')[0]}.jpg`,
				{ type: 'image/jpeg' },
			);

			return {
				success: true,
				processedFile,
				thumbnailFile,
				thumbnail100hFile,
				width,
				height,
				format,
				originalDateTime,
			};
		} catch (error) {
			console.error('Failed to process:', originalFile.name, error);
			return { success: false, error };
		}
	};

	// Generate upload payload
	const generateUploadPayload = (
		image,
		processedFile,
		imageId,
		policyData,
		uploadResultOriginal,
		uploadResultOptimized,
		uploadResultThumbnail300w,
		uploadResultThumbnail100h,
		extractedMetadata,
		versionId,
		uploadBatchID,
		settings,
	) => {
		const givenFileName = uploadResultOriginal.fileKey.split('/').pop();
		const updatedVersionId = versionId.toString();

		const {
			width: originalWidth,
			height: originalHeight,
			format: originalFormat,
			originalDateTime,
		} = extractedMetadata;

		return {
			tag_ids: settings.selectedGalleryTags?.map((tag) => tag._id || '') || [],
			image_id: imageId.toHexString(),
			activeVersion: {
				versionId: updatedVersionId,
				uploadBatchId: uploadBatchID,
				isAIFacesEnabled: settings.isAiEnabled || false,
				originalFileName: image.file.name,
				givenFileName,
				s3_original: {
					key: uploadResultOriginal.fileKey,
					size: image.file.size,
				},
				s3_optimized: {
					key: uploadResultOptimized.fileKey,
					size: processedFile.size,
				},
				s3_thumbnail_300w: {
					key: uploadResultThumbnail300w.fileKey,
				},
				s3_thumbnail_100h: {
					key: uploadResultThumbnail100h.fileKey,
				},
				watermark: {
					applied: settings.isWaterMarkApply || false,
					profile: settings.watermarkProfileId ?? null,
					position: settings.watermarkPosition?.name || 'southeast',
				},
				originalWidth,
				originalHeight,
				originalFormat,
				originalDateTime,
			},
		};
	};

	// Start upload process for a specific session
	const startUploadSession = async (sessionId, initialState) => {
		try {
			if (runningSessions.current.has(sessionId)) {
				console.warn(`Session ${sessionId} is already running, skipping...`);
				return;
			}

			// ✅ Additional safety check: ensure session exists in ref state
			if (!sessionStatesRef.current.has(sessionId)) {
				console.warn(`Session ${sessionId} not found in ref state, cannot start upload`);
				return;
			}

			runningSessions.current.add(sessionId);
			updateUploadState(sessionId, { status: 'uploading' });

			const policyResponse = await getUploadImagePolicy(initialState.galleryId);
			const policyData = policyResponse?.[1];

			if (!policyData) {
				throw new Error('Failed to get upload policies');
			}

			// Deduplicate files within this session
			const uniqueFiles = initialState.files.filter((fileData, index, self) => {
				const fileKey = `${fileData.file.name}-${fileData.file.size}`;
				return self.findIndex((f) => `${f.file.name}-${f.file.size}` === fileKey) === index;
			});

			if (intervalRefs.current.has(sessionId)) {
				console.warn(`Interval already exists for session ${sessionId}, skipping...`);
				runningSessions.current.delete(sessionId);
				return;
			}

			// Start progress monitoring - FIXED: Use session-specific parameters
			const progressIntervalId = setInterval(async () => {
				try {
					// ✅ CRITICAL FIX: Use session-specific parameters to prevent cross-session interference
					const currentState = sessionStatesRef.current.get(sessionId);
					if (!currentState) {
						console.warn(
							`Session ${sessionId} not found in ref state, stopping progress monitoring`,
						);
						clearInterval(progressIntervalId);
						intervalRefs.current.delete(sessionId);
						return;
					}

					// ✅ Stop monitoring if session is completed or failed
					if (
						currentState.status === 'completed' ||
						currentState.status === 'failed' ||
						currentState.status === 'cancelled'
					) {
						clearInterval(progressIntervalId);
						intervalRefs.current.delete(sessionId);
						return;
					}

					const response = await getImageUploadStatus(
						currentState.galleryId,
						currentState.albumId,
						currentState.uploadBatchID,
					);
					if (response[0]) {
						const { uploadedCount } = response[1];

						// ✅ Use current session state, not initial state
						const updatedFiles = currentState.files.map((file, index) => {
							if (index < uploadedCount) {
								return { ...file, status: 'completed', progress: 100 };
							} else if (
								index === uploadedCount &&
								uploadedCount < currentState.files.length
							) {
								return { ...file, status: 'uploading', progress: 50 };
							}
							return file;
						});

						updateUploadState(sessionId, {
							uploadedCount,
							files: updatedFiles,
							overallProgress: Math.min(
								(uploadedCount / currentState.files.length) * 100,
								100,
							),
						});
					}
				} catch (error) {
					console.error(`Progress monitoring error for session ${sessionId}:`, error);
				}
			}, 3000);

			intervalRefs.current.set(sessionId, progressIntervalId);

			// Process and upload files concurrently
			const uploadPromises = uniqueFiles.map(async (fileData, index) => {
				try {
					const fileKey = `${sessionId}-${fileData.file.name}-${fileData.file.size}`;
					if (processingFiles.current.has(fileKey)) {
						console.warn(
							`File ${fileData.file.name} already processing in session ${sessionId}`,
						);
						return;
					}

					processingFiles.current.add(fileKey);

					// ✅ Use ref state for current state
					const currentState = sessionStatesRef.current.get(sessionId);
					updateUploadState(sessionId, {
						files: (currentState?.files || uniqueFiles).map((f, i) =>
							i === index ? { ...f, status: 'processing' } : f,
						),
					});

					const processResult = await processSingleImage(
						fileData.file,
						initialState.settings,
					);
					if (!processResult.success) {
						throw new Error(processResult.error);
					}

					// ✅ Use ref state for current count
					const currentRefState = sessionStatesRef.current.get(sessionId);
					updateUploadState(sessionId, {
						processedCount: (currentRefState?.processedCount || 0) + 1,
						files: (currentRefState?.files || uniqueFiles).map((f, i) =>
							i === index
								? {
										...f,
										status: 'uploading',
										processedFile: processResult.processedFile,
								  }
								: f,
						),
					});

					const imageId = ObjectID();
					const versionId = Date.now();

					// Create thumbnail policies
					const optimizedPolicy = policyData.optimized;
					const thumbnail300wPolicy = {
						...optimizedPolicy,
						keyPrefix: optimizedPolicy.keyPrefix.replace(
							/optimized\/?$/,
							'thumbnails-300w/',
						),
					};
					const thumbnail100hPolicy = {
						...optimizedPolicy,
						keyPrefix: optimizedPolicy.keyPrefix.replace(
							/optimized\/?$/,
							'thumbnails-100h/',
						),
					};

					const fakePolicyData = {
						...policyData,
						thumbnails_300w: thumbnail300wPolicy,
						thumbnails_100h: thumbnail100hPolicy,
					};

					// Upload all versions
					const [
						uploadResultOriginal,
						uploadResultOptimized,
						uploadResultThumbnail300w,
						uploadResultThumbnail100h,
					] = await Promise.all([
						uploadImage(
							fileData.file,
							'originals',
							null,
							policyData,
							imageId,
							(percent) => {
								const currentState = sessionStatesRef.current.get(sessionId);
								updateUploadState(sessionId, {
									files: (currentState?.files || uniqueFiles).map((f, i) =>
										i === index ? { ...f, progress: percent } : f,
									),
								});
							},
							initialState.galleryId,
							versionId,
							initialState.tenantId,
							initialState.uploadBatchID,
						),
						uploadImage(
							processResult.processedFile,
							'optimized',
							null,
							policyData,
							imageId,
							null,
							initialState.galleryId,
							versionId,
							initialState.tenantId,
							initialState.uploadBatchID,
						),
						uploadImage(
							processResult.thumbnailFile,
							'thumbnails_300w',
							null,
							fakePolicyData,
							imageId,
							null,
							initialState.galleryId,
							versionId,
							initialState.tenantId,
							initialState.uploadBatchID,
						),
						uploadImage(
							processResult.thumbnail100hFile,
							'thumbnails_100h',
							null,
							fakePolicyData,
							imageId,
							null,
							initialState.galleryId,
							versionId,
							initialState.tenantId,
							initialState.uploadBatchID,
						),
					]);

					if (
						!uploadResultOriginal.success ||
						!uploadResultOptimized.success ||
						!uploadResultThumbnail300w.success ||
						!uploadResultThumbnail100h.success
					) {
						throw new Error('One or more uploads failed');
					}

					const payload = generateUploadPayload(
						fileData,
						processResult.processedFile,
						imageId,
						policyData,
						uploadResultOriginal,
						uploadResultOptimized,
						uploadResultThumbnail300w,
						uploadResultThumbnail100h,
						{
							width: processResult.width,
							height: processResult.height,
							format: processResult.format,
							originalDateTime: processResult.originalDateTime,
						},
						versionId,
						initialState.uploadBatchID,
						initialState.settings,
					);

					const [success] = await uploadDesktopImages(
						initialState.galleryId,
						initialState.albumId,
						payload,
					);

					if (!success) {
						throw new Error('Failed to register image with backend');
					}

					// ✅ Use ref state
					const completedState = sessionStatesRef.current.get(sessionId);
					updateUploadState(sessionId, {
						files: (completedState?.files || uniqueFiles).map((f, i) =>
							i === index ? { ...f, status: 'completed', progress: 100 } : f,
						),
					});

					processingFiles.current.delete(fileKey);
				} catch (error) {
					console.error('Upload failed for file:', fileData.file.name, error);
					const failedState = sessionStatesRef.current.get(sessionId);
					updateUploadState(sessionId, {
						files: (failedState?.files || uniqueFiles).map((f, i) =>
							i === index ? { ...f, status: 'failed', error: error.message } : f,
						),
					});
					const fileKey = `${sessionId}-${fileData.file.name}-${fileData.file.size}`;
					processingFiles.current.delete(fileKey);
				}
			});

			await Promise.all(uploadPromises);

			// Clear interval when upload is complete
			const sessionIntervalId = intervalRefs.current.get(sessionId);
			if (sessionIntervalId) {
				clearInterval(sessionIntervalId);
				intervalRefs.current.delete(sessionId);
			}

			updateUploadState(sessionId, {
				status: 'completed',
				overallProgress: 100,
			});

			// Clean up processing files
			uniqueFiles.forEach((fileData) => {
				const fileKey = `${sessionId}-${fileData.file.name}-${fileData.file.size}`;
				processingFiles.current.delete(fileKey);
			});

			startedSessions.current.delete(sessionId);
			runningSessions.current.delete(sessionId);

			handleUploadComplete(sessionId);
		} catch (error) {
			console.error('Upload session failed:', error);
			updateUploadState(sessionId, {
				status: 'failed',
				error: error.message,
			});

			if (uniqueFiles) {
				uniqueFiles.forEach((fileData) => {
					const fileKey = `${sessionId}-${fileData.file.name}-${fileData.file.size}`;
					processingFiles.current.delete(fileKey);
				});
			}

			const errorIntervalId = intervalRefs.current.get(sessionId);
			if (errorIntervalId) {
				clearInterval(errorIntervalId);
				intervalRefs.current.delete(sessionId);
			}

			startedSessions.current.delete(sessionId);
			runningSessions.current.delete(sessionId);
		}
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			intervalRefs.current.forEach((intervalId) => {
				clearInterval(intervalId);
			});
			intervalRefs.current.clear();
			processingFiles.current.clear();
			startedSessions.current.clear();
			runningSessions.current.clear();
			previousSessions.current.clear();
			sessionStatesRef.current.clear(); // ✅ Clear ref state too
		};
	}, []);

	const handleClose = () => {
		const hasActiveUploads = Array.from(activeUploads.values()).some(
			(state) => state.status === 'uploading',
		);

		if (hasActiveUploads) {
			if (
				window.confirm(
					'Uploads are in progress. Are you sure you want to hide the progress? Uploads will continue in the background.',
				)
			) {
				handleCloseUploadProgressPopup();
			}
		} else {
			handleCloseUploadProgressPopup();
		}
	};

	const handleCancelSession = (sessionId) => {
		const cancelIntervalId = intervalRefs.current.get(sessionId);
		if (cancelIntervalId) {
			clearInterval(cancelIntervalId);
			intervalRefs.current.delete(sessionId);
		}

		const uploadState = sessionStatesRef.current.get(sessionId);
		if (uploadState?.files) {
			uploadState.files.forEach((fileData) => {
				const fileKey = `${sessionId}-${fileData.file.name}-${fileData.file.size}`;
				processingFiles.current.delete(fileKey);
			});
		}

		updateUploadState(sessionId, { status: 'cancelled' });
		startedSessions.current.delete(sessionId);
		runningSessions.current.delete(sessionId);

		handleUploadCancel(sessionId);
	};

	const getStatusText = (status) => {
		switch (status) {
			case 'preparing':
				return 'Preparing upload...';
			case 'uploading':
				return 'Uploading...';
			case 'completed':
				return 'Upload completed!';
			case 'failed':
				return 'Upload failed';
			case 'cancelled':
				return 'Upload cancelled';
			default:
				return 'Processing...';
		}
	};

	const getCompletedFilesCount = (files) => {
		return files?.filter((f) => f.status === 'completed').length || 0;
	};

	const formatTime = (ms) => {
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		if (minutes > 0) {
			return `${minutes}m ${seconds % 60}s`;
		}
		return `${seconds}s`;
	};

	const getEstimatedTime = (uploadState) => {
		if (uploadState.overallProgress === 0 || uploadState.status !== 'uploading') {
			return 'Calculating...';
		}
		const elapsed = Date.now() - uploadState.startTime;
		const rate = uploadState.overallProgress / elapsed;
		const remaining = (100 - uploadState.overallProgress) / rate;
		return formatTime(remaining);
	};

	const getTotalProgress = () => {
		const states = Array.from(activeUploads.values());
		if (states.length === 0) return 0;
		const totalProgress = states.reduce((sum, state) => sum + state.overallProgress, 0);
		return Math.round(totalProgress / states.length);
	};

	const getOverallStatus = () => {
		const states = Array.from(activeUploads.values());
		if (states.length === 0) return 'No uploads';
		const hasUploading = states.some((s) => s.status === 'uploading');
		const hasCompleted = states.some((s) => s.status === 'completed');
		const hasFailed = states.some((s) => s.status === 'failed');
		if (hasUploading) return `Uploading ${states.length} batch${states.length > 1 ? 'es' : ''}`;
		if (hasCompleted && !hasUploading && !hasFailed) return 'All uploads completed';
		if (hasFailed) return 'Some uploads failed';
		return 'Processing...';
	};

	// Ensure popup shows if there are active uploads, even if state is inconsistent
	const hasActiveUploads = activeUploads.size > 0;
	const shouldShowPopup = showUploadProgressPopup || hasActiveUploads;

	if (!shouldShowPopup || !uploadSessions || uploadSessions.length === 0) {
		return null;
	}

	const uploadStates = Array.from(activeUploads.values());
	const currentSession = getCurrentSession();
	const totalSessions = getTotalSessions();

	return (
		<div className="upload-progress-popup">
			{isExpanded ? (
				<div className="upload-popup-expanded">
					<div className="upload-header">
						<div className="header-left">
							<span style={{ color: 'var(--primary-font)' }}>
								{currentSession ? getAlbumName(currentSession) : 'Album Upload'}{' '}
								{totalSessions > 1
									? `(${currentSessionIndex + 1} of ${totalSessions})`
									: ''}
							</span>
							{totalSessions > 1 && (
								<div className="session-navigation">
									<button
										className="nav-btn prev"
										onClick={goToPreviousSession}
										disabled={totalSessions <= 1}
										title="Previous Album"
									>
										‹
									</button>
									<span className="session-indicator">
										{currentSessionIndex + 1} / {totalSessions}
									</span>
									<button
										className="nav-btn next"
										onClick={goToNextSession}
										disabled={totalSessions <= 1}
										title="Next Album"
									>
										›
									</button>
								</div>
							)}
						</div>
						<div className="header-controls">
							<span
								className="control-btn expand"
								onClick={() => setIsExpanded(false)}
								style={{ cursor: 'pointer' }}
							>
								<UpDownArrow />
							</span>
						</div>
					</div>

					{currentSession ? (
						<div className="upload-session">
							<div className="session-header">
								<div className="session-info">
									<div
										className="session-title"
										style={{ color: 'var(--primary-font)' }}
									>
										{getStatusText(currentSession.status)}
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
								</div>
								<div className="session-controls">
									{currentSession.status === 'uploading' && (
										<span
											className="cancel"
											onClick={() =>
												handleCancelSession(currentSession.sessionId)
											}
											style={{ cursor: 'pointer' }}
										>
											Cancel
										</span>
									)}
								</div>
							</div>

							<div className="files-list">
								{currentSession.files?.map((fileData, index) => (
									<div
										key={index}
										className={`file-item ${fileData.status || 'pending'}`}
									>
										<div className="file-info">
											<div className="file-name">{fileData.file.name}</div>
											<div className="file-status">
												{fileData.status === 'processing' &&
													'Processing...'}
												{fileData.status === 'uploading' &&
													`Uploading... ${Math.round(
														fileData.progress || 0,
													)}%`}
												{fileData.status === 'completed' && 'Completed'}
												{fileData.status === 'failed' &&
													`Failed: ${fileData.error}`}
												{(!fileData.status ||
													fileData.status === 'pending') &&
													'Pending...'}
											</div>
										</div>
										{fileData.status === 'uploading' && (
											<div className="file-progress">
												<div className="progress-bar small">
													<div
														className="progress-fill"
														style={{
															width: `${fileData.progress || 0}%`,
														}}
													/>
												</div>
											</div>
										)}
									</div>
								))}
							</div>

							{currentSession.status === 'uploading' && (
								<div className="session-eta">
									Estimated time remaining: {getEstimatedTime(currentSession)}
								</div>
							)}

							{currentSession.status === 'failed' && currentSession.error && (
								<div className="session-error">Error: {currentSession.error}</div>
							)}
						</div>
					) : (
						<div className="no-session">
							<p>No active upload session</p>
						</div>
					)}
				</div>
			) : (
				<div className="upload-popup-minimized">
					<div className="upload-info">
						<div className="upload-title">
							{currentSession
								? `${getAlbumName(currentSession)} - ${getStatusText(
										currentSession.status,
								  )}`
								: 'No uploads'}
						</div>
						<div className="upload-progress">
							<div className="progress-bar">
								<div
									className="progress-fill"
									style={{
										width: `${
											currentSession ? currentSession.overallProgress : 0
										}%`,
									}}
								/>
							</div>
							<span className="progress-text">
								{currentSession ? Math.round(currentSession.overallProgress) : 0}%
							</span>
						</div>
						<div className="upload-details">
							{currentSession ? getCompletedFilesCount(currentSession.files) : 0} of{' '}
							{currentSession ? currentSession.totalFiles : 0} files
							{totalSessions > 1 &&
								` • ${currentSessionIndex + 1} of ${totalSessions} albums`}
						</div>
					</div>
					<div className="upload-controls">
						<button
							className="control-btn expand"
							onClick={() => setIsExpanded(true)}
							style={{ cursor: 'pointer' }}
						>
							<UpDownArrow />
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default UploadProgressPopup;
