import service from '../../services/graphQlServices';
import restService from '../../services';

import {
	getListItemsQuery,
	getListItemsByTenantUserQuery,
	addListItemMutation,
	updateListItemMutation,
	deleteListItemMutation,
	getTaskQuery,
	getTasksCountQuery,
	getSubTasksQuery,
	getTaskStatusLabelQuery,
	getTaskStatusDefaultLabelQuery,
	createTaskStatusLabelMutation,
	updateTaskStatusLabelMutation,
	deleteTaskStatusLabelMutation,
	updateTaskViewMutation,
	deleteTaskViewMutation,
	taskMetadataQuery,
	listTaskWithGroupQuery,
} from './graphQlFunctions';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';

export const intialState = {
	listTasks: null,
	listTasksForToday: null,
	listTasksForOverdue: null,
	listTasksDueTillToday: null,
	newTask: null,
	subTasks: null,
	tasksCountForToday: null,
	tasksCountForOverdue: null,
	preferences: null,
	taskMetadata: null,
	taskPreference: null,
	refetchTasks: false,
	refetchTasksForDue: false,
	listTaskWithGroup: null,
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
				dispatch({
					type: Actions?.SET_LIST_ITEMS,
					payload: response?.[1]?.data?.listTasks,
				});
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

	const getListTasksDueTillToday = async (payload, type = null, task = null) => {
		try {
			if (task !== null && type !== null) {
				const taskId = task?._id;
				if (state?.listTasksDueTillToday) {
					if (type === 'update') {
						const updatedList = state?.listTasksDueTillToday?.data?.map((item) => {
							if (item?._id === taskId) {
								return { ...task };
							}
							return item;
						});

						dispatch({
							type: Actions.SET_LIST_TASKS_DUE_TILL_TODAY,
							payload: { ...state?.listTasksDueTillToday, data: updatedList },
						});
						return;
					}
					if (type === 'delete') {
						const updatedList = state?.listTasksDueTillToday?.data?.filter(
							(item) => item?._id !== taskId,
						);
						dispatch({
							type: Actions.SET_LIST_TASKS_DUE_TILL_TODAY,
							payload: { ...state?.listTasksDueTillToday, data: updatedList },
						});
						return;
					}
				}
				return;
			}

			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getListItemsByTenantUserQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				const resp = response?.[1]?.data?.listTasksByTenantUser;
				dispatch({
					type: Actions.SET_LIST_TASKS_DUE_TILL_TODAY,
					payload: {
						...resp,
						data: Array.isArray(state?.listTasksDueTillToday?.data)
							? state?.listTasksDueTillToday?.data?.concat(resp?.data)
							: resp?.data,
					},
				});
			} else {
				console.log('API failed ==> getListTasksDueTillToday', response);
				dispatch({
					type: Actions.SET_LIST_TASKS_FOR_TODAY,
					payload: { error: 'Failed to fetch tasks, try again' },
				});
			}
		} catch (error) {
			console.log('API failed ==> getListTasksDueTillToday', error);
		}
	};
	const getListTasksForToday = async (payload, type = null, task = null) => {
		try {
			if (task !== null && type !== null) {
				if (state?.listTasksForToday) {
					const taskId = task?._id;
					if (type === 'update') {
						const updatedList = state?.listTasksForToday?.data?.map((item) => {
							if (item?._id === taskId) {
								return task;
							}
							return item;
						});
						dispatch({
							type: Actions.SET_LIST_TASKS_FOR_TODAY,
							payload: { ...state?.listTasksForToday, data: updatedList },
						});
						return;
					}
					if (type === 'delete') {
						const updatedList = state?.listTasksForToday?.data?.filter(
							(item) => item?._id !== taskId,
						);
						dispatch({
							type: Actions.SET_LIST_TASKS_FOR_TODAY,
							payload: { ...state?.listTasksForToday, data: updatedList },
						});
						return;
					}
				}
				return;
			}

			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');

			const response = await service.query(
				getListItemsByTenantUserQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				const resp = response?.[1]?.data?.listTasksByTenantUser;
				dispatch({
					type: Actions.SET_LIST_TASKS_FOR_TODAY,
					payload: {
						...resp,
						data: Array.isArray(state?.listTasksForToday?.data)
							? state?.listTasksForToday?.data?.concat(resp?.data)
							: resp?.data,
					},
				});
			} else {
				console.log('API failed ==> getListTasksForToday', response);
				dispatch({
					type: Actions.SET_LIST_TASKS_FOR_TODAY,
					payload: { error: 'Failed to fetch tasks, try again' },
				});
			}
		} catch (error) {
			console.log('API failed ==> getListTasksForToday', error);
		}
	};

	const getListTasksForOverdue = async (payload, type = null, task = null) => {
		try {
			if (task !== null && type !== null) {
				if (state?.listTasksForOverdue) {
					const taskId = task?._id;
					if (type === 'update') {
						const updatedList = state?.listTasksForOverdue?.data?.map((item) => {
							if (item?._id === taskId) {
								return task;
							}
							return item;
						});

						dispatch({
							type: Actions.SET_LIST_TASKS_FOR_OVERDUE,
							payload: { ...state?.listTasksForOverdue, data: updatedList },
						});
						return;
					}
					if (type === 'delete') {
						const updatedList = state?.listTasksForOverdue?.data?.filter(
							(item) => item?._id !== taskId,
						);
						dispatch({
							type: Actions.SET_LIST_TASKS_FOR_OVERDUE,
							payload: { ...state?.listTasksForOverdue, data: updatedList },
						});
						return;
					}
				}
				return;
			}

			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getListItemsByTenantUserQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				const resp = response?.[1]?.data?.listTasksByTenantUser;
				dispatch({
					type: Actions.SET_LIST_TASKS_FOR_OVERDUE,
					payload: {
						...resp,
						data: Array.isArray(state?.listTasksForOverdue?.data)
							? state?.listTasksForOverdue?.data?.concat(resp?.data)
							: resp?.data,
					},
				});
			} else {
				console.log('API failed ==> getListTasksForOverdue', response);
				dispatch({
					type: Actions.SET_LIST_TASKS_FOR_OVERDUE,
					payload: { error: 'Failed to fetch tasks, try again' },
				});
			}
		} catch (error) {
			console.log('API failed ==> getListTasksForOverdue', error);
		}
	};

	const getTasksCountForToday = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const payload = {
				filters: {
					limit: 1,
					page: 1,
					startDate: Math?.floor(new Date()?.setHours(0, 0, 0, 0) / 1000),
					endDate: Math?.floor(new Date()?.setHours(23, 59, 59, 999) / 1000),
				},
			};
			const response = await service?.query(
				getTasksCountQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				dispatch({
					type: Actions.SET_TASKS_COUNT_FOR_TODAY,
					payload: response?.[1]?.data?.listTasksByTenantUser?.totalDocs,
				});
			} else {
				console.log('API failed ==> getTasksCountForToday', response);
				dispatch({
					type: Actions.SET_TASKS_COUNT_FOR_TODAY,
					payload: { error: 'Failed to fetch tasks count for today, try again' },
				});
			}
		} catch (error) {
			console.log('API failed ==> getTasksCountForToday', error);
		}
	};

	const getTasksCountForOverdue = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const payload = {
				filters: {
					limit: 1,
					page: 1,
					endDate: Math?.floor(new Date()?.setHours(-1, 59, 59, 999) / 1000),
				},
			};
			const response = await service.query(
				getTasksCountQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				dispatch({
					type: Actions.SET_TASKS_COUNT_FOR_OVERDUE,
					payload: response?.[1]?.data?.listTasksByTenantUser?.totalDocs,
				});
			} else {
				console.log('API failed ==> getTasksCountForOverdue', response);
				dispatch({
					type: Actions.SET_TASKS_COUNT_FOR_OVERDUE,
					payload: { error: 'Failed to fetch tasks count for overdue, try again' },
				});
			}
		} catch (error) {
			console.log('API failed ==> getTasksCountForOverdue', error);
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
			}
			return response;
		} catch (error) {
			console.log('API failed ==> addNewStatus', error);
		}
	};

	const updateStatusLabel = async (payload, oldGroup) => {
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
				if (payload?.input?.order !== undefined) {
					dispatch({
						type: Actions.UPDATE_STATUS_LABEL_ORDER,
						payload: {
							data: response?.[1]?.data?.updateTaskLabel,
							oldGroup: oldGroup,
							order: payload?.input?.order,
						},
					});
				} else {
					dispatch({
						type: Actions.UPDATE_STATUS_LABEL,
						payload: response?.[1]?.data?.updateTaskLabel,
					});
				}
			}
			return response;
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
					payload: { _id: payload.labelId, group: payload.group },
				});
			}
			return response;
		} catch (error) {
			console.log('API failed ==> deleteStatusLabel', error);
		}
	};

	const getTaskMetadata = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				taskMetadataQuery,
				{},
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.SET_TASK_METADATA,
					payload: response?.[1]?.data?.getTaskMetadata,
				});
			}
		} catch (error) {
			console.log('API failed ==> getTaskMetadata', error);
		}
	};

	const resetTasksState = () => {
		dispatch({ type: Actions.RESET_STATE });
	};

	const updateTaskState = (payload) => {
		dispatch({
			type: Actions.UPDATE_TASK_STATE,
			payload,
		});
	};

	const updateTaskViews = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				updateTaskViewMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.UPDATE_TASK_VIEWS,
					payload: response?.[1]?.data?.updateTaskView?.views,
				});
			}
		} catch (error) {
			console.log('API failed ==> updateTaskViews', error);
		}
	};

	const deleteTaskView = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				deleteTaskViewMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.DELETE_TASK_VIEW,
					payload: payload?.viewId,
				});
			}
		} catch (error) {
			console.log('API failed ==> deleteTaskView', error);
		}
	};

	const getTaskPreferences = async (data) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const response = await restService.fetchGet(
				`/${workspaceId}/tenantuser-preference`,
				usertoken,
				'tenant',
				data,
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.SET_TASK_PREFERENCES,
					payload: { data: response?.[1] },
				});
			} else {
				dispatch({
					type: Actions.SET_TASK_PREFERENCES,
					payload: { error: response?.[1] },
				});
			}
		} catch (error) {
			console.log('error ==> getTaskPreferences', error);
			dispatch({
				type: Actions.SET_TASK_PREFERENCES,
				payload: { error: error },
			});
		}
	};

	const updateTaskPreferences = async (json) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const response = await restService.fetchPut(
				`/${workspaceId}/tenantuser-preference`,
				json,
				usertoken,
				'tenant',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.SET_TASK_PREFERENCES,
					payload: { data: json?.data },
				});
				return [true, response[1]];
			} else {
				return [false, response[1]];
			}
		} catch (error) {
			console.log('error ==> updateTaskPreferences', error);
		}
	};

	const getListTaskWithGroup = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				listTaskWithGroupQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.SET_LIST_TASK_WITH_GROUP,
					payload: response?.[1]?.data?.listTasksWithGroup,
				});
			} else {
				dispatch({
					type: Actions.SET_LIST_TASK_WITH_GROUP,
					payload: { error: response?.[1]?.[0]?.message },
				});
			}
		} catch (error) {
			console.log('API failed ==> getListTaskWithGroup', error);
			dispatch({
				type: Actions.SET_LIST_TASK_WITH_GROUP,
				payload: { error: error?.message },
			});
		}
	};

	const fetchGroupData = async (payload) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const response = await service.query(
			listTaskWithGroupQuery,
			payload,
			workspaceId,
			usertoken,
			'workflows_Api',
		);
		if (response?.[0]) {
			dispatch({
				type: Actions.APPEND_GROUP_DATA,
				payload: {
					group: payload?.taskFilterInput?.groupFilters?.value,
					data: response?.[1]?.data?.listTasksWithGroup?.groups?.[0]?.data,
					hasNextPage: response?.[1]?.data?.listTasksWithGroup?.groups?.[0]?.hasNextPage,
					currentPage: response?.[1]?.data?.listTasksWithGroup?.groups?.[0]?.currentPage,
					totalDocs: response?.[1]?.data?.listTasksWithGroup?.groups?.[0]?.totalDocs,
				},
			});
		}
	};

	const handleGroupChange = (payload) => {
		try {
			dispatch({
				type: Actions.HANDLE_GROUP_CHANGE,
				payload,
			});
			updateListItem({
				taskId: payload?.taskId,
				updateInput: {
					[payload?.groupBy]: payload?.targetGroup,
				},
			});
		} catch (error) {
			console.log('error ==> handleGroupChange', error);
		}
	};

	return {
		...state,
		getListItems,
		getListTasksForToday,
		getListTasksForOverdue,
		getListTasksDueTillToday,
		addListItem,
		updateListItem,
		deleteListItem,
		getTask,
		getTasksCountForOverdue,
		getTasksCountForToday,
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
		updateTaskState,
		getTaskMetadata,
		updateTaskViews,
		deleteTaskView,
		getTaskPreferences,
		updateTaskPreferences,
		getListTaskWithGroup,
		fetchGroupData,
		handleGroupChange,
	};
};
