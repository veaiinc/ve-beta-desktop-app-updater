import { intialState } from './state';
const actionHandlers = {
	GET_PROPOSAL_INFO_SUCCESS: (state, action) => ({
		...state,
		proposalInfo: action.payload,
	}),
	RESET_STATE: () => ({ ...intialState }),
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
