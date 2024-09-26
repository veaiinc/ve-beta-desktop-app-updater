import { intialState } from './state';
const actionHandlers = {
	GET_TENANT_SETTINGS: (state, action) => ({
		...state,
		tennantSettingsData: action.payload,
	}),
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
	SET_2FA_SETTINGS: (state, action) => ({
		...state,
		set2factorSettings: action.payload,
	}),
	GET_USER_WORKSPACE_LIST: (state, action) => ({
		...state,
		userWorkSpaceList: action.payload,
	}),
	UPDATE_LOGO: (state, action) => {
		const updatedTennantSettingsData = {
			...(state?.tennantSettingsData || {}),
			logo_s3_500w_key: action?.payload,
		};
		return {
			...state,
			tennantSettingsData: updatedTennantSettingsData,
		};
	},
	UPDATE_BUSNIESSNAME: (state, action) => ({
		...state,
		tennantSettingsData: {
			...state?.tennantSettingsData,
			businessName: action.payload,
		},
	}),

	UPDATE_COMPANY_DETAILS: (state, action) => ({
		...state,
		tennantSettingsData: {
			...state?.tennantSettingsData,
			...action.payload,
		},
	}),

	UPDATE_USER_DETAILS: (state, action) => ({
		...state,
		userDetailsData: {
			...state?.userDetailsData,
			...action.payload,
		},
	}),
	RESET_STATE: () => ({ ...intialState }),
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
