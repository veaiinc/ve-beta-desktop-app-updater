import { initialState } from './state';
const actionHandlers = {
	SET_WORKSPACE_IMAGES: (state, action) => ({ ...state, workspaceImagesData: action?.payload }),
	SET_UNSPLASH_IMAGES: (state, action) => ({ ...state, unsplashImagesData: action?.payload }),
	RESET_STATE: () => initialState,
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
