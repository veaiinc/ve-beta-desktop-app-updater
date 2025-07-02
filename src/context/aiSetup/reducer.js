import { initialState } from './state';

const actionHandlers = {
	SET_KNOWLEDGE_BASE_FILES: (state, action) => ({
		...state,
		knowledgeBaseFiles: action?.payload,
	}),
	SET_EXISTING_AI_ASSISTANTS: (state, action) => ({
		...state,
		existingAiAssistants: action?.payload,
	}),
	SET_ACTIVE_AI_ASSISTANT_DETAILS: (state, action) => ({
		...state,
		activeAiAssistantDetails: action?.payload,
	}),
	SET_ASSIGNED_WORKFLOWS_TO_AI_ASSISTANT: (state, action) => ({
		...state,
		assignedWorkflowsToAiAssistant: action?.payload,
	}),
	SET_WORKFLOWS: (state, action) => ({
		...state,
		workflows: action?.payload,
	}),
	SET_AI_CHAT_SESSIONS: (state, action) => ({
		...state,
		aiChatSessions: action?.payload,
	}),
	SET_AI_CHAT_SESSIONS_BY_ID: (state, action) => {
		const payload = action?.payload;
		let aiChatSessions = { ...(state?.aiChatSessions || {}) };

		if (!aiChatSessions) {
			aiChatSessions = {
				data: [{ ...payload }],
				hasMore: false,
				currentPage: 1,
				getData: true,
			};
			return {
				...state,
				aiChatSessions,
			};
		}

		let foundIndex = (aiChatSessions?.data || [])?.findIndex(
			(item) => item?._id === payload?._id,
		);
		if (foundIndex !== -1) {
			aiChatSessions.data[foundIndex] = payload;
		} else {
			aiChatSessions?.data?.unshift(payload);
		}

		return {
			...state,
			aiChatSessions,
		};
	},
	UPDATE_STATE_VALUES_SUCCESS: (state, action) => ({ ...state, ...action.payload }),
	SET_AI_ASSISTANTS: (state, action) => ({
		...state,
		[action?.selectedVariable]: action?.payload,
	}),
	SET_AI_ASSISTANT: (state, action) => ({
		...state,
		aiAssistant: action?.payload,
	}),
	GET_AI_INSTRUCTIONS: (state, action) => ({
		...state,
		aiInstructions: action?.payload,
	}),
	SET_AI_INSTRUCTION: (state, action) => ({
		...state,
		aiInstructions: action?.payload,
	}),
	UPDATE_AI_INSTRUCTION: (state, action) => ({
		...state,
		aiInstructions: action?.payload,
	}),
	DELETE_AI_INSTRUCTION: (state, action) => ({
		...state,
		aiInstructions: action?.payload,
	}),
	GET_AI_PROMPT: (state, action) => ({
		...state,
		aiPrompt: action?.payload,
	}),
	SET_AI_PROMPT: (state, action) => ({
		...state,
		aiPrompt: action?.payload,
	}),
	SELECT_AI_PROMPT: (state, action) => ({
		...state,
		aiPrompt: action?.payload,
	}),
	GET_DEFAULT_AI_PROMPT: (state, action) => ({
		...state,
		aiDefaultPrompt: action?.payload,
	}),
	GET_AI_ACTIONS: (state, action) => ({
		...state,
		aiActions: action?.payload,
	}),
	ADD_AI_ACTION: (state, action) => ({
		...state,
		aiAction: action?.payload,
	}),
	UPDATE_AI_ACTION: (state, action) => ({
		...state,
		aiAction: action?.payload,
	}),
	DELETE_AI_ACTION: (state, action) => ({
		...state,
		aiAction: action?.payload,
	}),
	CRAWL_AI_ASSISTANT: (state, action) => ({
		...state,
		aiCrawlLinks: action?.payload,
	}),
	RESET_AI_PROMPT: (state, action) => ({
		...state,
		aiPrompt: action?.payload,
	}),
	GET_AI_CHAT_LOGS: (state, action) => ({
		...state,
		[action?.selectedVariable]: action?.payload,
	}),
	GET_PROMPTS_DATA: (state, action) => ({
		...state,
		promptsData: action?.payload,
	}),
	GET_FILES_UPLOADED_IN_AI_CHAT: (state, action) => ({
		...state,
		filesUploadedInAiChat: action?.payload,
	}),

	SET_KNOWLEDGE_BASE_FILES_USING_UPDATED_LOGIC: (state, action) => ({
		...state,
		[action?.selectedVariable]: action?.payload,
	}),
	UPDATE_AI_SETUP_STATE: (state, action) => ({
		...state,
		...action?.payload,
	}),

	SET_AI_SETUP: (state, action) => ({
		...state,
		aiSetupData: action?.payload,
	}),

	SET_AI_SETUP_DATA_USER: (state, action) => ({
		...state,
		aiSetupDataUser: action?.payload,
	}),

	RESET_STATE: () => initialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers?.[action?.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
