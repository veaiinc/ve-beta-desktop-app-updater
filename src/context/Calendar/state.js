import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './action';
import * as API from './actionTypes';
import service from '../../services/index';

export const initialState = {
	calendarChat: null,
	calendarEventsList: null,
	calendarEvent: null,
	calendarCategories: [
		{
			_id: '67545979fff2778018662c04',
			name: 'default',
			color: '#FF5DFF',
		},
		{
			_id: '6756bd034d270350621026e3',
			name: 'meeting',
			color: '#DFFF72',
		},
		{
			_id: '6756d1512488f1e7592d7b33',
			name: 'host',
			color: '#6ff535',
		},
	],
};

export const Calendar = () => {
	const [state, dispatch] = useReducer(Reducer, initialState);

	// Calendar AI Apis ================================>
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

	// Calendar Categories Apis ================================>
	const createCalendarCategory = async (body) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.createCalendarCategory}`;
			const response = await service.fetchPost(url, body, usertoken, 'calendar_api');

			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_CALENDAR_CATEGORIES,
					payload: response?.[1]?.data,
				});
			} else {
				dispatch({
					type: Actions.CREATE_CALENDAR_CATEGORY,
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
					payload: response?.[1]?.data,
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
			const url = `/${workspaceId}${API.CALENDAR.calendarCategories}`;
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

	// Calendar Events Apis ================================>
	const getCalendarEventsList = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}${API.CALENDAR.calendarEventsList}`;

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

	const resetCalendarState = () => {
		dispatch({ type: Actions.RESET_CALENDAR_STATE });
	};

	return {
		...state,
		getCalendarChat,
		getCalendarEventsList,
		createCalendarEvent,
		resetCalendarState,
		sendEventToAi,
		createCalendarCategory,
		updateCalendarCategory,
		getCalendarCategories,
		deleteCalendarCategory,
	};
};
