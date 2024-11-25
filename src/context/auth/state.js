import { useReducer } from 'react';
import Reducer from './reducer';
import service from '../../services/';
import Cookies from 'js-cookie';
import { getLocationsDetails } from '../../helpers';
const { auth_Api: authBaseUrl } = require('../../services/config.live');

export const AuthState = () => {
	const intialState = {};
	const [state, dispatch] = useReducer(Reducer, intialState);

	const requestEmailVerificationCode = async (email) => {
		const path = '/email-verification-code';
		const body = { email };

		try {
			const response = await service?.fetchPost(path, body, null, 'auth');
			if (response[0] === true) {
				return [true];
			} else {
				return [false];
			}
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
			if (response[0] === true) {
				return [true];
			} else {
				return [false];
			}
		} catch (error) {
			console.error('Error requesting login OTP:', error);
			throw error;
		}
	};

	const checkAccountExistsUsingEmail = async (email) => {
		const path = '/account-with-email';
		const params = { email };

		try {
			const response = await service?.fetchGet(path, null, 'auth', params);
			if (!response?.[0]) {
				return [false, { message: 'An unexpected error occurred. Please try again!' }];
			}

			const accountInfo = response?.[1];
			if (!accountInfo?.isAccountExist) {
				return [true, { accountExists: false }];
			}

			if (accountInfo?.isEmailVerified) {
				const otpResponse = await requestLoginOTP(email);
				return otpResponse?.[0]
					? [true, { accountExists: true, emailVerified: true }]
					: [false, { message: 'An unexpected error occurred. Please try again!' }];
			}

			const verificationResponse = await requestEmailVerificationCode(email);
			return verificationResponse?.[0]
				? [true, { accountExists: true, emailVerified: false }]
				: [false, { message: 'An unexpected error occurred. Please try again!' }];
		} catch (error) {
			console.error('Error checking email existence:', error);
			throw error;
		}
	};

	const createAccountUsingEmail = async (email, locationDetails) => {
		const path = '/signup';
		const body = { email, locationDetails };

		try {
			const response = await service?.fetchPost(path, body, null, 'auth');
			if (response[0] === true) {
				return [
					true,
					{
						accountExists: true,
						emailVerified: false,
					},
				];
			} else {
				return [
					false,
					{
						message: 'An unexpected error occurred. Please try again!',
					},
				];
			}
		} catch (error) {
			console.error('Error creating account:', error);
			throw error;
		}
	};

	const verifyEmailVerificationCode = async (email, verificationCode, emailVerified) => {
		const path = emailVerified ? '/login-with-otp' : '/verify-signup-email';
		const body = emailVerified ? { email, otp: verificationCode } : { email, verificationCode };

		try {
			const response = await service?.fetchPost(path, body, null, 'auth');
			if (response[0] === true) {
				const { accessToken, accessibleWorkspaces, region } = response?.[1] || {};
				const hasWorkspaces = accessibleWorkspaces?.length > 0;

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
					localStorage.setItem('isOnboard', false);
					return [
						true,
						{
							hasWorkspaces: false,
							isOnboard: false,
						},
					];
				}

				const { isOnboard, workspaceId } = accessibleWorkspaces?.[0];
				if (isOnboard) localStorage.setItem('isOnboard', JSON.stringify(isOnboard));
				if (hasWorkspaces)
					localStorage.setItem(
						'accessibleWorkspaces',
						JSON.stringify(accessibleWorkspaces),
					);
				if (workspaceId) localStorage.setItem('workspaceId', workspaceId);
				Cookies.set('workspaceID', workspaceId, {
					sameSite: 'lax',
					domain: window.location.hostname === 'localhost' ? 'localhost' : 've.ai',
				});

				return [
					true,
					{
						hasWorkspaces,
						isOnboard,
						workspaceId,
					},
				];
			} else {
				return [
					false,
					{
						message: response?.[1]?.message?.trim() + '. Please try again!',
					},
				];
			}
		} catch (error) {
			console.error('Error verifying email verification code:', error);
			throw error;
		}
	};

	const checkUserSessionStatus = async () => {
		const path = '/accessible-tenants';
		const token = localStorage?.getItem('usertoken') ?? false;
		const workspaceId = localStorage?.getItem('workspaceId') ?? false;
		const locationDetails = localStorage?.getItem('locationDetails') ?? false;
		try {
			if (token?.length === 0 || token === false) {
				return [false, { sessionStatus: false }];
			}
			if (workspaceId?.length === 0 || workspaceId === false) {
				return [true, { sessionStatus: true, isOnboard: false, hasWorkspaces: false }];
			}
			const accessibleTenantsResponse = await service?.fetchGet(path, token, 'auth');
			if (accessibleTenantsResponse?.[0] === true) {
				if (!locationDetails) {
					const locationDetails = await getLocationsDetails();
					localStorage.setItem('locationDetails', JSON.stringify(locationDetails));
				}
				if (accessibleTenantsResponse?.[1]?.length === 0) {
					return [true, { sessionStatus: true, isOnboard: false, hasWorkspaces: false }];
				}
				const activeWorkspaceData = accessibleTenantsResponse?.[1]?.filter(
					(workspaceData) => workspaceData?.activeWorkspaceId === workspaceId,
				);

				return [
					true,
					{
						sessionStatus: true,
						isOnboard: activeWorkspaceData?.[0]?.isOnboard,
						hasWorkspaces: true,
					},
				];
			}

			return [true, { sessionStatus: false }];
		} catch (error) {
			console.error('Error checking user session status:', error);
			throw error;
		}
	};

	const updateUserDetails = async (username, phoneNumber = false) => {
		const firstName = username?.split(' ')[0] || '';
		const lastName = username?.split(' ')[1] || '';
		const path = '/tenant-user';
		const body = phoneNumber ? { firstName, lastName, phoneNumber } : { firstName, lastName };
		const token = localStorage?.getItem('usertoken') || '';

		try {
			const response = await service?.fetchPut(path, body, token, 'auth');
			if (response?.[0] === true) {
				return [true];
			} else {
				return [
					false,
					{
						message: response?.[1]?.message?.trim() + '. Please try again!',
					},
				];
			}
		} catch (error) {
			console.error('Error updating user name:', error);
			throw error;
		}
	};

	const checkWorkspaceHandleAvailability = async (workspaceHandle) => {
		const path = '/tenant/workspaceId-availability';
		const params = { workspaceId: workspaceHandle };

		try {
			const response = await service?.fetchGet(path, null, 'auth', params);
			if (response?.[0] === true) {
				return [
					true,
					{
						available: response?.[1]?.isAvailable,
					},
				];
			} else {
				return [
					false,
					{
						message: response?.[1]?.message?.trim() + '. Please try again!',
					},
				];
			}
		} catch (error) {
			console.error('Error checking workspace handle availability:', error);
			throw error;
		}
	};

	const createWorkspace = async (workspaceHandle, workspaceType, profession, businessName) => {
		const path = '/tenant/create-workspace';
		const token = localStorage?.getItem('usertoken') || '';
		const body = {
			workspaceId: workspaceHandle,
			businessType: profession,
			category: workspaceType,
			businessName,
		};

		try {
			const response = await service?.fetchPost(path, body, token, 'auth');
			if (response?.[0] === true) {
				localStorage.setItem('isOnboard', JSON.stringify(response?.[1]?.isOnboard));
				localStorage.setItem('workspaceId', response?.[1]?.workspaceId);
				return [
					true,
					{
						isOnboard: response?.[1]?.isOnboard,
						workspaceId: response?.[1]?.workspaceId,
					},
				];
			} else {
				return [
					false,
					{
						message: 'An unexpected error occurred. Please try again!',
					},
				];
			}
		} catch (error) {
			console.error('Error creating workspace:', error);
			throw error;
		}
	};

	const continueWithGoogle = async (locationDetails) => {
		const encodedLocationDetails = encodeURIComponent(JSON.stringify(locationDetails));
		const path = '/google/url';
		const params = new URLSearchParams({ locationDetails: encodedLocationDetails })?.toString();
		window.location.href = `${authBaseUrl}${path}?${params}`;
	};

	return {
		checkAccountExistsUsingEmail,
		createAccountUsingEmail,
		continueWithGoogle,
		verifyEmailVerificationCode,
		checkUserSessionStatus,
		createWorkspace,
		checkWorkspaceHandleAvailability,
		updateUserDetails,
	};
};
