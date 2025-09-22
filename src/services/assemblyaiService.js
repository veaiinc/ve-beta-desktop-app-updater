/**
 * AssemblyAI Service for uploading audio files to AssemblyAI for transcription
 * This service handles file uploads to AssemblyAI's API
 */

import getBaseUrl from './baseUrls.js';

class AssemblyAIService {
	constructor() {
		this.baseUrl = 'https://api.assemblyai.com/v2';
		this.apiKey = 'f603256738e841169e8262b8b591f1bb'; // Static API key
	}

	/**
	 * Set the API key for AssemblyAI
	 */
	setApiKey(apiKey) {
		this.apiKey = apiKey;
	}

	/**
	 * Upload audio file to AssemblyAI
	 * @param {string} filePath - Path to the audio file
	 * @returns {Promise<{success: boolean, uploadUrl?: string, error?: string}>}
	 */
	async uploadFile(filePath) {
		try {
			if (!this.apiKey) {
				throw new Error('AssemblyAI API key not configured');
			}

			if (!window.electronApi || !window.electronApi.fs) {
				throw new Error('Electron APIs not available');
			}

			// Read the audio file as binary data
			const fileResult = await window.electronApi.fs.readFileBinary(filePath);
			if (!fileResult.success) {
				throw new Error(`Failed to read file: ${fileResult.error}`);
			}

			// Prepare headers
			const headers = {
				authorization: this.apiKey,
				'content-type': 'application/octet-stream',
			};

			// Upload to AssemblyAI
			const response = await fetch(`${this.baseUrl}/upload`, {
				method: 'POST',
				headers: headers,
				body: fileResult.data,
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`AssemblyAI upload failed: ${response.status} ${errorText}`);
			}

			const result = await response.json();
			console.log('AssemblyAI upload successful:', result.upload_url);

			return {
				success: true,
				uploadUrl: result.upload_url,
			};
		} catch (error) {
			console.error('Error uploading to AssemblyAI:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	/**
	 * Upload audio blob directly to AssemblyAI
	 * @param {Blob} audioBlob - Audio blob to upload
	 * @returns {Promise<{success: boolean, uploadUrl?: string, error?: string}>}
	 */
	async uploadBlob(audioBlob) {
		try {
			if (!this.apiKey) {
				throw new Error('AssemblyAI API key not configured');
			}

			// Prepare headers
			const headers = {
				authorization: this.apiKey,
				'content-type': audioBlob.type || 'application/octet-stream',
			};

			// Upload to AssemblyAI
			const response = await fetch(`${this.baseUrl}/upload`, {
				method: 'POST',
				headers: headers,
				body: audioBlob,
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`AssemblyAI upload failed: ${response.status} ${errorText}`);
			}

			const result = await response.json();
			console.log('AssemblyAI upload successful:', result.upload_url);

			return {
				success: true,
				uploadUrl: result.upload_url,
			};
		} catch (error) {
			console.error('Error uploading blob to AssemblyAI:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	/**
	 * Start transcription job with AssemblyAI
	 * @param {string} uploadUrl - The upload URL from AssemblyAI
	 * @param {Object} options - Transcription options
	 * @returns {Promise<{success: boolean, transcriptionId?: string, error?: string}>}
	 */
	async startTranscription(uploadUrl, options = {}) {
		try {
			if (!this.apiKey) {
				throw new Error('AssemblyAI API key not configured');
			}

			const transcriptionData = {
				audio_url: uploadUrl,
				...options,
			};

			const response = await fetch(`${this.baseUrl}/transcript`, {
				method: 'POST',
				headers: {
					authorization: this.apiKey,
					'content-type': 'application/json',
				},
				body: JSON.stringify(transcriptionData),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`AssemblyAI transcription start failed: ${response.status} ${errorText}`,
				);
			}

			const result = await response.json();
			console.log('AssemblyAI transcription started:', result.id);

			return {
				success: true,
				transcriptionId: result.id,
			};
		} catch (error) {
			console.error('Error starting AssemblyAI transcription:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	/**
	 * Get transcription status and results
	 * @param {string} transcriptionId - The transcription ID
	 * @returns {Promise<{success: boolean, status?: string, text?: string, error?: string}>}
	 */
	async getTranscription(transcriptionId) {
		try {
			if (!this.apiKey) {
				throw new Error('AssemblyAI API key not configured');
			}

			const response = await fetch(`${this.baseUrl}/transcript/${transcriptionId}`, {
				headers: {
					authorization: this.apiKey,
				},
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`AssemblyAI transcription fetch failed: ${response.status} ${errorText}`,
				);
			}

			const result = await response.json();
			console.log('AssemblyAI transcription status:', result.status);

			return {
				success: true,
				status: result.status,
				text: result.text,
				confidence: result.confidence,
				words: result.words,
			};
		} catch (error) {
			console.error('Error getting AssemblyAI transcription:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}

	/**
	 * Send audio URL to meeting summary API endpoint for meeting analytics
	 * @param {string} meetingId - The meeting ID
	 * @param {string} audioUrl - The AssemblyAI audio URL
	 * @param {string} jwtToken - JWT token for authentication
	 * @returns {Promise<{success: boolean, result?: object, error?: string}>}
	 */
	async sendToWorkspaceAPI(meetingId, audioUrl, jwtToken) {
		console.log('🚀 ===== SEND TO WORKSPACE API STARTED =====');
		console.log('🚀 Function called at:', new Date().toISOString());
		console.log('📋 Input parameters:', {
			meetingId,
			audioUrl,
			hasJwtToken: !!jwtToken,
			jwtTokenLength: jwtToken ? jwtToken.length : 0,
		});

		try {
			if (!jwtToken) {
				console.error('❌ JWT token is missing');
				throw new Error('JWT token is required');
			}

			const workspaceId = localStorage.getItem('workspaceId');
			console.log('🏢 Workspace ID from localStorage:', workspaceId);

			if (!workspaceId) {
				console.error('❌ Workspace ID not found in localStorage');
				console.log('🔍 Available localStorage keys:', Object.keys(localStorage));
				throw new Error('Workspace ID not found');
			}

			// Get audio duration - use a simpler approach that works
			let audioDurationSeconds = 0;
			console.log('🔍 ===== STARTING AUDIO DURATION CALCULATION =====');
			console.log('🔍 Meeting ID:', meetingId);
			console.log('🔍 Audio URL:', audioUrl);
			console.log('🔍 JWT Token exists:', !!jwtToken);

			try {
				// Import audioStorageService dynamically to avoid circular dependency
				const { default: audioStorageService } = await import('./audioStorageService.js');
				console.log('📦 AudioStorageService imported successfully');

				const audioResult = await audioStorageService.getAudio(meetingId);
				console.log('🎵 Audio result from storage:', {
					success: audioResult.success,
					hasAudioBlob: !!audioResult.audioBlob,
					audioBlobSize: audioResult.audioBlob ? audioResult.audioBlob.size : 0,
					audioBlobType: audioResult.audioBlob ? audioResult.audioBlob.type : 'N/A',
				});

				if (audioResult.success && audioResult.audioBlob) {
					console.log('🎵 Attempting to get audio duration...');
					console.log('🎵 Audio blob size:', audioResult.audioBlob.size, 'bytes');
					console.log('🎵 Audio blob type:', audioResult.audioBlob.type);

					// Method 1: Try to estimate duration from file size (fallback)
					const estimatedDuration = audioResult.audioBlob.size / 16000; // Rough estimate: 16KB per second for WebM
					console.log(
						'📊 Estimated duration from file size:',
						estimatedDuration,
						'seconds',
					);

					// Method 2: Try to get actual duration using Web Audio API
					try {
						console.log('🎵 Trying Web Audio API approach...');
						const audioContext = new (window.AudioContext ||
							window.webkitAudioContext)();
						const arrayBuffer = await audioResult.audioBlob.arrayBuffer();
						console.log('📊 Audio array buffer size:', arrayBuffer.byteLength);

						try {
							const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
							audioDurationSeconds = audioBuffer.duration;
							console.log(
								'✅ Got duration from Web Audio API:',
								audioDurationSeconds,
								'seconds',
							);
							audioContext.close();
						} catch (decodeError) {
							console.warn('⚠️ Web Audio API decode failed:', decodeError.message);
							audioContext.close();

							// Method 3: Use the exact same approach as AudioPlayback that works
							console.log('🎵 Using AudioPlayback-style approach...');
							const audio = new Audio();
							audio.preload = 'metadata'; // EXACT AudioPlayback setting
							audio.crossOrigin = 'anonymous'; // EXACT AudioPlayback setting

							const blobUrl = URL.createObjectURL(audioResult.audioBlob);
							console.log('🎵 Created blob URL:', blobUrl);

							audioDurationSeconds = await new Promise((resolve) => {
								let resolved = false;
								let gotDurationFromSeek = false;

								const cleanup = () => {
									if (!resolved) {
										resolved = true;
										try {
											URL.revokeObjectURL(blobUrl);
											audio.src = '';
										} catch (e) {
											console.warn('Cleanup error:', e);
										}
									}
								};

								const checkAndSetDuration = (source) => {
									console.log(
										`📊 Checking duration from ${source}:`,
										audio.duration,
									);
									console.log(`📊 Duration type:`, typeof audio.duration);
									console.log(`📊 Is NaN:`, isNaN(audio.duration));
									console.log(`📊 Is Finite:`, isFinite(audio.duration));
									console.log(`📊 Is > 0:`, audio.duration > 0);

									// Use the EXACT same validation as AudioPlayback
									if (
										audio.duration &&
										!isNaN(audio.duration) &&
										isFinite(audio.duration) &&
										audio.duration > 0
									) {
										console.log(
											`✅ Got valid duration from ${source}:`,
											audio.duration,
										);
										cleanup();
										resolve(audio.duration);
										return true;
									} else {
										console.log(
											`❌ Duration validation failed from ${source}:`,
											{
												duration: audio.duration,
												hasValue: !!audio.duration,
												isNaN: isNaN(audio.duration),
												isFinite: isFinite(audio.duration),
												isPositive: audio.duration > 0,
											},
										);
										return false;
									}
								};

								// Add forceDurationDetection function EXACTLY like AudioPlayback
								const forceDurationDetection = () => {
									console.log(
										'🎵 Forcing duration detection by playing briefly (AudioPlayback method)',
									);

									// Set a very small current time and play briefly (EXACT AudioPlayback approach)
									audio.currentTime = 0.01;
									audio.volume = 0; // Mute to avoid any sound

									audio
										.play()
										.then(() => {
											// After 50ms, pause and check duration (EXACT AudioPlayback timing)
											setTimeout(() => {
												audio.pause();
												audio.currentTime = 0;

												console.log(
													'📊 After AudioPlayback-style forced play, duration:',
													audio.duration,
												);

												if (
													!checkAndSetDuration(
														'forcedPlayAudioPlaybackStyle',
													)
												) {
													console.warn(
														'⚠️ AudioPlayback-style forced play failed, using estimated duration',
													);
													cleanup();
													resolve(estimatedDuration);
												}
											}, 50); // EXACT AudioPlayback timing
										})
										.catch((error) => {
											console.warn(
												'⚠️ AudioPlayback-style forced play failed:',
												error,
											);
											cleanup();
											resolve(estimatedDuration);
										});
								};

								// Method 1: Try metadata first (exactly like AudioPlayback)
								audio.addEventListener('loadedmetadata', () => {
									console.log('📊 Metadata loaded, duration:', audio.duration);
									if (!checkAndSetDuration('metadata')) {
										console.log(
											'⚠️ Metadata duration invalid, forcing detection...',
										);
										// Use the same approach as AudioPlayback
										setTimeout(forceDurationDetection, 100);
									}
								});

								// Method 2: Duration change event
								audio.addEventListener('durationchange', () => {
									console.log('📊 Duration changed to:', audio.duration);
									checkAndSetDuration('durationchange');
								});

								// Method 3: Seeked event (this is what works in AudioPlayback)
								audio.addEventListener('seeked', () => {
									console.log('📊 Seeked completed, duration:', audio.duration);
									if (checkAndSetDuration('seeked')) {
										gotDurationFromSeek = true;
									} else {
										// If seek didn't work, try playing briefly
										console.log('⚠️ Seek failed, trying brief play...');
										audio.currentTime = 0;
										const playPromise = audio.play();
										if (playPromise) {
											playPromise
												.then(() => {
													setTimeout(() => {
														audio.pause();
														if (!checkAndSetDuration('playback')) {
															console.warn(
																'⚠️ All methods failed, using estimated duration',
															);
															cleanup();
															resolve(estimatedDuration);
														}
													}, 200);
												})
												.catch(() => {
													console.warn(
														'⚠️ Playback failed, using estimated duration',
													);
													cleanup();
													resolve(estimatedDuration);
												});
										}
									}
								});

								// Method 4: Can play event (exactly like AudioPlayback)
								audio.addEventListener('canplay', () => {
									console.log('📊 Can play, duration:', audio.duration);
									if (audio.duration > 0) {
										checkAndSetDuration('canplay');
									}
								});

								// Error handling
								audio.addEventListener('error', (e) => {
									console.error('❌ Audio error:', e);
									cleanup();
									resolve(estimatedDuration);
								});

								// Add AudioPlayback-style metadata timeout (500ms)
								setTimeout(() => {
									if (!resolved && !checkAndSetDuration('metadataTimeout')) {
										console.log(
											'⏰ AudioPlayback-style metadata timeout (500ms), forcing duration detection',
										);
										forceDurationDetection();
									}
								}, 500);

								// Final timeout fallback
								setTimeout(() => {
									if (!resolved) {
										console.warn(
											'⏰ Final duration detection timeout, using estimated duration',
										);
										cleanup();
										resolve(estimatedDuration);
									}
								}, 10000);

								// Set source and start duration detection (EXACT AudioPlayback approach)
								console.log('🎵 Setting audio source and starting load...');
								audio.src = blobUrl;
								audio.load();
							});
						}
					} catch (webAudioError) {
						console.warn('⚠️ Web Audio API not available:', webAudioError.message);
						// Use estimated duration as final fallback
						audioDurationSeconds = estimatedDuration;
						console.log(
							'📊 Using estimated duration as fallback:',
							audioDurationSeconds,
						);
					}

					console.log('✅ Final calculated duration:', audioDurationSeconds, 'seconds');
				} else {
					console.warn('⚠️ No audio blob available:', {
						success: audioResult.success,
						error: audioResult.error || 'Unknown error',
					});
				}
			} catch (durationError) {
				console.error('❌ Could not get audio duration:', {
					error: durationError.message,
					stack: durationError.stack,
				});
			}

			console.log('🎯 ===== FINAL AUDIO DURATION RESULT =====');
			console.log('🎯 Final audioDurationSeconds value:', audioDurationSeconds);
			console.log('🎯 Type of audioDurationSeconds:', typeof audioDurationSeconds);
			console.log('🎯 Is NaN:', isNaN(audioDurationSeconds));
			console.log('🎯 Is Finite:', isFinite(audioDurationSeconds));
			console.log('🎯 Is > 0:', audioDurationSeconds > 0);
			console.log('🎯 Exact value:', audioDurationSeconds);
			console.log('🎯 =====================================');

			const meetingSummaryApiUrl = getBaseUrl({ type: 'meeting_summary_api' });
			const apiUrl = `${meetingSummaryApiUrl}/${workspaceId}/generate_meeting_analytics`;

			console.log('🏗️ ===== BUILDING PAYLOAD =====');
			console.log('🏗️ meeting_id:', meetingId);
			console.log('🏗️ audio_url:', audioUrl);
			console.log('🏗️ audio_duration_seconds (before assignment):', audioDurationSeconds);

			const payload = {
				meeting_id: meetingId,
				audio_url: audioUrl,
				audio_duration_seconds: audioDurationSeconds,
			};

			console.log('🏗️ ===== PAYLOAD CREATED =====');
			console.log('🏗️ payload.audio_duration_seconds:', payload.audio_duration_seconds);
			console.log('🏗️ Full payload object:', payload);
			console.log('🏗️ JSON stringified payload:', JSON.stringify(payload, null, 2));
			console.log('🏗️ =============================');

			console.log(payload, 'payloaduday');

			console.log('🚀 ===== MEETING SUMMARY API PAYLOAD =====');
			console.log('📋 Payload Details:', JSON.stringify(payload, null, 2));
			console.log('🔍 Meeting Summary API call details:', {
				workspaceId,
				meetingId,
				audioUrl,
				audioDurationSeconds,
				apiUrl,
				payload,
			});
			console.log('🚀 ========================================');

			// Send to meeting summary API endpoint
			const response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${jwtToken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			console.log('📡 Meeting Summary API response status:', response.status);

			if (!response.ok) {
				const errorText = await response.text();
				console.error('❌ Meeting Summary API failed:', response.status, errorText);
				throw new Error(`HTTP ${response.status}: ${errorText}`);
			}

			const result = await response.json();
			console.log('✅ Meeting Summary API success:', result);

			return {
				success: true,
				result,
			};
		} catch (error) {
			console.error('Error sending to meeting summary API:', error);
			return {
				success: false,
				error: error.message,
			};
		}
	}
}

// Create singleton instance
const assemblyAIService = new AssemblyAIService();

export default assemblyAIService;
