import { intialState } from './state';
const actionHandlers = {
	GET_WORKFLOW_DETAILS_SUCCESS: (state, action) => ({ ...state, workflowslist: action.payload }),
	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
