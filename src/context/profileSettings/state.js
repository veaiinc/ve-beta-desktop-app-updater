import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';
import * as API from './actionTypes';
import jwt_decode from 'jwt-decode';
import service from '../../services/index';
import axios from 'axios';
export const intialState = {
	tennantSettingsData: null,
	userDetailsData: null,
	tenantUserDetails: null,
	qrcode: null,
	set2factorSettings: null,
	userWorkSpaceList: null,
};
export const ProfileState = () => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const getTenantSettings = async () => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(`/${workspaceId}`, usertoken, 'tenant');
			if (response?.[0]) {
				dispatch({
					type: Actions.GET_TENANT_SETTINGS,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getTenantSettings', error);
		}
	};
	const getUserDetails = async () => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			const userDetails = await service.fetchGet(
				API.TENANTS.myProfile,
				usertoken,
				'tenant-users',
			);

			if (userDetails?.[0]) {
				dispatch({
					type: Actions.GET_USER_DETAILS,
					payload: userDetails?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getUserDetails', error);
		}
	};
	const getTenantUserDetails = async () => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			let decoded = jwt_decode(usertoken);
			const responseData = await service.fetchGet(
				'/' + workspaceId + API.TENANTS.tenantUsers + '/' + decoded.user_id,
				usertoken,
				'tenant',
			);

			if (responseData?.[0]) {
				dispatch({
					type: Actions.GET_TENANT_USER_DETAILS,
					payload: responseData?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getTenantUserDetails', error);
		}
	};
	const get2FAQrCode = async () => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			const qrCode = await service.fetchGet(
				API.TENANT_USER_LOGIN_SIGNUP_API.set2FASettings +
					API.TENANT_USER_LOGIN_SIGNUP_API.googleAuthenticator +
					API.TENANT_USER_LOGIN_SIGNUP_API.qrCode,
				usertoken,
				'tenant-users',
			);

			if (qrCode?.[0]) {
				dispatch({
					type: Actions.GET_2FA_QR_CODE,
					payload: qrCode?.[1],
				});
			} else {
				console.log('api failed qrcode');
			}
		} catch (error) {
			console.log('error==>get2FAQrCode', error);
		}
	};
	const set2FASettings = async (is2FAEnabled) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let json = {
				is2FAEnabled: is2FAEnabled,
			};
			let response = await service.fetchPut(
				API.TENANT_USER_LOGIN_SIGNUP_API.set2FASettings,
				json,
				usertoken,
				'tenant-users',
			);

			if (response[0]) {
				dispatch({
					type: Actions.SET_2FA_SETTINGS,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>set2fASettings', error);
		}
	};

	const updateUserDetails = async (payload) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let response = service.fetchPut(
				API.TENANTS.myProfile,
				payload,
				usertoken,
				'tenant-users',
			);
		} catch (error) {
			console.log('error==>updateUserDetails', error);
		}
	};

	// added api
	const updateUserPhoneNumber = async (payload) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let decoded = jwt_decode(usertoken);
			console.log(decoded);
			let response = service.fetchPut(
				'/' + decoded.user_id + API.TENANTS.updateTenantUser,
				payload,
				usertoken,
				'tenant-users',
			);
		} catch (error) {
			console.log(error);
		}
	};

	const getUserWorkSpaceList = async () => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workSpaceList = await service.fetchGet(
				API.TENANTS.accessibleTenants,
				usertoken,
				'auth',
			);

			if (workSpaceList?.[0]) {
				dispatch({
					type: Actions.GET_USER_WORKSPACE_LIST,
					payload: workSpaceList?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getUserWorkSpaceList', error);
		}
	};

	const verifyLoginWithPassword = async (checkPassword) => {
		try {
			return await service.fetchPost(
				API.TENANT_USER_LOGIN_SIGNUP_API.loginWithPassword,
				checkPassword,
				null,
				'tenant-users',
			);
		} catch (error) {
			console.log('error==>verifyLoginWithPassword', error);
		}
	};
	const updatePassword = async (currentpassword, payload) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let passwordResponse = await verifyLoginWithPassword(currentpassword);
			if (passwordResponse?.[0]) {
				let response = await service.fetchPost(
					API.TENANT_USER_LOGIN_SIGNUP_API.updatePassword,
					payload,
					usertoken,
					'tenant-users',
				);
			}
		} catch (error) {
			console.log('error==>updatePassword', error);
		}
	};
	const chooseDefaultWorkspace = async (data) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			const payload = {
				tenantId: data?.tenant_id,
				order: 1,
			};
			let response = service.fetchPost(
				`/update-tenants-order`,
				payload,
				usertoken,
				'tenant-users',
			);
		} catch (error) {
			console.log('error==>chooseDefaultWorkspace', error);
		}
	};
	const changelogo = (file) => {
		try {
			dispatch({
				type: Actions.UPDATE_LOGO,
				payload: file,
			});
		} catch (error) {
			console.log('error==>changelogo', error);
		}
	};
	const updateBusniessName = (name) => {
		try {
			dispatch({
				type: Actions.UPDATE_BUSNIESSNAME,
				payload: name,
			});
		} catch (error) {
			console.log('error==>updateBusniessName', error);
		}
	};
	const updateUserLogo = async (file) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.fetchPost(
				API.TENANTS.displayPicture,
				{},
				usertoken,
				'tenant-users',
			);
			if (response[0]) {
				let options = {
					headers: {
						'Content-Type': file.type,
					},
				};
				const resp = axios.put(response[1]?.signedUrl, file, options);
			}
		} catch (error) {
			console.log('error==>updateUserLogo', error);
		}
	};

	const updateWorkSpaceId = async (json) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');

			const responseData = await service.fetchPut(
				'/' + workspaceId + '/add-workspaceId ',
				json,
				usertoken,
				'tenant',
			);
		} catch (error) {
			console.log('error', error);
		}
	};

	const updateCompanyDetailsState = (payload) => {
		try {
			dispatch({
				type: Actions.UPDATE_COMPANY_DETAILS,
				payload,
			});
		} catch (error) {
			console.log('error==>updateBusniessName', error);
		}
	};

	const resetProfileSettingsState = async () => {
		dispatch({ type: Actions.RESET_STATE });
	};
	return {
		...state,
		getTenantSettings,
		getUserDetails,
		getTenantUserDetails,
		get2FAQrCode,
		set2FASettings,
		updateUserDetails,
		updateUserPhoneNumber,
		getUserWorkSpaceList,
		updatePassword,
		chooseDefaultWorkspace,
		changelogo,
		updateBusniessName,
		updateUserLogo,
		resetProfileSettingsState,
		updateWorkSpaceId,
		updateCompanyDetailsState,
	};
};
