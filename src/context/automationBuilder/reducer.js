import { initialState } from './state';

const actionHandlers = {
	SET_AUTOMATION: (state, action) => ({
		...state,
		specificAutomationInfo: action.payload,
	}),

	UPDATE_STATE_VALUES: (state, action) => ({
		...state,
		...action.payload,
	}),

	SET_CONNECTION_DETAILS: (state, action) => ({
		...state,
		connectedIntegrations: action.payload,
	}),

	UPDATE_AUTOMATION: (state, action) => ({
		...state,
		specificAutomationInfo: action.payload,
	}),

	SET_EXECUTION_HISTORY: (state, action) => ({
		...state,
		executionHistory: action.payload,
	}),

	RESET_STATE: () => initialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
