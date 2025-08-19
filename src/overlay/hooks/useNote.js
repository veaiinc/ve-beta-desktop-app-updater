import { useEffect, useRef, useState, useCallback } from 'react';
import { Room, createLocalTracks, RoomEvent } from 'livekit-client';
import { requestMicrophonePermission } from '../utils/permissionUtils';

export default function useNote({ wsUrl, token, isRecording }) {
	const roomRef = useRef(null);
	const desiredMutedRef = useRef(false); // Track user's mute preference
	const [isConnected, setIsConnected] = useState(false);
	const audioTrackRef = useRef(null);
	const [localAudioTrack, setLocalAudioTrack] = useState(null); // Expose audio track
	const [localParticipant, setLocalParticipant] = useState(null); // Expose local participant
	const [isMuted, setIsMuted] = useState(false);
	const [isPublished, setIsPublished] = useState(false); // Track publish status
	const isConnectingRef = useRef(false);
	const reconnectAttemptsRef = useRef(0);
	const isIntentionalDisconnectRef = useRef(false); // Track intentional disconnects
	const maxReconnectAttempts = 5;

	const connect = useCallback(async () => {
		try {
			// Only connect if recording is active
			if (!isRecording) {
				return;
			}

			if (isConnected || isConnectingRef.current) {
				return;
			}

			if (!token) {
				console.error('Cannot connect to LiveKit: Token is not available');
				return;
			}

			// Request microphone permission explicitly before connecting
			const permissionResult = await requestMicrophonePermission({
				audio: {
					sampleRate: 16000,
					channelCount: 1,
					echoCancellation: true,
					noiseSuppression: true,
					autoGainControl: true,
				}
			});
			
			if (!permissionResult.success) {
				throw new Error(permissionResult.message);
			}

			isConnectingRef.current = true;
			try {
				if (roomRef.current) {
					isIntentionalDisconnectRef.current = true; // Mark as intentional
					roomRef.current.disconnect();
					roomRef.current = null;
				}

				const room = new Room({ adaptiveStream: true, dynacast: true });
				roomRef.current = room;

				room.on(RoomEvent.ConnectionStateChanged, (state) => {
					setIsConnected(state === 'connected');
					if (
						state === 'disconnected' &&
						!isConnectingRef.current &&
						!isIntentionalDisconnectRef.current
					) {
						if (reconnectAttemptsRef.current < maxReconnectAttempts && isRecording) {
							reconnectAttemptsRef.current += 1;
							setTimeout(connect, 1000 * reconnectAttemptsRef.current); // Exponential backoff
						} else {
							console.error(
								'Max reconnect attempts reached or recording stopped. Giving up.',
							);
							setIsConnected(false);
						}
					} else if (state === 'connected') {
						reconnectAttemptsRef.current = 0; // Reset on successful connection
						isIntentionalDisconnectRef.current = false; // Reset on connect
					}
				});

				room.on(RoomEvent.Disconnected, (reason) => {
					// Disconnected from LiveKit
				});

				room.on(RoomEvent.Reconnecting, () => {
					// Reconnecting to LiveKit
				});

				room.on(RoomEvent.Reconnected, () => {
					setIsConnected(true);
				});

				room.on(RoomEvent.ConnectionError, (e) => {
					console.error('Connection error:', e);
					setIsConnected(false);
					isConnectingRef.current = false;
				});

				room.on(RoomEvent.MediaDevicesError, (e) => {
					console.error('Media error:', e);
				});

				room.on(RoomEvent.LocalNetworkQualityChanged, (quality) => {
					// Network quality monitoring
				});

				room.on(RoomEvent.RemoteNetworkQualityChanged, (quality, participant) => {
					// Remote network quality monitoring
				});

				room.on(RoomEvent.DataReceived, (payload, participant, topic) => {
					// console.log('Transcription data received from LiveKit:', {
					// 	participant: participant.identity,
					// 	topic: topic,
					// 	payloadLength: payload.length,
					// });
				});

				room.on(RoomEvent.SignalConnected, () => {
					// Signal connected
				});

				room.on(RoomEvent.DCBufferStatusChanged, (status) => {
					// DCBuffer status monitoring
				});

				// Participant logging
				room.on(RoomEvent.ParticipantConnected, (participant) => {
					// console.log('Participant connected:', participant.identity);
				});

				room.on(RoomEvent.ParticipantDisconnected, (participant) => {
					// console.log('Participant disconnected:', participant.identity);
				});

				room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
					// console.log(`Track subscribed: ${track.kind} from ${participant.identity}`);
				});

				room.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
					// console.log(`Track unsubscribed: ${track.kind} from ${participant.identity}`);
				});

				// Wait for the WebRTC engine to be ready
				const waitForEngine = new Promise((resolve) => {
					room.on(RoomEvent.Connected, () => {
						resolve();
					});
				});

				console.log(
					'Connecting to LiveKit room with token:',
					token.substring(0, 50) + '...',
				);
				await room.connect(wsUrl, token, { autoSubscribe: true });

				// Set local participant
				setLocalParticipant(room.localParticipant);

				// Wait for the engine to be fully ready before publishing
				await waitForEngine;

				console.log('Creating local audio tracks...');
				const tracks = await createLocalTracks({
					audio: {
						sampleRate: 16000,
						channelCount: 1,
						echoCancellation: true,
						noiseSuppression: true,
						autoGainControl: true,
					},
					video: false,
				});
				console.log('Created tracks:', tracks.map(t => ({ kind: t.kind, enabled: t.enabled, muted: t.muted })));
				
				const audioTrack = tracks.find((t) => t.kind === 'audio');
				if (audioTrack) {
					console.log('Audio track found:', {
						sid: audioTrack.sid,
						enabled: audioTrack.enabled,
						muted: audioTrack.muted,
						source: audioTrack.source,
						mediaStreamTrack: !!audioTrack.mediaStreamTrack
					});
					audioTrackRef.current = audioTrack;
					setLocalAudioTrack(audioTrack); // Expose the audio track

					// Monitor audio activity
					if (audioTrack.mediaStreamTrack) {
						try {
							console.log('Setting up audio monitoring...');
							const audioContext = new AudioContext();
							const source = audioContext.createMediaStreamSource(
								new MediaStream([audioTrack.mediaStreamTrack]),
							);
							const analyser = audioContext.createAnalyser();
							source.connect(analyser);
							const dataArray = new Uint8Array(analyser.frequencyBinCount);
							
							const checkAudioActivity = () => {
								analyser.getByteFrequencyData(dataArray);
								const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
								
								// Log audio activity for debugging
								if (average > 0) {
									console.log('Audio activity detected, level:', average);
								}
								
								if (audioTrackRef.current && isRecording) {
									setTimeout(checkAudioActivity, 1000);
								}
							};
							checkAudioActivity();
							console.log('Audio monitoring setup complete');
						} catch (audioError) {
							console.error('Error setting up audio monitoring:', audioError);
						}
					} else {
						console.warn('No mediaStreamTrack available for audio monitoring');
					}

					// Wait for the track to be published
					const waitForPublish = new Promise((resolve, reject) => {
						room.on(RoomEvent.LocalTrackPublished, (publication) => {
							if (publication.trackSid === audioTrack.sid) {
								// console.log('Audio track successfully published to LiveKit');
								resolve();
							}
						});
						room.on(RoomEvent.LocalTrackFailed, (publication) => {
							if (publication.trackSid === audioTrack.sid) {
								console.error(
									'Local track failed to publish:',
									publication.trackSid,
								);
								reject(new Error('Local track failed to publish'));
							}
						});
					});

					// Retry publishing the track if it fails
					let attempts = 0;
					const maxAttempts = 3;
					while (attempts < maxAttempts) {
						try {
							await room.localParticipant.publishTrack(audioTrack, {
								audioBitrate: 32000,
								timeout: 15000,
							});
							await waitForPublish;
							setIsPublished(true); // Mark track as published
							break;
						} catch (err) {
							attempts += 1;
							console.warn(
								`Failed to publish audio track (attempt ${attempts}/${maxAttempts}):`,
								err,
							);
							if (attempts === maxAttempts) {
								throw err;
							}
							await new Promise((resolve) => setTimeout(resolve, 2000));
						}
					}
				}
			} catch (err) {
				console.error('LiveKit setup failed:', err);
				setIsConnected(false);
			} finally {
				isConnectingRef.current = false;
			}
		} catch (error) {
			console.error('Error in useNote connect:', error);
			setIsConnected(false);
			isConnectingRef.current = false;
		}
	}, [isConnected, token, wsUrl, isRecording]);

	const muteAudio = useCallback(() => {
		desiredMutedRef.current = true;
		if (roomRef.current?.localParticipant && localAudioTrack && isPublished) {
			roomRef.current.localParticipant.setMicrophoneEnabled(false);
			setIsMuted(true);
		}
	}, [localAudioTrack, isPublished]);

	const unmuteAudio = useCallback(() => {
		desiredMutedRef.current = false;
		if (roomRef.current?.localParticipant && localAudioTrack && isPublished) {
			roomRef.current.localParticipant.setMicrophoneEnabled(true);
			setIsMuted(false);
		}
	}, [localAudioTrack, isPublished]);

	const disconnect = useCallback(() => {
		isIntentionalDisconnectRef.current = true; // Mark as intentional
		if (roomRef.current) {
			roomRef.current.disconnect();
			roomRef.current = null;
			setIsConnected(false);
			setIsMuted(false);
			setLocalParticipant(null);
			setLocalAudioTrack(null);
			setIsPublished(false); // Reset publish status
			desiredMutedRef.current = false; // Reset mute preference
		}
		if (audioTrackRef.current) {
			audioTrackRef.current.stop();
			audioTrackRef.current = null;
		}
		isConnectingRef.current = false;
		reconnectAttemptsRef.current = 0;
	}, []);

	// Auto-connect when conditions are met
	useEffect(() => {
		if (isRecording && token && !isConnected && !isConnectingRef.current) {
			connect();
		} else if (!isRecording && isConnected) {
			disconnect();
		}
	}, [isRecording, token, isConnected, connect, disconnect]);

	useEffect(() => {
		return () => {
			disconnect();
		};
	}, [disconnect]);

	return {
		roomRef,
		connect,
		disconnect,
		isConnected,
		isMuted,
		muteAudio,
		unmuteAudio,
		localAudioTrack,
		localParticipant,
	};
}
