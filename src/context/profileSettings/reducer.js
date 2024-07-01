const actionHandlers = {
	GET_TENANT_SETTINGS: (state, action) => ({ ...state, tennantSettingsData: action.payload }),
	GET_USER_DETAILS: (state, action) => ({
		...state,
		userDetailsData: action.payload,
	}),
	GET_TENANT_USER_DETAILS: (state, action) => ({
		...state,
		tenantUserDetails: action.payload,
	}),
	GET_2FA_QR_CODE: (state, action) => ({
		...state,
		qrcode: action.payload,
	}),
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
