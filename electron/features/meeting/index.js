const meetingActions = {
	SET_PAST_MEETINGS: 'SET_PAST_MEETINGS',
};

const meetingInitialState = {
	pastMeetings: null,
};

const createMeetingHandlers = (store) => {
	return {
		[meetingActions.SET_PAST_MEETINGS]: (meetings) => {
			console.log('[Basic] Incrementing counter');
			store.setState((state) => ({
				...state,
				meeting: {
					...state.meeting,
					pastMeetings: meetings,
				},
			}));
		},
	};
};

module.exports = { createMeetingHandlers, meetingInitialState, meetingActions };
