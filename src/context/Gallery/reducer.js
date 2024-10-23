import { intialState } from './state';

const actionHandlers = {
	GET_TENANT_GALLERIES: (state, action) => ({
		...state,
		tenantGalleries: action.payload,
	}),
	RESET_STATE: () => ({ ...intialState }),
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
