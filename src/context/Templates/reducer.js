import { message } from 'antd';
import { intialState } from './state';
const actionHandlers = {
	GET_WORKFLOW_DETAILS_SUCCESS: (state, action) => ({
		...state,
		[action?.selectedvariable]: action?.payload,
	}),
	GET_WORKFLOW_DETAILS_FOR_FILES_SUCCESS: (state, action) => ({
		...state,
		[action?.selectedvariable]: action?.payload,
	}),

	GET_ALL_CLIENT_LIST_SUCCESS: (state, action) => ({ ...state, clientList: action?.payload }),
	GET_ALL_CLIENT_LIST_FOR_DOCS_SUCCESS: (state, action) => ({
		...state,
		clientListForDocs: action?.payload,
	}),
	GET_MY_WORKFLOWS_TEMPLATES_INFO_SUCCESS: (state, action) => ({
		...state,
		[action?.selectedvariable]: action?.payload,
	}),
	GET_MY_WORKFLOWS_TEMPLATES_FOR_PROPOSAL_POPUP_INFO_SUCCESS: (state, action) => ({
		...state,
		[action?.selectedvariable]: action?.payload,
	}),
	GET_GLOBAL_WORKFLOWS_TEMPLATES_INFO_SUCCESS: (state, action) => ({
		...state,
		[action?.selectedvariable]: action?.payload,
	}),

	UPDATE_STATE_VALUES_SUCCESS: (state, action) => ({ ...state, ...action.payload }),

	GET_ALL_EMAIL_TEMPLATES_SUCCESS: (state, action) => ({
		...state,
		allEmailTemplates: action?.payload,
	}),
	SMART_FILE_INFO_SUCCESS: (state, action) => ({
		...state,
		smartFileInfo: action?.payload,
	}),
	GET_TEMPLATES_LIST_FOR_CREATE_LEAD_SUCCESS: (state, action) => ({
		...state,
		templatesListForCreateLead: action?.payload,
	}),
	GET_TEMPLATES_LIST_FOR_DOCS_SUCCESS: (state, action) => ({
		...state,
		templatesListForDocs: action?.payload,
	}),
	GET_FORM_RESPONSES_SUCCESS: (state, action) => ({
		...state,
		formResponseData: action?.payload,
	}),
	GET_SPECIFIC_TEMPLATE_INFO_SUCCESS: (state, action) => ({
		...state,
		specificTemplatesInfo: action?.payload,
	}),
	GET_SMART_FILE_EMAIL_TEMPLATE_SUCCESS: (state, action) => ({
		...state,
		smartFileEmailTemplateData: action?.payload,
	}),

	GET_REQUIRED_ACTIONS_SUCCESS: (state, action) => ({
		...state,
		requiredActions: action?.payload,
	}),
	GET_REQUIRED_ACTIONS_FOR_TEMPLATE_SUCCESS: (state, action) => ({
		...state,
		requiredActionsForTemplate: action?.payload,
	}),

	GET_TAB_ITEM_COUNT_SUCCESS: (state, action) => ({
		...state,
		tabItemCount: action?.payload,
	}),

	GET_EVENTS_PRESETDATA_SUCCESS: (state, action) => ({
		...state,
		eventsPresetData: action?.payload,
	}),
	GET_SEND_SMART_FILE_SETTINGS_SUCCESS: (state, action) => ({
		...state,
		sendSmartFileSettings: action?.payload,
	}),
	GET_AI_PREDICTED_DATA_SUCCESS: (state, action) => ({
		...state,
		aiPredictedData: action?.payload,
	}),
	SET_CONNECT_URL: (state, action) => ({
		...state,
		connectUrl: action?.payload,
	}),
	GET_SLACK_CHANNEL_SUCCESS: (state, action) => ({
		...state,
		slackChannels: action?.payload,
	}),
	GET_ACTIVITY_LOGS_SUCCESS: (state, action) => ({ ...state, activityLogs: action?.payload }),
	GET_MORE_ACTIVITY_LOGS_SUCCESS: (state, action) => ({
		...state,
		moreActivityLogs: action?.payload,
	}),

	GET_DRAFT_STATE_WORKFLOW_TEMPLATE_SUCCESS: (state, action) => ({
		...state,
		draftStateWorkflowtemplates: action?.payload,
	}),
	GET_MORE_DRAFT_STATE_WORKFLOW_TEMPLATE_SUCCESS: (state, action) => ({
		...state,
		moreDraftStateWorkflowtemplates: action?.payload,
	}),
	TOGGLE_CREATE_LEAD_MODAL_SUCCESS: (state, action) => ({
		...state,
		...action.payload,
	}),

	GLOBAL_CHAT_MESSAGES_ACTIONS_REQUESTS: (state, action) => ({
		...state,
		globalChatMessages: [...state?.globalChatMessages, ...action?.payload],
	}),
	CHAT_CITATIONS_SUCCESS: (state, action) => ({
		...state,
		citations: action?.payload,
	}),
	CHAT_FOLLOW_UP_QUERY: (state, action) => ({
		...state,
		followUpQuery: action?.payload,
	}),
	GLOBAL_CHAT_MESSAGES_ACTIONS_SUCCESS: (state, action) => {
		let updatedGlobalChatMessages = [...state?.globalChatMessages];
		if (
			updatedGlobalChatMessages?.[updatedGlobalChatMessages?.length - 1]?.contentType ===
			'loading'
		) {
			updatedGlobalChatMessages.pop();
		}
		updatedGlobalChatMessages = [...updatedGlobalChatMessages, action.payload];
		return {
			...state,
			globalChatMessages: updatedGlobalChatMessages,
		};
	},
	UPDATE_APPLICATION_CHAT: (state, action) => ({
		...state,
		globalChatMessages: [...state?.globalChatMessages, ...action?.payload],
	}),
	GET_DOCS_FILES_LIST_SUCCESS: (state, action) => ({
		...state,
		[action?.selectedvariable]: action.payload,
	}),
	GET_TEMPLATES_LIST_FOR_FORMS_SUCCESS: (state, action) => ({
		...state,
		[action?.selectedvariable]: action.payload,
	}),
	GET_FORM_RESPONSES_LIST_SUCCESS: (state, action) => ({
		...state,
		[action?.selectedvariable]: action.payload,
	}),
	GET_MODULE_TEMPLATE_SUCCESS: (state, action) => ({
		...state,
		moduleTemplateData: action.payload,
	}),
	RECENT_CHAT_MESSAGES_ACTIONS_REQUESTS: (state, action) => ({
		...state,
		[action?.selectedvariable]: action.payload,
	}),
	HANDLE_STREAM_MESSAGE_CHUNK: (state, action) => {
		const { payload, chunkId } = action?.payload;
		let messages = [...state?.globalChatMessages] || [];
		let requiredIndex = -1;
		messages = messages?.filter((ele) => ele?.contentType !== 'loading');

		for (let i = messages?.length - 1; i >= 0; i--) {
			if (messages?.[i]?.message_chunk_id === chunkId) {
				requiredIndex = i;
				break;
			}
		}
		if (requiredIndex !== -1) {
			messages[requiredIndex] = {
				...messages[requiredIndex],
				...payload,
				message: (messages?.[requiredIndex]?.message || '') + payload?.answer,
				messageId: payload?.message_id,
			};
		} else {
			messages.push({
				...payload,
				type: 'AI',
				contentType: 'message',
				message: payload?.answer,
			});
		}

		return { ...state, globalChatMessages: messages };
	},
	GET_LLM_MODELS_SUCCESS: (state, action) => ({
		...state,
		llmModels: action?.payload,
	}),
	// SET_CONNECTED_THIRDPARTIES: (state, action) => ({
	// 	...state,
	// 	connectThirdParties: action?.payload,
	// }),
	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
