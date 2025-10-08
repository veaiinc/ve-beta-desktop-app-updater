import { useReducer, useRef, useCallback } from 'react';
import getBaseUrl from '../../services/baseUrls';
import Cookies from 'js-cookie';
import getSharedRefreshToken from '../../services/utils/sharedTokenRefresh';

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
	const inactivityTimeoutsRef = useRef({});
	const currentSessionIdRef = useRef(null);
	const fetchingAccessTokenRef = useRef(false);
	const MAX_RETRY_ATTEMPTS = 6;

	// Helper function to reset the inactivity timer
	const resetInactivityTimeout = useCallback((sessionId) => {
		if (inactivityTimeoutsRef.current[sessionId]) {
			clearTimeout(inactivityTimeoutsRef.current[sessionId]);
		}

		inactivityTimeoutsRef.current[sessionId] = setTimeout(() => {
			if (socketRefs.current[sessionId]) {
				console.log('Disconnecting due to inactivity');
				socketRefs.current[sessionId].close();
			}
		}, 5 * 60 * 1000); // 5 minutes in milliseconds
	}, []);

	const sendMessage = useCallback(
		({ data, sessionId, onMessageFunc, isPublicChat = false, agentType }) => {
			socketsInfoRef.current[sessionId] = {
				...(socketsInfoRef.current[sessionId] || {}),
				...(agentType && { agentType }),
				...(onMessageFunc && { onMessageFunc }),
				isPublicChat,
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
						// exponential backoff delay
						const delay = Math.min(1000 * 2 ** attempts, 30000);
						createWebSocketConnection({
							sessionId,
							onMessageFunc,
							agentType,
							isPublicChat,
						});
						setTimeout(attemptSend, delay);
						attempts++;
						return;
					}

					// If socket is still connecting, wait and retry
					if (socketRefs.current[sessionId].readyState === WebSocket.CONNECTING) {
						console.log('Connection not ready, waiting...');
						const delay = Math.min(1000 * 2 ** attempts, 30000);
						setTimeout(attemptSend, delay);
						attempts++;
						return;
					}

					// If socket is ready, send the message
					if (socketRefs.current[sessionId].readyState === WebSocket.OPEN) {
						try {
							socketRefs.current[sessionId].send(JSON.stringify(data));
							resetInactivityTimeout(sessionId);
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
		async ({ sessionId, onMessageFunc, agentType, isPublicChat = false }) => {
			if (!sessionId || fetchingAccessTokenRef.current) {
				return;
			}

			const accessTokenExpiry =
				(JSON.parse(localStorage.getItem('accessTokenExpiry')) ?? 0) - 10;

			if (accessTokenExpiry < Math.floor(Date.now() / 1000)) {
				let response = null;
				try {
					fetchingAccessTokenRef.current = true;
					response = await getSharedRefreshToken();
				} catch {
					console.log('Api for new refresh token is failed');
				} finally {
					fetchingAccessTokenRef.current = false;
				}
				if (!response?.success) {
					return;
				}
			}

			currentSessionIdRef.current = sessionId;

			if (socketRefs.current[sessionId]) {
				return;
			}

			const agent = agentTypeMap[agentType] || 'multi_agent_chat_streaming';

			socketsInfoRef.current[sessionId] = {
				...(socketsInfoRef.current[sessionId] || {}),
				...(agentType && { agentType }),
				...(onMessageFunc && { onMessageFunc }),
				isPublicChat,
			};

			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const region = Cookies.get('region') || localStorage.getItem('region') || 'us-east-1';
			const type = 'chat_ws_api';
			const chat_ws_api = getBaseUrl({ region, type });
			let baseUrl = `${chat_ws_api}/${workspaceId}/${sessionId}/${agent}?token=${usertoken}`;

			if (isPublicChat) {
				const type = 'guest_chat_ws_api';
				const guest_chat_ws_api = getBaseUrl({ region, type });
				baseUrl = `${guest_chat_ws_api}/${sessionId}/guest_chat`;
			}

			socketRefs.current[sessionId] = new WebSocket(baseUrl);

			socketRefs.current[sessionId].onopen = () => {
				console.log('Connected to WebSocket server');
				resetInactivityTimeout(sessionId);
			};

			socketRefs.current[sessionId].onclose = () => {
				console.log('Disconnected from WebSocket server', sessionId);

				if (inactivityTimeoutsRef.current[sessionId]) {
					clearTimeout(inactivityTimeoutsRef.current[sessionId]);
					delete inactivityTimeoutsRef.current[sessionId];
				}
				delete socketRefs.current[sessionId];
				delete socketsInfoRef.current[sessionId];
			};

			socketRefs.current[sessionId].onerror = (e) => {
				console.log('Error from socket', e);
				try {
					if (socketRefs.current[sessionId].readyState !== WebSocket.CLOSED) {
						socketRefs.current[sessionId].close();
					}
				} catch (_) {
					console.log('Failed to close server on socket error');
				}
			};

			socketRefs.current[sessionId].onmessage = (event) => {
				resetInactivityTimeout(sessionId);
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
