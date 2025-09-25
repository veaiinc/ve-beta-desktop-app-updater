import { useReducer } from 'react';
import Reducer from './reducer';
import {
	AI_PERSONALITY,
	KNOWLEDGE_BASE,
	AI_ASSISTANT_INSTRUCTIONS,
	AI_PROMPT,
	AI_ACTIONS,
	AI_CHAT_LOGS,
} from './actionTypes';
import { Actions } from './actions';
import service from '../../services';
import gqlService from '../../services/graphQlServices';
import { generatePDFsBatchId } from '../../helpers';
import { getTemmplatesQuery } from '../Templates/graphQlFunctions';
import ObjectID from 'bson-objectid';
import axios from 'axios';

export const initialState = {
	knowledgeBaseFiles: {
		data: [],
		areKnowledgeBaseFilesLoading: true,
	},
	existingAiAssistants: null,
	aiAssistants: null,
	moreAiAssistants: null,
	activeAiAssistantDetails: null,
	workflows: {
		data: [],
		hasMore: false,
		currentPage: 1,
	},
	assignedWorkflowsToAiAssistant: {
		data: [],
		hasMore: false,
		currentPage: 1,
	},
	aiChatSessions: null,
	aiChatSessionsFilters: null,
	aiAssistant: null,
	aiInstructions: null,
	aiPrompt: null,
	aiDefaultPrompt: null,
	aiActions: null,
	aiAction: null,
	tokenForVoice: null,
	aiChatLogs: null,
	moreAiChatLogs: null,
	aiCrawlLinks: null,
	promptsData: null,
	updatedKnowledgeBaseFiles: null,
	moreUpdatedKnowledgeBaseFiles: null,
	filesUploadedInAiChat: null,
	isVoiceIntegrationActive: null,
	aiSetupData: null,
	aiSetupDataUser: null,
	voiceIntegrationData: null, //{token,serverUrl,shouldConnect	}
	triggerVoiceDisconnect: null,
	aiTranscriptionSuggestions: null,
	showVoiceWidget: false, // Global state for voice widget visibility
	notchDropVoiceActive: false, // Flag to indicate NotchDrop is controlling voice
	proactiveHeadings: null,
	AIMemoryInfo: null,
};

export const AiSetupState = () => {
	const [state, dispatch] = useReducer(Reducer, initialState);

	const getWorkflows = async (page = 1, limit = 10, reset = false) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');

		const payload = {
			filters: {
				limit: limit,
				page: page,
				type: 'workspace',
				status: 'published',
				sortBy: 'createdAt',
				sortType: -1,
			},
		};

		const response = await gqlService?.query(
			getTemmplatesQuery,
			payload,
			workspaceId,
			usertoken,
			'workflows_Api',
		);

		if (response?.[0]) {
			dispatch({
				type: Actions?.SET_WORKFLOWS,
				payload: {
					data: reset
						? [...response?.[1]?.data?.templates?.data]
						: [...state?.workflows?.data, ...response?.[1]?.data?.templates?.data],
					hasMore: response?.[1]?.data?.templates?.hasNextPage,
					currentPage: response?.[1]?.data?.templates?.currentPage,
				},
			});
		}
	};

	const assignAiAssistantToSelectedWorkflows = async (assistantId, workflowIds) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + `/ai-assistants/${assistantId}/workflow-templates`;

		const response = await service.fetchPost(
			url,
			{ workflowTemplateIds: workflowIds },
			usertoken,
			'ai_assistant_api',
		);
		if (response?.[0] === true) {
			return true;
		}
		return false;
	};

	const getAssignedWorkflowsToAiAssistant = async (
		assistantId,
		page = 1,
		limit = 10,
		reset = false,
	) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url =
			'/' +
			workspaceId +
			`/ai-assistants/${assistantId}/workflow-templates/?page=${page}&limit=${limit}`;
		const response = await service.fetchGet(url, usertoken, 'ai_assistant_api');
		if (response?.[0]) {
			dispatch({
				type: Actions?.SET_ASSIGNED_WORKFLOWS_TO_AI_ASSISTANT,
				payload: {
					data: reset
						? [...response?.[1]?.[0]?.docs]
						: [
								...state?.assignedWorkflowsToAiAssistant?.data,
								...response?.[1]?.[0]?.docs,
						  ],
					hasMore: response?.[1]?.[0]?.metadata?.[0]?.hasNextPage,
					currentPage: response?.[1]?.[0]?.metadata?.[0]?.currentPage,
				},
			});
			return true;
		}
		return false;
	};

	const unassignWorkflowToAiAssistant = async (assistantId, workflowId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + `/ai-assistants/${assistantId}/workflow-templates`;
		const payload = {
			workflowTemplateId: workflowId,
		};
		const response = await service.fetchDelete(url, usertoken, payload, 'ai_assistant_api');
		return response?.[0];
	};

	const getKnowledgeBaseFiles = async (assistantId, page = 1, limit = 10, fetchMore = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url =
				'/' +
				workspaceId +
				KNOWLEDGE_BASE?.listFilesInKnowledgeBase +
				`?page=${page}&limit=${limit}&assistantId=${assistantId}`;
			const response = await service.fetchGet(url, usertoken, 'ai_assistant_api');

			const selectedVariable = fetchMore
				? 'moreUpdatedKnowledgeBaseFiles'
				: 'updatedKnowledgeBaseFiles';

			if (response?.[0]) {
				dispatch({
					type: Actions?.SET_KNOWLEDGE_BASE_FILES_USING_UPDATED_LOGIC,
					payload: response?.[1],
					selectedVariable: selectedVariable,
				});
			}
		} catch (error) {
			console.log('error==>getKnowledgeBaseFiles', error);
		}
	};

	const getAiChatSessions = async ({ reset = false, filters = {} }) => {
		try {
			const token = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const type = 'ai_assistant_api';

			const generateParams = (filters) => {
				const {
					page = 1,
					limit = 10,
					title = '',
					agentType = [],
					exclude = false,
				} = filters;
				let str = `?page=${page}&limit=${limit}&title=${title}&excludeAgentType=${exclude}`;
				if (agentType?.length > 0) {
					agentType?.forEach((type) => {
						str += `&agentType[]=${type}`;
					});
				}
				return str;
			};
			const paramsString = generateParams(filters);

			const url = '/' + workspaceId + '/ai-chat/list-multiagent-sessions';
			const response = await service?.fetchGet(url + paramsString, token, type, {});
			if (response?.[0]) {
				const aiChatSessions = {
					data: response?.[1]?.data,
					hasMore: response?.[1]?.hasNextPage,
					currentPage: response?.[1]?.currentPage,
					reset,
					filters: { agentType: 'knowledge_agent', exclude: filters?.exclude ?? false },
				};
				dispatch({
					type: Actions?.SET_AI_CHAT_SESSIONS,
					payload: aiChatSessions,
				});
			}
		} catch (error) {
			console.log('error==>getAiChatSessions', error);
		}
	};

	const updateAiChatSessions = async ({
		sessionId,
		addNewSession,
		type = null,
		agentType = null,
		assistantId = null,
		filters = {},
	}) => {
		try {
			if (type === 'update') {
				dispatch({
					type: Actions?.SET_AI_CHAT_SESSIONS,
					payload: {
						type,
						addNewSession,
						sessionId,
						agentType,
						assistantId,
						filters,
					},
				});
				return;
			} else if (type === 'delete') {
				dispatch({
					type: Actions?.SET_AI_CHAT_SESSIONS,
					payload: { type, sessionId },
				});
				return;
			}

			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = '/' + workspaceId + '/ai-chat/list-multiagent-sessions';
			const params = { sessionId, page: 1, limit: 5 };
			const response = await service?.fetchGet(url, usertoken, 'ai_assistant_api', params);

			if (response?.[0] === true) {
				if (response?.[1]?.data?.[0]) {
					dispatch({
						type: Actions?.SET_AI_CHAT_SESSIONS,
						payload: {
							sessionId,
							type: 'update',
							updateSession: true,
							sessionData: {
								...(response?.[1]?.data?.[0] || {}),
								isNewSession: false,
							},
						},
					});
				}
			} else {
				console.log('error==>updateAiChatSessions', response?.[1]);
			}
		} catch (error) {
			console.log('error==>updateAiChatSessions', error);
		}
	};

	const getExistingAiAssistants = async () => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + AI_PERSONALITY?.listAiAssistants;
		try {
			const response = await service?.fetchGet(url, usertoken, 'ai_assistant_api'); // change the type to ai_setup later
			if (response?.[0]) {
				const existingAiAssistants = response?.[1]?.['data']?.map((aiAssistant) => ({
					id: aiAssistant?._id,
					name: aiAssistant?.name,
				}));
				dispatch({
					type: Actions?.SET_EXISTING_AI_ASSISTANTS,
					payload: existingAiAssistants,
				});
			}
		} catch (error) {
			console.log('error==>getExistingAiAssistants', error);
		}
	};
	const getAiAssistants = async (page = 1, limit = 20, fetchMore = false) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = `/${workspaceId}${AI_PERSONALITY?.listAiAssistants}?page=${page}&limit=${limit}`;
		try {
			const response = await service?.fetchGet(url, usertoken, 'ai_assistant_api');
			if (response?.[0]) {
				const selectedVariable = fetchMore ? 'moreAiAssistants' : 'aiAssistants';
				dispatch({
					type: Actions?.SET_AI_ASSISTANTS,
					payload: response?.[1],
					selectedVariable: selectedVariable,
				});
				return response?.[1];
			}
		} catch (error) {
			console.log('error==>getAiAssistants', error);
		}
	};

	const createNewAiAssistant = async (data) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + AI_PERSONALITY?.createNewAiAssistant;
		try {
			const response = await service?.fetchPost(url, data, usertoken, 'ai_assistant_api'); // change the type to ai_setup later
			if (response?.[0]) {
				dispatch({
					type: Actions?.SET_AI_ASSISTANT,
					payload: response?.[1],
				});
				return response?.[1]?._id;
			}
		} catch (error) {
			console.log('error==>createNewAiAssistant', error);
		}
	};

	const updateAiAssistant = async (aiAssistantId, data) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + AI_PERSONALITY?.updateAiAssistant + '/' + aiAssistantId;
		try {
			const response = await service?.fetchPut(url, data, usertoken, 'ai_assistant_api'); // change the type to ai_setup later
			if (response?.[0]) {
				dispatch({
					type: Actions?.SET_ACTIVE_AI_ASSISTANT_DETAILS,
					payload: response?.[1],
				});
				return response?.[1];
			}
		} catch (error) {
			console.log('error==>updateAiAssistant', error);
		}
	};

	const getActiveAiAssistantDetails = async (aiAssistantId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + AI_PERSONALITY?.getAiAssistantDetails + '/' + aiAssistantId;
		try {
			const response = await service?.fetchGet(url, usertoken, 'ai_assistant_api'); // change the type to ai_setup later
			if (response?.[0]) {
				dispatch({
					type: Actions?.SET_ACTIVE_AI_ASSISTANT_DETAILS,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getActiveAiAssistantDetails', error);
		}
	};

	const uploadURLsToKnowledgeBase = async (aiAssistantId, urls) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + KNOWLEDGE_BASE?.uploadURLsToKnowledgeBase;
		const urlUploadPromises = urls.map((link) => {
			return new Promise(async (resolve, reject) => {
				const body = {
					assistant_ids: [aiAssistantId],
					type: 'url',
					url: link?.url,
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

	const uploadPDFsToKnowledgeBase = async (aiAssistantId, files) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + KNOWLEDGE_BASE?.uploadPDFsToKnowledgeBase;
		const batchId = generatePDFsBatchId(aiAssistantId);

		const fileUploadPromises = files.map((file) => {
			return new Promise(async (resolve, reject) => {
				const body = {
					assistant_ids: [aiAssistantId],
					uploadBatchId: batchId,
					originalFileName: file?.name,
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

	const deleteKnowledge = async (knowledgeId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + KNOWLEDGE_BASE?.deleteKnowledge + '/' + knowledgeId;
		try {
			const response = await service?.fetchDelete(url, usertoken, {}, 'ai_assistant_api');
			if (response?.[0]) {
				return {
					ok: true,
					message: 'Knowledge link/file deleted successfully',
				};
			} else {
				return {
					ok: false,
					message: 'Failed to delete knowledge link/file. Please try again.',
				};
			}
		} catch (error) {
			console.log('error==>deleteKnowledge', error);
		}
	};

	const uploadImageToKnowledgeBase = async (file) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const path = '/' + workspaceId + KNOWLEDGE_BASE?.uploadImageToKnowledgeBase;
		const uploadBatchId = Date?.now()?.toString();
		const sessionId = ObjectID()?.toString();
		const body = {
			originalFileName: file?.name,
			uploadBatchId,
			sessionId,
		};

		try {
			const response = await service?.fetchPost(path, body, usertoken, 'ai_assistant_api');
			if (response?.[0]) {
				const { signedUrl, _id } = response?.[1];
				if (signedUrl) {
					const uploadResponse = await fetch(signedUrl, {
						method: 'PUT',
						headers: {
							'Content-Type': file.type || 'application/pdf',
						},
						body: file,
					});

					if (uploadResponse?.ok && uploadResponse?.status === 200) {
						return [true, { _id, uploadBatchId, sessionId }];
					} else {
						return [false, uploadResponse];
					}
				}
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>uploadImageToKnowledgeBase', error);
		}
	};

	const checkFileUploadStatus = async (batchId, fileId) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = '/' + workspaceId + KNOWLEDGE_BASE?.checkFileUploadStatus;
			const body = {
				uploadBatchId: batchId,
				_id: fileId,
			};
			const response = await service?.fetchPost(url, body, usertoken, 'ai_assistant_api');
			if (response?.[0]) {
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>checkFileUploadStatus', error);
		}
	};

	const updateKnowledgeBaseFile = async (knowledgeId, data) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url =
				'/' +
				workspaceId +
				KNOWLEDGE_BASE?.updateKnowledgeBaseFile +
				'/' +
				knowledgeId +
				'/update-status-of-file';
			const response = await service?.fetchPut(url, data, usertoken, 'ai_assistant_api');
			return response;
		} catch (error) {
			console.log('error==>updateKnowledgeBaseFile', error);
		}
	};

	const getInstructions = async (assistantId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url =
			'/' +
			workspaceId +
			'/ai-assistants/' +
			assistantId +
			AI_ASSISTANT_INSTRUCTIONS?.getInstructions;

		try {
			const response = await service?.fetchGet(url, usertoken, 'ai_assistant_api');
			if (response?.[0]) {
				dispatch({
					type: Actions?.GET_AI_INSTRUCTIONS,
					payload: response?.[1]?.instructions,
				});
				return response?.[1];
			}
		} catch (error) {
			console.log('error==>getInstructions', error);
		}
	};

	const createInstruction = async (assistantId, data) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url =
			'/' +
			workspaceId +
			'/ai-assistants/' +
			assistantId +
			AI_ASSISTANT_INSTRUCTIONS?.createInstruction;

		try {
			const response = await service?.fetchPost(url, data, usertoken, 'ai_assistant_api');
			if (response?.[0]) {
				dispatch({
					type: Actions?.SET_AI_INSTRUCTION,
					payload: response?.[1]?.instructions,
				});
				return response?.[1];
			}
		} catch (error) {
			console.log('error==>createInstruction', error);
		}
	};

	const updateInstruction = async (assistantId, instructionId, data) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url =
			'/' +
			workspaceId +
			'/ai-assistants/' +
			assistantId +
			AI_ASSISTANT_INSTRUCTIONS?.updateInstruction +
			'/' +
			instructionId;
		try {
			const response = await service?.fetchPut(url, data, usertoken, 'ai_assistant_api');
			if (response?.[0]) {
				dispatch({
					type: Actions?.SET_AI_INSTRUCTION,
					payload: response?.[1]?.instructions,
				});
				return response?.[1];
			}
		} catch (error) {
			console.log('error==>updateInstruction', error);
		}
	};

	const deleteInstruction = async (assistantId, instructionId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url =
			'/' + workspaceId + '/ai-assistants/' + assistantId + '/instructions/' + instructionId;
		try {
			const response = await service?.fetchDelete(url, usertoken, {}, 'ai_assistant_api');
			if (response?.[0]) {
				dispatch({
					type: Actions?.DELETE_AI_INSTRUCTION,
					payload: response?.[1]?.instructions,
				});
				return response?.[1]?.instructions;
			}
		} catch (error) {
			console.log('error==>deleteInstruction', error);
		}
	};

	const getAiPrompt = async (assistantId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + '/ai-assistants/' + assistantId + AI_PROMPT?.getAiPrompt;
		try {
			const response = await service?.fetchGet(url, usertoken, 'ai_assistant_api');
			if (response?.[0]) {
				dispatch({
					type: Actions?.GET_AI_PROMPT,
					payload: response?.[1],
				});

				return response?.[1];
			}
		} catch (error) {
			console.log('error==>getAiPrompt', error);
		}
	};

	const editAiPrompt = async (assistantId, promptId, data) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url =
			'/' +
			workspaceId +
			'/ai-assistants/' +
			assistantId +
			AI_PROMPT?.editAiPrompt +
			'/' +
			promptId;
		try {
			const response = await service?.fetchPut(url, data, usertoken, 'ai_assistant_api');
			if (response?.[0]) {
				dispatch({
					type: Actions?.SET_AI_PROMPT,
					payload: response?.[1],
				});
				return response?.[1];
			}
		} catch (error) {
			console.log('error==>editAiPrompt', error);
		}
	};

	const getDefaultAiPrompt = async (assistantId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url =
			'/' + workspaceId + '/ai-assistants/' + assistantId + AI_PROMPT?.defaultAiPrompt;
		try {
			const response = await service?.fetchGet(url, usertoken, 'ai_assistant_api');
			if (response?.[0]) {
				dispatch({
					type: Actions?.GET_DEFAULT_AI_PROMPT,
					payload: response?.[1]?.data,
				});
				return response?.[1]?.data;
			}
		} catch (error) {
			console.log('error==>getDefaultAiPrompt', error);
		}
	};

	const selectAiPrompt = async (assistantId, promptId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url =
			'/' +
			workspaceId +
			'/ai-assistants/' +
			assistantId +
			AI_PROMPT?.selectAiPrompt +
			'/' +
			promptId;
		try {
			const response = await service?.fetchPost(url, {}, usertoken, 'ai_assistant_api');
			if (response?.[0]) {
				dispatch({
					type: Actions?.SELECT_AI_PROMPT,
					payload: response?.[1],
				});
				return response?.[1];
			}
		} catch (error) {
			console.log('error==>selectAiPrompt', error);
		}
	};

	const resetAiPrompt = async (assistantId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + '/ai-assistants/' + assistantId + AI_PROMPT?.resetAiPrompt;
		try {
			const response = await service?.fetchPut(url, {}, usertoken, 'ai_assistant_api');
			if (response?.[0]) {
				dispatch({
					type: Actions?.RESET_AI_PROMPT,
					payload: response?.[1],
				});
				return response?.[1];
			}
		} catch (error) {
			console.log('error==>resetAiPrompt', error);
		}
	};

	const uploadFile = async (assistantId, data, type) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + '/ai-assistants/' + assistantId + '/upload-file';
		try {
			const response = await service?.fetchPost(url, { type }, usertoken, 'ai_assistant_api');
			if (response?.[0]) {
				const signedUrl = response?.[1]?.signedUrl;
				const uploadResponse = await axios.put(signedUrl, data, {
					headers: {
						'Content-Type': data?.type,
					},
				});
				if (uploadResponse.status === 200) {
					return {
						ok: true,
						message: 'File uploaded successfully',
					};
				}
			}
		} catch (error) {
			console.log('error==>uploadFile', error);
		}
	};

	const removeFile = async (assistantId, type) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + '/ai-assistants/' + assistantId + '/delete-file/' + type;
		try {
			const response = await service?.fetchDelete(url, usertoken, {}, 'ai_assistant_api');
			return response;
		} catch (error) {
			console.log('error==>removeFile', error);
		}
	};

	const getActions = async (assistantId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + '/ai-assistants/' + assistantId + AI_ACTIONS?.aiActions;
		try {
			const response = await service?.fetchGet(url, usertoken, 'ai_assistant_api');
			if (response?.[0]) {
				dispatch({
					type: Actions?.GET_AI_ACTIONS,
					payload: response?.[1]?.data,
				});
				return response?.[1]?.data;
			}
		} catch (error) {
			console.log('error==>getActions', error);
		}
	};

	const addAiAction = async (assistantId, data) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = '/' + workspaceId + '/ai-assistants/' + assistantId + AI_ACTIONS?.aiActions;
			const body = {
				...data,
				agent: 'knowledgeAgent',
			};
			const response = await service?.fetchPost(url, body, usertoken, 'ai_assistant_api');
			if (response?.[0]) {
				dispatch({
					type: Actions?.ADD_AI_ACTION,
					payload: response?.[1]?.insertData,
				});
				return response?.[1]?.insertData;
			}
		} catch (error) {
			console.log('error==>addAiAction', error);
		}
	};

	const updateAiAction = async (assistantId, actionId, data) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url =
				'/' +
				workspaceId +
				'/ai-assistants/' +
				assistantId +
				AI_ACTIONS?.aiActions +
				'/' +
				actionId;
			const body = {
				...data,
			};
			const response = await service?.fetchPut(url, body, usertoken, 'ai_assistant_api');
			if (response?.[0]) {
				dispatch({
					type: Actions?.UPDATE_AI_ACTION,
					payload: response?.[1]?.assistant,
				});
				return response?.[1]?.assistant;
			}
		} catch (error) {
			console.log('error==>updateAiAction', error);
		}
	};

	const deleteAiAction = async (assistantId, actionId) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url =
				'/' +
				workspaceId +
				'/ai-assistants/' +
				assistantId +
				AI_ACTIONS?.aiActions +
				'/' +
				actionId;
			const response = await service?.fetchDelete(url, usertoken, {}, 'ai_assistant_api');
			if (response?.[0]) {
				dispatch({
					type: Actions?.DELETE_AI_ACTION,
					payload: response?.[1],
				});
				return response?.[1];
			}
		} catch (error) {
			console.log('error==>deleteAiAction', error);
		}
	};

	const getTokenForVoice = async (payload) => {
		try {
			const token = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const url = `/${workspaceId}/generate-voice-agent-token`;
			if (!token) {
				throw new Error('No authentication token found in localStorage');
			}
			const response = await service?.fetchPost(
				url,
				payload,
				token,
				'generate_voice_agent_token_api',
			);

			if (response?.[0]) {
				return response?.[1];
			} else {
				throw new Error(`Failed to fetch token: ${JSON.stringify(response?.[1])}`);
			}
		} catch (error) {
			console.error('Error fetching voice token:', error);
			// If CORS error, provide helpful debugging info
			if (error.message.includes('CORS') || error.message.includes('fetch')) {
				console.error(
					'CORS issue detected. Backend needs to enable CORS for origin:',
					window.location.origin,
				);
			}
			throw error;
		}
	};

	const getAiChatLogs = async (assistantId, page = 1, limit = 20, fetchMore = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url =
				'/' + workspaceId + '/ai-assistants/' + assistantId + AI_CHAT_LOGS?.aiChatLogs;
			const response = await service?.fetchGet(url, usertoken, 'ai_assistant_api');
			if (response?.[0]) {
				const selectedVariable = fetchMore ? 'moreAiChatLogs' : 'aiChatLogs';
				dispatch({
					type: Actions?.GET_AI_CHAT_LOGS,
					payload: response?.[1],
					selectedVariable,
				});
				return response?.[1];
			}
		} catch (error) {
			console.log('error==>getAiChatLogs', error);
		}
	};

	const crawlAiAssistant = async (data) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = '/' + workspaceId + AI_ACTIONS?.aiCrawl;
			const response = await service?.fetchPost(url, data, usertoken, 'ai_predictions');
			if (response?.[0]) {
				dispatch({
					type: Actions?.CRAWL_AI_ASSISTANT,
					payload: response?.[1],
				});
				return response?.[1].urls;
			}
		} catch (error) {
			console.log('error==>crawlAiAssistant', error);
		}
	};

	const getPromptsData = async (queryParams = {}, reset = true) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = '/' + workspaceId + '/ai-suggested-prompts';
			const response = await service?.fetchGet(
				url,
				usertoken,
				'ai_assistant_api',
				queryParams,
			);
			if (response?.[0] === true) {
				dispatch({
					type: Actions?.GET_PROMPTS_DATA,
					payload: reset
						? response?.[1]
						: {
								...response?.[1],
								data: [...state?.promptsData?.data, ...response?.[1]?.data],
						  },
				});
				return response?.[1];
			}
		} catch (error) {
			console.log('error==>getPromptsData', error);
		}
	};

	const getFilesUploadedInAiChat = async (payload, isSearchQueryChanged = false) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = '/' + workspaceId + '/ai-chat/list-ai-chat-file-uploads';
			const response = await service?.fetchGet(url, usertoken, 'ai_assistant_api', payload);

			if (response?.[0]) {
				const { data, currentPage, hasNextPage } = response?.[1];
				let updatedData;
				if (isSearchQueryChanged || !state?.filesUploadedInAiChat) {
					updatedData = data;
				} else {
					updatedData = [...state?.filesUploadedInAiChat?.data, ...data];
				}
				dispatch({
					type: Actions?.GET_FILES_UPLOADED_IN_AI_CHAT,
					payload: {
						data: updatedData,
						currentPage,
						hasNextPage,
					},
				});
			}
		} catch (error) {
			console.log('error==>getFilesUploadedInAiChat', error);
		}
	};

	const updateAiSetupState = (payload) => {
		dispatch({
			type: Actions?.UPDATE_AI_SETUP_STATE,
			payload,
		});
	};

	const getAiSetup = async (isWorkspace = true) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const path = isWorkspace
				? '/ai-tenant-configurations'
				: '/ai-tenant-user-configurations';
			const url = '/' + workspaceId + path + '/ai-setup';

			const response = await service?.fetchGet(url, usertoken, 'ai_assistant_api');
			if (response?.[0] === true) {
				dispatch({
					type: isWorkspace ? Actions?.SET_AI_SETUP : Actions?.SET_AI_SETUP_DATA_USER,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>setAiSetup', error);
		}
	};

	const updateAiSetupData = async (body, isWorkspace = true) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = isWorkspace
				? '/ai-tenant-configurations'
				: '/ai-tenant-user-configurations';
			const url = '/' + workspaceId + path + '/ai-setup';
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchPut(url, body, token, type);

			if (response?.[0] === true) {
				// Calculate updated state here instead of in reducer
				const payload = response?.[1];

				dispatch({
					type: isWorkspace ? Actions?.SET_AI_SETUP : Actions?.SET_AI_SETUP_DATA_USER,
					payload,
				});
				return [true];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>updateAiSetupData', error);
			return [false, error];
		}
	};

	const resetAiSetupData = async (dataType, isWorkspace = true) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = isWorkspace
				? '/ai-tenant-configurations'
				: '/ai-tenant-user-configurations';
			const url = '/' + workspaceId + path + '/ai-setup/' + dataType + '/reset';
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchPut(url, {}, token, type);

			if (response?.[0] === true) {
				// Calculate updated state here
				const currentState = isWorkspace ? state.aiSetupData : state.aiSetupDataUser;
				const payload = {
					...currentState,
					[dataType]: [],
				};

				dispatch({
					type: isWorkspace ? Actions?.SET_AI_SETUP : Actions?.SET_AI_SETUP_DATA_USER,
					payload,
				});
				return [true];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>resetAiSetupData', error);
			return [false, error];
		}
	};

	const deleteAiSetupData = async (dataType, id, isWorkspace = true) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = isWorkspace
				? '/ai-tenant-configurations'
				: '/ai-tenant-user-configurations';
			const url = '/' + workspaceId + path + '/ai-setup/' + dataType + '/' + id;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchDelete(url, token, null, type);

			if (response?.[0] === true) {
				// Calculate updated state here
				const currentState = isWorkspace ? state.aiSetupData : state.aiSetupDataUser;
				const payload = {
					...currentState,
					[dataType]: currentState?.[dataType]?.filter((item) => item?._id !== id),
				};

				dispatch({
					type: isWorkspace ? Actions?.SET_AI_SETUP : Actions?.SET_AI_SETUP_DATA_USER,
					payload,
				});
				return [true];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>deleteAiSetupData', error);
			return [false, error];
		}
	};

	const editAiSetupData = async (dataType, _id, data, isWorkspace = true) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = isWorkspace
				? '/ai-tenant-configurations'
				: '/ai-tenant-user-configurations';
			const url = '/' + workspaceId + path + '/ai-setup/' + dataType + '/' + _id;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const body = {
				...data,
			};
			const response = await service?.fetchPut(url, body, token, type);

			if (response?.[0] === true) {
				// Calculate updated state here
				const currentState = isWorkspace ? state.aiSetupData : state.aiSetupDataUser;
				const payload = {
					...currentState,
					[dataType]: currentState?.[dataType]?.map((item) =>
						item?._id === _id ? { ...data, _id } : item,
					),
				};

				dispatch({
					type: isWorkspace ? Actions?.SET_AI_SETUP : Actions?.SET_AI_SETUP_DATA_USER,
					payload,
				});
				return [true];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>editAiSetupData', error);
			return [false, error];
		}
	};

	const getProactiveHeadings = async ({ module }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const url =
				'/' + workspaceId + `/knowledge-bases/proactive-headlines?moduleType=${module}`;
			const token = localStorage.getItem('usertoken');
			const type = 'tenant';

			const response = await service?.fetchGet(url, token, type);

			if (response?.[0] === true) {
				dispatch({
					type: Actions.SET_PROACTIVE_HEADINGS,
					payload: {
						...state?.proactiveHeadings,
						[`${module}_headlines`]: response?.[1]?.headline,
					},
				});
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>editAiSetupData', error);
			return [false, error];
		}
	};

	const updateStateValues = async (updatedVaribaleValuesObj) => {
		try {
			dispatch({
				type: Actions.UPDATE_STATE_VALUES_SUCCESS,
				payload: updatedVaribaleValuesObj,
			});
		} catch (error) {
			console.log('error==>updateStateValues', error);
		}
	};

	const getAIMemoryInfo = async ({ page = 1, limit = 10 } = {}) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const url = '/' + workspaceId + '/knowledge-bases/list-ai-memory';
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const params = {
				page,
				limit,
			};
			const response = await service?.fetchGet(url, token, type, params);
			const success = response?.[0] === true;
			if (success) {
				const payload = {
					...state?.AIMemoryInfo,
					data: [...(state?.AIMemoryInfo?.data || []), ...(response?.[1]?.data || [])],
					currentPage: response?.[1]?.currentPage,
					hasNextPage: response?.[1]?.hasNextPage,
					totalCount: response?.[1]?.totalCount,
				};
				dispatch({
					type: Actions.SET_AI_MEMORY_LIST,
					payload,
				});
			}
			return success;
		} catch (error) {
			console.log('error==>getAIMemoryList', error);
		}
	};

	const deleteAIMemory = async (memoryId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const url = '/' + workspaceId + '/knowledge-bases/delete-ai-memory/' + memoryId;
			const token = localStorage.getItem('usertoken');
			const type = 'ai_assistant_api';
			const response = await service?.fetchDelete(url, token, null, type);
			if (response?.[0] === true) {
				const payload = {
					...state?.AIMemoryInfo,
					data: state?.AIMemoryInfo?.data?.filter((item) => item?.id !== memoryId),
				};
				dispatch({
					type: Actions.SET_AI_MEMORY_LIST,
					payload,
				});
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>deleteAIMemory', error);
			return [false, error];
		}
	};

	const resetAiSetupState = () => {
		dispatch({ type: Actions?.RESET_STATE });
	};

	return {
		...state,
		updateStateValues,
		getKnowledgeBaseFiles,
		getExistingAiAssistants,
		createNewAiAssistant,
		updateAiAssistant,
		getActiveAiAssistantDetails,
		uploadPDFsToKnowledgeBase,
		uploadURLsToKnowledgeBase,
		assignAiAssistantToSelectedWorkflows,
		getAssignedWorkflowsToAiAssistant,
		unassignWorkflowToAiAssistant,
		getWorkflows,
		resetAiSetupState,
		deleteKnowledge,
		uploadImageToKnowledgeBase,
		checkFileUploadStatus,
		getAiChatSessions,
		getAiAssistants,
		updateKnowledgeBaseFile,
		getInstructions,
		createInstruction,
		updateInstruction,
		deleteInstruction,
		uploadFile,
		getAiPrompt,
		editAiPrompt,
		selectAiPrompt,
		getDefaultAiPrompt,
		resetAiPrompt,
		getActions,
		addAiAction,
		updateAiAction,
		deleteAiAction,
		crawlAiAssistant,
		getAiChatLogs,
		removeFile,
		getTokenForVoice,
		getPromptsData,
		getFilesUploadedInAiChat,
		updateAiSetupState,
		getAiSetup,
		updateAiSetupData,
		resetAiSetupData,
		deleteAiSetupData,
		editAiSetupData,
		updateAiChatSessions,
		getProactiveHeadings,
		getAIMemoryInfo,
		deleteAIMemory,
	};
};
