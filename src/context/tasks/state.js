import service from '../../services/graphQlServices';
import {
	getListItemsQuery,
	addListItemMutation,
	updateListItemMutation,
	deleteListItemMutation,
	getTaskQuery,
	getSubTasksQuery,
	getTaskStatusLabelQuery,
	getTaskStatusDefaultLabelQuery,
	createTaskStatusLabelMutation,
	updateTaskStatusLabelMutation,
	deleteTaskStatusLabelMutation,
} from './graphQlFunctions';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';

export const intialState = {
	listTask: null,
	newTask: null,
	subTasks: null,
	preferences: null,
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

	const updateSubTask = (payload) => {
		dispatch({ type: Actions.UPDATE_SUB_TASK, payload });
	};

	const resetSubTasks = () => {
		dispatch({ type: Actions.RESET_SUB_TASKS });
	};

	const getTaskStatusLabels = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getTaskStatusLabelQuery,
				{},
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.SET_TASK_METADATA,
					payload: { status: response?.[1]?.data?.listTaskLabels },
				});
			} else {
				console.log('API failed ==> getTaskStatusLabel', response);
			}
		} catch (error) {
			console.log('API failed ==> getTaskStatusLabel', error);
		}
	};

	const getTaskStatusDefaultLabel = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getTaskStatusDefaultLabelQuery,
				{},
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.SET_TASK_METADATA,
					payload: { status: response?.[1]?.data?.listTaskLabels },
				});
			} else {
				console.log('API failed ==> getTaskStatusDefaultLabel', response);
			}
		} catch (error) {
			console.log('API failed ==> getTaskStatusDefaultLabel', error);
		}
	};

	const addNewStatusLabel = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				createTaskStatusLabelMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.ADD_NEW_STATUS_LABEL,
					payload: response?.[1]?.data?.createTaskLabel,
				});
			} else {
				console.log('API failed ==> addNewStatus', response);
			}
		} catch (error) {
			console.log('API failed ==> addNewStatus', error);
		}
	};

	const updateStatusLabel = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				updateTaskStatusLabelMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.UPDATE_STATUS_LABEL,
					payload: response?.[1]?.data?.updateTaskLabel,
				});
			} else {
				console.log('API failed ==> updateStatusLabel', response);
			}
		} catch (error) {
			console.log('API failed ==> updateStatusLabel', error);
		}
	};

	const deleteStatusLabel = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				deleteTaskStatusLabelMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.DELETE_STATUS_LABEL,
					payload: { _id: payload.labelId },
				});
			} else {
				console.log('API failed ==> deleteStatusLabel', response);
			}
		} catch (error) {
			console.log('API failed ==> deleteStatusLabel', error);
			throw error;
		}
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
		updateSubTask,
		resetSubTasks,
		getTaskStatusLabels,
		getTaskStatusDefaultLabel,
		addNewStatusLabel,
		updateStatusLabel,
		deleteStatusLabel,
		resetTasksState,
	};
};
