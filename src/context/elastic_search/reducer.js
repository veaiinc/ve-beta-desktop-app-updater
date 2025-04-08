import { initialState } from './state';

const actionHandlers = {
	GET_ELASTIC_SEARCH_RESULTS: (state, action) => ({
		...state,
		elasticSearchResults: action?.payload,
	}),

	RESET_ELASTIC_SEARCH_STATE: () => initialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers?.[action?.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
