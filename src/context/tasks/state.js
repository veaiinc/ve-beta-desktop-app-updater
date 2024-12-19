import service from '../../services/graphQlServices';
import {
	getListItemsQuery,
	addListItemMutation,
	updateListItemMutation,
	deleteListItemMutation,
	getTaskQuery,
	getSubTasksQuery,
} from './graphQlFunctions';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';

export const intialState = {
	listTask: null,
	newTask: null,
	subTasks: null,
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
				'workflows_Api',
			);

			if (response?.[0]) {
				dispatch({ type: Actions.SET_LIST_ITEMS, payload: response?.[1]?.data?.listTasks });
			} else {
				console.log('API failed ==> getListItems', response);
				dispatch({
					type: Actions.SET_LIST_ITEMS,
					payload: { error: 'Failed to fetch tasks, try again' },
				});
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
				'workflows_Api',
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

	const updateListItem = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');

			const response = await service.mutation(
				updateListItemMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			return response;
		} catch (error) {
			console.log('API failed ==> updateListItem', error);
		}
	};

	const getTask = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getTaskQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return response?.[1]?.data;
			} else {
				console.log('API failed ==> getTask', response);
			}
		} catch (error) {
			console.log('API failed ==> getTask', error);
		}
	};

	const deleteListItem = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				deleteListItemMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return response?.[1]?.data;
			} else {
				console.log('API failed ==> deleteListItem', response);
			}
		} catch (error) {
			console.log('API failed ==> deleteListItem', error);
		}
	};

	const getSubTasks = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getSubTasksQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.SET_SUB_TASKS,
					payload: { data: response?.[1]?.data?.listChildTasks },
				});
			} else {
				dispatch({
					type: Actions.SET_SUB_TASKS,
					payload: { error: 'Failed to fetch sub tasks, try again' },
				});
				console.log('API failed ==> getSubTasks', response);
			}
		} catch (error) {
			console.log('API failed ==> getSubTasks', error);
		}
	};

	const addSubTask = (payload) => {
		dispatch({ type: Actions.ADD_SUB_TASK, payload });
	};

	const removeSubTask = (payload) => {
		dispatch({ type: Actions.REMOVE_SUB_TASK, payload });
	};

	const resetSubTasks = () => {
		dispatch({ type: Actions.RESET_SUB_TASKS });
	};

	const resetTasksState = () => {
		dispatch({ type: Actions.RESET_STATE });
	};

	return {
		...state,
		getListItems,
		addListItem,
		updateListItem,
		deleteListItem,
		getTask,
		getSubTasks,
		addSubTask,
		removeSubTask,
		resetSubTasks,
		resetTasksState,
	};
};
