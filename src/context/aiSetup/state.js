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
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + KNOWLEDGE_BASE?.listFilesInKnowledgeBase;
		const response = await service.fetchPost(url, null, usertoken, 'ai_setup');
		if (response[0]) {
			dispatch({ type: Actions?.SET_KNOWLEDGE_BASE_FILES, payload: response[1]?.files });
		}
	};

	const getExistingAiAssistants = async () => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + AI_PERSONALITY?.listAiAssistants;
		const response = await service.fetchGet(url, usertoken, 'tenant'); // change the type to ai_setup later
		if (response[0]) {
			const existingAiAssistants = response[1]?.['result']?.map((aiAssistant) => ({
				id: aiAssistant?._id,
				name: aiAssistant?.name,
			}));
			dispatch({
				type: Actions?.SET_EXISTING_AI_ASSISTANTS,
				payload: existingAiAssistants,
			});
		}
	};

	const createNewAiAssistant = async (data) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + AI_PERSONALITY?.createNewAiAssistant;
		const response = await service.fetchPost(url, data, usertoken, 'tenant'); // change the type to ai_setup later
		if (response[0]) {
			return `/settings/ai-setup-page/${response[1]?._id}`;
		}
	};

	const updateAiAssistant = async (aiAssistantId, data) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + AI_PERSONALITY?.updateAiAssistant + '/' + aiAssistantId;
		const response = await service.fetchPut(url, data, usertoken, 'tenant'); // change the type to ai_setup later
		if (response[0]) {
			dispatch({
				type: Actions?.SET_ACTIVE_AI_ASSISTANT_DETAILS,
				payload: response[1],
			});
		}
	};

	const getActiveAiAssistantDetails = async (aiAssistantId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + AI_PERSONALITY?.getAiAssistantDetails + '/' + aiAssistantId;
		const response = await service.fetchGet(url, usertoken, 'tenant'); // change the type to ai_setup later
		if (response[0]) {
			dispatch({
				type: Actions?.SET_ACTIVE_AI_ASSISTANT_DETAILS,
				payload: response[1],
			});
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
