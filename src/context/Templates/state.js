import service from '../../services/graphQlServices';
import { message } from 'antd';
import { ReactComponent as AiSparkel } from '../../assets/svg/calendar/aiSparkel.svg';
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
	getTabItemCountQuery,
	getRequiredActionDetailsQuery,
	updateSendSmartFileSettingsMutation,
	getLatestSendSmartFileSettingsQuery,
	getActivityLogsQuery,
} from './graphQlFunctions';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './Actions';
import Service from '../../services/index';
import { sendCustomMailMutation } from '../subscription/graphqlFunctions';
import { getBase64 } from '../../helpers';

export const intialState = {
	workflowslist: null,
	moreWorkList: null,
	workflowslistForFiles: null,
	clientList: null,
	clientListForDocs: null,
	templatesListForDocs: null,
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
	requiredActions: { actions: [], hasMore: false, loading: true },
	tabItemCount: null,
	eventsPresetData: null,
	sendSmartFileSettings: null,
	aiPredictedData: null,
	connectUrl: null,
	activityLogs: null,
	moreActivityLogs: null,
	draftStateWorkflowtemplates: null,
	moreDraftStateWorkflowtemplates: null,
	createLeadModalContextState: false,
	globalChatMessages: [{ type: 'AI', message: 'Hello, how can I help you today?' }],
	docsFilesList: null,
	moreDocsFilesList: null,
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
					type: Actions?.GET_ALL_CLIENT_LIST_SUCCESS,
					payload: response?.[1]?.data?.clientsList,
				});
			}
		} catch (error) {
			console.error('Error==>getClientList', error);
		}
	};

	const getClientListForDocs = async (payload) => {
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
					type: Actions?.GET_ALL_CLIENT_LIST_FOR_DOCS_SUCCESS,
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
				return [false];
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
			const response = await service?.query(
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

	const getWorkflowsListForFiles = async (payload, fetchMore = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service?.query(
				getWorkflowListQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				dispatch({
					type: Actions?.GET_WORKFLOW_DETAILS_FOR_FILES_SUCCESS,
					payload: { [payload?.filters?.templateId]: response?.[1]?.data?.workflows },
					selectedvariable: 'workflowslistForFiles',
				});
			} else {
				console.log('Api failed==>getWorkflowsList', response);
			}
		} catch (error) {
			console.log('error==>getWorkflowsList', error);
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

	const getTemplatesListForDocs = async (page = 1, limit = 10) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');

		const payload = {
			filters: {
				limit,
				page,
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
				type: Actions.GET_TEMPLATES_LIST_FOR_DOCS_SUCCESS,
				payload: response?.[1]?.data?.templates,
			});
		} else {
			console.log('api failed ==>getTemplatesListForDocs', response);
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

		const buffer = new ArrayBuffer(byteString?.length);
		const dataView = new Uint8Array(buffer);

		for (let i = 0; i < byteString?.length; i++) {
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

	// Sheshant
	const getTabItemCount = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getTabItemCountQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				const requiredActions = response?.[1]?.data?.getNumberOfRequiredActions;
				dispatch({
					type: Actions.GET_TAB_ITEM_COUNT_SUCCESS,
					payload: requiredActions,
				});
			} else {
				console.log('api failed ==>getTabItemCount', response);
			}
		} catch (error) {
			console.log('api failed ==>getTabItemCount', error);
		}
	};

	const getRequiredActions = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');

			const { resetRequiredActions, ...queryPayload } = payload;

			const response = await service.query(
				getRequiredActionDetailsQuery,
				queryPayload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				dispatch({
					type: Actions.GET_REQUIRED_ACTIONS_SUCCESS,
					payload: {
						actions: resetRequiredActions
							? response?.[1]?.data?.listRequiredActions?.data
							: state?.requiredActions?.actions?.concat(
									response?.[1]?.data?.listRequiredActions?.data,
							  ),
						hasMore: response?.[1]?.data?.listRequiredActions?.hasNextPage,
						loading: false,
					},
				});
			} else {
				return [false];
			}
		} catch (error) {
			console.log('api failed ==>getRequiredActionDetails', error);
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

	//events presets
	const getEventsPresets = async (params) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchGet(
				`/${workspaceId}/variables/list`,
				usertoken,
				'proposals_api',
				params,
			);
			if (response?.[0] === true) {
				dispatch({ type: Actions.GET_EVENTS_PRESETDATA_SUCCESS, payload: response?.[1] });
			} else {
				message.error('Unable to fetch events presets');
				console.log('api failed ==>getEventsPresets', response);
			}
		} catch (error) {
			console.log('errror ==>getEventsPresets', error);
		}
	};

	const addEventsPresets = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchPost(
				`/${workspaceId}/variables`,
				payload,
				usertoken,
				'proposals_api',
			);
			if (response?.[0] === true) {
				return [true, response?.[1]];
			} else {
				console.log('api failed ==>addEventsPresets', response);
				return [false];
			}
		} catch (error) {
			console.log('errror ==>addEventsPresets', error);
		}
	};

	const editEventsPresets = async (payload, varaibleId) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchPut(
				`/${workspaceId}/variables/${varaibleId}`,
				payload,
				usertoken,
				'proposals_api',
			);
			if (response?.[0] === true) {
				return [true, response?.[1]];
			} else {
				console.log('api failed ==>editEventsPresets', response);
				return [false];
			}
		} catch (error) {
			console.log('errror ==>editEventsPresets', error);
		}
	};

	const deleteEventsPreset = async (varaibleId) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchDelete(
				`/${workspaceId}/variables/${varaibleId}`,
				usertoken,
				null,
				'proposals_api',
			);
			if (response?.[0] === true) {
				return [true];
			} else {
				console.log('api failed ==>editEventsPresets', response);
				return [false];
			}
		} catch (error) {
			console.log('errror ==>editEventsPresets', error);
		}
	};

	const getLatestSendSmartFileSettings = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getLatestSendSmartFileSettingsQuery,
				null,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.GET_SEND_SMART_FILE_SETTINGS_SUCCESS,
					payload: response?.[1]?.data?.getLatestWorkflowSettings,
				});
			} else {
				console.log('api failed==>getLatestSendSmartFileSettings', response);
			}
		} catch (error) {
			console.log('errror ==>getLatestSendSmartFileSettings', error);
		}
	};

	//Ai predictions
	const getAiPredictionForSmartFile = async (workflowSlug) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/${workflowSlug}/predict`;
			const response = await Service.fetchGet(url, usertoken, 'ai_predictions');

			if (response?.[0]) {
				dispatch({
					type: Actions.GET_AI_PREDICTED_DATA_SUCCESS,
					payload: response?.[1],
				});
			} else {
				console.log('api failed==>getAiPredictionForSmartFile', response);
			}
		} catch (error) {
			console.log('errror ==>getAiPredictionForSmartFile', error);
		}
	};

	//leaveWorkspace
	const leaveWorkspace = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchDelete(
				`/tenant/${workspaceId}/tenant-users/leave-workspace`,
				usertoken,
				null,
				'auth',
			);
			if (response?.[0] === 200 || response?.[0] === true) {
				return [true];
			} else {
				console.log('api failed==>leaveWorkspace', response);
				message.error(response?.[1]?.message || 'Unable to perform this operation');
				return [false, response?.[1]?.message];
			}
		} catch (error) {
			console.log('errror ==>getAiPredictionForSmartFile', error);
		}
	};

	const sendCustomEmailToClients = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				sendCustomMailMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				return [true];
			} else {
				message.error('Error sending Email');
				return [false];
			}
		} catch (error) {
			console.log('errror ==>sendCustomEmailToClients', error);
		}
	};

	const connectThirdParty = async (connectType) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const path = `/${connectType}/${workspaceId}/auth`;

			const response = await Service?.fetchGet(
				path,
				usertoken,
				'third_party_integrations_api',
			);

			if (response?.[0] === true) {
				dispatch({
					type: Actions?.SET_CONNECT_URL,
					payload: [true, response?.[1]?.connectUrl || response?.[1]?.url],
				});
			} else {
				dispatch({
					type: Actions?.SET_CONNECT_URL,
					payload: [
						false,
						{
							message: 'An unexpected error occured. Please try again!',
							error: response?.[1],
						},
					],
				});
			}
		} catch (error) {
			console.log('error==>connectZoho', error);
		}
	};

	const getActivityLogs = async (payload, fetchMore = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getActivityLogsQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				dispatch({
					type: fetchMore
						? Actions.GET_MORE_ACTIVITY_LOGS_SUCCESS
						: Actions.GET_ACTIVITY_LOGS_SUCCESS,
					payload: response?.[1]?.data?.activityLogs,
				});
			} else {
				message.error('Error fetching activity logs');
			}
		} catch (error) {
			console.log('errror ==>getActivityLogs', error);
		}
	};

	const getDrafStateWorkflowtemplates = async (payload, fetchMore = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getTemmplatesQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			// console.log('response==>getDrafStateWorkflowtemplates', response);

			if (response?.[0]) {
				dispatch({
					type: fetchMore
						? Actions.GET_MORE_DRAFT_STATE_WORKFLOW_TEMPLATE_SUCCESS
						: Actions.GET_DRAFT_STATE_WORKFLOW_TEMPLATE_SUCCESS,
					payload: response?.[1]?.data?.templates,
				});
			} else {
				message.error('Error fetching activity logs');
			}
		} catch (error) {
			console.log('errror ==>getDrafStateWorkflowtemplates', error);
		}
	};

	const toggleCreateLeadModal = (payload) => {
		dispatch({ type: Actions.TOGGLE_CREATE_LEAD_MODAL_SUCCESS, payload });
	};

	//AI chat in smart file

	const smartFileAiChat = async (payload, sessionId) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/${sessionId}/multi_agent_chat`;
			const response = await Service.fetchPost(url, payload, usertoken, 'ai_predictions');
			if (response?.[0]) {
				return [true, response?.[1]];
			}
			console.log('response==>smartFileAiChat', response);
		} catch (error) {
			console.log('errror ==>smartFileAiChat', error);
		}
	};

	const uploadImageInSmartFileAi = async (file, slug) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `https://ai.ap-south-1.ve.ai/${workspaceId}/${slug}/data_extraction`;

			const base64 = await getBase64(file);
			// Convert base64 to blob
			const response = await fetch(base64);
			const blob = await response.blob();

			const formData = new FormData();
			formData.append('file', blob, file.name);

			const result = await fetch(url, {
				method: 'POST',
				body: formData,
				headers: {
					Authorization: `Bearer ${usertoken}`,
				},
			});

			if (!result.ok) {
				return [false, `Failed to upload: ${result.statusText}`];
			}

			return [true, 'We made the changes accordingly'];
		} catch (error) {}
	};

	const handleGlobalChatMessages = async (payload, sessionId, localPayload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/${sessionId}/multi_agent_chat`;

			let updatedGlobalChatMessages = [];
			if (payload.files) {
				let str = '  ';
				for (let i = 0; i < localPayload?.files?.length; i++) {
					str += localPayload?.files?.[i]?.name || '' + ' ,';
				}

				updatedGlobalChatMessages = [
					{
						type: 'user',
						content: (
							<div
								className="uploadedImagesContainer"
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '2px',
									alignItems: 'flex-end',
								}}
							>
								{localPayload?.files?.map((ele, index) => (
									<img
										src={ele.preview}
										alt="filetochat"
										width={'50px'}
										onClick={() => localPayload?.handlePreview(ele)}
										style={{ cursor: 'pointer' }}
									/>
								))}

								<div className="message-content-user" style={{ marginTop: '8px' }}>
									<span>{payload?.query}</span>
								</div>
							</div>
						),
					},
					{
						type: 'AI',
						message: 'loading....',
						content: (
							<div className="aiMessageWrapper">
								<AiSparkel />
								<div className="aiMessage">
									<span>Thinking...</span>
								</div>
							</div>
						),
						contentType: 'loading',
					},
				];

				payload.query += str;
			} else {
				updatedGlobalChatMessages = [
					{ type: 'user', message: payload?.query || '' },
					{
						type: 'AI',
						message: 'loading....',
						content: (
							<div className="aiMessageWrapper">
								<AiSparkel />
								<div className="aiMessage">
									<span>Thinking...</span>
								</div>
							</div>
						),
						contentType: 'loading',
					},
				];
			}

			dispatch({
				type: Actions.GLOBAL_CHAT_MESSAGES_ACTIONS_REQUESTS,
				payload: updatedGlobalChatMessages,
			});
			const response = await Service.fetchPost(url, payload, usertoken, 'ai_predictions');
			if (response?.[0]) {
				const updatedGlobalChatMessages = {
					type: 'AI',
					message: response?.[1]?.answer,
				};
				dispatch({
					type: Actions.GLOBAL_CHAT_MESSAGES_ACTIONS_SUCCESS,
					payload: updatedGlobalChatMessages,
				});
				return [true, response?.[1]];
			}
		} catch (error) {
			console.log('errror ==>handleGlobalChatMessages', error);
		}
	};

	const handleGlobalUploadImage = async (file, payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');

			const response = await Service.fetchPost(
				`/${workspaceId}/knowledge-bases/upload-file`,
				payload,
				usertoken,
				'ai_assistant_api',
			);

			if (response?.[0]) {
				const base64 = await getBase64(file);

				const newResponse = await fetch(base64);
				const blob = await newResponse.blob();

				const { signedUrl } = response?.[1];

				const uploadResponse = await fetch(signedUrl, {
					method: 'PUT',
					body: blob,
					headers: {
						'Content-Type': file.type, // Set the content type based on the file type
					},
				});

				if (!uploadResponse.ok) {
					return [false, 'Failed to upload image'];
				}

				return [true];
			}

			return [true];
		} catch (error) {
			console.log('error==>handleGlobalUploadImage', error);
			return [false, 'Failed to upload image'];
		}
	};

	const deleteUploadedImageThroughChat = async () => {
		try {
		} catch (error) {}
	};

	const checkIndividualImageUploadedStatus = async (uploadBatchId) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/knowledge-bases/file-upload-status/${uploadBatchId}`;
			const response = await Service.fetchGet(url, usertoken, 'ai_assistant_api');
			return response;
		} catch (error) {
			message.error('Error checking image upload status');
			return [false, 'Error checking image upload status'];
		}
	};

	//docs

	const getDocsFilesList = async (payload, fetchMore = false) => {
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
				const selectedvariable = fetchMore ? 'moreDocsFilesList' : 'docsFilesList';
				dispatch({
					type: Actions?.GET_DOCS_FILES_LIST_SUCCESS,
					payload: response?.[1]?.data?.workflows,
					selectedvariable,
				});
			} else {
				console.log('Api failed==>getDocsFilesList', response);
			}
		} catch (error) {
			console.log('error==>getDocsFilesList', error);
		}
	};
	return {
		...state,
		getMyWorkflows,
		resetTemplateState,
		getClientList,
		getClientListForDocs,
		getTemplatesListForDocs,
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
		getWorkflowsListForFiles,
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
		getTabItemCount,
		getRequiredActions,
		updateSendSmartFileSettings,
		getEventsPresets,
		addEventsPresets,
		editEventsPresets,
		deleteEventsPreset,
		getLatestSendSmartFileSettings,
		getAiPredictionForSmartFile,
		leaveWorkspace,
		sendCustomEmailToClients,
		connectThirdParty,
		getActivityLogs,
		getDrafStateWorkflowtemplates,
		toggleCreateLeadModal,
		smartFileAiChat,
		uploadImageInSmartFileAi,
		handleGlobalChatMessages,
		getDocsFilesList,
		handleGlobalUploadImage,
		checkIndividualImageUploadedStatus,
		deleteUploadedImageThroughChat,
	};
};
