// import { browser_ws_api_US, browser_ws_api } from '../../services/config.live';
// const socketInstances = {};
// const workspaceId = localStorage?.getItem('workspaceId');
// const usertoken = localStorage?.getItem('usertoken');
// const MAX_RETRY_ATTEMPTS = 15;
// const RETRY_DELAY = 1000;

// const createWebSocketConnection = (sessionId, onMessageFunc) => {
// 	const region = localStorage?.getItem('region');
// 	const browserUrl = region === 'ap-south-1' ? browser_ws_api : browser_ws_api_US;

// 	const url = `${browserUrl}/api/browser/${workspaceId}/live-stream/${sessionId}?token=${usertoken}`;
// 	socketInstances[sessionId] = new WebSocket(url);

// 	socketInstances[sessionId].onopen = () => {
// 		console.log('Browser WebSocket connection opened');
// 	};

// 	socketInstances[sessionId].onmessage = (event) => {
// 		if (onMessageFunc) {
// 			onMessageFunc(event, sessionId);
// 		}
// 	};

// 	socketInstances[sessionId].onclose = () => {
// 		console.log('Browser WebSocket connection closed');
// 		delete socketInstances[sessionId];
// 	};

// 	socketInstances[sessionId].onerror = (event) => {
// 		console.log('BrowserWebSocket error', event);
// 	};
// };

// const establishSocketConnection = (sessionId, onMessageFunc) => {
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
// 			createWebSocketConnection(sessionId, onMessageFunc);
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
