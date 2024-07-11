import { useReducer } from 'react';
import Reducer from './reducer';
import * as API from './actionTypes';
import service from '../../services';
import { Actions } from './actions';
import axios from 'axios';

export const CompanySettingsState = () => {
	const intialState = {
		tenantsUserList: null,
		tenantPreferenceData: null,
		tenantSubscriptionDetails: null,
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
	const updateTenantBusinessName = async (json) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			let response = await service.fetchPut(
				'/' + workspaceId + API.TENANTS.businessName,
				json,
				usertoken,
				'tenant',
			);
		} catch (error) {
			console.log('error => updateTenantBusinessName ', error);
		}
	};
	const updateTenantSocialMediaProfile = async (json) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				'/' + workspaceId + API.TENANTS.socialMediaProfile,
				json,
				usertoken,
				'tenant',
			);
			console.log(response, 'this is the responce');
		} catch (error) {
			console.log('error => updateTenantSocialMediaProfile ', error);
		}
	};
	const updatePrefernces = async (json) => {
		try {
			// brandAccentColor: '#ffffff',
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				'/' + workspaceId + API.TENANTS.preferences,
				json,
				usertoken,
				'tenant',
			);
			console.log(response, 'this the response ');
		} catch (error) {
			console.log('error => updatePrefernces ', error);
		}
	};
	const getTenantPreferences = async () => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const responce = await service.fetchGet(
				'/' + workspaceId + API.TENANTS.preferences,
				usertoken,
				'tenant',
			);
			if (responce?.[0]) {
				dispatch({
					type: Actions.GET_TENANTS_PREFERENCES,
					payload: responce?.[1],
				});
			}
		} catch (error) {
			console.log('error => getTenantPreferences ', error);
		}
	};
	const getTenantSubscriptionDetails = async () => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				'/' + workspaceId + API.TENANTS.subscriptionDetails,
				usertoken,
				'tenant',
			);
			dispatch({
				type: Actions.GET_TENANTS_SUBSCRIPTION_DETAILS,
				payload: response?.[1],
			});
		} catch (error) {
			console.log('error => getTenantSubscriptionDetails ', error);
		}
	};
	const uploadTenantLogo = async (file) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPost(
				'/' + workspaceId + API.TENANTS.logos,
				{},
				usertoken,
				'tenant',
			);

			if (response?.[0] === true) {
				let options = {
					headers: {
						'Content-Type': file.type,
					},
				};

				const resp = await axios.put(response[1].signedUrl, file, options);

				if (resp.status === 200) {
					console.log('yes');
				} else {
					console.log('no');
				}
			}
		} catch (error) {
			console.log('error => uploadTenantLogo ', error);
		}
	};

	return {
		...state,
		updateTenantContactDetails,
		updateTenantAddress,
		updateTenantWebsite,
		getTeamMembers,
		updateTenantBusinessName,
		updateTenantSocialMediaProfile,
		updatePrefernces,
		getTenantPreferences,
		getTenantSubscriptionDetails,
		uploadTenantLogo,
	};
};
