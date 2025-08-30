import { useCallback, useRef, useEffect } from 'react';
import { message } from 'antd/lib';
import getBaseUrl from '../services/baseUrls.js';

const useRecallStream = () => {
	const socketRef = useRef(null);
	const messageHandlerRef = useRef(null);
	const reconnectTimeoutRef = useRef(null);
	const reconnectAttemptsRef = useRef(0);
	const isIntentionallyClosedRef = useRef(false);
	const RECONNECT_ATTEMPTS = 5;
	const RECONNECT_DELAY = 2000; // 2 seconds
	const location = JSON.parse(localStorage.getItem('locationDetails')) || {};

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

	const createWebSocketConnection = useCallback(
		async (sessionId, meetingId, onMessageFunc, isAiIntelligenceEnabled) => {
			const usertoken = localStorage.getItem('usertoken');
			const region = localStorage.getItem('region') || 'us-east-1';

			if (socketRef.current) {
				isIntentionallyClosedRef.current = true;
				socketRef.current.close();
			}

			messageHandlerRef.current = onMessageFunc;
			reconnectAttemptsRef.current = 0; // Reset reconnect attempts
			isIntentionallyClosedRef.current = false;

			// Get config and determine the appropriate recall WebSocket URL
			const type = 'meeting_ws_api';
			const meetingWsUrl = getBaseUrl(region, type);
			const wsUrl = `${meetingWsUrl}/frontend/ws/${meetingId}?token=${usertoken}`;
			// const wsUrl = `https://internally-well-earwig.ngrok-free.app/frontend/ws/${pageId}?token=${usertoken}`;

			const connect = () => {
				socketRef.current = new WebSocket(wsUrl);

				socketRef.current.onopen = () => {
					socketRef.current.send(
						JSON.stringify({
							location,
							timezone: 'Asia/Calcutta',
							session_id: meetingId,
							is_ai_intelligence_enabled: isAiIntelligenceEnabled,
						}),
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
							`Attempting to reconnect (${reconnectAttemptsRef.current}/${RECONNECT_ATTEMPTS})...`,
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
		},
		[],
	);

	const closeWebSocketConnection = useCallback(() => {
		isIntentionallyClosedRef.current = true;
		if (socketRef.current) {
			socketRef.current.close();
		}
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
		}
	}, []);

	const sendMessage = useCallback((message) => {
		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			socketRef.current.send(JSON.stringify(message));
		} else {
			console.warn('WebSocket is not connected. Cannot send message:', message);
		}
	}, []);

	return { createWebSocketConnection, closeWebSocketConnection, sendMessage };
};

export default useRecallStream;
