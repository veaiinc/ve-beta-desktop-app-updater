import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './action';
import * as API from './actionTypes';
import service from '../../services/index';
import moment from 'moment';

export const initialState = {
	calendarChat: null,
	calendarEventsList: null,
	calendarEvent: null,
	calendarEventDetails: null,
	calendarCategories: null,
	deletedEvent: null,
	refetchCalendarState: false,
	calendarCategoriesList: null,
};

export const initialSchedulerState = {
	schedulerList: null,
	createdSession: null,
	sessionDetail: null,
};

export const initialGoogleCalendarState = {
	googleCalendarList: null,
	calendarEventsFromGoogle: null,
	googleCalendarEvent: null,
	googleCalendarWatch: null,
	googleCalendarStop: null,
	googleCalendarEventList: null,
	connectedGoogleCalendars: null,
	googleCalendarEvents: null,
};

export const Calendar = () => {
	const [state, dispatch] = useReducer(Reducer, {
		...initialState,
		...initialSchedulerState,
		...initialGoogleCalendarState,
	});

	// Calendar AI Apis =================>
	const getCalendarChat = async (sessionId, body) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/${sessionId}${API.CALENDAR.calendarChat}`;

			const response = await service.fetchPost(url, body, usertoken, 'calendar_chat');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_CALENDAR_CHAT,
					payload: response?.[1],
				});
			} else {
				dispatch({
					type: Actions.GET_CALENDAR_CHAT,
					payload: { error: 'Something went wrong. Please try again.' },
				});
			}

			return response;
		} catch (error) {
			console.log('error==>getCalendarChat', error);
		}
	};

	const sendEventToAi = async (body) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.sendEventToAi}`;

			await service.fetchPost(url, body, usertoken, 'calendar_chat');
		} catch (error) {
			console.log('error==>sendEventToAi', error);
		}
	};

	// Calendar Categories Apis ==================>
	const createCalendarCategory = async (body) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.getcalendarCategories}`;
			const response = await service.fetchPost(url, body, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_CALENDAR_CATEGORIES,
					payload: response?.[1]?.data,
				});
			} else {
				dispatch({
					type: Actions.GET_CALENDAR_CATEGORIES,
					payload: {
						error: 'Something went wrong while creating category. Please try again.',
					},
				});
			}
		} catch (error) {
			console.log('error==>createCalendarCategory', error);
		}
	};

	const updateCalendarCategory = async (categoryId, body) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.updateCalendarCategory}/${categoryId}`;
			const response = await service.fetchPost(url, body, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.UPDATE_CALENDAR_CATEGORY,
					payload: response?.[1]?.calendarCategories,
				});
			} else {
				dispatch({
					type: Actions.UPDATE_CALENDAR_CATEGORY,
					payload: {
						error: 'Something went wrong while updating category. Please try again.',
					},
				});
			}
		} catch (error) {
			console.log('error==>updateCalendarCategory', error);
		}
	};

	const getCalendarCategories = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.getcalendarCategories}`;
			const response = await service.fetchGet(url, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_CALENDAR_CATEGORIES,
					payload: response?.[1]?.data,
				});
			} else {
				dispatch({
					type: Actions.GET_CALENDAR_CATEGORIES,
					payload: {
						error: 'Something went wrong while fetching categories. Please try again.',
					},
				});
			}
		} catch (error) {
			console.log('error==>getCalendarCategories', error);
		}
	};

	const deleteCalendarCategory = async (categoryId) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.deleteCalendarCategory}/${categoryId}`;
			const response = await service.fetchDelete(url, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.DELETE_CALENDAR_CATEGORY,
					payload: response?.[1]?.data,
				});
			} else {
				dispatch({
					type: Actions.DELETE_CALENDAR_CATEGORY,
					payload: {
						error: 'Something went wrong while deleting category. Please try again.',
					},
				});
			}
		} catch (error) {
			console.log('error==>deleteCalendarCategory', error);
		}
	};

	// Calendar Events Apis =================>
	const getCalendarAllEvents = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.calendarAllEvents}`;

			const response = await service.fetchGet(url, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_CALENDAR_ALL_EVENTS,
					payload: response?.[1]?.data,
				});
			} else {
				dispatch({
					type: Actions.GET_CALENDAR_EVENTS_LIST,
					payload: {
						error: 'Something went wrong while fetching events. Please try again.',
					},
				});
			}
		} catch (error) {
			console.log('error==>getCalendarEventsList', error);
		}
	};

	//Custom calendar Api Call for Events of Google Calendar
	const getGoogleCalendarEvents = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.getGoogleCalendarEventsList}`;

			const response = await service.fetchGet(url, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_GOOGLE_CALENDAR_EVENTS_LIST,
					payload: response?.[1]?.data,
				});
			} else {
				dispatch({
					type: Actions.GET_GOOGLE_CALENDAR_EVENTS_LIST,
					payload: {
						error: 'Something went wrong while fetching google calendar events. Please try again.',
					},
				});
			}
		} catch (error) {
			console.log('error==>getCalendarEventsList', error);
		}
	};

	const getCalendarEventsList = async (fetchDate = moment().format('YYYY-MM-DD')) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');

			const date = moment(fetchDate).format('YYYY-MM-DD');
			const url = `/${workspaceId}${API.CALENDAR.calendarEventsList}?date=${date}`;

			const response = await service.fetchGet(url, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_CALENDAR_EVENTS_LIST,
					payload: response?.[1]?.data,
				});
			} else {
				dispatch({
					type: Actions.GET_CALENDAR_EVENTS_LIST,
					payload: {
						error: 'Something went wrong while fetching events. Please try again.',
					},
				});
			}
		} catch (error) {
			console.log('error==>getCalendarEventsList', error);
		}
	};

	const createCalendarEvent = async (body) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.createCalendarEvent}`;

			const response = await service.fetchPost(url, body, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.CREATE_CALENDAR_EVENT,
					payload: response?.[1]?.data,
				});
			} else {
				dispatch({
					type: Actions.CREATE_CALENDAR_EVENT,
					payload: {
						error: 'Something went wrong while creating event. Please try again.',
					},
				});
			}
		} catch (error) {
			console.log('error==>createCalendarEvent', error);
		}
	};

	const deleteCalendarEvent = async (eventId) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.deleteCalendarEvent}/${eventId}`;
			const response = await service.fetchDelete(url, usertoken, null, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.DELETE_CALENDAR_EVENT,
					payload: response?.[1]?.data,
				});
			} else {
				dispatch({
					type: Actions.DELETE_CALENDAR_EVENT,
					payload: {
						error: 'Something went wrong while deleting event. Please try again.',
					},
				});
			}
		} catch (error) {
			console.log('error==>deleteCalendarEvent', error);
		}
	};

	const getCalendarEventDetails = async (eventId) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.getCalendarEventDetails}/${eventId}`;
			const response = await service.fetchGet(url, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_CALENDAR_EVENT_DETAILS,
					payload: response?.[1]?.data,
				});
			} else {
				dispatch({
					type: Actions.GET_CALENDAR_EVENT_DETAILS,
					payload: {
						error: 'Something went wrong while fetching event details. Please try again.',
					},
				});
			}
		} catch (error) {
			console.log('error==>getCalendarEventDetails', error);
		}
	};

	const updateCalendarEvent = async (eventId, body) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.updateCalendarEvent}/${eventId}`;
			const response = await service.fetchPut(url, body, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.UPDATE_CALENDAR_EVENT,
					payload: response?.[1]?.data,
				});
			} else {
				dispatch({
					type: Actions.UPDATE_CALENDAR_EVENT,
					payload: {
						error: 'Something went wrong while updating event. Please try again.',
					},
				});
			}
		} catch (error) {
			console.log('error==>updateCalendarEvent', error);
		}
	};

	//Scheduler Apis ==============>
	const getSchedulerList = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.schedulerList}`;
			const response = await service.fetchGet(url, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_SCHEDULER_LIST,
					payload: response?.[1]?.sessions,
				});
			} else {
				console.log('API failed ==> getSchedulerList', response);
			}
		} catch (error) {
			console.log('error==>getSchedulerList', error);
		}
	};

	const createSchedulerSession = async (body) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.createSchedulerSession}`;
			const response = await service.fetchPost(url, body, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.CREATE_SCHEDULER_SESSION,
					payload: response?.[1]?.data,
				});
			} else {
				console.log('API failed ==> createSchedulerSession', response);
			}
		} catch (error) {
			console.log('error==>createSchedulerSession', error);
		}
	};

	const getSchedulerSessionDetail = async (sessionId) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/scheduler/${sessionId}${API.CALENDAR.getSchedulerSessionDetail}`;
			const response = await service.fetchGet(url, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_SCHEDULER_SESSION_DETAIL,
					payload: response?.[1]?.data,
				});
			} else {
				console.log('API failed ==> getSchedulerSessionDetail', response);
			}
		} catch (error) {
			console.log('error==>getSchedulerSessionDetail', error);
		}
	};

	const updateSchedulerSession = async (sessionId, body) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/scheduler/${sessionId}${API.CALENDAR.updateSchedulerSession}`;
			const response = await service.fetchPut(url, body, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.UPDATE_SCHEDULER_SESSION,
					payload: response?.[1]?.data,
				});
			} else {
				console.log('API failed ==> updateSchedulerSession', response);
			}
		} catch (error) {
			console.log('error==>updateSchedulerSession', error);
		}
	};

	const resetSchedulerState = () => {
		dispatch({ type: Actions.RESET_SCHEDULER_STATE });
	};

	// Google Calendar Apis =============>

	const getConnectedGoogleCalendars = async (isWorkspaceCalendar = true) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.getConnectedGoogleCalendar}${
				isWorkspaceCalendar ? '?isWorkspaceCalendar=true' : ''
			}`;
			const response = await service.fetchGet(url, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_CONNECTED_GOOGLE_CALENDAR,
					payload: response?.[1],
				});
				return response?.[1];
			} else {
				console.log('API failed ==> getConnectedGoogleCalendar', response);
			}
		} catch (error) {
			console.log('error==>getConnectedGoogleCalendar', error);
		}
	};

	const getGoogleCalendarList = async (isWorkspaceCalendar = true) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.getGoogleCalendarList}${
				isWorkspaceCalendar ? '?isWorkspaceCalendar=true' : ''
			}`;
			const response = await service.fetchGet(url, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_GOOGLE_CALENDAR_LIST,
					payload: response?.[1],
				});
				return response?.[1];
			} else {
				console.log('API failed ==> getGoogleCalendarList', response);
			}
		} catch (error) {
			console.log('error==>getGoogleCalendarList', error);
		}
	};

	const watchGoogleCalendar = async (calendarId, isWorkspaceCalendar = true) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.watchGoogleCalendar}/${calendarId}${
				isWorkspaceCalendar ? '?isWorkspaceCalendar=true' : ''
			}`;
			const response = await service.fetchGet(url, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.WATCH_GOOGLE_CALENDAR,
					payload: response?.[1]?.response,
				});
				return response?.[1].response;
			} else {
				console.log('API failed ==> watchGoogleCalendar', response);
			}
		} catch (error) {
			console.log('error==>watchGoogleCalendar', error);
		}
	};

	const stopGoogleCalendar = async (calendarId, isWorkspaceCalendar = true) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.stopGoogleCalendar}/${calendarId}${
				isWorkspaceCalendar ? '?isWorkspaceCalendar=true' : ''
			}`;
			const response = await service.fetchGet(url, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.STOP_GOOGLE_CALENDAR,
					payload: response?.[1]?.data,
				});
				return response?.[1];
			} else {
				console.log('API failed ==> stopGoogleCalendar', response);
			}
		} catch (error) {
			console.log('error==>stopGoogleCalendar', error);
		}
	};

	const fetchCalendarEventsFromGoogle = async (calendarId, isWorkspaceCalendar = true) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${
				API.CALENDAR.fetchCalendarEventsFromGoogle
			}/${calendarId}${isWorkspaceCalendar ? '?isWorkspaceCalendar=true' : ''}`;
			const response = await service.fetchGet(url, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.FETCH_CALENDAR_EVENTS_FROM_GOOGLE,
					payload: response?.[1]?.data,
				});
				return response?.[1];
			} else {
				console.log('API failed ==> fetchCalendarEventsFromGoogle', response);
			}
		} catch (error) {
			console.log('error==>fetchCalendarEventsFromGoogle', error);
		}
	};

	//Google APi Call for Events List
	const getGoogleCalendarEventsList = async (isWorkspaceCalendar = true) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.getGoogleCalendarEventsList}${
				isWorkspaceCalendar ? '?isWorkspaceCalendar=true' : ''
			}`;
			const response = await service.fetchGet(url, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_GOOGLE_CALENDAR_EVENTS_LIST,
					payload: response?.[1],
				});
				return response?.[1];
			} else {
				dispatch({
					type: Actions.GET_GOOGLE_CALENDAR_EVENTS_LIST,
					payload: {
						error: 'Something went wrong while fetching events. Please try again.',
					},
				});
				console.log('API failed ==> getGoogleCalendarEventsList', response);
			}
		} catch (error) {
			console.log('error==>getGoogleCalendarEventsList', error);
		}
	};

	const resetGoogleCalendarState = () => {
		dispatch({ type: Actions.RESET_GOOGLE_CALENDAR_STATE });
	};

	// Calendar State Reset ================================>
	const resetCalendarState = () => {
		dispatch({ type: Actions.RESET_CALENDAR_STATE });
	};

	const resetCalendarAiChat = () => {
		dispatch({ type: Actions.RESET_CALENDAR_AI_CHAT });
	};

	const updateCalendarState = (payload = {}) => {
		dispatch({
			type: Actions.UPDATE_CALENDAR_STATE,
			payload,
		});
	};

	return {
		...state,
		getCalendarChat,
		getCalendarEventsList,
		createCalendarEvent,
		resetCalendarState,
		resetCalendarAiChat,
		sendEventToAi,
		createCalendarCategory,
		updateCalendarEvent,
		deleteCalendarEvent,
		updateCalendarCategory,
		getCalendarCategories,
		deleteCalendarCategory,
		getCalendarEventDetails,
		getCalendarAllEvents,
		updateCalendarState,
		getGoogleCalendarEvents,

		getSchedulerList,
		createSchedulerSession,
		getSchedulerSessionDetail,
		updateSchedulerSession,
		resetSchedulerState,

		getConnectedGoogleCalendars,
		getGoogleCalendarList,
		watchGoogleCalendar,
		stopGoogleCalendar,
		getGoogleCalendarEventsList,
		fetchCalendarEventsFromGoogle,
		resetGoogleCalendarState,
	};
};
