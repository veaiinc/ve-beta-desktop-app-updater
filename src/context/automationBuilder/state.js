import { useReducer } from 'react';
import restService from '../../services';
import Reducer from './reducer';
import { Actions } from './actions';
import Service from '../../services';

export const initialState = {
	specificAutomationInfo: null,
	connectedIntegrations: null,
	executionHistory: null,
	// previousStepResponse: null,
	// previousExecutionData: null,
	variables: null,
	automationsList: null,
};

export const AutomationBuilderState = () => {
	const [state, dispatch] = useReducer(Reducer, initialState);

	const createAutomation = async (payload) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const response = await restService.fetchPost(
				`/${workspaceId}/createAutomation`,
				payload,
				usertoken,
				'automation_builder_api',
			);
			if (response?.[0]) {
				return [true, response?.[1]?.newAutomation];
			}
			return [false, null];
		} catch (error) {
			console.log('API failed ==> createAutomation', error);
			return [false, null];
		}
	};

	const getAutomation = async (automationId) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const response = await restService.fetchGet(
				`/${workspaceId}/${automationId}/automation`,
				usertoken,
				'automation_builder_api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.SET_AUTOMATION,
					payload: response?.[1]?.auto,
				});
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getAutomationsList = async (page = 1, limit = 10, append = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			const path = `/${workspaceId}/getAutomations`;
			const token = localStorage.getItem('usertoken');
			const type = 'automation_builder_api';
			const query = {
				page,
				limit,
			};
			const response = await Service?.fetchGet(path, token, type, query);
			if (response?.[0]) {
				const formattedData = response?.[1]?.automations?.data?.map((automation) => {
					const { _id, name, steps, tenantId, status } = automation;
					return {
						_id,
						title: name,
						steps,
						tenantId,
						status,
						moduleTemplates: [], // TODO: add module templates key once we have it
						isAutomation: true,
					};
				});
				const data = append
					? [...(state?.automations?.automations?.data || []), ...formattedData]
					: formattedData;
				const currentPage = response?.[1]?.automations?.currentPage;
				const hasNextPage = response?.[1]?.automations?.hasNextPage;
				const payload = {
					data,
					hasNextPage,
					currentPage,
				};
				dispatch({
					type: Actions?.SET_AUTOMATIONS_LIST,
					payload,
				});
			}
		} catch (error) {
			console.log('error==>getAutomations', error);
			return [false];
		}
	};

	const updateStateValues = (payload) => {
		dispatch({
			type: Actions.UPDATE_STATE_VALUES,
			payload: payload,
		});
	};

	const addTrigger = async (automationId, payload) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const response = await restService.fetchPost(
				`/${workspaceId}/${automationId}/addTrigger`,
				payload,
				usertoken,
				'automation_builder_api',
			);
			if (response?.[0] === true) {
				dispatch({
					type: Actions.ADD_TRIGGER,
					payload: response?.[1]?.newTrigger,
				});
				return [true, response?.[1]?.newTrigger];
			}
			return [false, response?.[1]?.message];
		} catch (error) {
			console.log('API failed ==> addTrigger', error);
			return [false, null];
		}
	};

	const addStep = async (automationId, payload) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const response = await restService.fetchPost(
				`/${workspaceId}/${automationId}/addStep`,
				payload,
				usertoken,
				'automation_builder_api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.ADD_STEP,
					payload: response?.[1]?.newStep,
				});
				return [true, response?.[1]?.newStep];
			}
			return [false, response?.[1]?.message];
		} catch (error) {
			console.log('API failed ==> addStep', error);
			return [false, null];
		}
	};

	const getConnectionDetails = async () => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const response = await restService.fetchGet(
				`/connect-account/${workspaceId}`,
				usertoken,
				'third_party_integrations_api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.SET_CONNECTION_DETAILS,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('API failed ==> getConnectionDetails', error);
		}
	};

	const updateAutomation = async (automationId, payload) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const response = await restService.fetchPut(
				`/${workspaceId}/${automationId}/update-automation`,
				payload,
				usertoken,
				'automation_builder_api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.UPDATE_AUTOMATION,
					payload: response?.[1]?.updatedAutomation,
				});
			}
			return response;
		} catch (error) {
			console.log('API failed ==> updateAutomation', error);
		}
	};

	const renameAutomationTitle = async (automationId, rename) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = `/${workspaceId}/${automationId}/update-automation`;
			const token = localStorage.getItem('usertoken');
			const body = {
				name: rename,
			};
			const type = 'automation_builder_api';
			const response = await Service?.fetchPut(path, body, token, type);
			if (response?.[0]) {
				return [true];
			}
			return [false];
		} catch (error) {
			console.log('API failed ==> renameAutomation', error);
		}
	};

	const getExecutionHistory = async (automationId) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const response = await restService.fetchGet(
				`/${workspaceId}/${automationId}/execution/list`,
				usertoken,
				'automation_builder_api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.SET_EXECUTION_HISTORY,
					payload: { data: response?.[1] },
				});
			} else {
				dispatch({
					type: Actions.SET_EXECUTION_HISTORY,
					payload: { error: response?.[1]?.message },
				});
			}
		} catch (error) {
			console.log('API failed ==> getExecutionHistory', error);
		}
	};

	const getVariables = async (payload) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const response = await restService.fetchPost(
				`/${workspaceId}/variable/variables`,
				payload,
				usertoken,
				'automation_builder_api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.SET_VARIABLES,
					payload: {
						data: {
							variables:
								payload?.action === 'formResponse'
									? response?.[1]?.[0]?.blocks || []
									: response?.[1],
							actionType: payload?.action,
						},
					},
				});
			}
		} catch (error) {
			console.log('API failed ==> getVariables', error);
		}
	};

	// const getPreviousStepResponse = async (automationId, batchId, stepId) => {
	// 	try {
	// 		const usertoken = localStorage.getItem('usertoken');
	// 		const workspaceId = localStorage.getItem('workspaceId');
	// 		const response = await restService.fetchGet(
	// 			`/${workspaceId}/${automationId}/execution/batch/${batchId}/step/${stepId}`,
	// 			usertoken,
	// 			'automation_builder_api',
	// 		);

	// 		if (response?.[0]) {
	// 			dispatch({
	// 				type: Actions.SET_PREVIOUS_STEP_RESPONSE,
	// 				payload: { data: response?.[1] },
	// 			});
	// 		} else {
	// 			dispatch({
	// 				type: Actions.SET_PREVIOUS_STEP_RESPONSE,
	// 				payload: { error: response?.[1]?.message },
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.log('API failed ==> getPreviousStepResponse', error);
	// 		dispatch({
	// 			type: Actions.SET_PREVIOUS_STEP_RESPONSE,
	// 			payload: { error: error?.message },
	// 		});
	// 		return [false];
	// 	}
	// };

	// const executeAutomation = async (automationId) => {
	// 	try {
	// 		const usertoken = localStorage.getItem('usertoken');
	// 		const workspaceId = localStorage.getItem('workspaceId');
	// 		const response = await restService.fetchPost(
	// 			`/${workspaceId}/${automationId}/execution/start`,
	// 			{},
	// 			usertoken,
	// 			'automation_builder_api',
	// 		);
	// 		if (response?.[0]) {
	// 			console.log('response', response);

	// 			dispatch({
	// 				type: Actions.SET_PREVIOUS_EXECUTION_DATA,
	// 				payload: response?.[1],
	// 			});
	// 		} else {
	// 			dispatch({
	// 				type: Actions.SET_PREVIOUS_EXECUTION_DATA,
	// 				payload: { error: response?.[1]?.message },
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.log('API failed ==> executeAutomation', error);
	// 	}
	// };

	const resetAutomationBuilderState = () => {
		dispatch({ type: Actions.RESET_STATE });
	};

	return {
		...state,
		createAutomation,
		getAutomation,
		getAutomationsList,
		updateStateValues,
		addTrigger,
		addStep,
		resetAutomationBuilderState,
		getConnectionDetails,
		updateAutomation,
		getExecutionHistory,
		// getPreviousStepResponse,
		// executeAutomation,
		getVariables,
		renameAutomationTitle,
	};
};
