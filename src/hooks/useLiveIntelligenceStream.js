import { message } from 'antd/lib';
import { useCallback, useRef, useEffect } from 'react';
const useLiveIntelligenceStream = () => {
	const socketRef = useRef(null);
	const inactivityTimeoutRef = useRef(null);
	const sendTimeoutRef = useRef(null);
	const sendingContextRef = useRef(false);
	const currentSessionIdRef = useRef(null);
	const isSocketFirstTimeConnectedRef = useRef(false);
	const messageHandlerRef = useRef(null);
	const MAX_RETRY_ATTEMPTS = 10;
	const RETRY_DELAY = 1000; // 1 second
	const SEND_TIMEOUT = 30000; // 30 seconds
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

			if (sendTimeoutRef.current) {
				clearTimeout(sendTimeoutRef.current);
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
		(sessionId, onMessageFunc, sendData = true) => {
			if (!sessionId) {
				console.error('Session ID is required for live intelligence streaming');
				return;
			}

			currentSessionIdRef.current = sessionId;
			messageHandlerRef.current = onMessageFunc;

			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const region = localStorage.getItem('region') || 'us-east-1';

			const baseUrl = `https://live.${region}.ve.ai/${workspaceId}/${sessionId}/live_intelligence_memory?token=${usertoken}`;
			// const baseUrl = `https://informally-cuddly-chimp.ngrok-free.app/${workspaceId}/${sessionId}/live_intelligence_streaming?token=${usertoken}`;

			if (socketRef.current) {
				socketRef.current.close();
			}

			isSocketFirstTimeConnectedRef.current = true;

			socketRef.current = new WebSocket(baseUrl);

			socketRef.current.onopen = () => {
				console.log('Connected to Live Intelligence WebSocket server');

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
			};

			socketRef.current.onerror = (error) => {
				// message.error('Failed to connect to Live Intelligence WebSocket server');
				console.error('Live Intelligence WebSocket error:', error);
			};

			socketRef.current.onmessage = (event) => {
				console.log(event, 'event');
				if (messageHandlerRef.current) {
					messageHandlerRef.current(event);
				}
			};
		},
		[resetInactivityTimeout, stopSendingContext],
	);

	// Function to send context data to socket
	const sendContextData = useCallback(() => {
		let attempts = 0;
		const attemptSend = () => {
			if (attempts >= MAX_RETRY_ATTEMPTS) {
				sendingContextRef.current = false;
				// if (sendTimeoutRef.current) {
				// 	clearTimeout(sendTimeoutRef.current);
				// }
				// sendTimeoutRef.current = setTimeout(() => {
				// 	sendContextData();
				// }, SEND_TIMEOUT);
				console.log('Max retry attempts reached, stopping context sending');
				return;
			}

			if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
				console.log('Connection closed, attempting to reconnect...');
				createWebSocketConnection(
					currentSessionIdRef.current,
					messageHandlerRef.current,
					true,
				);
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
					...(isSocketFirstTimeConnectedRef.current && {
						previous_context: previousContextRef.current,
					}),
					current_context: currentContextRef.current,
					location: locationData,
					timezone: 'Asia/Calcutta',
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
