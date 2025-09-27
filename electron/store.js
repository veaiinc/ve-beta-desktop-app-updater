const { create } = require('zustand');
const { createMeetingHandlers } = require('./features/meeting/index.js');
const { initialState } = require('./features/index.js');

/**
 * Creates a Zustand store for the basic mode
 * In basic mode, action handlers are attached directly to the store state
 */
function createStore() {
	console.log('[Basic Mode] Creating Zustand store');

	const store = create(() => initialState);

	// Create action handlers using the features pattern
	const meetingHandlers = createMeetingHandlers(store);

	// Attach action handlers to the store (basic mode pattern)
	store.setState((state) => ({
		...state,
		...meetingHandlers,
	}));

	return store;
}

module.exports = { createStore };
