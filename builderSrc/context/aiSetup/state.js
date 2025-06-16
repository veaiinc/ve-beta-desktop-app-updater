import { useReducer } from 'react';
import Reducer from './reducer';
import { AI_PERSONALITY } from './actionTypes';
import { Actions } from './actions';
import service from '../../services';

export const initialState = {
	existingAiAssistants: null,
};

export const AiSetupState = () => {
	const [state, dispatch] = useReducer(Reducer, initialState);

	const getExistingAiAssistants = async () => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + AI_PERSONALITY?.listAiAssistants;
		try {
			const response = await service?.fetchGet(url, usertoken, 'ai_assistant_api');
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

	return {
		...state,
		getExistingAiAssistants,
		assignAiAssistantToSelectedWorkflows,
	};
};
