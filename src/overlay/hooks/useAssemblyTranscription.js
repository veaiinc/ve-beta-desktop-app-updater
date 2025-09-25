import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import getBaseUrl from '../../services/baseUrls';
import Context from '../../context/context';

const wsUrl = getBaseUrl({ region: 'us-east-1', type: 'meeting_ws_api' });

const useAssemblyTranscription = ({
	onTranscriptionUpdate,
	onLiveIntelligenceResponse,
	notification = {},
}) => {
	const {
		notes: { initializeMeetingSummary },
	} = useContext(Context);
	const [isConnected, setIsConnected] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [isPaused, setIsPaused] = useState(false);
	const [timer, setTimer] = useState(0);
	const [connectionStatus, setConnectionStatus] = useState('disconnected');

	const websocketRef = useRef(null);
	const audioContextRef = useRef(null);

	// Mic audio refs
	const micProcessorRef = useRef(null);
	const micSourceRef = useRef(null);
	const micStreamRef = useRef(null);
	const micBufferRef = useRef([]);
	const micSampleCountRef = useRef(0);

	// Screen audio refs
	const screenProcessorRef = useRef(null);
	const screenSourceRef = useRef(null);
	const screenStreamRef = useRef(null);
	const screenBufferRef = useRef([]);
	const screenSampleCountRef = useRef(0);

	const timerIntervalRef = useRef(null);
	const isMountedRef = useRef(false);
	const connectionPromiseRef = useRef(null);
	const reconnectTimeoutRef = useRef(null);
	const reconnectAttemptsRef = useRef(0);
	const connectionParamsRef = useRef(null);
	const muteRef = useRef(false);
	const maxReconnectAttempts = 3;
	const meetingIdRef = useRef(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
			// Ensure timer is cleared on unmount
			if (timerIntervalRef.current) {
				clearInterval(timerIntervalRef.current);
				timerIntervalRef.current = null;
			}
			cleanup();
		};
	}, []);

	const log = useCallback((msg, data) => {
		console.log(`[AssemblyTranscription] ${msg}`, data || '');
	}, []);

	const updateStatus = useCallback(
		(status, className) => {
			if (!isMountedRef.current) return;
			setConnectionStatus(className);
			log(`Status: ${status}`);
		},
		[log],
	);

	// Enhanced timer management functions
	const startTimer = useCallback(() => {
		// Always clear any existing timer first
		if (timerIntervalRef.current) {
			clearInterval(timerIntervalRef.current);
			timerIntervalRef.current = null;
		}

		// Reset timer to 0
		setTimer(0);

		// Start new interval
		if (isMountedRef.current) {
			timerIntervalRef.current = setInterval(() => {
				if (isMountedRef.current) {
					setTimer((prev) => prev + 1);
				}
			}, 1000);
		}
	}, []);

	const stopTimer = useCallback(() => {
		if (timerIntervalRef.current) {
			clearInterval(timerIntervalRef.current);
			timerIntervalRef.current = null;
		}
		setTimer(0);
	}, []);

	const pauseTimer = useCallback(() => {
		if (timerIntervalRef.current) {
			clearInterval(timerIntervalRef.current);
			timerIntervalRef.current = null;
		}
		// Note: Don't reset timer to 0, keep current value
	}, []);

	const resumeTimer = useCallback(() => {
		// Only start if not already running
		if (!timerIntervalRef.current && isMountedRef.current) {
			timerIntervalRef.current = setInterval(() => {
				if (isMountedRef.current) {
					setTimer((prev) => prev + 1);
				}
			}, 1000);
		}
	}, []);

	const cleanup = useCallback(async () => {
		// Clear timers first and foremost
		if (timerIntervalRef.current) {
			clearInterval(timerIntervalRef.current);
			timerIntervalRef.current = null;
		}
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = null;
		}

		// Cleanup mic audio resources
		if (micProcessorRef.current) {
			try {
				micProcessorRef.current.disconnect();
			} catch (e) {
				log(`Error disconnecting mic processor: ${e.message}`);
			}
			micProcessorRef.current = null;
		}

		if (micSourceRef.current) {
			try {
				micSourceRef.current.disconnect();
			} catch (e) {
				log(`Error disconnecting mic source: ${e.message}`);
			}
			micSourceRef.current = null;
		}

		if (micStreamRef.current) {
			try {
				micStreamRef.current.getTracks().forEach((track) => track.stop());
			} catch (e) {
				log(`Error stopping mic stream tracks: ${e.message}`);
			}
			micStreamRef.current = null;
		}

		// Cleanup screen audio resources
		if (screenProcessorRef.current) {
			try {
				screenProcessorRef.current.disconnect();
			} catch (e) {
				log(`Error disconnecting screen processor: ${e.message}`);
			}
			screenProcessorRef.current = null;
		}

		if (screenSourceRef.current) {
			try {
				screenSourceRef.current.disconnect();
			} catch (e) {
				log(`Error disconnecting screen source: ${e.message}`);
			}
			screenSourceRef.current = null;
		}

		if (screenStreamRef.current) {
			try {
				screenStreamRef.current.getTracks().forEach((track) => track.stop());
			} catch (e) {
				log(`Error stopping screen stream tracks: ${e.message}`);
			}
			screenStreamRef.current = null;
		}

		// Close audio context
		if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
			try {
				audioContextRef.current.close();
			} catch (e) {
				log(`Error closing audio context: ${e.message}`);
			}
			audioContextRef.current = null;
		}

		// Close WebSocket
		if (websocketRef.current && websocketRef.current.readyState !== WebSocket.CLOSED) {
			try {
				websocketRef.current.close();
			} catch (e) {
				log(`Error closing WebSocket: ${e.message}`);
			}
			websocketRef.current = null;
		}

		// Reset buffers and state
		micBufferRef.current = [];
		micSampleCountRef.current = 0;
		screenBufferRef.current = [];
		screenSampleCountRef.current = 0;
		connectionPromiseRef.current = null;
		connectionParamsRef.current = null;
		reconnectAttemptsRef.current = 0;

		if (meetingIdRef.current) {
			const meetingId = meetingIdRef.current;
			setTimeout(() => {
				if (window?.electronApi?.navigateMainWindow) {
					window?.electronApi?.navigateMainWindow({
						path: `/meet/${meetingId}?type=desktop&history=true`,
					});
				}
			}, 2000);
			meetingIdRef.current = null;
		}

		// Reset all timer-related state
		if (isMountedRef.current) {
			setIsConnected(false);
			setIsRecording(false);
			setIsPaused(false);
			setIsMuted(false);
			setTimer(0);
			updateStatus('Disconnected', 'disconnected');
		}
	}, [log, updateStatus, initializeMeetingSummary]);

	const attemptReconnect = useCallback(() => {
		if (!isMountedRef.current || reconnectAttemptsRef.current >= maxReconnectAttempts) {
			return;
		}

		reconnectAttemptsRef.current += 1;
		const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current - 1), 10000);

		log(
			`Attempting reconnection ${reconnectAttemptsRef.current}/${maxReconnectAttempts} in ${delay}ms`,
		);

		reconnectTimeoutRef.current = setTimeout(() => {
			if (isMountedRef.current && !isConnected && connectionParamsRef.current) {
				connect(connectionParamsRef.current).catch(() => {
					if (reconnectAttemptsRef.current < maxReconnectAttempts) {
						attemptReconnect();
					} else {
						notification?.error(
							'Failed to reconnect to transcription service after multiple attempts',
						);
					}
				});
			}
		}, delay);
	}, [isConnected]);

	const stopRecording = useCallback(
		({ meetingId } = {}) => {
			if (!isMountedRef.current) return;

			log('Stopping recording...');

			setIsRecording(false);
			setIsPaused(false);

			// Stop timer using new function
			stopTimer();

			// Disconnect mic audio nodes
			if (micProcessorRef.current) {
				try {
					micProcessorRef.current.disconnect();
					micProcessorRef.current.onaudioprocess = null;
				} catch (e) {
					log(`Error disconnecting mic processor: ${e.message}`);
				}
				micProcessorRef.current = null;
			}

			if (micSourceRef.current) {
				try {
					micSourceRef.current.disconnect();
				} catch (e) {
					log(`Error disconnecting mic source: ${e.message}`);
				}
				micSourceRef.current = null;
			}

			// Disconnect screen audio nodes
			if (screenProcessorRef.current) {
				try {
					screenProcessorRef.current.disconnect();
					screenProcessorRef.current.onaudioprocess = null;
				} catch (e) {
					log(`Error disconnecting screen processor: ${e.message}`);
				}
				screenProcessorRef.current = null;
			}

			if (screenSourceRef.current) {
				try {
					screenSourceRef.current.disconnect();
				} catch (e) {
					log(`Error disconnecting screen source: ${e.message}`);
				}
				screenSourceRef.current = null;
			}

			// Stop mic stream tracks
			if (micStreamRef.current) {
				try {
					micStreamRef.current.getTracks().forEach((track) => track.stop());
				} catch (e) {
					log(`Error stopping mic stream tracks: ${e.message}`);
				}
				micStreamRef.current = null;
			}

			// Stop screen stream tracks
			if (screenStreamRef.current) {
				try {
					screenStreamRef.current.getTracks().forEach((track) => track.stop());
				} catch (e) {
					log(`Error stopping screen stream tracks: ${e.message}`);
				}
				screenStreamRef.current = null;
			}

			// Close audio context last
			if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
				try {
					audioContextRef.current.close();
				} catch (e) {
					log(`Error closing audio context: ${e.message}`);
				}
				audioContextRef.current = null;
			}

			// Reset buffers
			micBufferRef.current = [];
			micSampleCountRef.current = 0;
			screenBufferRef.current = [];
			screenSampleCountRef.current = 0;
			cleanup();

			// Notify NotchDrop about the state change
			if (window.electronApi?.notchDrop?.onOverlayStateChange) {
				window.electronApi.notchDrop.onOverlayStateChange({
					isRecording: false,
					isPaused: false,
					timer: 0,
					isLiveIntelligenceOpen: false,
				});
			}
		},
		[log, cleanup, stopTimer],
	);

	const connect = useCallback(
		async ({ tenantId, sessionId, meetingId, jwtToken, isAiIntelligenceEnabled }) => {
			// Store params for reconnection
			connectionParamsRef.current = {
				tenantId,
				sessionId,
				meetingId,
				jwtToken,
				isAiIntelligenceEnabled,
			};

			// Prevent multiple simultaneous connection attempts
			if (connectionPromiseRef.current) {
				return connectionPromiseRef.current;
			}

			if (!jwtToken || !tenantId || !sessionId || !meetingId) {
				const error = 'Missing required authentication parameters';
				notification?.error(error);
				return Promise.reject(new Error(error));
			}

			// Reset reconnection attempts on successful manual connect
			reconnectAttemptsRef.current = 0;

			connectionPromiseRef.current = new Promise((resolve, reject) => {
				try {
					// Create WebSocket with proper URL encoding
					const encodedToken = encodeURIComponent(jwtToken);
					const fullUrl = `${wsUrl}/${meetingId}?token=${encodedToken}`;
					log(`Full WebSocket URL: ${fullUrl}`);

					const ws = new WebSocket(fullUrl);
					websocketRef.current = ws;

					const connectionTimeout = setTimeout(() => {
						if (ws.readyState !== WebSocket.OPEN) {
							log('WebSocket connection timeout');
							ws.close();
							reject(new Error('Connection timeout'));
						}
					}, 10000);

					ws.onopen = () => {
						clearTimeout(connectionTimeout);
						log('WebSocket connected, sending authentication...');
						updateStatus('Connected', 'connected');

						if (isMountedRef.current) {
							setIsConnected(true);
						}

						let location = null;
						try {
							const locationStr = localStorage.getItem('locationDetails');
							if (locationStr) {
								location = JSON.parse(locationStr);
							}
						} catch (e) {
							log(`Error parsing location details: ${e.message}`);
						}

						const authData = {
							token: jwtToken,
							tenant_id: tenantId,
							session_id: sessionId,
							meeting_id: meetingId,
							location,
							timezone: location?.timezone,
							is_ai_intelligence_enabled: isAiIntelligenceEnabled,
						};

						log(`Sending auth data:`, authData);

						try {
							ws.send(JSON.stringify(authData));
						} catch (e) {
							log(`Error sending auth data: ${e.message}`);
							reject(e);
						}
					};

					ws.onmessage = (event) => {
						if (!isMountedRef.current) return;

						try {
							const data = JSON.parse(event.data);
							log(`Received WebSocket message:`, data);

							// Handle both 'type' and 'event' fields for connection confirmation
							if (data.type === 'connect' || data.event === 'connect') {
								log('Successfully authenticated and connected to STT service');
								connectionPromiseRef.current = null;
								resolve(true);
							} else if (data.type === 'transcription') {
								if (data.text && data.text.trim()) {
									const transcriptionData = {
										id: Date.now().toString(),
										text: data.text,
										isFinal: data.is_final,
										isTurnFormatted: data.isTurnFormatted,
										timestamp: new Date().toISOString(),
										source: data.source,
									};
									onTranscriptionUpdate?.(transcriptionData);

									// Reset the 5-minute Are You There timer when transcription is received
									if (
										window.electronApi?.areYouThere?.updateTranscriptionActivity
									) {
										window.electronApi.areYouThere.updateTranscriptionActivity();
									}
								}
							} else if (data.type === 'error') {
								notification?.error(data.message || 'Transcription service error');
								reject(new Error(data.message || 'Transcription service error'));
							} else {
								onLiveIntelligenceResponse?.(data?.data);
							}
						} catch (error) {
							log(`Error parsing message: ${error.message}`);
						}
					};

					ws.onclose = (event) => {
						clearTimeout(connectionTimeout);
						log(`WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`);
						updateStatus('Disconnected', 'disconnected');

						if (isMountedRef.current) {
							setIsConnected(false);
							stopRecording({ meetingId });
						}

						connectionPromiseRef.current = null;

						// Attempt reconnection if not a normal closure and component is still mounted
						if (isMountedRef.current && event.code !== 1000 && isRecording) {
							attemptReconnect();
						}

						if (connectionPromiseRef.current) {
							reject(
								new Error(
									`WebSocket disconnected: ${event.reason || 'Unknown reason'}`,
								),
							);
						}
					};

					ws.onerror = (error) => {
						clearTimeout(connectionTimeout);
						log(`WebSocket error: ${error}`);
						updateStatus('Error', 'error');
						connectionPromiseRef.current = null;
						reject(error);
					};
				} catch (error) {
					log(`Error creating WebSocket: ${error.message}`);
					connectionPromiseRef.current = null;
					if (window.electronApi) {
						window.electronApi.sendMessageFrmVeApp('meetingstopped');
					}
					reject(error);
				}
			});

			try {
				return connectionPromiseRef.current;
			} catch (error) {
				connectionPromiseRef.current = null;
				notification?.error('Failed to connect to transcription service');
				throw error;
			}
		},
		[
			onTranscriptionUpdate,
			onLiveIntelligenceResponse,
			log,
			updateStatus,
			stopRecording,
			isRecording,
			attemptReconnect,
		],
	);

	const disconnect = useCallback(() => {
		reconnectAttemptsRef.current = maxReconnectAttempts; // Prevent reconnection attempts
		cleanup();
	}, [cleanup]);

	const sendAudioData = useCallback(
		(audioData, source) => {
			if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
				return;
			}

			try {
				const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioData.buffer)));
				websocketRef.current.send(
					JSON.stringify({
						type: 'audio_data',
						source: source, // "mic" or "screen"
						data: { audio_data: base64Audio, sample_rate: 16000 },
					}),
				);
			} catch (error) {
				log(`Error sending ${source} audio data: ${error.message}`);
			}
		},
		[log],
	);

	// Enhanced Voice Activity Detection with different thresholds for different sources
	const hasAudioSignal = useCallback((audioData, source = 'screen') => {
		if (!audioData || audioData.length === 0) return false;

		// Calculate RMS (Root Mean Square) to detect actual audio signal
		let sum = 0;
		for (let i = 0; i < audioData.length; i++) {
			sum += audioData[i] * audioData[i];
		}
		const rms = Math.sqrt(sum / audioData.length);

		// Different thresholds for different sources
		// Mic might need higher threshold due to breath sounds, room tone
		const threshold = source === 'mic' ? 0.002 : 0.001;

		return rms > threshold;
	}, []);

	// Automatic echo cancellation and source separation
	const audioEchoCancellationRef = useRef({
		screenAudioHistory: [], // Store recent screen audio for comparison
		micAudioHistory: [], // Store recent mic audio for comparison
		echoThreshold: 0.2, // Much more aggressive threshold
		historySize: 8, // More history for better detection
		lastScreenTime: 0,
		lastMicTime: 0,
		consecutiveEchoCount: 0, // Track consecutive echoes
		maxConsecutiveEchoes: 2, // If we detect echoes, be more aggressive
		lastUniqueVoiceTime: 0, // Track when we last heard unique voice
		micSilenceCount: 0, // Track consecutive silent mic chunks
		debugMode: false, // Set to true to disable echo cancellation for testing
		screenAudioActive: false, // Track if screen audio is currently active
	});

	// Advanced echo detection using cross-correlation and timing analysis
	const isEchoAudio = useCallback((micAudioData, screenAudioData) => {
		if (!micAudioData || !screenAudioData || micAudioData.length !== screenAudioData.length) {
			return false;
		}

		// Method 1: Direct correlation (immediate echo)
		let correlation = 0;
		let norm1 = 0;
		let norm2 = 0;

		for (let i = 0; i < micAudioData.length; i++) {
			correlation += micAudioData[i] * screenAudioData[i];
			norm1 += micAudioData[i] * micAudioData[i];
			norm2 += screenAudioData[i] * screenAudioData[i];
		}

		const directCorrelation = Math.abs(correlation) / (Math.sqrt(norm1) * Math.sqrt(norm2));

		// Method 2: Check against recent screen audio history (delayed echo)
		let maxHistoricalCorrelation = 0;
		for (const historicalScreenAudio of audioEchoCancellationRef.current.screenAudioHistory) {
			if (historicalScreenAudio.length === micAudioData.length) {
				let histCorrelation = 0;
				let histNorm1 = 0;
				let histNorm2 = 0;

				for (let i = 0; i < micAudioData.length; i++) {
					histCorrelation += micAudioData[i] * historicalScreenAudio[i];
					histNorm1 += micAudioData[i] * micAudioData[i];
					histNorm2 += historicalScreenAudio[i] * historicalScreenAudio[i];
				}

				const histNormalizedCorrelation = Math.abs(histCorrelation) / (Math.sqrt(histNorm1) * Math.sqrt(histNorm2));
				maxHistoricalCorrelation = Math.max(maxHistoricalCorrelation, histNormalizedCorrelation);
			}
		}

		// Method 3: Timing analysis - if mic audio comes shortly after screen audio
		const timeDiff = Date.now() - audioEchoCancellationRef.current.lastScreenTime;
		const isTimingEcho = timeDiff > 50 && timeDiff < 500; // 50ms-500ms delay typical for echo

		// Method 4: Frequency domain analysis for better echo detection
		const micRMS = Math.sqrt(norm1 / micAudioData.length);
		const screenRMS = Math.sqrt(norm2 / screenAudioData.length);
		const rmsRatio = Math.min(micRMS, screenRMS) / Math.max(micRMS, screenRMS);

		// Method 5: Check if mic audio is significantly quieter than screen audio (typical of echo)
		const isQuieterEcho = micRMS < screenRMS * 0.8 && directCorrelation > 0.2;

		// Method 6: Check for very high correlation (obvious echo)
		const isObviousEcho = directCorrelation > 0.4;

		// Method 7: Check if both audio sources have similar energy patterns
		const energySimilarity = rmsRatio > 0.3 && directCorrelation > 0.2;

		// Method 8: If screen audio is active, be much more aggressive
		const isScreenActive = audioEchoCancellationRef.current.screenAudioActive;
		const isScreenActiveEcho = isScreenActive && directCorrelation > 0.15;

		// Method 9: Check for similar content patterns (like "influence money" appearing in both)
		const isContentSimilar = directCorrelation > 0.1 && rmsRatio > 0.2;

		// Combine methods - be much more aggressive when screen audio is active
		const isEcho = isObviousEcho ||
					   (directCorrelation > audioEchoCancellationRef.current.echoThreshold) ||
					   (maxHistoricalCorrelation > 0.3) ||
					   (isTimingEcho && directCorrelation > 0.2) ||
					   (energySimilarity) ||
					   (isScreenActiveEcho) ||
					   (isContentSimilar && isScreenActive);

		if (isEcho) {
			log(`🎯 Echo detected: direct=${directCorrelation.toFixed(3)}, historical=${maxHistoricalCorrelation.toFixed(3)}, timing=${isTimingEcho}, quieter=${isQuieterEcho}, rmsRatio=${rmsRatio.toFixed(3)}, energy=${energySimilarity}, screenActive=${isScreenActive}, contentSimilar=${isContentSimilar}`);
		}

		return isEcho;
	}, []);

	// Store audio history for echo detection
	const storeAudioHistory = useCallback((audioData, source) => {
		const history = source === 'screen' ? 
			audioEchoCancellationRef.current.screenAudioHistory : 
			audioEchoCancellationRef.current.micAudioHistory;

		history.push([...audioData]);
		
		// Keep only recent history
		if (history.length > audioEchoCancellationRef.current.historySize) {
			history.shift();
		}

		// Update timing
		if (source === 'screen') {
			audioEchoCancellationRef.current.lastScreenTime = Date.now();
		} else {
			audioEchoCancellationRef.current.lastMicTime = Date.now();
		}
	}, []);

	const startAudioCapture = useCallback(async () => {
		try {
			log('Starting audio capture...');

			// Skip Electron API permission checking for now to avoid timing issues
			// We'll rely on the browser's built-in permission system
			log('Using browser permission system directly...');

			// Helper function to create a timeout promise
			const withTimeout = (promise, timeoutMs, errorMessage) => {
				return Promise.race([
					promise,
					new Promise((_, reject) =>
						setTimeout(() => reject(new Error(errorMessage)), timeoutMs),
					),
				]);
			};

			// Get microphone stream with timeout handling
			log('Requesting microphone access...');
			let micStream;

			try {
				micStream = await withTimeout(
					navigator.mediaDevices.getUserMedia({
						audio: {
							sampleRate: 16000,
							channelCount: 1,
							echoCancellation: true,
							noiseSuppression: true,
							autoGainControl: true,
						},
					}),
					10000, // 10 second timeout
					'Timeout starting microphone source',
				);
				micStreamRef.current = micStream;
				log('Microphone access granted');
			} catch (micError) {
				log('Microphone access failed with specific constraints:', micError.message);
				// If microphone access fails, try with basic constraints
				log('Trying microphone with basic constraints...');
				try {
					micStream = await withTimeout(
						navigator.mediaDevices.getUserMedia({ audio: true }),
						5000, // 5 second timeout for basic constraints
						'Timeout starting microphone with basic constraints',
					);
					micStreamRef.current = micStream;
					log('Microphone access granted with basic constraints');
				} catch (basicMicError) {
					log(
						'Microphone access failed even with basic constraints:',
						basicMicError.message,
					);
					throw basicMicError; // Re-throw to be handled by outer catch block
				}
			}

			// Skip Electron API screen permission checking for now to avoid timing issues
			// We'll rely on the browser's built-in permission system
			log('Using browser permission system for screen capture...');

			// Get screen capture using Electron's automatic whole screen selection
			log('Requesting automatic whole screen capture...');
			let screenStream;

			try {
				// Electron will automatically select the primary screen without showing a dialog
				log('Starting automatic screen capture (no dialog)...');

				screenStream = await withTimeout(
					navigator.mediaDevices.getDisplayMedia({
						audio: {
							echoCancellation: false,
							noiseSuppression: false,
							autoGainControl: false,
							sampleRate: 48000,
						},
						video: {
							width: { ideal: 1920, max: 1920 },
							height: { ideal: 1080, max: 1080 },
							frameRate: { ideal: 30, max: 30 },
							cursor: 'never', // Don't show cursor
						},
					}),
					5000, // Reduced timeout since no user interaction needed
					'Timeout during automatic screen capture',
				);

				screenStreamRef.current = screenStream;
				log('✅ Automatic whole screen capture successful - no dialog shown');
			} catch (screenCaptureError) {
				log('❌ Screen capture failed:', screenCaptureError.message);

				// Continue with microphone only - don't fail the entire recording
				log('📱 Proceeding with microphone-only recording...');
				screenStream = null;
				screenStreamRef.current = null;
			}

			// Create audio context
			log('Creating audio context...');
			const audioContext = new (window.AudioContext || window.webkitAudioContext)({
				sampleRate: 16000,
			});
			audioContextRef.current = audioContext;
			log(`Audio context created with sample rate: ${audioContext.sampleRate}Hz`);

			// Handle suspended audio context
			if (audioContext.state === 'suspended') {
				log('Audio context suspended, resuming...');
				try {
					await audioContext.resume();
					log('Audio context resumed successfully');
				} catch (e) {
					log(`Error resuming audio context: ${e.message}`);
				}
			}

			// Set up microphone audio processing
			log('Setting up microphone audio processing...');
			const micSource = audioContext.createMediaStreamSource(micStream);
			micSourceRef.current = micSource;

			let micProcessor;
			try {
				micProcessor = audioContext.createScriptProcessor(1024, 1, 1);
			} catch (e) {
				micProcessor = audioContext.createScriptProcessor(2048, 1, 1);
			}
			micProcessorRef.current = micProcessor;

			micBufferRef.current = [];
			micSampleCountRef.current = 0;

			let micProcessingCount = 0;

			micProcessor.onaudioprocess = (e) => {
				if (!isMountedRef.current) return;

				micProcessingCount++;
				// if (micProcessingCount % 100 === 0) {
				// 	log(`Mic audio processing active (${micProcessingCount} calls)`);
				// }

				try {
					const inputData = e.inputBuffer.getChannelData(0);

					// Accumulate mic audio data
					for (let i = 0; i < inputData.length; i++) {
						micBufferRef.current.push(inputData[i]);
					}
					micSampleCountRef.current += inputData.length;

					// Send mic audio data in chunks when we have enough samples
					if (micSampleCountRef.current >= 8000) {
						if (
							!muteRef.current &&
							websocketRef.current?.readyState === WebSocket.OPEN
						) {
							// Convert float32 to int16 efficiently
							const audioData = new Int16Array(micBufferRef.current.length);
							for (let i = 0; i < micBufferRef.current.length; i++) {
								const sample = micBufferRef.current[i];
								audioData[i] = Math.max(-32768, Math.min(32767, sample * 32768));
							}

							// Use Voice Activity Detection to determine if we should send this chunk
							if (hasAudioSignal(micBufferRef.current, 'mic')) {
								// Check if this mic audio is echo from screen audio
								let isEcho = false;
								
								// Debug mode: disable echo cancellation for testing
								if (audioEchoCancellationRef.current.debugMode || window.echoDebugMode) {
									log(`🔧 DEBUG MODE: Echo cancellation disabled - sending all mic audio`);
									isEcho = false;
								} else {
									// SIMPLE APPROACH: If screen audio is active, temporarily disable mic transcription
									if (audioEchoCancellationRef.current.screenAudioActive) {
										log(`🔇 Screen audio active - temporarily disabling mic transcription to prevent echo`);
										isEcho = true; // Block all mic audio when screen is active
									} else {
										// Only allow mic audio when screen audio is not active
										isEcho = false;
										log(`🎤 Screen audio inactive - allowing mic transcription`);
									}
								}
								
								if (!isEcho) {
									log(`🎤 Sending mic audio chunk: ${audioData.length} samples (unique voice)`);
									sendAudioData(audioData, 'mic');
									// Reset consecutive echo count and update last unique voice time
									audioEchoCancellationRef.current.consecutiveEchoCount = 0;
									audioEchoCancellationRef.current.lastUniqueVoiceTime = Date.now();
									audioEchoCancellationRef.current.micSilenceCount = 0;
								} else {
									log(`🔇 Filtering echo from mic audio (YouTube/screen audio detected in microphone)`);
									// Increment consecutive echo count for more aggressive filtering
									audioEchoCancellationRef.current.consecutiveEchoCount++;
								}
								
								// Store mic audio history for echo detection
								storeAudioHistory(micBufferRef.current, 'mic');
							} else {
								log('Skipping silent mic audio chunk');
								audioEchoCancellationRef.current.micSilenceCount++;
							}
						}

						// Reset mic buffer
						micBufferRef.current = [];
						micSampleCountRef.current = 0;
					}
				} catch (error) {
					log(`Error processing mic audio: ${error.message}`);
				}
			};

			micSource.connect(micProcessor);
			micProcessor.connect(audioContext.destination);
			log('Microphone audio processing connected');

			// Set up screen audio processing (if available)
			if (screenStream && screenStream.getAudioTracks) {
				const screenAudioTracks = screenStream.getAudioTracks();
				if (screenAudioTracks.length > 0) {
					log('Setting up screen audio processing...');
					const screenAudioStream = new MediaStream(screenAudioTracks);
					const screenSource = audioContext.createMediaStreamSource(screenAudioStream);
					screenSourceRef.current = screenSource;

					let screenProcessor;
					try {
						screenProcessor = audioContext.createScriptProcessor(1024, 1, 1);
					} catch (e) {
						screenProcessor = audioContext.createScriptProcessor(2048, 1, 1);
					}
					screenProcessorRef.current = screenProcessor;

					screenBufferRef.current = [];
					screenSampleCountRef.current = 0;

					let screenProcessingCount = 0;

					screenProcessor.onaudioprocess = (e) => {
						if (!isMountedRef.current) return;

						screenProcessingCount++;
						// if (screenProcessingCount % 100 === 0) {
						// 	log(`Screen audio processing active (${screenProcessingCount} calls)`);
						// }

						try {
							const inputData = e.inputBuffer.getChannelData(0);

							// Accumulate screen audio data
							for (let i = 0; i < inputData.length; i++) {
								screenBufferRef.current.push(inputData[i]);
							}
							screenSampleCountRef.current += inputData.length;

							// Send screen audio data in chunks when we have enough samples
							if (screenSampleCountRef.current >= 8000) {
								if (
									!muteRef.current &&
									websocketRef.current?.readyState === WebSocket.OPEN
								) {
									// Convert float32 to int16 efficiently
									const audioData = new Int16Array(
										screenBufferRef.current.length,
									);
									for (let i = 0; i < screenBufferRef.current.length; i++) {
										const sample = screenBufferRef.current[i];
										audioData[i] = Math.max(
											-32768,
											Math.min(32767, sample * 32768),
										);
									}

									// Use Voice Activity Detection to determine if we should send this chunk
									if (hasAudioSignal(screenBufferRef.current, 'screen')) {
										log(`📺 Sending screen audio chunk: ${audioData.length} samples`);
										sendAudioData(audioData, 'screen');
										
										// Mark screen audio as active
										audioEchoCancellationRef.current.screenAudioActive = true;
										
										// Store screen audio history for echo detection
										storeAudioHistory(screenBufferRef.current, 'screen');
									} else {
										log('Skipping silent screen audio chunk');
										// If screen audio is silent for a while, mark it as inactive
										if (audioEchoCancellationRef.current.screenAudioActive) {
											audioEchoCancellationRef.current.screenAudioActive = false;
											log('📺 Screen audio marked as inactive');
										}
									}
								}

								// Reset screen buffer
								screenBufferRef.current = [];
								screenSampleCountRef.current = 0;
							}
						} catch (error) {
							log(`Error processing screen audio: ${error.message}`);
						}
					};

					screenSource.connect(screenProcessor);
					screenProcessor.connect(audioContext.destination);
					log('Screen audio processing connected');
				} else {
					log('No screen audio tracks available');
				}
			} else {
				log('No screen stream available, proceeding with microphone only');
			}

			if (isMountedRef.current) {
				setIsRecording(true);

				// Start timer using the new function
				startTimer();
			}

			log('Audio capture setup completed successfully');
		} catch (error) {
			log(`Error starting recording: ${error.message}`);

			// Determine which permission failed based on error context
			let errorTitle = 'Permission Error';
			let errorMessage = 'Please check your permissions and try again.';

			if (error.message.includes('Timeout starting video source')) {
				errorTitle = 'Screen capture timeout';
				errorMessage =
					'Screen capture is taking too long to start. Please try again or check if another application is using screen recording.';
			} else if (error.message.includes('Timeout starting microphone')) {
				errorTitle = 'Microphone timeout';
				errorMessage =
					'Microphone access is taking too long to start. Please check if another application is using the microphone.';
			} else if (error.name === 'NotAllowedError') {
				// Check if this is likely a microphone or screen permission error
				if (error.message.includes('microphone') || error.message.includes('audio')) {
					errorTitle = 'Microphone access denied';
					errorMessage =
						'Please allow microphone access in your system settings and browser.';
				} else if (error.message.includes('display') || error.message.includes('screen')) {
					errorTitle = 'Screen recording access denied';
					errorMessage =
						'Please allow screen recording access in your system settings and browser.';
				} else {
					errorTitle = 'Microphone/Screen access denied';
					errorMessage =
						'Please allow microphone and screen sharing permissions in your system settings and browser.';
				}
			} else if (error.name === 'NotFoundError') {
				errorTitle = 'No microphone found';
				errorMessage =
					'Please check your audio devices and ensure a microphone is connected.';
			} else if (error.name === 'NotReadableError') {
				errorTitle = 'Microphone is being used by another application';
				errorMessage =
					'Please close other applications that might be using the microphone and try again.';
			} else if (error.name === 'OverconstrainedError') {
				errorTitle = 'Audio settings not supported';
				errorMessage =
					'Your microphone does not support the required audio settings. Please try with a different microphone.';
			} else {
				errorTitle = 'Failed to start recording';
				errorMessage = `Please check your microphone and screen sharing permissions. Error: ${error.message}`;
			}

			notification?.error(errorTitle, errorMessage);
			throw error;
		}
	}, [log, sendAudioData, hasAudioSignal, startTimer]);

	const startRecording = useCallback(
		async ({ tenantId, sessionId, meetingId, jwtToken, isAiIntelligenceEnabled }) => {
			log('startRecording called with params:', {
				tenantId: !!tenantId,
				sessionId: !!sessionId,
				meetingId: !!meetingId,
				jwtToken: !!jwtToken,
				isAiIntelligenceEnabled,
			});

			try {
				// Reset all states
				setIsMuted(false);
				setIsPaused(false);
				muteRef.current = false;
				meetingIdRef.current = meetingId;

				// Ensure clean timer state
				stopTimer();

				// Skip permission checking to avoid timing issues with Electron APIs
				// The browser will handle permission prompts when we call getUserMedia/getDisplayMedia
				log('Skipping pre-permission checks, will rely on browser permission prompts...');

				// First establish WebSocket connection
				log('Establishing WebSocket connection...');
				await connect({
					tenantId,
					sessionId,
					meetingId,
					jwtToken,
					isAiIntelligenceEnabled,
				});

				// Then start audio capture
				log('Starting audio capture...');
				await startAudioCapture();
			} catch (error) {
				log(`Failed to start recording: ${error.message}`);
				stopRecording({ meetingId });
			}
		},
		[connect, startAudioCapture, log, stopRecording, stopTimer],
	);

	const toggleMute = useCallback(() => {
		const newMutedState = !isMuted;
		setIsMuted(newMutedState);
		muteRef.current = newMutedState;

		log(`${newMutedState ? 'Muting' : 'Unmuting'} microphone`);

		// FREEZE TIMER WHEN MUTING
		if (newMutedState) {
			pauseTimer();
			// Clear any pending mic audio buffer
			micBufferRef.current = [];
			micSampleCountRef.current = 0;
		} else {
			// Resume timer when unmuting (only if recording and not paused)
			if (isRecording && !isPaused) {
				resumeTimer();
			}
		}
	}, [isMuted, isRecording, isPaused, log, pauseTimer, resumeTimer]);

	const pauseRecording = useCallback(() => {
		if (!isRecording || isPaused) return;

		log('Pausing recording...');
		setIsPaused(true);

		// Pause timer
		pauseTimer();

		// Stop mic audio processing (screen continues)
		muteRef.current = true;

		// Clear any pending mic audio buffer
		micBufferRef.current = [];
		micSampleCountRef.current = 0;
	}, [isRecording, isPaused, log, pauseTimer]);

	const resumeRecording = useCallback(() => {
		if (!isRecording || !isPaused) return;

		log('Resuming recording...');
		setIsPaused(false);

		// Resume mic audio processing
		muteRef.current = isMuted; // Respect current mute state

		// Resume timer only if not muted
		if (!isMuted) {
			resumeTimer();
		}
	}, [isRecording, isPaused, isMuted, log, resumeTimer]);

	const formatTime = useCallback((seconds) => {
		const m = Math.floor(seconds / 60).toString();
		const s = (seconds % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	}, []);

	// Handle audio context state changes
	// useEffect(() => {
	// 	const handleVisibilityChange = () => {
	// 		if (document.hidden && audioContextRef.current) {
	// 			// Page hidden - suspend audio context to save resources
	// 			if (audioContextRef.current.state === 'running') {
	// 				audioContextRef.current.suspend().catch((e) => {
	// 					log(`Error suspending audio context: ${e.message}`);
	// 				});
	// 			}
	// 		} else if (!document.hidden && audioContextRef.current && isRecording) {
	// 			// Page visible - resume audio context
	// 			if (audioContextRef.current.state === 'suspended') {
	// 				audioContextRef.current.resume().catch((e) => {
	// 					log(`Error resuming audio context: ${e.message}`);
	// 				});
	// 			}
	// 		}
	// 	};

	// 	document.addEventListener('visibilitychange', handleVisibilityChange);
	// 	return () => {
	// 		document.removeEventListener('visibilitychange', handleVisibilityChange);
	// 	};
	// }, [isRecording, log]);

	// Timer anomaly detection
	useEffect(() => {
		let lastTimerValue = timer;
		let checkCount = 0;

		const intervalCheck = setInterval(() => {
			if (isRecording && !isPaused && !isMuted && timerIntervalRef.current) {
				checkCount++;
				const expectedChange = checkCount;
				const actualChange = timer - lastTimerValue;

				if (Math.abs(actualChange - expectedChange) > 2) {
					log('Timer anomaly detected:', {
						expected: expectedChange,
						actual: actualChange,
						hasInterval: !!timerIntervalRef.current,
						isRecording,
						isPaused,
						isMuted,
					});
					// Auto-fix: restart timer
					stopTimer();
					if (isRecording && !isPaused && !isMuted) {
						startTimer();
					}
				}
			}
			checkCount = 0;
			lastTimerValue = timer;
		}, 5000); // Check every 5 seconds

		return () => clearInterval(intervalCheck);
	}, [timer, isRecording, isPaused, isMuted, log, stopTimer, startTimer]);

	return {
		isConnected,
		isRecording,
		isMuted,
		isPaused,
		timer,
		connectionStatus,
		startRecording,
		stopRecording,
		toggleMute,
		pauseRecording,
		resumeRecording,
		formatTime,
		disconnect,
	};
};

export default useAssemblyTranscription;
