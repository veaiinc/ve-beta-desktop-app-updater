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
	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers?.[action?.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
