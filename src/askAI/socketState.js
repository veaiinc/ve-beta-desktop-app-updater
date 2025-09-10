import { useCallback, useRef } from 'react';
import { getConfig } from '../services/index';

// Simple socket state for AskAI - simplified version of chatStream state
export const useAskAISocket = () => {
	const socketRef = useRef(null);
	const currentSessionIdRef = useRef(null);
	const isStoppedRef = useRef(false);
	const MAX_RETRY_ATTEMPTS = 30;
	const RETRY_DELAY = 1000; // 1 second

	const createWebSocketConnection = useCallback(
		async (sessionId, onMessageFunc, agentType = 'multi_agent_chat_streaming') => {
			if (!sessionId) {
				console.error('SessionId is required for WebSocket connection');
				return;
			}

			currentSessionIdRef.current = sessionId;
			isStoppedRef.current = false; // Reset stop flag when creating new connection

			// Close existing connection if any
			if (socketRef.current) {
				socketRef.current.close();
			}

			try {
				const usertoken = localStorage.getItem('usertoken');
				const workspaceId = localStorage.getItem('workspaceId');
				const region = localStorage.getItem('region') || 'us-east-1';
				const config = await getConfig();
				const { chat_ws_api, chat_ws_api_US } = config;

				// Map agent types similar to original state.js
				const agentTypeMap = {
					search_agent: 'search_agent_streaming',
					knowledge_agent: 'knowledge_agent_chat_streaming',
				};

				const agent = agentTypeMap[agentType] || 'multi_agent_chat_streaming';

				const baseUrl = `${
					region === 'ap-south-1' ? chat_ws_api : chat_ws_api_US
				}/${workspaceId}/${sessionId}/${agent}?token=${usertoken}`;

				socketRef.current = new WebSocket(baseUrl);

				socketRef.current.onopen = () => {
					console.log('AskAI WebSocket connected');
				};

				socketRef.current.onclose = () => {
					console.log('AskAI WebSocket disconnected');
				};

				socketRef.current.onerror = (error) => {
					console.error('AskAI WebSocket error:', error);
				};

				socketRef.current.onmessage = (event) => {
					// Only process messages if not stopped
					if (!isStoppedRef.current && onMessageFunc) {
						onMessageFunc(event, currentSessionIdRef.current);
					}
				};
			} catch (error) {
				console.error('Failed to create WebSocket connection:', error);
			}
		},
		[],
	);

	const sendMessage = useCallback(
		({ data, sessionId, onMessageFunc, agentType }) => {
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
					if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
						console.log('AskAI: Connection closed, attempting to reconnect...');
						createWebSocketConnection(sessionId, onMessageFunc, agentType);
						attempts++;
						setTimeout(attemptSend, RETRY_DELAY);
						return;
					}

					// If socket is still connecting, wait and retry
					if (socketRef.current.readyState === WebSocket.CONNECTING) {
						console.log('AskAI: Connection not ready, waiting...');
						attempts++;
						setTimeout(attemptSend, RETRY_DELAY);
						return;
					}

					// If socket is ready, send the message
					if (socketRef.current.readyState === WebSocket.OPEN) {
						try {
							socketRef.current.send(JSON.stringify(data));
							resolve();
						} catch (error) {
							reject(error);
						}
					}
				};

				attemptSend();
			});
		},
		[createWebSocketConnection],
	);

	const closeWebSocketConnection = useCallback(() => {
		if (socketRef.current) {
			socketRef.current.close();
			socketRef.current = null;
		}
		currentSessionIdRef.current = null;
		isStoppedRef.current = false; // Reset stop flag when closing connection
	}, []);

	const stopMessage = useCallback(() => {
		console.log('🛑 Stopping message processing...');
		// Set stop flag to prevent processing any more messages
		isStoppedRef.current = true;
		
		// Close the WebSocket connection to stop receiving messages
		if (socketRef.current) {
			socketRef.current.close();
			socketRef.current = null;
		}
		
		console.log('✅ Message processing stopped and WebSocket closed');
	}, []);

	return {
		createWebSocketConnection,
		sendMessage,
		closeWebSocketConnection,
		stopMessage,
	};
};
