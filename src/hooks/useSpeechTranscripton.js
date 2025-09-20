import { useState, useEffect, useRef, useCallback } from 'react';
import { message } from 'antd';
import getBaseUrl from '../services/baseUrls';

const wsUrl = getBaseUrl({ region: 'us-east-1', type: 'meeting_ws_api' });

const useSpeechTranscription = ({ tenantId }) => {
	const MAX_RETRY_ATTEMPTS = 5;
	const RETRY_DELAY = 1000; // 1 second

	const [showInactivityPopup, setShowInactivityPopup] = useState(false);
	const websocketRef = useRef(null);
	const audioContextRef = useRef(null);
	const streamRef = useRef(null);
	const sourceRef = useRef(null);
	const processorRef = useRef(null);
	const audioBufferRef = useRef([]);
	const sampleCountRef = useRef(0);
	const muteRef = useRef(false);
	const socketClosingTimeoutRef = useRef(null);
	const retryTimerRef = useRef(null);

	const userToken = localStorage.getItem('usertoken');
	const encodedToken = encodeURIComponent(userToken);

	useEffect(() => {
		return () => {
			cleanup();
		};
	}, []);

	const resetSocketClosingTimeout = () => {
		if (socketClosingTimeoutRef.current) {
			clearTimeout(socketClosingTimeoutRef.current);
		}

		if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
			socketClosingTimeoutRef.current = setTimeout(() => {
				setShowInactivityPopup(true);
			}, 3 * 60 * 1000);
		}
	};

	const handleResetTimer = () => {
		setShowInactivityPopup(false);
		resetSocketClosingTimeout();
	};

	const cleanup = useCallback(() => {
		setShowInactivityPopup(false);

		// Cleanup timeouts
		if (socketClosingTimeoutRef.current) {
			clearTimeout(socketClosingTimeoutRef.current);
			socketClosingTimeoutRef.current = null;
		}

		if (retryTimerRef.current) {
			clearTimeout(retryTimerRef.current);
			retryTimerRef.current = null;
		}

		// Cleanup audio resources in correct order
		if (processorRef.current) {
			try {
				processorRef.current.disconnect();
			} catch (e) {
				console.log(`Error disconnecting processor: ${e.message}`);
			}
			processorRef.current = null;
		}

		if (sourceRef.current) {
			try {
				sourceRef.current.disconnect();
			} catch (e) {
				console.log(`Error disconnecting source: ${e.message}`);
			}
			sourceRef.current = null;
		}

		if (streamRef.current) {
			try {
				streamRef.current.getTracks().forEach((track) => track.stop());
			} catch (e) {
				console.log(`Error stopping stream tracks: ${e.message}`);
			}
			streamRef.current = null;
		}

		if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
			try {
				audioContextRef.current.close();
			} catch (e) {
				console.log(`Error closing audio context: ${e.message}`);
			}
			audioContextRef.current = null;
		}

		// Close WebSocket
		if (websocketRef.current && websocketRef.current.readyState !== WebSocket.CLOSED) {
			try {
				websocketRef.current.close();
			} catch (e) {
				console.log(`Error closing WebSocket: ${e.message}`);
			}
			websocketRef.current = null;
		}

		// Reset buffers and state
		audioBufferRef.current = [];
		sampleCountRef.current = 0;
	}, []);

	const handleConnect = async ({ sessionId, onMessageFunc }) => {
		return new Promise((resolve, reject) => {
			let attempts = 0;

			const attemptConnection = () => {
				// If max retries exceeded, reject the promise
				if (attempts >= MAX_RETRY_ATTEMPTS) {
					cleanup();
					reject(new Error('Failed to connect, Please try again'));
					return;
				}

				// If socket doesn't exist or is closed, try to reconnect
				if (!websocketRef.current || websocketRef.current.readyState === WebSocket.CLOSED) {
					console.log('Connection closed, attempting to reconnect...');
					createWebSocketConnection({ sessionId, onMessageFunc });
					attempts++;
					retryTimerRef.current = setTimeout(attemptConnection, RETRY_DELAY);
					return;
				}

				// If socket is still connecting, wait and retry
				if (websocketRef.current.readyState === WebSocket.CONNECTING) {
					console.log('Connection not ready, waiting...');
					attempts++;
					retryTimerRef.current = setTimeout(attemptConnection, RETRY_DELAY);
					return;
				}

				// If socket is ready
				if (websocketRef.current.readyState === WebSocket.OPEN) {
					try {
						resolve();
						console.log('socket connected');
						startRecording();
					} catch (error) {
						reject(error);
					}
				}
			};

			attemptConnection();
		});
	};

	const createWebSocketConnection = useCallback(
		async ({ sessionId, onMessageFunc }) => {
			if (websocketRef.current) {
				return;
			}

			websocketRef.current = new WebSocket(`${wsUrl}/${sessionId}?token=${encodedToken}`);

			websocketRef.current.onopen = () => {
				const authData = {
					token: userToken,
					tenant_id: tenantId,
					session_id: sessionId,
					is_ai_intelligence_enabled: false,
				};

				try {
					websocketRef.current.send(JSON.stringify(authData));
					resetSocketClosingTimeout();
				} catch (e) {
					console.log(`Error sending auth data: ${e.message}`);
				}
			};

			websocketRef.current.onmessage = (event) => {
				onMessageFunc?.(event);
			};

			websocketRef.current.onclose = (event) => {
				console.log('Socket disconnected', event);
				//do not need to call cleanup function because onclose will run when calling close(), so you dont need to call here
				// cleanup();
			};

			websocketRef.current.onerror = (event) => {
				cleanup();
				console.log('Error from socket', event);
			};
		},
		[cleanup],
	);

	const sendAudioData = useCallback((audioData) => {
		if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
			return;
		}

		try {
			const base64Audio = btoa(String.fromCharCode(...new Uint8Array(audioData.buffer)));
			websocketRef.current.send(
				JSON.stringify({
					type: 'audio_data',
					source: 'mic',
					data: { audio_data: base64Audio, sample_rate: 16000 },
				}),
			);
		} catch (error) {
			console.log(`Error sending audio data: ${error.message}`);
		}
	}, []);

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
					console.log(`Error resuming audio context: ${e.message}`);
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
					console.log(`Error processing audio: ${error.message}`);
				}
			};

			source.connect(processor);
			processor.connect(audioContext.destination);
		} catch (error) {
			console.log(`Error starting recording: ${error.message}`);

			if (error.name === 'NotAllowedError') {
				message.error('Microphone access denied. Please allow microphone permissions.');
			} else if (error.name === 'NotFoundError') {
				message.error('No microphone found. Please check your audio devices.');
			} else if (error.name === 'NotReadableError') {
				message.error('Microphone is being used by another application.');
			} else {
				message.error('Failed to start recording. Please check your microphone.');
			}
		}
	}, [sendAudioData]);

	const startRecording = useCallback(async () => {
		try {
			await startAudioCapture();
		} catch (error) {
			// stopRecording();
			console.log(`Failed to start recording: ${error.message}`);
		}
	}, [startAudioCapture]);

	const handleDisconnect = useCallback(() => {
		console.log('Connection closed');
		cleanup();
	}, [cleanup]);

	return { showInactivityPopup, handleConnect, handleDisconnect, handleResetTimer };
};

export default useSpeechTranscription;
