import { useReducer } from 'react';
import Reducer from './reducer';
import { AI_PERSONALITY, KNOWLEDGE_BASE } from './actionTypes';
import { Actions } from './actions';
import service from '../../services';
import { generatePDFsBatchId } from '../../helpers';

export const intialState = {
	knowledgeBaseFiles: {
		data: [],
	},
	existingAiAssistants: null,
	activeAiAssistantDetails: null,
};

export const AiSetupState = () => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const getKnowledgeBaseFiles = async (page = 1, limit = 10) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url =
				'/' +
				workspaceId +
				KNOWLEDGE_BASE?.listFilesInKnowledgeBase +
				`?page=${page}&limit=${limit}`;
			const response = await service.fetchGet(url, usertoken, 'tenant'); // change the type to ai_setup later
			const knowledgeBaseData = {
				data: [...state?.knowledgeBaseFiles?.data, ...response?.[1]?.result],
				hasMore: response?.[1]?.hasNextPage,
				currentPage: response?.[1]?.currentPage,
				totalPages: response?.[1]?.totalPages,
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

	const getUploadedKnowledgeBaseFiles = async () => {
		return;
	};

	const getExistingAiAssistants = async () => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + AI_PERSONALITY?.listAiAssistants;
		try {
			const response = await service?.fetchGet(url, usertoken, 'tenant'); // change the type to ai_setup later
			if (response?.[0]) {
				const existingAiAssistants = response?.[1]?.['result']?.map((aiAssistant) => ({
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

	const createNewAiAssistant = async (data) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + AI_PERSONALITY?.createNewAiAssistant;
		try {
			const response = await service?.fetchPost(url, data, usertoken, 'tenant'); // change the type to ai_setup later
			if (response?.[0]) {
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
			const response = await service?.fetchPut(url, data, usertoken, 'tenant'); // change the type to ai_setup later
			if (response?.[0]) {
				dispatch({
					type: Actions?.SET_ACTIVE_AI_ASSISTANT_DETAILS,
					payload: response?.[1],
				});
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
			const response = await service?.fetchGet(url, usertoken, 'tenant'); // change the type to ai_setup later
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
					const response = await service?.fetchPost(url, body, usertoken, 'tenant');
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
					const response = await service?.fetchPost(url, body, usertoken, 'tenant'); // change the type to ai_setup later
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

	return {
		...state,
		getKnowledgeBaseFiles,
		getUploadedKnowledgeBaseFiles,
		getExistingAiAssistants,
		createNewAiAssistant,
		updateAiAssistant,
		getActiveAiAssistantDetails,
		uploadPDFsToKnowledgeBase,
		uploadURLsToKnowledgeBase,
	};
};
