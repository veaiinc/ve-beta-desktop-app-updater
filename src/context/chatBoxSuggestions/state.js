import { useRef, useCallback, useReducer } from 'react';
import { config } from '../../services';

export const initialChatBoxSuggestionsState = {};

const Reducer = (state) => {
	return state;
};

export const ChatBoxSuggestionsState = () => {
	useReducer(Reducer, initialChatBoxSuggestionsState);
	const socketRefs = useRef({});
	const inactivityTimeoutRefs = useRef({});
	const MAX_RETRY_ATTEMPTS = 30;
	const RETRY_DELAY = 1000;
	const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	const latestQueryRefs = useRef({});

	// useEffect(() => {
	// 	return () => {
	// 		if (socketRef.current) {
	// 			socketRef.current.close();
	// 		}

	// 		if (inactivityTimeoutRef.current) {
	// 			clearTimeout(inactivityTimeoutRef.current);
	// 		}
	// 	};
	// }, []);

	const resetInactivityTimer = (sessionId) => {
		if (inactivityTimeoutRefs.current[sessionId]) {
			clearTimeout(inactivityTimeoutRefs.current[sessionId]);
		}
		inactivityTimeoutRefs.current[sessionId] = setTimeout(() => {
			socketRefs.current[sessionId].close();
			inactivityTimeoutRefs.current[sessionId] = null;
		}, 1000 * 60 * 2);
	};

	const sendMessage = useCallback(
		async ({ query, sessionId, onMessageFunc }) => {
			if (latestQueryRefs.current[sessionId]) {
				latestQueryRefs.current[sessionId] = query;
				return;
			}
			latestQueryRefs.current[sessionId] = query;

			return new Promise((resolve, reject) => {
				let attempts = 0;

				const attemptSend = () => {
					if (attempts >= MAX_RETRY_ATTEMPTS) {
						reject(new Error('Failed to send message after maximum retry attempts'));
						return;
					}

					// If socket doesn't exist or is closed, try to reconnect
					if (
						!socketRefs.current[sessionId] ||
						socketRefs.current[sessionId].readyState === WebSocket.CLOSED
					) {
						console.log('Connection closed, attempting to reconnect...');
						createWebSocketConnection({ sessionId, onMessageFunc });
						attempts++;
						setTimeout(attemptSend, RETRY_DELAY);
						return;
					}

					// If socket is still connecting, wait and retry
					if (socketRefs.current[sessionId].readyState === WebSocket.CONNECTING) {
						console.log('Connection not ready, waiting...');
						attempts++;
						setTimeout(attemptSend, RETRY_DELAY);
						return;
					}

					// If socket is ready, send the message
					if (socketRefs.current[sessionId].readyState === WebSocket.OPEN) {
						try {
							socketRefs.current[sessionId].send(
								JSON.stringify({
									partial_query: latestQueryRefs.current[sessionId],
									timezone,
								}),
							);
							latestQueryRefs.current[sessionId] = null;
							resetInactivityTimer(sessionId);
							resolve();
						} catch (error) {
							reject(error);
						}
					}
				};

				attemptSend();
			});
		},
		[resetInactivityTimer],
	);

	const createWebSocketConnection = useCallback(
		async ({ sessionId, onMessageFunc }) => {
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const region = localStorage.getItem('region') || 'us-east-1';
			const wsUrl = `${
				region === 'ap-south-1' ? config.chat_ws_api : config.chat_ws_api_US
			}/${workspaceId}/${sessionId}/suggestions?token=${usertoken}`;

			socketRefs.current[sessionId] = new WebSocket(wsUrl);

			socketRefs.current[sessionId].onopen = () => {
				console.log('Connected to WebSocket server');
				resetInactivityTimer(sessionId);
			};

			socketRefs.current[sessionId].onclose = () => {
				console.log('Disconnected from WebSocket server');
				if (inactivityTimeoutRefs.current[sessionId]) {
					clearTimeout(inactivityTimeoutRefs.current[sessionId]);
				}
			};

			socketRefs.current[sessionId].onmessage = (event) => {
				resetInactivityTimer(sessionId);
				if (onMessageFunc) {
					onMessageFunc(event);
				}
			};
		},
		[resetInactivityTimer],
	);

	const closeWebSocketConnection = useCallback((sessionId) => {
		if (socketRefs.current[sessionId]) {
			socketRefs.current[sessionId].close();
			delete socketRefs.current[sessionId];
			delete latestQueryRefs.current[sessionId];
		}

		if (inactivityTimeoutRefs.current[sessionId]) {
			clearTimeout(inactivityTimeoutRefs.current[sessionId]);
			delete inactivityTimeoutRefs.current[sessionId];
		}
	}, []);

	return {
		createWebSocketConnection,
		sendMessage,
		closeWebSocketConnection,
	};
};
