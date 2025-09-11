const actionHandlers = {
	UPDATE_ONGOING_MEETING_INFO: (state, action) => ({
		...state,
		ongoingMeetingInfo: action.payload,
	}),
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
