import { initialState } from './state';
const actionHandlers = {
	GET_WORKSPACE_IMAGES: (state, action) => ({ ...state, workspaceImages: action?.payload }),
	RESET_STATE: () => initialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
