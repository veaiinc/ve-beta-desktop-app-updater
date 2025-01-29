import { intialState } from './state';

const actionHandlers = {
	SET_CLIENT_LIST: (state, action) => ({
		...state,
		clientList: action?.payload,
	}),

	UPDATE_CONTACT_CONTEXT: (state, action) => ({
		...state,
		...action?.payload,
	}),
	RESET_STATE: () => intialState,
};

export const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};
