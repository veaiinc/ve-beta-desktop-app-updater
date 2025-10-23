import { useCallback, useRef, useEffect } from 'react';
import useWorkspaceMode from './useWorkspaceMode';
import { getConfig } from '../services/index.js';

const agentTypeMap = {
	search_agent: 'search_agent_streaming',
	knowledge_agent: 'knowledge_agent_chat_streaming',
};

const useChatStream = () => {
	const socketRef = useRef(null);
	const inactivityTimeoutRef = useRef(null);
	const currentSessionIdRef = useRef(null);
	const messageHandlerRef = useRef(null);
	const isPublicChatRef = useRef(false);
	const agentTypeRef = useRef(null);
	const isMountedRef = useRef(true);
	const MAX_RETRY_ATTEMPTS = 3;
	const RETRY_DELAY = 1000; // 1 second

	// 🚨 CRITICAL FIX: Comprehensive cleanup on unmount
	useEffect(() => {
		return () => {
			isMountedRef.current = false;

			// Close WebSocket connection
			if (socketRef.current) {
				try {
					socketRef.current.close();
				} catch (error) {
					console.warn('Error closing WebSocket:', error);
				}
				socketRef.current = null;
			}

			// Clear timeout
			if (inactivityTimeoutRef.current) {
				clearTimeout(inactivityTimeoutRef.current);
				inactivityTimeoutRef.current = null;
			}

			// Clear all refs
			currentSessionIdRef.current = null;
			messageHandlerRef.current = null;
			isPublicChatRef.current = false;
			agentTypeRef.current = null;
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
					if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
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
					if (socketRef.current.readyState === WebSocket.CONNECTING) {
						console.log('Connection not ready, waiting...');
						attempts++;
						setTimeout(attemptSend, RETRY_DELAY);
						return;
					}

					// If socket is ready, send the message
					if (socketRef.current.readyState === WebSocket.OPEN) {
						try {
							socketRef.current.send(JSON.stringify(data));
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
			if (!sessionId && !isPublicChat) {
				return;
			}

			// 🚨 CRITICAL FIX: Check if component is still mounted
			if (!isMountedRef.current) {
				return;
			}

			currentSessionIdRef.current = sessionId;
			messageHandlerRef.current = onMessageFunc;
			isPublicChatRef.current = isPublicChat;

			const { workspaceMode } = useWorkspaceMode(); // stable, beta, internal
			const defaultAgent =
				workspaceMode === 'stable' ? 'chat_streaming' : 'multi_agent_chat_streaming';
			const agent = agentTypeMap[agentType] || defaultAgent;
			agentTypeRef.current = agent;

			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const region = localStorage.getItem('region') || 'us-east-1';
			const config = await getConfig();
			let baseUrl = `${
				region === 'ap-south-1' ? config.chat_ws_api : config.chat_ws_api_US
			}/${workspaceId}/${sessionId}/${agent}?token=${usertoken}`;

			if (isPublicChat) {
				baseUrl = `${
					region === 'ap-south-1' ? config.guest_chat_ws_api : config.guest_chat_ws_api_US
				}/${sessionId}/guest_chat`;
			}

			// 🚨 CRITICAL FIX: Properly close existing connection
			if (socketRef.current) {
				try {
					socketRef.current.close();
				} catch (error) {
					console.warn('Error closing existing WebSocket:', error);
				}
				socketRef.current = null;
			}

			// 🚨 CRITICAL FIX: Check if still mounted before creating new connection
			if (!isMountedRef.current) {
				return;
			}

			socketRef.current = new WebSocket(baseUrl);

			socketRef.current.onopen = () => {
				if (!isMountedRef.current) {
					socketRef.current?.close();
					return;
				}
				console.log('Connected to WebSocket server');
				resetInactivityTimeout();
			};

			socketRef.current.onclose = () => {
				if (!isMountedRef.current) return;
				console.log('Disconnected from WebSocket server');
				if (inactivityTimeoutRef.current) {
					clearTimeout(inactivityTimeoutRef.current);
					inactivityTimeoutRef.current = null;
				}
			};

			socketRef.current.onmessage = (event) => {
				if (!isMountedRef.current) return;
				resetInactivityTimeout();
				if (onMessageFunc) {
					onMessageFunc(event);
				}
			};

			socketRef.current.onerror = (error) => {
				if (!isMountedRef.current) return;
				console.error('WebSocket error:', error);
			};
		},
		[resetInactivityTimeout],
	);

	return { socketRef, createWebSocketConnection, sendMessage };
};

export default useChatStream;
