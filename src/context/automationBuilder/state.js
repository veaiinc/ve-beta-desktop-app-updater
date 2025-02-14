import { useReducer } from 'react';
import restService from '../../services';
import Reducer from './reducer';
import { Actions } from './actions';

export const initialState = {
	specificAutomationInfo: null,
	connectedIntegrations: null,
	executionHistory: null,
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
	};
};
