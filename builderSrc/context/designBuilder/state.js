import { useReducer } from 'react';
import Service from '../../services/index';
import service from '../../services/graphQlServices';
import Reducer from './reducer';
import { getTemplateIdusingSlugQuery, getTemplateIdusingSessionIdQuery } from './graphQlFunctions';
export const intialState = {
	showRightModalContextState: false,
};
export const DesignBuilderState = (props) => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const getAiResponseForDesignBuilderQuery = async (payload, sessionId) => {
		let workspaceID = localStorage.getItem('workspaceID');
		let usertoken = localStorage.getItem('usertoken');

		const response = await Service.fetchPost(
			`/${workspaceID}/${sessionId}/design_builder`,
			payload,
			usertoken,
			'design_builder_api_server',
		);

		if (response?.[0]) {
			return [true, response?.[1]];
		} else {
			return [false];
		}
	};

	const getTemplateIdusingSlug = async (payload) => {
		let workspaceID = localStorage.getItem('workspaceID');
		let usertoken = localStorage.getItem('usertoken');
		const response = await service.query(
			getTemplateIdusingSlugQuery,
			payload,
			workspaceID,
			null,
			usertoken,
			'workflows_Api',
		);
		if (response?.[0]) {
			return [true, response?.[1]?.data?.getTemplateBySlug?._id];
		} else {
			return [false];
		}
	};

	const getTemplateIdusingSessionId = async (payload) => {
		let workspaceID = localStorage.getItem('workspaceID');
		let usertoken = localStorage.getItem('usertoken');
		const response = await service.query(
			getTemplateIdusingSessionIdQuery,
			payload,
			workspaceID,
			null,
			usertoken,
			'workflows_Api',
		);
		if (response?.[0]) {
			return [true, response?.[1]?.data?.getTemplateBySessionId?._id];
		} else {
			return [false];
		}
	};

	const updateStateValues = (payload) => {
		dispatch({
			type: 'UPDATE_STATE_VALUES',
			payload,
		});
	};
	return {
		...state,
		getAiResponseForDesignBuilderQuery,
		getTemplateIdusingSlug,
		getTemplateIdusingSessionId,
		updateStateValues,
	};
};
