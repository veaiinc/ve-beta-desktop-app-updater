// socketManager.js;
import { io } from 'socket.io-client';

const socketInstances = {}; // { key: socket }
const workspaceId = localStorage?.getItem('workspaceId');

const connectBrowserSocket = ({ sessionId, onData }) => {
	// If already connected, just return
	if (socketInstances[sessionId] && socketInstances[sessionId]?.connected) {
		console.log(`[Browser Socket] Already connected: ${sessionId}`);
		return;
	}

	const socket = io('wss://browser.us-east-1.ve.ai', {
		transports: ['websocket'],
		autoConnect: true,
		path: '/socket.io',
		reconnection: false,
	});

	socket.on('connect', () => {
		console.log(`[Browser Socket] Connected: ${sessionId}`);
		// Automatically join + subscribe
		socket.emit('join-session', sessionId);
		socket.emit('subscribe', { workspaceId, sessionId });
	});

	socket.on('disconnect', (reason) => {
		console.log(`[Browser Socket] Disconnected (${sessionId}): ${reason}`);
		delete socketInstances[sessionId];
	});

	// Example events - handle inside socket and forward to onData
	socket.on('new-tab-detected', (data) => console.log('new-tab-detected', data));
	socket.on('tab-activated', (data) => console.log('tab-activated', data));
	socket.on('live-stream-update', (data) => console.log('live-stream-update', data));
	socket.on('tab-deleted', (data) => console.log('tab-deleted', data));

	socketInstances[sessionId] = socket;
};

// const socketInstances = {};
// const workspaceId = localStorage?.getItem('workspaceId');
// const MAX_RETRY_ATTEMPTS = 30;
// const RETRY_DELAY = 1000;

// const createWebSocketConnection = (sessionId) => {
// 	const url = `wss://browser.us-east-1.ve.ai/socket.io?token=${usertoken}`;
// 	socketInstances[sessionId] = new WebSocket(url);

// 	socketInstances[sessionId].onopen = () => {
// 		console.log('Browser WebSocket connection opened');
// 	};

// 	socketInstances[sessionId].onmessage = (event) => {
// 		console.log('Browser WebSocket message received', event);
// 	};

// 	socketInstances[sessionId].onclose = () => {
// 		console.log('Browser WebSocket connection closed');
// 		delete socketInstances[sessionId];
// 	};

// 	socketInstances[sessionId].onerror = (event) => {
// 		console.log('BrowserWebSocket error', event);
// 	};
// };

// const establishSocketConnection = (sessionId) => {
// 	let attempts = 0;

// 	const attemptConnection = () => {
// 		if (attempts >= MAX_RETRY_ATTEMPTS) {
// 			console.log('Max retry attempts reached. Giving up.');
// 			return;
// 		}

// 		// If socket doesn't exist or is closed, try to reconnect
// 		if (
// 			!socketInstances[sessionId] ||
// 			socketInstances[sessionId]?.readyState === WebSocket.CLOSED
// 		) {
// 			createWebSocketConnection(sessionId);
// 			attempts++;
// 			setTimeout(attemptConnection, RETRY_DELAY);
// 			return;
// 		}

// 		// If socket is still connecting, wait and retry
// 		if (socketInstances[sessionId].readyState === WebSocket.CONNECTING) {
// 			console.log('Connection not ready, waiting...');
// 			attempts++;
// 			setTimeout(attemptConnection, RETRY_DELAY);
// 			return;
// 		}

// 		// If socket is ready, send the message
// 		if (socketInstances[sessionId].readyState === WebSocket.OPEN) {
// 			console.log('Browser WebSocket connection ready');
// 			return;
// 		}
// 	};

// 	attemptConnection();
// };

// export { establishSocketConnection };

export { connectBrowserSocket };
