import React, { memo, useEffect, useRef, useState } from 'react';
import { Room, RoomEvent, createLocalTracks } from 'livekit-client';

export const useVoiceIntegration = () => {
	const roomRef = useRef(
		new Room({
			adaptiveStream: true,
			dynacast: true,
			stopMicTrackOnMute: true,
			audioCaptureDefaults: {
				echoCancellation: true,
				noiseSuppression: true,
				autoGainControl: true,
				sampleRate: 16000,
				channelCount: 1,
			},
		}),
	);
	const [isMuted, setIsMuted] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [audioLevel, setAudioLevel] = useState(0);
	const audioMonitorRef = useRef(null);
	const reconnectTimeoutRef = useRef(null);
	const maxReconnectAttempts = 3;
	const [reconnectAttempt, setReconnectAttempt] = useState(0);
	const krispProcessorRef = useRef(null);
	const [isNoiseFilterEnabled, setIsNoiseFilterEnabled] = useState(true);

	// Audio level monitoring
	useEffect(() => {
		if (!isConnected) return;

		const startMonitoring = () => {
			if (audioMonitorRef.current) {
				clearInterval(audioMonitorRef.current);
			}

			audioMonitorRef.current = setInterval(() => {
				try {
					const room = roomRef.current;
					const participant = room?.localParticipant;
					const audioTracks = participant?.audioTracks;

					if (!participant || !audioTracks) {
						return;
					}

					const trackPublications = Array.from(audioTracks.values());
					if (trackPublications.length === 0) {
						return;
					}

					const publication = trackPublications[0];
					if (publication?.track) {
						const level = publication.track.getCurrentLevel();
						setAudioLevel(level);
						if (level > 0.05) {
							console.log('Audio level:', level);
						}
					}
				} catch (error) {
					console.error('Error monitoring audio:', error);
				}
			}, 100);
		};

		const initTimer = setTimeout(() => {
			startMonitoring();
		}, 1000);

		return () => {
			if (audioMonitorRef.current) {
				clearInterval(audioMonitorRef.current);
				audioMonitorRef.current = null;
			}
			if (initTimer) {
				clearTimeout(initTimer);
			}
		};
	}, [isConnected]);

	// Connection state monitoring
	useEffect(() => {
		const room = roomRef.current;

		const handleConnectionStateChanged = (state) => {
			console.log('Connection state changed:', state);
			if (state === 'disconnected' && isConnected) {
				handleReconnect();
			}
		};

		const handleError = async (error) => {
			console.error('Room error:', error);
			if (error.message.includes('ICE') || error.message.includes('connection')) {
				handleReconnect();
			}
		};

		room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
		room.on(RoomEvent.MediaDevicesError, handleError);
		room.on(RoomEvent.ConnectionError, handleError);

		return () => {
			room.off(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
			room.off(RoomEvent.MediaDevicesError, handleError);
			room.off(RoomEvent.ConnectionError, handleError);
		};
	}, [isConnected]);

	// Room cleanup
	useEffect(() => {
		return () => {
			if (audioMonitorRef.current) {
				clearInterval(audioMonitorRef.current);
			}
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
			}
			if (roomRef.current) {
				roomRef.current.disconnect();
			}
		};
	}, []);

	const handleReconnect = () => {
		if (reconnectAttempt >= maxReconnectAttempts) {
			console.log('Max reconnection attempts reached');
			setIsConnected(false);
			setReconnectAttempt(0);
			return;
		}

		console.log(`Attempting reconnect (${reconnectAttempt + 1}/${maxReconnectAttempts})`);
		setReconnectAttempt((prev) => prev + 1);

		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
		}

		reconnectTimeoutRef.current = setTimeout(() => {
			connectToRoom();
		}, 2000);
	};

	const getToken = async () => {
		try {
			const roomName = `test_room_${Math.floor(Math.random() * 1000)}`;
			const usertoken = localStorage.getItem('usertoken');
			console.log('Generating token for room:', roomName);

			const response = await fetch(
				'https://ai.ap-south-1.ve.ai/myphotos/generate-livekit-token',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${usertoken}`,
					},
					body: {},
				},
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log('Token received successfully');
			return {
				token: data.token,
				roomName: roomName,
			};
		} catch (error) {
			console.error('Error fetching token:', error);
			throw error;
		}
	};

	const connectToRoom = async () => {
		if (isConnected) {
			console.log('Already connected to room');
			return;
		}

		try {
			console.log('Starting connection process...');
			const room = roomRef.current;

			if (room.state !== 'disconnected') {
				await room.disconnect();
			}

			const { token, roomName } = await getToken();

			// Set up event handlers
			room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
				console.log(
					'Track subscribed:',
					track.kind,
					'from participant:',
					participant.identity,
				);
				if (track.kind === 'audio') {
					const audioEl = track.attach();
					audioEl.style.display = 'none';
					document.body.appendChild(audioEl);
					console.log('Attached audio track to element');
				}
			});

			room.on(RoomEvent.TrackUnsubscribed, (track) => {
				track?.detach()?.forEach((element) => {
					element.remove();
					console.log('Detached and removed audio element');
				});
			});

			room.on(RoomEvent.LocalTrackPublished, async (publication) => {
				console.log('Local track published:', publication.trackSid);
				// Only attach Krisp noise filter for microphone tracks
				if (publication.source === 'microphone' && publication.track) {
					try {
						const { KrispNoiseFilter, isKrispNoiseFilterSupported } = await import(
							'@livekit/krisp-noise-filter'
						);
						if (!isKrispNoiseFilterSupported()) {
							console.warn('Krisp noise filter is not supported on this browser.');
							return;
						}
						const krispProcessor = KrispNoiseFilter(); // instantiate processor
						console.log('Enabling Krisp noise filter for published track');
						// Attach the processor to the published track
						await publication.track.setProcessor(krispProcessor);
						await krispProcessor.setEnabled(isNoiseFilterEnabled);
						krispProcessorRef.current = krispProcessor; // store processor for later toggling
					} catch (err) {
						console.error('Error enabling Krisp noise filter on published track', err);
					}
				}
			});

			room.on(RoomEvent.TrackPublished, (publication, participant) => {
				console.log(
					'Remote track published:',
					publication.trackSid,
					'from',
					participant.identity,
				);
				if (publication.kind === 'audio') {
					publication.setSubscribed(true);
				}
			});

			// Connect to room
			console.log('Connecting to LiveKit server...');
			await room.connect('wss://veai-naymm7ww.livekit.cloud', token, {
				autoSubscribe: true,
			});

			// Create and publish audio track
			console.log('Creating local audio track...');
			const [audioTrack] = await createLocalTracks({
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true,
					sampleRate: 16000,
					channelCount: 1,
				},
				video: false,
			});

			console.log('Local audio track created:', audioTrack);

			// ===== Set up AudioContext required for enabling processors =====
			const audioContext = new AudioContext();
			await audioTrack.setAudioContext(audioContext);

			audioTrack.on('audiosilencedetected', () => {
				console.log('Audio silence detected');
			});

			audioTrack.on('audiolevelchanged', (level) => {
				if (level > 0.05) {
					console.log('Audio level changed:', level);
				}
			});

			console.log('Publishing audio track...');
			await room.localParticipant.publishTrack(audioTrack, {
				name: 'user_audio',
				source: 'microphone',
				encodings: [
					{
						maxBitrate: 48000,
						priority: 'high',
					},
				],
			});

			setIsConnected(true);
			setReconnectAttempt(0);
			console.log('Successfully connected to room:', roomName);
		} catch (error) {
			console.error('Connection error:', error);
			setIsConnected(false);
			try {
				await roomRef.current.disconnect();
			} catch (e) {
				console.error('Cleanup error:', e);
			}
			handleReconnect();
		}
	};

	const toggleMute = () => {
		if (!isConnected) {
			console.log('Not connected to room');
			return;
		}

		try {
			const participant = roomRef.current.localParticipant;
			if (participant) {
				participant?.audioTracks?.forEach((publication) => {
					if (publication?.track) {
						publication?.track?.setEnabled(!isMuted);
						console.log(isMuted ? 'Unmuting' : 'Muting', 'audio');
					}
				});
				setIsMuted(!isMuted);
			}
		} catch (error) {
			console.error('Error toggling mute:', error);
		}
	};

	const disconnect = async () => {
		try {
			await roomRef.current.disconnect();
			setIsConnected(false);
			setReconnectAttempt(0);
			console.log('Disconnected from room');
		} catch (error) {
			console.error('Error disconnecting:', error);
		}
	};

	const toggleKrispNoiseFilter = async () => {
		if (krispProcessorRef.current) {
			const newState = !isNoiseFilterEnabled;
			try {
				await krispProcessorRef.current.setEnabled(newState);
				setIsNoiseFilterEnabled(newState);
				console.log(`Krisp noise filter ${newState ? 'enabled' : 'disabled'}`);
			} catch (e) {
				console.error('Error toggling Krisp noise filter', e);
			}
		} else {
			console.warn('Krisp processor is not initialized');
		}
	};

	return {
		isConnected,
		isMuted,
		audioLevel,
		isNoiseFilterEnabled,
		connectToRoom,
		disconnect,
		toggleMute,
		toggleKrispNoiseFilter,
	};
};

export default useVoiceIntegration;
