import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './action';

export const initialState = {
	noteContent: '',
};

export const DocumentPreviewState = () => {
	const [state, dispatch] = useReducer(Reducer, initialState);

	const setNoteContent = (payload) => {
		dispatch({
			type: Actions.SET_NOTE_CONTENT,
			payload,
		});
	};

	const resetDocumentPreviewState = () => {
		dispatch({
			type: Actions.RESET_STATE,
		});
	};

	return {
		...state,
		setNoteContent,
		resetDocumentPreviewState,
	};
};
