import service from '../../services/graphQlServices';
import Service from '../../services/index';
import { message } from '../../views/components/globalComponents/CustomToast';
import {
	getNotesListQuery,
	createNotesMutation,
	getPageQuery,
	saveNotesPageQuery,
	getNotesAccessQuery,
	addNotesAccessMutation,
	changeNotesAccessMutation,
	updatePageMutation,
	removeNotesAccessMutation,
	addToFavoriteMutation,
	removeFromFavoriteMutation,
	deletePageMutation,
	duplicatePageMutation,
	globalNotesAccessMutation,
	notesImageBlockUploadMutation,
	notesImageBlockDeleteMutation,
	notesLinkUploadMutation,
	notesCoverImageFileUploadMutation,
	notesIconUploadMutation,
	notesDeleteCoverImageMutation,
	getBlocksQuery,
	createBlockMutation,
	updateBlockMutation,
	deleteBlockMutation,
	createDatabaseMutation,
} from './graphQlFunctions';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './action';
import axios from 'axios';

export const intialState = {
	notes: null,
	moreNotes: null,
	notesPageData: null,
	notesAccess: null,
	globalAccess: null,
	blocks: null,
	database: null,
};

export const NotesState = (props) => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const getNotesList = async (payload, fetchMore = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');

			const response = await service.query(
				getNotesListQuery,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);

			if (response?.[0]) {
				dispatch({
					type: fetchMore ? Actions.GET_MORE_NOTES_SUCCESS : Actions.GET_NOTES_SUCCESS,
					payload: response?.[1]?.data?.listPages,
				});
			} else {
				message.error('Error fetching notes logs');
			}
		} catch (error) {
			console.log('errror ==>getNotesList', error);
		}
	};

	const createNotesList = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				createNotesMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);

			console.log('response==>getNotesList', response);
			if (response?.[0]) {
				const dataResponse = response?.[1]?.data?.createPage;
				return [true, dataResponse];
			} else {
				console.log('Api failed ==>createNotesList', response);
				return [false];
			}
		} catch (error) {
			console.log('error==>createNotesList', error);
		}
	};

	const getNotesPageData = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getPageQuery,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);

			if (response?.[0]) {
				const data = response?.[1]?.data?.getPage;
				dispatch({
					type: Actions.GET_NOTES_PAGE_DATA_SUCCESS,
					payload: { data },
				});
				dispatch({
					type: Actions.SET_GLOBAL_ACCESS,
					payload: data?.globalNoteAccess
						? { isEnabled: true, access: data?.globalNoteAccess }
						: { isEnabled: false, access: 'view' },
				});
			} else {
				const error = response?.[1]?.[0];
				dispatch({
					type: Actions.GET_NOTES_PAGE_DATA_SUCCESS,
					payload: { error },
				});
				console.log('Api failed ==>getNotesPageData', response);
			}
		} catch (error) {
			dispatch({
				type: Actions.GET_NOTES_PAGE_DATA_SUCCESS,
				payload: { error },
			});
			console.log('error==>getNotesPageData', error);
		}
	};

	const saveNotesdata = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				saveNotesPageQuery,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);

			if (response?.[0]) {
			} else {
				message.error('Error saving notes');
			}
		} catch (error) {
			console.log('error==>getNotesPageData', error);
		}
	};

	const getNotesAccess = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getNotesAccessQuery,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);

			if (response?.[0]) {
				dispatch({
					type: Actions.GET_NOTES_ACCESS_SUCCESS,
					payload: response?.[1]?.data?.listSharedUsers,
				});
			} else {
				dispatch({
					type: Actions.GET_NOTES_ACCESS_SUCCESS,
					payload: [],
				});
			}
		} catch (error) {
			console.log('error==>getNotesAccess', error);
		}
	};

	const addNotesAccess = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				addNotesAccessMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);

			if (response?.[0]) {
				return [true, response?.[1]?.data?.sharePage];
			} else {
				return [false, response?.[1]?.[0]];
			}
		} catch (error) {
			console.log('error==>addNotesAccess', error);
		}
	};

	const changeNotesAccess = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				changeNotesAccessMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);

			if (response?.[0]) {
				return [true, response?.[1]?.data?.changePageAccess];
			} else {
				return [false, response?.[1]?.[0]];
			}
		} catch (error) {
			console.log('error==>changeNotesAccess', error);
		}
	};

	const updatePage = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				updatePageMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);

			if (response?.[0]) {
				return [true, response?.[1]?.data?.updatePage];
			} else {
				return [false, response?.[1]?.[0]];
			}
		} catch (error) {
			console.log('error==>updatePage', error);
		}
	};

	const removeNotesAccess = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				removeNotesAccessMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);
			if (response?.[0]) {
				return [true, response?.[1]?.data?.unsharePage];
			} else {
				return [false, response?.[1]?.[0]];
			}
		} catch (error) {
			console.log('error==>removeNotesAccess', error);
		}
	};

	const addToFavorite = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				addToFavoriteMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);
			if (response?.[0]) {
				return [true, response?.[1]?.data?.addToFavorite];
			} else {
				return [false, response?.[1]?.[0]];
			}
		} catch (error) {
			console.log('error==>starNotes', error);
		}
	};

	const removeFromFavorite = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				removeFromFavoriteMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);
			if (response?.[0]) {
				return [true, response?.[1]?.data?.removeFromFavorite];
			} else {
				return [false, response?.[1]?.[0]];
			}
		} catch (error) {
			console.log('error==>removeFromFavorite', error);
		}
	};

	const deletePage = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				deletePageMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);
			if (response?.[0]) {
				return [true, response?.[1]?.data?.deletePage];
			} else {
				return [false, response?.[1]?.[0]];
			}
		} catch (error) {
			console.log('error==>deletePage', error);
		}
	};

	const duplicatePage = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				duplicatePageMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);
			if (response?.[0]) {
				return [true, response?.[1]?.data?.duplicatePage];
			} else {
				return [false, response?.[1]?.[0]];
			}
		} catch (error) {
			console.log('error==>duplicatePage', error);
		}
	};

	const updateGlobalAccess = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				globalNotesAccessMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.SET_GLOBAL_ACCESS,
					payload: payload?.input,
				});
				return [true, response?.[1]?.data?.duplicatePage];
			} else {
				return [false, response?.[1]?.[0]];
			}
		} catch (error) {
			console.log('error==>updateGlobalAccess', error);
		}
	};

	const updateNotesState = (payload) => {
		dispatch({
			type: Actions.UPDATE_NOTES_STATE,
			payload,
		});
	};

	const uploadNotesImageBlock = async (payload, data) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				notesImageBlockUploadMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);

			if (response?.[0]) {
				const { signedUrl, imageUrl } = response?.[1]?.data?.uploadPageBlockImage;
				const uploadResponse = await axios.put(signedUrl, data, {
					headers: {
						'Content-Type': data?.type,
					},
				});
				if (uploadResponse.status === 200) {
					return [true, imageUrl];
				} else {
					return [false, uploadResponse];
				}
			}
			return [false, response?.[1]?.[0]];
		} catch (error) {
			console.log('error==>uploadNotesImageBlock', error);
		}
	};

	const deleteNotesImageBlock = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				notesImageBlockDeleteMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);
			if (response?.[0]) {
				return [true, response?.[1]]?.data?.deletePageImage;
			} else {
				return [false, response?.[1]?.data];
			}
		} catch (error) {
			console.log('error==>deleteNotesImageBlock', error);
		}
	};

	const notesCoverImageLinkUpload = async ({ link, pageId }) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const payload = {
				pageId,
				input: {
					coverImage: link,
				},
			};
			const response = await service.mutation(
				notesLinkUploadMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);
			if (response?.[0]) {
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.log('error==>notesUploadLink', error);
		}
	};

	const notesCoverImageFileUpload = async ({ imageFile, pageId }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');

			const payload = {
				pageId,
				imageType: 'cover',
			};

			const response = await service.mutation(
				notesCoverImageFileUploadMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);

			if (response?.[0]) {
				const signedUrl = response?.[1]?.data?.uploadPageImage?.signedUrl;

				const uploadRes = await fetch(signedUrl, {
					method: 'PUT',
					headers: {
						'Content-Type': imageFile.type,
					},
					body: imageFile,
				});

				if (uploadRes.status === 200) {
					return [true];
				} else {
					return [false];
				}
			} else {
				return false;
			}
		} catch (error) {
			console.error('error==>notesCoverImageFileUpload', error);
			return false;
		}
	};

	const notesIconUpload = async ({ icon, pageId }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');

			const iconImage = {
				id: icon?.id,
				native: icon?.native,
				unified: icon?.unified,
			};

			const payload = {
				pageId,
				input: {
					iconImage: JSON.stringify(iconImage),
				},
			};

			const response = await service.mutation(
				notesIconUploadMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);
			if (response?.[0]) {
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.error('error==>notesCoverImageFileUpload', error);
			return false;
		}
	};

	const notesDeleteCoverImage = async ({ pageId }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');

			const payload = {
				pageId,
				imageInput: {
					type: 'cover',
				},
			};

			const response = await service.mutation(
				notesDeleteCoverImageMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);
			if (response?.[0]) {
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.error('error==>notesDeleteCoverImage', error);
			return false;
		}
	};

	const notesDeleteIcon = async ({ pageId }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');

			const payload = {
				pageId,
				imageInput: {
					type: 'icon',
				},
			};

			const response = await service.mutation(
				notesDeleteCoverImageMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);
			if (response?.[0]) {
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.error('error==>notesDeleteIcon', error);
			return false;
		}
	};

	const getBlocks = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getBlocksQuery,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.SET_BLOCKS,
					payload: response?.[1]?.data?.blocks,
				});
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.error('error==>getBlocks', error);
			return false;
		}
	};

	const createBlock = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				createBlockMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);
		} catch (error) {
			console.error('error==>createBlock', error);
			return false;
		}
	};

	const updateBlock = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				updateBlockMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);
		} catch (error) {
			console.error('error==>updateBlock', error);
			return false;
		}
	};

	const deleteBlock = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				deleteBlockMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);
		} catch (error) {
			console.error('error==>deleteBlock', error);
			return false;
		}
	};

	const createDatabase = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				createDatabaseMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
			);
			if (response?.[0]) {
				console.log('response==>createDatabase', response?.[1]);
				dispatch({
					type: Actions.ADD_DATABASE,
					payload: response?.[1],
				});
			}
		} catch (error) {
			console.error('error==>createDatabase', error);
		}
	};

	return {
		...state,
		getNotesList,
		createNotesList,
		getNotesPageData,
		saveNotesdata,
		getNotesAccess,
		addNotesAccess,
		updateNotesState,
		changeNotesAccess,
		updatePage,
		removeNotesAccess,
		addToFavorite,
		removeFromFavorite,
		deletePage,
		duplicatePage,
		updateGlobalAccess,
		uploadNotesImageBlock,
		deleteNotesImageBlock,
		notesCoverImageLinkUpload,
		notesCoverImageFileUpload,
		notesIconUpload,
		notesDeleteCoverImage,
		notesDeleteIcon,
		getBlocks,
		createBlock,
		updateBlock,
		deleteBlock,
		createDatabase,
	};
};
