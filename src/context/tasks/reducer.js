import { intialState } from './state';

const actionHandlers = {
	SET_LIST_ITEMS: (state, action) => ({
		...state,
		listTasks: action?.payload,
	}),
	SET_SUB_TASKS: (state, action) => ({
		...state,
		subTasks: action?.payload,
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
			status: [...state?.taskMetadata?.status, action?.payload],
		},
	}),
	UPDATE_STATUS_LABEL: (state, action) => ({
		...state,
		taskMetadata: {
			...state.taskMetadata,
			status: state?.taskMetadata?.status?.map((item) =>
				item?._id === action?.payload?._id ? action?.payload : item,
			),
		},
	}),
	DELETE_STATUS_LABEL: (state, action) => ({
		...state,
		taskMetadata: {
			...state.taskMetadata,
			status: state?.taskMetadata?.status?.filter(
				(item) => item?._id !== action?.payload?._id,
			),
		},
	}),
	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers?.[action?.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
