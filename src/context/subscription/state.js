import service from '../../services/graphQlServices';
import { message } from 'antd';
import {} from './graphqlFunctions';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './Actions';
import Service from '../../services/index';

export const intialState = {
	subscriptionPlans: null,
	coupons: null,
	currentPlan: null,
	referralData: null,
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

	return {
		...state,
		getAllSubscriptionPlan,
		resetSubscriptionState,
		getAllCoupons,
		createStripeCheckoutSession,
		getCurrentSubscriptionPlan,
		getShareAndEarn,
	};
};
