import { useState, useEffect, useRef, useCallback } from 'react';
import ObjectID from 'bson-objectid';
import { voice_agent_api_US } from '../../../services/config.live';

// Generate a simple session ID
const sessionId = ObjectID()?.toString();
const workspaceId = localStorage.getItem('workspaceId');

export const useVoiceAgent = (token) => {
	const [isConnected, setIsConnected] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [isConnecting, setIsConnecting] = useState(false);
	const [messages, setMessages] = useState([]);
	const [micStatus, setMicStatus] = useState('Click to start');

	const wsRef = useRef(null);
	const audioContextRef = useRef(null);
	const audioProcessorRef = useRef(null);
	const audioStreamRef = useRef(null);
	const isRecordingRef = useRef(false);

	// Audio playback variables
	const playbackAudioContextRef = useRef(null);
	const audioQueueRef = useRef([]);
	const isPlayingRef = useRef(false);
	const audioBufferQueueRef = useRef([]);
	const nextStartTimeRef = useRef(0);
	const audioContextStartedRef = useRef(false);
	const audioBufferRef = useRef(null);
	const audioBufferSizeRef = useRef(0);
	const lastFlushTimeRef = useRef(0);
	const MIN_BUFFER_SIZE = 1024; // Minimum buffer size before processing
	const FLUSH_INTERVAL = 100; // Flush buffer every 100ms if not full

	// Message tracking variables
	const currentMessageRef = useRef(null);
	const isReceivingResponseRef = useRef(false);

	const addMessage = useCallback((content, isUser = false) => {
		const newMessage = { content, isUser, id: Date.now() };
		setMessages((prev) => [...prev, newMessage]);
		return newMessage;
	}, []);

	const updateMessage = useCallback((messageId, content) => {
		setMessages((prev) =>
			prev.map((msg) => (msg.id === messageId ? { ...msg, content } : msg)),
		);
	}, []);

	// Initialize audio context for playback
	const initPlaybackAudioContext = useCallback(() => {
		if (!playbackAudioContextRef.current) {
			playbackAudioContextRef.current = new (window.AudioContext ||
				window.webkitAudioContext)({
				sampleRate: 24000,
			});
		}

		if (playbackAudioContextRef.current.state === 'suspended') {
			playbackAudioContextRef.current.resume();
		}

		if (!audioContextStartedRef.current) {
			nextStartTimeRef.current = playbackAudioContextRef.current.currentTime;
			audioContextStartedRef.current = true;
		}
	}, []);

	// Ensure audio context is running
	const ensureAudioContextRunning = useCallback(async () => {
		if (
			playbackAudioContextRef.current &&
			playbackAudioContextRef.current.state === 'suspended'
		) {
			await playbackAudioContextRef.current.resume();
		}
	}, []);

	// Initialize audio context on user interaction
	const initAudioOnUserInteraction = useCallback(() => {
		if (!playbackAudioContextRef.current) {
			initPlaybackAudioContext();
		}
		// Remove event listeners after first interaction
		document.removeEventListener('click', initAudioOnUserInteraction);
		document.removeEventListener('keydown', initAudioOnUserInteraction);
		document.removeEventListener('touchstart', initAudioOnUserInteraction);
	}, [initPlaybackAudioContext]);

	// Add event listeners for audio context initialization
	useEffect(() => {
		document.addEventListener('click', initAudioOnUserInteraction);
		document.addEventListener('keydown', initAudioOnUserInteraction);
		document.addEventListener('touchstart', initAudioOnUserInteraction);

		return () => {
			document.removeEventListener('click', initAudioOnUserInteraction);
			document.removeEventListener('keydown', initAudioOnUserInteraction);
			document.removeEventListener('touchstart', initAudioOnUserInteraction);
		};
	}, [initAudioOnUserInteraction]);

	// Improved audio queue processing for smooth streaming
	const processAudioQueue = useCallback(async () => {
		if (isPlayingRef.current) return;
		isPlayingRef.current = true;

		initPlaybackAudioContext();
		await ensureAudioContextRunning();

		while (audioQueueRef.current.length > 0) {
			if (playbackAudioContextRef.current.state === 'suspended') {
				await playbackAudioContextRef.current.resume();
			}

			const arrayBuffer = audioQueueRef.current.shift();

			try {
				const int16Array = new Int16Array(arrayBuffer);
				const float32Array = new Float32Array(int16Array.length);

				// Convert Int16 to Float32
				for (let i = 0; i < int16Array.length; i++) {
					float32Array[i] = int16Array[i] / 32768.0;
				}

				const audioBuffer = playbackAudioContextRef.current.createBuffer(
					1,
					float32Array.length,
					24000,
				);
				audioBuffer.getChannelData(0).set(float32Array);

				const bufferSource = playbackAudioContextRef.current.createBufferSource();
				bufferSource.buffer = audioBuffer;
				bufferSource.connect(playbackAudioContextRef.current.destination);

				// Schedule the audio to play at the next available time
				const duration = audioBuffer.duration;
				const startTime = Math.max(
					nextStartTimeRef.current,
					playbackAudioContextRef.current.currentTime,
				);
				bufferSource.start(startTime);
				nextStartTimeRef.current = startTime + duration;

				// Add error handling for buffer source
				bufferSource.onerror = (error) => {
					// Handle error silently
				};

				// Small delay to prevent overwhelming the audio system
				await new Promise((resolve) => setTimeout(resolve, 5));
			} catch (error) {
				// Continue processing other chunks even if one fails
			}
		}

		isPlayingRef.current = false;
	}, [initPlaybackAudioContext, ensureAudioContextRunning]);

	const stopRecording = useCallback(() => {
		if (isRecordingRef.current) {
			setIsRecording(false);
			isRecordingRef.current = false;

			if (audioStreamRef.current) {
				audioStreamRef.current.getTracks().forEach((track) => track.stop());
				audioStreamRef.current = null;
			}

			if (audioProcessorRef.current) {
				audioProcessorRef.current.disconnect();
				audioProcessorRef.current = null;
			}

			if (audioContextRef.current) {
				audioContextRef.current.close();
				audioContextRef.current = null;
			}
		}
	}, []);

	const startRecording = useCallback(async () => {
		if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
			return;
		}

		if (isRecordingRef.current) {
			return;
		}

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

			audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
				sampleRate: 16000,
			});

			const source = audioContextRef.current.createMediaStreamSource(stream);
			audioProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

			audioProcessorRef.current.onaudioprocess = (event) => {
				if (
					wsRef.current &&
					wsRef.current.readyState === WebSocket.OPEN &&
					isRecordingRef.current
				) {
					const inputBuffer = event.inputBuffer;
					const inputData = inputBuffer.getChannelData(0);

					const pcmData = new Int16Array(inputData.length);
					for (let i = 0; i < inputData.length; i++) {
						const s = Math.max(-1, Math.min(1, inputData[i]));
						pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
					}

					wsRef.current.send(pcmData.buffer);
				}
			};

			source.connect(audioProcessorRef.current);
			audioProcessorRef.current.connect(audioContextRef.current.destination);

			setIsRecording(true);
			isRecordingRef.current = true;
			setMicStatus('Listening...');

			audioStreamRef.current = stream;
		} catch (error) {
			setMicStatus('Recording failed');
		}
	}, []);

	const connectAndStart = useCallback(async () => {
		if (isConnected || isConnecting) {
			return;
		}

		// Initialize audio context on first user interaction
		if (!playbackAudioContextRef.current) {
			initPlaybackAudioContext();
		}

		try {
			setIsConnecting(true);
			setMicStatus('Connecting...');

			wsRef.current = new WebSocket(voice_agent_api_US);

			wsRef.current.onopen = () => {
				wsRef.current.send(
					JSON.stringify({
						session_id: sessionId,
						workspace_name: workspaceId,
						token: token,
						location: {
							countryCode: 'IN',
							countryRegion: 'Telangana',
							country: 'India',
							city: 'Hyderabad',
							timezone: 'Asia/Kolkata',
							postalCode: '500003',
							currency: 'INR',
							region: 'us-east-1',
						},
						workflow_slug: null,
						module: null,
						web_search: true,
						knowledge_base_search: true,
						deep_research: false,
						is_voice_enabled: true,
					}),
				);
			};

			wsRef.current.onclose = (event) => {
				setIsConnected(false);
				setIsConnecting(false);
				setIsRecording(false);
				isRecordingRef.current = false;
				setMicStatus('Click to start');
			};

			wsRef.current.onerror = (error) => {
				setIsConnected(false);
				setIsConnecting(false);
				setMicStatus('Connection failed');
			};

			wsRef.current.onmessage = async (event) => {
				if (event.data instanceof Blob) {
					try {
						const arrayBuffer = await event.data.arrayBuffer();

						if (arrayBuffer.byteLength === 0) {
							return;
						}

						// Buffer small audio chunks for smoother playback
						if (arrayBuffer.byteLength < MIN_BUFFER_SIZE) {
							if (!audioBufferRef.current) {
								audioBufferRef.current = new Uint8Array(arrayBuffer);
								audioBufferSizeRef.current = arrayBuffer.byteLength;
							} else {
								const newBuffer = new Uint8Array(
									audioBufferSizeRef.current + arrayBuffer.byteLength,
								);
								newBuffer.set(audioBufferRef.current, 0);
								newBuffer.set(
									new Uint8Array(arrayBuffer),
									audioBufferSizeRef.current,
								);
								audioBufferRef.current = newBuffer;
								audioBufferSizeRef.current += arrayBuffer.byteLength;
							}

							const now = Date.now();
							// Only process if we have enough data or if it's been a while
							if (
								audioBufferSizeRef.current >= MIN_BUFFER_SIZE ||
								now - lastFlushTimeRef.current > FLUSH_INTERVAL
							) {
								audioQueueRef.current.push(audioBufferRef.current.buffer);
								audioBufferRef.current = null;
								audioBufferSizeRef.current = 0;
								lastFlushTimeRef.current = now;
								processAudioQueue();
							}
						} else {
							// Process larger chunks immediately
							audioQueueRef.current.push(arrayBuffer);
							processAudioQueue();
						}
					} catch (error) {
						// Handle error silently
					}
					return;
				}

				try {
					const data = JSON.parse(event.data);

					if (data.status === 'connected') {
						setIsConnected(true);
						setIsConnecting(false);
						// Auto-start recording once connected
						setTimeout(() => {
							startRecording();
						}, 100); // Small delay to ensure state is updated
					} else if (data.response) {
						if (!isReceivingResponseRef.current) {
							isReceivingResponseRef.current = true;
							const newMessage = addMessage('', false);
							currentMessageRef.current = newMessage;
						}

						if (currentMessageRef.current) {
							const currentContent = currentMessageRef.current.content;
							updateMessage(
								currentMessageRef.current.id,
								currentContent + data.response,
							);
						}
					} else if (data.ready_for_input) {
						isReceivingResponseRef.current = false;
						currentMessageRef.current = null;

						// Process any remaining buffered audio
						if (audioBufferRef.current && audioBufferSizeRef.current > 0) {
							audioQueueRef.current.push(audioBufferRef.current.buffer);
							audioBufferRef.current = null;
							audioBufferSizeRef.current = 0;
							processAudioQueue();
						}
					} else if (data.error) {
						addMessage(`Error: ${data.error}`, false);
						if (data.error.includes('token')) {
							// Handle token error specifically
						}
						stopRecording();
						isReceivingResponseRef.current = false;
						currentMessageRef.current = null;
					}
				} catch (error) {
					// Handle error silently
				}
			};

			await new Promise((resolve, reject) => {
				const checkConnection = () => {
					if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
						resolve();
					} else if (wsRef.current && wsRef.current.readyState === WebSocket.CLOSED) {
						reject(new Error('WebSocket connection failed'));
					} else {
						setTimeout(checkConnection, 100);
					}
				};
				checkConnection();
			});
		} catch (error) {
			setMicStatus('Connection failed');
			setIsConnecting(false);
		}
	}, [
		isConnected,
		isConnecting,
		token,
		addMessage,
		updateMessage,
		startRecording,
		stopRecording,
		processAudioQueue,
		initPlaybackAudioContext,
	]);

	const disconnect = useCallback(() => {
		stopRecording();
		if (wsRef.current) {
			wsRef.current.close();
			wsRef.current = null;
		}
		setIsConnected(false);
		setIsConnecting(false);
		setMicStatus('Click to start');
	}, [stopRecording]);

	// Keep-alive mechanism to prevent server-side timeout
	useEffect(() => {
		const keepAlive = () => {
			if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
				wsRef.current.send(JSON.stringify({ type: 'ping' }));
			}
		};

		const interval = setInterval(keepAlive, 30000); // Send ping every 30 seconds
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		return () => {
			if (wsRef.current) {
				wsRef.current.close();
			}
			stopRecording();
		};
	}, [stopRecording]);

	return {
		isConnected,
		isRecording,
		isConnecting,
		messages,
		micStatus,
		addMessage,
		connectAndStart,
		disconnect,
		stopRecording,
	};
};
