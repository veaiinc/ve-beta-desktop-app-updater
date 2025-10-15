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
			getAlbums,
			getAlbumImagesCount,
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
		// Add a delay before removing the session to ensure all processing is complete
		setTimeout(() => {
			// Double-check that the session is actually completed before removing
			const currentState = sessionStatesRef.current.get(sessionId);
			if (currentState && currentState.status === 'completed') {
				// Check if this is the only session or if all sessions are completed
				const allSessions = Array.from(sessionStatesRef.current.values());
				const activeSessions = allSessions.filter(
					(session) => session.status === 'uploading' || session.status === 'preparing',
				);

				// If this is the only session or all sessions are completed, refresh album images count
				if (allSessions.length === 1 || activeSessions.length === 0) {
					if (currentState.galleryId) {
						getAlbumImagesCount(currentState.galleryId);
					}
				}

				// Use the cleanup function to handle session removal logic
				cleanupCompletedSessions();
			}
		}, 2000); // 2 second delay to ensure all processing is complete
	};

	const handleUploadCancel = (sessionId) => {
		removeUploadSession(sessionId);
	};

	// Helper function to clean up all completed sessions when no active sessions remain
	const cleanupCompletedSessions = () => {
		const allSessions = Array.from(sessionStatesRef.current.values());
		const activeSessions = allSessions.filter(
			(session) => session.status === 'uploading' || session.status === 'preparing',
		);

		// If no active sessions, remove all completed sessions
		if (activeSessions.length === 0) {
			const completedSessions = allSessions.filter(
				(session) => session.status === 'completed',
			);

			// Get unique gallery IDs from completed sessions to refresh albums
			const galleryIds = [...new Set(completedSessions.map((session) => session.galleryId))];

			completedSessions.forEach((session) => {
				removeUploadSession(session.sessionId);
				window.dispatchEvent(
					new CustomEvent('uploadCompleted', {
						detail: { sessionId: session.sessionId },
					}),
				);
			});

			// Refresh albums for all affected galleries
			galleryIds.forEach((galleryId) => {
				if (galleryId) {
					getAlbumImagesCount(galleryId);
				}
			});
		}
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

	// ✅ Helper to calculate and update overall progress
	const updateOverallProgress = (sessionId) => {
		const currentState = sessionStatesRef.current.get(sessionId);
		if (!currentState || !currentState.files) return;

		const totalFiles = currentState.totalFiles;
		if (totalFiles === 0) return;

		// Calculate progress based on file statuses
		let completedFiles = 0;
		let totalProgress = 0;

		currentState.files.forEach((file) => {
			if (file.status === 'completed') {
				completedFiles++;
				totalProgress += 100;
			} else if (file.status === 'uploading') {
				// For uploading files, use actual progress or minimum 20% if not started
				const uploadProgress = file.progress !== undefined ? file.progress : 0;
				totalProgress += Math.max(20, uploadProgress); // Minimum 20% for uploading status
			} else if (file.status === 'processing') {
				totalProgress += 15; // Give some progress for processing
			}
			// Pending files contribute 0% progress
		});

		const overallProgress = Math.min(100, Math.round(totalProgress / totalFiles));

		updateUploadState(sessionId, {
			overallProgress,
			uploadedCount: completedFiles,
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
					lightGallery: session.lightGallery, // ✅ Include lightGallery information
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
			// Ensure processed file has .jpg extension since it's converted to JPEG
			const processedFileName = originalFile.name.replace(/\.[^/.]+$/, '.jpg');
			processedFile = new File([processedBuffer], processedFileName, { type: 'image/jpeg' });

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
		isLiteGallery = false,
	) => {
		// ✅ For lite galleries, use optimized file name instead of original
		const givenFileName = isLiteGallery
			? uploadResultOptimized.fileKey.split('/').pop()
			: uploadResultOriginal.fileKey.split('/').pop();
		const updatedVersionId = versionId.toString();

		const {
			width: originalWidth,
			height: originalHeight,
			format: originalFormat,
			originalDateTime,
		} = extractedMetadata;

		const payload = {
			tag_ids: settings.selectedGalleryTags?.map((tag) => tag._id || '') || [],
			image_id: imageId.toHexString(),
			activeVersion: {
				versionId: updatedVersionId,
				uploadBatchId: uploadBatchID,
				isAIFacesEnabled: settings.isAiEnabled || false,
				originalFileName: image.file.name,
				givenFileName,
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

		// ✅ Only include original S3 data for classic galleries
		if (!isLiteGallery) {
			payload.activeVersion.s3_original = {
				key: uploadResultOriginal.fileKey,
				size: image.file.size,
			};
		}

		return payload;
	};

	// Helper function to run promises with a concurrency limit
	const limitConcurrency = async (items, limit, asyncFn) => {
		const results = [];
		const executing = [];

		for (const item of items) {
			const p = Promise.resolve().then(() => asyncFn(item));
			results.push(p);

			if (limit <= items.length) {
				const e = p.then(() => executing.splice(executing.indexOf(e), 1));
				executing.push(e);
				if (executing.length >= limit) {
					await Promise.race(executing);
				}
			}
		}

		return Promise.all(results);
	};

	// Start upload process for a specific session - MODIFIED for Batching
	const startUploadSession = async (sessionId, initialState) => {
		let uniqueFiles;
		try {
			if (runningSessions.current.has(sessionId)) {
				console.warn(`Session ${sessionId} is already running, skipping...`);
				return;
			}

			if (!sessionStatesRef.current.has(sessionId)) {
				console.warn(`Session ${sessionId} not found in ref state, cannot start upload`);
				return;
			}

			runningSessions.current.add(sessionId);
			updateUploadState(sessionId, { status: 'uploading' });

			// Update initial progress
			updateOverallProgress(sessionId);

			// Deduplicate files within this session
			uniqueFiles = initialState.files.filter((fileData, index, self) => {
				const fileKey = `${fileData.file.name}-${fileData.file.size}`;
				return self.findIndex((f) => `${f.file.name}-${f.file.size}` === fileKey) === index;
			});

			// Define batch size (e.g., 50 files or ~3GB - you might need to adjust based on avg file size)
			const BATCH_SIZE = 100; // Start with a smaller number of files per batch
			// Alternatively, you could calculate batch size based on cumulative file size, but it's more complex.

			// Split files into batches
			const batches = [];
			for (let i = 0; i < uniqueFiles.length; i += BATCH_SIZE) {
				batches.push(uniqueFiles.slice(i, i + BATCH_SIZE));
			}

			// Process and upload each batch SEQUENTIALLY
			for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
				const currentBatch = batches[batchIndex];

				// Step 1: Get FRESH upload policies for THIS batch
				// This is crucial to avoid expiry
				const policyResponse = await getUploadImagePolicy(initialState.galleryId);
				const policyData = policyResponse?.[1];
				if (!policyData) {
					throw new Error('Failed to get upload policies for batch');
				}

				// Create thumbnail policies (same as before)
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

				// Step 2: Process all files in the current batch with limited concurrency
				const processPromises = currentBatch.map(async (fileData, fileIndexInBatch) => {
					const globalFileIndex = batchIndex * BATCH_SIZE + fileIndexInBatch; // For UI updates
					try {
						const fileKey = `${sessionId}-${fileData.file.name}-${fileData.file.size}`;

						if (processingFiles.current.has(fileKey)) {
							console.warn(`File ${fileData.file.name} already processing`);
							return null; // or handle as needed
						}

						if (!runningSessions.current.has(sessionId)) {
							console.warn(`Session no longer running, skipping file`);
							return null;
						}

						processingFiles.current.add(fileKey);

						const currentState = sessionStatesRef.current.get(sessionId);
						updateUploadState(sessionId, {
							files: (currentState?.files || uniqueFiles).map((f, i) =>
								i === globalFileIndex ? { ...f, status: 'processing' } : f,
							),
						});

						// Update progress when file starts processing
						updateOverallProgress(sessionId);

						const processResult = await processSingleImage(
							fileData.file,
							initialState.settings,
						);

						if (!processResult.success) {
							throw new Error(processResult.error);
						}

						const currentRefState = sessionStatesRef.current.get(sessionId);
						updateUploadState(sessionId, {
							processedCount: (currentRefState?.processedCount || 0) + 1,
							files: (currentRefState?.files || uniqueFiles).map((f, i) =>
								i === globalFileIndex
									? {
											...f,
											status: 'uploading',
											processedFile: processResult.processedFile,
									  }
									: f,
							),
						});

						// Update overall progress after processing
						updateOverallProgress(sessionId);

						return { fileData, processResult, globalFileIndex };
					} catch (error) {
						console.error('Processing failed for file:', fileData.file.name, error);
						const failedState = sessionStatesRef.current.get(sessionId);
						updateUploadState(sessionId, {
							files: (failedState?.files || uniqueFiles).map((f, i) =>
								i === globalFileIndex
									? { ...f, status: 'failed', error: error.message }
									: f,
							),
						});

						// Update overall progress after processing failure
						updateOverallProgress(sessionId);

						const fileKey = `${sessionId}-${fileData.file.name}-${fileData.file.size}`;
						processingFiles.current.delete(fileKey);
						return null; // Return null for failed processing
					}
				});

				// Limit concurrent processing to avoid overwhelming the system
				const MAX_CONCURRENT_PROCESSES = 4; // Adjust based on your system
				const processedBatch = await limitConcurrency(
					processPromises,
					MAX_CONCURRENT_PROCESSES,
					async (promise) => await promise,
				);

				// Filter out any null results (failed processing)
				const successfulProcesses = processedBatch.filter((result) => result !== null);

				// Step 3: Upload all successfully processed files in the batch
				const uploadPromises = successfulProcesses.map(
					async ({ fileData, processResult, globalFileIndex }) => {
						try {
							const imageId = ObjectID();
							const versionId = Date.now();

							// ✅ For lite galleries, skip original upload and only upload optimized + thumbnails
							const isLiteGallery = initialState.lightGallery === 'true';

							let uploadPromises = [];
							let uploadResultOriginal = null;

							if (isLiteGallery) {
								// For lite galleries, skip original upload
								uploadResultOriginal = {
									success: true,
									fileKey: 'lite-gallery-no-original', // Placeholder
								};

								uploadPromises = [
									uploadImage(
										processResult.processedFile,
										'optimized',
										null,
										policyData, // Use the FRESH policy for this batch
										imageId,
										(percent) => {
											const currentState =
												sessionStatesRef.current.get(sessionId);
											updateUploadState(sessionId, {
												files: (currentState?.files || uniqueFiles).map(
													(f, i) =>
														i === globalFileIndex
															? { ...f, progress: percent }
															: f,
												),
											});

											// Update overall progress during upload
											updateOverallProgress(sessionId);
										},
										initialState.galleryId,
										versionId,
										initialState.tenantId,
										initialState.uploadBatchID,
									),
									uploadImage(
										processResult.thumbnailFile,
										'thumbnails_300w',
										null,
										fakePolicyData, // Use the FRESH policy for this batch
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
										fakePolicyData, // Use the FRESH policy for this batch
										imageId,
										null,
										initialState.galleryId,
										versionId,
										initialState.tenantId,
										initialState.uploadBatchID,
									),
								];
							} else {
								// For classic galleries, upload all four versions including original
								uploadPromises = [
									uploadImage(
										fileData.file,
										'originals',
										null,
										policyData, // Use the FRESH policy for this batch
										imageId,
										(percent) => {
											const currentState =
												sessionStatesRef.current.get(sessionId);
											updateUploadState(sessionId, {
												files: (currentState?.files || uniqueFiles).map(
													(f, i) =>
														i === globalFileIndex
															? { ...f, progress: percent }
															: f,
												),
											});

											// Update overall progress during upload
											updateOverallProgress(sessionId);
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
										policyData, // Use the FRESH policy for this batch
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
										fakePolicyData, // Use the FRESH policy for this batch
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
										fakePolicyData, // Use the FRESH policy for this batch
										imageId,
										null,
										initialState.galleryId,
										versionId,
										initialState.tenantId,
										initialState.uploadBatchID,
									),
								];
							}

							// Execute all uploads
							const uploadResults = await Promise.all(uploadPromises);

							// Extract results based on gallery type
							let uploadResultOptimized,
								uploadResultThumbnail300w,
								uploadResultThumbnail100h;

							if (isLiteGallery) {
								[
									uploadResultOptimized,
									uploadResultThumbnail300w,
									uploadResultThumbnail100h,
								] = uploadResults;
							} else {
								[
									uploadResultOriginal,
									uploadResultOptimized,
									uploadResultThumbnail300w,
									uploadResultThumbnail100h,
								] = uploadResults;
							}

							// ✅ Validate uploads based on gallery type
							if (isLiteGallery) {
								// For lite galleries, only check optimized and thumbnails
								if (
									!uploadResultOptimized.success ||
									!uploadResultThumbnail300w.success ||
									!uploadResultThumbnail100h.success
								) {
									throw new Error('One or more uploads failed');
								}
							} else {
								// For classic galleries, check all uploads including original
								if (
									!uploadResultOriginal.success ||
									!uploadResultOptimized.success ||
									!uploadResultThumbnail300w.success ||
									!uploadResultThumbnail100h.success
								) {
									throw new Error('One or more uploads failed');
								}
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
								isLiteGallery, // ✅ Pass lite gallery flag
							);

							const [success] = await uploadDesktopImages(
								initialState.galleryId,
								initialState.albumId,
								payload,
							);

							if (!success) {
								throw new Error('Failed to register image with backend');
							}

							const completedState = sessionStatesRef.current.get(sessionId);
							updateUploadState(sessionId, {
								files: (completedState?.files || uniqueFiles).map((f, i) =>
									i === globalFileIndex
										? { ...f, status: 'completed', progress: 100 }
										: f,
								),
							});

							// Update overall progress after file completion
							updateOverallProgress(sessionId);

							const fileKey = `${sessionId}-${fileData.file.name}-${fileData.file.size}`;
							processingFiles.current.delete(fileKey);
						} catch (error) {
							console.error('Upload failed for file:', fileData.file.name, error);
							const failedState = sessionStatesRef.current.get(sessionId);
							updateUploadState(sessionId, {
								files: (failedState?.files || uniqueFiles).map((f, i) =>
									i === globalFileIndex
										? { ...f, status: 'failed', error: error.message }
										: f,
								),
							});

							// Update overall progress after file failure
							updateOverallProgress(sessionId);

							const fileKey = `${sessionId}-${fileData.file.name}-${fileData.file.size}`;
							processingFiles.current.delete(fileKey);
						}
					},
				);

				// Wait for all uploads in this batch to complete
				await Promise.all(uploadPromises);

				// Update progress after batch completion
				updateOverallProgress(sessionId);

				// Optional: Small delay between batches to let system breathe
				// await new Promise(resolve => setTimeout(resolve, 1000));
			}

			// Clear interval when ALL batches are complete
			const sessionIntervalId = intervalRefs.current.get(sessionId);
			if (sessionIntervalId) {
				clearInterval(sessionIntervalId);
				intervalRefs.current.delete(sessionId);
			}

			updateUploadState(sessionId, {
				status: 'completed',
				overallProgress: 100,
			});

			// Clean up
			uniqueFiles.forEach((fileData) => {
				const fileKey = `${sessionId}-${fileData.file.name}-${fileData.file.size}`;
				processingFiles.current.delete(fileKey);
			});
			startedSessions.current.delete(sessionId);
			runningSessions.current.delete(sessionId);

			setTimeout(() => {
				handleUploadComplete(sessionId);
			}, 500);
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

			setTimeout(() => {
				handleUploadCancel(sessionId);
			}, 1000);
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
			(state) => state.status === 'uploading' || state.status === 'preparing',
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
		const hasPreparing = states.some((s) => s.status === 'preparing');
		const hasCompleted = states.some((s) => s.status === 'completed');
		const hasFailed = states.some((s) => s.status === 'failed');
		const activeCount = states.filter(
			(s) => s.status === 'uploading' || s.status === 'preparing',
		).length;
		const completedCount = states.filter((s) => s.status === 'completed').length;

		if (hasUploading || hasPreparing) {
			if (completedCount > 0) {
				return `Uploading ${activeCount} batch${
					activeCount > 1 ? 'es' : ''
				} (${completedCount} completed)`;
			}
			return `Uploading ${activeCount} batch${activeCount > 1 ? 'es' : ''}`;
		}
		if (hasCompleted && !hasUploading && !hasPreparing && !hasFailed)
			return 'All uploads completed';
		if (hasFailed) return 'Some uploads failed';
		return 'Processing...';
	};

	// Ensure popup shows if there are active uploads, even if state is inconsistent
	const hasActiveUploads = activeUploads.size > 0;
	const hasActiveSessions = Array.from(activeUploads.values()).some(
		(session) =>
			session.status === 'uploading' ||
			session.status === 'preparing' ||
			session.status === 'completed',
	);
	const shouldShowPopup = showUploadProgressPopup || hasActiveUploads || hasActiveSessions;

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
