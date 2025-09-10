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
	GET_NOTIFICATIONS_SUCCESS: (state, action) => ({
		...state,
		notificationsList: action?.payload,
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

	GLOBAL_CHAT_MESSAGES_ACTIONS_REQUESTS: (state, action) => {
		const { updatedGlobalChatMessages, sessionId, isStreaming } = action?.payload;
		return {
			...state,
			globalChatMessages: {
				...(state?.globalChatMessages || {}),
				[sessionId]: {
					...(state?.globalChatMessages?.[sessionId] || {}),
					messages: [
						...(state?.globalChatMessages?.[sessionId]?.messages || []),
						...updatedGlobalChatMessages,
					],
					isStreaming,
				},
			},
		};
	},
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
	RECENT_CHAT_MESSAGES_ACTIONS_REQUESTS: (state, action) => {
		const { sessionId, removeSessionId = false, data = null } = action?.payload;
		const selectedvariable = action?.selectedvariable;
		let selectedvariableData = { ...(state?.[selectedvariable] || {}) };
		if (removeSessionId) {
			delete selectedvariableData[sessionId];
		}
		if (data) {
			selectedvariableData[sessionId] = data;
		}
		return {
			...state,
			[selectedvariable]: selectedvariableData,
		};
	},
	GET_FOLLOW_UP_QUERIES_SUCCESS: (state, action) => ({
		...state,
		aiMessagesInfo: {
			...(state?.aiMessagesInfo || {}),
			...action?.payload,
		},
	}),
	HANDLE_STREAM_MESSAGE_CHUNK: (state, action) => {
		let {
			payload,
			chunkId,
			sessionId,
			fetchMore,
			recentChatMessages,
			updateExtraInfo,
			removeLoadingMessage,
			chatPayload,
			removeStreaming,
			removeChatSession,
			removeChatSessions,
			latestStreamMessage,
			removeLatestStreamMessage,
			lastQuery,
			chatBoxInfo,
			chatInfo,
			browserTabsInfo,
		} = action?.payload;
		let messages = [...(state?.globalChatMessages?.[sessionId]?.messages || [])];

		if (removeChatSession) {
			if (state?.globalChatMessages?.[sessionId]?.open_browser) {
				return state;
			}
			const globalChatMessages = { ...state?.globalChatMessages };
			delete globalChatMessages[sessionId];
			return { ...state, globalChatMessages };
		}

		if (updateExtraInfo) {
			let sessionIdData = state?.globalChatMessages?.[sessionId] || {};

			if (chatBoxInfo) {
				sessionIdData.chatBoxInfo = chatBoxInfo;
			}

			if (payload?.url_type === 'live_view' || payload?.browserMetadata) {
				let browserData = sessionIdData?.browserData || {};
				browserData = {
					...browserData,
					...payload,
				};
				sessionIdData.browserData = browserData;
			}

			if (browserTabsInfo) {
				let browserData = sessionIdData?.browserData || {};
				browserData = {
					...browserData,
					...browserTabsInfo,
				};
				sessionIdData.browserData = browserData;
			}

			if (chatInfo) {
				sessionIdData.chatInfo = chatInfo;
			}

			if (latestStreamMessage) {
				sessionIdData.latestStreamMessage = latestStreamMessage;
			}

			if (removeLatestStreamMessage) {
				sessionIdData.latestStreamMessage = null;
				sessionIdData.lastQuery = null;
			}

			if (lastQuery) {
				sessionIdData.lastQuery = lastQuery;
			}

			if (removeChatSessions) {
				let globalChatMessages = { ...state?.globalChatMessages };
				globalChatMessages = Object.keys(globalChatMessages)?.reduce((acc, key) => {
					if (
						globalChatMessages[key]?.isStreaming ||
						key === sessionId ||
						globalChatMessages[key]?.open_browser
					) {
						acc[key] = globalChatMessages[key];
					}
					return acc;
				}, {});
				return { ...state, globalChatMessages };
			}

			if (recentChatMessages) {
				if (fetchMore) {
					messages = recentChatMessages?.concat(messages);
				} else {
					messages = recentChatMessages?.concat(messages);
				}
				sessionIdData.messages = messages;
			}

			if (removeLoadingMessage) {
				sessionIdData.loadingMessage = null;
			}

			if (removeStreaming) {
				sessionIdData.isStreaming = false;
			}

			if (payload?.hasOwnProperty('intermediate_response')) {
				let loadingMessage = sessionIdData?.loadingMessage;
				loadingMessage = loadingMessage || '';
				loadingMessage += payload?.intermediate_response;
				sessionIdData.loadingMessage = loadingMessage;
			}

			if (chatPayload) {
				sessionIdData.chatPayload = chatPayload;
			}

			return {
				...state,
				globalChatMessages: {
					...(state?.globalChatMessages || {}),
					[sessionId]: sessionIdData,
				},
			};
		}

		let requiredIndex = -1;
		if (payload?.processing !== 'Normal Search') {
			messages = messages?.filter((ele) => ele?.contentType !== 'loading');
		}

		for (let i = messages?.length - 1; i >= 0; i--) {
			if (messages?.[i]?.message_chunk_id === chunkId) {
				requiredIndex = i;
				break;
			}
		}

		const info = {};
		if (payload?.hasOwnProperty('memory_thinking')) {
			info.memory_thinking = payload?.memory_thinking;
		}

		if (payload?.hasOwnProperty('open_browser')) {
			info.open_browser = payload?.open_browser;
		}

		if (requiredIndex !== -1) {
			const message = messages?.[requiredIndex];
			let { processing, browserChainOfThought = {}, cot } = message;

			if (processing === 'Deep Research') {
				let deepResearch = message?.deepResearch || {};
				let cot = deepResearch?.cot || [];
				let sections = deepResearch?.sections || [];
				let sections_refined = deepResearch?.sections_refined || [];

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
						section_id: payload?.section_id,
					});
				}

				if (payload?.compiling && payload?.section_id) {
					sections = sections?.map((section) => {
						if (section?.section_id === payload?.section_id) {
							return {
								...section,
								compiling: payload?.compiling,
							};
						}
						return section;
					});
					sections_refined = sections_refined?.map((section) => {
						if (section?.section_id === payload?.section_id) {
							return {
								...section,
								compiling: payload?.compiling,
							};
						}
						return section;
					});
				}

				if (payload?.reading && payload?.reading?.sub_query && payload?.section_id) {
					sections = sections?.map((section) => {
						if (section?.section_id === payload?.section_id) {
							let sub_queries = section?.sub_queries?.map((subQuery) => {
								if (subQuery?.sub_query === payload?.reading?.sub_query) {
									const readings = [...(subQuery?.readings || [])];
									readings?.push({ reading: payload?.reading });
									return {
										...subQuery,
										readings,
									};
								}
								return subQuery;
							});
							return {
								...section,
								sub_queries,
							};
						}
						return section;
					});
				}

				if (payload?.refined_sub_queries) {
					const refined_sub_queries = (payload?.refined_sub_queries || [])?.map(
						(subQuery) => ({
							refined_sub_query: subQuery,
						}),
					);
					sections_refined?.push({
						section: payload?.section,
						refined_sub_queries: refined_sub_queries,
						section_id: payload?.section_id,
					});
				}

				if (
					payload?.reading &&
					payload?.reading?.refined_sub_query &&
					payload?.section_id
				) {
					sections_refined = sections_refined?.map((section) => {
						if (section?.section_id === payload?.section_id) {
							let refined_sub_queries = section?.refined_sub_queries?.map(
								(subQuery) => {
									if (
										subQuery?.refined_sub_query ===
										payload?.reading?.refined_sub_query
									) {
										const readings = [...(subQuery?.readings || [])];
										readings?.push({ reading: payload?.reading });
										return {
											...subQuery,
											readings,
										};
									}
									return subQuery;
								},
							);
							return {
								...section,
								refined_sub_queries,
							};
						}
						return section;
					});
				}

				deepResearch = {
					...deepResearch,
					cot,
					sections,
					sections_refined,
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
			} else if (cot === 'chain_of_thought' || payload?.step || payload?.reading) {
				let chainOfThought = [...(message?.chainOfThought || [])];

				if (payload?.step) {
					chainOfThought?.push(payload);
				} else if (payload?.reading && payload?.step_id) {
					chainOfThought = chainOfThought?.map((item) => {
						if (item?.step_id === payload?.step_id) {
							item.readings = [
								...(item?.readings || []),
								{ reading: payload?.reading },
							];
						}
						return item;
					});
				}

				messages[requiredIndex] = {
					...message,
					...payload,
					message: (message?.message || '') + (payload?.answer || ''),
					messageId: payload?.message_id,
					chainOfThought,
				};
			} else {
				const { toolType, planType } = payload;
				let hasBrowserChainOfThought = false;
				if (toolType && toolType === 'tool') {
					let browserTools = browserChainOfThought?.browserTools || [];
					browserTools = [...browserTools, payload];
					browserChainOfThought = {
						...browserChainOfThought,
						browserTools,
					};
					hasBrowserChainOfThought = true;
				} else if (planType && planType === 'plan') {
					browserChainOfThought = {
						...browserChainOfThought,
						browserPlan: payload,
					};
					hasBrowserChainOfThought = true;
				}
				messages[requiredIndex] = {
					...message,
					...payload,
					message: (message?.message || '') + (payload?.answer || ''),
					messageId: payload?.message_id,
					...(hasBrowserChainOfThought && { browserChainOfThought }),
				};
			}
		} else {
			let chainOfThought = [];
			if (payload?.cot === 'chain_of_thought' || payload?.step || payload?.plan) {
				chainOfThought?.push(payload);
			}
			messages?.push({
				...payload,
				type: 'AI',
				contentType: 'message',
				message: payload?.answer || '',
				messageId: payload?.message_id,
				chainOfThought,
			});
		}

		return {
			...state,
			globalChatMessages: {
				...(state?.globalChatMessages || {}),
				[sessionId]: {
					...(state?.globalChatMessages?.[sessionId] || {}),
					...info,
					messages,
				},
			},
		};
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
		connectedThirdParties: action?.payload,
	}),
	UPDATE_CITATION_CHUNKS: (state, action) => {
		const sourceId = Object?.keys(action?.payload)?.[0];
		if (state?.citationChunks?.[sourceId]) {
			return state;
		}
		return {
			...state,
			citationChunks: { ...state?.citationChunks, [sourceId]: action?.payload?.[sourceId] },
		};
	},
	GET_AI_QUESTIONS_SUCCESS: (state, action) => ({
		...state,
		aiQuestions: action?.payload,
	}),
	GET_PROACTIVE_AI_DATA_SUCCESS: (state, action) => ({
		...state,
		proactiveAiData: action?.payload,
	}),
	GET_CHAT_BOX_SUGGESTIONS_SUCCESS: (state, action) => ({
		...state,
		chatBoxSuggestions: action?.payload,
	}),

	UPDATE_CHAT_LOADING_SESSIONS: (state, action) => {
		const {
			sessionId,
			removeSessionId,
			isStreaming = false,
			isNotSeen = false,
		} = action.payload;
		const chatLoadingSessions = { ...state.chatLoadingSessions };
		if (removeSessionId) {
			delete chatLoadingSessions[sessionId];
		} else {
			chatLoadingSessions[sessionId] = { isStreaming, isNotSeen };
		}
		return { ...state, chatLoadingSessions };
	},
	HANDLE_TRANSCRIPTION_SUGGESTIONS: (state, action) => {
		let payload = action.payload;

		if (action?.payload?.type) {
			payload = action?.payload?.data || {};
		}

		let { suggested_prompt, similar_files, data = [], revampedPrompt = [] } = payload || {};
		const aiTranscriptionSuggestions = state?.aiTranscriptionSuggestions || {};

		let suggestions = [...(aiTranscriptionSuggestions?.suggestions || [])];

		if (suggested_prompt) {
			if ('id' in suggested_prompt) {
				const index = suggestions?.findIndex((s) => s.id === suggested_prompt.id);

				if (index !== -1) {
					// Replace existing
					suggestions[index] = suggested_prompt;
				} else {
					// Add new
					suggestions?.push(suggested_prompt);
				}
			} else {
				// Old version → always push
				suggestions?.push(suggested_prompt);
			}
		}

		if (similar_files) {
			similar_files = similar_files?.map((file) => ({
				...file,
				entity: 'file',
			}));
			suggestions = suggestions?.concat(similar_files || []);
		}

		if (data?.length > 0) {
			let newSuggestions = [];
			data?.forEach((item) => {
				let { suggested_prompt, similar_files } = item?.response || {};
				if (suggested_prompt) {
					newSuggestions?.push(suggested_prompt);
				}
				if (similar_files) {
					similar_files = similar_files?.map((file) => ({
						...file,
						entity: 'file',
					}));
					newSuggestions = newSuggestions?.concat(similar_files || []);
				}
			});
			suggestions = [...newSuggestions, ...suggestions];
		}

		if (revampedPrompt) {
			suggestions = [...revampedPrompt, ...suggestions];
		}

		return {
			...state,
			aiTranscriptionSuggestions: {
				...aiTranscriptionSuggestions,

				suggestions,
			},
		};
	},
	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
