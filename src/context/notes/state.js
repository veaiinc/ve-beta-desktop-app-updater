import service from '../../services/graphQlServices';
import { message } from 'antd';
import { getNotesListQuery, createNotesQuery } from './graphQlFunctions';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './action';

export const intialState = {
	notes: null,
	moreNotes: null,
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

	return {
		...state,
		getNotesList,
		createNotesList,
	};
};
