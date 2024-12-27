import { useReducer } from 'react';
import Reducer from './reducer';
import service from '../../services/';
import Cookies from 'js-cookie';
import { fetchDomainName, getLocationsDetails } from '../../helpers';
import { message } from 'antd';
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

	const createAccountUsingEmail = async (email, locationDetails, referralCode = false) => {
		const path = '/signup';
		const body = referralCode
			? { email, locationDetails, referralCode }
			: { email, locationDetails };

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
		const body = emailVerified ? { email, otp: verificationCode } : { email, verificationCode };

		try {
			const response = await service?.fetchPost(path, body, null, 'auth');
			const host = fetchDomainName();
			if (response[0] === true) {
				const { accessToken, accessibleWorkspaces, region } = response?.[1] || {};
				const hasWorkspaces = accessibleWorkspaces?.length > 0;

				if (accessToken?.length) {
					localStorage.setItem('usertoken', accessToken);
					localStorage.setItem('region', region || 'ap-south-1');

					Cookies.set('usertoken', accessToken, {
						sameSite: 'lax',
						domain: host,
					});
					Cookies.set('region', region || 'ap-south-1', {
						sameSite: 'lax',
						domain: host,
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
					domain: host,
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

	const updateUserDetails = async (username = '', phoneNumber = false) => {
		const firstName = username?.split(' ')?.[0] || '';
		const lastName = username?.split(' ')?.[1] || '';
		const path = '/tenant-user';

		const body = {};
		if (firstName) body.firstName = firstName;
		if (lastName) body.lastName = lastName;
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

	const subscribeToNewsletter = async (email) => {
		const path = '/veai/6766b701c7f27153c1b42cbe/6766b701c7f27153c1b42cc3';
		const body = {
			responseInput: {
				response: [
					{
						_id: '668b9627f5c8218aa5db1176',
						question: '<p><strong>Your name?</strong></p>',
						order: 1,
						type: 'shortText',
						answerOptions: {
							countryCode: '',
							range: '',
							rangeIcon: '',
							opinionLabel: '',
							name: '',
							date: '',
							location: '',
							guestsCount: '',
							isMultiple: false,
							options: [],
						},
						variableId: '619f75683f381fd66dac4b65',
						answer: 'sankar',
					},
					{
						_id: '66a9d245ecf7402617574ddd',
						question: '<p><strong>Your contact number?</strong>&nbsp;</p>',
						order: 3,
						type: 'phoneNumber',
						variableId: '6311ee8f8e7c108259cf96e6',
						answer: '+919948933698',
					},
					{
						_id: '66accb967410edda114c1a05',
						question: '<p><strong>Your email?</strong></p>',
						order: 2,
						type: 'email',
						variableId: '6311efc4911e0f82be7e2b2d',
						answer: email,
					},
					{
						_id: '66accd9b7410edda114c1a06',
						question: '<p><strong>How did you hear about us?</strong></p>',
						order: 5,
						type: 'multipleChoice',
						answerOptions: {
							options: ['Instagram', 'Internet', 'Family or Friends'],
						},
						answer: '"Instagram"',
					},
					{
						_id: '66b3204d37ad62286a5cdc02',
						question: '<p><strong>Your events?</strong></p>',
						order: 4,
						type: 'events',
						answer: '[{"name":"Pellikoduku","date":""}]',
					},
				],
			},
		};

		try {
			const response = await service?.fetchPost(path, body, null, 'workflow');
			if (response?.[0] === true) {
				return [true];
			} else {
				return [false, { message: response?.[1] }];
			}
		} catch (error) {
			console.error('Error subscribing to email newsletter', error);
			throw error;
		}
	};

	const continueWithGoogle = async (locationDetails, referralCode = false) => {
		const encodedLocationDetails = encodeURIComponent(JSON.stringify(locationDetails));
		const encodedReferralCode = referralCode ? encodeURIComponent(referralCode) : false;
		const path = '/google/url';
		const params = referralCode
			? new URLSearchParams({
					locationDetails: encodedLocationDetails,
					referralCode: encodedReferralCode,
			  })?.toString()
			: new URLSearchParams({ locationDetails: encodedLocationDetails })?.toString();
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

	return {
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
	};
};
