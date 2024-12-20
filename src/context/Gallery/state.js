import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './action';
import * as API from './actionTypes';
import jwt_decode from 'jwt-decode';
import service from '../../services/index';
import axios from 'axios';

export const intialState = {
	tenantGalleries: null,
	tenantAlbums: null,
	tagsList: null,
	tenantPreferences: null,
	layoutSettings: null,
	imageDuplicatesList: null,
	waterMarks: null,
	collaborators: null,
	updateActiveAlbum: null,
	galleryCredentials: null,
	albumDetails: null,
	imagesList: null,
	lightroomCopyList: null,
	visitorFormAccess: null,
	imageDetail: null,
	galleryGuestAccess: null,
	albumImagesCount: null,
	clientSelectionsData: null,
	clientSelectionImages: null,
	galleryShareDetails: null,
	aiFace: null,
	aiFaceImages: null,
	insightsVisitors: null,
	downloadImages: null,
	preRegisteredUsers: null,
};

export const Galleries = () => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const getGalleries = async (queryParams = {}, reset = false) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			let decoded = jwt_decode(usertoken);
			const userId = decoded.user_id;
			const params = {
				user_id: userId,
				detailed: false,
				sort: '-createdAt',
				page: 1,
				limit: 15,
				...queryParams,
			};

			if (reset) {
				dispatch({
					type: Actions.GET_TENANT_GALLERIES,
					payload: null,
				});
			}

			const queryString = new URLSearchParams(params).toString();
			const response = await service.fetchGet(
				`/${workspaceId}${API.GALLERY.galleries}?${queryString}`,
				usertoken,
				'galleries',
			);

			if (response?.[0] === true) {
				const data = state?.tenantGalleries
					? {
							...state?.tenantGalleries,
							...response?.[1],
							galleries: [
								...state?.tenantGalleries?.galleries,
								...response?.[1]?.galleries,
							],
					  }
					: response?.[1];
				dispatch({
					type: Actions.GET_TENANT_GALLERIES,
					payload: reset ? response?.[1] : data,
				});
			} else {
				dispatch({
					type: Actions.GET_TENANT_GALLERIES,
					payload: {
						galleries: [],
						totalPages: 0,
						totalDocs: 0,
						limit: 0,
						currentPage: 1,
						hasPrevPage: false,
						hasNextPage: false,
						prevPage: null,
						nextPage: null,
					},
				});
				return response;
			}
		} catch (error) {
			console.log('error==>getGalleries', error);
		}
	};
	const createNewGallery = async (payload) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPost(
				`/${workspaceId}${API.GALLERY.galleries}`,
				payload,
				usertoken,
				'galleries',
			);

			return response;
		} catch (error) {
			console.log('error==>createNewGallery', error);
		}
	};

	const createNewAlbum = async (payload, galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPost(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}/albums`,
				payload,
				usertoken,
				'galleries',
			);
			if (response?.[0]) {
				getAlbums(galleryId);
				getAlbumImagesCount(galleryId);
			}
		} catch (error) {
			console.log('error==>createNewAlbum', error);
		}
	};

	const getAlbums = async (galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}/basic-details`,
				usertoken,
				'galleries',
			);
			if (response?.[0] === true) {
				const sortedAlbums = response?.[1]?.albums?.sort(
					(a, b) => a.customSortIndex - b.customSortIndex,
				);
				dispatch({
					type: Actions.GET_TENANT_ALBUMS,
					payload: { ...response?.[1], albums: sortedAlbums },
				});
			} else {
				return response;
			}
		} catch (error) {
			console.log('error==>getAlbums', error);
		}
	};

	const getGallery = async (galleryId) => {
		// {{gallery-base-url}}/{{workspaceId}}/galleries/{{galleryId}}
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}`,
				usertoken,
				'galleries',
			);
		} catch (error) {
			console.log('error==>getGallery', error);
		}
	};
	const postGallery = async (payload, galleryId) => {
		// {{gallery-base-url}}/{{workspaceId}}/galleries/{{galleryId}}
		// {
		//     "category": "wedding",
		//     "title":"my dcj galdfdfdfdry"
		// }
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}`,
				payload,
				usertoken,
				'galleries',
			);
			if (response?.[0]) {
				getAlbumImagesCount(galleryId);
				return [true, response[1]];
			}
		} catch (error) {
			console.log('error==>getGallery', error);
			return [false, { message: 'Failed to update gallery status' }];
		}
	};

	const getGalleryData = async (galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.getGallery(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}/details`,
				usertoken,
				'galleries',
			);
		} catch (error) {
			console.log('error==>getGalleryData', error);
		}
	};

	const getGalleryTagsList = async (galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}${API.GALLERY.tags}`,
				usertoken,
				'galleries',
			);

			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_TAGS_LIST,
					payload: { galleryId, list: response?.[1] },
				});
			}

			return response;
		} catch (error) {
			console.log('error==>getGalleryTagsList', error);
		}
	};

	const addGalleryTag = async (payload, galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPost(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}${API.GALLERY.tags}`,
				payload,
				usertoken,
				'galleries',
			);

			const payloadData = state?.tagsList
				? { ...state.tagsList, galleryId, list: [...state?.tagsList?.list, response?.[1]] }
				: { galleryId, list: response?.[1] };

			if (response?.[0] === true) {
				dispatch({
					type: Actions.POST_TAG_LIST,
					payload: payloadData,
				});
			}

			return response;
		} catch (error) {
			console.log('error==>addGalleryTag', error);
		}
	};

	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/
	// {{gallery-base-url}}/{{workspaceId}}/galleries/{{galleryId}}/basic-details   ---> get gallery
	// already in the getAlbums
	const basicAlbumDetails = async (galleryId, albumSlug) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.getGallery(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}/albums/${albumSlug}`,
				usertoken,
				'galleries',
			);
		} catch (error) {
			console.log('error==>basicGalleryDetails', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/preferences. edit perrance put

	const getEditPreferences = async (galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}/preferences`,
				usertoken,
				'galleries',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.GET_EDIT_PREFERENCES,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>geteditPreferences', error);
		}
	};
	const editPreferences = async (galleryId, payload) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}/preferences`,
				payload,
				usertoken,
				'galleries',
			);
		} catch (error) {
			console.log('error==>editPreferences', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/details
	const getAlbumCount = async (galleryId, albumSlug) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumSlug}`,
				usertoken,
				'galleries',
			);
			if (response[0]) {
				dispatch({
					type: Actions.GET_ALBUM_DETAILS,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getAlbumCount', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/layout-settings
	const getLayoutSettings = async (galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/layout-settings`,
				usertoken,
				'galleries',
			);
			if (response[0]) {
				dispatch({
					type: Actions.GET_LAYOUT_SETTINGS,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getLayoutSettings', error);
		}
	};
	const putLayoutSettings = async (payload, galleryId, type = null) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const json = type === 'theme' ? payload : { layoutSettings: { ...payload } };

			const response = await service.fetchPut(
				`/${workspaceId}/galleries/${galleryId}/layout-settings`,
				json,
				usertoken,
				'galleries',
			);
			if (response[0]) {
				dispatch({
					type: Actions.GET_LAYOUT_SETTINGS,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getLayoutSettings', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/tenant-users
	const getCollaborators = async (galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/tenant-users`,
				usertoken,
				'galleries',
			);
			if (response[0]) {
				dispatch({
					type: Actions.GET_COLLABORATORS,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getLayoutSettings', error);
		}
	};
	const postCollaborators = async (payload, galleryId) => {
		// {
		//     "_id": "66ecfc69a27061c8cd3e66ca",
		//     "role": [

		//         "collaborator"
		//     ],
		//     "canDownload": false
		// }
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPost(
				`/${workspaceId}/galleries/${galleryId}/tenant-users`,
				payload,
				usertoken,
				'galleries',
			);
		} catch (error) {
			console.log('error==>getLayoutSettings', error);
		}
	};
	const updateCollaborators = async (payload, galleryId, tenant_user_id) => {
		// {
		//     "canDownload": false
		// }
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}/galleries/${galleryId}/tenant-users/${tenant_user_id}`,
				payload,
				usertoken,
				'galleries',
			);
		} catch (error) {
			console.log('error==>getLayoutSettings', error);
		}
	};
	const deleteCollaborators = async (galleryId, tenant_user_id) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchDelete(
				`/${workspaceId}/galleries/${galleryId}/tenant-users/${tenant_user_id}`,
				usertoken,
				null,
				'galleries',
			);
		} catch (error) {
			console.log('error==>getLayoutSettings', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}

	const editAlbum = async (payload, galleryId, albumID) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumID}`,
				payload,
				usertoken,
				'galleries',
			);
			if (response[0]) {
				getAlbums(galleryId);
			}
		} catch (error) {
			console.log('error==>getLayoutSettings', error);
		}
	};

	const editAlbumName = async (payload, galleryId, albumID) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumID}`,
				payload,
				usertoken,
				'galleries',
			);
			if (response[0]) {
				getAlbums(galleryId);
				return [true, response[1]];
			}
		} catch (error) {
			console.log('error==>getLayoutSettings', error);
		}
	};
	// /{{galleryId}}/album-slug-availability/{{slug}}
	const checkAlbumSlugIsAvalible = async (galleryId, slugName) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			// const updatedSlugName = slugName.replace(/\s+/g, '');
			// console.log(updatedSlugName, 'updatedSlugName');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/album-slug-availability/${slugName}`,
				usertoken,
				'galleries',
			);
			return response;
		} catch (error) {
			console.log('error==>checkAlbumSlugIsAvalible', error);
		}
	};
	const editLockAlbum = async (payload, galleryId, albumID) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumID}/guest-access`,
				payload,
				usertoken,
				'galleries',
			);
		} catch (error) {
			console.log('error==>getLayoutSettings', error);
		}
	};

	const resetGallleryState = async () => {
		dispatch({ type: Actions.RESET_STATE });
	};

	const getUploadImageSignUrl = async (galleryId, albumId, payload) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPost(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}${API.GALLERY.albums}/${albumId}${API.GALLERY.images}`,
				payload,
				usertoken,
				'galleries',
			);

			return response;
		} catch (error) {
			console.log('error==>updateUserLogo', error);
		}
	};

	const getImageUploadStatus = async (galleryId, albumId, batchId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}${API.GALLERY.albums}/${albumId}${API.GALLERY.imageUploadStatus}?uploadBatchId=${batchId}`,
				usertoken,
				'galleries',
			);

			return response;
		} catch (error) {
			console.log('error==>getTags', error);
		}
	};

	const getImageDuplicatesList = async (galleryId, albumId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}${API.GALLERY.albums}/${albumId}${API.GALLERY.checkImageDuplicates}`,
				usertoken,
				'galleries',
			);
			if (response[0] === true) {
				dispatch({
					type: Actions.GET_IMAGE_DUPLICATES,
					payload: { galleryId, albumId, list: response?.[1] },
				});
			}

			return response;
		} catch (error) {
			console.log('error==>getImageDuplicatesList', error);
		}
	};

	const getWaterMarks = async () => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}${API.GALLERY.watermarks}`,
				usertoken,
				'tenant',
			);
			if (response[0] === true) {
				dispatch({
					type: Actions.GET_WATERMARKS_LIST,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getWaterMarks', error);
		}
	};
	const updatedAlbum = (value) => {
		console.log(value, 'activeUpdateAlbumfromFunction');
		dispatch({
			type: Actions.UPDATE_ALBUM_STATE,
			payload: value,
		});
	};
	const uploadWaterMark = async (file) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPost(
				`/${workspaceId}${API.GALLERY.watermarks}`,
				null,
				usertoken,
				'tenant',
			);
			if (response[0]) {
				const responseUrl = await axios.put(response[1]?.signedUrl, file, {
					headers: {
						'Content-Type': file.type,
					},
				});

				if (responseUrl.status === 200) {
					return [true];
				} else {
					return [false];
				}
			}
		} catch (error) {
			console.log('error==>uploadWaterMark', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/tags/{{ _.tag_id }}/images  ==> to get the images

	const getGalleryCredentials = async (galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/content-distribution/get-credentials/${galleryId}`,
				usertoken,
				'galleries',
			);
			if (response[0]) {
				dispatch({
					type: Actions.GET_GALLERY_CREDENTIALS,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getGalleryCredentials', error);
		}
	};
	// `// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/tags/{{ _.tag_id }}/images  ==> to get the images`;
	const getGalleryImages = async (
		galleryId,
		albumId,
		tagId,
		page = 1,
		limit = 20,
		displayName = '',
		reset = false,
	) => {
		try {
			// if (reset) {
			// 	dispatch({
			// 		type: Actions.RESET_IMAGES_LIST,
			// 	});
			// }

			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumId}/tags/${tagId}/images?page=${page}&limit=${limit}&displayName=${displayName}`,
				usertoken,
				'galleries',
			);

			const payload = state.imagesList
				? {
						...state.imagesList,
						...response?.[1],
						docs: [...state.imagesList.docs, ...(response?.[1]?.docs || [])],
				  }
				: response?.[1];
			if (response[0] === true) {
				dispatch({
					type: Actions.GET_IMAGES_LIST,
					payload: reset ? response?.[1] : payload,
				});
			}
		} catch (error) {
			console.log('error==>getGalleryImages', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/cover-image
	// {
	// 	"image_id": "671f4cbb7387c4027511d4a8",
	// 	"xPosition": 30,
	// 	"yPosition": 4.999482990383619,
	// 	"givenFileName": "66ab2a42dc8cb6e520a5d7cc_1722493506126.jpg",
	// 	"width": 100,
	// 	"height": 100
	// }
	const setAlbumCoverImage = async (payload, galleryId, albumId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumId}/cover-image`,
				payload,
				usertoken,
				'galleries',
			);
		} catch (error) {
			console.log('error==>setAlbumCoverImage', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/image-file-names
	const getLightroomCopyList = async (galleryId, albumId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumId}/image-file-names`,
				usertoken,
				'galleries',
			);
			if (response[0]) {
				dispatch({
					type: Actions.GET_LIGHTROOM_COPY_LIST,
					payload: response?.[1],
				});
				return response;
			}
		} catch (error) {
			console.log('error==>getAlbumImageFileNames', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/tags/{{ _.tag_id }}
	const updateTagOrder = async (payload, galleryId, albumId, tagId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumId}/tags/${tagId}`,
				payload,
				usertoken,
				'galleries',
			);
		} catch (error) {
			console.log('error==>updateTagOrder', error);
		}
	};

	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/visitor-form-access
	const getVisitorFormAccess = async (galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/visitor-form-access`,
				usertoken,
				'galleries',
			);
			console.log(response, 'response');
			if (response[0]) {
				dispatch({
					type: Actions.GET_VISITOR_FORM_ACCESS,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getVisitorFormAccess', error);
		}
	};
	const editVisitorFormAccess = async (payload, galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}/galleries/${galleryId}/visitor-form-access`,
				payload,
				usertoken,
				'galleries',
			);
		} catch (error) {
			console.log('error==>editVisitorFormAccess', error);
		}
	};

	const getImageDetail = async (imageId, reset = true, apiCall = true) => {
		try {
			if (reset) {
				dispatch({
					type: Actions.GET_IMAGE_DETAIL,
					payload: null,
				});
			}

			if (!apiCall) return;

			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/gallery-images/${imageId}`,
				usertoken,
				'galleries',
			);
			if (response[0]) {
				dispatch({
					type: Actions.GET_IMAGE_DETAIL,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getImageDetail', error);
		}
	};
	const updateImageDetail = async (payload, imageId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}/gallery-images/${imageId}`,
				payload,
				usertoken,
				'galleries',
			);

			if (response[0] === true) {
				let updateDataDocs = state?.imagesList?.docs;
				const imageIndex = updateDataDocs.findIndex((doc) => doc._id === imageId);
				updateDataDocs[imageIndex] = response?.[1];

				dispatch({
					type: Actions.GET_IMAGES_LIST,
					payload: { ...state.imagesList, docs: updateDataDocs },
				});

				dispatch({
					type: Actions.GET_IMAGE_DETAIL,
					payload: response?.[1],
				});

				return [true];
			} else {
				return response;
			}
		} catch (error) {
			console.log('error==>getImageDetail', error);
		}
	};

	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/cover-image
	const updateAlbumCoverImage = async (json, galleryId, albumId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}${API.GALLERY.albums}/${albumId}${API.GALLERY.coverImage}`,
				json,
				usertoken,
				'galleries',
			);
			if (response[0] === true && state?.albumImagesCount) {
				getAlbumImagesCount(galleryId);
			}
			return response;
		} catch (error) {
			console.log('error==>updateAlbumCoverImage', error);
		}
	};
	const updateGalleryCoverImage = async (json, galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}${API.GALLERY.coverImage}`,
				json,
				usertoken,
				'galleries',
			);
			return response;
		} catch (error) {
			console.log('error==>updateAlbumCoverImage', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/guest-access
	const getGalleryGuestAccess = async (galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/guest-access`,
				usertoken,
				'galleries',
			);
			if (response[0]) {
				dispatch({
					type: Actions.GET_GALLERY_GUEST_ACCESS,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getGalleryGuestAccess', error);
		}
	};
	const editGalleryGuestAccess = async (payload, galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}/galleries/${galleryId}/guest-access`,
				payload,
				usertoken,
				'galleries',
			);
			if (response[0]) {
				dispatch({
					type: Actions.GET_GALLERY_GUEST_ACCESS,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>editGalleryGuestAccess', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{_['workspaceId']}}/galleries/{{ _.gallery_id }}/share-via-email
	const shareGalleryViaEmail = async (payload, galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPost(
				`/${workspaceId}/galleries/${galleryId}/share-via-email`,
				payload,
				usertoken,
				'galleries',
			);
			return response;
		} catch (error) {
			console.log('error==>shareGalleryViaEmail', error);
		}
	};

	const deleteAlbum = async (galleryId, albumId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchDelete(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}${API.GALLERY.albums}/${albumId}`,
				usertoken,
				null,
				'galleries',
			);

			if (response[0] === true) {
				dispatch({
					type: Actions.RESET_IMAGES_LIST,
				});

				if (state.albumImagesCount) {
					let ablumsData = state.albumImagesCount.albums.filter(
						(item) => item._id !== albumId,
					);
					dispatch({
						type: Actions.GET_ALBUM_IMAGES_COUNT,
						payload: {
							...state.albumImagesCount,
							albums: ablumsData,
						},
					});
				}
			}

			return response;
		} catch (error) {
			console.log('error==>deleteAlbum', error);
		}
	};

	const deleteGallery = async (galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchDelete(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}`,
				usertoken,
				null,
				'galleries',
			);
			if (response[0] === true) {
				let updateGallery = [...state.tenantGalleries?.galleries];
				updateGallery = updateGallery.filter((item) => galleryId !== item._id);
				dispatch({
					type: Actions.GET_TENANT_GALLERIES,
					payload: { ...state.tenantGalleries, galleries: updateGallery },
				});
			}
			return response;
		} catch (error) {
			console.log('error==>deleteGallery', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/images
	const deleteImages = async (payload, galleryId, albumId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchDelete(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumId}/images`,
				usertoken,
				payload,
				'galleries',
			);
			if (response[0] === true) {
				let docs = state.imagesList?.docs?.filter((image) => {
					return !payload?.image_ids?.includes(image?._id);
				});

				const payloadData = {
					...state.imagesList,
					docs,
				};

				dispatch({
					type: Actions.RESET_IMAGES_LIST,
				});

				dispatch({
					type: Actions.GET_IMAGES_LIST,
					payload: payloadData,
				});

				return [true];
			} else {
				return response;
			}
		} catch (error) {
			console.log('error==>deleteImages', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/tags/{{ _.tag_id }}/sortType
	const updateTagSortType = async (payload, galleryId, albumId, tagId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumId}/tags/${tagId}/sortType`,
				payload,
				usertoken,
				'galleries',
			);
			return response;
		} catch (error) {
			console.log('error==>updateTagSortType', error);
		}
	};

	const getAlbumImagesCount = async (galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}`,
				usertoken,
				'galleries',
			);
			if (response?.[0] === true) {
				dispatch({
					type: Actions.GET_ALBUM_IMAGES_COUNT,
					payload: response?.[1],
				});
			} else {
				return response;
			}
		} catch (error) {
			console.log('error==>getAlbums', error);
		}
	};
	//{{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/tags/{{ _.tag_id }}/images
	const addTagToImage = async (payload, galleryId, albumId, tagId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPost(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumId}/tags/${tagId}/images`,
				payload,
				usertoken,
				'galleries',
			);
			return response;
		} catch (error) {
			console.log('error==>addTagToImage', error);
		}
	};

	const removeTagFromImage = async (payload, galleryId, albumId, tagId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchDelete(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumId}/tags/${tagId}/images`,
				usertoken,
				payload,
				'galleries',
			);
			return response;
		} catch (error) {
			console.log('error==>removeTagFromImage', error);
		}
	};

	const checkGallerySlugAvailable = async (slug) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/gallery-slug-availability/${slug}`,
				usertoken,
				'galleries',
			);
			return response;
		} catch (error) {
			console.log('error==>checkGallerySlugAvailable', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/collections
	const getClientSelections = async (galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/collections`,
				usertoken,
				'galleries',
			);
			if (response[0]) {
				dispatch({
					type: Actions.GET_CLIENT_SELECTIONS,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getClientSelections', error);
		}
	};
	const clearClientSelectionsData = () => {
		dispatch({
			type: Actions.GET_CLIENT_SELECTIONS,
			payload: null,
		});
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/gallery-collections/{{ _.collection_id }}/images
	const getClientSelectionImages = async (collectionId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/gallery-collections/${collectionId}/images`,
				usertoken,
				'galleries',
			);
			if (response[0]) {
				dispatch({
					type: Actions.GET_CLIENT_SELECTION_IMAGES,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getClientSelectionImages', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/move-images
	const moveImagesToAlbum = async (payload, galleryId, albumId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumId}/move-images`,
				payload,
				usertoken,
				'galleries',
			);
			return response;
		} catch (error) {
			console.log('error==>moveImagesToAlbum', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}
	const pubslishGallery = async (payload, galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}/galleries/${galleryId}`,
				payload,
				usertoken,
				'galleries',
			);
			return response;
		} catch (error) {
			console.log('error==>pubslishGallery', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/share-details
	const getGalleryShareDetails = async (galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/share-details`,
				usertoken,
				'galleries',
			);
			dispatch({
				type: Actions.GET_GALLERY_SHARE_DETAILS,
				payload: response?.[1],
			});
		} catch (error) {
			console.log('error==>getGalleryShareDetails', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/change-master-access-pin.
	const changeMasterAccessPin = async (payload, galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}/galleries/${galleryId}/change-master-access-pin`,
				payload,
				usertoken,
				'galleries',
			);
			return response;
		} catch (error) {
			console.log('error==>changeMasterAccessPin', error);
		}
	};

	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/custom-sort-index
	const updateAlbumOrder = async (payload, galleryId, albumId, sortedItems) => {
		try {
			dispatch({
				type: Actions.GET_ALBUM_IMAGES_COUNT,
				payload: {
					...state.albumImagesCount,
					albums: [...sortedItems],
				},
			});
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumId}/custom-sort-index`,
				payload,
				usertoken,
				'galleries',
			);

			// if (response[0] === true) {
			// }

			return response;
		} catch (error) {
			console.log('error==>updateAlbumOrder', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/tags/{{ _.tag_id }}/re-arrange-status

	const getRearrangeStatus = async (galleryId, albumId, tagId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumId}/tags/${tagId}/re-arrange-status?isSortRequired=true`,

				usertoken,
				'galleries',
			);
			return response;
		} catch (error) {
			console.log('error==>updateTagRearrangeStatus', error);
		}
	};
	const updateImageOrder = async (images) => {
		try {
			dispatch({
				type: Actions.GET_IMAGES_LIST,
				payload: {
					...state.imagesList,
					docs: images,
				},
			});
		} catch (error) {
			console.log('error==>updateImageOrder', error);
		}
	};

	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/tags/{{ _.tag_id }}/images
	const changeImageOrder = async (payload, galleryId, albumId, tagId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumId}/tags/${tagId}/images`,
				payload,
				usertoken,
				'galleries',
			);
			return response;
		} catch (error) {
			console.log('error==>changeImageOrder', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/default-sort
	const setDefaultSort = async (payload) => {
		try {
			dispatch({
				type: Actions.GET_TENANT_GALLERIES,
				payload: null,
			});

			console.log('payload==>setDefaultSort', state.tenantAlbums);
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}/galleries/default-sort`,
				payload,
				usertoken,
				'galleries',
			);
			if (response[0] === true) {
				getGalleries({ page: 1, limit: 15 }, true);
			}
		} catch (error) {
			console.log('error==>setDefaultSort', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/face
	const getAiFace = async (galleryId, page = 1, limit = 40, reset = false) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/faces?page=${page}&limit=${limit}`,
				usertoken,
				'galleries',
			);
			if (response[0]) {
				const data = reset
					? response?.[1]
					: {
							...state.aiFace,
							...response?.[1],
							faces: [...state.aiFace?.faces, ...response?.[1]?.faces],
					  };
				dispatch({
					type: Actions.GET_AI_FACE,
					payload: data,
				});
			}
		} catch (error) {
			console.log('error==>getAiFace', error);
		}
	};

	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/download/{{downloadId}}
	const getDownloadLinkStatus = async (downloadId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/download/${downloadId}`,
				usertoken,
				'galleries',
			);
			return response;
		} catch (error) {
			console.log('error==>getDownloadLinkStatus', error);
		}
	};
	// {{ _.gallerybaseUrl }}/download/{{downloadId}}/{{fileId}}/zip-download-url
	const getZipDownloadUrl = async (downloadId, fileId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.fetchGet(
				`/download/${downloadId}/${fileId}/zip-download-url`,
				usertoken,
				'galleries',
			);
			return response;
		} catch (error) {
			console.log('error==>getZipDownloadUrl', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/faces/_.face_id/images
	const getAiFaceImages = async (galleryId, faceId, page = 1, limit = 25, reset = false) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/faces/${faceId}/images?page=${page}&limit=${limit}`,
				usertoken,
				'galleries',
			);
			if (response[0]) {
				const data = reset
					? response?.[1]
					: {
							...state.aiFaceImages,
							...response?.[1],
							images: [...state.aiFaceImages?.images, ...response?.[1]?.images],
					  };
				dispatch({
					type: Actions.GET_AI_FACE_IMAGES,
					payload: data,
				});
			}
		} catch (error) {
			console.log('error==>getAiFaceImages', error);
		}
	};
	const clearAiFace = () => {
		dispatch({
			type: Actions.GET_AI_FACE,
			payload: null,
		});
	};
	const aiFaceImagesReset = () => {
		dispatch({
			type: Actions.GET_AI_FACE_IMAGES,
			payload: null,
		});
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/tags/{{ _.tag_id }}/download
	const getDownloadLinkForTag = async (payload, galleryId, albumId, tagId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPost(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumId}/tags/${tagId}/download`,
				payload,
				usertoken,
				'galleries',
			);
			return response;
		} catch (error) {
			console.log('error==>getDownloadLinkForTag', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/gallery-images/{{ _.image_id }}/download
	const getDownloadLinkForImage = async (imageId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/gallery-images/${imageId}/download`,
				usertoken,
				'galleries',
			);
			console.log('response==>getDownloadLinkForImage', response);
			if (response[0] === true) {
				console.log('this ios dsfdsfdsf');
				const imageResponse = await fetch(response[1].signedUrl);
				const blob = await imageResponse.blob();
				const url = window.URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				link.download = response?.[1]?.fileName || 'image';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
				window.URL.revokeObjectURL(url);
				console.log('this ios dsfdssdlfjhsdkjfsdkfj');
			}

			return response;
		} catch (error) {
			console.log('error==>getDownloadLinkForImage', error);
		}
	};
	//{{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/visitors
	const getInsightVisitors = async (
		galleryId,
		page = 1,
		limit = 20,
		search = '',
		dateRange = {},
	) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');

			const queryParams = {
				page,
				limit,
				search,
				startDate: dateRange?.startDate || '',
				endDate: dateRange?.endDate || '',
			};

			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/visitors`,
				usertoken,
				'galleries',
				queryParams,
			);
			if (response[0] === true) {
				const newPayload =
					page === 1
						? response[1]
						: {
								...response[1],
								docs: [
									...(state.insightsVisitors?.docs || []),
									...response[1].docs,
								],
						  };
				dispatch({
					type: Actions.GET_INSIGHT_VISITORS,
					payload: newPayload,
				});
			}
			return response;
		} catch (error) {
			console.log('error==>getInsightVisitors', error);
		}
	};
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/download-images
	const getDownloadForMultipleImages = async (payload, galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPost(
				`/${workspaceId}/galleries/${galleryId}/download-images`,
				payload,
				usertoken,
				'galleries',
			);
			if (response?.[0] && Array.isArray(response?.[1]?.signedUrls)) {
				for (let i = 0; i < response[1].signedUrls.length; i++) {
					const signedUrl = response[1].signedUrls[i];
					try {
						const imageResponse = await fetch(signedUrl);
						const blob = await imageResponse.blob();
						const url = window.URL.createObjectURL(blob);
						const link = document.createElement('a');
						link.href = url;

						const fileName =
							signedUrl.split('/').pop().split('?')[0] || `image-${i + 1}.jpg`;
						link.download = fileName;
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
						window.URL.revokeObjectURL(url);

						await new Promise((resolve) => setTimeout(resolve, 500));
					} catch (downloadError) {
						console.log(`Error downloading image ${i + 1}:`, downloadError);
					}
				}
			}
			return response;
		} catch (error) {
			console.log('error==>getDownloadForMultipleImages', error);
		}
	};

	//{{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/download-images
	const downloadImages = async (payload, galleryId, albumId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPost(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumId}/download-images`,
				payload,
				usertoken,
				'galleries',
			);

			if (response?.[0] === true && response?.[1]?.downloadId) {
				dispatch({
					type: Actions.GET_DOWNLOAD_IMAGES,
					payload: response?.[1],
				});

				const url = `https://downloads.ve.ai/${response[1].downloadId}`;
				console.log('url==>downloadImages', url);
				window.open(url, '_blank');
				return [true, response?.[1]];
			}
			return [false, null];
		} catch (error) {
			console.log('error==>downloadImages', error);
			return [false, error];
		}
	};

	const clearGalleryShareDetails = () => {
		dispatch({
			type: Actions.GET_GALLERY_SHARE_DETAILS,
			payload: null,
		});
	};

	const getImagesReadyNotify = async (galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/pre-registered-users/notify`,
				usertoken,
				'galleries',
			);
			return response;
		} catch (error) {
			console.log('error==>ImagesReadyNotify', error);
			throw error;
		}
	};

	const getPreRegisteredUsers = async (galleryId, page = 1, limit = 10) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/pre-registered-users?page=${page}&limit=${limit}`,
				usertoken,
				'galleries',
			);

			if (response[0]) {
				dispatch({
					type: Actions.GET_PRE_REGISTERED_USERS,
					payload:
						page === 1
							? response?.[1]
							: {
									metadata: response?.[1].metadata,
									data: [
										...(state.preRegisteredUsers?.data || []),
										...response?.[1].data,
									],
							  },
				});
			}
			return [false, null];
		} catch (error) {
			console.log('error==>getPreRegisteredUsers', error);
			return [false, error];
		}
	};

	const clearPreRegisteredUsers = () => {
		dispatch({
			type: Actions.GET_PRE_REGISTERED_USERS,
			payload: null,
		});
	};
	const clearGalleryState = () => {
		dispatch({
			type: Actions.CLEAR_SPECIFIC_STATES,
			payload: null,
		});
	};

	return {
		...state,
		getGalleries,
		createNewGallery,
		createNewAlbum,
		getGallery,
		postGallery,
		getGalleryData,
		getAlbums,
		basicAlbumDetails,
		editPreferences,
		getGalleryTagsList,
		addGalleryTag,
		getImageUploadStatus,
		getUploadImageSignUrl,
		resetGallleryState,
		putLayoutSettings,
		getLayoutSettings,
		getAlbumCount,
		getEditPreferences,
		getCollaborators,
		postCollaborators,
		updateCollaborators,
		deleteCollaborators,
		getImageDuplicatesList,
		getWaterMarks,
		uploadWaterMark,
		editAlbumName,
		editLockAlbum,
		updatedAlbum,
		checkAlbumSlugIsAvalible,
		getGalleryCredentials,
		getGalleryImages,
		getLightroomCopyList,
		getVisitorFormAccess,
		editVisitorFormAccess,
		getImageDetail,
		updateImageDetail,
		updateAlbumCoverImage,
		updateGalleryCoverImage,
		getGalleryGuestAccess,
		editGalleryGuestAccess,
		shareGalleryViaEmail,
		updateTagOrder,
		setAlbumCoverImage,
		deleteAlbum,
		deleteGallery,
		deleteImages,
		updateTagSortType,
		getAlbumImagesCount,
		addTagToImage,
		removeTagFromImage,
		checkGallerySlugAvailable,
		getClientSelections,
		getClientSelectionImages,
		moveImagesToAlbum,
		pubslishGallery,
		getGalleryShareDetails,
		changeMasterAccessPin,
		updateAlbumOrder,
		getRearrangeStatus,
		updateImageOrder,
		changeImageOrder,
		setDefaultSort,
		getAiFace,
		clearClientSelectionsData,
		getDownloadLinkStatus,
		getZipDownloadUrl,
		getAiFaceImages,
		clearAiFace,
		aiFaceImagesReset,
		getDownloadLinkForTag,
		getDownloadLinkForImage,
		getDownloadForMultipleImages,
		clearGalleryShareDetails,
		getInsightVisitors,
		downloadImages,
		getImagesReadyNotify,
		getPreRegisteredUsers,
		clearPreRegisteredUsers,
		clearGalleryState,
		editAlbum,
	};
};
