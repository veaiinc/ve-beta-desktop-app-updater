import { intialState } from './state';
const actionHandlers = {
	GET_WORKFLOW_DETAILS_SUCCESS: (state, action) => ({
		...state,
		[action?.selectedvariable]: action.payload,
	}),
	GET_ALL_CLIENT_LIST_SUCCESS: (state, action) => ({ ...state, clientList: action.payload }),
	GET_MY_WORKFLOWS_TEMPLATES_INFO_SUCCESS: (state, action) => ({
		...state,
		[action.selectedvariable]: action.payload,
	}),
	GET_GLOBAL_WORKFLOWS_TEMPLATES_INFO_SUCCESS: (state, action) => ({
		...state,
		[action.selectedvariable]: action.payload,
	}),

	UPDATE_STATE_VALUES_SUCCESS: (state, action) => ({ ...state, ...action.payload }),

	GET_ALL_EMAIL_TEMPLATES_SUCCESS: (state, action) => ({
		...state,
		allEmailTemplates: action.payload,
	}),
	SMART_FILE_INFO_SUCCESS: (state, action) => ({
		...state,
		smartFileInfo: action.payload,
	}),
	GET_TEMPLATES_LIST_FOR_CREATE_LEAD_SUCCESS: (state, action) => ({
		...state,
		templatesListForCreateLead: action.payload,
	}),
	GET_FORM_RESPONSES_SUCCESS: (state, action) => ({
		...state,
		formResponseData: action.payload,
	}),
	GET_SPECIFIC_TEMPLATE_INFO_SUCCESS: (state, action) => ({
		...state,
		specificTemplatesInfo: action.payload,
	}),
	GET_SMART_FILE_EMAIL_TEMPLATE_SUCCESS: (state, action) => ({
		...state,
		smartFileEmailTemplateData: action.payload,
	}),

	GET_REQUIRED_ACTIONS_SUCCESS: (state, action) => ({
		...state,
		requiredActions: action.payload,
	}),

	GET_TAB_ITEM_COUNT_SUCCESS: (state, action) => ({
		...state,
		tabItemCount: action.payload,
	}),

	GET_EVENTS_PRESETDATA_SUCCESS: (state, action) => ({
		...state,
		eventsPresetData: action.payload,
	}),
	GET_SEND_SMART_FILE_SETTINGS_SUCCESS: (state, action) => ({
		...state,
		sendSmartFileSettings: action.payload,
	}),
	GET_MODULE_TEMPLATE_SUCCESS: (state, action) => ({
		...state,
		moduleTemplateData: action.payload,
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
	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
