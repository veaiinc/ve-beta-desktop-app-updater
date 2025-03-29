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
	defaultNotificationSettings: null,
	tenantUserAccessControls: null,
	accessControlOpenModal: false,
	userLogo: null,
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
				'/tenant-user/my-profile',
				usertoken,
				'auth',
			);

			if (userDetails?.[0]) {
				dispatch({
					type: Actions.GET_USER_DETAILS,
					payload: userDetails?.[1],
				});
				return [true];
			}
			const statusCode = userDetails?.[1]?.code;
			return [false, { statusCode }];
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
			let response = await service.fetchPut(
				'/tenant-user', // API.TENANTS.myProfile,
				payload,
				usertoken,
				'auth',
			);

			if (response?.[0]) {
				return [true, response[1]];
			} else {
				return [false];
			}
		} catch (error) {
			console.log('error==>updateUserDetails', error);
		}
	};

	// added api
	const updateUserPhoneNumber = async (payload) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			// let decoded = jwt_decode(usertoken);
			let response = await service.fetchPut('/tenant-user', payload, usertoken, 'auth');

			if (response?.[0]) {
				return [true, response[1]];
			} else {
				return [false, response[1]];
			}
		} catch (error) {
			console.log('error==>updateUserPhoneNumber', error);
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

	const getUserLogo = async () => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.fetchGet(
				API.TENANTS.getTenantUserLogo,
				usertoken,
				'tenant-users',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.GET_USER_LOGO,
					payload: response?.[1]?.dp_s3_500w_key,
				});
			}
		} catch (error) {
			console.log('error==>getUserLogo', error);
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
				const resp = await axios.put(response[1]?.signedUrl, file, options);
				const success = resp?.status === 200;
				if (success) {
					return [true];
				} else {
					return [false, resp?.data];
				}
			}
		} catch (error) {
			console.log('error==>updateUserLogo', error);
		}
	};

	const updateWorkSpaceId = async (json) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');

			const response = await service.fetchPut(
				'/tenant/' + workspaceId + '/add-workspaceId ',
				json,
				usertoken,
				'auth',
			);

			if (response?.[0]) {
				return [true, response[1]];
			} else {
				return [false, response[1]];
			}
		} catch (error) {
			console.log('error==>updateWorkSpaceId', error);
		}
	};

	const updateCompanyDetailsState = (payload) => {
		try {
			dispatch({
				type: Actions.UPDATE_COMPANY_DETAILS,
				payload,
			});
		} catch (error) {
			console.log('error==>updateCompanyDetailsState', error);
		}
	};

	const updateUserDetailsState = (payload) => {
		try {
			dispatch({
				type: Actions.UPDATE_USER_DETAILS,
				payload,
			});
		} catch (error) {
			console.log('error==>updateUserDetailsState', error);
		}
	};

	const getDefaultNotificationSettings = async (tenantId) => {
		try {
			const token = localStorage.getItem('usertoken');
			const path = '/defaultNotificationSettings';
			const type = 'tenant-users';
			const body = {
				tenantId,
			};
			const response = await service?.fetchPost(path, body, token, type);
			if (response?.[0]) {
				dispatch({
					type: Actions?.GET_DEFAULT_NOTIFICATION_SETTINGS,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getDefaultNotificationSettings', error);
		}
	};

	const updateModuleAppTypeSelectAll = async (module, appType, isEnabled, tenantId) => {
		try {
			const token = localStorage.getItem('usertoken');
			const path = '/updateMultipleActions';
			const type = 'tenant-users';
			const body = {
				module,
				app: appType,
				isEnabled,
				tenantId,
			};
			const response = await service?.fetchPut(path, body, token, type);
			if (response?.[0]) {
				return [true];
			} else {
				return [false];
			}
		} catch (error) {
			console.log('error==>updateModuleAppTypeSelectAll', error);
		}
	};

	const updateNotificationMethod = async (tenantId, app, isEnabled) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			const path = '/notificationMethods';
			const type = 'tenant-users';
			const payload = {
				app, // email, slack, whatsapp
				tenantId,
				isEnabled,
			};
			const response = await service?.fetchPut(path, payload, usertoken, type);
			if (response?.[0]) {
				return [true];
			} else {
				return [false];
			}
		} catch (error) {
			console.log('error==>updateNotificationMethod', error);
		}
	};

	const updateAppNotificationPreferenceForModule = async (
		module,
		action,
		app,
		isEnabled,
		tenantId,
	) => {
		try {
			const token = localStorage.getItem('usertoken');
			const path = '/notificationPreferences';
			const type = 'tenant-users';
			const body = {
				module,
				action,
				app,
				isEnabled,
				tenantId,
			};
			const response = await service?.fetchPut(path, body, token, type);
			if (response?.[0] === true && response?.[1]?.code !== 500) {
				return [true];
			} else {
				return [false];
			}
		} catch (error) {
			console.log('error==>updateAppNotificationPreferenceForModule', error);
		}
	};

	const updateAccessControlOpenModal = (payload) => {
		try {
			dispatch({
				type: Actions.UPDATE_ACCESS_CONTROL_OPEN_MODAL,
				payload,
			});
		} catch (error) {
			console.log('error==>updateAccessControlOpenModal', error);
		}
	};
	const resetProfileSettingsState = async () => {
		dispatch({ type: Actions.RESET_STATE });
	};

	const updateProfileState = async (payload) => {
		dispatch({ type: Actions.UPDATE_PROFILE_STATE, payload: payload });
	};

	// https://us.api.ve.ai/auth/dev/tenant/:workspaceId/tenant-user-access-control/:tenantUser_id
	const getTenantUserAccessControls = async () => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			let decoded = jwt_decode(usertoken);
			const response = await service.fetchGet(
				`/tenant/${workspaceId}/tenant-user-access-control/${decoded.user_id}`,
				usertoken,
				'auth',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.GET_TENANT_USER_ACCESS_CONTROLS,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getTenantUserAccessControls', error);
		}
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
		getUserLogo,
		updateUserLogo,
		resetProfileSettingsState,
		updateWorkSpaceId,
		updateCompanyDetailsState,
		updateUserDetailsState,
		updateProfileState,
		getDefaultNotificationSettings,
		updateNotificationMethod,
		updateAppNotificationPreferenceForModule,
		getTenantUserAccessControls,
		updateAccessControlOpenModal,
		updateModuleAppTypeSelectAll,
	};
};
