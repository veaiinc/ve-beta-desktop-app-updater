import { useCallback, useRef, useEffect } from 'react';
const useLiveIntelligenceStream = () => {
	const socketRef = useRef(null);
	const inactivityTimeoutRef = useRef(null);
	const currentSessionIdRef = useRef(null);
	const messageHandlerRef = useRef(null);
	const MAX_RETRY_ATTEMPTS = 30;
	const RETRY_DELAY = 1000; // 1 second
	const SEND_INTERVAL = 10000; // 30 seconds
	const sendIntervalRef = useRef(null);
	const previousContextRef = useRef('');
	const currentContextRef = useRef('');
	const location = localStorage.getItem('locationDetails') || {};
	const locationData = JSON.parse(location);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (inactivityTimeoutRef.current) {
				clearTimeout(inactivityTimeoutRef.current);
			}
			if (sendIntervalRef.current) {
				clearInterval(sendIntervalRef.current);
			}
			if (socketRef.current) {
				socketRef.current.close();
			}
		};
	}, []);

	// Helper function to reset the inactivity timer
	const resetInactivityTimeout = useCallback(() => {
		if (inactivityTimeoutRef.current) {
			clearTimeout(inactivityTimeoutRef.current);
		}

		inactivityTimeoutRef.current = setTimeout(() => {
			if (socketRef.current) {
				console.log('Disconnecting due to inactivity');
				socketRef.current.close();
			}
		}, 5 * 60 * 1000); // 5 minutes in milliseconds
	}, []);

	// Function to update current context with new transcription text
	const updateCurrentContext = useCallback((newText) => {
		currentContextRef.current = (currentContextRef.current || '') + (newText || '');
	}, []);

	// Function to send context data to socket
	const sendContextData = useCallback(() => {
		let attempts = 0;
		const attemptSend = () => {
			if (attempts >= MAX_RETRY_ATTEMPTS) {
				console.log('Max retry attempts reached, stopping context sending');
				return;
			}

			if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
				console.log('Connection closed, attempting to reconnect...');
				createWebSocketConnection(currentSessionIdRef.current, messageHandlerRef.current);
				attempts++;
				setTimeout(attemptSend, RETRY_DELAY);
				return;
			}

			if (socketRef.current.readyState === WebSocket.CONNECTING) {
				console.log('Connection not ready, waiting...');
				attempts++;
				setTimeout(attemptSend, RETRY_DELAY);
				return;
			}

			if (socketRef.current.readyState === WebSocket.OPEN) {
				const contextData = {
					previous_context: previousContextRef.current,
					current_context: currentContextRef.current,
					location: locationData,
					timezone: 'Asia/Calcutta',
				};

				try {
					if (currentContextRef.current?.length > 0) {
						socketRef.current.send(JSON.stringify(contextData));
					}
					resetInactivityTimeout();
					// Move current context to previous context
					previousContextRef.current =
						(previousContextRef.current || '') + (currentContextRef.current || '');
					currentContextRef.current = '';
				} catch (error) {
					console.error('Error sending context data:', error);
				}
				return;
			}
		};

		attemptSend();
	}, [resetInactivityTimeout]);

	// Start sending context data every 30 seconds
	const startSendingContext = useCallback(() => {
		if (sendIntervalRef.current) {
			clearInterval(sendIntervalRef.current);
		}

		sendIntervalRef.current = setInterval(() => {
			sendContextData();
		}, SEND_INTERVAL);

		console.log('Started sending context data every 30 seconds');
	}, [sendContextData]);

	// Stop sending context data
	const stopSendingContext = useCallback(() => {
		if (sendIntervalRef.current) {
			clearInterval(sendIntervalRef.current);
			sendIntervalRef.current = null;
		}
		console.log('Stopped sending context data');
	}, []);

	const createWebSocketConnection = useCallback(
		(sessionId, onMessageFunc) => {
			if (!sessionId) {
				console.error('Session ID is required for live intelligence streaming');
				return;
			}

			currentSessionIdRef.current = sessionId;
			messageHandlerRef.current = onMessageFunc;

			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const region = localStorage.getItem('region') || 'ap-south-1';

			const baseUrl = `https://humbly-pleased-alien.ngrok-free.app/${workspaceId}/${sessionId}/live_intelligence_streaming?token=${usertoken}`;

			if (socketRef.current) {
				socketRef.current.close();
			}

			socketRef.current = new WebSocket(baseUrl);

			socketRef.current.onopen = () => {
				console.log('Connected to Live Intelligence WebSocket server');
				resetInactivityTimeout();
				// Start sending context data when connected
				startSendingContext();
			};

			socketRef.current.onclose = (event) => {
				console.log('Disconnected from Live Intelligence WebSocket server');
				if (inactivityTimeoutRef.current) {
					clearTimeout(inactivityTimeoutRef.current);
				}
				stopSendingContext();
			};

			socketRef.current.onerror = (error) => {
				console.error('Live Intelligence WebSocket error:', error);
			};

			socketRef.current.onmessage = (event) => {
				resetInactivityTimeout();
				if (messageHandlerRef.current) {
					messageHandlerRef.current(event);
				}
			};
		},
		[resetInactivityTimeout, startSendingContext, stopSendingContext],
	);

	const closeWebSocketConnection = useCallback(() => {
		stopSendingContext();
		if (socketRef.current) {
			socketRef.current.close();
		}
	}, [stopSendingContext]);

	return {
		socketRef,
		createWebSocketConnection,
		closeWebSocketConnection,
		updateCurrentContext,
		sendContextData,
		startSendingContext,
		stopSendingContext,
	};
};

export default useLiveIntelligenceStream;
