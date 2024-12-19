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
	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers?.[action?.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
