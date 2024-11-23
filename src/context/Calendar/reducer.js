import { initialState } from './state';

const actionHandlers = {
	GET_CALENDAR_CHAT: (state, action) => ({
		...state,
		calendarChat: action.payload,
	}),
	RESET_CALENDAR_STATE: () => ({ ...initialState }),
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
