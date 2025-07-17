import { intialState } from './state';
const actionHandlers = {
	GET_TENANTS_LIST: (state, action) => ({
		...state,
		tenantsUserList: action?.payload,
	}),
	GET_TENANTS_PREFERENCES: (state, action) => ({
		...state,
		tenantPreferenceData: action?.payload,
	}),
	GET_TENANTS_SUBSCRIPTION_DETAILS: (state, action) => ({
		...state,
		tenantSubscriptionDetails: action?.payload,
	}),

	GET_CLIENT_PORTAL_PREFERENCES: (state, action) => ({
		...state,
		clientPortalPreferences: action?.payload,
	}),

	GET_AI_CREDITS_USED: (state, action) => ({
		...state,
		AICreditsData: action?.payload,
	}),

	RESET_STATE: () => ({ ...intialState }),
};
const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
