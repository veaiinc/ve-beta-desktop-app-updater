/**
 * Initial state for basic mode
 */
const { meetingInitialState, meetingActions } = require('./meeting/index.js');
const initialState = {
	meeting: {
		...meetingInitialState,
		actions: {
			...meetingActions,
		},
	},
};

module.exports = {
	initialState,
};
