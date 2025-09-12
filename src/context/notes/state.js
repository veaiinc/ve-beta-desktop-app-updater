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
	getLiveKitTokenQuery,
	getBlocksQuery,
	createBlockMutation,
	updateBlockMutation,
	deleteBlockMutation,
	createDatabaseMutation,
	createDatabaseViewMutation,
	getDatabaseRowsQuery,
	getDatabaseQuery,
	addDatabaseRowMutation,
	updateDatabaseRowMutation,
	addDatabaseFieldMutation,
	updateDatabaseFieldMutation,
	updateDatabaseMutation,
	listAvailableDatabasesQuery,
	deleteDatabaseFieldMutation,
	getDatabaseViewsQuery,
	deleteDatabaseViewMutation,
	updateFilterMutation,
	removeFilterMutation,
	addFilterMutation,
	deleteDatabaseRowMutation,
	addSortMutation,
	updateSortMutation,
	removeSortMutation,
	updateViewGroupMutation,
	//for database
	getNotesListDatabaseQuery,
	getPageQueryDatabase,
	createNotesDatabaseMutation,
	updateDatabaseViewMutation,
	changeNotesAccessMutationDatabase,
	updateGlobalNotesAccessMutation,

	// for meet bots
	getMeetBotDataQuery,
	getMeetBotByIdQuery,
	getMeetSummaryQuery,
	getMeetingAnalyticsQuery,
	meetBotCreateMutation,
	deleteLiveKitRoomMutation,
	getMeetTranscriptHistoryQuery,
	getAiLiveIntelligenceHistoryQuery,
} from './graphQlFunctions';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './action';
import axios from 'axios';

export const intialState = {
	notes: null,
	databaseNotes: null,
	notesPageData: null,
	notesAccess: null,
	globalAccess: null,
	blocks: null,
	database: null,
	views: null,
	rowData: null,
	availableDatabases: null,
	databaseSidebar: {
		stack: [],
		open: false,
	},
	transcriptHistory: [],
	existingBots: null,
	meetSummary: null,
	transcriptionList: [],
	aiLiveIntelligenceHistory: null,
	createBotInfo: null,
};

export const NotesState = (props) => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const getNotesList = async (payload, append = false, isDatabase = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');

			const response = await service.query(
				isDatabase ? getNotesListDatabaseQuery : getNotesListQuery,
				payload,
				workspaceId,
				usertoken,
				isDatabase ? 'page_notes_api_database' : 'page_notes_api',
			);

			if (response?.[0]) {
				const totalDocs = response?.[1]?.data?.listPages?.totalDocs;
				const currentPageNotesList = response?.[1]?.data?.listPages?.data;
				const currentPage = response?.[1]?.data?.listPages?.currentPage;
				const hasNextPage = response?.[1]?.data?.listPages?.hasNextPage;

				const payload = {
					data: append
						? [...(state?.notes?.data || []), ...currentPageNotesList]
						: currentPageNotesList,
					hasNextPage,
					currentPage,
					totalDocs,
				};
				dispatch({
					type: Actions.GET_NOTES_SUCCESS,
					payload,
				});
			} else {
				message.error('Error fetching notes logs');
			}
		} catch (error) {
			console.log('errror ==>getNotesList', error);
		}
	};

	const createNotesList = async (payload, isDatabase = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				isDatabase ? createNotesDatabaseMutation : createNotesMutation,
				payload,
				workspaceId,
				usertoken,
				isDatabase ? 'page_notes_api_database' : 'page_notes_api',
			);
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

	const getNotesPageData = async (payload, isDatabase = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				isDatabase ? getPageQueryDatabase : getPageQuery,
				payload,
				workspaceId,
				usertoken,
				isDatabase ? 'page_notes_api_database' : 'page_notes_api',
			);

			if (response?.[0]) {
				const data = response?.[1]?.data?.getPage || {};
				const permissions = data?.permissions || {};
				dispatch({
					type: Actions.GET_NOTES_PAGE_DATA_SUCCESS,
					payload: { data },
				});
				const accessKey = isDatabase ? 'tenantAccess' : 'globalNoteAccess';
				dispatch({
					type: Actions.SET_GLOBAL_ACCESS,
					payload: permissions?.[accessKey]
						? { isEnabled: true, access: permissions?.[accessKey] }
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

	const getNotesAccess = async (payload, isDatabase = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getNotesAccessQuery,
				payload,
				workspaceId,
				usertoken,
				isDatabase ? 'page_notes_api_database' : 'page_notes_api',
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

	const addNotesAccess = async (payload, isDatabase = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				addNotesAccessMutation,
				payload,
				workspaceId,
				usertoken,
				isDatabase ? 'page_notes_api_database' : 'page_notes_api',
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

	const changeNotesAccess = async (payload, isDatabase = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				isDatabase ? changeNotesAccessMutationDatabase : changeNotesAccessMutation,
				payload,
				workspaceId,
				usertoken,
				isDatabase ? 'page_notes_api_database' : 'page_notes_api',
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

	const updatePage = async (payload, isDatabase = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				updatePageMutation,
				payload,
				workspaceId,
				usertoken,
				isDatabase ? 'page_notes_api_database' : 'page_notes_api',
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

	const removeNotesAccess = async (payload, isDatabase = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				removeNotesAccessMutation,
				payload,
				workspaceId,
				usertoken,
				isDatabase ? 'page_notes_api_database' : 'page_notes_api',
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

	const deletePage = async (payload, isDatabase = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				deletePageMutation,
				payload,
				workspaceId,
				usertoken,
				isDatabase ? 'page_notes_api_database' : 'page_notes_api',
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

	const updateGlobalAccess = async (payload, isDatabase = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				isDatabase ? updateGlobalNotesAccessMutation : globalNotesAccessMutation,
				payload,
				workspaceId,
				usertoken,
				isDatabase ? 'page_notes_api_database' : 'page_notes_api',
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

	const uploadNotesImageBlock = async (payload, data, isDatabase = false) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				notesImageBlockUploadMutation,
				payload,
				workspaceId,
				usertoken,
				isDatabase ? 'page_notes_api_database' : 'page_notes_api',
			);

			if (response?.[0]) {
				const { signedUrl, imageUrl } = response?.[1]?.data?.uploadPageBlockImage || {};
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
	const getLiveKitToken = async ({ meetingId, sessionId }) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const locationString = localStorage.getItem('locationDetails') || {};
			const location = JSON.parse(locationString);

			const payload = {
				input: { meetingId, sessionId, location, timezone: location.timezone },
			};

			const response = await service.mutation(
				getLiveKitTokenQuery,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				return [true, response?.[1]?.data?.getLiveKitToken];
			} else {
				return [false, response?.[1]?.[0]];
			}
		} catch (error) {
			console.log('error==>getLiveKitToken', error);
		}
	};
	const getBlocks = async (payload, isDatabase = false) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getBlocksQuery,
				payload,
				workspaceId,
				usertoken,
				isDatabase ? 'page_notes_api_database' : 'page_notes_api',
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
				'page_notes_api_database',
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
				'page_notes_api_database',
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
				'page_notes_api_database',
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
				'page_notes_api_database',
			);
			if (response?.[0]) {
				const databaseMetadata = response?.[1]?.data?.createDatabase;
				dispatch({
					type: Actions.UPDATE_DATABASE,
					payload: {
						[databaseMetadata?._id]: {
							databaseMetadata,
						},
					},
				});
				return databaseMetadata;
			}
		} catch (error) {
			console.error('error==>createDatabase', error);
		}
	};

	const createDatabaseView = async (payload, blockId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				createDatabaseViewMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				const databaseView = response?.[1]?.data?.createDatabaseView;
				dispatch({
					type: Actions.UPDATE_DATABASE_VIEWS,
					payload: {
						[blockId]: [...(state?.views?.[blockId] || []), databaseView],
					},
				});
				return databaseView;
			}
		} catch (error) {
			console.error('error==>createDatabaseView', error);
		}
	};

	const getDatabaseViews = async (payload, blockId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getDatabaseViewsQuery,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				const databaseViews = response?.[1]?.data?.databaseViews;
				dispatch({
					type: Actions.UPDATE_DATABASE_VIEWS,
					payload: { [blockId]: databaseViews },
				});
			}
		} catch (error) {
			console.error('error==>getDatabaseViews', error);
		}
	};

	const getDatabase = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getDatabaseQuery,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.UPDATE_DATABASE,
					payload: {
						[payload?.databaseId]: {
							databaseMetadata: response?.[1]?.data?.database,
						},
					},
				});
				return response?.[1]?.data?.database;
			} else {
				return null;
			}
		} catch (error) {
			console.error('error==>getDatabase', error);
		}
	};

	const getDatabaseRows = async (payload, { viewId, filters, sortBy, groupBy, blockId }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getDatabaseRowsQuery,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				const { data, metaInfo } = response?.[1]?.data?.listDatabaseRowsWithGroup || {};
				const groupData = Object.fromEntries(data?.map((item) => [item?._id, item]));
				dispatch({
					type: Actions.SET_DATABASE_ROWS,
					payload: {
						[viewId]: {
							...(state?.rowData?.[viewId] || {}),
							groupData,
							metaInfo,
							filters,
							sortBy,
							groupBy,
							fieldType: metaInfo?.fieldType,
							searchQuery: payload?.input?.search,
						},
					},
				});
				if (
					[
						'text',
						'title',
						'email',
						'url',
						'phone',
						'number',
						'date',
						'created_time',
						'last_edited_time',
					].includes(metaInfo?.fieldType)
				) {
					const view = state?.views?.[blockId] || [];
					const newView = view?.map((view) => {
						if (view?._id === viewId) {
							return {
								...view,
								groupBy: {
									...view?.groupBy,
									defaultGroups: Object.keys(groupData)?.map((item) => ({
										_id: item,
										label: item === 'null' ? 'No Value' : item,
									})),
								},
							};
						}
						return view;
					});
					dispatch({
						type: Actions.UPDATE_DATABASE_VIEWS,
						payload: { [blockId]: newView },
					});
				}
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.error('error==>getDatabaseRows', error);
		}
	};

	const handleLoadMoreGroups = async (payload, { viewId, blockId }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getDatabaseRowsQuery,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				const { data, metaInfo } = response?.[1]?.data?.listDatabaseRowsWithGroup || {};
				const newGroupData = Object.fromEntries(data?.map((item) => [item?._id, item]));

				// Get existing group data for this view
				const existingGroupData = state?.rowData?.[viewId]?.groupData || {};

				// Merge new group data with existing data
				const mergedGroupData = {
					...existingGroupData,
					...newGroupData,
				};

				dispatch({
					type: Actions.SET_DATABASE_ROWS,
					payload: {
						[viewId]: {
							...(state?.rowData?.[viewId] || {}),
							groupData: mergedGroupData,
							metaInfo,
							fieldType: metaInfo?.fieldType,
							searchQuery: payload?.input?.search,
						},
					},
				});

				// Update default groups for specific field types
				if (
					[
						'text',
						'title',
						'email',
						'url',
						'phone',
						'number',
						'date',
						'created_time',
						'last_edited_time',
					].includes(metaInfo?.fieldType)
				) {
					const view = state?.views?.[blockId] || [];
					const newView = view?.map((view) => {
						if (view?._id === viewId) {
							// Get existing default groups
							const existingDefaultGroups = view?.groupBy?.defaultGroups || [];
							// Get new group keys that don't already exist
							const newGroupKeys = Object.keys(newGroupData).filter(
								(key) => !existingDefaultGroups.some((group) => group._id === key),
							);
							// Create new default group objects
							const newDefaultGroups = newGroupKeys.map((item) => ({
								_id: item,
								label: item === 'null' ? 'No Value' : item,
							}));

							return {
								...view,
								groupBy: {
									...view?.groupBy,
									defaultGroups: [...existingDefaultGroups, ...newDefaultGroups],
								},
							};
						}
						return view;
					});
					dispatch({
						type: Actions.UPDATE_DATABASE_VIEWS,
						payload: { [blockId]: newView },
					});
				}
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.error('error==>handleLoadMoreGroups', error);
		}
	};

	const addDatabaseRow = async (payload, { viewId, blockId }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				addDatabaseRowMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);

			if (response?.[0]) {
				const newRowData = response?.[1]?.data?.createDatabaseRow;
				dispatch({
					type: Actions.ADD_DATABASE_ROW,
					payload: {
						viewId,
						newRowData,
						blockId,
						databaseId: payload?.input?.databaseId,
					},
				});

				// updateRelatedViews({
				// 	updatedRow: newRow,
				// 	viewId,
				// 	databaseId: payload?.input?.databaseId,
				// 	rowId: newRow?._id,
				// 	actionType: 'add',
				// });
			}
		} catch (error) {
			console.error('error==>addDatabaseRow', error);
		}
	};

	const updateDatabaseRow = async (
		payload,
		{ viewId, databaseId, groupId, blockId, reorderContext, isOptimisticUpdate = false },
	) => {
		try {
			// If this is an optimistic update for drag and drop, update UI immediately
			if (isOptimisticUpdate && reorderContext) {
				dispatch({
					type: Actions.UPDATE_DATABASE_ROWS,
					payload: {
						viewId,
						rowId: payload?.updateDatabaseRowId,
						updatedRow: null, // We don't have the updated row yet
						groupId,
						blockId,
						databaseId,
						reorderContext,
						isOptimisticUpdate: true,
					},
				});
			}

			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				updateDatabaseRowMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);

			if (response?.[0]) {
				const updatedRowData = response?.[1]?.data?.updateDatabaseRow;

				// If this was an optimistic update, we don't need to dispatch again
				// as the UI is already updated. Just sync with the server response
				if (!isOptimisticUpdate) {
					dispatch({
						type: Actions.UPDATE_DATABASE_ROWS,
						payload: {
							viewId,
							rowId: payload?.updateDatabaseRowId,
							updatedRowData,
							groupId,
							blockId,
							databaseId,
							reorderContext,
						},
					});
				} else {
					// For optimistic updates, just sync the updated row data without reordering
					dispatch({
						type: Actions.SYNC_OPTIMISTIC_UPDATE,
						payload: {
							viewId,
							rowId: payload?.updateDatabaseRowId,
							updatedRowData,
							groupId,
							blockId,
							databaseId,
						},
					});
				}

				// updateRelatedViews({
				// 	updatedRow,
				// 	viewId,
				// 	databaseId,
				// 	rowId: payload?.updateDatabaseRowId,
				// });
				return [true, response?.[1]];
			} else {
				// If API call failed and this was an optimistic update, revert the changes
				if (isOptimisticUpdate) {
					dispatch({
						type: Actions.REVERT_OPTIMISTIC_UPDATE,
						payload: {
							viewId,
							rowId: payload?.updateDatabaseRowId,
							groupId,
							blockId,
							databaseId,
							reorderContext,
						},
					});
				}
				return [false, response?.[1]];
			}
		} catch (error) {
			console.error('error==>updateDatabaseRow', error);

			// If there was an error and this was an optimistic update, revert the changes
			if (isOptimisticUpdate) {
				dispatch({
					type: Actions.REVERT_OPTIMISTIC_UPDATE,
					payload: {
						viewId,
						rowId: payload?.updateDatabaseRowId,
						groupId,
						blockId,
						databaseId,
						reorderContext,
					},
				});
			}
		}
	};

	const deleteDatabaseRow = async (payload, { viewId, databaseId, groupId, blockId }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				deleteDatabaseRowMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.DELETE_DATABASE_ROWS,
					payload: {
						viewId,
						rowId: payload?.deleteDatabaseRowId,
						groupId,
						blockId,
						databaseId,
					},
				});

				updateRelatedViews({
					viewId,
					databaseId,
					rowId: payload?.deleteDatabaseRowId,
					actionType: 'delete',
				});
			}
		} catch (error) {
			console.error('error==>deleteDatabaseRow', error);
		}
	};

	const addDatabaseField = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				addDatabaseFieldMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				const newField = response?.[1]?.data?.addDatabaseField;
				const database = state?.database?.[payload?.databaseId];

				dispatch({
					type: Actions.UPDATE_DATABASE,
					payload: {
						[payload?.databaseId]: {
							...database,
							databaseMetadata: {
								...database?.databaseMetadata,
								fields: [...(database?.databaseMetadata?.fields || []), newField],
							},
						},
					},
				});
			} else {
				message?.error('Failed to add new property');
			}

			return response;
		} catch (error) {
			console.error('error==>addDatabaseField', error);
		}
	};

	const updateDatabaseField = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				updateDatabaseFieldMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);

			if (response?.[0]) {
				const updatedField = response?.[1]?.data?.updateDatabaseField;
				const database = state?.database?.[payload?.databaseId];
				dispatch({
					type: Actions.UPDATE_DATABASE,
					payload: {
						[payload?.databaseId]: {
							...database,
							databaseMetadata: {
								...database?.databaseMetadata,
								fields: database?.databaseMetadata?.fields?.map((field) =>
									field?._id === updatedField?._id ? updatedField : field,
								),
							},
						},
					},
				});
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.error('error==>updateDatabaseField', error);
		}
	};

	const deleteDatabaseField = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				deleteDatabaseFieldMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);

			if (response?.[0]) {
				const database = state?.database?.[payload?.databaseId];
				dispatch({
					type: Actions.UPDATE_DATABASE,
					payload: {
						[payload?.databaseId]: {
							...database,
							databaseMetadata: {
								...database?.databaseMetadata,
								fields: database?.databaseMetadata?.fields?.filter(
									(field) => field?._id !== payload?.fieldId,
								),
							},
						},
					},
				});
				return [true, response?.[1]];
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.error('error==>deleteDatabaseField', error);
		}
	};

	const updateDatabase = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				updateDatabaseMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);

			if (response?.[0]) {
				dispatch({
					type: Actions.UPDATE_DATABASE,
					payload: {
						[payload?.updateDatabaseId]: {
							databaseMetadata: response?.[1]?.data?.updateDatabase,
						},
					},
				});
			} else {
				return [false, response?.[1]];
			}
		} catch (error) {
			console.error('error==>updateDatabase', error);
		}
	};

	const listAvailableDatabases = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				listAvailableDatabasesQuery,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.SET_AVAILABLE_DATABASES,
					payload: response?.[1]?.data?.listDatabases,
				});
			}
		} catch (error) {
			console.error('error==>listAvailableDatabases', error);
		}
	};

	const updateDatabaseSidebar = ({ data, open, replace = false }) => {
		let newStack = [...(state?.databaseSidebar?.stack || [])];
		if (data) {
			if (replace) {
				newStack = [data];
			} else if (data === -1) {
				newStack.pop();
			} else {
				newStack.push(data);
			}
		}
		dispatch({
			type: Actions.UPDATE_DATABASE_SIDEBAR,
			payload: {
				stack: newStack,
				open: open ?? state?.databaseSidebar?.open,
			},
		});
	};

	const deleteDatabaseView = async (payload, blockId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				deleteDatabaseViewMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.UPDATE_DATABASE_VIEWS,
					payload: {
						[blockId]: state?.views?.[blockId]?.filter(
							(view) => view?._id !== payload?.deleteDatabaseViewId,
						),
					},
				});

				dispatch({
					type: Actions.DELETE_DATABASE_ROWS,
					payload: {
						viewId: payload?.deleteDatabaseViewId,
					},
				});
			}
		} catch (error) {
			console.error('error==>deleteDatabaseView', error);
		}
	};

	const addFilter = async (payload, blockId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				addFilterMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				const view = state?.views?.[blockId] || [];
				const newView = view?.map((view) => {
					if (view?._id === payload?.databaseViewId) {
						return {
							...view,
							filterBy: [...(view?.filterBy || []), response?.[1]?.data?.addFilter],
						};
					}
					return view;
				});

				dispatch({
					type: Actions.UPDATE_DATABASE_VIEWS,
					payload: { [blockId]: newView },
				});
			}
		} catch (error) {
			console.error('error==>addFilter', error);
		}
	};

	const updateFilter = async (payload, blockId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				updateFilterMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				const view = state?.views?.[blockId] || [];
				const newView = view?.map((view) => {
					if (view?._id === payload?.databaseViewId) {
						return {
							...view,
							filterBy: view?.filterBy?.map((filter) =>
								filter?._id === payload?.filterId
									? response?.[1]?.data?.updateFilter
									: filter,
							),
						};
					}
					return view;
				});
				dispatch({
					type: Actions.UPDATE_DATABASE_VIEWS,
					payload: { [blockId]: newView },
				});
			}
		} catch (error) {
			console.error('error==>updateFilter', error);
		}
	};

	const removeFilter = async (payload, blockId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				removeFilterMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);

			if (response?.[0]) {
				const view = state?.views?.[blockId] || [];
				const newView = view?.map((view) => {
					if (view?._id === payload?.databaseViewId) {
						return {
							...view,
							filterBy: view?.filterBy?.filter(
								(filter) => filter?._id !== payload?.filterId,
							),
						};
					}
					return view;
				});
				dispatch({
					type: Actions.UPDATE_DATABASE_VIEWS,
					payload: { [blockId]: newView },
				});
			}
		} catch (error) {
			console.error('error==>removeFilter', error);
		}
	};

	const addSort = async (payload, blockId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				addSortMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				const view = state?.views?.[blockId] || [];
				const newView = view?.map((view) => {
					if (view?._id === payload?.databaseViewId) {
						return {
							...view,
							sortBy: [...(view?.sortBy || []), response?.[1]?.data?.addSort],
						};
					}
					return view;
				});
				dispatch({
					type: Actions.UPDATE_DATABASE_VIEWS,
					payload: { [blockId]: newView },
				});
			}
		} catch (error) {
			console.error('error==>addSort', error);
		}
	};

	const updateSort = async (payload, blockId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				updateSortMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				const view = state?.views?.[blockId] || [];
				const newView = view?.map((view) => {
					if (view?._id === payload?.databaseViewId) {
						return {
							...view,
							sortBy: view?.sortBy?.map((sort) =>
								sort?._id === payload?.sortId
									? response?.[1]?.data?.updateSort
									: sort,
							),
						};
					}
					return view;
				});
				dispatch({
					type: Actions.UPDATE_DATABASE_VIEWS,
					payload: { [blockId]: newView },
				});
			}
		} catch (error) {
			console.error('error==>updateSort', error);
		}
	};

	const removeSort = async (payload, blockId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				removeSortMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				const view = state?.views?.[blockId] || [];
				const newView = view?.map((view) => {
					if (view?._id === payload?.databaseViewId) {
						return {
							...view,
							sortBy: view?.sortBy?.filter((sort) => sort?._id !== payload?.sortId),
						};
					}
					return view;
				});
				dispatch({
					type: Actions.UPDATE_DATABASE_VIEWS,
					payload: { [blockId]: newView },
				});
			}
		} catch (error) {
			console.error('error==>removeSort', error);
		}
	};

	const updateViewGroup = async (payload, blockId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				updateViewGroupMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				const view = state?.views?.[blockId] || [];
				const newView = view?.map((view) => {
					if (view?._id === payload?.databaseViewId) {
						return {
							...view,
							groupBy: response?.[1]?.data?.updateGroup,
						};
					}
					return view;
				});
				dispatch({
					type: Actions.UPDATE_DATABASE_VIEWS,
					payload: { [blockId]: newView },
				});
			}
		} catch (error) {
			console.error('error==>updateViewGroup', error);
		}
	};

	const fetchMoreGroupData = async (payload, { blockId } = {}) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				getDatabaseRowsQuery,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				const data = response?.[1]?.data?.listDatabaseRowsWithGroup?.data?.[0];
				dispatch({
					type: Actions.ADD_MORE_DATA_IN_GROUP,
					payload: {
						viewId: payload?.databaseViewId,
						groupId: payload?.input?.groupFilterId,
						data,
					},
				});
			}
		} catch (error) {
			console.error('error==>fetchMoreGroupData', error);
		}
	};

	const updateDatabaseView = async (payload, blockId) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				updateDatabaseViewMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				const view = state?.views?.[blockId] || [];
				const { label, type } = response?.[1]?.data?.updateDatabaseView || {};
				const updateData = { label, type };

				const newView = view?.map((view) => {
					if (view?._id === payload?.updateDatabaseViewId) {
						return {
							...view,
							...updateData,
						};
					}
					return view;
				});
				dispatch({
					type: Actions.UPDATE_DATABASE_VIEWS,
					payload: { [blockId]: newView },
				});
			} else {
				message?.error('failed to update view');
			}
		} catch (error) {
			console.error('error==>updateDatabaseView', error);
		}
	};

	const updateRelatedViews = async ({
		updatedRow,
		updatedField,
		viewId,
		databaseId,
		rowId,
		actionType = 'update',
	}) => {
		try {
			// dispatch({
			// 	type: Actions.UPDATE_RELATED_VIEWS,
			// 	payload: { updatedRow, viewId, databaseId, rowId, actionType },
			// });
		} catch (error) {
			console.error('error==>updateRelatedViews', error);
		}
	};

	const getExistingBots = async ({ page = 1, limit = 10, append = false }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const payload = { page, limit };

			const response = await service.query(
				getMeetBotDataQuery,
				payload,
				workspaceId,
				usertoken,
				'meeting_api',
			);

			if (response?.[0]) {
				const currentPageBotsList = response?.[1]?.data?.listMeetings?.data || [];

				let mergedData;
				if (append) {
					const existing = state?.existingBots?.data || [];

					// Merge + deduplicate by "_id"
					const combined = [...existing, ...currentPageBotsList];
					const seen = new Set();
					mergedData = combined.filter((meeting) => {
						if (!meeting?._id) return false; // skip invalid
						if (seen.has(meeting._id)) return false;
						seen.add(meeting._id);
						return true;
					});
				} else {
					mergedData = currentPageBotsList;
				}

				const payload = {
					...(response?.[1]?.data?.listMeetings || {}),
					data: mergedData,
				};

				dispatch({
					type: Actions.GET_EXISTING_BOTS_SUCCESS,
					payload,
				});

				return response;
			}
		} catch (error) {
			console.error('error==>getExistingBots', error);
		}
	};

	const getMeetSummary = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getMeetSummaryQuery,
				payload,
				workspaceId,
				usertoken,
				'meeting_api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.GET_MEET_SUMMARY_SUCCESS,
					payload: {
						summary:
							response?.[1]?.data?.getMeetingSummaryAndRevampedPrompt
								?.transcriptionSummary,
						revampedPrompt:
							response?.[1]?.data?.getMeetingSummaryAndRevampedPrompt?.revampedPrompt,
					},
				});
			} else {
				dispatch({
					type: Actions.GET_MEET_SUMMARY_SUCCESS,
					payload: { summary: 'Summary not found' },
				});
			}
		} catch (error) {
			console.error('error==>getMeetSummary', error);
		}
	};

	const getMeetingAnalytics = async (meetingId) => {
		console.log('meetingId==>getMeetingAnalytics', meetingId);
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			
			const response = await service.query(
				getMeetingAnalyticsQuery,
				{meetingId},
				workspaceId,
				usertoken,
				'meeting_api',
			);
			console.log('response==>getMeetingAnalytics', response);
			
			// if (response?.[0] && response?.[1]?.data?.getMeetingAnalytics) {
			// 	const analyticsData = JSON.parse(response[1].data.getMeetingAnalytics);
			// 	return [true, analyticsData];
			// } else {
			// 	// Handle GraphQL errors
			// 	let errorMessage = 'Failed to fetch meeting analytics';
				
			// 	if (Array.isArray(response[1]) && response[1].length > 0) {
			// 		const error = response[1][0];
			// 		errorMessage = error.message || errorMessage;
					
			// 		if (error.message?.includes('Cannot return null for non-nullable field')) {
			// 			errorMessage = 'No analytics data available for this meeting yet. Analytics may still be processing.';
			// 		}
			// 	} else if (response?.[1]?.errors?.length > 0) {
			// 		errorMessage = response[1].errors[0].message || errorMessage;
			// 	}
				
			// 	return [false, errorMessage];
			// }
		} catch (error) {
			console.error('error==>getMeetingAnalytics', error);
			return [false, 'Error fetching meeting analytics'];
		}
	};

	const createMeetBot = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');

			const response = await service.mutation(
				meetBotCreateMutation,
				payload,
				workspaceId,
				usertoken,
				'meeting_api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.CREATE_MEET_BOT_SUCCESS,
					payload: {
						createBotInfo: response?.[1]?.data?.startMeeting,
					},
				});
				const payload = {
					...(state?.existingBots || {}),
					data: [response?.[1]?.data?.startMeeting, ...(state?.existingBots?.data || [])],
					totalDocs: (state?.existingBots?.totalDocs ?? 0) + 1,
				};
				dispatch({
					type: Actions.GET_EXISTING_BOTS_SUCCESS,
					payload,
				});
				return response;
			}
		} catch (error) {
			console.error('error==>createMeetBot', error);
		}
	};

	const getMeetBotById = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');

			const response = await service.query(
				getMeetBotByIdQuery,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				const meetingData = response?.[1]?.data?.getMeeting;
				if (meetingData) {
					dispatch({
						type: Actions.CREATE_MEET_BOT_SUCCESS,
						payload: {
							createBotInfo: meetingData,
						},
					});
				} else {
					// Meeting not found
					dispatch({
						type: Actions.CREATE_MEET_BOT_SUCCESS,
						payload: {
							createBotInfo: null,
						},
					});
				}
				return response;
			} else {
				// API error
				dispatch({
					type: Actions.CREATE_MEET_BOT_SUCCESS,
					payload: {
						createBotInfo: null,
					},
				});
				return response;
			}
		} catch (error) {
			console.error('error==>getMeetBotById', error);
			// Network or other error
			dispatch({
				type: Actions.CREATE_MEET_BOT_SUCCESS,
				payload: {
					createBotInfo: null,
				},
			});
		}
	};

	const deleteLiveKitRoom = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.mutation(
				deleteLiveKitRoomMutation,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				return response;
			}
		} catch (error) {
			console.error('error==>deleteLiveKitRoom', error);
		}
	};

	const getMeetTranscriptHistory = async (payload, append = false) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getMeetTranscriptHistoryQuery,
				payload,
				workspaceId,
				usertoken,
				'meeting_api',
			);
			if (response?.[0]) {
				const currentPageTranscriptsList = response?.[1]?.data?.listTranscriptions?.data;
				const currentPage = response?.[1]?.data?.listTranscriptions?.currentPage;
				const hasNextPage = response?.[1]?.data?.listTranscriptions?.hasNextPage;
				const totalPages = response?.[1]?.data?.listTranscriptions?.totalPages;

				const payload = {
					data: append
						? [...(state?.transcriptHistory?.data || []), ...currentPageTranscriptsList]
						: currentPageTranscriptsList,
					hasNextPage,
					currentPage,
					totalPages,
				};
				dispatch({
					type: Actions.GET_MEET_TRANSCRIPT_HISTORY_SUCCESS,
					payload,
				});
				return response;
			}
		} catch (error) {
			console.error('error==>getMeetTranscriptHistory', error);
		}
	};

	const getAiLiveIntelligenceHistory = async (payload, append = false) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getAiLiveIntelligenceHistoryQuery,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api_database',
			);
			if (response?.[0]) {
				const currentPageAiIntelligenceList = response?.[1]?.data?.listAiIntelligence?.data;
				const currentPage = response?.[1]?.data?.listAiIntelligence?.currentPage;
				const hasNextPage = response?.[1]?.data?.listAiIntelligence?.hasNextPage;
				const totalPages = response?.[1]?.data?.listAiIntelligence?.totalPages;

				const payload = {
					data: append
						? [
								...(state?.aiLiveIntelligenceHistory?.data || []),
								...currentPageAiIntelligenceList,
						  ]
						: currentPageAiIntelligenceList,
					hasNextPage,
					currentPage,
					totalPages,
				};

				dispatch({
					type: Actions.GET_AI_LIVE_INTELLIGENCE_HISTORY_SUCCESS,
					payload,
				});

				return response;
			}
		} catch (error) {
			console.error('error==>getAiLiveIntelligenceHistory', error);
		}
	};

	const getMeetingPreferences = async () => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = `/tenant-user/${workspaceId}/tenantuser-preference?preferenceType=meetingPreference`;
			const token = localStorage.getItem('usertoken');
			const type = 'tenant';
			const response = await Service?.fetchGet(path, token, type);
			const success = response?.[0] === true;
			if (success) {
				return response?.[1];
			}
		} catch (error) {
			console.error('error==>getMeetingPreferences', error);
		}
	};

	const updateMeetingPreferences = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = `/tenant-user/${workspaceId}/tenantuser-preference`;
			const token = localStorage.getItem('usertoken');
			const type = 'tenant';
			const response = await Service?.fetchPut(path, payload, token, type);
			const success = response?.[0] === true;
			if (success) {
				return response?.[1];
			}
		} catch (error) {
			console.error('error==>updateMeetingPreferences', error);
		}
	};

	const initializeMeetingSummary = async (payload) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const usertoken = localStorage.getItem('usertoken');
			await Service?.fetchPost(
				`/${workspaceId}/generate_summary`,
				payload,
				usertoken,
				'meeting_summary_api',
			);
		} catch (error) {
			console.error('error==>initializeMeetingSummary', error);
		}
	};

	const updateStateValues = async (updatedVaribaleValuesObj) => {
		try {
			dispatch({
				type: Actions.UPDATE_STATE_VALUES_SUCCESS,
				payload: updatedVaribaleValuesObj,
			});
		} catch (error) {
			console.log('error==>updateStateValues', error);
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
		getLiveKitToken,
		getBlocks,
		createBlock,
		updateBlock,
		deleteBlock,
		createDatabase,
		createDatabaseView,
		getDatabaseRows,
		handleLoadMoreGroups,
		getDatabase,
		addDatabaseRow,
		addDatabaseField,
		updateDatabaseField,
		updateDatabaseSidebar,
		updateDatabaseRow,
		deleteDatabaseRow,
		updateDatabase,
		listAvailableDatabases,
		deleteDatabaseField,
		getDatabaseViews,
		deleteDatabaseView,
		addFilter,
		updateFilter,
		removeFilter,
		addSort,
		updateSort,
		removeSort,
		updateViewGroup,
		fetchMoreGroupData,
		getExistingBots,
		createMeetBot,
		getMeetBotById,
		deleteLiveKitRoom,
		getMeetTranscriptHistory,
		updateDatabaseView,
		getMeetSummary,
		getMeetingAnalytics,
		updateStateValues,
		getMeetingPreferences,
		updateMeetingPreferences,
		getAiLiveIntelligenceHistory,
		initializeMeetingSummary,
	};
};
