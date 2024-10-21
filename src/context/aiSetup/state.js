import { useReducer } from 'react';
import Reducer from './reducer';
import { KNOWLEDGE_BASE } from './actionTypes';
import { Actions } from './actions';
import service from '../../services';

export const intialState = {
	knowledgeBaseFiles: null,
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

	return {
		...state,
		getKnowledgeBaseFiles,
	};
};
