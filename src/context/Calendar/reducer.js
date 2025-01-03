import { initialState } from './state';

const actionHandlers = {
	GET_CALENDAR_CHAT: (state, action) => ({
		...state,
		calendarChat: action.payload,
	}),

	GET_CALENDAR_ALL_EVENTS: (state, action) => ({
		...state,
		calendarEventsList: action.payload,
	}),

	GET_CALENDAR_EVENTS_LIST: (state, action) => {
		const existingEvents = Array.isArray(state.calendarEventsList)
			? state.calendarEventsList
			: [];
		const newEvents = Array.isArray(action.payload) ? action.payload : [];

		// Create a map of existing events by ID
		const existingEventsMap = new Map(existingEvents.map((event) => [event._id, event]));

		// Add or update events from the new payload
		newEvents.forEach((event) => {
			existingEventsMap.set(event._id, event);
		});

		return {
			...state,
			calendarEventsList: Array.from(existingEventsMap.values()),
		};
	},

	CREATE_CALENDAR_EVENT: (state, action) => ({
		...state,
		calendarEvent: action.payload,
	}),

	DELETE_CALENDAR_EVENT: (state, action) => ({
		...state,
		deletedEvent: action.payload,
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

	UPDATE_CALENDAR_EVENT: (state, action) => ({
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
