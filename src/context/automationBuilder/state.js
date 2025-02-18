import { useReducer } from 'react';
import restService from '../../services';
import Reducer from './reducer';
import { Actions } from './actions';

export const initialState = {
	specificAutomationInfo: null,
	connectedIntegrations: null,
	executionHistory: null,
	// previousStepResponse: null,
	// previousExecutionData: null,
	variables: null,
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
	};
};
