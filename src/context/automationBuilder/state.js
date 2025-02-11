import { useReducer } from 'react';
import restService from '../../services';
import Reducer from './reducer';
import { Actions } from './actions';

export const initialState = {
	specificAutomationInfo: null,
	// connectedIntegrations: null,
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

	// const getConnectedIntegrations = async () => {
	// 	try {
	// 		const usertoken = localStorage.getItem('usertoken');
	// 		const workspaceId = localStorage.getItem('workspaceId');
	// 		const response = await restService.fetchGet(
	// 			`/connect-account/${workspaceId}`,
	// 			usertoken,
	// 			'third_party_integrations_api',
	// 		);
	// 		if (response?.[0]) {
	// 			dispatch({ type: Actions.SET_CONNECTED_INTEGRATIONS, payload: response?.[1] });
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };
	return {
		...state,
		createAutomation,
		getAutomation,
		updateStateValues,
		// getConnectedIntegrations,
	};
};
