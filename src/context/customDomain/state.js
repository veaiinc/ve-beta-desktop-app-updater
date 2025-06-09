import Service from '../../services/index';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';

export const initialState = {
	customDomainData: null,
	customDomainStatus: null,
};

export const CustomDomainState = () => {
	const [state, dispatch] = useReducer(Reducer, initialState);

	const requestCustomDomainConnection = async (domain) => {
		try {
			const path = '/domains/request';
			const token = localStorage.getItem('usertoken');
			const workspace_id = localStorage.getItem('workspaceId');
			const type = 'custom_domain_api';
			const body = {
				domain,
				workspace_id,
				validation_method: 'DNS',
			};
			const response = await Service.fetchPost(path, body, token, type);
			const success = response?.[0];
			if (success) {
				const data = {
					domain: response?.[1]?.domain,
					status: response?.[1]?.status,
					statusMessage: response?.[1]?.message,
					validationRecords: response?.[1]?.validation_records,
				};
				dispatch({ type: Actions.SET_CUSTOM_DOMAIN_DATA, payload: data });
				return [true];
			} else {
				return [false];
			}
		} catch (error) {
			console.log('Error in checkCustomDomain', error);
			return [false];
		}
	};

	const getCustomDomainStatus = async (domain) => {
		try {
			const path = '/domains/status';
			const token = localStorage.getItem('usertoken');
			const workspace_id = localStorage.getItem('workspaceId');
			const params = {
				domain,
				workspace_id,
			};
			const type = 'custom_domain_api';
			const response = await Service.fetchGet(path, token, type, params);
			const success = response?.[0];
			if (success) {
				const data = response?.[1];
				dispatch({ type: Actions.SET_CUSTOM_DOMAIN_STATUS, payload: data });
				return [true];
			} else {
				return [false];
			}
		} catch (error) {
			console.log('Error in getCustomDomain', error);
			return [false];
		}
	};

	const resetCustomDomainState = () => {
		dispatch({
			type: Actions.RESET_STATE,
		});
	};

	return {
		...state,
		requestCustomDomainConnection,
		getCustomDomainStatus,
		resetCustomDomainState,
	};
};

export default CustomDomainState;
