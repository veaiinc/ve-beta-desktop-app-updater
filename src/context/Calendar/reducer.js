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

	CREATE_CALENDAR_EVENT: (state, action) => ({
		...state,
		calendarEvent: action.payload,
	}),

	CREATE_CALENDAR_CATEGORY: (state, action) => ({
		...state,
		calendarCategories: action.payload,
	}),

	UPDATE_CALENDAR_CATEGORY: (state, action) => ({
		...state,
		calendarCategories: action.payload,
	}),

	GET_CALENDAR_CATEGORIES: (state, action) => ({
		...state,
		calendarCategories: action.payload,
	}),

	DELETE_CALENDAR_CATEGORY: (state, action) => ({
		...state,
		calendarCategories: action.payload,
	}),

	GET_CALENDAR_EVENT_DETAILS: (state, action) => ({
		...state,
		calendarEventDetails: action.payload,
	}),

	RESET_CALENDAR_STATE: () => ({ ...initialState }),

	RESET_CALENDAR_AI_CHAT: (state) => ({
		...state,
		calendarChat: null,
	}),
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
