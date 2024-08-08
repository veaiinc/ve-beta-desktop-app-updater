import * as API from './actionTypes';
import Service from '../../services/index';
import service from '../../services/graphQlServices';
import {
	getTemmplatesQuery,
	createProposalQuery,
	getWorkflowDetailsListQuery,
	duplicateTemplateQuery,
	getClientListQuery,
	getTemplateInfoQuery,
	getAllEmailTemplatesQuery,
	addEmailTriggersInWorkflowQuery,
	getSpecificWorkflowTemplateDetailsQuery,
	deleteWorkflowStepQuery,
	updateWorkflowStepsQuery,
	getSmartFileDataQuery,
	updateThankYouQuery,
	updateFormQuery,
	updateInvoiceQuery,
	updateContractQuery,
	updateProposalQuery,
	getWorkflowListQuery,
	getTemplatesListForCreateLeadQuery,
	createLeadfromTemplatesQuery,
	workflowsLinkQuery,
	formResponsesQuery,
} from './graphQlFunctions';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './Actions';

export const intialState = {
	workflowslist: null,
	moreWorkList: null,
	clientList: null,
	templatesInfo: null, //delete this later
	specificTemplatesInfo: null,
	allEmailTemplates: null,
	myWorkflows: null,
	myMoreWorkflows: null,
	globalWorkflows: null,
	globalMoreWorkflows: null,
	smartFileInfo: null,
	templatesListForCreateLead: null,
	salePageRefresh: null,
	formResponseData: null,
	generatePublicLinkData: null,
};

export const TemplatesState = (props) => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	//delete this function later
	const getTemplates = async () => {
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
			dispatch({
				type: Actions.GET_ALL_TEMPLATES_INFO_SUCCESS,
				payload: response?.[1]?.data?.templates,
			});
		} else {
			console.log('api failed ==>getTemplates', response);
		}
	};

	const getMyWorkflows = async (payload, fetchMore = false) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');

		const response = await service.query(
			getTemmplatesQuery,
			payload,
			workspaceId,
			usertoken,
			'workflows_Api',
		);

		if (response?.[0]) {
			const selectedvariable = fetchMore ? 'myMoreWorkflows' : 'myWorkflows';
			dispatch({
				type: Actions.GET_MY_WORKFLOWS_TEMPLATES_INFO_SUCCESS,
				payload: response?.[1]?.data?.templates,
				selectedvariable,
			});
		} else {
			console.log('api failed ==>getTemplates', response);
		}
	};

	const getGlobalWorkflows = async (payload, fetchMore = false) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');

		const response = await service.query(
			getTemmplatesQuery,
			payload,
			workspaceId,
			usertoken,
			'workflows_Api',
		);

		if (response[0]) {
			const selectedvariable = fetchMore ? 'globalMoreWorkflows' : 'globalWorkflows';
			dispatch({
				type: Actions.GET_GLOBAL_WORKFLOWS_TEMPLATES_INFO_SUCCESS,
				payload: response?.[1]?.data?.templates,
				selectedvariable,
			});
		} else {
			console.log('api failed ==>getTemplates', response);
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

	//delete this function
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

	const duplicateGlobalWorkflowTemplate = async (payload) => {
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
			return [true, response?.[1]?.data?.duplicateWorkflowTemplate];
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

	const getTemplateInfo = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getTemplateInfoQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				const data = response?.[1]?.data?.templateInfo;
				dispatch({ type: Actions.GET_SPECIFIC_TEMPLATE_INFO_SUCCESS, payload: data });
			} else {
				return [false, response?.[1]?.message];
			}
		} catch (error) {
			console.log('error==>updateStateValues', error);
		}
	};

	const getAllEmailTemplates = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getAllEmailTemplatesQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				const data = response?.[1]?.data?.emailTemplatesList;
				dispatch({ type: Actions.GET_ALL_EMAIL_TEMPLATES_SUCCESS, payload: data });
			} else {
				console.log('api failed==>getAllEmailTemplates', response);
			}
		} catch (error) {
			console.log('error==>getAllEmailTemplates', error);
		}
	};

	const addEmailTriggersInWorkflow = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				addEmailTriggersInWorkflowQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				const dataResponse = response?.[1]?.data?.updateWorkflowTemplate;
				return [true, dataResponse];
			} else {
				console.log('Api failed ==>addEmailTriggersInWorkflow', response);
				return [false];
			}
		} catch (error) {
			console.log('error==>addEmailTriggersInWorkflow', error);
		}
	};

	const getSpecificWorkflowTemplateDetails = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getSpecificWorkflowTemplateDetailsQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return [true, response?.[1]?.data?.getEmailTemplate];
			} else {
				console.log('api failed==>getSpecificWorkflowTemplateDetails', response);
				return [false];
			}
		} catch (error) {
			console.log('error==>getSpecificWorkflowTemplateDetails', error);
		}
	};

	const deleteWorkflowStep = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				deleteWorkflowStepQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return [true];
			} else {
				console.log('Api failed==>deleteWorkflowStep', response);
				return [false];
			}
		} catch (error) {
			console.log('error==>deleteWorkflowStep', error);
		}
	};

	const updateWorkflowSteps = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				updateWorkflowStepsQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return [true];
			} else {
				console.log('Api failed==>updateWorkflowSteps', response);
				return [false];
			}
		} catch (error) {
			console.log('error==>updateWorkflowSteps', error);
		}
	};

	const getSmartFileData = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getSmartFileDataQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				const payload = response?.[1]?.data?.getWorkflowWithModules;
				dispatch({
					type: Actions.SMART_FILE_INFO_SUCCESS,
					payload,
				});
			} else {
				console.log('Api failed==>getSmartFileData', response);
			}
		} catch (error) {
			console.log('error==>getSmartFileData', error);
		}
	};

	const updateProposal = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				updateProposalQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return [true];
			} else {
				console.log('Api failed==>updateProposal', response);
			}
		} catch (error) {
			console.log('error==>updateProposal', error);
		}
	};

	const updateContracts = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				updateContractQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return [true];
			} else {
				console.log('Api failed==>updateContracts', response);
			}
		} catch (error) {
			console.log('error==>updateContracts', error);
		}
	};

	const updateInvoice = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				updateInvoiceQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return [true];
			} else {
				console.log('Api failed==>updateInvoice', response);
			}
		} catch (error) {
			console.log('error==>updateInvoice', error);
		}
	};

	const updateForm = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				updateFormQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return [true];
			} else {
				console.log('Api failed==>updateForm', response);
			}
		} catch (error) {
			console.log('error==>updateForm', error);
		}
	};

	const updateThankyou = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				updateThankYouQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return [true];
			} else {
				console.log('Api failed==>updateThankyou', response);
			}
		} catch (error) {
			console.log('error==>updateThankyou', error);
		}
	};

	const getWorkflowsList = async (payload, fetchMore = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getWorkflowListQuery,
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
				console.log('Api failed==>getWorkflowsList', response);
			}
		} catch (error) {
			console.log('error==>getWorkflowsList', error);
		}
	};

	const getTemplatesListForCreateLead = async () => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');

		const payload = {
			filters: {
				limit: 30,
				page: 1,
				type: 'workspace',
				status: 'published',
			},
		};
		const response = await service.query(
			getTemplatesListForCreateLeadQuery,
			payload,
			workspaceId,
			usertoken,
			'workflows_Api',
		);

		if (response?.[0]) {
			dispatch({
				type: Actions.GET_TEMPLATES_LIST_FOR_CREATE_LEAD_SUCCESS,
				payload: response?.[1]?.data?.templates,
			});
		} else {
			console.log('api failed ==>getTemplatesListForCreateLead', response);
		}
	};

	const createLeadfromTemplates = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				createLeadfromTemplatesQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return [true];
			} else {
				return [false, response?.[1]?.message || 'Something went Worng'];
			}
		} catch (error) {
			console.log('api failed ==>createLeadfromTemplates', error);
		}
	};

	const sendSmartFile = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				workflowsLinkQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return [true];
			} else {
				return [false, response?.[1]?.message || 'Something went Worng'];
			}
		} catch (error) {
			console.log('api failed ==>sendSmartFile', error);
		}
	};

	const getformResponses = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				formResponsesQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				console.log('response: ', response);
				dispatch({
					type: Actions.GET_FORM_RESPONSES_SUCCESS,
					payload: response?.[1]?.data?.formResponse,
				});
			} else {
				console.log('handle the error getformResponses', response);
			}
		} catch (error) {
			console.log('api failed ==>getformResponses', error);
		}
	};
	return {
		...state,
		getProposals,
		getMyWorkflows,
		getTemplatesStatus,
		createProposals,
		deleteProposal,
		moveProposalStage,
		duplicateTemplate,
		resetTemplateState,
		getClientList,
		updateStateValues,
		getTemplateInfo,
		getAllEmailTemplates,
		addEmailTriggersInWorkflow,
		getSpecificWorkflowTemplateDetails,
		deleteWorkflowStep,
		updateWorkflowSteps,
		getGlobalWorkflows,
		getTemplates,
		duplicateGlobalWorkflowTemplate,
		getSmartFileData,
		updateProposal,
		updateContracts,
		updateInvoice,
		updateForm,
		updateThankyou,
		getWorkflowsList,
		getTemplatesListForCreateLead,
		createLeadfromTemplates,
		sendSmartFile,
		getformResponses,
	};
};
