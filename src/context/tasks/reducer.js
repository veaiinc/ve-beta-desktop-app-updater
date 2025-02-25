import { intialState } from './state';

const actionHandlers = {
	SET_LIST_ITEMS: (state, action) => ({
		...state,
		listTasks: action?.payload,
	}),
	SET_LIST_TASKS_FOR_TODAY: (state, action) => ({
		...state,
		listTasksForToday: action?.payload,
	}),
	SET_LIST_TASKS_DUE_TILL_TODAY: (state, action) => ({
		...state,
		listTasksDueTillToday: action?.payload,
	}),
	SET_LIST_TASKS_FOR_OVERDUE: (state, action) => ({
		...state,
		listTasksForOverdue: action?.payload,
	}),
	SET_SUB_TASKS: (state, action) => ({
		...state,
		subTasks: action?.payload,
	}),
	SET_TASKS_COUNT_FOR_TODAY: (state, action) => ({
		...state,
		tasksCountForToday: action?.payload,
	}),
	SET_TASKS_COUNT_FOR_OVERDUE: (state, action) => ({
		...state,
		tasksCountForOverdue: action?.payload,
	}),
	RESET_SUB_TASKS: (state) => ({
		...state,
		subTasks: null,
	}),
	ADD_SUB_TASK: (state, action) => ({
		...state,
		subTasks: {
			...state.subTasks,
			data: [...state.subTasks?.data, action?.payload],
			error: null,
		},
	}),
	REMOVE_SUB_TASK: (state, action) => ({
		...state,
		subTasks: {
			...state.subTasks,
			data: state.subTasks?.data?.filter((item) => item._id !== action?.payload),
		},
	}),
	UPDATE_SUB_TASK: (state, action) => {
		const { _id, ...rest } = action?.payload;
		return {
			...state,
			subTasks: {
				...state.subTasks,
				data: state.subTasks?.data?.map((item) =>
					item._id === _id ? { ...item, ...rest } : item,
				),
			},
		};
	},
	SET_TASK_METADATA: (state, action) => ({
		...state,
		taskMetadata: { ...state?.taskMetadata, ...action?.payload },
	}),
	ADD_NEW_STATUS_LABEL: (state, action) => ({
		...state,
		taskMetadata: {
			...state.taskMetadata,
			[`${action?.payload?.group}GroupLabels`]: [
				...state?.taskMetadata?.[`${action?.payload?.group}GroupLabels`],
				action?.payload,
			],
		},
	}),
	UPDATE_STATUS_LABEL: (state, action) => {
		if (action?.payload?.isDefault) {
			return {
				...state,
				taskMetadata: {
					...state.taskMetadata,
					todoGroupLabels: state?.taskMetadata?.todoGroupLabels?.map((item) =>
						item?._id === action?.payload?._id
							? { ...action?.payload }
							: { ...item, isDefault: false },
					),
					inProgressGroupLabels: state?.taskMetadata?.inProgressGroupLabels?.map((item) =>
						item?._id === action?.payload?._id
							? { ...action?.payload }
							: { ...item, isDefault: false },
					),
					completedGroupLabels: state?.taskMetadata?.completedGroupLabels?.map((item) =>
						item?._id === action?.payload?._id
							? { ...action?.payload }
							: { ...item, isDefault: false },
					),
				},
			};
		}
		return {
			...state,
			taskMetadata: {
				...state.taskMetadata,
				[`${action?.payload?.group}GroupLabels`]: state?.taskMetadata?.[
					`${action?.payload?.group}GroupLabels`
				]?.map((item) => (item?._id === action?.payload?._id ? action?.payload : item)),
			},
		};
	},
	UPDATE_STATUS_LABEL_ORDER: (state, action) => {
		const oldGroupName = `${action?.payload?.oldGroup}GroupLabels`;
		const newGroupName = `${action?.payload?.data?.group}GroupLabels`;

		const oldGroupArray = state?.taskMetadata?.[oldGroupName]?.filter(
			(item) => item?._id !== action?.payload?.data?._id,
		);

		const newGroupArray = state?.taskMetadata?.[newGroupName]?.filter(
			(item) => item?._id !== action?.payload?.data?._id,
		);

		newGroupArray.splice(action?.payload?.order, 0, action?.payload?.data);

		return {
			...state,
			taskMetadata: {
				...state.taskMetadata,
				[oldGroupName]: oldGroupArray,
				[newGroupName]: newGroupArray,
			},
		};
	},
	DELETE_STATUS_LABEL: (state, action) => ({
		...state,
		taskMetadata: {
			...state.taskMetadata,
			[`${action?.payload?.group}GroupLabels`]: state?.taskMetadata?.[
				`${action?.payload?.group}GroupLabels`
			]?.filter((item) => item?._id !== action?.payload?._id),
		},
	}),
	UPDATE_TASK_VIEWS: (state, action) => ({
		...state,
		taskMetadata: {
			...state.taskMetadata,
			views: action?.payload,
		},
	}),
	SET_TASK_PREFERENCES: (state, action) => ({
		...state,
		taskPreference: action?.payload,
	}),
	DELETE_TASK_VIEW: (state, action) => ({
		...state,
		taskMetadata: {
			...state.taskMetadata,
			views: state?.taskMetadata?.views?.filter((item) => item?._id !== action?.payload),
		},
	}),
	UPDATE_TASK_STATE: (state, action) => ({
		...state,
		...action?.payload,
	}),
	SET_LIST_TASK_WITH_GROUP: (state, action) => ({
		...state,
		listTaskWithGroup: action?.payload,
	}),
	APPEND_GROUP_DATA: (state, action) => {
		const { group, data, hasNextPage, currentPage } = action?.payload;
		const existingGroup = state?.listTaskWithGroup?.groups?.find(
			(item) => item?.group === group,
		);
		if (existingGroup) {
			return {
				...state,
				listTaskWithGroup: {
					...state.listTaskWithGroup,
					groups: state?.listTaskWithGroup?.groups?.map((item) =>
						item?.group === group
							? { ...item, data: [...item?.data, ...data], hasNextPage, currentPage }
							: item,
					),
				},
			};
		}
		return {
			...state,
		};
	},
	HANDLE_GROUP_CHANGE: (state, action) => {
		const { sourceGroup, targetGroup, taskId, sourceIndex, targetIndex, groupBy } =
			action?.payload;

		// Find the task to move
		const sourceGroupData = state?.listTaskWithGroup?.groups?.find(
			(item) => item?.group === sourceGroup,
		);
		const taskToMove = sourceGroupData?.data?.find((task) => task?._id === taskId);

		if (!taskToMove) return state;

		return {
			...state,
			listTaskWithGroup: {
				...state.listTaskWithGroup,
				groups: state?.listTaskWithGroup?.groups?.map((group) => {
					// Remove task from source group
					if (group.group === sourceGroup) {
						const newData = [...group.data];
						newData.splice(sourceIndex, 1);
						return {
							...group,
							data: newData,
						};
					}
					// Add task to target group at specific index
					if (group.group === targetGroup) {
						const newData = [...group.data];
						newData.splice(targetIndex, 0, {
							...taskToMove,
							[groupBy]: targetGroup,
						});
						return {
							...group,
							data: newData,
						};
					}
					return group;
				}),
			},
		};
	},
	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers?.[action?.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
