import { intialState } from './state';
const actionHandlers = {
	GET_ALL_SUBSCRIPTION_PLAN_SUCCESS: (state, action) => ({
		...state,
		subscriptionPlans: action.payload,
	}),
	GET_ALL_COUPONS_SUCCESS: (state, action) => ({
		...state,
		coupons: action.payload,
	}),
	GET_ALL_CURRENT_PLAN_SUCCESS: (state, action) => ({
		...state,
		currentPlan: action.payload,
	}),
	GET_SHARE_AND_EARN_SUCCESS: (state, action) => ({
		...state,
		referralData: action?.payload,
	}),
	GET_REFERRAL_DETAILS_SUCCESS: (state, action) => ({
		...state,
		referralDetails: action.payload,
	}),
	GET_ONBOARD_POSITION_SUCCESS: (state, action) => ({
		...state,
		onboardPosition: action.payload,
	}),
	// ... existing handlers ...
	SEND_CUSTOM_MAIL_SUCCESS: (state, action) => ({
		...state,
		mailSendStatus: action.payload,
	}),

	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
