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
	// GET_FORM_RESPONSE_SUMMARY_SUCCESS: (state, action) => ({
	// 	...state,
	// 	formResponseSummary: action?.payload,
	// }),
	GET_FORM_RESPONSE_ANALYTICS_SUCCESS: (state, action) => ({
		...state,
		formResponseAnalytics: action?.payload,
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
			const message = messages?.[requiredIndex];
			const { processing } = message;
			if (processing === 'Deep Search') {
				let deepSearch = message?.deepSearch || {};
				let cot = [...(deepSearch?.cot || [])];

				if (payload?.sub_queries || payload?.refined_sub_queries) {
					cot = [];
					(payload?.sub_queries || payload?.refined_sub_queries || [])?.forEach(
						(subQuery) => {
							cot.push({
								sub_query: subQuery,
							});
						},
					);
				}

				if (payload?.sub_query) {
					cot = cot?.map((item) => {
						if (item?.sub_query === payload?.sub_query) {
							item.searching = payload?.searching;
						}
						return item;
					});
				}

				deepSearch = {
					...deepSearch,
					cot,
				};

				messages[requiredIndex] = {
					...message,
					...payload,
					message: (message?.message || '') + (payload?.answer || ''),
					messageId: payload?.message_id,
					deepSearch,
				};
			} else if (payload?.responded) {
				let deepResearch = { ...(message?.deepResearch || {}) };
				let cot = [...(deepResearch?.cot || [])];
				cot?.push({
					step: payload?.responded,
				});

				deepResearch = {
					...deepResearch,
					cot,
				};
				messages[requiredIndex] = {
					...message,
					deepResearch,
					processing: 'Deep Research',
				};
			} else if (processing === 'Deep Research') {
				let deepResearch = { ...(message?.deepResearch || {}) };
				let cot = [...(deepResearch?.cot || [])];
				let sections = [...(deepResearch?.sections || [])];

				if (payload?.responded) {
					cot?.push({
						step: payload?.responded,
					});
				}
				if (payload?.intermediate_step) {
					let last_step = { ...(cot?.[cot?.length - 1] || {}) };
					last_step = {
						...(last_step || {}),
						...(payload?.intermediate_step || {}),
					};
					cot[cot?.length - 1] = last_step;
				}

				if (payload?.step) {
					cot?.push({
						step: payload?.step,
						citations: payload?.citations || [],
					});
				}

				if (payload?.sub_queries) {
					const sub_queries = (payload?.sub_queries || [])?.map((subQuery) => ({
						sub_query: subQuery,
					}));
					sections?.push({
						section: payload?.section,
						sub_queries,
					});
				}

				if (payload?.reading) {
					const sub_query = payload?.reading?.sub_query;
					const section = sections?.find(
						(item) =>
							item?.sub_queries?.filter(
								(subQuery) => subQuery?.sub_query === sub_query,
							)?.length > 0,
					);

					if (section) {
						const sub_queries = section?.sub_queries?.map((item) => {
							if (item?.sub_query === sub_query) {
								return {
									...item,
									...payload,
								};
							}
							return item;
						});
						section.sub_queries = sub_queries;
					}

					sections = sections?.map((item) => {
						if (item?.section === section?.section) {
							return section;
						}
						return item;
					});
				}

				deepResearch = {
					...deepResearch,
					cot,
					sections,
				};

				messages[requiredIndex] = {
					...message,
					...payload,
					message:
						(message?.message || '') +
						(typeof payload?.answer === 'object'
							? payload?.answer?.final_report || ''
							: payload?.answer || ''),
					deepResearch,
					messageId: payload?.message_id,
				};
			} else {
				messages[requiredIndex] = {
					...message,
					...payload,
					message: (message?.message || '') + (payload?.answer || ''),
					messageId: payload?.message_id,
				};
			}
		} else {
			messages?.push({
				...payload,
				type: 'AI',
				contentType: 'message',
				message: payload?.answer || '',
				messageId: payload?.message_id,
			});
		}

		return { ...state, globalChatMessages: messages };
	},
	GET_LLM_MODELS_SUCCESS: (state, action) => ({
		...state,
		llmModels: action?.payload,
	}),
	GET_AI_SUGGESTED_PENDING_ACTIONS_SUCCESS: (state, action) => ({
		...state,
		aiSuggestedPendingActions: action?.payload,
	}),
	SET_CONNECTED_THIRDPARTIES: (state, action) => ({
		...state,
		connectThirdParties: action?.payload,
	}),
	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
