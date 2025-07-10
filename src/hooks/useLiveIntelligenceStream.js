import { message } from 'antd/lib';
import { useCallback, useRef, useEffect } from 'react';

const useLiveIntelligenceStream = () => {
	const socketRef = useRef(null);
	const inactivityTimeoutRef = useRef(null);
	const sendTimeoutRef = useRef(null);
	const reconnectTimeoutRef = useRef(null);
	const sendingContextRef = useRef(false);
	const currentSessionIdRef = useRef(null);
	const pageIdRef = useRef(null);
	const isSocketFirstTimeConnectedRef = useRef(false);
	const messageHandlerRef = useRef(null);
	const MAX_RETRY_ATTEMPTS = 10;
	const RECONNECT_ATTEMPTS = 5;
	const RECONNECT_DELAY = 2000; // 2 seconds
	const SEND_TIMEOUT = 30000; // 30 seconds
	const previousContextRef = useRef('');
	const currentContextRef = useRef('');
	const reconnectAttemptsRef = useRef(0);
	const location = localStorage.getItem('locationDetails') || {};
	const locationData = JSON.parse(location);
	const sendDataRef = useRef(true);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			currentSessionIdRef.current = null;
			pageIdRef.current = null;
			if (inactivityTimeoutRef.current) {
				clearTimeout(inactivityTimeoutRef.current);
			}
			if (sendTimeoutRef.current) {
				clearTimeout(sendTimeoutRef.current);
			}
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
			}
			if (socketRef.current) {
				socketRef.current.close();
			}
		};
	}, []);

	// Helper function to reset the inactivity timer
	const resetInactivityTimeout = useCallback(() => {
		if (sendTimeoutRef.current) {
			clearTimeout(sendTimeoutRef.current);
		}

		inactivityTimeoutRef.current = setTimeout(() => {
			if (socketRef.current) {
				console.log('Disconnecting due to inactivity');
				socketRef.current.close();
			}
		}, 5 * 60 * 1000); // 5 minutes in milliseconds
	}, []);

	// Stop sending context data
	const stopSendingContext = useCallback(() => {
		if (sendTimeoutRef.current) {
			clearTimeout(sendTimeoutRef.current);
			sendTimeoutRef.current = null;
		}
	}, []);

	const createWebSocketConnection = useCallback(
		(sessionId, pageId, onMessageFunc, sendData = true) => {
			if (!sessionId) {
				console.error('Session ID is required for live intelligence streaming');
				return;
			}

			currentSessionIdRef.current = sessionId;
			pageIdRef.current = pageId;
			messageHandlerRef.current = onMessageFunc;
			sendDataRef.current = sendData;
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const region = localStorage.getItem('region') || 'us-east-1';

			const baseUrl = `https://humbly-pleased-alien.ngrok-free.app/${workspaceId}/${sessionId}/${pageId}/live_intelligence_memory_frontend?token=${usertoken}`;

			if (socketRef.current) {
				socketRef.current.close();
			}

			isSocketFirstTimeConnectedRef.current = true;
			reconnectAttemptsRef.current = 0; // Reset reconnect attempts

			const connect = () => {
				socketRef.current = new WebSocket(baseUrl);

				socketRef.current.onopen = () => {
					console.log('Connected to Live Intelligence WebSocket server');
					reconnectAttemptsRef.current = 0; // Reset on successful connection
					if (reconnectTimeoutRef.current) {
						clearTimeout(reconnectTimeoutRef.current);
					}
					socketRef.current.send(
						JSON.stringify({
							location: locationData,
							timezone: 'Asia/Calcutta',
						}),
					);

					if (sendTimeoutRef.current) {
						clearTimeout(sendTimeoutRef.current);
					}
					if (sendData) {
						sendTimeoutRef.current = setTimeout(() => {
							sendContextData();
						}, SEND_TIMEOUT);
					}
				};

				socketRef.current.onclose = () => {
					console.log('Disconnected from Live Intelligence WebSocket server');
					if (inactivityTimeoutRef.current) {
						clearTimeout(inactivityTimeoutRef.current);
					}
					stopSendingContext();

					// Attempt reconnection if not manually closed
					if (reconnectAttemptsRef.current < RECONNECT_ATTEMPTS) {
						reconnectAttemptsRef.current += 1;
						console.log(
							`Attempting to reconnect (${reconnectAttemptsRef.current}/${RECONNECT_ATTEMPTS})...`,
						);
						reconnectTimeoutRef.current = setTimeout(() => {
							connect();
						}, RECONNECT_DELAY);
					} else {
						console.log('Max reconnect attempts reached, stopping reconnection');
						message.error('Failed to reconnect to Live Intelligence WebSocket server');
					}
				};

				socketRef.current.onerror = (error) => {
					console.error('Live Intelligence WebSocket error:', error);
				};

				socketRef.current.onmessage = (event) => {
					console.log(event, 'event');
					if (messageHandlerRef.current) {
						messageHandlerRef.current(event);
					}
				};
			};

			connect();
		},
		[resetInactivityTimeout, stopSendingContext],
	);

	// Function to send context data to socket
	const sendContextData = useCallback(() => {
		let attempts = 0;
		const attemptSend = () => {
			if (attempts >= MAX_RETRY_ATTEMPTS) {
				sendingContextRef.current = false;
				console.log('Max retry attempts reached, stopping context sending');
				return;
			}

			if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
				console.log('Connection closed, attempting to reconnect...');
				createWebSocketConnection(
					currentSessionIdRef.current,
					pageIdRef.current,
					messageHandlerRef.current,
					sendDataRef.current,
				);
				attempts++;
				setTimeout(attemptSend, RECONNECT_DELAY);
				return;
			}

			if (socketRef.current.readyState === WebSocket.CONNECTING) {
				console.log('Connection not ready, waiting...');
				attempts++;
				setTimeout(attemptSend, RECONNECT_DELAY);
				return;
			}

			if (socketRef.current.readyState === WebSocket.OPEN) {
				const contextData = {
					...(isSocketFirstTimeConnectedRef.current && {
						previous_context: previousContextRef.current,
					}),
					current_context: currentContextRef.current,
					location: locationData,
					timezone: 'Asia/Calcutta',
					...(pageIdRef.current && {
						page_id: pageIdRef.current,
					}),
				};

				try {
					if (currentContextRef.current?.length > 0) {
						socketRef.current.send(JSON.stringify(contextData));
						// Move current context to previous context
						isSocketFirstTimeConnectedRef.current = false;
						previousContextRef.current =
							(previousContextRef.current || '') +
							(currentContextRef.current || '') +
							'\n';
						currentContextRef.current = '';
					}
				} catch (error) {
					message.error('Failed to send data to Live Intelligence WebSocket server');
					console.error('Error sending context data:', error);
				} finally {
					sendingContextRef.current = false;
					if (sendTimeoutRef.current) {
						clearTimeout(sendTimeoutRef.current);
					}
					sendTimeoutRef.current = setTimeout(() => {
						sendContextData();
					}, SEND_TIMEOUT);
				}

				return;
			}
		};

		attemptSend();
	}, [resetInactivityTimeout, createWebSocketConnection]);

	// Function to update current context with new transcription text
	const updateCurrentContext = useCallback(
		(newText) => {
			currentContextRef.current = (currentContextRef.current || '') + (newText || '');
			const hasPunctuation = /[?.!]/.test(currentContextRef.current || '');
			if (hasPunctuation) {
				if (!sendingContextRef.current) {
					sendingContextRef.current = true;
					
					sendContextData();
					if (sendTimeoutRef.current) {
						clearTimeout(sendTimeoutRef.current);
					}
				}
			}
		},
		[sendContextData],
	);

	const closeWebSocketConnection = useCallback(() => {
		stopSendingContext();
		if (socketRef.current) {
			socketRef.current.close();
		}
		reconnectAttemptsRef.current = RECONNECT_ATTEMPTS; // Prevent reconnection attempts
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
		}
	}, [stopSendingContext]);

	return {
		socketRef,
		createWebSocketConnection,
		closeWebSocketConnection,
		updateCurrentContext,
		sendContextData,
		stopSendingContext,
	};
};

export default useLiveIntelligenceStream;