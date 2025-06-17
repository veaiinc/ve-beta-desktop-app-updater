import { useReducer, useRef, useEffect, useCallback } from 'react';

export const initialChatStreamState = {};

const agentTypeMap = {
	search_agent: 'search_agent_streaming',
	knowledge_agent: 'knowledge_agent_chat_streaming',
};

const Reducer = (state) => {
	return state;
};

export const ChatStreamState = () => {
	const [state, dispatch] = useReducer(Reducer, initialChatStreamState);
	const socketRefs = useRef({});
	const inactivityTimeoutRef = useRef(null);
	const currentSessionIdRef = useRef(null);
	const messageHandlerRef = useRef(null);
	const isPublicChatRef = useRef(false);
	const agentTypeRef = useRef(null);
	const MAX_RETRY_ATTEMPTS = 3;
	const RETRY_DELAY = 1000; // 1 second

	// // Cleanup on unmount
	// useEffect(() => {
	// 	return () => {
	// 		if (inactivityTimeoutRef.current) {
	// 			clearTimeout(inactivityTimeoutRef.current);
	// 		}
	// 		if (socketRef.current) {
	// 			socketRef.current.close();
	// 		}
	// 	};
	// }, []);

	// Helper function to reset the inactivity timer
	const resetInactivityTimeout = useCallback(() => {
		if (inactivityTimeoutRef.current) {
			clearTimeout(inactivityTimeoutRef.current);
		}

		inactivityTimeoutRef.current = setTimeout(() => {
			if (socketRefs.current[currentSessionIdRef.current]) {
				console.log('Disconnecting due to inactivity');
				socketRefs.current[currentSessionIdRef.current].close();
			}
		}, 5 * 60 * 1000); // 5 minutes in milliseconds
	}, []);

	const sendMessage = useCallback(
		(data) => {
			return new Promise((resolve, reject) => {
				let attempts = 0;

				const attemptSend = () => {
					// If max retries exceeded, reject the promise
					if (attempts >= MAX_RETRY_ATTEMPTS) {
						reject(new Error('Failed to send message after maximum retry attempts'));
						return;
					}

					// If socket doesn't exist or is closed, try to reconnect
					if (
						!socketRefs.current[currentSessionIdRef.current] ||
						socketRefs.current[currentSessionIdRef.current].readyState ===
							WebSocket.CLOSED
					) {
						console.log('Connection closed, attempting to reconnect...');
						createWebSocketConnection(
							currentSessionIdRef.current,
							messageHandlerRef.current,
							agentTypeRef.current,
							isPublicChatRef.current,
						);
						attempts++;
						setTimeout(attemptSend, RETRY_DELAY);
						return;
					}

					// If socket is still connecting, wait and retry
					if (
						socketRefs.current[currentSessionIdRef.current].readyState ===
						WebSocket.CONNECTING
					) {
						console.log('Connection not ready, waiting...');
						attempts++;
						setTimeout(attemptSend, RETRY_DELAY);
						return;
					}

					// If socket is ready, send the message
					if (
						socketRefs.current[currentSessionIdRef.current].readyState ===
						WebSocket.OPEN
					) {
						try {
							socketRefs.current[currentSessionIdRef.current].send(
								JSON.stringify(data),
							);
							resetInactivityTimeout();
							resolve();
						} catch (error) {
							reject(error);
						}
					}
				};

				attemptSend();
			});
		},
		[resetInactivityTimeout],
	);

	const createWebSocketConnection = useCallback(
		(sessionId, onMessageFunc, agentType, isPublicChat = false) => {
			if ((!sessionId && !isPublicChat) || socketRefs.current[sessionId]) {
				return;
			}

			currentSessionIdRef.current = sessionId;
			messageHandlerRef.current = onMessageFunc;
			isPublicChatRef.current = isPublicChat;

			const agent = agentTypeMap[agentType] || 'chat_streaming';
			agentTypeRef.current = agent;

			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const region = localStorage.getItem('region') || 'ap-south-1';

			let baseUrl = `${
				region === 'ap-south-1' ? 'wss://ai.ap-south-1.ve.ai' : 'wss://ai.us-east-1.ve.ai'
			}/${workspaceId}/${sessionId}/${agent}?token=${usertoken}`;

			if (isPublicChat) {
				baseUrl = `${
					region === 'ap-south-1'
						? 'wss://guestsearch.ap-south-1.ve.ai'
						: 'wss://guestsearch.us-east-1.ve.ai'
				}/${sessionId}/guest_chat`;
			}

			socketRefs.current[currentSessionIdRef.current] = new WebSocket(baseUrl);

			socketRefs.current[currentSessionIdRef.current].onopen = () => {
				console.log('Connected to WebSocket server');
				resetInactivityTimeout();
			};

			socketRefs.current[currentSessionIdRef.current].onclose = () => {
				console.log('Disconnected from WebSocket server');
				if (inactivityTimeoutRef.current) {
					clearTimeout(inactivityTimeoutRef.current);
				}
			};

			socketRefs.current[currentSessionIdRef.current].onmessage = (event) => {
				resetInactivityTimeout();
				if (onMessageFunc) {
					onMessageFunc(event);
				}
			};
		},
		[resetInactivityTimeout],
	);

	const closeWebSocketConnection = useCallback((sessionIds) => {
		if (sessionIds?.length > 0) {
			sessionIds?.forEach((sessionId) => {
				if (socketRefs.current[sessionId]) {
					socketRefs.current[sessionId].close();
					delete socketRefs.current[sessionId];
				}
			});
		}
	}, []);

	return {
		...state,
		createWebSocketConnection,
		sendMessage,
		closeWebSocketConnection,
	};
};
