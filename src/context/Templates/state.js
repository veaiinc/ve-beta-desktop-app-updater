import service from '../../services/graphQlServices';
import { message } from 'antd';
import {
	getTemmplatesQuery,
	duplicateTemplateQuery,
	getClientListQuery,
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
	formResponsesQuery,
	changeWorkflowStatusQuery,
	getSignedUrlForContractsQuery,
	moveWorkflowStatusQuery,
	getSpecifiTemplatesInfoQuery,
	getSendSmartFileTemplateQuery,
	sendSmartFileMutation,
	checkSmartFileSlugExistsQuery,
	updateSmartFileSlugMutation,
	deleteLeadMutation,
	deleteWorkflowTemplatesMutation,
	updateSendSmartFileSettingsMutation,
} from './graphQlFunctions';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './Actions';

export const intialState = {
	workflowslist: null,
	moreWorkList: null,
	clientList: null,
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
	contractSignedLocalState: null,
	specificTemplatesInfo: null,
	smartFileEmailTemplateData: null,
};

export const TemplatesState = (props) => {
	const [state, dispatch] = useReducer(Reducer, intialState);

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
				sendSmartFileMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				message.success('Email Sent Successfully');
				return [true];
			} else {
				message.error('Something Went wrong, try again');
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

	const chnageWorkflowStats = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				changeWorkflowStatusQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return [true];
			} else {
				console.log('handle the error getformResponses', response);
				return [false];
			}
		} catch (error) {
			console.log('api failed ==>chnageWorkflowStatsu', error);
		}
	};

	const getSignedUrlForContracts = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getSignedUrlForContractsQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return [true, response?.[1]?.data?.uploadContractSignedUrl];
			} else {
				console.log('handle the error getSignedUrlForContracts', response);
				return [false];
			}
		} catch (error) {
			console.log('api failed ==>getSignedUrlForContracts', error);
		}
	};

	const dataURLToBlob = async (dataURL) => {
		const byteString = atob(dataURL.split(',')[1]);
		const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

		const buffer = new ArrayBuffer(byteString.length);
		const dataView = new Uint8Array(buffer);

		for (let i = 0; i < byteString.length; i++) {
			dataView[i] = byteString.charCodeAt(i);
		}

		return new Blob([buffer], { type: mimeString });
	};

	const uploadContractSignature = async (payload) => {
		try {
			const { dataURL, signedUrl } = payload;
			const blob = await dataURLToBlob(dataURL);
			const response = await fetch(signedUrl, {
				method: 'PUT',
				body: blob,
				headers: {
					'Content-Type': 'image/png', // Ensure the content type matches the image format
				},
			});

			if (response.ok) {
				console.log('Image uploaded successfully');
				return [true];
			} else {
				console.error('Upload failed', response.status, response.statusText);
				return [false];
			}
		} catch (error) {
			console.log('api failed ==>uploadContractSignature', error);
		}
	};

	const moveWorkflowStatus = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				moveWorkflowStatusQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return [true];
			} else {
				console.log('handle the error moveWorkflowStatus', response);
				return [false];
			}
		} catch (error) {
			console.log('api failed ==>moveWorkflowStatus', error);
		}
	};

	const getSpecificTemplatesInfo = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getSpecifiTemplatesInfoQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.GET_SPECIFIC_TEMPLATE_INFO_SUCCESS,
					payload: response?.[1]?.data?.templateInfo,
				});
			} else {
				console.log('handle the error getSpecificTemplatesInfo', response);
			}
		} catch (error) {
			console.log('api failed ==>getSpecificTemplatesInfo', error);
		}
	};

	const getSendSmartFileEmailTemplate = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getSendSmartFileTemplateQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.GET_SMART_FILE_EMAIL_TEMPLATE_SUCCESS,
					payload: response?.[1]?.data?.getWorflowEmailTemplate,
				});
			} else {
				console.log('handle the error getSendSmartFileEmailTemplate', response);
			}
		} catch (error) {
			console.log('api failed ==>getSendSmartFileEmailTemplate', error);
		}
	};

	const checkSmartFileSlugExists = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				checkSmartFileSlugExistsQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				const { isSlugAvailable } = response?.[1]?.data;
				return [isSlugAvailable];
			} else {
				return [false];
			}
		} catch (error) {
			console.log('api failed ==>checkSmartFileSlugExists', error);
		}
	};

	const updateSmartFileSlug = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				updateSmartFileSlugMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				return [true, response?.[1]?.data?.updateSlug?.slug];
			} else {
				return [false];
			}
		} catch (error) {
			console.log('api failed ==>updateSmartFileSlug', error);
		}
	};

	const deleteLead = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				deleteLeadMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				return [true];
			} else {
				return [false];
			}
		} catch (error) {
			console.log('api failed ==>deleteLead', error);
		}
	};
	const deleteWorkflowTemplates = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				deleteWorkflowTemplatesMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				return [true];
			} else {
				return [false];
			}
		} catch (error) {
			console.log('api failed ==>deleteLead', error);
		}
	};

	const updateSendSmartFileSettings = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				updateSendSmartFileSettingsMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				return [true];
			} else {
				return [false];
			}
		} catch (error) {
			console.log('api failed ==>updateSendSmartFileSettings', error);
		}
	};

	return {
		...state,
		getMyWorkflows,
		resetTemplateState,
		getClientList,
		updateStateValues,
		getAllEmailTemplates,
		addEmailTriggersInWorkflow,
		getSpecificWorkflowTemplateDetails,
		deleteWorkflowStep,
		updateWorkflowSteps,
		getGlobalWorkflows,
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
		chnageWorkflowStats,
		getSignedUrlForContracts,
		uploadContractSignature,
		moveWorkflowStatus,
		getSpecificTemplatesInfo,
		getSendSmartFileEmailTemplate,
		checkSmartFileSlugExists,
		updateSmartFileSlug,
		deleteLead,
		deleteWorkflowTemplates,
		updateSendSmartFileSettings,
	};
};
