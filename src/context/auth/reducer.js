import { initialState } from './state';

const actionHandlers = {
	GET_ADD_ONS_FOR_CURRENT_PLAN_SUCCESS: (state, action) => ({
		...state,
		currentPlanAddOns: action?.payload,
	}),

	RESET_STATE: () => ({ ...initialState }),
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action?.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
