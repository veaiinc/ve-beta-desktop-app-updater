import { intialState } from './state';
const actionHandlers = {
	GET_WORKFLOW_DETAILS_SUCCESS: (state, action) => ({
		...state,
		[action?.selectedvariable]: action.payload,
	}),
	GET_ALL_CLIENT_LIST_SUCCESS: (state, action) => ({ ...state, clientList: action.payload }),
	GET_ALL_TEMPLATES_INFO_SUCCESS: (state, action) => ({
		...state,
		templatesInfo: action.payload,
	}),
	UPDATE_STATE_VALUES_SUCCESS: (state, action) => ({ ...state, ...action.payload }),
	GET_SPECIFIC_TEMPLATE_INFO_SUCCESS: (state, action) => ({
		...state,
		specificTemplatesInfo: action.payload,
	}),
	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
