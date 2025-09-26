const meetingActions = {
	SET_PAST_MEETINGS: 'SET_PAST_MEETINGS',
	SET_ACTIVE_MEETING_ID: 'SET_ACTIVE_MEETING_ID',
};

const meetingInitialState = {
	pastMeetings: null,
	activeMeetingId: null,
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
		[meetingActions.SET_ACTIVE_MEETING_ID]: (meetingId) => {
			store.setState((state) => ({
				...state,
				meeting: {
					...state.meeting,
					activeMeetingId: meetingId,
				},
			}));
		},
	};
};

module.exports = { createMeetingHandlers, meetingInitialState, meetingActions };
