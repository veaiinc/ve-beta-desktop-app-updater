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
		tagsList: action.payload,
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

	GET_IMAGE_DUPLICATES: (state, action) => ({
		...state,
		imageDuplicatesList: action.payload,
	}),
	GET_WATERMARKS_LIST: (state, action) => ({
		...state,
		waterMarks: action.payload,
	}),
	UPDATE_ALBUM_STATE: (state, action) => ({
		...state,
		updateActiveAlbum: action.payload,
	}),
	GET_GALLERY_CREDENTIALS: (state, action) => ({
		...state,
		galleryCredentials: action.payload,
	}),
	GET_ALBUM_DETAILS: (state, action) => ({
		...state,
		albumDetails: action.payload,
	}),
	GET_IMAGES_LIST: (state, action) => ({
		...state,
		imagesList: action.payload,
	}),
	GET_LIGHTROOM_COPY_LIST: (state, action) => ({
		...state,
		lightroomCopyList: action.payload,
	}),
	GET_VISITOR_FORM_ACCESS: (state, action) => ({
		...state,
		visitorFormAccess: action.payload,
	}),
	GET_IMAGE_DETAIL: (state, action) => ({
		...state,
		imageDetail: action.payload,
	}),
	GET_GALLERY_GUEST_ACCESS: (state, action) => ({
		...state,
		galleryGuestAccess: action.payload,
	}),
	GET_ALBUM_IMAGES_COUNT: (state, action) => ({
		...state,
		albumImagesCount: action.payload,
	}),
	GET_CLIENT_SELECTIONS: (state, action) => ({
		...state,
		clientSelectionsData: action.payload,
	}),
	GET_CLIENT_SELECTION_IMAGES: (state, action) => ({
		...state,
		clientSelectionImages: action.payload,
	}),
	GET_GALLERY_SHARE_DETAILS: (state, action) => ({
		...state,
		galleryShareDetails: action.payload,
	}),
	GET_AI_FACE: (state, action) => ({
		...state,
		aiFace: action.payload,
	}),
	RESET_IMAGES_LIST: (state) => ({ ...state, imagesList: null }),
	RESET_STATE: () => ({ ...intialState }),
};

const Reducer = (state, action) => {
	const handler = actionHandlers[action.type];
	return handler ? handler(state, action) : state;
};

export default Reducer;
