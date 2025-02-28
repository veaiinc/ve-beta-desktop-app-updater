import React, { useCallback, useRef } from 'react';

const useChatStream = () => {
	const socketRef = useRef(null);

	const createWebSocketConnection = useCallback((sessionId, onMessageFunc, onSendMessageFunc) => {
		const usertoken = localStorage.getItem('usertoken');
		const workspaceId = localStorage.getItem('workspaceId');
		const baseUrl = `wss://ai.ap-south-1.ve.ai/${workspaceId}/${sessionId}/multi_agent_chat_streaming?token=${usertoken}`;
		if (socketRef.current) {
			socketRef.current.close();
		}
		socketRef.current = new WebSocket(baseUrl);
		socketRef.current.onopen = () => {
			console.log('Connected to WebSocket server');
		};

		socketRef.current.onclose = () => {
			console.log('Disconnected from WebSocket server');
		};

		socketRef.current.onmessage = (event) => {
			if (onMessageFunc) {
				onMessageFunc(event);
			}
		};
	}, []);

	return { socketRef, createWebSocketConnection };
};

export default useChatStream;
