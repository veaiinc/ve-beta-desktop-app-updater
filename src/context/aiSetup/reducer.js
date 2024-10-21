import { intialState } from './state';
import { Actions } from './actions';

const actionHandlers = {
	[Actions.SET_KNOWLEDGE_BASE_FILES]: (state, action) => ({
		...state,
		knowledgeBaseFiles: action.payload,
	}),

	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
