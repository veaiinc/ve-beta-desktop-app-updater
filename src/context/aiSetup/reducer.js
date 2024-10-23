import { intialState } from './state';
import { Actions } from './actions';

const actionHandlers = {
	[Actions.SET_KNOWLEDGE_BASE_FILES]: (state, action) => ({
		...state,
		knowledgeBaseFiles: action.payload,
	}),
	[Actions.SET_EXISTING_AI_ASSISTANTS]: (state, action) => ({
		...state,
		existingAiAssistants: action.payload,
	}),
	[Actions.SET_ACTIVE_AI_ASSISTANT_DETAILS]: (state, action) => ({
		...state,
		activeAiAssistantDetails: action.payload,
	}),
	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
