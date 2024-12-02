import { initialState } from './state';

const actionHandlers = {
	GET_CALENDAR_CHAT: (state, action) => ({
		...state,
		calendarChat: action.payload,
	}),
	GET_CALENDAR_EVENTS_LIST: (state, action) => ({
		...state,
		calendarEventsList: action.payload,
	}),
	RESET_CALENDAR_STATE: () => ({ ...initialState }),
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
