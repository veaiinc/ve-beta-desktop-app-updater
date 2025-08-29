import { useReducer, useRef, useCallback } from 'react';
import getBaseUrl from '../../services/baseUrls';
import Cookies from 'js-cookie';

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
	const socketsInfoRef = useRef({});
	const inactivityTimeoutRef = useRef(null);
	const currentSessionIdRef = useRef(null);
	const MAX_RETRY_ATTEMPTS = 30;
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
				delete socketRefs.current[currentSessionIdRef.current];
			}
		}, 5 * 60 * 1000); // 5 minutes in milliseconds
	}, []);

	const sendMessage = useCallback(
		({ data, sessionId, onMessageFunc, isPublicChat, agentType }) => {
			socketsInfoRef.current[sessionId] = {
				agentType,
				isPublicChat,
				onMessageFunc,
			};
			return new Promise((resolve, reject) => {
				let attempts = 0;

				const attemptSend = () => {
					// If max retries exceeded, reject the promise
					if (attempts >= MAX_RETRY_ATTEMPTS) {
						reject(
							new Error(
								'Failed to send message after maximum retry attempts, Please try again',
							),
						);
						return;
					}

					// If socket doesn't exist or is closed, try to reconnect
					if (
						!socketRefs.current[sessionId] ||
						socketRefs.current[sessionId].readyState === WebSocket.CLOSED
					) {
						console.log(
							'Connection closed, attempting to reconnect...',
							socketRefs.current[sessionId],
						);
						createWebSocketConnection(
							sessionId,
							onMessageFunc,
							agentType,
							isPublicChat,
						);
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
							socketRefs.current[sessionId].send(JSON.stringify(data));
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
		async (sessionId, onMessageFunc, agentType, isPublicChat = false) => {
			if (!sessionId) {
				return;
			}

			currentSessionIdRef.current = sessionId;
			if (socketRefs.current[sessionId]) {
				return;
			}

			const agent = agentTypeMap[agentType] || 'multi_agent_chat_streaming';
			socketsInfoRef.current[sessionId] = {
				agentType,
				isPublicChat,
				onMessageFunc,
			};

			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			// const { chat_ws_api, chat_ws_api_US, guest_chat_ws_api, guest_chat_ws_api_US } = config;
			const region = Cookies.get('region') || localStorage.getItem('region') || 'us-east-1';
			const type = 'chat_ws_api';
			const chat_ws_api = getBaseUrl(region, type);
			// `https://direct-garfish-smooth.ngrok-free.app`
			let baseUrl = `${chat_ws_api}/${workspaceId}/${sessionId}/${agent}?token=${usertoken}`;

			if (isPublicChat) {
				const type = 'guest_chat_ws_api';
				const guest_chat_ws_api = getBaseUrl(region, type);
				baseUrl = `${guest_chat_ws_api}/${sessionId}/guest_chat`;
			}

			socketRefs.current[sessionId] = new WebSocket(baseUrl);

			socketRefs.current[sessionId].onopen = () => {
				console.log('Connected to WebSocket server');
				resetInactivityTimeout();
			};

			socketRefs.current[sessionId].onclose = () => {
				console.log('Disconnected from WebSocket server');
				if (inactivityTimeoutRef.current) {
					clearTimeout(inactivityTimeoutRef.current);
				}
			};

			socketRefs.current[sessionId].onmessage = (event) => {
				resetInactivityTimeout();
				const { onMessageFunc } = socketsInfoRef.current[sessionId];
				if (onMessageFunc) {
					onMessageFunc(event, currentSessionIdRef.current);
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
					delete socketsInfoRef.current[sessionId];
				}
			});
		}
	}, []);

	const removeCurrentSessionId = useCallback(() => {
		currentSessionIdRef.current = null;
	}, []);

	return {
		...state,
		createWebSocketConnection,
		sendMessage,
		closeWebSocketConnection,
		removeCurrentSessionId,
	};
};
