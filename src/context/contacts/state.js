import { useReducer } from 'react';
import service from '../../services/graphQlServices';
import restService from '../../services';

import {
	getClientsQuery,
	createClientMutation,
	deleteClientMutation,
	updateClientMutation,
	contactMetadataQuery,
	updateContactViewMutation,
	deleteContactViewMutation,
} from './graphQlFunctions';
import { Actions } from './actions';
import { Reducer } from './reducer';

export const intialState = {
	refetchClientList: false,
	clientList: null,
	clientMetadata: null,
	contactPreference: null,
};

export const ContactsState = () => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const getClients = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getClientsQuery,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0]) {
				dispatch({
					type: Actions.SET_CLIENT_LIST,
					payload: { data: response?.[1]?.data?.clients },
				});
			} else {
				dispatch({
					type: Actions.SET_CLIENT_LIST,
					payload: { error: 'Failed to get clients, try again' },
				});
			}
		} catch (error) {
			console.log('API failed ==> getClients', error);
		}
	};

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

	const getContactMetadata = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				contactMetadataQuery,
				{},
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.SET_CONTACT_METADATA,
					payload: response?.[1]?.data?.getClientMetadata,
				});
			}
		} catch (error) {
			console.log('API failed ==> getContactMetadata', error);
		}
	};

	const updateContactViews = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				updateContactViewMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.UPDATE_CONTACT_VIEWS,
					payload: response?.[1]?.data?.updateClientView?.views,
				});
			}
		} catch (error) {
			console.log('API failed ==> updateContactViews', error);
		}
	};

	const deleteContactView = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				deleteContactViewMutation,
				payload,
				workspaceId,
				usertoken,
				'workflows_Api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.DELETE_CONTACT_VIEW,
					payload: payload?.viewId,
				});
			}
		} catch (error) {
			console.log('API failed ==> deleteContactView', error);
		}
	};

	const getContactPreferences = async (data) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const response = await restService.fetchGet(
				'/tenantuser-preference',
				usertoken,
				'tenant-users',
				data,
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.SET_CONTACT_PREFERENCES,
					payload: { data: response?.[1] },
				});
			} else {
				dispatch({
					type: Actions.SET_CONTACT_PREFERENCES,
					payload: { error: response?.[1] },
				});
			}
		} catch (error) {
			console.log('error ==> getContactPreferences', error);
			dispatch({
				type: Actions.SET_CONTACT_PREFERENCES,
				payload: { error: error },
			});
		}
	};

	const updateContactPreferences = async (json) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const response = await restService.fetchPut(
				'/tenantuser-preference',
				json,
				usertoken,
				'tenant-users',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.SET_CONTACT_PREFERENCES,
					payload: { data: json?.data },
				});
				return [true, response[1]];
			} else {
				return [false, response[1]];
			}
		} catch (error) {
			console.log('error ==> updateContactPreferences', error);
		}
	};

	const resetContactsState = () => {
		dispatch({ type: Actions.RESET_STATE });
	};

	return {
		...state,
		getClients,
		createClient,
		deleteClient,
		updateClient,
		updateStateValues,
		resetContactsState,
		getContactMetadata,
		updateContactViews,
		deleteContactView,
		getContactPreferences,
		updateContactPreferences,
	};
};
