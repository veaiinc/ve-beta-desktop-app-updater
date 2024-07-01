import { useReducer, useState } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';
import * as API from '../../controllers/oldActionTypes';
import jwt_decode from 'jwt-decode';
import service from '../../services/index';

export const ProfileState = () => {
	const intialState = {
		tennantSettingsData: null,
		userDetailsData: null,
		tenantUserDetails: null,
		qrcode: null,
	};

	const [state, dispatch] = useReducer(Reducer, intialState);
	// const [state, setState] = useState(intialState);

	let usertoken = localStorage.getItem('usertoken');
	let workspaceId = localStorage.getItem('workspaceId');

	const getTenantSettings = async () => {
		try {
			const response = await service.fetchGet(`/${workspaceId}`, usertoken, 'tenant');
			if (response?.[0]) {
				dispatch({
					type: Actions.GET_TENANT_SETTINGS,
					payload: response?.[1],
				});
			} else {
				console.log('api failed getTenantSettings', response);
			}
		} catch (error) {
			console.log('error==>getTenantSettings', error);
		}
	};
	const getUserDetails = async () => {
		try {
			const userDetails = await service.fetchGet(
				API.TENANTS.myProfile,
				usertoken,
				'tenant-users',
			);
			// console.log(userDetails, 'these tensts are from the functions');
			if (userDetails?.[0]) {
				dispatch({
					type: Actions.GET_USER_DETAILS,
					payload: userDetails?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getAllUsersFromMeta', error);
		}
	};
	const getTenantUserDetails = async () => {
		let decoded = jwt_decode(usertoken);

		try {
			const responseData = await service.fetchGet(
				'/' + workspaceId + API.TENANTS.tenantUsers + '/' + decoded.user_id,
				usertoken,
				'tenant',
			);
			// console.log(responseData, 'this is the data');
			if (responseData?.[0]) {
				dispatch({
					type: Actions.GET_TENANT_USER_DETAILS,
					payload: responseData?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getAllUsersFromMeta', error);
		}
	};
	const get2FAQrCode = async () => {
		const qrCode = await service.fetchGet(
			API.TENANT_USER_LOGIN_SIGNUP_API.set2FASettings +
				API.TENANT_USER_LOGIN_SIGNUP_API.googleAuthenticator +
				API.TENANT_USER_LOGIN_SIGNUP_API.qrCode,
			usertoken,
			'tenant-users',
		);
		// console.log(qrCode, 'this is qr code');
		if (qrCode?.[0]) {
			dispatch({
				type: Actions.GET_2FA_QR_CODE,
				payload: qrCode?.[1],
			});
		} else {
			console.log('api failed qrcode');
		}
	};
	const set2FASettings = async (is2FAEnabled) => {
		let json = {
			is2FAEnabled: is2FAEnabled,
		};
		let response = await service.fetchPut(
			API.TENANT_USER_LOGIN_SIGNUP_API.set2FASettings,
			json,
			usertoken,
			'tenant-users',
		);
		// console.log(response, 'this is the response data from the settings');
	};

	return {
		...state,
		getTenantSettings,
		getUserDetails,
		getTenantUserDetails,
		get2FAQrCode,
		set2FASettings,
	};
};
