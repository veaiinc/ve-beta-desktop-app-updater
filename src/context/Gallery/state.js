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
				dispatch({
					type: Actions.GET_TENANT_ALBUMS,
					payload: response?.[1],
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
		} catch (error) {
			console.log('error==>getGallery', error);
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
					payload: response?.[1]?.layoutSettings,
				});
			}
		} catch (error) {
			console.log('error==>getLayoutSettings', error);
		}
	};
	const putLayoutSettings = async (payload, galleryId) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchPut(
				`/${workspaceId}/galleries/${galleryId}/layout-settings`,
				payload,
				usertoken,
				'galleries',
			);
			if (response[0]) {
				dispatch({
					type: Actions.GET_LAYOUT_SETTINGS,
					payload: response?.[1]?.layoutSettings,
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

	const getImageDetail = async (imageId) => {
		try {
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
		editAlbum,
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
	};
};
