import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Room, RoomEvent, createLocalTracks } from 'livekit-client';
import Context from '../context/context';
import { message } from '../views/components/globalComponents/CustomToast';

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
			console.log('🎤 Starting voice connection process...');

			const room = roomRef.current;

			// Ensure any previous connection is cleaned up
			if (room?.state !== 'disconnected') {
				await room.disconnect();
			}

			// Get location from localStorage first, fallback to India location
			let location = JSON.parse(localStorage.getItem('location') || '{}');
			
			// If no location in localStorage, use the India location as fallback
			if (!location || Object.keys(location).length === 0) {
				location = {
					"countryCode": "IN",
					"countryRegionCode": "TS", 
					"countryRegion": "Telangana",
					"country": "India",
					"city": "Hyderabad",
					"timezone": "Asia/Kolkata",
					"postalCode": "500009",
					"currency": "INR",
					"region": "ap-south-1"
				};
			}
			
			console.log('🌍 Using location data:', location);
			
			console.log('🔑 Generating voice token...');
			const tokenResponse = await getTokenForVoice({ location });
			console.log('🔍 Raw token response:', tokenResponse);
			console.log('🔍 Available fields in response:', Object.keys(tokenResponse || {}));
			console.log('🔍 Response type:', typeof tokenResponse);
			
			// Log each possible token field
			console.log('🔍 Checking token fields:');
			console.log('  - tokenResponse.token:', tokenResponse?.token);
			console.log('  - tokenResponse.access_token:', tokenResponse?.access_token);
			console.log('  - tokenResponse.accessToken:', tokenResponse?.accessToken);
			console.log('  - tokenResponse.jwt:', tokenResponse?.jwt);
			console.log('  - tokenResponse.authToken:', tokenResponse?.authToken);
			
			// Extract token and room name from response - check session_info first
			const sessionInfo = tokenResponse?.session_info || tokenResponse;
			console.log('🔍 Session info:', sessionInfo);
			console.log('🔍 Session info fields:', Object.keys(sessionInfo || {}));
			
			const token = sessionInfo?.user_token ||  // ← This is the correct field!
						 sessionInfo?.token || 
						 sessionInfo?.access_token || 
						 sessionInfo?.accessToken ||
						 sessionInfo?.jwt ||
						 sessionInfo?.authToken ||
						 tokenResponse?.token || 
						 tokenResponse?.access_token;
						 
			const roomName = sessionInfo?.room_name || 
							sessionInfo?.roomName || 
							sessionInfo?.room ||
							sessionInfo?.roomId ||
							sessionInfo?.session ||
							sessionInfo?.sessionId ||
							tokenResponse?.room_name || 
							tokenResponse?.roomName;
			
			// Also extract the LiveKit URL from session_info
			const liveKitUrl = sessionInfo?.url;
			
			console.log('🔍 Extracted values:');
			console.log('  - token (user_token):', token ? `${token.substring(0, 50)}...` : 'undefined');
			console.log('  - roomName:', roomName);
			console.log('  - liveKitUrl:', liveKitUrl);
			
			console.log('✅ Voice token generated successfully:', { 
				roomName, 
				tokenLength: token?.length,
				hasToken: !!token,
				hasRoomName: !!roomName
			});
			
			if (!token) {
				throw new Error('No token received from API response');
			}

			// Skip regions API for now - use URL from session_info directly

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

			// ======= Handle Data Messages (Transcriptions) =======
			room.on(RoomEvent.DataReceived, (payload, participant, topic) => {
				try {
					const decoder = new TextDecoder();
					const message = decoder.decode(payload);
					const data = JSON.parse(message);
					
					console.log('📝 Data received from voice agent:', data);
					
					// Handle different types of data messages
					if (data.type === 'transcription' || data.type === 'agent_response') {
						const messageData = {
							sender: participant?.identity === 'agent' ? 'AI Agent' : 'User',
							content: data.text || data.message || data.content,
							isFromAgent: participant?.identity === 'agent',
							timestamp: new Date().toISOString()
						};
						
						// Send to NotchDrop
						if (window.electronApi) {
							window.electronApi.notchdrop.addVoiceMessage(messageData);
						}
						
						// Dispatch custom event for other components
						window.dispatchEvent(new CustomEvent('voice-transcription', {
							detail: messageData
						}));
					}
				} catch (error) {
					console.error('❌ Error parsing data message:', error);
				}
			});

			// ======= Connect to LiveKit Server =======
			const connectUrl = liveKitUrl || 'wss://ve-ai-voice-agent-ginreaey.livekit.cloud';
			console.log('🔌 Connecting to LiveKit server:', connectUrl);
			await room.connect(connectUrl, token, { autoSubscribe: true });

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
			console.error('❌ Voice connection error:', error);
			console.error('❌ Error details:', {
				message: error.message,
				stack: error.stack,
				name: error.name
			});
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

			console.log('🔌 Disconnecting voice agent - stopping all tracks...');
			
			// Stop all local audio tracks explicitly
			const participant = roomRef.current.localParticipant;
			if (participant) {
				console.log('🎤 Stopping local audio tracks...');
				
				// audioTracks is a Map, so we need to iterate over its values
				if (participant.audioTracks && participant.audioTracks.size > 0) {
					participant.audioTracks.forEach((publication) => {
						if (publication && publication.track) {
							console.log('🛑 Stopping audio track:', publication.trackSid);
							publication.track.stop();
							publication.unpublish();
						}
					});
				} else {
					console.log('📝 No audio tracks to stop');
				}
				
				// Also stop any video tracks if they exist
				if (participant.videoTracks && participant.videoTracks.size > 0) {
					participant.videoTracks.forEach((publication) => {
						if (publication && publication.track) {
							console.log('🛑 Stopping video track:', publication.trackSid);
							publication.track.stop();
							publication.unpublish();
						}
					});
				} else {
					console.log('📝 No video tracks to stop');
				}
			}

			// Disconnect from the room
			await roomRef.current.disconnect();

			setIsConnected(false);
			//also update the state of the room in the context
			updateAiSetupState({ isVoiceIntegrationActive: null });
			setReconnectAttempt(0);
			console.log('✅ Fully disconnected from room - microphone stopped');
		} catch (error) {
			console.error('❌ Error disconnecting:', error);
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
