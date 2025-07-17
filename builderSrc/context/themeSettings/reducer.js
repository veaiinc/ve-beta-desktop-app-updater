import { intialState } from './state';
const actionHandlers = {
	UPDATE_STATE_VALUES: (state, action) => ({
		...state,
		...action.payload,
	}),
	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
