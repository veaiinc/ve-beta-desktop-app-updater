import { intialState } from './state';

const actionHandlers = {
	GET_TENANT_GALLERIES: (state, action) => ({
		...state,
		tenantGalleries: action.payload,
	}),
	GET_TENANT_ALBUMS: (state, action) => ({
		...state,
		tenantAlbums: action.payload,
	}),
	GET_TAGS_LIST: (state, action) => ({
		...state,
		tagsList: action.payload,
	}),

	POST_TAG_LIST: (state, action) => ({
		...state,
		tagsList: { ...state.tagsList, list: [...state.tagsList.list, action.payload] },
	}),
	GET_EDIT_PREFERENCES: (state, action) => ({
		...state,
		tenantPreferences: action.payload,
	}),
	GET_LAYOUT_SETTINGS: (state, action) => ({
		...state,
		layoutSettings: action.payload,
	}),
	GET_COLLABORATORS: (state, action) => ({
		...state,
		collaborators: action.payload,
	}),
	RESET_STATE: () => ({ ...intialState }),
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
