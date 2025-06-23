import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';
import service from '../../services';
import ObjectID from 'bson-objectid';
export const initialState = {
	knowledgeAssistantsList: null,
	activeKnowledgeAssistant: null,
	allAiPrompts: null,
	knowledgeBaseInfo: null,
	knowledgeBaseFilesActiveStatus: null,
	actionsInfo: null,
	triggers: null,
};

export const KnowledgeAgentState = () => {
	const [state, dispatch] = useReducer(Reducer, initialState);

	const getKnowledgeAssistantsList = async (page = 1, limit = 10, append = true) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = `/${workspaceId}/knowledge-agents?page=${page}&limit=${limit}`;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchGet(path, token, type);
			const success = response?.[0] === true;
			if (success) {
				const data = append
					? [
							...(state?.knowledgeAssistantsList?.data || []),
							...(response?.[1]?.data || []),
					  ]
					: [...(response?.[1]?.data || [])];
				const payload = {
					data,
					currentPage: response?.[1]?.currentPage ?? 1,
					hasNextPage: response?.[1]?.hasNextPage ?? false,
				};
				dispatch({
					type: Actions?.SET_KNOWLEDGE_ASSISTANTS_LIST,
					payload,
				});
			} else {
				dispatch({
					type: Actions?.SET_KNOWLEDGE_ASSISTANTS_LIST,
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

	const getActiveKnowledgeAgentDetails = async (aiAssistantId) => {
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

	const getActionsForKnowledgeAgent = async (agentId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = '/' + workspaceId + '/ai-assistants/' + agentId + '/action';
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
			const success = response?.[0] === true;
			if (success) {
				return response?.[1];
			} else {
				throw new Error(response?.[1]?.message || 'Failed to create action');
			}
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

	const deleteKnowledgeBaseFile = async (knowledgeFileId) => {
		const workspaceId = localStorage.getItem('workspaceId');
		const path = `/${workspaceId}/knowledge-bases/${knowledgeFileId}/knowledgeAgent`;
		const token = localStorage.getItem('usertoken');
		const type = 'ai_assistant_api';
		const response = await service?.fetchDelete(path, token, null, type);
		const success = response?.[0] === true;
		if (success) {
			dispatch({
				type: Actions?.SET_KNOWLEDGE_BASE_INFO,
				payload: {
					...response?.[1],
					data: [...(response?.[1]?.data || [])],
				},
			});
		}
		return [success];
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

	const getTriggers = async () => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = '/' + workspaceId + '/ai-assistant-triggers/ai-triggers';
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

	const connectTrigger = async ({ triggerApp, triggerData }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = '/' + workspaceId + '/ai-assistant-triggers/ai-trigger';

			// triggerApp: 'gmail' | 'googleMeet'
			switch (triggerApp) {
				case 'gmail':
					const response = await service?.fetchPost(
						url,
						triggerData, // { email: 'user@gmail.com' }
						usertoken,
						'ai_assistant_api',
					);
					if (response?.[0] === true) {
						const newTrigger = response[1];
						const data = [newTrigger, ...(state.triggers.data || [])];
						const payload = {
							...state.triggers,
							data: [newTrigger, ...(state.triggers.data || [])],
						};
						dispatch({
							type: Actions.CONNECT_TRIGGER,
							payload,
						});
						return [true];
					}
					return [false, response?.[1]];
				case 'googleMeet':
					return [false]; // TODO: implement google meet trigger
			}
		} catch (error) {
			console.log('error==>connectTrigger', error);
		}
	};

	const disconnectTrigger = async (triggerId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/ai-assistant-triggers/${triggerId}/ai-trigger`;
			const type = 'ai_assistant_api';

			const response = await service.fetchDelete(url, usertoken, null, type);
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

	const connectTool = async (payload) => {
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
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>deleteKnowledgeAgent', error);
			return [false, error];
		}
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
		connectTool,
		getPipedreamApps,
		getPipedreamAppActions,
		getPipedreamActionPayload,
		getExistingconnectedAccounts,
		deleteConnectedAccount,
		deleteKnowledgeBaseFile,
		deleteKnowledgeAgent,
	};
};
