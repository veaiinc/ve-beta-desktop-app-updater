import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './action';
import * as API from './actionTypes';
import service from '../../services/index';

export const initialState = {
	calendarChat: null,
};

export const Calendar = () => {
	const [state, dispatch] = useReducer(Reducer, initialState);

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

	return {
		...state,
		getCalendarChat,
	};
};
