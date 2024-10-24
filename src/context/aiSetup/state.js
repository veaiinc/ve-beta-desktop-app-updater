import { useReducer } from 'react';
import Reducer from './reducer';
import { AI_PERSONALITY, KNOWLEDGE_BASE } from './actionTypes';
import { Actions } from './actions';
import service from '../../services';

export const intialState = {
	knowledgeBaseFiles: null,
	existingAiAssistants: null,
	activeAiAssistantDetails: null,
};

export const AiSetupState = () => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const getKnowledgeBaseFiles = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = '/' + workspaceId + KNOWLEDGE_BASE?.listFilesInKnowledgeBase;
			const response = await service.fetchPost(url, null, usertoken, 'ai_setup');
			if (response?.[0]) {
				dispatch({
					type: Actions?.SET_KNOWLEDGE_BASE_FILES,
					payload: response?.[1]?.files,
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

	return {
		...state,
		getKnowledgeBaseFiles,
		getExistingAiAssistants,
		createNewAiAssistant,
		updateAiAssistant,
		getActiveAiAssistantDetails,
	};
};
