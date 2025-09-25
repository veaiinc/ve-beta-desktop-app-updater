/**
 * Creates action handlers for counter operations in basic mode
 * In basic mode, these handlers are attached directly to the store state
 *
 * const
 */

const meetingActions = {
	INCREMENT: 'COUNTER:INCREMENT',
	DECREMENT: 'COUNTER:DECREMENT',
	SET: 'COUNTER:SET',
	RESET: 'COUNTER:RESET',
};

const meetingInitialState = {
	counter: 0,
};

const createMeetingHandlers = (store) => {
	return {
		incrementMeeting: () => {
			console.log('[Basic] Incrementing counter');
			store.setState((state) => ({
				...state,
				meeting: {
					...state.meeting,
					counter: state.meeting.counter + 1,
				},
			}));
		},
		decrementMeeting: () => {
			console.log('[Basic] Decrementing counter');
			store.setState((state) => ({
				...state,
				meeting: {
					...state.meeting,
					counter: state.meeting.counter - 1,
				},
			}));
		},
	};
};

module.exports = { createMeetingHandlers, meetingInitialState, meetingActions };
