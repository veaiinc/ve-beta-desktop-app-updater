import { useReducer } from 'react';
import Reducer from './reducer';
import * as API from './actionTypes';
import service from '../../services';
import { Actions } from './actions';
import axios from 'axios';
import cookie from 'js-cookie';
export const intialState = {
	tenantsUserList: null,
	tenantPreferenceData: null,
	tenantSubscriptionDetails: null,
	clientPortalPreferences: null,
};

export const CompanySettingsState = () => {
	const [state, dispatch] = useReducer(Reducer, intialState);
	const updateTenantContactDetails = async (contactJosn) => {
		try {
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
				'/tenant/' + workspaceId + API.TENANTS.tenantUsers,
				usertoken,
				'auth',
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
				'/tenant/' + workspaceId + API.TENANTS.businessName,
				json,
				usertoken,
				'auth',
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
		} catch (error) {
			console.log('error => updateTenantSocialMediaProfile ', error);
		}
	};
	const updatePrefernces = async (json) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				'/' + workspaceId + API.TENANTS.preferences,
				json,
				usertoken,
				'tenant',
			);

			if (response?.[0] === true) {
				cookie.set('theme', json?.theme, { expires: 365 });
				localStorage.setItem('theme', json?.theme);
				return [true, response[1]];
			} else {
				return [false, response[1]];
			}
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

				const resp = axios.put(response[1].signedUrl, file, options);
			}
		} catch (error) {
			console.log('error => uploadTenantLogo ', error);
		}
	};

	const inviteNewuser = async (payload) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			return await service.fetchPost(
				'/tenant/' + workspaceId + API.TENANTS.tenantUsers,
				payload,
				usertoken,
				'auth',
			);
		} catch (error) {
			console.log('error => inviteNewuser ', error);
			throw error;
		}
	};

	const updateTenantRole = async (tennatId, json) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			let response = await service.fetchPut(
				'/tenant/' + workspaceId + API.TENANTS.tenantUsers + '/' + tennatId + '/role',
				json,
				usertoken,
				'auth',
			);

			if (response?.[0] === true) {
				const updateData = state?.tenantsUserList?.map((user) =>
					user?._id === tennatId ? { ...user, role: json?.role } : user,
				);
				dispatch({ type: Actions.GET_TENANTS_LIST, payload: updateData });
				return [true, response[1]];
			} else {
				return [false, response[1]];
			}
		} catch (error) {
			console.log('error => updatetennat role', error);
		}
	};

	const removeTenantRole = async (tennatId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			let response = await service.fetchDelete(
				'/tenant/' + workspaceId + API.TENANTS.tenantUsers + '/' + tennatId,
				usertoken,
				null,
				'auth',
			);

			if (response?.[0] === true) {
				const updateData = state?.tenantsUserList?.filter((user) => user?._id !== tennatId);
				dispatch({ type: Actions.GET_TENANTS_LIST, payload: updateData });
				return [true, response[1]];
			} else {
				return [false, response[1]];
			}
		} catch (error) {
			console.log('error => removeTenantRole', error);
		}
	};

	const checkWorkspaceId = async (payload) => {
		try {
			const response = await service.fetchGet(
				'/tenant/workspaceId-availability?workspaceId=' + payload,
				null,
				'auth',
			);

			if (response?.[0]) {
				return [true, response[1]];
			} else {
				return [false];
			}
		} catch (error) {
			console.log('error occureed in checkWorkspaceId', error);
		}
	};

	const getClientPortalPreference = async () => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				'/tenant/' + workspaceId + API.TENANTS.clientPortalPreferences,
				usertoken,
				'auth',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.GET_CLIENT_PORTAL_PREFERENCES,
					payload: { ...response?.[1]?.clientPortalPreferences },
				});
			}
		} catch (error) {
			console.log('error ==> getClientPortalPreference', error);
		}
	};

	const updateClientPortalPreference = async (json) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				'/tenant/' + workspaceId + API.TENANTS.clientPortalPreferences,
				json,
				usertoken,
				'auth',
			);
			if (response?.[0]) {
				return [true];
			} else {
				return [false];
			}
		} catch (error) {
			console.log('error ==> getClientPortalPreference', error);
		}
	};

	const resetCompanySettings = async () => {
		try {
			dispatch({ type: Actions.RESET_STATE });
		} catch (error) {
			console.log('error => resetCompanySettings ', error);
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
		resetCompanySettings,
		inviteNewuser,
		updateTenantRole,
		removeTenantRole,
		checkWorkspaceId,
		getClientPortalPreference,
		updateClientPortalPreference,
	};
};
