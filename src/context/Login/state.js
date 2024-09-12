import * as API from './actionTypes';
import Service from '../../services/index';
import { useReducer } from 'react';
import Reducer from './reducer';
import Cookies from 'js-cookie';

export const UserLoginState = (props) => {
	const intialState = {};
	const [state, dispatch] = useReducer(Reducer, intialState);

	const verifyAccountExistsUsingEmail = async (email) => {
		let response = await Service.fetchGet(
			`${API.USERS_LOGIN.VERIFY_EMAIL_EXISTS}${email}`,
			null,
			'auth',
		);

		if (response[0]) {
			return [true, response[1]];
		} else {
			return [false, response?.[1]?.message];
		}
	};

	const createUsersAccount = async (payload) => {
		let response = await Service.fetchPost(`${API.USERS_LOGIN.SIGNUP}`, payload, null, 'auth');

		if (response[0] === true) {
			return [true, response[1]];
		} else {
			return [false, response[1]];
		}
	};

	const verifyUserEmailCode = async (payload) => {
		let response = await Service.fetchPost('/verify-signup-email', payload, null, 'auth');

		if (response[0] === true) {
			const { accessToken, region } = response?.[1];
			if (accessToken?.length) {
				localStorage.setItem('usertoken', accessToken);
				localStorage.setItem('region', region || 'ap-south-1');
				Cookies.set('usertoken', accessToken, {
					sameSite: 'lax',
					domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
				});
				Cookies.set('region', region || 'ap-south-1', {
					sameSite: 'lax',
					domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
				});
			}
			return [true, response?.[1]];
		} else {
			return [false, response?.[1]];
		}
	};

	const userLogin = async (payload) => {
		let response = await Service.fetchPost(`${API.USERS_LOGIN.LOGIN}`, payload, null, 'auth');

		if (response[0] === true) {
			const { accessToken, accessibleWorkspaces, region } = response?.[1] || {};

			if (accessToken?.length) {
				localStorage.setItem('usertoken', accessToken);
				localStorage.setItem('region', region || 'ap-south-1');
				Cookies.set('usertoken', accessToken, {
					sameSite: 'lax',
					domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
				});
				Cookies.set('region', region || 'ap-south-1', {
					sameSite: 'lax',
					domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
				});
			}
			if (!accessibleWorkspaces?.length) {
				return [true, 'createWorkspace'];
			}

			localStorage.setItem('accessibleWorkspaces', JSON.stringify(accessibleWorkspaces));
			localStorage.setItem('workspaceId', accessibleWorkspaces?.[0]);
			Cookies.set('workspaceID', accessibleWorkspaces?.[0], {
				sameSite: 'lax',
				domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
			});

			return [true];
		} else {
			if (response?.[1]?.messageCode === 'EMAIL_NOT_VERIFIED') {
				return [true, 'redirect'];
			}
			return [false, response?.[1]?.message || 'Something went wrong'];
		}
	};

	const sendEmailOtpRequest = async (payload) => {
		try {
			const response = await Service.fetchPost(
				'/email-verification-code',
				payload,
				null,
				'auth',
			);

			if (response?.[0] === true) {
				return [true];
			} else {
				console.log('api failed sendEmailOtpRequest', response);
				return [false];
			}
		} catch (error) {
			console.error('Error==>sendEmailOtpRequest', error);
		}
	};

	const verifyResetPasswordCode = async (payload) => {
		try {
			const response = await Service.fetchPost(
				'/verify-password-reset-code',
				payload,
				null,
				'auth',
			);

			if (response?.[0] === true) {
				const { accessToken } = response?.[1];
				if (accessToken?.length) {
					localStorage.setItem('usertoken', accessToken);
					Cookies.set('usertoken', accessToken, {
						sameSite: 'lax',
						domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
					});
					return [true];
				}
				return [true];
			} else {
				console.log('api failed sendEmailOtpRequest', response);
				return [false, 'Invalid Code'];
			}
		} catch (error) {
			console.error('Error==>verifyResetPasswordCode', error);
		}
	};

	const restePasswordEmailOtpRequest = async (payload) => {
		try {
			const response = await Service.fetchPost(
				'/request-password-reset-code',
				payload,
				null,
				'auth',
			);

			if (response?.[0] === true) {
				return [true];
			} else {
				console.log('api failed restePasswordEmailOtpRequest', response);
				return [false];
			}
		} catch (error) {
			console.error('Error==>restePasswordEmailOtpRequest', error);
		}
	};

	const updatePassword = async (payload) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchPost(
				'/update-password',
				payload,
				usertoken,
				'auth',
			);

			if (response?.[0] === true) {
				const { accessToken, accessibleWorkspaces, region } = response?.[1] || {};
				if (accessToken?.length) {
					localStorage.setItem('usertoken', accessToken);
					localStorage.setItem('region', region || 'ap-south-1');
					Cookies.set('usertoken', accessToken, {
						sameSite: 'lax',
						domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
					});
					Cookies.set('region', region || 'ap-south-1', {
						sameSite: 'lax',
						domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
					});
				}
				if (!accessibleWorkspaces?.length) {
					return [true, 'createWorkspace'];
				}

				localStorage.setItem('accessibleWorkspaces', JSON.stringify(accessibleWorkspaces));
				localStorage.setItem('workspaceId', accessibleWorkspaces?.[0]);
				Cookies.set('workspaceID', accessibleWorkspaces?.[0], {
					sameSite: 'lax',
					domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
				});
				return [true];
			} else {
				return [false, response?.[1]?.message || 'Something went wrong'];
			}
		} catch (error) {
			console.error('Error==>updatePassword', error);
		}
	};

	const createWorkspace = async (payload) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchPost(
				'/tenant/create-workspace',
				payload,
				usertoken,
				'auth',
			);
			if (response?.[0] === true) {
				let { workspaceId } = response?.[1];
				let accessibleWorkspaces = localStorage.getItem('accessibleWorkspaces');
				if (accessibleWorkspaces?.length) {
					accessibleWorkspaces = JSON.parse(accessibleWorkspaces);
					accessibleWorkspaces.push(workspaceId);
				} else {
					accessibleWorkspaces = [workspaceId];
				}
				localStorage.setItem('workspaceId', accessibleWorkspaces?.[0]);
				localStorage.setItem('accessibleWorkspaces', JSON.stringify(accessibleWorkspaces));
				Cookies.set('workspaceID', accessibleWorkspaces?.[0], {
					sameSite: 'lax',
					domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
				});

				return [true];
			} else {
				return [false, response?.[1]?.message || 'Something went wrong'];
			}
		} catch (error) {
			console.error('Error==>createWorkspace', error);
		}
	};

	const signUpInvitedUser = async (payload) => {
		try {
			const response = await Service.fetchPost('/signup-invited-user', payload, null, 'auth');

			if (response?.[0] === true) {
				let { accessToken, accessibleWorkspaces, region } = response?.[1] || {};
				if (accessToken?.length) {
					localStorage.setItem('usertoken', accessToken);
					localStorage.setItem('region', region || 'ap-south-1');
					Cookies.set('usertoken', accessToken, {
						sameSite: 'lax',
						domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
					});
					Cookies.set('region', region || 'ap-south-1', {
						sameSite: 'lax',
						domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
					});
				}
				if (!accessibleWorkspaces?.length) {
					return [true, 'createWorkspace'];
				}
				localStorage.setItem('accessibleWorkspaces', JSON.stringify(accessibleWorkspaces));
				localStorage.setItem('workspaceId', accessibleWorkspaces?.[0]);
				Cookies.set('workspaceID', accessibleWorkspaces?.[0], {
					sameSite: 'lax',
					domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
				});
				return [true];
			} else {
				console.log('api failed==>signUpInvitedUser', JSON.stringify(response));
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('Error==>signUpInvitedUser', error);
		}
	};

	return {
		verifyAccountExistsUsingEmail,
		createUsersAccount,
		verifyUserEmailCode,
		userLogin,
		sendEmailOtpRequest,
		verifyResetPasswordCode,
		restePasswordEmailOtpRequest,
		updatePassword,
		createWorkspace,
		signUpInvitedUser,
	};
};
