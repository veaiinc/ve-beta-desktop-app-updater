import service from '../../services/graphQlServices';
import { message } from 'antd';
import { getListItemsQuery, addListItemMutation } from './graphQlFunctions';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';

export const intialState = {
	listTask: null,
	newTask: null,
};

export const TasksState = () => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const getListItems = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getListItemsQuery,
				payload,
				workspaceId,
				usertoken,
				'tasks_api',
			);

			if (response?.[0]) {
				dispatch({ type: Actions.SET_LIST_ITEMS, payload: response?.[1]?.data?.listTasks });
			} else {
				console.log('API failed ==> getListItems', response);
			}
		} catch (error) {
			console.log('API failed ==> getListItems', error);
		}
	};

	const addListItem = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				addListItemMutation,
				payload,
				workspaceId,
				usertoken,
				'tasks_api',
			);

			if (response?.[0]) {
				return response?.[1]?.data;
			} else {
				console.log('API failed ==> addListItem', response);
			}
		} catch (error) {
			console.log('API failed ==> addListItem', error);
		}
	};

	const resetTasksState = () => {
		dispatch({ type: Actions.RESET_STATE });
	};

	return {
		...state,
		getListItems,
		addListItem,
		resetTasksState,
	};
};
