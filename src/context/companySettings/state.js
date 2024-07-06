import { useReducer } from 'react';
import Reducer from './reducer';
import * as API from './actionTypes';
import service from '../../services';
import { Actions } from './actions';

export const CompanySettingsState = () => {
	const intialState = {
		tenantsUserList: null,
	};
	const [state, dispatch] = useReducer(Reducer, intialState);
	const updateTenantContactDetails = async (contactJosn) => {
		try {
			console.log(contactJosn, 'this is the dat afrom the json');
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				'/' + workspaceId + API.TENANTS.contactDetails,
				contactJosn,
				usertoken,
				'tenant',
			);
		} catch (error) {
			console.log('error => Update Tenant Contact Details Api faild', error);
		}
	};
	const updateTenantAddress = async (json) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				'/' + workspaceId + API.TENANTS.address,
				json,
				usertoken,
				'tenant',
			);
		} catch (error) {
			console.log('error => Update Tenant Address ', error);
		}
	};
	const updateTenantWebsite = async (json) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				'/' + workspaceId + API.TENANTS.websiteUrl,
				json,
				usertoken,
				'tenant',
			);
		} catch (error) {
			console.log('erroe => Update Tenant Website', error);
		}
	};
	const getTeamMembers = async () => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');

			let tenantTeam = await service.fetchGet(
				'/' + workspaceId + API.TENANTS.tenantUsers,
				usertoken,
				'tenant',
			);
			if (tenantTeam?.[0]) {
				dispatch({
					type: Actions.GET_TENANTS_LIST,
					payload: tenantTeam?.[1],
				});
			}
		} catch (error) {
			console.log('error => getTeamMembers ', error);
		}
	};
	return {
		...state,
		updateTenantContactDetails,
		updateTenantAddress,
		updateTenantWebsite,
		getTeamMembers,
	};
};
