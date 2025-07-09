import { useCallback, useRef, useEffect } from 'react';

const useRecallStream = () => {
	const socketRef = useRef(null);
	const messageHandlerRef = useRef(null);
	let isIntentionallyClosed = false;

	useEffect(() => {
		return () => {
			if (socketRef?.current) {
				socketRef.current?.close();
			}
		};
	}, []);

	const createWebSocketConnection = useCallback((pageId,onMessageFunc) => {
		const usertoken = localStorage.getItem('usertoken');
		const workspaceId = localStorage.getItem('workspaceId');
		const region = localStorage.getItem('region') || 'us-east-1';

		if (socketRef?.current) {
			socketRef.current?.close();
			isIntentionallyClosed = true;
		}

		messageHandlerRef.current = onMessageFunc;

		const wsUrl = `https://gazelle-ruling-monster.ngrok-free.app/frontend/ws/${pageId}?token=${usertoken}`;
		socketRef.current = new WebSocket(wsUrl);

		socketRef.current.onopen = () => {
			console.log('Connected to Recall WebSocket server');
		};

		socketRef.current.onmessage = (event) => {
			if (messageHandlerRef?.current) {
				messageHandlerRef?.current(event);
			}
		};

		socketRef.current.onclose = () => {
			console.log('Disconnected from Recall WebSocket server');
		};

		socketRef.current.onerror = (error) => {
			console.error('Recall WebSocket error:', error);
		};
	}, []);

	return { createWebSocketConnection };
};

export default useRecallStream;
