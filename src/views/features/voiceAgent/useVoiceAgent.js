import { useState, useEffect, useRef, useCallback } from 'react';

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

    const addMessage = useCallback((content, isUser = false) => {
        setMessages((prev) => [...prev, { content, isUser, id: Date.now() }]);
    }, []);

    const stopRecording = useCallback(() => {
        if (isRecording) {
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

            console.log('Audio recording stopped');
        }
    }, [isRecording]);

    const startRecording = useCallback(async () => {
        if (!isConnected || isRecording) {
            console.log('Cannot start recording - not connected or already recording');
            return;
        }

        try {
            console.log('Starting audio recording...');
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
            audioProcessorRef.current = audioContextRef.current.createScriptProcessor(
                4096,
                1,
                1,
            );

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

                    console.log('Sending PCM data:', pcmData.length, 'samples');
                    wsRef.current.send(pcmData.buffer);
                }
            };

            source.connect(audioProcessorRef.current);
            audioProcessorRef.current.connect(audioContextRef.current.destination);

            setIsRecording(true);
            isRecordingRef.current = true;
            setMicStatus('Listening...');

            audioStreamRef.current = stream;

            console.log('Audio recording started');
        } catch (error) {
            console.error('Failed to start recording:', error);
            setMicStatus('Recording failed');
        }
    }, [isConnected, isRecording]);

    const toggleAction = useCallback(async () => {
        console.log('toggleAction called - isConnected:', isConnected, 'isRecording:', isRecording);
        if (!isConnected && !isConnecting) {
            // Start connection and recording
            try {
                console.log('Starting WebSocket connection...');
                setIsConnecting(true);
                setMicStatus('Connecting...');

                wsRef.current = new WebSocket('ws://958fa9e5b983.ngrok-free.app/ws');

                wsRef.current.onopen = () => {
                    console.log('WebSocket connected, sending token...');
                    wsRef.current.send(
                        JSON.stringify({
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
                            is_voice_enabled: true,
                        }),
                    );
                };

                wsRef.current.onclose = (event) => {
                    console.log('WebSocket disconnected, code:', event.code, 'reason:', event.reason);
                    setIsConnected(false);
                    setIsConnecting(false);
                    setIsRecording(false);
                    setMicStatus('Click to start');
                };

                wsRef.current.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    setIsConnected(false);
                    setIsConnecting(false);
                    setMicStatus('Connection failed');
                };

                wsRef.current.onmessage = async (event) => {
                    if (event.data instanceof Blob) {
                        try {
                            const arrayBuffer = await event.data.arrayBuffer();

                            if (arrayBuffer.byteLength === 0) {
                                console.warn('Received empty audio buffer');
                                return;
                            }

                            const audioContext = new (window.AudioContext ||
                                window.webkitAudioContext)();

                            const int16Array = new Int16Array(arrayBuffer);
                            const float32Array = new Float32Array(int16Array.length);

                            for (let i = 0; i < int16Array.length; i++) {
                                float32Array[i] = int16Array[i] / 32768.0;
                            }

                            const audioBuffer = audioContext.createBuffer(
                                1,
                                float32Array.length,
                                44100,
                            );
                            audioBuffer.getChannelData(0).set(float32Array);

                            const source = audioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(audioContext.destination);
                            source.start();

                            console.log(`Playing audio: ${int16Array.length} samples at 44100 Hz`);
                        } catch (error) {
                            console.error('Error playing audio:', error);
                        }
                        return;
                    }

                    try {
                        const data = JSON.parse(event.data);
                        console.log('Received message:', data);

                        if (data.status === 'connected') {
                            console.log('Connection successful');
                            setIsConnected(true);
                            setIsConnecting(false);
                            startRecording(); // Start recording immediately
                        } else if (data.response) {
                            console.log('Received response chunk from agent');
                            addMessage(data.response, false);
                        } else if (data.ready_for_input) {
                            console.log('Ready for input - response complete');
                        } else if (data.error) {
                            console.error('Received error:', data.error);
                            addMessage(`Error: ${data.error}`, false);
                            stopRecording();
                        }
                    } catch (error) {
                        console.error('Error parsing JSON message:', error);
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

                console.log('Connection established successfully');
            } catch (error) {
                console.error('Failed to start connection:', error);
                setMicStatus('Connection failed');
                setIsConnecting(false);
            }
        } else {
            // Stop connection and recording
            console.log('Stopping WebSocket and recording...');
            stopRecording();
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
            setIsConnected(false);
            setMicStatus('Click to start');
            console.log('WebSocket and recording stopped');
        }
    }, [isConnected, isConnecting, isRecording, token, addMessage, startRecording, stopRecording]);

    const disconnect = useCallback(() => {
        console.log('Disconnecting WebSocket...');
        stopRecording();
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setIsConnected(false);
        setMicStatus('Click to start');
        console.log('WebSocket disconnected');
    }, [stopRecording]);

    // Keep-alive mechanism to prevent server-side timeout
    useEffect(() => {
        const keepAlive = () => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(JSON.stringify({ type: 'ping' }));
                console.log('Sent keep-alive ping');
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
        toggleAction,
        disconnect,
        stopRecording,
    };
};