const meetingActions = {
	SET_PAST_MEETINGS: 'SET_PAST_MEETINGS',
	SET_ACTIVE_MEETING_ID: 'SET_ACTIVE_MEETING_ID',
	ADD_SUMMARY_IN_PROGRESS: 'ADD_SUMMARY_IN_PROGRESS',
	REMOVE_SUMMARY_IN_PROGRESS: 'REMOVE_SUMMARY_IN_PROGRESS',
	SET_UPCOMING_MEETINGS: 'SET_UPCOMING_MEETINGS',
	SET_PREPARING_SUMMARY: 'SET_PREPARING_SUMMARY',
};

const meetingInitialState = {
	pastMeetings: null,
	upcomingMeetings: null,
	activeMeetingId: null,
	summaryInProgress: [],
	preparingSummary: false,
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
		[meetingActions.ADD_SUMMARY_IN_PROGRESS]: (meetingId) => {
			store.setState((state) => ({
				...state,
				meeting: {
					...state.meeting,
					summaryInProgress: [...state.meeting.summaryInProgress, meetingId],
				},
			}));
		},
		[meetingActions.REMOVE_SUMMARY_IN_PROGRESS]: (meetingId) => {
			store.setState((state) => ({
				...state,
				meeting: {
					...state.meeting,
					summaryInProgress: state.meeting.summaryInProgress.filter(
						(s) => s !== meetingId,
					),
				},
			}));
		},
		[meetingActions.SET_UPCOMING_MEETINGS]: (meetings) => {
			store.setState((state) => ({
				...state,
				meeting: {
					...state.meeting,
					upcomingMeetings: meetings,
				},
			}));
		},
		[meetingActions.SET_PREPARING_SUMMARY]: (preparing) => {
			store.setState((state) => ({
				...state,
				meeting: {
					...state.meeting,
					preparingSummary: preparing,
				},
			}));
		},
	};
};

module.exports = { createMeetingHandlers, meetingInitialState, meetingActions };
