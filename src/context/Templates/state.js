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
	getTabItemCountQuery,
	getRequiredActionDetailsQuery,
	updateSendSmartFileSettingsMutation,
	getLatestSendSmartFileSettingsQuery,
	getActivityLogsQuery,
	addNewStepsQuery,
	updateStepsQuery,
	getFormResponsesListQuery,
	createBlankWorkflowQuery,
	createBlankTemplateQuery,
	getFormResponseQuery,
} from './graphQlFunctions';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './Actions';
import Service from '../../services/index';
import { sendCustomMailMutation } from '../subscription/graphqlFunctions';
import { getBase64 } from '../../helpers';
import Skeleton from 'react-loading-skeleton';
import AIMessageLoader from '../../views/components/chat/AIMessageLoader';

export const intialState = {
	workflowslist: null,
	moreWorkList: null,
	clientList: null,
	clientListForDocs: null,
	templatesListForDocs: null,
	allEmailTemplates: null,
	myWorkflows: null,
	myWorkflowsForProposalPopup: null,
	workflowslistForFiles: null,
	myMoreWorkflows: null,
	myMoreWorkflowsForProposalPopup: null,
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
	requiredActionsForTemplate: null,
	tabItemCount: null,
	eventsPresetData: null,
	sendSmartFileSettings: null,
	aiPredictedData: null,
	connectUrl: null,
	connectThirdParties: null,
	activityLogs: null,
	moreActivityLogs: null,
	draftStateWorkflowtemplates: null,
	moreDraftStateWorkflowtemplates: null,
	createLeadModalContextState: false,
	globalChatMessages: [], // { type: 'AI', message: 'Hello, how can I help you today?' }
	currentSessionId: null,
	citations: null,
	followUpQuery: null,
	docsFilesList: null,
	moreDocsFilesList: null,
	smartFileRefetch: false,
	activeWorkflowSlugForSmartFile: null,
	slackChannels: null,
	formsTemplatesList: null,
	moreFormsTemplatesList: null,
	formResponsesList: null,
	moreFormResponsesList: null,
	activePromptForChat: null,
	leftSidebarState: null,
	recentChatStorage: null,
	moreRecentChatStorage: null,
	activePayloadForChat: null,
	llmModels: null,
	chatInfo: {
		deepResearch: false,
		selectedLLMModel: null,
		webSearch: true,
		workspaceSearch: false,
		agentType: null,
		assistantId: null,
	},
	galleryFile: null,
	globalLoadingMesssage: null,
	userEditedQuery: null,
	aiSuggestedPendingActions: null,
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

	const getMyWorkflowsForProposalPopup = async (payload, fetchMore = false) => {
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
			const selectedvariable = fetchMore
				? 'myMoreWorkflowsForProposalPopup'
				: 'myWorkflowsForProposalPopup';
			dispatch({
				type: Actions.GET_MY_WORKFLOWS_TEMPLATES_FOR_PROPOSAL_POPUP_INFO_SUCCESS,
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
	const getWorkflowsListForFiles = async (payload, fetchMore = false) => {
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
				const templateId = payload?.filters?.templateId;
				const { data, currentPage, hasNextPage } = response?.[1]?.data?.workflows;
				let dispatchPayload;
				if (!state?.workflowslistForFiles?.[templateId]) {
					dispatchPayload = {
						...state?.workflowslistForFiles,
						[templateId]: {
							data,
							currentPage,
							hasNextPage,
						},
					};
				} else {
					dispatchPayload = {
						...state?.workflowslistForFiles,
						[templateId]: {
							data: [
								...(state?.workflowslistForFiles?.[templateId]?.data || []),
								...data,
							],
							currentPage,
							hasNextPage,
						},
					};
				}

				dispatch({
					type: Actions?.GET_WORKFLOW_DETAILS_FOR_FILES_SUCCESS,
					payload: dispatchPayload,
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

	const getTemplatesListForDocs = async (page = 1, limit = 10, searchValue = '') => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');

		const payload = {
			filters: {
				limit,
				page,
				type: 'workspace',
				status: 'published',
				title: searchValue,
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
	const getTemplatesListForForms = async (page = 1, limit = 10, fetchMore = false) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');

		const payload = {
			filters: {
				limit,
				page,
				type: 'workspace',
				status: 'published',
				sortBy: 'createdAt',
				sortType: -1,
				action: 'form-submission',
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
			const selectedvariable = fetchMore ? 'moreFormsTemplatesList' : 'formsTemplatesList';
			dispatch({
				type: Actions.GET_TEMPLATES_LIST_FOR_FORMS_SUCCESS,
				payload: response?.[1]?.data?.templates,
				selectedvariable,
			});
		} else {
			console.log('api failed ==>getTemplatesListForForms', response);
		}
	};

	const getFormResponsesList = async (formId, page = 1, limit = 10, fetchMore = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');

			const payload = {
				filters: {
					workflowTemplateId: formId,
					page,
					limit,
				},
			};
			const response = await service.query(
				getFormResponsesListQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				const selectedvariable = fetchMore ? 'moreFormResponsesList' : 'formResponsesList';
				dispatch({
					type: Actions.GET_FORM_RESPONSES_LIST_SUCCESS,
					payload: response?.[1]?.data?.formResponsesList,
					selectedvariable,
				});
			} else {
				console.log('api failed ==>getFormResponsesList', response);
			}
		} catch (error) {
			console.log('api failed ==>getFormResponsesList', error);
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
				return [true, response?.[1]?.data?.createWorkflowFromTemplate];
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
						...state?.requiredActions,
						hasNextPage: response?.[1]?.data?.listRequiredActions?.hasNextPage,
						actions: resetRequiredActions
							? response?.[1]?.data?.listRequiredActions?.data
							: state?.requiredActions?.actions?.concat(
									response?.[1]?.data?.listRequiredActions?.data,
							  ),
					},
				});
			} else {
				return [false];
			}
		} catch (error) {
			console.log('api failed ==>getRequiredActionDetails', error);
		}
	};

	const getRequiredActionsForTemplate = async (payload) => {
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
			const workflowTemplateId = queryPayload?.filters?.workflowTemplateId;
			if (response?.[0]) {
				const data = response?.[1]?.data?.listRequiredActions?.data;
				dispatch({
					type: Actions.GET_REQUIRED_ACTIONS_FOR_TEMPLATE_SUCCESS,
					payload: {
						...state?.requiredActionsForTemplate,
						[workflowTemplateId]: {
							...response?.[1]?.data?.listRequiredActions,
							data: state?.requiredActionsForTemplate?.[workflowTemplateId]
								? [
										...(Array?.isArray(
											state?.requiredActionsForTemplate?.[workflowTemplateId]
												?.data,
										)
											? state.requiredActionsForTemplate[workflowTemplateId]
													?.data
											: []),
										...data,
								  ]
								: data,
						},
					},
				});
			} else {
				return [false];
			}
		} catch (error) {
			console.log('api failed ==>getRequiredActionDetailsForTemplate', error);
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

	const connectThirdParty = async (connectType, integrationType) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const path = `/${connectType}/${workspaceId}/auth`;
			const params = integrationType ? { access: integrationType } : {};
			const type = 'third_party_integrations_api';

			const response = await Service?.fetchGet(path, usertoken, type, params);

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

	const getConnectedThirdParties = async (integrationType) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = `/connect-account/${workspaceId}`;
			const usertoken = localStorage.getItem('usertoken');
			const type = 'third_party_integrations_api';
			const params = integrationType ? { access: integrationType } : {};
			const response = await Service?.fetchGet(path, usertoken, type, params);

			if (response?.[0] === true) {
				dispatch({
					type: Actions?.SET_CONNECTED_THIRDPARTIES,
					payload: response?.[1],
				});
				return response;
			} else {
				console.log('api failed==>getConnectedThirdParties', response);
			}
		} catch (error) {
			console.log('error==>getConnectedThirdParties', error);
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
	const getCitationData = async (sessionId, sourceId) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			const url = `/${workspaceId}/${sessionId}/${sourceId}/get_chunk`;

			const usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchGet(url, usertoken, 'ai_predictions');
			if (response?.[0]) {
				return response?.[1]?.chunk;
			}
		} catch (error) {
			console.log('errror ==>getCitationData', error);
		}
	};

	const handleGlobalChatMessages = async (
		payload,
		sessionId,
		localPayload,
		recentFiles = null,
	) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/${sessionId}/multi_agent_chat`;

			let updatedGlobalChatMessages = [];

			if (localPayload.showCustomChatOptions) {
				updatedGlobalChatMessages = [...(localPayload.showCustomChatOptions || [])];
			} else if (payload.files) {
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
										width={'75px'}
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
								<Skeleton height={20} width={'100%'} borderRadius={'100px'} />
								<Skeleton height={20} width={'75%'} borderRadius={'100px'} />
								<Skeleton height={20} width={'50%'} borderRadius={'100px'} />
							</div>
						),
						contentType: 'loading',
					},
				];

				payload.query += str;
			} else {
				updatedGlobalChatMessages = [
					{ type: 'user', message: payload?.query || '', typingEffect: false },
					{
						type: 'AI',
						message: 'loading....',
						content: (
							<div className="aiMessageWrapper">
								<Skeleton height={20} width={'100%'} borderRadius={'100px'} />
								<Skeleton height={20} width={'75%'} borderRadius={'100px'} />
								<Skeleton height={20} width={'50%'} borderRadius={'100px'} />
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

			if (payload.files && recentFiles?.length) {
				payload.files = payload?.files?.concat(
					recentFiles?.map((ele) => ele?.originalFileName),
				);
			} else if (recentFiles?.length) {
				payload.files = recentFiles?.map((ele) => ele?.originalFileName);
			}

			const response = await Service.fetchPost(url, payload, usertoken, 'ai_predictions');
			if (response?.[0]) {
				const citations = response?.[1]?.citations;
				const followUpQuery = response?.[1]?.['follow_up_query'];
				const messageId = response?.[1]?.['message_id'];
				if (citations && citations?.length > 0) {
					dispatch({
						type: Actions?.CHAT_CITATIONS_SUCCESS,
						payload: citations,
					});
				} else {
					dispatch({
						type: Actions?.CHAT_CITATIONS_SUCCESS,
						payload: null,
					});
				}
				if (followUpQuery?.length) {
					dispatch({
						type: Actions?.CHAT_FOLLOW_UP_QUERY,
						payload: followUpQuery,
					});
				} else {
					dispatch({
						type: Actions?.CHAT_FOLLOW_UP_QUERY,
						payload: null,
					});
				}
				const updatedGlobalChatMessages = {
					type: 'AI',
					message: response?.[1]?.answer,
					messageId: response?.[1]?.['message_id'],
					typingEffect: true,
					rating: null,
					deepResearch: response?.[1]?.['deep_research'],
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

	const handleStreamSendMessage = (payload, localPayload, queryMessage, recentFiles = []) => {
		let updatedGlobalChatMessages = [];

		if (localPayload.showCustomChatOptions) {
			updatedGlobalChatMessages = [...(localPayload.showCustomChatOptions || [])];
		}
		//  else if (payload.files) {
		// 	let str = '  ';
		// 	for (let i = 0; i < localPayload?.files?.length; i++) {
		// 		str += localPayload?.files?.[i]?.name || '' + ' ,';
		// 	}

		// 	updatedGlobalChatMessages = [
		// 		{
		// 			type: 'user',
		// 			content: (
		// 				<div
		// 					className="uploadedImagesContainer"
		// 					style={{
		// 						display: 'flex',
		// 						flexDirection: 'column',
		// 						gap: '2px',
		// 						alignItems: 'flex-end',
		// 					}}
		// 				>
		// 					{localPayload?.files?.map((ele, index) => (
		// 						<img
		// 							src={ele.preview}
		// 							alt="filetochat"
		// 							width={'75px'}
		// 							onClick={() => localPayload?.handlePreview(ele)}
		// 							style={{ cursor: 'pointer' }}
		// 						/>
		// 					))}

		// 					<div className="message-content-user" style={{ marginTop: '8px' }}>
		// 						<span>{queryMessage}</span>
		// 					</div>
		// 				</div>
		// 			),
		// 		},
		// 		{
		// 			type: 'AI',
		// 			message: 'loading....',
		// 			content: (
		// 				<div className="aiMessageWrapper">
		// 					<AIMessageLoader />
		// 				</div>
		// 			),
		// 			contentType: 'loading',
		// 		},
		// 	];

		// 	payload.query += str;
		// }
		else {
			updatedGlobalChatMessages = [
				{ type: 'user', message: queryMessage || '', typingEffect: false },
				{
					type: 'AI',
					message: 'loading....',
					content: (
						<div className="aiMessageWrapper">
							<AIMessageLoader />
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
	};
	const handleStreamIncomingMessage = (response) => {
		const citations = response?.citations;
		const followUpQuery = response?.['follow_up_query'];
		// const messageId = response?.['message_id'];
		// if (citations && citations?.length > 0) {
		// 	dispatch({
		// 		type: Actions?.CHAT_CITATIONS_SUCCESS,
		// 		payload: citations,
		// 	});
		// } else {
		// 	dispatch({
		// 		type: Actions?.CHAT_CITATIONS_SUCCESS,
		// 		payload: null,
		// 	});
		// }
		if (followUpQuery?.length) {
			dispatch({
				type: Actions?.CHAT_FOLLOW_UP_QUERY,
				payload: followUpQuery,
			});
		} else {
			dispatch({
				type: Actions?.CHAT_FOLLOW_UP_QUERY,
				payload: null,
			});
		}
	};

	const handleStreamMessageChunk = (payload, chunkId) => {
		try {
			dispatch({ type: Actions.HANDLE_STREAM_MESSAGE_CHUNK, payload: { payload, chunkId } });
		} catch (error) {
			console.log('error==>handleStreamMessageChunk', error);
		}
	};

	const updateAiChatMessageRating = async (payload, messageId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const url = '/' + workspaceId + '/ai-chat/' + messageId + '/ai-chat-message-feedback';
		try {
			const response = await Service?.fetchPut(url, payload, usertoken, 'ai_assistant_api');
			if (response?.[0]) {
				return [true];
			}
		} catch (error) {
			console.log('error==>updatedAiChatMessageRating', error);
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

				return [true, response?.[1]];
			}

			return [false, 'Failed to upload image'];
		} catch (error) {
			console.log('error==>handleGlobalUploadImage', error);
			return [false, 'Failed to upload image'];
		}
	};

	const deleteUploadedImageThroughChat = async (fileId) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchDelete(
				`/${workspaceId}/ai-chat/delete-file/${fileId}`,
				usertoken,
				null,
				'ai_assistant_api',
			);
			if (response?.[0]) {
				return [true];
			} else {
				return [false];
			}
		} catch (error) {
			console.log('error==>deleteUploadedImageThroughChat', error);
			return [false];
		}
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

	const updateApplicationChat = (payload) => {
		dispatch({ type: Actions.UPDATE_APPLICATION_CHAT, payload });
	};
	//updated steps functions
	const addNewSteps = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				addNewStepsQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				const dataResponse = response?.[1];
				return [true, dataResponse?.data?.addStep];
			} else {
				console.log('Api failed ==>addNewSteps', response);
				return [false];
			}
		} catch (error) {
			console.log('error==>addNewSteps', error);
		}
	};

	const updateSteps = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				updateStepsQuery,
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
			console.log('error==>updateSteps', error);
		}
	};
	//slack Apis
	const getAllSlackChannels = async (slackAccessToken) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchGet(
				`/slack/${workspaceId}/channels`,
				usertoken,
				'third_party_integrations_api',
				{
					exclude_archived: true,
					limit: 1000,
				},
			);

			if (response?.[0]) {
				dispatch({
					type: Actions.GET_SLACK_CHANNEL_SUCCESS,
					payload: response?.[1],
				});
			} else {
				message.error('Unable to fetch Slack Channels');
			}
		} catch (error) {
			console.log('error==>getAllSlackChannels', error);
		}
	};

	const getModuleTemplate = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchPost(
				`/${workspaceId}/templates/templates-list`,
				payload,
				usertoken,
				'proposals_api',
			);
			if (response?.[0] === true) {
				dispatch({ type: Actions.GET_MODULE_TEMPLATE_SUCCESS, payload: response?.[1] });
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]?.message];
			}
		} catch (error) {
			console.log('errror ==>getModuleTemplate', error);
			return [false, error?.message];
		}
	};

	const getRecentChatMessages = async (sessionId, page = 1, fetchMore = false, limit = 1000) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const selectedvariable = fetchMore ? 'moreRecentChatStorage' : 'recentChatStorage';
			const response = await Service.fetchGet(
				`/${workspaceId}/list-multiagent-conversations/${encodeURIComponent(
					sessionId,
				)}?page=${page}&limit=${limit}&sortBy=createdAt&sortType=-1`,
				usertoken,
				'tenant',
			);

			if (response?.[0]) {
				dispatch({
					type: Actions.RECENT_CHAT_MESSAGES_ACTIONS_REQUESTS,
					payload: response?.[1],
					selectedvariable,
				});
			} else {
				console.log('errror ==>getRecentChatMessages', response);
				return [false];
			}
		} catch (error) {
			console.log('errror ==>getRecentChatMessages', error);
		}
	};
	const createBlankWorkflow = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				createBlankWorkflowQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return response;
			} else {
				return response;
			}
		} catch (error) {
			console.log('error==>createBlankWorkflow', error);
		}
	};

	const createBlankTemplate = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				createBlankTemplateQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return response;
			} else {
				return response;
			}
		} catch (error) {
			console.log('error==>createBlankTemplate', error);
		}
	};

	const getLLMModels = async () => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const path = '/available_models';
			const type = 'ai_predictions';
			const response = await Service?.fetchGet(path, usertoken, type);

			if (response?.[0]) {
				dispatch({
					type: Actions?.GET_LLM_MODELS_SUCCESS,
					payload: response?.[1],
				});
			} else {
				console.log('errror ==>getLLMModels', response);
				return [false];
			}
		} catch (error) {
			console.log('errror ==>getLLMModels', error);
		}
	};

	const getFormResponse = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getFormResponseQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				return response?.[1]?.data?.formResponse;
			} else {
				console.log('error ==> getFormResponse', response);
				return null;
			}
		} catch (error) {
			console.log('error ==> getFormResponse', error);
		}
	};

	const getAISuggestedPendingActions = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchGet(
				`/${workspaceId}/knowledge-bases/pending-actions`,
				usertoken,
				'tenant',
				payload,
			);
			if (response?.[0]) {
				dispatch({
					type: Actions?.GET_AI_SUGGESTED_PENDING_ACTIONS_SUCCESS,
					payload: response?.[1],
				});
			} else {
				console.log('response==>getAISuggestedPendingActions', response);
			}
		} catch (error) {
			console.log('error==>getAISuggestedPendingActions', error);
		}
	};

	return {
		...state,
		getMyWorkflows,
		getMyWorkflowsForProposalPopup,
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
		getRequiredActionsForTemplate,
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
		updateApplicationChat,
		addNewSteps,
		getAllSlackChannels,
		updateSteps,
		getTemplatesListForForms,
		getFormResponsesList,
		updateAiChatMessageRating,
		getModuleTemplate,
		getCitationData,
		getRecentChatMessages,
		handleStreamSendMessage,
		handleStreamIncomingMessage,
		handleStreamMessageChunk,
		getLLMModels,
		createBlankWorkflow,
		createBlankTemplate,
		getConnectedThirdParties,
		getFormResponse,
		getAISuggestedPendingActions,
	};
};
