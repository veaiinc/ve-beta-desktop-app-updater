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
	aiChatSessions: {
		data: [],
		hasMore: false,
		currentPage: 1,
	},
	aiAssistant: null,
	aiInstructions: null,
	aiPrompt: null,
	aiDefaultPrompt: null,
	aiActions: null,
	aiAction: null,
	tokenForVoice: null,
	aiChatLogs: null,
	moreAiChatLogs: null,
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

	const getKnowledgeBaseFiles = async (assistantId, page = 1, limit = 10, reset = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url =
				'/' +
				workspaceId +
				KNOWLEDGE_BASE?.listFilesInKnowledgeBase +
				`?page=${page}&limit=${limit}&assistantId=${assistantId}`;
			const response = await service.fetchGet(url, usertoken, 'ai_assistant_api'); // change the type to ai_setup later
			const knowledgeBaseData = {
				data: reset
					? [...response?.[1]?.data]
					: [...state?.knowledgeBaseFiles?.data, ...response?.[1]?.data],
				hasMore: response?.[1]?.hasNextPage,
				currentPage: response?.[1]?.currentPage,
				totalPages: response?.[1]?.totalDocs,
				areKnowledgeBaseFilesLoading: false,
			};
			if (response?.[0]) {
				dispatch({
					type: Actions?.SET_KNOWLEDGE_BASE_FILES,
					payload: knowledgeBaseData,
				});
			}
		} catch (error) {
			console.log('error==>getKnowledgeBaseFiles', error);
		}
	};

	const getAiChatSessions = async (page = 1, limit = 10, reset = false) => {
		try {
			const token = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const type = 'tenant';
			const params = {
				page,
				limit,
			};
			const url = '/' + workspaceId + '/list-multiagent-sessions';
			const response = await service?.fetchGet(url, token, type, params);
			const aiChatSessions = {
				data: reset
					? [...response?.[1]?.data]
					: [...state?.aiChatSessions?.data, ...response?.[1]?.data],
				hasMore: response?.[1]?.hasNextPage,
				currentPage: response?.[1]?.currentPage,
			};
			if (response?.[0]) {
				dispatch({
					type: Actions?.SET_AI_CHAT_SESSIONS,
					payload: aiChatSessions,
				});
			}
		} catch (error) {
			console.log('error==>getAiChatSessions', error);
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

	//from herer
	const updateKnowledgeBaseFile = async (knowledgeId, data) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + KNOWLEDGE_BASE?.updateKnowledgeBaseFile + '/' + knowledgeId;
		try {
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
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + '/ai-assistants/' + assistantId + AI_ACTIONS?.aiActions;
		try {
			const response = await service?.fetchPost(url, data, usertoken, 'ai_assistant_api');
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
		try {
			const response = await service?.fetchPut(url, data, usertoken, 'ai_assistant_api');
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
		try {
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

	const getTokenForVoice = async () => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');

			const response = await service?.fetchPost(
				`/${workspaceId}/generate-livekit-token`,
				{},
				usertoken,
				'ai_predictions',
			);

			if (response?.[0]) {
				return response?.[1];
			} else {
				throw new Error('Failed to fetch token');
			}
		} catch (error) {
			console.error('Error fetching token:', error);
			throw error;
		}
	};

	const getAiChatLogs = async (assistantId, page = 1, limit = 20, fetchMore = false) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + '/ai-assistants/' + assistantId + AI_CHAT_LOGS?.aiChatLogs;
		try {
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

	const resetAiSetupState = () => {
		dispatch({ type: Actions?.RESET_STATE });
	};

	return {
		...state,
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
		getAiChatLogs,
		removeFile,
		getTokenForVoice,
	};
};
