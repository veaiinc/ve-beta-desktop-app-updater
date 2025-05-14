import { initialState } from './state';

const actionHandlers = {
	SET_KNOWLEDGE_ASSISTANTS_LIST: (state, action) => ({
		...state,
		knowledgeAssistantsList: action?.payload,
	}),
	SET_ACTIVE_KNOWLEDGE_ASSISTANT: (state, action) => ({
		...state,
		activeKnowledgeAssistant: action?.payload,
	}),
	SET_ALL_AI_PROMPTS: (state, action) => ({
		...state,
		allAiPrompts: action?.payload,
	}),
	SELECT_AI_PROMPT: (state, action) => ({
		...state,
		activeKnowledgeAssistant: {
			...state?.activeKnowledgeAssistant,
			prompt: action?.payload,
		},
	}),
	SET_KNOWLEDGE_BASE_INFO: (state, action) => ({
		...state,
		knowledgeBaseInfo: action?.payload,
	}),
	UPDATE_CONTEXT_VALUES: (state, action) => ({
		...state,
		...action?.payload,
	}),
	SET_ACTIONS_INFO: (state, action) => ({
		...state,
		actionsInfo: action?.payload,
	}),
	RESET_STATE: () => initialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers?.[action?.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
