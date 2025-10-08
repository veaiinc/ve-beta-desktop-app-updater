import service from '../../services/graphQlServices';
import { message } from '../../views/components/globalComponents/CustomToast';
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
	getFormResponseAnalyticsQuery,
	updateWorkflowTemplateQuery,
	duplicateSmartFileQuery,
	isSlugAvailableQuery,
	updateSlugMutation,
	deleteFormResponseMutation,
	updateFormResponseMutation,
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
	connectedThirdParties: null,
	activityLogs: null,
	moreActivityLogs: null,
	draftStateWorkflowtemplates: null,
	moreDraftStateWorkflowtemplates: null,
	createLeadModalContextState: false,
	globalChatMessages: {}, // { type: 'AI', message: 'Hello, how can I help you today?' }
	currentSessionId: null,
	citations: null,
	notificationsList: null,
	docsFilesList: null,
	moreDocsFilesList: null,
	docsFilesRefetch: false,
	smartFileRefetch: false,
	activeWorkflowSlugForSmartFile: null,
	slackChannels: null,
	formsTemplatesList: null,
	moreFormsTemplatesList: null,
	formResponsesList: null,
	moreFormResponsesList: null,
	activePromptForChat: null,
	activePayloadForChat: null,
	activeInputForChat: null,
	leftSidebarState: null,
	recentChatStorage: null,
	moreRecentChatStorage: null,
	llmModels: null,
	aiTranscriptionSuggestions: null,
	chatSources: null,
	chatLoadingSessions: {},
	chatReplyData: null,
	currentChatData: null,
	galleryFile: null,
	userEditedQuery: null,
	aiSuggestedPendingActions: null,
	documentPreviewIds: {
		workflowTemplateId: null,
		moduleTemplateId: null,
	},
	isBrowserScreenActive: false,
	refetchChatHistoryList: false,
	aiQuestions: null,
	proactiveAiData: null,
	chatBoxSuggestions: null,
	newChatSessionIds: [],
	aiMessagesInfo: null,
	proactiveInfoForChat: null,
	isDirectSearchAgent: false,
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

	const resetTemplateState = () => {
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
	const getTemplatesListForForms = async (
		page = 1,
		limit = 10,
		fetchMore = false,
		options = { sortBy: 'createdAt', sortType: -1 },
		filterTitle = '',
	) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');
		const { sortBy, sortType } = options;

		const payload = {
			filters: {
				limit,
				page,
				type: 'workspace',
				// status: 'published',
				sortBy,
				sortType,
				action: 'form-submission',
				title: filterTitle,
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
	const sendContactFormData = async (formData) => {
		const {
			email,
			firstName,
			lastName,
			companyName,
			jobTitle,
			platformUsers,
			headquarters,
			message: inputMessage,
			marketingConsent,
			type,
			phone,
		} = formData;

		try {
			const body = {
				responseInput: {
					response: [
						{
							_id: '68540d18275e840b828a0a36',
							type: 'email',
							question: '<p style="font-size:;">Work email</p>',
							required: true,
							order: 0,
							isEditing: false,
							placeholder: 'Enter your name',
							answer: email,
							variableId: '619f75683f381fd66dac4b65',
							validation: { pattern: {}, operators: [] },
							conditions: [],
							actions: [],
						},
						{
							_id: '68540d18275e840b828a0a37',
							type: 'shortanswer',
							question: '<p style="font-size:;">First name?</p>',
							required: true,
							order: 1,
							isEditing: false,
							placeholder: 'Enter your first name',
							answer: firstName,
							variableId: '6311efc4911e0f82be7e2b2d',
							validation: { pattern: {}, operators: [] },
							conditions: [],
							actions: [],
						},
						{
							_id: '68540d4cd698c8078e1078fc',
							type: 'shortanswer',
							question: '<br style="font-size:;"><p>Last name</p>',
							required: true,
							order: 2,
							isEditing: false,
							placeholder: 'Enter your last name',
							answer: lastName,
							variableId: '619f75683f381fd66dac4b65',
							validation: { pattern: {}, operators: [] },
							conditions: [],
							actions: [],
						},
						{
							_id: '67fcfbbcbfcf70d43e4f3588',
							type: 'shortanswer',
							question: 'Company Name',
							required: true,
							order: 4,
							isEditing: false,
							placeholder: 'Enter your company name',
							answer: companyName,
							validation: {
								pattern: {},
								operators: [],
							},
							conditions: [],
							actions: [],
						},
						{
							_id: '67fcfbbcbfcf70d43e4f3589',
							type: 'shortanswer',
							question: 'Job Title',
							required: true,
							order: 5,
							isEditing: false,
							placeholder: 'Enter your job title',
							answer: jobTitle,
							validation: {
								pattern: {},
								operators: [],
							},
							conditions: [],
							actions: [],
						},
						{
							_id: '67fcfbbcbfcf70d43e4f358a',
							type: 'shortanswer',
							question: 'Platform Users',
							required: true,
							order: 6,
							isEditing: false,
							placeholder: 'Enter your platform users',
							answer: platformUsers,
							validation: {
								pattern: {},
								operators: [],
							},
							conditions: [],
							actions: [],
						},
						{
							_id: '67fcfbbcbfcf70d43e4f358b',
							type: 'shortanswer',
							question: 'Company Headquarters',
							required: true,
							order: 7,
							isEditing: false,
							placeholder: 'Enter your company headquarters',
							answer: headquarters,
							validation: {
								pattern: {},
								operators: [],
							},
							conditions: [],
							actions: [],
						},
						{
							_id: '67fcfbbcbfcf70d43e4f358c',
							type: 'longanswer',
							question: 'Tell us more about how you want to use VE.AI',
							required: true,
							order: 8,
							isEditing: false,
							placeholder: 'Enter your long answer text',
							answer: inputMessage,
							validation: {
								pattern: {},
								operators: [],
							},
							conditions: [],
							actions: [],
						},
						{
							_id: '68540d18275e840b828a0a38',
							type: 'phone',
							question: 'What is your phone number?',
							required: false,
							order: 9,
							isEditing: false,
							placeholder: 'Enter your phone number',
							answer: phone,
							variableId: '6311ee8f8e7c108259cf96e6',
							validation: { pattern: {}, operators: [] },
							conditions: [],
							actions: [],
						},
					],
				},
			};

			const token = localStorage.getItem('usertoken');

			const url =
				'/veai/68540d0db5dbb87f8fb78c70/68540d0db5dbb87f8fb78c71/68540d17c07d261ea9125e3a';

			const response = await Service.fetchPost(url, body, token, 'workflow');

			return response;
		} catch (error) {
			console.log(error);
			return error;
		}
	};
	// const getFormResponseSummary = async (formId) => {
	// 	try {
	// 		let workspaceId = localStorage.getItem('workspaceId');
	// 		let usertoken = localStorage.getItem('usertoken');
	// 		const response = await service.query(
	// 			getFormResponseSummaryQuery,
	// 			{ workflowTemplateId: formId },
	// 			workspaceId,
	// 			usertoken,
	// 			'workflows_Api',
	// 		);
	// 	} catch (error) {
	// 		console.log('api failed ==>getFormResponseSummary', error);
	// 	}
	// };
	const getFormResponseAnalytics = async (formId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getFormResponseAnalyticsQuery,
				{ filter: { workflowTemplateId: formId } },
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				dispatch({
					type: Actions.GET_FORM_RESPONSE_ANALYTICS_SUCCESS,
					payload: response?.[1]?.data?.formResponseAnalytics,
				});
				return [true, response?.[1]?.data?.formResponseAnalytics];
			} else {
				console.log('api failed ==>getFormResponseAnalytics', response);
				return [false];
			}
		} catch (error) {
			console.log('api failed ==>getFormResponseAnalytics', error);
			return [false];
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
				return response;
			}
		} catch (error) {
			console.log('errror ==>sendCustomEmailToClients', error);
		}
	};
	const getAuthUrlForThirdParty = async (connectType, access) => {
		try {
			const token = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			let path, response, apiType;

			let origin = window.location.origin;
			if (origin.includes('localhost')) {
				origin = 'https://www.ve.ai';
			}

			let currentURl = origin + window.location.pathname;

			const authConfig = {
				gmail: {
					path: `/auth/gmail/${workspaceId}?access=${access}&redirectURL=${currentURl}`,
					apiType: 'calendar_api',
				},
				'google-calendar': {
					path: `/google-calendar/${workspaceId}/auth?access=${access}&redirectURL=${currentURl}`,
					apiType: 'calendar_api',
				},
				slack: {
					path: `/slack/${workspaceId}/auth?access=${access}&redirectURL=${currentURl}`,
					apiType: 'third_party_integrations_api',
				},
				'outlook-calendar': {
					path: `/outlookcalendar/${workspaceId}/auth?access=${access}&redirectURL=${currentURl}`,
					apiType: 'microsoft_integration_api',
				},
				'outlook-mail': {
					path: `/outlookmail/${workspaceId}/auth?access=${access}&redirectURL=${currentURl}`,
					apiType: 'microsoft_integration_api',
				},
				outlookcalendar: {
					path: `/outlookcalendar/${workspaceId}/auth?access=${access}&redirectURL=${currentURl}`,
					apiType: 'microsoft_integration_api',
				},
				outlookmail: {
					path: `/outlookmail/${workspaceId}/auth?access=${access}&redirectURL=${currentURl}`,
					apiType: 'microsoft_integration_api',
				},
			};

			const config = authConfig[connectType] || {
				path: `/${connectType}/${workspaceId}/auth?access=${access}&redirectURL=${currentURl}`,
				apiType: 'third_party_integrations_api',
			};

			path = config.path;
			apiType = config.apiType;
			response = await Service?.fetchGet(path, token, apiType);

			if (response?.[0] === true) {
				return response?.[1]?.connectUrl || response?.[1]?.url;
			} else {
				throw new Error(response?.[1]?.message || 'Failed to get authorization URL');
			}
		} catch (error) {
			console.error('Error getting auth URL:', error);
			throw error;
		}
	};
	const disconnectThirdParty = async (connectType, id) => {
		try {
			const token = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			let path, response, apiType;

			const disconnectConfig = {
				gmail: {
					path: `/auth/gmail/${workspaceId}/${id}/deactivate-integration`,
					apiType: 'calendar_api',
				},
				'google-calendar': {
					path: `/google-calendar/${workspaceId}/${id}/deactivate-integration`,
					apiType: 'calendar_api',
				},
				slack: {
					path: `/slack/${workspaceId}/${id}/deactivate-integration`,
					apiType: 'third_party_integrations_api',
				},
				outlookCalendar: {
					path: `/outlookcalendar/${workspaceId}/${id}/deactivate-integration`,
					apiType: 'microsoft_integration_api',
				},
				outlookMail: {
					path: `/outlookmail/${workspaceId}/${id}/deactivate-integration`,
					apiType: 'microsoft_integration_api',
				},
			};

			const config = disconnectConfig[connectType] || {
				path: `/${connectType}/${workspaceId}/${id}/deactivate-integration`,
				apiType: 'third_party_integrations_api',
			};

			path = config.path;
			apiType = config.apiType;
			response = await Service?.fetchPut(path, null, token, apiType);

			if (response?.[0]) {
				return response;
			} else {
				return response;
			}
		} catch (error) {
			console.log('error==>disconnectThirdParty', error);
		}
	};
	const syncUserAccount = async (connectType, id, dateRange = null) => {
		try {
			const token = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			let path, response, apiType;
			if (dateRange) {
				const connectUserAccountConfig = {
					gmail: {
						path: `/auth/gmail/${workspaceId}/${id}/sync-data?startDate=${dateRange?.startDate}&endDate=${dateRange?.endDate}`,
						apiType: 'calendar_api',
					},
					'google-calendar': {
						path: `/google-calendar/${workspaceId}/${id}/sync-data?startDate=${dateRange?.startDate}&endDate=${dateRange?.endDate}`,
						apiType: 'calendar_api',
					},
					slack: {
						path: `/slack/${workspaceId}/${id}/sync-data?startDate=${dateRange?.startDate}&endDate=${dateRange?.endDate}`,
						apiType: 'third_party_integrations_api',
					},
					'outlook-calendar': {
						path: `/outlookcalendar/${workspaceId}/${id}/sync-data?startDate=${dateRange?.startDate}&endDate=${dateRange?.endDate}`,
						apiType: 'microsoft_integration_api',
					},
					outlookMail: {
						path: `/outlookmail/${workspaceId}/${id}/sync-data?startDate=${dateRange?.startDate}&endDate=${dateRange?.endDate}`,
						apiType: 'microsoft_integration_api',
					},
				};

				let config = connectUserAccountConfig[connectType] || {
					path: `/${connectType}/${workspaceId}/${id}/sync-data?startDate=${dateRange?.startDate}&endDate=${dateRange?.endDate}`,
					apiType: 'third_party_integrations_api',
				};
				path = config.path;
				apiType = config.apiType;
				response = await Service?.fetchPost(path, null, token, apiType);

				if (response?.[0]) {
					return response;
				} else {
					return response;
				}
			} else {
				const connectUserAccountConfig = {
					gmail: {
						path: `/auth/gmail/${workspaceId}/${id}/sync-data`,
						apiType: 'calendar_api',
					},
					'google-calendar': {
						path: `/google-calendar/${workspaceId}/${id}/sync-data`,
						apiType: 'calendar_api',
					},
					slack: {
						path: `/slack/${workspaceId}/${id}/sync-data`,
						apiType: 'third_party_integrations_api',
					},
					'outlook-calendar': {
						path: `/outlookcalendar/${workspaceId}/${id}/sync-data`,
						apiType: 'microsoft_integration_api',
					},
					outlookMail: {
						path: `/outlookmail/${workspaceId}/${id}/sync-data`,
						apiType: 'microsoft_integration_api',
					},
				};

				let config = connectUserAccountConfig[connectType] || {
					path: `/${connectType}/${workspaceId}/${id}/sync-data`,
					apiType: 'third_party_integrations_api',
				};
				path = config.path;
				apiType = config.apiType;
				response = await Service?.fetchPost(path, null, token, apiType);

				if (response?.[0]) {
					return response;
				} else {
					return response;
				}
			}
		} catch (error) {
			console.log('error==>syncUserAccount', error);
		}
	};

	const connectThirdParty = async (connectType) => {
		try {
			const token = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const type = 'calendar_api';
			let path, response, success;

			switch (connectType) {
				case 'gmail':
					path = `/auth/gmail/${workspaceId}`;
					response = await Service?.fetchGet(path, token, type);
					success = response?.[0] === true;
					if (success) {
						const connectUrl = response?.[1]?.connectUrl;
						window.location.href = connectUrl;
					} else {
						return [false];
					}
				case 'google-calendar':
					path = `/google-calendar/${workspaceId}/auth`;
					response = await Service.fetchGet(path, token, type);
					success = response?.[0] === true;
					if (success) {
						const connectUrl = response?.[1]?.connectUrl;
						window.location.href = connectUrl;
					}
					break;
				case 'slack':
					path = `/slack/${workspaceId}/auth`;
					response = await Service.fetchGet(path, token, 'third_party_integrations_api');
					success = response?.[0] === true;
					if (success) {
						const connectUrl = response?.[1]?.connectUrl;
						window.location.href = connectUrl;
					}
					break;
				case 'outlook-calendar':
					path = `/outlookcalendar/${workspaceId}/auth`;
					response = await Service.fetchGet(path, token, 'microsoft_integration_api');
					success = response?.[0] === true;
					if (success) {
						const connectUrl = response?.[1]?.connectUrl;
						window.location.href = connectUrl;
					}
					break;
				case 'outlook-mail':
					path = `/outlookmail/${workspaceId}/auth`;
					response = await Service.fetchGet(path, token, 'microsoft_integration_api');
					success = response?.[0] === true;
					if (success) {
						const connectUrl = response?.[1]?.connectUrl;
						window.location.href = connectUrl;
					}
					break;
			}
		} catch (error) {
			console.log('error==>connectZoho', error);
		}
	};

	const getConnectedThirdParties = async () => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = `/connected-accounts-v2/${workspaceId}`;
			const usertoken = localStorage.getItem('usertoken');
			const type = 'third_party_integrations_api';

			const response = await Service?.fetchGet(path, usertoken, type);

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

	const getNotificationsList = async ({ page = 1, limit = 10 } = {}) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const payload = {
				filters: {
					limit,
					page,
				},
			};
			const response = await service.query(
				getActivityLogsQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			const success = response?.[0];
			if (success) {
				const payload = {
					currentPage: response?.[1]?.data?.activityLogs?.currentPage,
					data:
						page === 1
							? response?.[1]?.data?.activityLogs?.data
							: [
									...(state?.notificationsList?.data || []),
									...(response?.[1]?.data?.activityLogs?.data || []),
							  ],
					hasNextPage: response?.[1]?.data?.activityLogs?.hasNextPage,
				};
				dispatch({
					type: Actions.GET_NOTIFICATIONS_SUCCESS,
					payload,
				});
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('errror ==>getNotifications', error);
			return [false, error];
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

	// const handleGlobalChatMessages = async (
	// 	payload,
	// 	sessionId,
	// 	localPayload,
	// 	recentFiles = null,
	// ) => {
	// 	try {
	// 		let workspaceId = localStorage.getItem('workspaceId');
	// 		let usertoken = localStorage.getItem('usertoken');
	// 		const url = `/${workspaceId}/${sessionId}/multi_agent_chat`;

	// 		let updatedGlobalChatMessages = [];

	// 		if (localPayload.showCustomChatOptions) {
	// 			updatedGlobalChatMessages = [...(localPayload.showCustomChatOptions || [])];
	// 		} else if (payload.files) {
	// 			let str = '  ';
	// 			for (let i = 0; i < localPayload?.files?.length; i++) {
	// 				str += localPayload?.files?.[i]?.name || '' + ' ,';
	// 			}

	// 			updatedGlobalChatMessages = [
	// 				{
	// 					type: 'user',
	// 					content: (
	// 						<div
	// 							className="uploadedImagesContainer"
	// 							style={{
	// 								display: 'flex',
	// 								flexDirection: 'column',
	// 								gap: '2px',
	// 								alignItems: 'flex-end',
	// 							}}
	// 						>
	// 							{localPayload?.files?.map((ele, index) => (
	// 								<img
	// 									src={ele.preview}
	// 									alt="filetochat"
	// 									width={'75px'}
	// 									onClick={() => localPayload?.handlePreview(ele)}
	// 									style={{ cursor: 'pointer' }}
	// 								/>
	// 							))}

	// 							<div className="message-content-user" style={{ marginTop: '8px' }}>
	// 								<span>{payload?.query}</span>
	// 							</div>
	// 						</div>
	// 					),
	// 				},
	// 				{
	// 					type: 'AI',
	// 					message: 'loading....',
	// 					content: (
	// 						<div className="aiMessageWrapper">
	// 							<Skeleton height={20} width={'100%'} borderRadius={'100px'} />
	// 							<Skeleton height={20} width={'75%'} borderRadius={'100px'} />
	// 							<Skeleton height={20} width={'50%'} borderRadius={'100px'} />
	// 						</div>
	// 					),
	// 					contentType: 'loading',
	// 				},
	// 			];

	// 			payload.query += str;
	// 		} else {
	// 			updatedGlobalChatMessages = [
	// 				{ type: 'user', message: payload?.query || '' },
	// 				{
	// 					type: 'AI',
	// 					message: 'loading....',
	// 					content: (
	// 						<div className="aiMessageWrapper">
	// 							<Skeleton height={20} width={'100%'} borderRadius={'100px'} />
	// 							<Skeleton height={20} width={'75%'} borderRadius={'100px'} />
	// 							<Skeleton height={20} width={'50%'} borderRadius={'100px'} />
	// 						</div>
	// 					),
	// 					contentType: 'loading',
	// 				},
	// 			];
	// 		}

	// 		dispatch({
	// 			type: Actions.GLOBAL_CHAT_MESSAGES_ACTIONS_REQUESTS,
	// 			payload: updatedGlobalChatMessages,
	// 		});

	// 		if (payload.files && recentFiles?.length) {
	// 			payload.files = payload?.files?.concat(
	// 				recentFiles?.map((ele) => ele?.originalFileName),
	// 			);
	// 		} else if (recentFiles?.length) {
	// 			payload.files = recentFiles?.map((ele) => ele?.originalFileName);
	// 		}

	// 		const response = await Service.fetchPost(url, payload, usertoken, 'ai_predictions');
	// 		if (response?.[0]) {
	// 			const citations = response?.[1]?.citations;
	// 			const followUpQuery = response?.[1]?.['follow_up_query'];
	// 			const messageId = response?.[1]?.['message_id'];
	// 			if (citations && citations?.length > 0) {
	// 				dispatch({
	// 					type: Actions?.CHAT_CITATIONS_SUCCESS,
	// 					payload: citations,
	// 				});
	// 			} else {
	// 				dispatch({
	// 					type: Actions?.CHAT_CITATIONS_SUCCESS,
	// 					payload: null,
	// 				});
	// 			}
	// 			if (followUpQuery?.length) {
	// 				dispatch({
	// 					type: Actions?.CHAT_FOLLOW_UP_QUERY,
	// 					payload: followUpQuery,
	// 				});
	// 			} else {
	// 				dispatch({
	// 					type: Actions?.CHAT_FOLLOW_UP_QUERY,
	// 					payload: null,
	// 				});
	// 			}
	// 			const updatedGlobalChatMessages = {
	// 				type: 'AI',
	// 				message: response?.[1]?.answer,
	// 				messageId: response?.[1]?.['message_id'],
	// 				rating: null,
	// 				deepResearch: response?.[1]?.['deep_research'],
	// 			};
	// 			dispatch({
	// 				type: Actions.GLOBAL_CHAT_MESSAGES_ACTIONS_SUCCESS,
	// 				payload: updatedGlobalChatMessages,
	// 			});
	// 			return [true, response?.[1]];
	// 		}
	// 	} catch (error) {
	// 		console.log('errror ==>handleGlobalChatMessages', error);
	// 	}
	// };

	const handleStreamSendMessage = (payload, localPayload, queryMessage, sessionId = null) => {
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
				{
					type: 'user',
					message: queryMessage || '',
					images: localPayload?.images || [],
					attachments: localPayload?.attachments,
				},
				{
					type: 'AI',
					contentType: 'loading',
				},
			];
		}

		updateChatLoadingSessions({ sessionId, isStreaming: true });
		dispatch({
			type: Actions.GLOBAL_CHAT_MESSAGES_ACTIONS_REQUESTS,
			payload: { updatedGlobalChatMessages, sessionId, isStreaming: true },
		});
	};

	const handleGlobalChatMessages = ({
		payload,
		chunkId,
		sessionId,
		fetchMore = false,
		recentChatMessages = null,
		updateExtraInfo = false,
		removeLoadingMessage = false,
		chatPayload = null,
		removeStreaming = false,
		removeChatSession = false,
		removeChatSessions = false,
		latestStreamMessage = null,
		removeLatestStreamMessage = false,
		lastQuery = null,
		chatBoxInfo = null,
		chatInfo = null,
		browserData = null,
		browserTabsInfo = null,
		recentChatInfo = null,
	}) => {
		try {
			dispatch({
				type: Actions.HANDLE_STREAM_MESSAGE_CHUNK,
				payload: {
					payload,
					chunkId,
					sessionId,
					fetchMore,
					recentChatMessages,
					updateExtraInfo,
					removeLoadingMessage,
					chatPayload,
					removeStreaming,
					removeChatSession,
					removeChatSessions,
					latestStreamMessage,
					removeLatestStreamMessage,
					lastQuery,
					chatBoxInfo,
					chatInfo,
					browserData,
					browserTabsInfo,
					recentChatInfo,
				},
			});
		} catch (error) {
			console.log('error==>handleGlobalChatMessages', error);
		}
	};

	const handleResetBrowserInactivityState = async (sessionId) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');

		let url = '/api/browser/' + workspaceId + '/' + sessionId + '/reset-expiry';

		try {
			const response = await Service?.fetchGet(url, usertoken, 'browser_api');
			return response;
		} catch (error) {
			console.log('error===>resetBrowserInactivity', error);
		}
	};

	const updateAiChatMessageRating = async (payload, messageId, isPublicChat = false) => {
		let workspaceId = localStorage.getItem('workspaceId');
		let usertoken = localStorage.getItem('usertoken');

		let url = '/' + workspaceId + '/ai-chat/' + messageId + '/ai-chat-message-feedback';
		if (isPublicChat) {
			url = '/ai-chat/' + messageId + '/rate-ai-chat-guestchat';
		}
		try {
			const response = await Service?.fetchPut(
				url,
				payload,
				usertoken,
				'ai_assistant_api',
				isPublicChat,
			);
			if (response?.[0]) {
				return [true, response?.[1]];
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

	const getRecentChatMessages = async ({
		sessionId,
		page = 1,
		fetchMore = false,
		limit = 5,
		isPublicChat = false,
		removeSessionId = false,
	}) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const selectedvariable = fetchMore ? 'moreRecentChatStorage' : 'recentChatStorage';

			if (removeSessionId) {
				dispatch({
					type: Actions.RECENT_CHAT_MESSAGES_ACTIONS_REQUESTS,
					payload: {
						sessionId,
						removeSessionId,
					},
					selectedvariable,
				});
				return;
			}

			let response;
			if (isPublicChat) {
				response = await Service.fetchGet(
					`/ai-chat/${encodeURIComponent(
						sessionId,
					)}/list-ai-chat-guestchat?page=${page}&limit=${limit}&sortBy=createdAt&sortOrder=-1`,
					null,
					'ai_assistant_api',
				);
			} else {
				response = await Service.fetchGet(
					`/${workspaceId}/ai-chat/list-multiagent-conversations/${encodeURIComponent(
						sessionId,
					)}?page=${page}&limit=${limit}&sortBy=createdAt&sortType=-1`,
					usertoken,
					'ai_assistant_api',
				);
			}

			if (response?.[0]) {
				dispatch({
					type: Actions.RECENT_CHAT_MESSAGES_ACTIONS_REQUESTS,
					payload: {
						data: response?.[1],
						sessionId,
					},
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
			const path = 'https://ai.us-east-1.ve.ai/available_models';
			// const type = 'ai_predictions';
			// const response = await Service?.fetchGet(path, usertoken, type);
			const response = await fetch(path, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${usertoken}`,
				},
			});
			const data = await response.json();
			if (response?.status === 200) {
				dispatch({
					type: Actions?.GET_LLM_MODELS_SUCCESS,
					payload: data,
				});
			} else {
				console.log('errror ==>getLLMModels', response);
				return [false];
			}

			// if (response?.[0]) {
			// 	dispatch({
			// 		type: Actions?.GET_LLM_MODELS_SUCCESS,
			// 		payload: response?.[1],
			// 	});
			// } else {
			// 	console.log('errror ==>getLLMModels', response);
			// 	return [false];
			// }
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

	const getAISuggestedPendingActions = async (payload, reset = false, type = null, id = null) => {
		try {
			if (type === 'delete') {
				const data = state?.aiSuggestedPendingActions?.pendingActions?.filter(
					(item) => item?._id !== id,
				);
				dispatch({
					type: Actions?.GET_AI_SUGGESTED_PENDING_ACTIONS_SUCCESS,
					payload: {
						...state?.aiSuggestedPendingActions,
						pendingActions: data,
					},
				});
				return;
			} else if (type === 'update') {
				const data = state?.aiSuggestedPendingActions?.pendingActions?.map((item) =>
					item?._id === id ? { ...item, ...payload } : item,
				);
				dispatch({
					type: Actions?.GET_AI_SUGGESTED_PENDING_ACTIONS_SUCCESS,
					payload: { ...state?.aiSuggestedPendingActions, pendingActions: data },
				});
				return;
			}
			const {
				page = 1,
				limit = 10,
				from,
				to,
				sortType,
				sortBy,
				isFavourited,
				search,
				insightType,
			} = payload || {};
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');

			// Build filter params (priority, read, confidenceScore)
			const filterParams = ['priority', 'read', 'confidenceScore']?.flatMap((key) =>
				Array?.isArray(payload?.[key])
					? payload[key]?.map((val) => `${key}=${encodeURIComponent(val)}`)
					: [],
			);

			// Add date filters if present
			if (from) filterParams?.push(`from=${from}`);
			if (to) filterParams?.push(`to=${to}`);
			if (sortType && sortBy) filterParams?.push(`sortType=${sortType}&sortBy=${sortBy}`);
			if (isFavourited) filterParams?.push(`isFavourite=${isFavourited}`);
			filterParams?.push(`search=${search || ''}`);
			if (insightType) filterParams?.push(`insightType=${insightType}`);
			const queryString = new URLSearchParams({ page, limit })?.toString();
			const fullQuery = `${queryString}&${filterParams?.join('&')}`;

			const url = `/${workspaceId}/knowledge-bases/pending-actions?${fullQuery}`;

			const response = await Service.fetchGet(url, usertoken, 'tenant', {});

			if (response?.[0]) {
				const data = reset
					? response?.[1]?.pendingActions || []
					: [
							...(state?.aiSuggestedPendingActions?.pendingActions || []),
							...(response?.[1]?.pendingActions || []),
					  ];
				dispatch({
					type: Actions.GET_AI_SUGGESTED_PENDING_ACTIONS_SUCCESS,
					payload: {
						...response?.[1],
						pendingActions: data,
					},
				});
			} else {
				console.log('response==>getAISuggestedPendingActions');
			}
		} catch (error) {
			console.log('error==>getAISuggestedPendingActions', error);
		}
	};

	const updateWorkflowTemplate = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				updateWorkflowTemplateQuery,
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
			console.log('error==>updateWorkflowTemplate', error);
		}
	};

	const pendingActionsUpdate = async (pendingActionId, payload, type = null) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url =
				type === 'delete'
					? `/${workspaceId}/knowledge-bases/pending-actions/${pendingActionId}/delete`
					: `/${workspaceId}/knowledge-bases/pending-actions/${pendingActionId}`;
			const response = await Service.fetchPut(url, payload, usertoken, 'tenant');
			return response;
		} catch (error) {
			console.log('error==>pendingActionsUpdate', error);
		}
	};

	const pendingActionsFeedback = async (pendingActionId, payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/knowledge-bases/pending-actions/${pendingActionId}/feedback`;
			const response = await Service.fetchPut(url, payload, usertoken, 'tenant');
			return response;
		} catch (error) {
			console.log('error==>pendingActionsFeedback', error);
		}
	};

	const duplicateSmartFile = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				duplicateSmartFileQuery,
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
			console.log('error==>duplicateSmartFile', error);
		}
	};

	const getAiQuestions = async (payload, reset = false) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/user-persona/ai-questions`;
			const response = await Service.fetchGet(url, usertoken, 'tenant');
			if (response?.[0]) {
				const data = reset
					? response?.[1]?.data || []
					: [...(state?.aiQuestions?.data || []), ...(response?.[1]?.data || [])];
				dispatch({
					type: Actions.GET_AI_QUESTIONS_SUCCESS,
					payload: {
						...response?.[1], // includes hasNextPage, hasPreviousPage, totalPages, totalItems, etc
						data,
					},
				});
			} else {
				console.log('error==>getAiQuestions', response);
			}
		} catch (error) {
			console.log('error==>getAiQuestions', error);
		}
	};

	const getProactiveAiData = async (id) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/knowledge-bases/pending-actions/${id}/pending-action`;
			const response = await Service.fetchGet(url, usertoken, 'tenant');
			if (response?.[0]) {
				dispatch({
					type: Actions.GET_PROACTIVE_AI_DATA_SUCCESS,
					payload: response?.[1],
				});
			} else {
				console.log('error==>getProactiveAiData', response);
			}
		} catch (error) {
			console.log('error==>getProactiveAiData', error);
		}
	};

	const updateAiQuestions = async (payload, id = null) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/user-persona/${id}/user-response`;
			const response = await Service.fetchPut(url, payload, usertoken, 'tenant');
			return response;
		} catch (error) {
			console.log('error==>updateAiQuestions', error);
		}
	};

	const addProactiveAiAccess = async (payload, id) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/knowledge-bases/pending-actions/${id}/invite-user`;
			const response = await Service.fetchPut(url, payload, usertoken, 'tenant');
			return response;
		} catch (error) {
			console.log('error==>addProactiveAiAccess', error);
		}
	};

	const updateProactiveAiAccess = async (payload, id) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/knowledge-bases/pending-actions/${id}/access`;
			const response = await Service.fetchPut(url, payload, usertoken, 'tenant');
			return response;
		} catch (error) {
			console.log('error==>updateProactiveAiAccess', error);
		}
	};

	const getChatBoxSuggestions = async (payload = {}) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const path = `https://ai.us-east-1.ve.ai/${workspaceId}/suggestions`;
			payload.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
			const response = await fetch(path, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${usertoken}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});
			const data = await response.json();
			if (response?.status === 200) {
				dispatch({
					type: Actions.GET_CHAT_BOX_SUGGESTIONS_SUCCESS,
					payload: data?.suggestions || [],
				});
			} else {
				console.log('error==>getChatBoxSuggestions', response);
			}
			// const url = `/${workspaceId}/suggestions`;
			// const response = await Service.fetchPost(url, payload, usertoken, 'ai_predictions');
			// if (response?.[0]) {
			// 	dispatch({
			// 		type: Actions.GET_CHAT_BOX_SUGGESTIONS_SUCCESS,
			// 		payload: response?.[1]?.suggestions || [],
			// 	});
			// } else {
			// 	console.log('error==>getChatBoxSuggestions', response);
			// }
		} catch (error) {
			console.log('error==>getChatBoxSuggestions', error);
		}
	};

	const deleteChatSession = async (sessionId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/ai-chat/delete-multiagent-conversation/${sessionId}`;
			const body = { isPermanent: true };
			const response = await Service.fetchDelete(url, usertoken, body, 'ai_assistant_api');
			return response;
		} catch (error) {
			console.log('error==>deleteChatSession', error);
		}
	};

	const updateChatLoadingSessions = ({
		sessionId,
		removeSessionId = false,
		isStreaming = false,
		isNotSeen = false,
	}) => {
		dispatch({
			type: Actions?.UPDATE_CHAT_LOADING_SESSIONS,
			payload: { sessionId, removeSessionId, isStreaming, isNotSeen },
		});
	};

	const deleteMultiAgentFile = async (fileId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/ai-chat/delete-file/${fileId}`;
			const response = await Service.fetchDelete(url, usertoken, null, 'ai_assistant_api');
			return response;
		} catch (error) {
			console.log('error==>deleteMultiAgentFile', error);
		}
	};

	const getFollowUpQueries = async (sessionId, messageId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const location = JSON.parse(localStorage.getItem('locationDetails')) || {};
			const url = `/${workspaceId}/${sessionId}/generate_follow_up_queries`;
			const payload = {
				location,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				message_id: messageId,
			};
			const response = await Service.fetchPost(url, payload, usertoken, 'ai_predictions');
			if (response?.[0]) {
				dispatch({
					type: Actions.GET_FOLLOW_UP_QUERIES_SUCCESS,
					payload: {
						[messageId]: response?.[1],
					},
				});
			} else {
				console.log('error==>getFollowUpQueries', response);
			}
		} catch (error) {
			console.log('error==>getFollowUpQueries', error);
		}
	};

	const handleTranscriptionSuggestions = async (payload) => {
		try {
			dispatch({
				type: Actions.HANDLE_TRANSCRIPTION_SUGGESTIONS,
				payload,
			});
		} catch (error) {
			console.log('error==>handleTranscriptionSuggestions', error);
		}
	};

	const updatechatSessionFavourite = async (sessionId, isFavourite) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const url = `/${workspaceId}/ai-chat/update-multiagent-conversation/${sessionId}`;
			const body = { isFavorite: isFavourite };
			const response = await Service.fetchPut(url, body, usertoken, 'ai_assistant_api');
			return response;
		} catch (error) {
			console.log('error==>updatechatSessionFavourite', error);
		}
	};

	const isSlugAvailable = async ({ slug, moduleType = 'workflowtemplates' }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const userToken = localStorage.getItem('usertoken');
			const variables = { slug, moduleType };
			const query = isSlugAvailableQuery;
			const type = 'workflows_Api';

			const response = await service.query(query, variables, workspaceId, userToken, type);

			return response?.[0] === true ? response[1]?.data?.isSlugAvailable : false;
		} catch (error) {
			console.error('Error checking slug availability:', error);
			return [false];
		}
	};

	const updateSlug = async ({ slug, updateSlugId, moduleType = 'workflowtemplates' }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const userToken = localStorage.getItem('usertoken');
			const mutation = updateSlugMutation;

			const variables = {
				updateSlugId,
				slug,
				moduleType,
			};
			const type = 'workflows_Api';

			const response = await service.mutation(
				mutation,
				variables,
				workspaceId,
				userToken,
				type,
			);

			return response?.[0] === true ? [true, response[1]?.data?.updateSlug?.slug] : [false];
		} catch (error) {
			console.error('Error updating slug:', error);
			return [false];
		}
	};

	const updateFormResponse = async ({ responseId }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const userToken = localStorage.getItem('usertoken');

			const response = await service.mutation(
				updateFormResponseMutation,
				{ responseId },
				workspaceId,
				userToken,
				'workflows_Api',
			);

			if (response?.[0]) {
				return [true, response[1]?.data?.updateFormResponse];
			} else {
				console.error('API failed => updateFormResponse', response);
				return [false, response?.[1]?.message || 'Something went Worng'];
			}
		} catch (error) {
			console.error('Error updating form response:', error);
			return [false, error?.message || 'Something went Worng'];
		}
	};

	const deleteFormResponse = async ({ responseId }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const userToken = localStorage.getItem('usertoken');

			const response = await service.mutation(
				deleteFormResponseMutation,
				{ responseId },
				workspaceId,
				userToken,
				'workflows_Api',
			);

			if (response?.[0]) {
				return [true, response[1]?.data?.deleteFormResponse];
			} else {
				console.error('API failed => deleteFormResponse', response);
				return [false, response?.[1]?.message || 'Something went Worng'];
			}
		} catch (error) {
			console.error('Error deleting form response:', error);
			return [false, error?.message || 'Something went Worng'];
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
		getRecentChatMessages,
		handleStreamSendMessage,
		getLLMModels,
		createBlankWorkflow,
		createBlankTemplate,
		getConnectedThirdParties,
		getFormResponse,
		getAISuggestedPendingActions,
		sendContactFormData,
		updateWorkflowTemplate,
		pendingActionsUpdate,
		duplicateSmartFile,
		getFormResponseAnalytics,
		pendingActionsFeedback,
		getAiQuestions,
		updateAiQuestions,
		getProactiveAiData,
		addProactiveAiAccess,
		updateProactiveAiAccess,
		getChatBoxSuggestions,
		updateChatLoadingSessions,
		deleteChatSession,
		deleteMultiAgentFile,
		getFollowUpQueries,
		handleTranscriptionSuggestions,
		updatechatSessionFavourite,
		isSlugAvailable,
		updateSlug,
		updateFormResponse,
		deleteFormResponse,
		getNotificationsList,
		getAuthUrlForThirdParty,
		disconnectThirdParty,
		handleResetBrowserInactivityState,
		syncUserAccount,
	};
};
