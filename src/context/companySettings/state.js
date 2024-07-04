import { useReducer } from 'react';
import Reducer from './reducer';
import * as API from './actionTypes';
import service from '../../services';

export const CompanySettingsState = () => {
	const intialState = {};
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
	return {
		...state,
		updateTenantContactDetails,
		updateTenantAddress,
		updateTenantWebsite,
	};
};
