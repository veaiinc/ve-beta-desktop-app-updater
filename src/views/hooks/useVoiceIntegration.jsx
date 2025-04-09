import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Room, RoomEvent, createLocalTracks } from 'livekit-client';
import Context from '../../context/context';
import { message } from '../components/globalComponents/CustomToast';

const getPermissions = () => {
	return navigator.mediaDevices
		.getUserMedia({ audio: true })
		.then((stream) => {
			// Successfully got microphone access
			console.log('Microphone access granted');
			stream.getTracks().forEach((track) => track.stop()); // Clean up the stream
			return true;
		})
		.catch((error) => {
			console.error('Error accessing microphone: ', error);
			return false;
		});
};

export const useVoiceIntegration = () => {
	let {
		aiSetup: { getTokenForVoice, updateAiSetupState },
	} = useContext(Context);
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

	//useEffects

	// Audio level monitoring
	useEffect(() => {
		if (!isConnected) return;
		startMonitoring();

		return () => {
			if (audioMonitorRef.current) {
				clearInterval(audioMonitorRef.current);
				audioMonitorRef.current = null;
			}
		};
	}, [isConnected]);

	// Connection state monitoring
	useEffect(() => {
		const room = roomRef.current;
		if (!room) return;

		room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
		room.on(RoomEvent.MediaDevicesError, handleError);
		room.on(RoomEvent.ConnectionError, handleError);

		return () => {
			room.off(RoomEvent.ConnectionStateChanged, handleConnectionStateChanged);
			room.off(RoomEvent.MediaDevicesError, handleError);
			room.off(RoomEvent.ConnectionError, handleError);
		};
	}, [roomRef]);

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

	const startMonitoring = useCallback(() => {
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
	}, [roomRef]);

	const handleReconnect = useCallback(() => {
		if (reconnectAttempt >= maxReconnectAttempts) {
			console.log('Max reconnection attempts reached');
			setIsConnected(false);
			setReconnectAttempt(0);
			return;
		}

		console.log(`Attempting reconnect (${reconnectAttempt + 1}/${maxReconnectAttempts})`);

		setReconnectAttempt((prev) => prev + 1);

		// Clear any existing reconnect timeout before setting a new one
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
		}

		reconnectTimeoutRef.current = setTimeout(async () => {
			try {
				await connectToRoom();
			} catch (error) {
				console.error('Reconnect attempt failed:', error);
			}
		}, 2000);
	}, [reconnectAttempt, maxReconnectAttempts, setIsConnected, setReconnectAttempt]);

	const handleConnectionStateChanged = useCallback(
		(state) => {
			console.log('Connection state changed:', state);
			if (state === 'disconnected') {
				handleReconnect();
			}
		},
		[handleReconnect],
	);

	const handleError = useCallback(
		(error) => {
			console.error('Room error:', error);
			if (error.message.includes('ICE') || error.message.includes('connection')) {
				handleReconnect();
			}
		},
		[handleReconnect],
	);

	const connectToRoom = useCallback(async () => {
		if (isConnected) {
			console.log('Already connected to room');
			return;
		}
		// Get permissions first
		const hasPermission = await getPermissions();
		if (!hasPermission) {
			message.error('Please Provide Microphone permission ');
			return;
		}

		try {
			console.log('Starting connection process...');

			const room = roomRef.current;

			// Ensure any previous connection is cleaned up
			if (room?.state !== 'disconnected') {
				await room.disconnect();
			}

			const { token, room_name: roomName } = await getTokenForVoice();

			// Remove old event listeners before adding new ones
			room.removeAllListeners();

			// ======= Set up event handlers =======
			room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
				console.log('Track subscribed:', track.kind, 'from:', participant.identity);
				if (track.kind === 'audio') {
					const audioEl = track.attach();
					audioEl.style.display = 'none';
					document.body.appendChild(audioEl);
				}
			});

			room.on(RoomEvent.TrackUnsubscribed, (track) => {
				track?.detach()?.forEach((element) => element.remove());
			});

			room.on(RoomEvent.LocalTrackPublished, async (publication) => {
				console.log('Local track published:', publication.trackSid);
				if (publication.source === 'microphone' && publication.track) {
					try {
						const { KrispNoiseFilter, isKrispNoiseFilterSupported } = await import(
							'@livekit/krisp-noise-filter'
						);
						if (!isKrispNoiseFilterSupported()) {
							console.warn('Krisp noise filter is not supported on this browser.');
							return;
						}
						const krispProcessor = KrispNoiseFilter();
						console.log('Enabling Krisp noise filter...');
						await publication.track.setProcessor(krispProcessor);
						await krispProcessor.setEnabled(isNoiseFilterEnabled);
						krispProcessorRef.current = krispProcessor;
					} catch (err) {
						console.error('Error enabling Krisp noise filter:', err);
					}
				}
			});

			room.on(RoomEvent.TrackPublished, (publication, participant) => {
				console.log(
					'Remote track published:',
					publication.trackSid,
					'from:',
					participant.identity,
				);
				if (publication.kind === 'audio') {
					publication.setSubscribed(true);
				}
			});

			// ======= Connect to LiveKit Server =======
			console.log('Connecting to LiveKit server...');
			await room.connect('wss://veai-naymm7ww.livekit.cloud', token, { autoSubscribe: true });

			// ======= Create and Publish Audio Track =======
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

			// ======= Setup AudioContext (Needed for Noise Filtering) =======
			const audioContext = new AudioContext();
			await audioTrack.setAudioContext(audioContext);

			audioTrack.on('audiosilencedetected', () => console.log('Audio silence detected'));
			audioTrack.on(
				'audiolevelchanged',
				(level) => level > 0.05 && console.log('Audio level changed:', level),
			);

			console.log('Publishing audio track...');
			await room.localParticipant.publishTrack(audioTrack, {
				name: 'user_audio',
				source: 'microphone',
				encodings: [{ maxBitrate: 48000, priority: 'high' }],
			});

			// ======= Update State After Successful Connection =======

			setIsConnected(true);
			//also update the state of the room in the context
			updateAiSetupState({ isVoiceIntegrationActive: true });
			setReconnectAttempt(0);
			console.log('Successfully connected to room:', roomName);
		} catch (error) {
			console.error('Connection error:', error);
			setIsConnected(false);

			try {
				await roomRef.current?.disconnect();
			} catch (e) {
				console.error('Cleanup error:', e);
			}

			handleReconnect();
		}
	}, [isConnected, setIsConnected, setReconnectAttempt, handleReconnect]);

	const toggleMute = () => {
		if (!isConnected) {
			console.log('Not connected to room');
			return;
		}

		try {
			const participant = roomRef?.current?.localParticipant;
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

	const disconnect = useCallback(async () => {
		try {
			if (!roomRef.current) {
				console.warn('No active room to disconnect.');
				return;
			}

			await roomRef.current.disconnect();

			setIsConnected(false);
			//also update the state of the room in the context
			updateAiSetupState({ isVoiceIntegrationActive: null });
			setReconnectAttempt(0);
			console.log('Disconnected from room');
		} catch (error) {
			console.error('Error disconnecting:', error);
		}
	}, [setIsConnected, setReconnectAttempt]);

	const toggleKrispNoiseFilter = useCallback(async () => {
		if (!krispProcessorRef.current) {
			console.warn('Krisp processor is not initialized');
			return;
		}

		try {
			setIsNoiseFilterEnabled((prev) => {
				const newState = !prev;
				krispProcessorRef.current.setEnabled(newState);
				console.log(`Krisp noise filter ${newState ? 'enabled' : 'disabled'}`);
				return newState;
			});
		} catch (error) {
			console.error('Error toggling Krisp noise filter:', error);
		}
	}, [krispProcessorRef]);

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
