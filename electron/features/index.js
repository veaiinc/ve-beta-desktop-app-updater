/**
 * Initial state for basic mode
 */
const { meetingInitialState, meetingActions } = require('./meeting/index.js');
const initialState = {
	meeting: {
		...meetingInitialState,
	},
};

const storeActions = {
	meeting: meetingActions,
};

module.exports = {
	initialState,
	storeActions,
};
