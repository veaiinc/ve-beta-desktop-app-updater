import React, { useCallback, useRef, useEffect } from 'react';

const useChatStream = () => {
	const socketRef = useRef(null);
	const inactivityTimeoutRef = useRef(null);
	const currentSessionIdRef = useRef(null);
	const messageHandlerRef = useRef(null);
	const isPublicChatRef = useRef(false);
	const agentTypeRef = useRef(null);
	const MAX_RETRY_ATTEMPTS = 3;
	const RETRY_DELAY = 1000; // 1 second

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (inactivityTimeoutRef.current) {
				clearTimeout(inactivityTimeoutRef.current);
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
		(sessionId, onMessageFunc, agentType, isPublicChat = false) => {
			if (!sessionId && !isPublicChat) {
				return;
			}
			currentSessionIdRef.current = sessionId;
			messageHandlerRef.current = onMessageFunc;
			isPublicChatRef.current = isPublicChat;

			let agent = '';
			if (agentType === 'search_agent') {
				agent = 'search_agent_streaming';
			} else if (agentType === 'knowledge_agent') {
				agent = 'knowledge_agent_chat_streaming';
			} else {
				agent = 'multi_agent_chat_streaming';
			}
			agentTypeRef.current = agent;

			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const region = localStorage.getItem('region') || 'ap-south-1';

			const baseUrl = `${
				region === 'ap-south-1' ? 'wss://ai.ap-south-1.ve.ai' : 'wss://ai.us-east-1.ve.ai'
			}/${workspaceId}/${sessionId}/${agent}?token=${usertoken}`;

			if (socketRef.current) {
				socketRef.current.close();
			}

			socketRef.current = new WebSocket(baseUrl);

			socketRef.current.onopen = () => {
				console.log('Connected to WebSocket server');
				resetInactivityTimeout();
			};

			socketRef.current.onclose = () => {
				console.log('Disconnected from WebSocket server');
				if (inactivityTimeoutRef.current) {
					clearTimeout(inactivityTimeoutRef.current);
				}
			};

			socketRef.current.onmessage = (event) => {
				resetInactivityTimeout();
				if (onMessageFunc) {
					onMessageFunc(event);
				}
			};
		},
		[resetInactivityTimeout],
	);

	return { socketRef, createWebSocketConnection, sendMessage };
};

export default useChatStream;
