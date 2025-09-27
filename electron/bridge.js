const { createZustandBridge } = require('@zubridge/electron/main');

/**
 * Creates a bridge using the basic approach
 * In basic mode, action handlers are attached directly to the store state
 */
function createBridge(store, middleware) {
	console.log('[Basic Mode] Creating bridge with attached handlers');

	// Create bridge with the store that has handlers attached
	return createZustandBridge(store, { middleware });
}

module.exports = { createBridge };
