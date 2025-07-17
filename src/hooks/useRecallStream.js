import { useCallback, useRef, useEffect } from 'react';
import { message } from 'antd/lib';

const useRecallStream = () => {
	const socketRef = useRef(null);
	const messageHandlerRef = useRef(null);
	const reconnectTimeoutRef = useRef(null);
	const reconnectAttemptsRef = useRef(0);
	const isIntentionallyClosedRef = useRef(false);
	const RECONNECT_ATTEMPTS = 5;
	const RECONNECT_DELAY = 2000; // 2 seconds
	const location = localStorage.getItem('locationDetails') || {};
	const locationData = JSON.parse(location);
	useEffect(() => {
		return () => {
			isIntentionallyClosedRef.current = true;
			if (socketRef.current) {
				socketRef.current.close();
			}
			if (reconnectTimeoutRef.current) {
				clearTimeout(reconnectTimeoutRef.current);
			}
		};
	}, []);

	const createWebSocketConnection = useCallback((sessionId, pageId, onMessageFunc) => {
		const usertoken = localStorage.getItem('usertoken');
		const workspaceId = localStorage.getItem('workspaceId');
		const region = localStorage.getItem('region') || 'us-east-1';

		if (socketRef.current) {
			isIntentionallyClosedRef.current = true;
			socketRef.current.close();
		}

		messageHandlerRef.current = onMessageFunc;
		reconnectAttemptsRef.current = 0; // Reset reconnect attempts
		isIntentionallyClosedRef.current = false;

		const wsUrl = `wss://recall.${region}.ve.ai/frontend/ws/${pageId}?token=${usertoken}`;

		const connect = () => {
			socketRef.current = new WebSocket(wsUrl);

			socketRef.current.onopen = () => {
				socketRef.current.send(
					JSON.stringify({
						location: locationData,
						timezone: 'Asia/Calcutta',
						session_id: pageId
					})
				);
				console.log('Connected to Recall WebSocket server');
				reconnectAttemptsRef.current = 0; // Reset on successful connection
				if (reconnectTimeoutRef.current) {
					clearTimeout(reconnectTimeoutRef.current);
				}
			};

			socketRef.current.onmessage = (event) => {
				if (messageHandlerRef.current) {
					messageHandlerRef.current(event);
				}
			};

			socketRef.current.onclose = () => {
				console.log('Disconnected from Recall WebSocket server');
				if (isIntentionallyClosedRef.current) {
					return; // Do not reconnect if closed intentionally
				}

				// Attempt reconnection if not manually closed
				if (reconnectAttemptsRef.current < RECONNECT_ATTEMPTS) {
					reconnectAttemptsRef.current += 1;
					console.log(
						`Attempting to reconnect (${reconnectAttemptsRef.current}/${RECONNECT_ATTEMPTS})...`
					);
					reconnectTimeoutRef.current = setTimeout(() => {
						connect();
					}, RECONNECT_DELAY);
				} else {
					console.log('Max reconnect attempts reached, stopping reconnection');
					message.error('Failed to reconnect to Recall WebSocket server');
				}
			};

			socketRef.current.onerror = (error) => {
				console.error('Recall WebSocket error:', error);
			};
		};

		connect();
	}, []);

	const closeWebSocketConnection = useCallback(() => {
		isIntentionallyClosedRef.current = true;
		if (socketRef.current) {
			socketRef.current.close();
		}
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
		}
	}, []);

	return { createWebSocketConnection, closeWebSocketConnection };
};

export default useRecallStream;
