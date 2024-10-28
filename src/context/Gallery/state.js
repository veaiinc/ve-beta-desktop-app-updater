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
};

export const Galleries = () => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const getGalleries = async () => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			let decoded = jwt_decode(usertoken);
			const userId = decoded.user_id;
			const params = {
				user_id: userId,
				detailed: false,
				sort: '-shotDuring',
				page: 1,
			};

			const queryString = new URLSearchParams(params).toString();
			const response = await service.fetchGet(
				`/${workspaceId}${API.GALLERY.galleries}?${queryString}`,
				usertoken,
				'galleries',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.GET_TENANT_GALLERIES,
					payload: response?.[1],
				});
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
			if (response?.[0]) {
				dispatch({
					type: Actions.GET_TENANT_ALBUMS,
					payload: response?.[1],
				});
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
			if (response?.[0]) {
				dispatch({
					type: Actions.GET_TAGS_LIST,
					payload: { galleryId, list: response?.[1] },
				});
			}
		} catch (error) {
			console.log('error==>getTags', error);
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
			if (response?.[0]) {
				dispatch({
					type: Actions.POST_TAG_LIST,
					payload: response?.[1],
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
	const checkSlugIsAvalible = async (galleryId, slugName) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const updatedSlugName = slugName.replace(/\s+/g, '');
			console.log(updatedSlugName, 'updatedSlugName');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/album-slug-availability/${slugName}`,
				usertoken,
				'galleries',
			);
			return response;
		} catch (error) {}
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
			if (response?.[0]) {
				return response;
			} else {
				return [false];
			}
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
			if (response[0]) {
				dispatch({
					type: Actions.GET_IMAGE_DUPLICATES,
					payload: { galleryId, albumId, list: response?.[1] },
				});
			}
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
			if (response[0]) {
				dispatch({
					type: Actions.GET_WATERMARKS_LIST,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getImageDuplicatesList', error);
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
	// {{ _.gallerybaseUrl }}/{{ _.workspaceId }}/galleries/{{ _.gallery_id }}/albums/{{ _.albumSlug }}/tags/{{ _.tag_id }}/images  ==> to get the images
	const getGalleryImages = async (
		galleryId,
		albumId,
		tagId,
		page = 1,
		limit = 20,
		reset = false,
	) => {
		try {
			if (reset) {
				dispatch({
					type: Actions.RESET_IMAGES_LIST,
				});
			}
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/galleries/${galleryId}/albums/${albumId}/tags/${tagId}/images?page=${page}&limit=${limit}`,
				usertoken,
				'galleries',
			);
			if (response[0]) {
				dispatch({
					type: Actions.GET_IMAGES_LIST,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.log('error==>getGalleryImages', error);
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
		checkSlugIsAvalible,
		getGalleryCredentials,
		getGalleryImages,
	};
};
