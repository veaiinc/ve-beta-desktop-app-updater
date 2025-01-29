import { useReducer } from 'react';
import Reducer from './reducer';
import { AI_PERSONALITY, KNOWLEDGE_BASE } from './actionTypes';
import { Actions } from './actions';
import service from '../../services';
import gqlService from '../../services/graphQlServices';
import { generatePDFsBatchId } from '../../helpers';
import { getTemmplatesQuery } from '../Templates/graphQlFunctions';

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
	aiAssistant: null,
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

	const getAiAssistants = async (page = 1, limit = 10, fetchMore = false) => {
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
				console.log(' createNewAiAssistant response', response?.[1]);
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
				try {
					const response = await service?.fetchPost(
						url,
						body,
						usertoken,
						'ai_assistant_api',
					); // change the type to ai_setup later
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

						if (uploadResponse.ok) {
							return resolve({ file: file.name, status: 'resolved' });
						} else {
							return reject({
								file: file.name,
								status: 'rejected',
								error: 'Failed to upload to S3',
							});
						}
					}
				} catch (error) {
					return reject({ file: file.name, status: 'rejected', error: error.message });
				}
			});
		});

		const uploadResults = await Promise.allSettled(fileUploadPromises);
		const statusSummary = uploadResults.map((result) => {
			if (result.status === 'fulfilled') {
				return { file: result.value.file, status: result.value.status };
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
		getAiAssistants,
		updateKnowledgeBaseFile,
	};
};
