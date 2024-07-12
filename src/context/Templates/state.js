import * as API from './actionTypes';
import Service from '../../services/index';
import service from '../../services/graphQlServices';
import {
	getTemmplatesQuery,
	createProposalQuery,
	getWorkflowDetailsListQuery,
	duplicateTemplateQuery,
	getClientListQuery,
} from './graphQlFunctions';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './Actions';

export const intialState = {
	workflowslist: null,
	moreWorkList: null,
	clientList: null,
};

export const TemplatesState = (props) => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const getTemplates = async (templateId = null) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const json = {
			filters: {
				limit: 50,
				page: 1,
			},
		};
		const response = await service.query(
			getTemmplatesQuery,
			json,
			workspaceId,
			usertoken,
			'workflows_Api',
		);

		if (response[0]) {
			return [true, response?.[1]?.data?.templates];
		} else {
			return [false, response?.[1]?.message];
		}
	};

	const getTemplatesStatus = async (templateId = null) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.fetchGet(
			`/${workspaceId}${API.TEMPLATES.PROPOSALS}${API.TEMPLATES.TEMPLATE_INSIGHTS}${
				templateId ? `?templateId=${templateId}` : ''
			}`,
			usertoken,
			'proposals_api',
		);

		if (response[0]) {
			return [true, response[1]];
		} else {
			return [false, response?.[1]?.message];
		}
	};

	const getProposals = async (payload, fetchMore = false) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');

		const response = await service.query(
			getWorkflowDetailsListQuery,
			payload,
			workspaceId,
			usertoken,
			'workflows_Api',
		);

		if (response?.[0]) {
			const selectedvariable = fetchMore ? 'moreWorkList' : 'workflowslist';
			dispatch({
				type: Actions?.GET_WORKFLOW_DETAILS_SUCCESS,
				payload: response?.[1]?.data?.workflows,
				selectedvariable,
			});
		} else {
			console.log('api failed getProposals', response);
		}
	};

	const createProposals = async (payload) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const response = await service.query(
			createProposalQuery,
			payload,
			workspaceId,
			usertoken,
			'workflows_Api',
		);

		if (response[0]) {
			return [true, response?.[1]?.data?.createProposalUsingWorkflowTemplate];
		} else {
			return [false, response?.[1]?.message];
		}
	};

	const deleteProposal = async (proposalId, payload) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.fetchDelete(
			`/${workspaceId}${API.TEMPLATES.PROPOSALS}/${proposalId}`,
			usertoken,
			payload,
			'proposals_api',
		);

		if (response[0]) {
			return [true, response[1]];
		} else {
			return [false, response?.[1]?.message];
		}
	};

	const getClientList = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getClientListQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				dispatch({
					type: Actions.GET_ALL_CLIENT_LIST_SUCCESS,
					payload: response?.[1]?.data?.clientsList,
				});
			}
		} catch (error) {
			console.error('Error==>getClientList', error);
		}
	};

	const moveProposalStage = async (proposalId, versionId, status) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		let response = await Service.fetchPost(
			`/${workspaceId}${API.TEMPLATES.PROPOSALS}/${proposalId}/versions/${versionId}/${status}`,
			status == 'reject' ? { notes: 'test' } : {},
			usertoken,
			'proposals_api',
		);

		if (response[0]) {
			return [true, response[1]];
		} else {
			return [false, response?.[1]?.message];
		}
	};

	const duplicateTemplate = async (payload) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');

		const response = await service.query(
			duplicateTemplateQuery,
			payload,
			workspaceId,
			usertoken,
			'workflows_Api',
		);

		if (response?.[0]) {
			const parsedResponse = response?.[1]?.data?.duplicateWorkflowTemplate;
			return [true, parsedResponse];
		} else {
			return [false, response?.[1]?.message];
		}
	};
	const resetTemplateState = async () => {
		try {
			dispatch({ type: Actions.RESET_STATE });
		} catch (error) {
			console.log('error==>resetPropsalState', error);
		}
	};

	return {
		...state,
		getProposals,
		getTemplates,
		getTemplatesStatus,
		createProposals,
		deleteProposal,
		moveProposalStage,
		duplicateTemplate,
		resetTemplateState,
		getClientList,
	};
};
