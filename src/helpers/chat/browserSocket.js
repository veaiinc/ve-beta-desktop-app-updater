// socketManager.js
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

export { connectBrowserSocket };
