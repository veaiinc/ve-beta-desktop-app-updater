import React, { useState, useEffect, useRef, useContext } from 'react';
// import { ReactComponent as CloseIcon } from '../../assets/svg/gallery/close.svg';
// import { ReactComponent as MinimizeIcon } from '../../assets/svg/gallery/minimize.svg';
// import { ReactComponent as ExpandIcon } from '../../assets/svg/gallery/expand.svg';
// import { ReactComponent as CancelIcon } from '../../assets/svg/gallery/cancel.svg';
import Context from '../../../../context/context';
import { uploadImage } from '../../../../helpers/uploadImage';
import ObjectID from 'bson-objectid';
import './UploadProgressPopup.scss';

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
		},
	} = useContext(Context);

	const [isExpanded, setIsExpanded] = useState(false);
	const [activeUploads, setActiveUploads] = useState(new Map()); // Map of sessionId -> upload state
	const intervalRefs = useRef(new Map()); // Map of sessionId -> interval ref
	const startedSessions = useRef(new Set()); // Track which sessions have been started
	const previousSessions = useRef(new Set()); // Track previous session IDs

	// Upload handlers
	const handleUploadComplete = (sessionId) => {
		// Remove completed session from global context
		removeUploadSession(sessionId);

		// Dispatch custom event to notify other components that uploads completed
		window.dispatchEvent(
			new CustomEvent('uploadCompleted', {
				detail: { sessionId },
			}),
		);
	};

	const handleUploadCancel = (sessionId) => {
		// Remove cancelled session from global context
		removeUploadSession(sessionId);
	};

	const handleCloseUploadProgressPopup = () => {
		// Hide the upload progress popup (but keep sessions for background processing)
		hideUploadProgressPopup();
	};

	// Initialize upload states for new sessions
	useEffect(() => {
		// Get current session IDs
		const currentSessionIds = new Set(uploadSessions.map((s) => s.id));

		// Only process sessions that are truly new (not in previous sessions)
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

				setActiveUploads((prev) => new Map(prev.set(session.id, uploadState)));
				startedSessions.current.add(session.id);

				// Start upload for this session
				startUploadSession(session.id, uploadState);
			}
		});

		// Clean up removed sessions
		const sessionIds = new Set(uploadSessions.map((s) => s.id));
		setActiveUploads((prev) => {
			const newMap = new Map();
			prev.forEach((state, id) => {
				if (sessionIds.has(id)) {
					newMap.set(id, state);
				} else {
					// Clean up removed session
					startedSessions.current.delete(id);
					previousSessions.current.delete(id);
					processingFiles.current.forEach((fileKey) => {
						// Remove files from this session from processing set
						if (state.files) {
							state.files.forEach((fileData) => {
								const sessionFileKey = `${fileData.file.name}-${fileData.file.size}`;
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

		// Update previous sessions to current sessions
		previousSessions.current = currentSessionIds;
	}, [uploadSessions]);

	// Process single image with Sharp (same logic as before)
	const processSingleImage = async (originalFile, settings) => {
		try {
			const imageBuffer = await originalFile.arrayBuffer();
			const uint8Array = new Uint8Array(imageBuffer);

			const { metadata, width, height, format, originalDateTime } =
				await window.electronApi.extractImageMetadata({
					imageBuffer: imageBuffer, // Send ArrayBuffer directly
				});

			if (!width || !height) {
				throw new Error('Unable to extract image dimensions');
			}

			let processedFile = originalFile;
			let thumbnailFile = null;
			let thumbnail100hFile = null;

			const watermarkUrl = settings.watermarkUrl;

			// Process optimized version (with watermark if enabled)
			const resultOptimized = await window.electronApi.processImageWithSharp({
				imageBuffer: imageBuffer, // Send ArrayBuffer directly
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

			// Process thumbnail 300w (no watermark)
			const resultThumbnail = await window.electronApi.processImageWithSharp({
				imageBuffer: imageBuffer, // Send ArrayBuffer directly
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

			// Process thumbnail 100h (no watermark, cropped)
			const resultThumbnail100h = await window.electronApi.processImageWithSharp({
				imageBuffer: imageBuffer, // Send ArrayBuffer directly
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

	// Generate upload payload (same logic as before)
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

	// Update upload state for a specific session
	const updateUploadState = (sessionId, updates) => {
		setActiveUploads((prev) => {
			const newMap = new Map(prev);
			const currentState = newMap.get(sessionId);
			if (currentState) {
				newMap.set(sessionId, { ...currentState, ...updates });
			}
			return newMap;
		});
	};

	// Track files being processed to prevent duplicates - use useRef to persist across renders
	const processingFiles = useRef(new Set());

	// Start upload process for a specific session
	const startUploadSession = async (sessionId, initialState) => {
		try {
			updateUploadState(sessionId, { status: 'uploading' });

			// Get upload policies
			const policyResponse = await getUploadImagePolicy(initialState.galleryId);
			const policyData = policyResponse?.[1];

			if (!policyData) {
				throw new Error('Failed to get upload policies');
			}

			// Deduplicate files to prevent multiple uploads of the same file
			const uniqueFiles = initialState.files.filter((fileData, index, self) => {
				// Use file name and size as unique identifier
				const fileKey = `${fileData.file.name}-${fileData.file.size}`;
				return self.findIndex((f) => `${f.file.name}-${f.file.size}` === fileKey) === index;
			});

			// Check if interval already exists for this session
			if (intervalRefs.current.has(sessionId)) {
				console.warn(`Interval already exists for session ${sessionId}, skipping...`);
				return;
			}

			// Start progress monitoring for this session
			const progressIntervalId = setInterval(async () => {
				try {
					const response = await getImageUploadStatus(
						initialState.galleryId,
						initialState.albumId,
						initialState.uploadBatchID,
					);
					if (response[0]) {
						const { uploadedCount } = response[1];
						console.log(
							`📊 Progress update for session ${sessionId}: ${uploadedCount}/${uniqueFiles.length} files uploaded`,
						);

						// Update file statuses based on backend progress
						const currentState = activeUploads.get(sessionId);
						if (currentState) {
							const updatedFiles = currentState.files.map((file, index) => {
								if (index < uploadedCount) {
									return { ...file, status: 'completed', progress: 100 };
								} else if (
									index === uploadedCount &&
									uploadedCount < uniqueFiles.length
								) {
									return { ...file, status: 'uploading', progress: 50 };
								}
								return file;
							});

							updateUploadState(sessionId, {
								uploadedCount,
								files: updatedFiles,
								overallProgress: Math.min(
									(uploadedCount / uniqueFiles.length) * 100,
									100,
								),
							});
						}
					}
				} catch (error) {
					console.error('Progress monitoring error:', error);
				}
			}, 3000);

			intervalRefs.current.set(sessionId, progressIntervalId);

			// Process and upload files concurrently
			const uploadPromises = uniqueFiles.map(async (fileData, index) => {
				try {
					// Check if file is already being processed
					const fileKey = `${fileData.file.name}-${fileData.file.size}`;
					if (processingFiles.current.has(fileKey)) {
						console.warn(
							`File ${fileData.file.name} is already being processed, skipping...`,
						);
						return;
					}

					// Mark file as being processed
					processingFiles.current.add(fileKey);

					// Update file status to processing
					updateUploadState(sessionId, {
						files: uniqueFiles.map((f, i) =>
							i === index ? { ...f, status: 'processing' } : f,
						),
					});

					// Process image
					const processResult = await processSingleImage(
						fileData.file,
						initialState.settings,
					);
					if (!processResult.success) {
						throw new Error(processResult.error);
					}

					// Update processed count
					const currentUploadState = activeUploads.get(sessionId);
					updateUploadState(sessionId, {
						processedCount: (currentUploadState?.processedCount || 0) + 1,
						files: (currentUploadState?.files || uniqueFiles).map((f, i) =>
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
								const currentProgressState = activeUploads.get(sessionId);
								updateUploadState(sessionId, {
									files: (currentProgressState?.files || uniqueFiles).map(
										(f, i) => (i === index ? { ...f, progress: percent } : f),
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

					// Check if all uploads succeeded
					if (
						!uploadResultOriginal.success ||
						!uploadResultOptimized.success ||
						!uploadResultThumbnail300w.success ||
						!uploadResultThumbnail100h.success
					) {
						throw new Error('One or more uploads failed');
					}

					// Generate upload payload
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

					// Register image with backend
					const [success] = await uploadDesktopImages(
						initialState.galleryId,
						initialState.albumId,
						payload,
					);

					if (!success) {
						throw new Error('Failed to register image with backend');
					}

					// Update file status to completed
					const currentCompletedState = activeUploads.get(sessionId);
					updateUploadState(sessionId, {
						files: (currentCompletedState?.files || uniqueFiles).map((f, i) =>
							i === index ? { ...f, status: 'completed', progress: 100 } : f,
						),
					});

					// Remove file from processing set
					processingFiles.current.delete(fileKey);
				} catch (error) {
					console.error('Upload failed for file:', fileData.file.name, error);
					const currentFailedState = activeUploads.get(sessionId);
					updateUploadState(sessionId, {
						files: (currentFailedState?.files || uniqueFiles).map((f, i) =>
							i === index ? { ...f, status: 'failed', error: error.message } : f,
						),
					});

					// Remove file from processing set even on failure
					processingFiles.current.delete(fileKey);
				}
			});

			// Wait for all uploads to complete
			await Promise.all(uploadPromises);

			// Clear interval
			const sessionIntervalId = intervalRefs.current.get(sessionId);
			if (sessionIntervalId) {
				clearInterval(sessionIntervalId);
				intervalRefs.current.delete(sessionId);
			}

			// Mark as completed
			updateUploadState(sessionId, {
				status: 'completed',
				overallProgress: 100,
			});

			// Clear processing files for this session
			uniqueFiles.forEach((fileData) => {
				const fileKey = `${fileData.file.name}-${fileData.file.size}`;
				processingFiles.current.delete(fileKey);
			});

			// Clean up started session tracking
			startedSessions.current.delete(sessionId);

			// Call completion callback
			handleUploadComplete(sessionId);
		} catch (error) {
			console.error('Upload session failed:', error);
			updateUploadState(sessionId, {
				status: 'failed',
				error: error.message,
			});

			// Clear processing files for this session
			if (uniqueFiles) {
				uniqueFiles.forEach((fileData) => {
					const fileKey = `${fileData.file.name}-${fileData.file.size}`;
					processingFiles.current.delete(fileKey);
				});
			}

			const errorIntervalId = intervalRefs.current.get(sessionId);
			if (errorIntervalId) {
				clearInterval(errorIntervalId);
				intervalRefs.current.delete(sessionId);
			}

			// Clean up started session tracking
			startedSessions.current.delete(sessionId);
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
			previousSessions.current.clear();
		};
	}, []);

	const handleClose = () => {
		const hasActiveUploads = Array.from(activeUploads.values()).some(
			(state) => state.status === 'uploading',
		);

		if (hasActiveUploads) {
			// Ask for confirmation before closing during upload
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

		// Clear processing files for this session
		const uploadState = activeUploads.get(sessionId);
		if (uploadState?.files) {
			uploadState.files.forEach((fileData) => {
				const fileKey = `${fileData.file.name}-${fileData.file.size}`;
				processingFiles.current.delete(fileKey);
			});
		}

		updateUploadState(sessionId, { status: 'cancelled' });
		startedSessions.current.delete(sessionId);

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

	if (!showUploadProgressPopup || !uploadSessions || uploadSessions.length === 0) return null;

	const uploadStates = Array.from(activeUploads.values());

	return (
		<div className="upload-progress-popup">
			{isExpanded ? (
				// Expanded view - show all sessions
				<div className="upload-popup-expanded">
					<div className="upload-header">
						<h3>
							Upload Progress ({uploadStates.length} session
							{uploadStates.length > 1 ? 's' : ''})
						</h3>
						<div className="header-controls">
							{/* <button
								className="control-btn"
								onClick={() => setIsExpanded(false)}
								title="Minimize"
							>
								<MinimizeIcon />
							</button>
							<button className="control-btn" onClick={handleClose} title="Close">
								<CloseIcon />
							</button> */}
						</div>
					</div>

					<div className="upload-sessions">
						{uploadStates.map((uploadState) => (
							<div key={uploadState.sessionId} className="upload-session">
								<div className="session-header">
									<div className="session-info">
										<div className="session-title">
											Gallery Upload • {getStatusText(uploadState.status)}
										</div>
										<div className="session-progress">
											<div className="progress-bar">
												<div
													className="progress-fill"
													style={{
														width: `${uploadState.overallProgress}%`,
													}}
												/>
											</div>
											<span className="progress-text">
												{Math.round(uploadState.overallProgress)}%
											</span>
										</div>
									</div>
									<div className="session-controls">
										{uploadState.status === 'uploading' && (
											<button
												className="control-btn cancel"
												onClick={() =>
													handleCancelSession(uploadState.sessionId)
												}
												title="Cancel"
											>
												<CancelIcon />
											</button>
										)}
									</div>
								</div>

								<div className="files-list">
									{uploadState.files?.map((fileData, index) => (
										<div
											key={index}
											className={`file-item ${fileData.status || 'pending'}`}
										>
											<div className="file-info">
												<div className="file-name">
													{fileData.file.name}
												</div>
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

								{uploadState.status === 'uploading' && (
									<div className="session-eta">
										Estimated time remaining: {getEstimatedTime(uploadState)}
									</div>
								)}

								{uploadState.status === 'failed' && uploadState.error && (
									<div className="session-error">Error: {uploadState.error}</div>
								)}
							</div>
						))}
					</div>
				</div>
			) : (
				// Minimized view - show overall progress
				<div className="upload-popup-minimized">
					<div className="upload-info">
						<div className="upload-title">{getOverallStatus()}</div>
						<div className="upload-progress">
							<div className="progress-bar">
								<div
									className="progress-fill"
									style={{ width: `${getTotalProgress()}%` }}
								/>
							</div>
							<span className="progress-text">{getTotalProgress()}%</span>
						</div>
						<div className="upload-details">
							{uploadStates.reduce(
								(sum, state) => sum + getCompletedFilesCount(state.files),
								0,
							)}{' '}
							of {uploadStates.reduce((sum, state) => sum + state.totalFiles, 0)}{' '}
							files
						</div>
					</div>
					<div className="upload-controls">
						{/* <button
							className="control-btn"
							onClick={() => setIsExpanded(true)}
							title="Expand"
						>
							<ExpandIcon />
						</button>
						<button className="control-btn" onClick={handleClose} title="Close">
							<CloseIcon />
						</button> */}
					</div>
				</div>
			)}
		</div>
	);
};

export default UploadProgressPopup;
