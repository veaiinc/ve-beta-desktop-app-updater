import { initialState, initialSchedulerState, initialGoogleCalendarState } from './state';

const actionHandlers = {
	GET_CALENDAR_CHAT: (state, action) => ({
		...state,
		calendarChat: action?.payload,
	}),

	GET_CALENDAR_ALL_EVENTS: (state, action) => ({
		...state,
		calendarEventsList: action?.payload,
	}),

	GET_CALENDAR_EVENTS_LIST: (state, action) => ({
		...state,
		calendarEventsList: action?.payload,
	}),

	CREATE_CALENDAR_EVENT: (state, action) => ({
		...state,
		calendarEvent: action?.payload,
	}),

	DELETE_CALENDAR_EVENT: (state, action) => ({
		...state,
		deletedEvent: action?.payload,
	}),

	UPDATE_CALENDAR_CATEGORY: (state, action) => ({
		...state,
		calendarCategoriesList: action?.payload,
	}),

	GET_CALENDAR_CATEGORIES: (state, action) => ({
		...state,
		calendarCategoriesList: action?.payload,
	}),

	DELETE_CALENDAR_CATEGORY: (state, action) => ({
		...state,
		calendarCategories: action?.payload,
	}),

	GET_CALENDAR_EVENT_DETAILS: (state, action) => ({
		...state,
		calendarEventDetails: action?.payload,
	}),

	UPDATE_CALENDAR_EVENT: (state, action) => ({
		...state,
		calendarEventDetails: action?.payload,
	}),

	RESET_CALENDAR_AI_CHAT: (state) => ({
		...state,
		calendarChat: null,
	}),
	UPDATE_CALENDAR_STATE: (state, action) => ({
		...state,
		...action?.payload,
	}),

	//Scheduler Apis =============>
	GET_SCHEDULER_LIST: (state, action) => ({
		...state,
		schedulerList: action?.payload,
	}),

	CREATE_SCHEDULER_SESSION: (state, action) => ({
		...state,
		createdSession: action?.payload,
	}),

	GET_SCHEDULER_SESSION_DETAIL: (state, action) => ({
		...state,
		sessionDetail: action?.payload,
	}),

	UPDATE_SCHEDULER_SESSION: (state, action) => ({
		...state,
		sessionDetail: action?.payload,
	}),

	// Google Calendar Apis =============>
	GET_CONNECTED_GOOGLE_CALENDAR: (state, action) => ({
		...state,
		connectedGoogleCalendars: action?.payload,
	}),

	GET_GOOGLE_CALENDAR_LIST: (state, action) => ({
		...state,
		googleCalendarList: action?.payload,
	}),

	WATCH_GOOGLE_CALENDAR: (state, action) => ({
		...state,
		googleCalendarWatch: action?.payload,
	}),

	STOP_GOOGLE_CALENDAR: (state, action) => ({
		...state,
		googleCalendarStop: action?.payload,
	}),

	GET_GOOGLE_CALENDAR_EVENTS_LIST: (state, action) => ({
		...state,
		googleCalendarEvents: action?.payload,
	}),

	FETCH_CALENDAR_EVENTS_FROM_GOOGLE: (state, action) => ({
		...state,
		calendarEventsFromGoogle: action?.payload,
	}),

	RESET_CALENDAR_STATE: () => ({ ...initialState }),

	RESET_SCHEDULER_STATE: () => ({ ...initialSchedulerState }),

	RESET_GOOGLE_CALENDAR_STATE: () => ({ ...initialGoogleCalendarState }),
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
