import Service from '../../services';
import { Actions } from './actions';
import { useReducer } from 'react';
import Reducer from './reducer';

export const initialState = {
	connectUrl: null,
};

export const ThirdPartyIntegrationsState = () => {
	const [state, dispatch] = useReducer(Reducer, initialState);

	const resetThirdPartyIntegrationsState = () => {
		dispatch({ type: Actions?.RESET_STATE });
	};
	// https://ap.api.ve.ai/third-party-integrations/1.0/zoho/businessconsultant/auth
	// https://ap.api.ve.ai/third-party-integrations/1.0/zoho/businessconsultant/available-modules
	// https://ap.api.ve.ai/third-party-integrations/1.0/zoho/businessconsultant/Leads/fields
	const connectThirdParty = async (connectType) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const path = `${connectType}/${workspaceId}/auth`;

			const response = await Service?.fetchGet(
				path,
				usertoken,
				'third_party_integrations_api',
			);
			console.log(response);
			if (response?.[0] === true) {
				dispatch({
					type: Actions?.SET_CONNECT_URL,
					payload: [true, response?.[1]?.connectUrl],
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

	return {
		...state,
		resetThirdPartyIntegrationsState,
		connectThirdParty,
	};
};
