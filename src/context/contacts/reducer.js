import { intialState } from './state';

const actionHandlers = {
	SET_CLIENT_LIST: (state, action) => ({
		...state,
		clientList: action?.payload,
	}),

	UPDATE_CONTACT_CONTEXT: (state, action) => ({
		...state,
		...action?.payload,
	}),

	SET_CONTACT_METADATA: (state, action) => ({
		...state,
		clientMetadata: { ...state?.clientMetadata, ...action?.payload },
	}),

	UPDATE_CONTACT_VIEWS: (state, action) => ({
		...state,
		clientMetadata: {
			...state.clientMetadata,
			views: action?.payload,
		},
	}),

	SET_CONTACT_PREFERENCES: (state, action) => ({
		...state,
		contactPreference: action?.payload,
	}),

	DELETE_CONTACT_VIEW: (state, action) => ({
		...state,
		clientMetadata: {
			...state.clientMetadata,
			views: state.clientMetadata?.views?.filter((view) => view?._id !== action?.payload),
		},
	}),

	SET_CLIENT_LIST_FOR_TASK: (state, action) => ({
		...state,
		clientListForTask: action?.payload,
	}),

	RESET_STATE: () => intialState,
};

export const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};
