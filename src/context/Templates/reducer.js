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

	// This reducer handles all streaming-related chat updates for each session.
	// It maintains per-session chat state: messages, deep research progress, browser data, etc.
	// { sessionId1 : {messages, recentChatInfo}, sessionId2 : {messages, recentChatInfo}}
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
			removeChatSessions,
			latestStreamMessage,
			removeLatestStreamMessage,
			lastQuery,
			chatBoxInfo,
			chatInfo,
			recentChatInfo,
		} = action?.payload;

		// Get existing messages for this session or an empty array if none
		let messages = [...(state?.globalChatMessages?.[sessionId]?.messages || [])];

		// =====================================================
		// 🧩 CASE 1: Updating extra session-related info
		// =====================================================
		if (updateExtraInfo) {
			// Get or create a container for session-specific data
			let sessionIdData = state?.globalChatMessages?.[sessionId] || {};

			// --- Chatbox Info Update (e.g., websearch, knowledge base mode)
			if (chatBoxInfo) {
				sessionIdData.chatBoxInfo = chatBoxInfo;
			}

			// --- If payload contains browser info (for live view / web browsing)
			if (payload?.url_type === 'live_view' || payload?.browserMetadata) {
				let browserData = sessionIdData?.browserData || {};
				browserData = {
					...browserData,
					...payload,
				};
				sessionIdData.browserData = browserData;
			}

			// --- Update recent chat metadata (currentPage, hasNextPage etc.)
			if (recentChatInfo) {
				sessionIdData.recentChatInfo = recentChatInfo;
			}

			// --- Store AI chat info (assistantId, agentType) ==> used for connecting to sockets like multiagent or knowledgeagent
			if (chatInfo) {
				sessionIdData.chatInfo = chatInfo;
			}

			// --- Update the latest streamed message
			if (latestStreamMessage) {
				sessionIdData.latestStreamMessage = latestStreamMessage;
			}

			// --- Remove latest stream message
			if (removeLatestStreamMessage) {
				sessionIdData.latestStreamMessage = null;
				sessionIdData.lastQuery = null;
			}

			// --- Save the most recent query sent by user
			if (lastQuery) {
				sessionIdData.lastQuery = lastQuery;
			}

			// --- Remove all chat sessions except those with message arrays
			if (removeChatSessions) {
				let globalChatMessages = { ...state?.globalChatMessages };
				globalChatMessages = Object.keys(globalChatMessages)?.reduce((acc, key) => {
					if (globalChatMessages?.[key]?.messages) {
						acc[key] = globalChatMessages[key];
					}
					return acc;
				}, {});
				return { ...state, globalChatMessages };
			}

			// --- Append or replace messages (depending on fetchMore flag)
			if (recentChatMessages) {
				if (fetchMore) {
					// prepend older messages when fetching history
					messages = recentChatMessages?.concat(messages);
				} else {
					// replace or merge when new recent chat arrives
					messages = recentChatMessages?.concat(messages);
				}
				sessionIdData.messages = messages;
			}

			// --- Remove temporary loading message once the ai sends response
			if (removeLoadingMessage) {
				sessionIdData.loadingMessage = null;
			}

			// --- Stop streaming state after stream completion
			if (removeStreaming) {
				sessionIdData.isStreaming = false;
			}

			// --- Append intermediate text chunks to the ongoing loading message
			if (payload?.hasOwnProperty('intermediate_response')) {
				let loadingMessage = sessionIdData?.loadingMessage;
				loadingMessage = loadingMessage || '';
				loadingMessage += payload?.intermediate_response;
				sessionIdData.loadingMessage = loadingMessage;
			}

			// --- This contains moduleTemplateId, workflowTemplateId and it will be used in chatbox and it will be sent through payload for AI
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

		// =====================================================
		// 🧠 CASE 2: Stream handling for new or ongoing responses
		// =====================================================
		let requiredIndex = -1;

		// Remove temporary "loading" message
		messages = messages?.filter((ele) => ele?.contentType !== 'loading');

		// --- Find message that matches current stream chunkId (for incremental updates)
		for (let i = messages?.length - 1; i >= 0; i--) {
			if (messages?.[i]?.message_chunk_id === chunkId) {
				requiredIndex = i;
				break;
			}
		}

		// --- Info to store in the message session (thinking/memory metadata)
		const info = {};
		if (payload?.hasOwnProperty('open_browser')) {
			info.open_browser = payload?.open_browser;
		}

		// =====================================================
		// 🧩 CASE 2A: Update existing message with new stream data
		// =====================================================
		if (requiredIndex !== -1) {
			const message = messages?.[requiredIndex];
			let { processing, browserChainOfThought = {}, cot } = message;

			// -----------------------------------------------------
			// 📚 If this is a Deep Research session
			// -----------------------------------------------------
			if (processing === 'Deep Research') {
				let deepResearch = message?.deepResearch || {};
				let cot = deepResearch?.cot || [];
				let sections = deepResearch?.sections || [];
				let sections_refined = deepResearch?.sections_refined || [];

				// Add new responded step to chain of thought
				if (payload?.responded) {
					cot?.push({ step: payload?.responded });
				}

				// Merge intermediate step into last one
				if (payload?.intermediate_step) {
					let last_step = { ...(cot?.[cot?.length - 1] || {}) };
					last_step = { ...(last_step || {}), ...(payload?.intermediate_step || {}) };
					cot[cot?.length - 1] = last_step;
				}

				// Add new step with citations
				if (payload?.step) {
					cot?.push({
						step: payload?.step,
						citations: payload?.citations || [],
					});
				}

				// Add section-level sub-queries
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

				// Mark a section as compiling
				if (payload?.compiling && payload?.section_id) {
					sections = sections?.map((section) => {
						if (section?.section_id === payload?.section_id) {
							return { ...section, compiling: payload?.compiling };
						}
						return section;
					});
					sections_refined = sections_refined?.map((section) => {
						if (section?.section_id === payload?.section_id) {
							return { ...section, compiling: payload?.compiling };
						}
						return section;
					});
				}

				// Add reading to a sub-query in a section
				if (payload?.reading && payload?.reading?.sub_query && payload?.section_id) {
					sections = sections?.map((section) => {
						if (section?.section_id === payload?.section_id) {
							let sub_queries = section?.sub_queries?.map((subQuery) => {
								if (subQuery?.sub_query === payload?.reading?.sub_query) {
									const readings = [...(subQuery?.readings || [])];
									readings?.push({ reading: payload?.reading });
									return { ...subQuery, readings };
								}
								return subQuery;
							});
							return { ...section, sub_queries };
						}
						return section;
					});
				}

				// Add refined sub-queries (post-processing)
				if (payload?.refined_sub_queries) {
					const refined_sub_queries = (payload?.refined_sub_queries || [])?.map(
						(subQuery) => ({
							refined_sub_query: subQuery,
						}),
					);
					sections_refined?.push({
						section: payload?.section,
						refined_sub_queries,
						section_id: payload?.section_id,
					});
				}

				// Add readings to refined sub-queries
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
										return { ...subQuery, readings };
									}
									return subQuery;
								},
							);
							return { ...section, refined_sub_queries };
						}
						return section;
					});
				}

				// Reconstruct DeepResearch object
				deepResearch = { ...deepResearch, cot, sections, sections_refined };

				// Update the existing message with appended content
				messages[requiredIndex] = {
					...message,
					...payload,
					message:
						(message?.message || '') +
						(typeof payload?.answer === 'object'
							? payload?.answer?.final_report || ''
							: payload?.answer ?? payload?.response ?? ''),
					deepResearch,
					messageId: payload?.message_id,
					status: payload?.status,
					response: payload?.response,
				};
			}

			// -----------------------------------------------------
			// 🧩 If it's a Chain-of-Thought response
			// -----------------------------------------------------
			else if (cot === 'chain_of_thought' || payload?.step || payload?.reading) {
				let chainOfThought = [...(message?.chainOfThought || [])];

				// Add new thought step
				if (payload?.step) {
					chainOfThought?.push(payload);
				}
				// Add readings under a specific step
				else if (payload?.reading && payload?.step_id) {
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
					message:
						(message?.message || '') + (payload?.answer ?? payload?.response ?? ''),
					messageId: payload?.message_id,
					chainOfThought,
					status: payload?.status,
					response: payload?.response,
				};
			}

			// -----------------------------------------------------
			// ⚙️ Normal message or browser tool plan or other than chainofThought or deepResearch
			// -----------------------------------------------------
			else {
				const { toolType, planType } = payload;
				let hasBrowserChainOfThought = false;

				// If tool interaction (like browser click, link open)
				if (toolType && toolType === 'tool') {
					let browserTools = browserChainOfThought?.browserTools || [];
					browserTools = [...browserTools, payload];
					browserChainOfThought = { ...browserChainOfThought, browserTools };
					hasBrowserChainOfThought = true;
				}
				// If AI generated a "plan" (sequence of browser actions)
				else if (planType && planType === 'plan') {
					browserChainOfThought = { ...browserChainOfThought, browserPlan: payload };
					hasBrowserChainOfThought = true;
				}

				// Update the message text progressively
				messages[requiredIndex] = {
					...message,
					...payload,
					message:
						(message?.message || '') + (payload?.answer ?? payload?.response ?? ''),
					messageId: payload?.message_id,
					...(hasBrowserChainOfThought && { browserChainOfThought }),
					status: payload?.status,
					response: payload?.response,
				};
			}
		}

		// =====================================================
		// 🆕 CASE 2B: New message creation (no existing chunk found)
		// =====================================================
		else {
			let chainOfThought = [];
			if (payload?.cot === 'chain_of_thought' || payload?.step || payload?.plan) {
				chainOfThought?.push(payload);
			}

			// Add new message object to the message list
			messages?.push({
				...payload,
				type: 'AI',
				contentType: 'message',
				message: payload?.answer ?? payload?.response ?? '',
				messageId: payload?.message_id,
				chainOfThought,
				status: payload?.status,
				response: payload?.response,
			});
		}

		// =====================================================
		// ✅ Return the fully updated state
		// =====================================================
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
			if ('reference_id' in suggested_prompt) {
				const index = suggestions?.findIndex(
					(s) =>
						s.prompt_id === suggested_prompt.reference_id ||
						s.previous_prompt_ids?.includes(suggested_prompt.reference_id),
				);

				if (index !== -1) {
					const oldPrompt = suggestions[index];

					// Remove old one
					suggestions.splice(index, 1);

					// Merge history: carry over previous IDs and add the old prompt_id
					suggested_prompt.previous_prompt_ids = [
						...(oldPrompt.previous_prompt_ids || []),
						oldPrompt.prompt_id,
					];
				} else {
					// If no match found, still initialize previous_prompt_ids
					suggested_prompt.previous_prompt_ids =
						suggested_prompt.previous_prompt_ids || [];
				}

				// Append new one to the bottom
				suggestions?.push(suggested_prompt);
			} else {
				// Old version → always push, ensure previous_prompt_ids exists
				suggested_prompt.previous_prompt_ids = suggested_prompt.previous_prompt_ids || [];
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
