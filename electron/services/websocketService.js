const WebSocket = require('ws');
const log = require('electron-log');
const EventEmitter = require('events');

// WebSocket service state
let wss = null;
let clients = new Set();
let port = 8080; // Default port, can be configured
let isRunning = false;
let eventEmitter = new EventEmitter();

/**
 * Start the WebSocket server
 * @param {number} serverPort - Port to run the server on (optional, defaults to 8080)
 */
function startWebSocketServer(serverPort = 8080) {
	if (isRunning) {
		log.warn('WebSocket server is already running');
		return;
	}

	port = serverPort;

	try {
		wss = new WebSocket.Server({
			port: port,
			perMessageDeflate: false, // Disable compression for better performance
		});

		wss.on('connection', (ws, req) => {
			const clientId = `${req.socket.remoteAddress}:${req.socket.remotePort}`;
			log.info(`WebSocket client connected: ${clientId}`);

			// Add client to our set
			clients.add(ws);

			// Set up client event handlers
			ws.on('message', (data) => {
				handleClientMessage(ws, data, clientId);
			});

			ws.on('close', (code, reason) => {
				log.info(
					`WebSocket client disconnected: ${clientId}, code: ${code}, reason: ${reason}`,
				);
				clients.delete(ws);
				eventEmitter.emit('clientDisconnected', { clientId, code, reason });
			});

			ws.on('error', (error) => {
				log.error(`WebSocket client error for ${clientId}:`, error);
				clients.delete(ws);
				eventEmitter.emit('clientError', { clientId, error });
			});

			// Notify that a client connected
			eventEmitter.emit('clientConnected', { clientId, ws });
		});

		wss.on('error', (error) => {
			log.error('WebSocket server error:', error);
			eventEmitter.emit('serverError', error);
		});

		isRunning = true;
		log.info(`WebSocket server started on port ${port}`);
		eventEmitter.emit('serverStarted', { port: port });
	} catch (error) {
		log.error('Failed to start WebSocket server:', error);
		eventEmitter.emit('serverError', error);
		throw error;
	}
}

/**
 * Stop the WebSocket server
 */
function stopWebSocketServer() {
	if (!isRunning) {
		log.warn('WebSocket server is not running');
		return Promise.resolve();
	}

	return new Promise((resolve) => {
		// Close all client connections
		clients.forEach((ws) => {
			if (ws.readyState === WebSocket.OPEN) {
				ws.close(1000, 'Server shutting down');
			}
		});
		clients.clear();

		// Close the server
		if (wss) {
			wss.close(() => {
				wss = null;
				isRunning = false;
				log.info('WebSocket server stopped');
				eventEmitter.emit('serverStopped');
				resolve();
			});
		} else {
			isRunning = false;
			resolve();
		}
	});
}

/**
 * Handle incoming messages from clients
 * @param {WebSocket} ws - The WebSocket connection
 * @param {Buffer|string} data - The message data
 * @param {string} clientId - The client identifier
 */
function handleClientMessage(ws, data, clientId) {
	try {
		let message;

		// Try to parse as JSON, fallback to string
		try {
			message = JSON.parse(data.toString());
		} catch {
			message = data.toString();
		}

		log.info(`WebSocket message from ${clientId}:`, message);

		// Emit the message event for the main process to handle
		eventEmitter.emit('message', {
			clientId,
			ws,
			data: message,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		log.error(`Error handling message from ${clientId}:`, error);
		eventEmitter.emit('messageError', { clientId, error, data });
	}
}

/**
 * Send data to a specific client
 * @param {WebSocket} ws - The WebSocket connection
 * @param {any} data - Data to send
 */
function sendToClient(ws, data) {
	if (ws.readyState === WebSocket.OPEN) {
		try {
			const message = typeof data === 'string' ? data : JSON.stringify(data);
			ws.send(message);
			log.info('Data sent to WebSocket client');
		} catch (error) {
			log.error('Error sending data to WebSocket client:', error);
		}
	} else {
		log.warn('Cannot send data: WebSocket connection is not open');
	}
}

/**
 * Broadcast data to all connected clients
 * @param {any} data - Data to broadcast
 */
function broadcastToClients(data) {
	if (clients.size === 0) {
		log.warn('No clients connected to broadcast to');
		return;
	}

	const message = typeof data === 'string' ? data : JSON.stringify(data);
	let sentCount = 0;

	clients.forEach((ws) => {
		if (ws.readyState === WebSocket.OPEN) {
			try {
				ws.send(message);
				sentCount++;
			} catch (error) {
				log.error('Error broadcasting to client:', error);
			}
		}
	});

	log.info(`Broadcasted data to ${sentCount} clients`);
}

/**
 * Get server status information
 */
function getWebSocketStatus() {
	return {
		isRunning: isRunning,
		port: port,
		clientCount: clients.size,
		clients: Array.from(clients).map((ws, index) => ({
			id: index,
			readyState: ws.readyState,
			protocol: ws.protocol,
		})),
	};
}

/**
 * Get the number of connected clients
 */
function getWebSocketClientCount() {
	return clients.size;
}

/**
 * Check if the server is running
 */
function isWebSocketServerRunning() {
	return isRunning;
}

/**
 * Get the event emitter for listening to WebSocket events
 */
function getWebSocketEventEmitter() {
	return eventEmitter;
}

// Export all functions
module.exports = {
	start: startWebSocketServer,
	stop: stopWebSocketServer,
	sendToClient,
	broadcast: broadcastToClients,
	getStatus: getWebSocketStatus,
	getClientCount: getWebSocketClientCount,
	isServerRunning: isWebSocketServerRunning,
	on: (event, listener) => eventEmitter.on(event, listener),
	off: (event, listener) => eventEmitter.off(event, listener),
	emit: (event, data) => eventEmitter.emit(event, data),
};
