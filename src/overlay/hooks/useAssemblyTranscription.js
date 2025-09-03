import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import getBaseUrl from '../../services/baseUrls';

const wsUrl = getBaseUrl({ region: 'us-east-1', type: 'meeting_ws_api' });

const useAssemblyTranscription = ({
	onTranscriptionUpdate,
	onLiveIntelligenceResponse,
	notification = {},
}) => {
	// const {
	// 	notes: { initializeMeetingSummary },
	// } = useContext(Context);
	const [isConnected, setIsConnected] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [isMuted, setIsMuted] = useState(false);
	const [timer, setTimer] = useState(0);
	const [connectionStatus, setConnectionStatus] = useState('disconnected');

	const websocketRef = useRef(null);
	const audioContextRef = useRef(null);
	const processorRef = useRef(null);
	const sourceRef = useRef(null);
	const streamRef = useRef(null);
	const timerIntervalRef = useRef(null);
	const audioBufferRef = useRef([]);
	const sampleCountRef = useRef(0);
	const isMountedRef = useRef(false);
	const connectionPromiseRef = useRef(null);
	const reconnectTimeoutRef = useRef(null);
	const reconnectAttemptsRef = useRef(0);
	const muteRef = useRef(false);
	const maxReconnectAttempts = 3;

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
			cleanup();
		};
	}, []);

	const log = useCallback((msg) => {
		console.log(`[AssemblyTranscription] ${msg}`);
	}, []);

	const updateStatus = useCallback(
		(status, className) => {
			if (!isMountedRef.current) return;
			setConnectionStatus(className);
			log(`Status: ${status}`);
		},
		[log],
	);

	const cleanup = useCallback(() => {
		// Clear timers
		if (timerIntervalRef.current) {
			clearInterval(timerIntervalRef.current);
			timerIntervalRef.current = null;
		}
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = null;
		}

		// Cleanup audio resources in correct order
		if (processorRef.current) {
			try {
				processorRef.current.disconnect();
			} catch (e) {
				log(`Error disconnecting processor: ${e.message}`);
			}
			processorRef.current = null;
		}

		if (sourceRef.current) {
			try {
				sourceRef.current.disconnect();
			} catch (e) {
				log(`Error disconnecting source: ${e.message}`);
			}
			sourceRef.current = null;
		}

		if (streamRef.current) {
			try {
				streamRef.current.getTracks().forEach((track) => track.stop());
			} catch (e) {
				log(`Error stopping stream tracks: ${e.message}`);
			}
			streamRef.current = null;
		}

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
		audioBufferRef.current = [];
		sampleCountRef.current = 0;
		connectionPromiseRef.current = null;
		reconnectAttemptsRef.current = 0;

		if (isMountedRef.current) {
			setIsConnected(false);
			setIsRecording(false);
			setTimer(0);
			updateStatus('Disconnected', 'disconnected');
		}
	}, [log, updateStatus]);

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
			if (isMountedRef.current && !isConnected) {
				connect().catch(() => {
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

	const stopRecording = useCallback(() => {
		if (!isMountedRef.current) return;

		log('Stopping recording...');

		setIsRecording(false);
		setTimer(0);

		// Clear timer
		if (timerIntervalRef.current) {
			clearInterval(timerIntervalRef.current);
			timerIntervalRef.current = null;
		}

		// Disconnect audio nodes in correct order
		if (processorRef.current) {
			try {
				processorRef.current.disconnect();
				processorRef.current.onaudioprocess = null; // Remove event listener
			} catch (e) {
				log(`Error disconnecting processor: ${e.message}`);
			}
			processorRef.current = null;
		}

		if (sourceRef.current) {
			try {
				sourceRef.current.disconnect();
			} catch (e) {
				log(`Error disconnecting source: ${e.message}`);
			}
			sourceRef.current = null;
		}

		// Stop stream tracks before closing audio context
		if (streamRef.current) {
			try {
				streamRef.current.getTracks().forEach((track) => track.stop());
			} catch (e) {
				log(`Error stopping stream tracks: ${e.message}`);
			}
			streamRef.current = null;
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
		audioBufferRef.current = [];
		sampleCountRef.current = 0;
		cleanup();
		// initializeMeetingSummary({ meeting_id: meetingId });
	}, [log]);

	const connect = useCallback(
		async ({ tenantId, sessionId, meetingId, jwtToken, isAiIntelligenceEnabled }) => {
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
					const ws = new WebSocket(`${wsUrl}/${meetingId}?token=${encodedToken}`);
					websocketRef.current = ws;

					const connectionTimeout = setTimeout(() => {
						if (ws.readyState !== WebSocket.OPEN) {
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

							if (data.type === 'connect') {
								log('Successfully authenticated and connected to STT service');
								connectionPromiseRef.current = null;
								resolve(true);
							} else if (data.type === 'transcription') {
								if (data.text && data.text.trim()) {
									const transcriptionData = {
										id: Date.now().toString(),
										text: data.text,
										isFinal: data.is_final || data.end_of_turn,
										isTurnFormatted: data.isTurnFormatted,
										timestamp: new Date().toISOString(),
									};
									onTranscriptionUpdate?.(transcriptionData);
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
							stopRecording();
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
					connectionPromiseRef.current = null;
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
		(audioData) => {
			if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
				return;
			}

			try {
				const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioData.buffer)));
				websocketRef.current.send(
					JSON.stringify({
						type: 'audio_data',
						data: { audio_data: base64Audio, sample_rate: 16000 },
					}),
				);
			} catch (error) {
				log(`Error sending audio data: ${error.message}`);
			}
		},
		[log],
	);

	const startAudioCapture = useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					sampleRate: 16000,
					channelCount: 1,
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true,
				},
			});
			streamRef.current = stream;

			const audioContext = new (window.AudioContext || window.webkitAudioContext)({
				sampleRate: 16000,
			});
			audioContextRef.current = audioContext;

			// Handle suspended audio context
			if (audioContext.state === 'suspended') {
				try {
					await audioContext.resume();
				} catch (e) {
					log(`Error resuming audio context: ${e.message}`);
				}
			}

			const source = audioContext.createMediaStreamSource(stream);
			sourceRef.current = source;

			// Use createScriptProcessor with fallback error handling
			let processor;
			try {
				processor = audioContext.createScriptProcessor(4096, 1, 1);
			} catch (e) {
				// Fallback to smaller buffer size
				processor = audioContext.createScriptProcessor(2048, 1, 1);
			}
			processorRef.current = processor;

			audioBufferRef.current = [];
			sampleCountRef.current = 0;

			processor.onaudioprocess = (e) => {
				if (!isMountedRef.current) return;

				try {
					const inputData = e.inputBuffer.getChannelData(0);

					// Always accumulate audio data (for processing)
					for (let i = 0; i < inputData.length; i++) {
						audioBufferRef.current.push(inputData[i]);
					}
					sampleCountRef.current += inputData.length;

					// Send audio data in chunks
					if (sampleCountRef.current >= 8000) {
						// CRITICAL: Check mute state right before sending
						if (
							!muteRef.current &&
							websocketRef.current?.readyState === WebSocket.OPEN
						) {
							const audioData = new Int16Array(audioBufferRef.current.length);

							// Convert float32 to int16 efficiently
							for (let i = 0; i < audioBufferRef.current.length; i++) {
								const sample = audioBufferRef.current[i];
								audioData[i] = Math.max(-32768, Math.min(32767, sample * 32768));
							}

							sendAudioData(audioData);
						}

						// Always reset buffer regardless of mute state
						audioBufferRef.current = [];
						sampleCountRef.current = 0;
					}
				} catch (error) {
					log(`Error processing audio: ${error.message}`);
				}
			};

			source.connect(processor);
			processor.connect(audioContext.destination);

			if (isMountedRef.current) {
				setIsRecording(true);
				setTimer(0);

				// Start timer
				timerIntervalRef.current = setInterval(() => {
					if (isMountedRef.current) {
						setTimer((prev) => prev + 1);
					}
				}, 1000);
			}
		} catch (error) {
			log(`Error starting recording: ${error.message}`);

			if (error.name === 'NotAllowedError') {
				notification?.error(
					'Microphone access denied',
					'Please allow microphone permissions.',
				);
			} else if (error.name === 'NotFoundError') {
				notification?.error('No microphone found', 'Please check your audio devices.');
			} else if (error.name === 'NotReadableError') {
				notification?.error(
					'Microphone is being used by another application',
					'Please check your audio devices.',
				);
			} else {
				notification?.error('Failed to start recording', 'Please check your microphone.');
			}
		}
	}, [log, sendAudioData]);

	const startRecording = useCallback(
		async ({ tenantId, sessionId, meetingId, jwtToken, isAiIntelligenceEnabled }) => {
			try {
				// First ensure WebSocket connection
				setIsMuted(false);
				muteRef.current = false;
				await startAudioCapture();
				if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
					log('Establishing connection...');
					await connect({
						tenantId,
						sessionId,
						meetingId,
						jwtToken,
						isAiIntelligenceEnabled,
					});
				}
			} catch (error) {
				stopRecording();
				log(`Failed to start recording: ${error.message}`);
			}
		},
		[connect, startAudioCapture, log, setIsRecording],
	);

	const toggleMute = useCallback(() => {
		const newMutedState = !isMuted;
		setIsMuted(newMutedState);
		muteRef.current = newMutedState;

		log(`${newMutedState ? 'Muting' : 'Unmuting'} microphone`);

		// When muting, clear any pending audio buffer to ensure no audio is sent
		if (newMutedState) {
			audioBufferRef.current = [];
			sampleCountRef.current = 0;
		}

		// Timer continues running regardless of mute state
		// (This matches typical meeting behavior where time tracks total session duration)
	}, [isMuted, log]);

	const formatTime = useCallback((seconds) => {
		const m = Math.floor(seconds / 60).toString();
		const s = (seconds % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	}, []);

	// Handle audio context state changes
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.hidden && audioContextRef.current) {
				// Page hidden - suspend audio context to save resources
				if (audioContextRef.current.state === 'running') {
					audioContextRef.current.suspend().catch((e) => {
						log(`Error suspending audio context: ${e.message}`);
					});
				}
			} else if (!document.hidden && audioContextRef.current && isRecording) {
				// Page visible - resume audio context
				if (audioContextRef.current.state === 'suspended') {
					audioContextRef.current.resume().catch((e) => {
						log(`Error resuming audio context: ${e.message}`);
					});
				}
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, [isRecording, log]);

	return {
		isConnected,
		isRecording,
		isMuted,
		timer,
		connectionStatus,
		startAudioCapture,
		stopRecording,
		toggleMute,
		formatTime,
		startRecording,
	};
};

export default useAssemblyTranscription;
