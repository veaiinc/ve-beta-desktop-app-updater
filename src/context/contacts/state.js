import { useReducer } from 'react';
import service from '../../services/graphQlServices';
import {
	createClientMutation,
	deleteClientMutation,
	updateClientMutation,
} from './graphQlFunctions';
import { Actions } from './actions';
import { Reducer } from './reducer';

export const intialState = {
	refetchClientList: false,
};

export const ContactsState = () => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const createClient = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				createClientMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				return [true];
			} else {
				console.log('API failed ==> getListItems', response);
				dispatch({
					type: Actions.UPDATE_CONTACT_CONTEXT,
					payload: { error: 'Failed to create client, try again' },
				});
				return [false, response?.[1]?.[0]?.message];
			}
		} catch (error) {
			console.log('API failed ==> getListItems', error);
		}
	};

	const deleteClient = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				deleteClientMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.UPDATE_CONTACT_CONTEXT,
					payload: { refetchClientList: true },
				});
				return [true];
			} else {
				console.log('API failed ==> deleteClient', response);
				return [false, response?.[1]?.[0]?.message];
			}
		} catch (error) {
			console.log('API failed ==> deleteClient', error);
		}
	};

	const updateClient = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				updateClientMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.UPDATE_CONTACT_CONTEXT,
					payload: { refetchClientList: true },
				});
				return [true];
			} else {
				console.log('API failed ==> updateClient', response);
				return [false, response?.[1]?.[0]?.message];
			}
		} catch (error) {
			console.log('API failed ==> updateClient', error);
		}
	};

	const updateStateValues = (payload) => {
		dispatch({ type: Actions.UPDATE_CONTACT_CONTEXT, payload });
	};

	const resetContactsState = () => {
		dispatch({ type: Actions.RESET_STATE });
	};

	return {
		...state,
		createClient,
		deleteClient,
		updateClient,
		updateStateValues,
		resetContactsState,
	};
};
