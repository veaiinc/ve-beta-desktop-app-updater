import service from '../';
import Cookies from 'js-cookie';

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
							emailVerified: true,
						};
					}
				} else {
					const response = await requestEmailVerificationCode(email);
					if (response?.[0] === true) {
						return {
							ok: true,
							emailVerified: false,
						};
					} else {
						return {
							ok: false,
							message: response?.[1]?.message?.trim() + '. Please try again!',
						};
					}
				}
			} else {
			}
		} else {
			return {
				ok: false,
				message: response?.[1]?.message?.trim() + '. Please try again!',
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
			};
		} else {
			return {
				ok: false,
				message: response?.[1]?.message?.trim() + '. Please try again!',
			};
		}
	} catch (error) {
		console.error('Error creating account:', error);
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

export const getUserName = async () => {
	const path = '/my-profile';
	const token = localStorage?.getItem('usertoken') || '';

	try {
		const response = await service?.fetchGet(path, token, 'tenant_users_api');
		if (response?.[0] === true) {
			return {
				ok: true,
				username: response?.[1]?.firstName || '',
			};
		} else {
			return {
				ok: false,
				username: '',
			};
		}
	} catch (error) {
		console.error('Error getting user name:', error);
		throw error;
	}
};

export const updateUserName = async (username) => {
	const path = '/tenant-user';
	const body = { firstName: username };
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
