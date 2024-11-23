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
	RESET_STATE: () => intialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
