import service from '../../services/graphQlServices';
import { message } from 'antd';
import {
	getNotesListQuery,
	createNotesQuery,
	getPageQuery,
	saveNotesPageQuery,
	getNotesAccessQuery,
	addNotesAccessMutation,
	changeNotesAccessMutation,
	updatePageMutation,
	removeNotesAccessMutation,
} from './graphQlFunctions';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './action';

export const intialState = {
	notes: null,
	moreNotes: null,
	notesPageData: null,
	notesAccess: null,
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
					payload: response?.[1]?.data?.listPrivatePages,
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
				createNotesQuery,
				payload,
				workspaceId,
				usertoken,
				'page_notes_api',
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
				dispatch({
					type: Actions.GET_NOTES_PAGE_DATA_SUCCESS,
					payload: response?.[1]?.data?.getPage,
				});
			} else {
				console.log('Api failed ==>getNotesPageData', response);
			}
		} catch (error) {
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

	const updateNotesState = (payload) => {
		dispatch({
			type: Actions.UPDATE_NOTES_STATE,
			payload,
		});
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
	};
};
