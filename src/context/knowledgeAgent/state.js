import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';
import service from '../../services';
import ObjectID from 'bson-objectid';
export const initialState = {
	knowledgeAssistantsList: null,
	activeKnowledgeAssistant: null,
	fetchedKnowledgeAgents: null,
	allAiPrompts: null,
	knowledgeBaseInfo: null,
	knowledgeBaseFilesActiveStatus: null,
	actionsInfo: null,
	triggers: null,
	assistantListForAutomation: null,
	currentAgentAutomation: null,
};

export const KnowledgeAgentState = () => {
	const [state, dispatch] = useReducer(Reducer, initialState);

	const getKnowledgeAssistantsList = async (
		page = 1,
		limit = 10,
		search = '',
		sortBy = 'createdAt',
		sortOrder = -1,
		reset = true,
	) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const searchParam =
				search && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
			const sortParam = `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
			const path = `/${workspaceId}/knowledge-agents?page=${page}&limit=${limit}${searchParam}${sortParam}`;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchGet(path, token, type);
			const success = response?.[0] === true;
			if (success) {
				const data = reset
					? [...(response?.[1]?.data || [])]
					: [
							...(state?.knowledgeAssistantsList?.data || []),
							...(response?.[1]?.data || []),
					  ];
				const payload = {
					data,
					currentPage: response?.[1]?.currentPage ?? 1,
					hasNextPage: response?.[1]?.hasNextPage ?? false,
					totalDocs: response?.[1]?.totalDocs ?? 0,
				};
				dispatch({
					type: Actions?.SET_KNOWLEDGE_ASSISTANTS_LIST,
					payload,
				});
				return [true, payload];
			} else {
				dispatch({
					type: Actions?.SET_KNOWLEDGE_ASSISTANTS_LIST,
					payload: {
						data: [],
						hasNextPage: false,
						currentPage: 1,
						totalDocs: 0,
					},
				});
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>getKnowledgeAssistantsList', error);
			return [false, error];
		}
	};

	const createNewKnowledgeAgent = async (name, description) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = '/' + workspaceId + '/knowledge-agents';
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const body = {
				name,
				description,
			};
			const response = await service?.fetchPost(path, body, token, type);
			const success = response?.[0] === true;
			if (success) {
				dispatch({
					type: Actions?.SET_ACTIVE_KNOWLEDGE_ASSISTANT,
					payload: { data: response?.[1]?.insertData },
				});
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>createNewKnowledgeAgent', error);
			return [false, error];
		}
	};

	const getActiveKnowledgeAgentDetails = async (aiAssistantId, addToFetched = false) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = '/' + workspaceId + '/knowledge-agents/' + aiAssistantId;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchGet(path, token, type);
			const success = response?.[0] === true;
			if (success) {
				dispatch({
					type: Actions?.SET_ACTIVE_KNOWLEDGE_ASSISTANT,
					payload: { data: response?.[1] },
				});
				if (addToFetched) {
					dispatch({
						type: Actions?.SET_FETCHED_KNOWLEDGE_AGENTS,
						payload: {
							...state?.fetchedKnowledgeAgents,
							[aiAssistantId]: response?.[1],
						},
					});
				}
			} else {
				dispatch({
					type: Actions?.SET_ACTIVE_KNOWLEDGE_ASSISTANT,
					payload: { error: response?.[1] },
				});
			}
		} catch (error) {
			console.log('error==>getActiveKnowledgeAgentDetails', error);
			return [false, error];
		}
	};

	const updateKnowledgeAgent = async (aiAssistantId, updateData) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = '/' + workspaceId + '/knowledge-agents/' + aiAssistantId;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchPut(path, updateData, token, type);
			const success = response?.[0] === true;
			if (success) {
				dispatch({
					type: Actions?.SET_ACTIVE_KNOWLEDGE_ASSISTANT,
					payload: { data: response?.[1] },
				});
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>updateKnowledgeAgent', error);
			return [false, error];
		}
	};

	const addInstructionToKnowledgeAgent = async (agentId, instruction) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = '/' + workspaceId + '/knowledge-agents/' + agentId + '/instructions';
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchPost(path, instruction, token, type);
			const success = response?.[0] === true;
			if (success) {
				dispatch({
					type: Actions?.SET_ACTIVE_KNOWLEDGE_ASSISTANT,
					payload: { data: response?.[1] },
				});
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>addInstructionToKnowledgeAgent', error);
			return [false, error];
		}
	};

	const updateInstructionOfKnowledgeAgent = async (agentId, instructionId, updateData) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path =
				'/' +
				workspaceId +
				'/knowledge-agents/' +
				agentId +
				'/instructions/' +
				instructionId;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchPut(path, updateData, token, type);
			const success = response?.[0] === true;
			if (success) {
				dispatch({
					type: Actions?.SET_ACTIVE_KNOWLEDGE_ASSISTANT,
					payload: { data: response?.[1] },
				});
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>updateInstructionOfKnowledgeAgent', error);
			return [false, error];
		}
	};

	const deleteInstructionFromKnowledgeAgent = async (agentId, instructionId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path =
				'/' +
				workspaceId +
				'/knowledge-agents/' +
				agentId +
				'/instructions/' +
				instructionId;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchDelete(path, token, null, type);
			const success = response?.[0] === true;
			if (success) {
				dispatch({
					type: Actions?.SET_ACTIVE_KNOWLEDGE_ASSISTANT,
					payload: { data: response?.[1] },
				});
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>deleteInstructionFromKnowledgeAgent', error);
			return [false, error];
		}
	};

	const getAiPrompts = async (agentId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = '/' + workspaceId + '/knowledge-agents/' + agentId + '/default-prompt';
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchGet(path, token, type);
			const success = response?.[0] === true;
			if (success) {
				dispatch({
					type: Actions?.SET_ALL_AI_PROMPTS,
					payload: response?.[1]?.data,
				});
			}
		} catch (error) {
			console.log('error==>getAiPrompts', error);
			return [false, error];
		}
	};

	const selectAiPrompt = async (agentId, promptId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path =
				'/' + workspaceId + '/knowledge-agents/' + agentId + '/select-prompt/' + promptId;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchPost(path, null, token, type);
			const success = response?.[0] === true;
			if (success) {
				dispatch({
					type: Actions?.SELECT_AI_PROMPT,
					payload: { data: response?.[1] },
				});
			}
		} catch (error) {
			console.log('error==>selectAiPrompt', error);
			return [false, error];
		}
	};

	const editAiPrompt = async (agentId, promptId, updateData) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path =
				'/' + workspaceId + '/knowledge-agents/' + agentId + '/edit-prompt/' + promptId;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchPut(path, updateData, token, type);
			const success = response?.[0] === true;
			if (success) {
				dispatch({
					type: Actions?.SELECT_AI_PROMPT,
					payload: { data: response?.[1] },
				});
			}
		} catch (error) {
			console.log('error==>editAiPrompt', error);
			return [false, error];
		}
	};

	const resetAiPrompt = async (agentId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = '/' + workspaceId + '/knowledge-agents/' + agentId + '/reset-prompt';
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchPut(path, null, token, type);
			const success = response?.[0] === true;
			if (success) {
				dispatch({
					type: Actions?.SELECT_AI_PROMPT,
					payload: { data: response?.[1] },
				});
			}
			return response;
		} catch (error) {
			console.log('error==>resetAiPrompt', error);
			return [false, error];
		}
	};

	const getKnowledgeBaseInfo = async (agentId, page = 1, limit = 20, append = false) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = `/${workspaceId}/knowledge-bases?page=${page}&limit=${limit}&knowledgeAgentId=${agentId}`;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchGet(path, token, type);
			const success = response?.[0] === true;
			if (success) {
				dispatch({
					type: Actions?.SET_KNOWLEDGE_BASE_INFO,
					payload: {
						...response?.[1],
						data: append
							? [
									...(state?.knowledgeBaseInfo?.data || []),
									...(response?.[1]?.data || []),
							  ]
							: [...(response?.[1]?.data || [])],
					},
				});
			}
		} catch (error) {
			console.log('error==>getKnowledgeBaseInfo', error);
			return [false, error];
		}
	};

	const getKnowledgeBaseFilesActiveStatus = async ({
		page = 1,
		limit = 10,
		agentId,
		append = false,
	}) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const token = localStorage.getItem('usertoken');

			if (!workspaceId || !agentId) {
				console.warn('Missing workspaceId or agentId');
				return;
			}

			const path = `/${workspaceId}/knowledge-agents/${agentId}/related-knowledge-base-file-status`;
			const params = { page, limit };
			const type = 'ai_assistant_api';

			const response = await service.fetchGet(path, token, type, params);
			const success = response?.[0] === true;
			const { data, currentPage, hasNextPage } = response[1];
			const Data = append
				? data
				: [...(state.knowledgeBaseFilesActiveStatus?.data || []), ...(data || [])];
			if (success) {
				const payload = {
					data: Data,
					currentPage,
					hasNextPage,
				};
				dispatch({
					type: Actions.SET_KNOWLEDGE_BASE_ACTIVE_FILE_STATUS,
					payload,
				});
			} else {
				console.error('API request failed:', response);
			}
		} catch (error) {
			console.error(
				'Error fetching knowledge base active file status:',
				error.message || error,
			);
			return [false, error];
		}
	};

	const uploadURLsToKnowledgeBase = async (aiAssistantId, urls, agent = 'knowledgeAgent') => {
		const workspaceId = localStorage.getItem('workspaceId');
		const usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + '/knowledge-bases';
		const urlUploadPromises = urls.map((link) => {
			return new Promise(async (resolve, reject) => {
				const body = {
					assistant_ids: [aiAssistantId],
					type: 'url',
					url: link?.url,
					agent,
				};
				try {
					const response = await service?.fetchPost(
						url,
						body,
						usertoken,
						'ai_assistant_api',
					);
					if (response?.[0]) {
						return resolve({ url: link, status: 'resolved' });
					} else {
						return reject({
							url: link,
							status: 'rejected',
							error: 'API response indicated failure',
						});
					}
				} catch (error) {
					return reject({ url: link, status: 'rejected', error: error.message });
				}
			});
		});
		const uploadResults = await Promise.allSettled(urlUploadPromises);
		const statusSummary = uploadResults.map((result) => {
			if (result.status === 'fulfilled') {
				return { url: result.value.url, status: result.value.status };
			} else {
				return {
					url: result.reason.url,
					status: result.reason.status,
					error: result.reason.error,
				};
			}
		});
		return statusSummary;
	};

	const uploadPDFsToKnowledgeBase = async (aiAssistantId, files, agent = 'knowledgeAgent') => {
		const workspaceId = localStorage.getItem('workspaceId');
		const usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + '/knowledge-bases/upload-file';
		const batchId = ObjectID()?.toString();

		const fileUploadPromises = files.map((file) => {
			return new Promise(async (resolve, reject) => {
				const body = {
					assistant_ids: [aiAssistantId],
					uploadBatchId: batchId,
					originalFileName: file?.name,
					agent,
				};

				let signedUrl = '';
				let response = null;
				try {
					response = await service?.fetchPost(url, body, usertoken, 'ai_assistant_api'); // change the type to ai_setup later
					if (response?.[0] && response?.[1]?.signedUrl) {
						signedUrl = response[1].signedUrl;
					} else {
						return reject({
							file: file.name,
							status: 'rejected',
							error: 'Failed to get signed URL',
						});
					}

					if (signedUrl) {
						const uploadResponse = await fetch(signedUrl, {
							method: 'PUT',
							headers: {
								'Content-Type': file.type || 'application/pdf',
							},
							body: file,
						});

						if (uploadResponse?.ok) {
							return resolve({
								_id: response?.[1]?._id,
								file: file?.name,
								status: 'resolved',
							});
						} else {
							return reject({
								_id: response?.[1]?._id,
								file: file.name,
								status: 'rejected',
								error: 'Failed to upload to S3',
							});
						}
					}
				} catch (error) {
					return reject({
						_id: response?.[1]?._id,
						file: file.name,
						status: 'rejected',
						error: error.message,
					});
				}
			});
		});

		const uploadResults = await Promise.allSettled(fileUploadPromises);
		const statusSummary = uploadResults.map((result) => {
			if (result.status === 'fulfilled') {
				return {
					_id: result.value._id,
					file: result.value.file,
					status: result.value.status,
				};
			} else {
				return {
					file: result.reason.file,
					status: result.reason.status,
					error: result.reason.error,
				};
			}
		});
		return statusSummary;
	};

	const getActionsForKnowledgeAgent = async (agentId, search = '') => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path =
				'/' +
				workspaceId +
				'/ai-assistants/' +
				agentId +
				'/action' +
				(search ? `?search=${encodeURIComponent(search)}` : '');
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchGet(path, token, type);
			const success = response?.[0] === true;
			if (success) {
				dispatch({
					type: Actions?.SET_ACTIONS_INFO,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getActionsForKnowledgeAgent', error);
			return [false, error];
		}
	};

	const addActionToKnowledgeAgent = async (agentId, payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = '/' + workspaceId + '/ai-assistants/' + agentId + '/action';
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchPost(path, payload, token, type);
			return response;
		} catch (error) {
			console.log('error==>addActionToKnowledgeAgent', error);
			throw error;
		}
	};

	const updateActionOfKnowledgeAgent = async (agentId, actionId, payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = '/' + workspaceId + '/ai-assistants/' + agentId + '/action/' + actionId;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchPut(path, payload, token, type);
			const success = response?.[0] === true;
			if (success) {
				return response?.[1];
			} else {
				throw new Error(response?.[1]?.message || 'Failed to update action');
			}
		} catch (error) {
			console.log('error==>updateActionOfKnowledgeAgent', error);
			throw error;
		}
	};

	const deleteActionOfKnowledgeAgent = async (agentId, actionId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path =
				'/' +
				workspaceId +
				'/ai-assistants/' +
				agentId +
				'/action/' +
				actionId +
				'/knowledgeAgent';

			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchDelete(path, token, null, type);
			const success = response?.[0] === true;
			if (success) {
				return response?.[1];
			} else {
				throw new Error(response?.[1]?.message || 'Failed to delete action');
			}
		} catch (error) {
			console.log('error==>deleteActionOfKnowledgeAgent', error);
			throw error;
		}
	};

	const updateVisibilityOfKnowledgeAgent = async (agentId, payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = '/' + workspaceId + '/knowledge-agents/' + agentId + '/add-shared-user';
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchPut(path, payload, token, type);
			const success = response?.[0] === true;
			if (success) {
				dispatch({
					type: Actions?.SET_ACTIVE_KNOWLEDGE_ASSISTANT,
					payload: { data: response?.[1]?.knowledgeAgent },
				});
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>updateVisibilityOfKnowledgeAgent', error);
			return [false, error];
		}
	};

	const removeVisibilityOfKnowledgeAgent = async (agentId, userId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path =
				'/' +
				workspaceId +
				'/knowledge-agents/' +
				agentId +
				'/remove-shared-user/' +
				userId;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchDelete(path, token, null, type);
			const success = response?.[0] === true;
			if (success) {
				dispatch({
					type: Actions?.SET_ACTIVE_KNOWLEDGE_ASSISTANT,
					payload: { data: response?.[1]?.knowledgeAgent },
				});
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>removeVisibilityOfKnowledgeAgent', error);
			return [false, error];
		}
	};

	const uploadAgentProfilePic = async ({ agentId, file }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path =
				'/' + workspaceId + '/knowledge-agents/' + agentId + '/upload-profile-picture';
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';

			const signedURLResponse = await service?.fetchPost(path, file, token, type);

			if (!signedURLResponse?.[0]) {
				throw new Error('Failed to get signed URL for upload');
			}

			const signedUrl = signedURLResponse?.[1]?.signedUrl?.signedUrl;
			if (!signedUrl) {
				throw new Error('Signed URL not found!');
			}

			const uploadResponse = await fetch(signedUrl, {
				method: 'PUT',
				body: file,
				headers: {
					'Content-Type': file.type,
				},
			});

			if (!uploadResponse.ok) {
				throw new Error('Failed to upload file to S3');
			}

			return [true];
		} catch (error) {
			console.log('error==>uploadAgentProfilePic', error);
			return [false, error];
		}
	};

	const getTriggers = async (agentId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = '/' + workspaceId + '/ai-assistant-triggers/' + agentId;
			const response = await service?.fetchGet(url, usertoken, 'ai_assistant_api');
			if (response?.[0] === true) {
				dispatch({
					type: Actions?.GET_TRIGGERS,
					payload: response?.[1],
				});
				return [true];
			}
			return [false];
		} catch (error) {
			console.log('error==>getTriggers', error);
		}
	};

	const getPipedreamTriggers = async () => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = `/pipedream/triggers/${workspaceId}/components`;
			const response = await service?.fetchGet(
				url,
				usertoken,
				'third_party_integrations_api',
			);
			return response;
		} catch (error) {
			console.log('error==>getPipedreamTriggers', error);
			return [false, error];
		}
	};

	const deleteWhatsAppTriggerWithBothAPIs = async (triggerId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');

			// 1. Call Pipedream DELETE API
			const pipedreamUrl = `/pipedream/triggers/${workspaceId}/${triggerId}`;

			const pipedreamResponse = await service?.fetchDelete(
				pipedreamUrl,
				usertoken,
				null,
				'third_party_integrations_api',
			);

			// 2. Call the normal disconnect API
			const normalResponse = await disconnectTrigger(triggerId);
			const success = pipedreamResponse?.[0] === true && normalResponse?.[0] === true;

			return [success, pipedreamResponse];
		} catch (error) {
			console.error('error==>deleteWhatsAppTriggerWithBothAPIs', error);
			return [false, error];
		}
	};

	const connectTrigger = async ({ triggerApp, triggerData }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = '/' + workspaceId + '/ai-assistant-triggers';

			// Handle different trigger types
			switch (triggerApp) {
				case 'gmail':
				case 'outlook':
				case 'schedule':
					const response = await service?.fetchPost(
						url,
						triggerData,
						usertoken,
						'ai_assistant_api',
					);
					if (response?.[0] === true) {
						const newTrigger = response[1];
						const data = [newTrigger, ...(state.triggers?.data || [])];
						const payload = {
							...state.triggers,
							data,
						};
						dispatch({
							type: Actions.CONNECT_TRIGGER,
							payload,
						});
						return [true, response?.[1]];
					}
					return [false, response?.[1]];
				case 'whatsapp':
					const resp = await service?.fetchPost(
						url,
						triggerData,
						usertoken,
						'ai_assistant_api',
					);
					if (resp?.[0] === true) {
						const newTrigger = resp[1];
						const data = [newTrigger, ...(state.triggers?.data || [])];
						const payload = {
							...state.triggers,
							data,
						};
						dispatch({
							type: Actions.CONNECT_TRIGGER,
							payload,
						});
						return [true];
					}
					return [false];

				// return [true, triggerData];
				case 'googleMeet':
					return [false, { message: 'Google Meet trigger not implemented yet' }]; // TODO: implement google meet trigger
				default:
					return [false, { message: `Unknown trigger type: ${triggerApp}` }];
			}
		} catch (error) {
			console.log('error==>connectTrigger', error);
			return [false, error];
		}
	};

	const disconnectTrigger = async (triggerId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/ai-assistant-triggers/${triggerId}`;
			const response = await service.fetchDelete(url, usertoken, null, 'ai_assistant_api');
			const success = response[0] === true;
			if (success) {
				const updatedTriggers = {
					...state.triggers,
					data: ([...state?.triggers?.data] || []).filter(
						(trigger) => trigger._id !== triggerId,
					),
				};
				dispatch({
					type: Actions.DELETE_TRIGGER,
					payload: updatedTriggers,
				});
				return [true];
			} else {
				console.error('Failed to delete trigger:', response);
				return [false];
			}
		} catch (error) {
			console.error('Error disconnecting trigger:', error);
			return [false];
		}
	};

	const connectPipedreamTool = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = '/pipedream/connect-token/' + workspaceId + '/' + payload?.app;

			const response = await service?.fetchPost(
				url,
				{},
				usertoken,
				'third_party_integrations_api',
			);
			if (response?.[0] === true) {
				return [true, response?.[1]];
			}
			return [false, response?.[1]];
		} catch (error) {
			console.log('error==>connectTool', error);
		}
	};

	const connectTool = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');

			// Prepare the new payload structure
			const authRequestBody = {
				toolkit_slug: payload?.slug || payload?.toolkit_slug,
				auth_scheme: payload?.auth_scheme || 'OAUTH2',
				variant: payload?.variant || 'use_custom_auth',
				credentials: {},
			};

			// Fill credentials based on the auth scheme
			const authScheme = payload?.auth_scheme || 'OAUTH2';
			switch (authScheme) {
				case 'OAUTH2':
					authRequestBody.credentials = {
						client_id: payload?.client_id || '',
						client_secret: payload?.client_secret || '',
						redirect_uri: payload?.oauth_redirect_uri || payload?.redirect_uri || 'https://backend.composio.dev/api/v1/auth-apps/add',
						scopes: payload?.scopes || '',
						bearer_token: payload?.bearer_token || '',
					};
					break;

				case 'API_KEY':
					authRequestBody.credentials = { 
						api_key: payload?.api_key || '',
						bearer_token: payload?.bearer_token || '',
					};
					break;

				case 'BEARER_TOKEN':
					authRequestBody.credentials = { 
						bearer_token: payload?.bearer_token || '',
					};
					break;

				case 'BASIC':
					authRequestBody.credentials = {
						username: payload?.username || '',
						password: payload?.password || '',
						bearer_token: payload?.bearer_token || '',
					};
					break;

				default:
					authRequestBody.credentials = {
						client_id: payload?.client_id || '',
						client_secret: payload?.client_secret || '',
						redirect_uri: payload?.oauth_redirect_uri || payload?.redirect_uri || 'https://backend.composio.dev/api/v1/auth-apps/add',
						scopes: payload?.scopes || '',
						bearer_token: payload?.bearer_token || '',
					};
					break;
			}

			// Make the API call with the new payload structure
			const authUrl = `/composio/app-auth/${workspaceId}`;
			const authResponse = await service?.fetchPost(
				authUrl,
				authRequestBody,
				usertoken,
				'third_party_integrations_api',
			);

			if (!authResponse?.[0]) {
				return [false, authResponse?.[1]];
			}

			const authConfigId = authResponse?.[1]?.data?.auth_config_id;
			if (!authConfigId) {
				console.error('Auth config ID missing in response:', authResponse);
				return [false, { message: 'Failed to retrieve auth config ID' }];
			}

			// Handle OAuth redirect flow (if applicable)
			if (authScheme === 'OAUTH2' && payload?.oauth_redirect_uri) {
				// Check if state.js or similar handler is present for OAuth flow
				if (typeof window?.redirectToOAuth === 'function') {
					window.redirectToOAuth(authResponse?.[1]?.data);
				} else {
					// Fallback: direct browser redirect
					const redirectUrl = authResponse?.[1]?.data?.redirect_url;
					if (redirectUrl) {
						window.location.href = redirectUrl;
						return;
					}
				}
			}

			// Connect the app
			const connectUrl = `/composio/connect-app/${workspaceId}`;
			const connectRequestBody = {
				auth_config_id: authConfigId,
				connection_name: payload?.connection_name || `${payload?.slug || payload?.toolkit_slug}_connection`,
				connection_type: payload?.connection_type || 'api',
				connection_data: payload?.connection_data || {},
				webhook_url: payload?.webhook_url,
				custom_headers: payload?.custom_headers || {},
			};

			const connectResponse = await service?.fetchPost(
				connectUrl,
				connectRequestBody,
				usertoken,
				'third_party_integrations_api',
			);

			return connectResponse;
		} catch (error) {
			console.error('Error in connectTool:', error);
			return [false, error];
		}
	};

	const getPipedreamApps = async (page = 1, limit = 10, search = '') => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = `/pipedream/apps/${workspaceId}?page=${page}&limit=${limit}${
				search ? `&search=${encodeURIComponent(search)}` : ''
			}`;

			const response = await service?.fetchGet(
				url,
				usertoken,
				'third_party_integrations_api',
			);

			if (response?.[0] === true) {
				const { data } = response[1];
				return [
					true,
					{
						data: data.apps,
						hasNextPage: data.has_more,
						currentPage: data.current_page,
						totalPages: data.total_pages,
						totalApps: data.total_apps,
						perPage: data.per_page,
					},
				];
			}
			return [false, response?.[1]];
		} catch (error) {
			console.log('error==>getPipedreamApps', error);
			return [false, error];
		}
	};

	const getPipedreamAppActions = async (appName, page = 1, limit = 10, search = '') => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = `/pipedream/apps/${workspaceId}/${appName}/actions?page=${page}&limit=${limit}${
				search ? `&search=${encodeURIComponent(search)}` : ''
			}`;

			const response = await service?.fetchGet(
				url,
				usertoken,
				'third_party_integrations_api',
			);

			if (response?.[0] === true) {
				const { data } = response[1];
				return [
					true,
					{
						data: data.actions,
						hasNextPage: data.has_more,
						currentPage: data.current_page,
						totalPages: data.total_pages,
						totalActions: data.total_actions,
						perPage: data.per_page,
					},
				];
			}
			return [false, response?.[1]];
		} catch (error) {
			console.log('error==>getPipedreamAppActions', error);
			return [false, error];
		}
	};

	const getPipedreamActionPayload = async (appName, actionId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = `/pipedream/apps/${workspaceId}/${appName}/actions/${actionId}/payload`;

			const response = await service?.fetchGet(
				url,
				usertoken,
				'third_party_integrations_api',
			);

			if (response?.[0] === true) {
				return [true, response?.[1]?.data];
			}
			return [false, response?.[1]];
		} catch (error) {
			console.log('error==>getPipedreamActionPayload', error);
			return [false, error];
		}
	};

	const getExistingconnectedAccounts = async (payload) => {
		const workspaceId = localStorage.getItem('workspaceId');
		const usertoken = localStorage.getItem('usertoken');
		const url = `/pipedream/connected-accounts/${workspaceId}?external_user_id=${payload?.tenatUserId}`;
		const response = await service?.fetchGet(url, usertoken, 'third_party_integrations_api');
		if (response?.[0] === true) {
			return response?.[1];
		}
		return [false, response?.[1]];
	};

	const updateContextValues = (data) => {
		dispatch({ type: Actions?.UPDATE_CONTEXT_VALUES, payload: data });
	};

	const resetKnowledgeAgentState = () => {
		dispatch({ type: Actions?.RESET_STATE });
	};

	const deleteConnectedAccount = async (payload) => {
		const workspaceId = localStorage.getItem('workspaceId');
		const usertoken = localStorage.getItem('usertoken');
		const url = `/pipedream/disconnect-account/${workspaceId}`;
		const response = await service?.fetchDelete(
			url,
			usertoken,
			payload,
			'third_party_integrations_api',
		);
		if (response?.[0] === true) {
			return [true, response?.[1]];
		}
		return [false, response?.[1]];
	};

	const getActivitiesForKnowledgeAgent = async (agentId, page = 1, limit = 10) => {
		const workspaceId = localStorage.getItem('workspaceId');
		const usertoken = localStorage.getItem('usertoken');
		const url = `/${workspaceId}/knowledge-agents/${agentId}/activities?page=${page}&limit=${limit}`;
		const response = await service?.fetchGet(url, usertoken, 'ai_assistant_api');
		if (response?.[0] === true) {
			return [true, response?.[1]];
		}
		return [false, response?.[1]];
	};

	const updateToolVariables = async (agentId, toolId, payload) => {
		const workspaceId = localStorage.getItem('workspaceId');
		const usertoken = localStorage.getItem('usertoken');
		const url = `/${workspaceId}/ai-assistants/${agentId}/action/${toolId}`;
		const response = await service?.fetchPut(url, payload, usertoken, 'ai_assistant_api');
		if (response?.[0] === true) {
			return [true, response?.[1]];
		}
		return [false, response?.[1]];
	};

	const deleteKnowledgeBaseFile = async (knowledgeFileId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = `/${workspaceId}/knowledge-bases/${knowledgeFileId}/knowledgeAgent`;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchDelete(path, token, null, type);
			const success = response?.[0] === true;
			if (success) {
				// Remove the deleted file from knowledge base info
				const updatedKnowledgeBaseInfo = {
					...state?.knowledgeBaseInfo,
					data: (state?.knowledgeBaseInfo?.data || []).filter(
						(file) => file._id !== knowledgeFileId,
					),
				};
				dispatch({
					type: Actions?.SET_KNOWLEDGE_BASE_INFO,
					payload: updatedKnowledgeBaseInfo,
				});

				// Remove the deleted file from active status
				const updatedActiveStatus = {
					...state?.knowledgeBaseFilesActiveStatus,
					data: (state?.knowledgeBaseFilesActiveStatus?.data || []).filter(
						(status) => status._id !== knowledgeFileId,
					),
				};
				dispatch({
					type: Actions?.SET_KNOWLEDGE_BASE_ACTIVE_FILE_STATUS,
					payload: updatedActiveStatus,
				});
			}
			return [success, response?.[1]];
		} catch (error) {
			console.log('error==>deleteKnowledgeBaseFile', error);
			return [false, error];
		}
	};

	const deleteKnowledgeAgent = async (agentId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = `/${workspaceId}/knowledge-agents/${agentId}`;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchDelete(path, token, null, type);
			const success = response?.[0] === true;
			if (success) {
				if (state?.activeKnowledgeAssistant?.data?._id === agentId) {
					dispatch({
						type: Actions?.SET_ACTIVE_KNOWLEDGE_ASSISTANT,
						payload: { data: null },
					});
				}
				dispatch({
					type: Actions?.SET_KNOWLEDGE_BASE_INFO,
					payload: null,
				});
				dispatch({
					type: Actions?.SET_KNOWLEDGE_BASE_ACTIVE_FILE_STATUS,
					payload: null,
				});
				// Remove the deleted agent from the list directly
				const updatedAgentsList = {
					...state?.knowledgeAssistantsList,
					data: (state?.knowledgeAssistantsList?.data || []).filter(
						(agent) => agent._id !== agentId,
					),
				};
				dispatch({
					type: Actions?.SET_KNOWLEDGE_ASSISTANTS_LIST,
					payload: updatedAgentsList,
				});
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>deleteKnowledgeAgent', error);
			return [false, error];
		}
	};

	const listofAllappsActions = async (page = 1, limit = 10, search = '') => {
		const workspaceId = localStorage.getItem('workspaceId');
		const usertoken = localStorage.getItem('usertoken');
		const url = `/composio/tools/${workspaceId}${
			search ? `?search=${encodeURIComponent(search)}` : ''
		}`;
		const response = await service?.fetchGet(url, usertoken, 'third_party_integrations_api');
		if (response?.[0] === true) {
			return [true, response?.[1]];
		}
		return [false, response?.[1]];
	};

	const getKnowledgeAssistantsListForAutomation = async (
		page = 1,
		limit = 10,
		search = '',
		sortBy = 'createdAt',
		sortOrder = -1,
		reset = true,
	) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const searchParam =
				search && search.trim() ? `&search=${encodeURIComponent(search.trim())}` : '';
			const sortParam = `&sortBy=${sortBy}&sortOrder=${sortOrder}`;
			const path = `/${workspaceId}/knowledge-agents?page=${page}&limit=${limit}${searchParam}${sortParam}`;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchGet(path, token, type);
			const success = response?.[0] === true;
			if (success) {
				const data = reset
					? [...(response?.[1]?.data || [])]
					: [
							...(state?.knowledgeAssistantsList?.data || []),
							...(response?.[1]?.data || []),
					  ];
				const payload = {
					data,
					currentPage: response?.[1]?.currentPage ?? 1,
					hasNextPage: response?.[1]?.hasNextPage ?? false,
				};
				dispatch({
					type: Actions?.SET_AGENTS_LIST_FOR_AUTOMATION,
					payload,
				});
			} else {
				dispatch({
					type: Actions?.SET_AGENTS_LIST_FOR_AUTOMATION,
					payload: {
						data: [],
						hasNextPage: false,
						currentPage: 1,
					},
				});
			}
		} catch (error) {
			console.log('error==>getKnowledgeAssistantsList', error);
			return [false, error];
		}
	};

	const getActiveKnowledgeAgentForAutomation = async (aiAssistantId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = '/' + workspaceId + '/knowledge-agents/' + aiAssistantId;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchGet(path, token, type);
			const success = response?.[0] === true;
			if (success) {
				dispatch({
					type: Actions?.SET_ACTIVE_ASSISTANT_FOR_AUTOMATION,
					payload: { data: response?.[1] },
				});
			} else {
				dispatch({
					type: Actions?.SET_ACTIVE_ASSISTANT_FOR_AUTOMATION,
					payload: { error: response?.[1] },
				});
			}
		} catch (error) {
			console.log('error==>getActiveKnowledgeAgentDetails', error);
			return [false, error];
		}
	};

	const getPipeDreamAction = async (action) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/${action}/agent-tools`;
			const response = await service?.fetchGet(url, usertoken, 'ai_assistant_api');
			return response;
		} catch (error) {
			console.log('error==>getPipeDreamAction', error);
			return [false, error];
		}
	};

	const getComposioAction = async (action) => {
		const workspaceId = localStorage.getItem('workspaceId');
		const usertoken = localStorage.getItem('usertoken');
		const url = `/composio/toolkits/${workspaceId}/${action}`;
		const response = await service?.fetchGet(url, usertoken, 'ai_assistant_api');
		return response;
	};

	const addSharedAgentUser = async (agentId, payload) => {
		const workspaceId = localStorage.getItem('workspaceId');
		const usertoken = localStorage.getItem('usertoken');
		const url = `/${workspaceId}/knowledge-agents/${agentId}/add-shared-user`;
		const response = await service?.fetchPut(url, payload, usertoken, 'ai_assistant_api');
		return response;
	};

	const removeSharedAgentUser = async (agentId, userId) => {
		const workspaceId = localStorage.getItem('workspaceId');
		const usertoken = localStorage.getItem('usertoken');
		const url = `/${workspaceId}/knowledge-agents/${agentId}/remove-shared-user/${userId}`;
		const response = await service?.fetchDelete(url, usertoken, null, 'ai_assistant_api');
		return response;
	};

	const updateSharedAgentUser = async (agentId, payload) => {
		const workspaceId = localStorage.getItem('workspaceId');
		const usertoken = localStorage.getItem('usertoken');
		const url = `/${workspaceId}/knowledge-agents/${agentId}/update-global-agent-access`;
		const response = await service?.fetchPut(url, payload, usertoken, 'ai_assistant_api');
		return response;
	};

	const getSharedAgentUsers = async (agentId) => {
		const workspaceId = localStorage.getItem('workspaceId');
		const usertoken = localStorage.getItem('usertoken');
		const url = `/${workspaceId}/knowledge-agents/${agentId}/list-shared-users`;
		const response = await service?.fetchGet(url, usertoken, 'ai_assistant_api');
		return response;
	};

	// Composio API functions
	const getComposioConnectedAccounts = async () => {
		const workspaceId = localStorage.getItem('workspaceId');
		const usertoken = localStorage.getItem('usertoken');
		const url = `/composio/auth-configs/${workspaceId}`;
		const response = await service?.fetchGet(url, usertoken, 'third_party_integrations_api');
		if (response?.[0] === true) {
			return [true, response?.[1]];
		}
		return [false, response?.[1]];
	};

	return {
		...state,
		createNewKnowledgeAgent,
		getKnowledgeAssistantsList,
		getActiveKnowledgeAgentDetails,
		updateKnowledgeAgent,
		addInstructionToKnowledgeAgent,
		updateInstructionOfKnowledgeAgent,
		deleteInstructionFromKnowledgeAgent,
		resetKnowledgeAgentState,
		getAiPrompts,
		selectAiPrompt,
		editAiPrompt,
		resetAiPrompt,
		getKnowledgeBaseInfo,
		getKnowledgeBaseFilesActiveStatus,
		uploadURLsToKnowledgeBase,
		uploadPDFsToKnowledgeBase,
		updateContextValues,
		getActionsForKnowledgeAgent,
		addActionToKnowledgeAgent,
		updateActionOfKnowledgeAgent,
		updateVisibilityOfKnowledgeAgent,
		removeVisibilityOfKnowledgeAgent,
		deleteActionOfKnowledgeAgent,
		uploadAgentProfilePic,
		getTriggers,
		connectTrigger,
		disconnectTrigger,
		getPipedreamTriggers,
		deleteWhatsAppTriggerWithBothAPIs,
		connectTool,
		getPipedreamApps,
		getPipedreamAppActions,
		getPipedreamActionPayload,
		getExistingconnectedAccounts,
		deleteConnectedAccount,
		getActivitiesForKnowledgeAgent,
		updateToolVariables,
		deleteKnowledgeBaseFile,
		deleteKnowledgeAgent,
		listofAllappsActions,
		getKnowledgeAssistantsListForAutomation,
		getActiveKnowledgeAgentForAutomation,
		getPipeDreamAction,
		addSharedAgentUser,
		removeSharedAgentUser,
		updateSharedAgentUser,
		getSharedAgentUsers,
		getComposioAction,
		getComposioConnectedAccounts,
		connectPipedreamTool,
	};
};
