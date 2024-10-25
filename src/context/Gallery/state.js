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
};

export const Galleries = () => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const getGalleries = async (params) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			let decoded = jwt_decode(usertoken);

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
			const response = await service.fetchPost(
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

	const editPreferences = async (galleryId, payload) => {
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.getGallery(
				`/${workspaceId}${API.GALLERY.galleries}/${galleryId}/preferences`,
				payload,
				usertoken,
				'galleries',
			);
		} catch (error) {
			console.log('error==>editPreferences', error);
		}
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

	// {{galleryId}}/albums/{{albumId}}/image-upload-status?uploadBatchId=Ai9dxsGi2X

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
		getUploadImageSignUrl,
		getImageUploadStatus,
	};
};
