import { initialState } from './state';

const actionHandlers = {
	SET_NOTE_CONTENT: (state, action) => ({
		...state,
		noteContent: action.payload,
	}),

	SET_DOCUMENT_PREVIEW_IDS: (state, action) => ({
		...state,
		documentPreviewIds: action.payload,
	}),
	RESET_STATE: () => initialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
