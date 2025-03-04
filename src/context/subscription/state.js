import service from '../../services/graphQlServices';
import { message } from 'antd';
import {} from './graphqlFunctions';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './Actions';
import Service from '../../services/index';
import { sendCustomMailMutation } from './graphqlFunctions';

export const intialState = {
	subscriptionPlans: null,
	coupons: null,
	currentPlan: null,
	referralData: null,
	shareAndEarnData: null,
	validateExpiryData: null,
	expiredSubscriptionModal: false,
	tokenExpiryData: null,
	expiredTokenModal: false,
	reFetchSubscription: false,
	renewBanner: false,
};

export const SubscriptionState = (props) => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const getAllSubscriptionPlan = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchGet(
				`/subscription/${workspaceId}/subscription-plans`,
				usertoken,
				'auth',
			);
			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_ALL_SUBSCRIPTION_PLAN_SUCCESS,
					payload: response?.[1],
				});
			} else {
				message.error('Unable to fetch subscription plans');
				console.log('api failed ==>getAllSubscriptionPlan', response);
			}
		} catch (error) {
			console.log('errror ==>getAllSubscriptionPlan', error);
		}
	};
	const getAllCoupons = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchGet(
				`/coupon/${workspaceId}/list-coupons`,
				usertoken,
				'auth',
			);
			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_ALL_COUPONS_SUCCESS,
					payload: response?.[1],
				});
			} else {
				message.error('Unable to fetch subscription plans');
				console.log('api failed ==>getAllCoupons', response);
			}
		} catch (error) {
			console.log('errror ==>getAllCoupons', error);
		}
	};

	const createStripeCheckoutSession = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchPost(
				`/subscription/${workspaceId}/create-subscription`,
				payload,
				usertoken,
				'auth',
			);
			if (response?.[0] === true) {
				return [true, response?.[1]?.url];
			} else {
				message.error('Unable to create  stripe sessions');
				console.log('api failed ==>createStripeCheckoutSession', response);
			}
		} catch (error) {
			console.log('errror ==>createStripeCheckoutSession', error);
		}
	};
	const resetSubscriptionState = async () => {
		try {
			dispatch({ type: Actions.RESET_STATE });
		} catch (error) {
			console.log('error==>resetSubscriptionState', error);
		}
	};
	const getCurrentSubscriptionPlan = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchGet(
				`/subscription/${workspaceId}/get-current-subscription-plan`,
				usertoken,
				'auth',
			);
			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_ALL_CURRENT_PLAN_SUCCESS,
					payload: response?.[1],
				});
			} else {
				message.error('Unable to fetch subscription plans');
				console.log('api failed ==>getCurrentSubscriptionPlan', response);
			}
		} catch (error) {
			console.log('errror ==>getCurrentSubscriptionPlan', error);
		}
	};
	const getShareAndEarn = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchGet(
				`/referral/${workspaceId}/get-active-referralCode`,
				usertoken,
				'auth',
			);
			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_SHARE_AND_EARN_SUCCESS,
					payload: response?.[1],
				});
				return response?.[1];
			} else {
				console.log('api failed ==>getShareAndEarn', response);
			}
		} catch (error) {
			console.log('errror ==>getShareAndEarn', error);
		}
	};
	const getReferralDetails = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchGet(
				`/referral/${workspaceId}/get-referral-details`,
				usertoken,
				'auth',
			);
			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_REFERRAL_DETAILS_SUCCESS,
					payload: response?.[1],
				});
				return response?.[1];
			}
		} catch (error) {
			console.log('errror ==>getReferralDetails', error);
		}
	};
	const getOnboardPosition = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchGet(
				`/tenant/${workspaceId}/get-isOnboard-position`,
				usertoken,
				'auth',
			);
			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_ONBOARD_POSITION_SUCCESS,
					payload: response?.[1],
				});
				return response?.[1];
			}
		} catch (error) {
			console.log('errror ==>getOnboardPosition', error);
		}
	};
	const sendCustomMailToClients = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			if (!workspaceId) {
				message.error('Workspace ID not found');
				return [false, null];
			}
			let usertoken = localStorage.getItem('usertoken');
			if (!usertoken) {
				message.error('User token not found');
				return [false, null];
			}
			const response = await service.mutation(
				sendCustomMailMutation,
				{
					clientEmail: payload.clientEmail,
					mailContent: {
						subject: payload.mailContent.subject,
						cc: payload.mailContent.cc,
						htmlBody: payload.mailContent.htmlBody,
					},
				},
				workspaceId,
				usertoken,
				'workflows_Api',
			);

			if (response?.[0] === true) {
				dispatch({
					type: Actions.SEND_CUSTOM_MAIL_SUCCESS,
					payload: response?.[1],
				});
				return [true, response?.[1]];
			} else {
				message.error('Unable to send custom mail');
				console.log('api failed ==>sendCustomMailToClients', response);
				return [false, null];
			}
		} catch (error) {
			console.log('error ==>sendCustomMailToClients', error);
			return [false, error];
		}
	};

	const createManageSubscriptionLinkforExistingUsers = async () => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await Service.fetchGet(
				`/subscription/${workspaceId}/billing`,
				usertoken,
				'auth',
			);
			if (response?.[0] === true) {
				return [true, response?.[1]?.customerPortalLink];
			} else {
				message.error('Unable to create  user stripe sessions');
				return [false];
			}
		} catch (error) {
			console.log('errror ==>createManageSubscriptionLinkforExistingUsers', error);
		}
	};

	const updateSubscriptionState = async (payload) => {
		try {
			dispatch({
				type: Actions.UPDATE_SUBSCRIPTION_STATE,
				payload,
			});
		} catch (error) {
			console.log('errror ==>updateSubscriptionState', error);
		}
	};

	const updateTokenExpiryState = async (payload) => {
		try {
			dispatch({
				type: Actions.UPDATE_TOKEN_EXPIRY_STATE,
				payload,
			});
		} catch (error) {
			console.log('errror ==>updateTokenExpiryState', error);
		}
	};

	const purchaseAddOnPlan = async (payload) => {
		const workspaceId = localStorage.getItem('workspaceId');
		const usertoken = localStorage.getItem('usertoken');
		const path = `/addon-plan/${workspaceId}/purchase-add-on-plan`;
		const type = 'auth';
		try {
			const response = await Service.fetchPost(path, payload, usertoken, type);
			if (response?.[0] === true) {
				return [true, response?.[1]];
			} else {
				message.error('Unable to purchase add on plan');
				return [false];
			}
		} catch (error) {
			console.log('errror ==>purchaseAddOnPlan', error);
		}
	};

	const purchaseSubscriptionPlan = async (payload) => {
		const workspaceId = localStorage.getItem('workspaceId');
		const usertoken = localStorage.getItem('usertoken');
		const path = `/subscription/${workspaceId}/purchase-subscription`;
		const type = 'auth';
		try {
			const response = await Service.fetchPost(path, payload, usertoken, type);
			if (response?.[0] === true) {
				return [true, response?.[1]];
			} else {
				message.error('Unable to purchase subscription plan');
				return [false];
			}
		} catch (error) {
			console.log('errror ==>purchaseSubscriptionPlan', error);
		}
	};
	const updateRenewBanner = (payload) => {
		try {
			dispatch({
				type: Actions.UPDATE_RENEW_BANNER,
				payload,
			});
		} catch (error) {
			console.log('error==>updateRenewBanner', error);
		}
	};
	const updateStateValues = async (updatedVaribaleValuesObj) => {
		try {
			dispatch({
				type: Actions.UPDATE_STATE_VALUES_SUCCESS,
				payload: updatedVaribaleValuesObj,
			});
		} catch (error) {
			console.log('error==>updateStateValues', error);
		}
	};
	return {
		...state,
		getAllSubscriptionPlan,
		resetSubscriptionState,
		getAllCoupons,
		createStripeCheckoutSession,
		getCurrentSubscriptionPlan,
		getShareAndEarn,
		getReferralDetails,
		getOnboardPosition,
		sendCustomMailToClients,
		createManageSubscriptionLinkforExistingUsers,
		updateSubscriptionState,
		updateTokenExpiryState,
		purchaseAddOnPlan,
		purchaseSubscriptionPlan,
		updateStateValues,
		updateRenewBanner,
	};
};
