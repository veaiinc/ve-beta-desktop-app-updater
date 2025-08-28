import { useState, useEffect, useRef, useCallback } from 'react';
import { message } from 'antd';
import '../../../assets/scss/noteTranscription/note-transcription.scss';
import Waveform from '../../../assets/svg/note-transcription.gif';
import { ReactComponent as Mic } from '../../../assets/svg/microphone.svg';
import { ReactComponent as MuteMic } from '../../../assets/svg/ai_agents/mutemic.svg';
import { ReactComponent as Close } from '../../../assets/svg/ai_agents/close.svg';
import { meeting_ws_api_US } from '../../../services/config.live';

export default function AssemblyTranscription({
	onTranscriptionUpdate,
	onLiveIntelligenceResponse,
	tenantId,
	sessionId,
	meetingId,
	userName,
	location,
	timezone = 'Asia/Kolkata',
	wsUrl = meeting_ws_api_US,
	jwtToken,
	isAiIntelligenceEnabled,
}) {
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

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
			disconnect();
		};
	}, []);

	const log = useCallback((message) => {
		console.log(`[AssemblyTranscription] ${message}`);
	}, []);

	const updateStatus = useCallback(
		(status, className) => {
			setConnectionStatus(className);
			log(`Status: ${status}`);
		},
		[log],
	);

	const connect = useCallback(async () => {
		if (!jwtToken || !tenantId || !sessionId || !meetingId || !userName) {
			message.error('Missing required authentication parameters');
			return false;
		}

		try {
			const ws = new WebSocket(wsUrl + `/${meetingId}?token=${jwtToken}`);
			websocketRef.current = ws;

			return new Promise((resolve, reject) => {
				ws.onopen = () => {
					log('WebSocket connected, sending authentication...');
					updateStatus('Connected', 'connected');
					setIsConnected(true);

					const authData = {
						token: jwtToken,
						tenant_id: tenantId,
						session_id: sessionId,
						meeting_id: meetingId,
						userName: userName,
						location: location || {
							countryCode: 'IN',
							countryRegionCode: 'TS',
							countryRegion: 'Telangana',
							country: 'India',
							city: 'Hyderabad',
							timezone: 'Asia/Kolkata',
							postalCode: '500003',
							currency: 'INR',
							region: 'ap-south-1',
						},
						timezone: timezone,
						is_ai_intelligence_enabled: isAiIntelligenceEnabled,
					};

					ws.send(JSON.stringify(authData));
				};

				ws.onmessage = (event) => {
					if (!isMountedRef.current) return;

					try {
						const data = JSON.parse(event.data);

						if (data.type === 'connect') {
							log('Successfully authenticated and connected to STT service');
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
								console.log('this is a response', transcriptionData);

								if (onTranscriptionUpdate) {
									onTranscriptionUpdate(transcriptionData);
								}

								log(
									`Transcription: ${data.text} (Final: ${transcriptionData.isFinal})`,
								);
							}
						} else if (data.type === 'error') {
							log(`Error: ${data.message}`);
							message.error(data.message);
						} else {
							// Handle live intelligence or other responses
							if (onLiveIntelligenceResponse) {
								console.log(data?.data, 'from live ig');

								onLiveIntelligenceResponse(data?.data);
							}
							log(`Live Intelligence response: ${JSON.stringify(data)}`);
						}
					} catch (error) {
						log(`Error parsing message: ${error.message}`);
					}
				};

				ws.onclose = () => {
					log('WebSocket disconnected');
					updateStatus('Disconnected', 'disconnected');
					setIsConnected(false);
					stopRecording();
					reject(new Error('WebSocket disconnected'));
				};

				ws.onerror = (error) => {
					log(`WebSocket error: ${error}`);
					updateStatus('Error', 'error');
					reject(error);
				};
			});
		} catch (error) {
			log(`Connection error: ${error.message}`);
			message.error('Failed to connect to transcription service');
			return false;
		}
	}, [
		jwtToken,
		tenantId,
		sessionId,
		meetingId,
		userName,
		location,
		timezone,
		wsUrl,
		onTranscriptionUpdate,
		onLiveIntelligenceResponse,
		log,
		updateStatus,
	]);

	const disconnect = useCallback(() => {
		if (websocketRef.current) {
			websocketRef.current.close();
			websocketRef.current = null;
		}
		setIsConnected(false);
		stopRecording();
	}, []);

	const startRecording = useCallback(async () => {
		if (!websocketRef.current) {
			const connected = await connect();

			if (!connected) {
				return;
			}
		}

		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					sampleRate: 16000,
					channelCount: 1,
					echoCancellation: true,
					noiseSuppression: true,
				},
			});

			streamRef.current = stream;

			const audioContext = new (window.AudioContext || window.webkitAudioContext)({
				sampleRate: 16000,
			});
			audioContextRef.current = audioContext;

			const source = audioContext.createMediaStreamSource(stream);
			sourceRef.current = source;

			const processor = audioContext.createScriptProcessor(4096, 1, 1);
			processorRef.current = processor;

			audioBufferRef.current = [];
			sampleCountRef.current = 0;

			processor.onaudioprocess = (e) => {
				if (!isMountedRef.current || isMuted) return;

				if (
					// isRecording &&
					// websocketRef.current &&
					// websocketRef.current.readyState === WebSocket.OPEN
					true
				) {
					const inputData = e.inputBuffer.getChannelData(0);

					for (let i = 0; i < inputData.length; i++) {
						audioBufferRef.current.push(inputData[i]);
					}

					sampleCountRef.current += inputData.length;

					if (sampleCountRef.current >= 8000) {
						const audioData = new Int16Array(audioBufferRef.current.length);

						for (let i = 0; i < audioBufferRef.current.length; i++) {
							audioData[i] = Math.max(
								-32768,
								Math.min(32767, audioBufferRef.current[i] * 32768),
							);
						}

						const base64Audio = btoa(
							String.fromCharCode(...new Uint8Array(audioData.buffer)),
						);

						const audioMessage = {
							type: 'audio_data',
							data: {
								audio_data: base64Audio,
								sample_rate: 16000,
							},
						};

						websocketRef.current.send(JSON.stringify(audioMessage));

						audioBufferRef.current = [];
						sampleCountRef.current = 0;
					}
				}
			};

			source.connect(processor);
			processor.connect(audioContext.destination);

			setIsRecording(true);
			console.log('getting here on button click');

			setTimer(0);

			// Start timer
			timerIntervalRef.current = setInterval(() => {
				if (!isMuted) {
					setTimer((prev) => prev + 1);
				}
			}, 1000);

			log('Started real-time recording');
		} catch (error) {
			log(`Recording error: ${error.message}`);
			message.error('Failed to start recording');
		}
	}, [connect, isRecording, isMuted, log]);

	const stopRecording = useCallback(() => {
		setIsRecording(false);
		setTimer(0);

		if (timerIntervalRef.current) {
			clearInterval(timerIntervalRef.current);
			timerIntervalRef.current = null;
		}

		if (processorRef.current) {
			processorRef.current.disconnect();
			processorRef.current = null;
		}

		if (sourceRef.current) {
			sourceRef.current.disconnect();
			sourceRef.current = null;
		}

		if (audioContextRef.current) {
			audioContextRef.current.close();
			audioContextRef.current = null;
		}

		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}

		audioBufferRef.current = [];
		sampleCountRef.current = 0;

		log('Stopped recording');
	}, [log]);

	const toggleMute = useCallback(() => {
		setIsMuted((prev) => !prev);
		if (timerIntervalRef.current) {
			if (!isMuted) {
				clearInterval(timerIntervalRef.current);
				timerIntervalRef.current = null;
			} else {
				timerIntervalRef.current = setInterval(() => {
					setTimer((prev) => prev + 1);
				}, 1000);
			}
		}
	}, [isMuted]);

	const formatTime = (seconds) => {
		const m = Math.floor(seconds / 60)
			.toString()
			.padStart(1, '0');
		const s = (seconds % 60).toString().padStart(2, '0');
		return `${m}:${s}`;
	};

	return (
		<div className="note-transcription">
			<div className="transcription-bar">
				<span className="transcription-timer">
					{isRecording ? formatTime(timer) : '0:00'}
				</span>
				<span className="transcription-waveform">
					{isRecording ? (
						isMuted ? (
							<div className="straight-line"></div>
						) : (
							<img src={Waveform} alt="Waveform" />
						)
					) : (
						<div className="transcription-waveform-placeholder">
							<span className="transcription-waveform-placeholder-text">
								Start recording
							</span>
						</div>
					)}
				</span>
				{isRecording ? (
					<>
						<button className="transcription-btn stop" onClick={stopRecording}>
							<Close />
						</button>
						<button
							className={`transcription-btn mic ${isMuted ? 'muted' : ''}`}
							onClick={toggleMute}
						>
							{isMuted ? <MuteMic /> : <Mic />}
						</button>
					</>
				) : (
					<button
						className="transcription-btn mic"
						onClick={startRecording}
						disabled={!isConnected && connectionStatus === 'error'}
					>
						<Mic />
					</button>
				)}
			</div>
		</div>
	);
}
