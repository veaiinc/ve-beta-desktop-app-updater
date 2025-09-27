import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';
import service from '../../services/';
import Cookies from 'js-cookie';
import { fetchDomainName } from '../../helpers';
import { NEWSLETTER_SUBSCRIPTION_URL } from '../../helpers/ConstantUrls';
import getBaseUrl from '../../services/baseUrls';
import requestPushNotificationPermission from '../../services/pushNotifications/requestPushNotificationPermission';
import generateFCMToken from '../../services/pushNotifications/generateFCMToken';
import logout from '../../helpers/logout';

export const initialState = {
	currentPlanAddOns: null,
};

export const AuthState = () => {
	const [state, dispatch] = useReducer(Reducer, initialState);

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

	const createAccountUsingEmail = async (email, locationDetails, referralCode = false) => {
		const userId = localStorage?.getItem('user_id');
		const path = userId ? '/visitor-signup' : '/signup';

		let body = referralCode
			? { email, referralCode, locationDetails }
			: { email, locationDetails };
		if (userId) {
			body = { email, userId };
		}

		try {
			const response = await service?.fetchPost(path, body, null, 'auth');
			if (response[0] === true) {
				localStorage.setItem('locationDetails', JSON.stringify(locationDetails));
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

		let permission;
		try {
			permission = await requestPushNotificationPermission();
		} catch (err) {
			return [
				false,
				{
					message:
						'An unexpected error occurred while requesting notification permission.',
				},
			];
		}
		if (permission === 'error') {
			return [false, { message: 'An unexpected error occurred. Please try again!' }];
		}

		const fcmToken = permission === 'granted' ? await generateFCMToken() : '';
		if (fcmToken) {
			localStorage.setItem('fcmToken', fcmToken);
			Cookies.set('fcmToken', fcmToken, {
				sameSite: 'lax',
				domain: fetchDomainName(),
			});
		}

		const body = emailVerified
			? fcmToken
				? { email, otp: verificationCode, fcmToken }
				: { email, otp: verificationCode }
			: { email, verificationCode };
		try {
			const response = await service?.fetchPost(path, body, null, 'auth');

			const host = fetchDomainName();

			if (response[0] === true) {
				const { tokens, accessibleWorkspaces } = response?.[1] || {};
				const { accessToken, refreshToken, accessTokenExpiry, refreshTokenExpiry } =
					tokens || {};
				const hasWorkspaces = accessibleWorkspaces?.length > 0;

				if (accessToken?.length) {
					localStorage.setItem('usertoken', accessToken);
					localStorage.setItem('refreshToken', refreshToken);
					localStorage.setItem('accessTokenExpiry', accessTokenExpiry);
					localStorage.setItem('refreshTokenExpiry', refreshTokenExpiry);
					Cookies.set('usertoken', accessToken, {
						sameSite: 'lax',
						domain: host,
					});
					Cookies.set('refreshToken', refreshToken, {
						sameSite: 'lax',
						domain: host,
					});
					Cookies.set('accessTokenExpiry', accessTokenExpiry, {
						sameSite: 'lax',
						domain: host,
					});
					Cookies.set('refreshTokenExpiry', refreshTokenExpiry, {
						sameSite: 'lax',
						domain: host,
					});
				}

				if (!hasWorkspaces) {
					localStorage.setItem('isOnboard', false);
					Cookies.set('isOnboard', false, {
						sameSite: 'Lax',
						domain: host,
					});
					return [true, { hasWorkspaces: false, isOnboard: false }];
				}

				const { isOnboard, workspaceId, region } = accessibleWorkspaces?.[0];

				localStorage.setItem('isOnboard', isOnboard);
				Cookies.set('isOnboard', isOnboard, {
					sameSite: 'Lax',
					domain: host,
				});
				if (region) {
					localStorage.setItem('region', region);
					Cookies.set('region', region, {
						sameSite: 'Lax',
						domain: host,
					});
				}
				if (hasWorkspaces)
					localStorage.setItem(
						'accessibleWorkspaces',
						JSON.stringify(accessibleWorkspaces),
					);
				Cookies.set('accessibleWorkspaces', JSON.stringify(accessibleWorkspaces), {
					sameSite: 'Lax',
					domain: host,
				});
				if (workspaceId) {
					localStorage.setItem('workspaceId', workspaceId);
					Cookies.set('workspaceId', workspaceId, {
						sameSite: 'Lax',
						domain: host,
					});
				}

				return [true, { hasWorkspaces, isOnboard, workspaceId }];
			} else {
				return [false, { message: response?.[1]?.message?.trim() }];
			}
		} catch (error) {
			console.error('Error verifying email verification code:', error);
			throw error;
		}
	};

	const updateUserDetails = async (username = '', phoneNumber = false) => {
		const firstName = username?.length ? username?.split(' ')?.[0] : '';
		const lastName = username?.length ? username?.split(' ')?.[1] : '';
		const path = '/tenant-user';
		const body = {};
		if (firstName) {
			body.firstName = firstName;
			body.lastName = lastName || '';
		}
		if (phoneNumber) body.phoneNumber = phoneNumber;

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

	const verifyMobileOtpCode = async (phoneNumber, verificationCode) => {
		const path = '/tenant-user/verify-phone-number';
		const body = {
			phoneNumber,
			verificationCode,
		};
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
			console.error('Error verifying code via phone number', error);
			throw error;
		}
	};

	const requestResendOTPToMobile = async () => {
		const path = '/tenant-user/request-phone-number-verification';
		const token = localStorage?.getItem('usertoken') || '';
		try {
			const response = await service?.fetchGet(path, token, 'auth');
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
			console.error('Error verifying code via phone number', error);
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

	const createWorkspace = async ({ workspaceHandle, workspaceType, businessName }) => {
		const path = '/tenant/create-workspace';
		const token = localStorage?.getItem('usertoken') || '';
		// const body = {
		// 	workspaceId: workspaceHandle,
		// 	businessType: profession,
		// 	category: workspaceType,
		// 	businessName,
		// };

		const body = {
			workspaceId: workspaceHandle,
			businessType: workspaceType,
			businessName: businessName,
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
						region: response?.[1]?.region,
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

	const subscribeToNewsletter = async (email) => {
		try {
			const url = NEWSLETTER_SUBSCRIPTION_URL;

			const body = {
				responseInput: {
					response: [
						{
							_id: '68624edc76c745a14dfff890',
							question: 'What is your email address?',
							answer: email,
							order: 0,
							type: 'email',
							variableId: '6311efc4911e0f82be7e2b2d',
							required: true,
							placeholder: 'Enter your email',
							isEditing: false,
							actions: [],
							conditions: [],
							validation: {
								pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
								operators: [],
							},
						},
					],
				},
			};

			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});

			const data = await response.json();

			if (response?.ok === true && response?.status === 200) {
				return [true, data];
			} else {
				return [false, { message: 'An unexpected error occurred. Please try again!' }];
			}
		} catch (error) {
			console.error('Error subscribing to email newsletter', error);
			throw error;
		}
	};

	const continueWithGoogle = async (locationDetails, referralCode = false) => {
		const encodedLocationDetails = encodeURIComponent(JSON.stringify(locationDetails));
		const encodedReferralCode = referralCode ? encodeURIComponent(referralCode) : false;
		const userId = localStorage?.getItem('user_id') ?? null;
		const path = '/google/url';

		let permission;
		try {
			permission = await requestPushNotificationPermission();
		} catch (err) {
			return [
				false,
				{
					message:
						'An unexpected error occurred while requesting notification permission.',
				},
			];
		}
		if (permission === 'error') {
			return [false, { message: 'An unexpected error occurred. Please try again!' }];
		}

		const fcmToken = permission === 'granted' ? await generateFCMToken() : '';
		if (fcmToken) {
			localStorage.setItem('fcmToken', fcmToken);
			Cookies.set('fcmToken', fcmToken, {
				sameSite: 'lax',
				domain: fetchDomainName(),
			});
		}

		let params = referralCode
			? new URLSearchParams({
					locationDetails: encodedLocationDetails,
					referralCode: encodedReferralCode,
			  })?.toString()
			: fcmToken
			? new URLSearchParams({
					locationDetails: encodedLocationDetails,
					fcmToken,
			  })?.toString()
			: new URLSearchParams({
					locationDetails: encodedLocationDetails,
			  })?.toString();

		if (userId) {
			params = new URLSearchParams({
				isVisitor: true,
				locationDetails: encodedLocationDetails,
				userId,
				fcmToken,
			})?.toString();
		}

		const type = 'auth';
		const authBaseUrl = getBaseUrl({ region: null, type });
		window.location.href = `${authBaseUrl}${path}?${params}`;
	};

	const getUsernameDetailsViaReferralCode = async (referralCode) => {
		try {
			const path = `/referral/get-referrer-details/${referralCode}`;
			const response = await service?.fetchGet(path, null, 'auth');
			if (response?.[0] === true) {
				return [true, response?.[1]];
			} else {
				return [false, { message: response?.[1]?.message?.trim() + '. Please try again!' }];
			}
		} catch (error) {
			console.error('Error getting username via referral code:', error);
			throw error;
		}
	};

	const getAddOnsForCurrentPlan = async () => {
		try {
			const token = localStorage?.getItem('usertoken') || '';
			const workspaceId = localStorage?.getItem('workspaceId') || '';
			const path = `/addon-plan/${workspaceId}/list-add-on-plans`;

			const response = await service?.fetchGet(path, token, 'auth');
			if (response?.[0] === true) {
				dispatch({
					type: Actions?.GET_ADD_ONS_FOR_CURRENT_PLAN_SUCCESS,
					payload: response?.[1],
				});
				return [true];
			} else {
				return [false, { message: response?.[1]?.message?.trim() + '. Please try again!' }];
			}
		} catch (error) {
			console.error('Error getting add-ons for current plan:', error);
			throw error;
		}
	};

	const purchaseAddOn = async (planId) => {
		try {
			const workspaceId = localStorage?.getItem('workspaceId') || '';
			const path = `/addon-plan/${workspaceId}/purchase-add-on-plan`;
			const token = localStorage?.getItem('usertoken') || '';
			const body = {
				addOnPlanId: planId,
			};

			const response = await service?.fetchPost(path, body, token, 'auth');
			if (response?.[0] === true) {
				return [true, { url: response?.[1]?.url }];
			} else {
				return [false, { message: response?.[1]?.message?.trim() + '. Please try again!' }];
			}
		} catch (error) {
			console.error('Error purchasing add-on:', error);
			throw error;
		}
	};

	const getNewAccessToken = async () => {
		try {
			const path = '/refresh-token';
			const token = localStorage.getItem('usertoken') || Cookies.get('usertoken');
			const response = await service.fetchPost(path, null, token, 'auth');
			const responseStatus = response?.[2];
			if (responseStatus === 401 || responseStatus === 403) logout();
			if (response?.[0] === true) {
				return [true, response?.[1]];
			} else {
				return [false, { message: response?.[1]?.message?.trim() + '. Please try again!' }];
			}
		} catch (error) {
			console.error('Error getting new access token:', error);
			throw error;
		}
	};

	return {
		...state,
		checkAccountExistsUsingEmail,
		createAccountUsingEmail,
		continueWithGoogle,
		verifyEmailVerificationCode,
		createWorkspace,
		checkWorkspaceHandleAvailability,
		updateUserDetails,
		getUsernameDetailsViaReferralCode,
		verifyMobileOtpCode,
		requestResendOTPToMobile,
		subscribeToNewsletter,
		getAddOnsForCurrentPlan,
		purchaseAddOn,
		getNewAccessToken,
	};
};
