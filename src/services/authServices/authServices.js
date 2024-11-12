import service from '../';
import Cookies from 'js-cookie';
const { auth_Api: authBaseUrl } = require('../config');

const requestEmailVerificationCode = async (email) => {
	const path = '/email-verification-code';
	const body = { email };

	try {
		const response = await service?.fetchPost(path, body, null, 'auth');
		return response;
	} catch (error) {
		console.error('Error requesting email verification code:', error);
		throw error;
	}
};

const requestLoginOTP = async (email) => {
	const path = '/request-login-otp';
	const body = { email };

	try {
		const response = await service?.fetchPost(path, body, null, 'auth');
		return response;
	} catch (error) {
		console.error('Error requesting login OTP:', error);
		throw error;
	}
};

export const checkAccountExistsUsingEmail = async (email) => {
	const path = '/account-with-email';
	const params = { email };

	try {
		const response = await service?.fetchGet(path, null, 'auth', params);
		if (response[0] === true) {
			if (response?.[1]?.isAccountExist) {
				if (response?.[1]?.isEmailVerified) {
					const response = await requestLoginOTP(email);
					if (response?.[0] === true) {
						return {
							ok: true,
							accountExists: true,
							emailVerified: true,
						};
					}
				} else {
					const response = await requestEmailVerificationCode(email);
					if (response?.[0] === true) {
						return {
							ok: true,
							accountExists: true,
							emailVerified: false,
						};
					} else {
						return {
							ok: false,
							message: 'An unexpected error occurred. Please try again!',
						};
					}
				}
			} else {
				return {
					ok: true,
					accountExists: false,
				};
			}
		} else {
			return {
				ok: false,
				message: 'An unexpected error occurred. Please try again!',
			};
		}
	} catch (error) {
		console.error('Error checking email existence:', error);
		throw error;
	}
};

export const createAccountUsingEmail = async (email, locationDetails) => {
	const path = '/signup';
	const body = { email, locationDetails };

	try {
		const response = await service?.fetchPost(path, body, null, 'auth');
		if (response[0] === true) {
			const { accessToken, region } = response?.[1];
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
			return {
				ok: true,
				accountExists: true,
				emailVerified: false,
			};
		} else {
			return {
				ok: false,
				message: 'An unexpected error occurred. Please try again!',
			};
		}
	} catch (error) {
		console.error('Error creating account:', error);
		throw error;
	}
};

export const createAccountViaInvite = async (firstName, email, workspaceId, locationDetails) => {
	const path = '/signup-invited-user';
	const body = { email, firstName, workspaceId, locationDetails };

	try {
		const response = await service?.fetchPost(path, body, null, 'auth');
		console.log('response', response);
		if (response?.[0] === true) {
			const { accessToken, region } = response?.[1];
			localStorage.setItem('usertoken', accessToken);
			localStorage.setItem('workspaceId', workspaceId);
			localStorage.setItem('region', region || 'ap-south-1');
			localStorage.setItem(
				'isOnboard',
				response?.[1]?.accessibleWorkspaces?.[0]?.isOnboard?.toString(),
			);
			localStorage.setItem(
				'accessibleWorkspaces',
				JSON.stringify(response?.[1]?.accessibleWorkspaces),
			);
			localStorage.setItem('locationDetails', JSON.stringify(locationDetails));
			Cookies.set('usertoken', accessToken, {
				sameSite: 'lax',
				domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
			});
			Cookies.set('region', region || 'ap-south-1', {
				sameSite: 'lax',
				domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
			});
			return {
				ok: true,
			};
		} else {
			return {
				ok: false,
				message: response?.[1]?.message?.trim() + '. Please try again!',
			};
		}
	} catch (error) {
		console.error('Error creating account via invite:', error);
		throw error;
	}
};

export const verifyEmailVerificationCode = async (email, verificationCode, emailVerified) => {
	const path = emailVerified ? '/login-with-otp' : '/verify-signup-email';
	const body = emailVerified ? { email, otp: verificationCode } : { email, verificationCode };

	try {
		const response = await service?.fetchPost(path, body, null, 'auth');
		const hasWorkspaces = response?.[1]?.accessibleWorkspaces?.length > 0;
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

			if (!hasWorkspaces) {
				return {
					ok: true,
					hasWorkspaces: false,
				};
			}

			const { isOnboard, workspaceId } = accessibleWorkspaces?.[0];
			localStorage.setItem('isOnboard', isOnboard);
			localStorage.setItem('accessibleWorkspaces', JSON.stringify(accessibleWorkspaces));
			localStorage.setItem('workspaceId', workspaceId);
			Cookies.set('workspaceID', workspaceId, {
				sameSite: 'lax',
				domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
			});

			return {
				ok: true,
				hasWorkspaces,
				isOnboard,
			};
		} else {
			return {
				ok: false,
				message: response?.[1]?.message?.trim() + '. Please try again!',
			};
		}
	} catch (error) {
		console.error('Error verifying email verification code:', error);
		throw error;
	}
};

export const checkUserSessionStatus = async () => {
	const path = '/accessible-tenants';
	const token = localStorage?.getItem('usertoken') || false;

	try {
		if (!token) {
			return {
				ok: false,
				tokenValid: false,
			};
		}
		const response = await service?.fetchGet(path, token, 'auth');
		if (response?.[0] === true) {
			if (!response?.[1]?.length) {
				return {
					ok: true,
					isOnboard: false,
					tokenValid: true,
				};
			} else {
				const { isOnboard, workspaceIds } = response?.[1]?.[0];
				return {
					ok: true,
					isOnboard,
					tokenValid: true,
					workspaceIds,
				};
			}
		} else {
			return {
				ok: false,
				message: response?.[1]?.message?.trim() + '. Please try again!',
				tokenValid: false,
			};
		}
	} catch (error) {
		console.error('Error checking user session status:', error);
		throw error;
	}
};

export const updateUserDetails = async (firstName, phoneNumber = false) => {
	const path = '/tenant-user';
	const body = phoneNumber ? { firstName, phoneNumber } : { firstName };
	const token = localStorage?.getItem('usertoken') || '';

	try {
		const response = await service?.fetchPut(path, body, token, 'auth');
		if (response?.[0] === true) {
			return {
				ok: true,
			};
		} else {
			return {
				ok: false,
				message: response?.[1]?.message?.trim() + '. Please try again!',
			};
		}
	} catch (error) {
		console.error('Error updating user name:', error);
		throw error;
	}
};

export const checkWorkspaceHandleAvailability = async (workspaceHandle) => {
	const path = '/tenant/workspaceId-availability';
	const params = { workspaceId: workspaceHandle };

	try {
		const response = await service?.fetchGet(path, null, 'auth', params);
		if (response?.[0] === true) {
			return {
				ok: true,
				available: response?.[1]?.isAvailable,
			};
		} else {
			return {
				ok: false,
				message: response?.[1]?.message?.trim() + '. Please try again!',
			};
		}
	} catch (error) {
		console.error('Error checking workspace handle availability:', error);
		throw error;
	}
};

export const createWorkspace = async (workspaceHandle, workspaceType, profession) => {
	const path = '/tenant/create-workspace';
	const token = localStorage?.getItem('usertoken') || '';
	const body = {
		workspaceId: workspaceHandle,
		businessType: profession,
		category: workspaceType,
	};

	try {
		const response = await service?.fetchPost(path, body, token, 'auth');
		if (response?.[0] === true) {
			return {
				ok: true,
				isOnboard: response?.[1]?.isOnboard,
			};
		} else {
			return {
				ok: false,
				message: response?.[1]?.message?.trim() + '. Please try again!',
			};
		}
	} catch (error) {
		console.error('Error creating workspace:', error);
		throw error;
	}
};

export const createUsersAccount = async (payload) => {
	const path = '/signup';
	try {
		let response = await service?.fetchPost(path, payload, null, 'auth');
		if (response[0] === true) {
			return [true, response[1]];
		} else {
			return [false, response[1]];
		}
	} catch (error) {
		console.log('error creating user account', error);
	}
};

export const signUpInvitedUser = async (payload) => {
	try {
		const response = await service?.fetchPost('/signup-invited-user', payload, null, 'auth');
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
			localStorage.setItem('workspaceId', accessibleWorkspaces?.[0]?.workspaceId);
			localStorage.setItem('isOnboard', accessibleWorkspaces?.[0]?.isOnboard);
			Cookies.set('workspaceID', accessibleWorkspaces?.[0]?.workspaceId, {
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

export const continueWithGoogle = async (locationDetails) => {
	const encodedLocationDetails = encodeURIComponent(JSON.stringify(locationDetails));
	const path = '/google/url';
	const params = new URLSearchParams({ locationDetails: encodedLocationDetails })?.toString();
	window.location.href = `${authBaseUrl}${path}?${params}`;
};
