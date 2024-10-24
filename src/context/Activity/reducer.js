import { initialActivityState } from './state';
const actionHandlers = {
	GET_SMART_FILE_ACTIVITY_SUCCESS: (state, action) => ({
		...state,
		activityData: action.payload,
		loading: false,
	}),
	GET_SMART_FILE_VIEWERS_SUCCESS: (state, action) => ({
		...state,
		viewersList: action.payload,
		loading: false,
	}),
	GET_VIEWERS_SESSION_DETAILS_SUCCESS: (state, action) => ({
		...state,
		viewerSessionDetails: action.payload,
		loading: false,
	}),
	RESET_ACTIVITY_STATE: () => initialActivityState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
