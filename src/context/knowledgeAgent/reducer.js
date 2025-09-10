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
	SET_KNOWLEDGE_BASE_ACTIVE_FILE_STATUS: (state, action) => ({
		...state,
		knowledgeBaseFilesActiveStatus: action?.payload,
	}),
	UPDATE_CONTEXT_VALUES: (state, action) => ({
		...state,
		...action?.payload,
	}),
	SET_ACTIONS_INFO: (state, action) => ({
		...state,
		actionsInfo: action?.payload,
	}),
	GET_TRIGGERS: (state, action) => ({
		...state,
		triggers: action?.payload,
	}),
	CONNECT_TRIGGER: (state, action) => ({
		...state,
		triggers: action.payload,
	}),
	DELETE_TRIGGER: (state, action) => ({
		...state,
		triggers: action?.payload,
	}),

	SET_AGENTS_LIST_FOR_AUTOMATION: (state, action) => ({
		...state,
		assistantListForAutomation: action?.payload,
	}),

	SET_ACTIVE_ASSISTANT_FOR_AUTOMATION: (state, action) => ({
		...state,
		currentAgentAutomation: action?.payload,
	}),

	SET_FETCHED_KNOWLEDGE_AGENTS: (state, action) => ({
		...state,
		fetchedKnowledgeAgents: action?.payload,
	}),

	SET_ACTIVE_AGENTS: (state, action) => ({
		...state,
		activeAgents: { ...state?.activeAgents, ...action?.payload },
	}),

	SET_DRAFT_AGENTS: (state, action) => ({
		...state,
		draftAgents: { ...state?.draftAgents, ...action?.payload },
	}),

	SET_AGENT_TEMPLATES: (state, action) => ({
		...state,
		agentTemplates: { ...state?.agentTemplates, ...action?.payload },
	}),

	RESET_STATE: () => initialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers?.[action?.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
