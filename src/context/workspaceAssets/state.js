import Service from '../../services/index';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';

export const initialState = {
	workspaceImages: [],
};

export const WorkspaceAssetsState = () => {
	const [state, dispatch] = useReducer(Reducer, initialState);

	const getWorkspaceImages = async ({ page = 1, limit = 10 }) => {
		try {
			const workspaceId = localStorage.getItem('workspaceId');
			const path = `${workspaceId}/workspaceAssets-images`;
			const token = localStorage.getItem('usertoken');
			const params = {
				page,
				limit,
			};
			const type = 'workspace_images_api';
			const response = await Service.fetchGet(path, token, type, params);
			if (response?.[0]) {
				dispatch({
					type: Actions.GET_WORKSPACE_IMAGES,
					payload: response?.[1]?.data,
				});
			}
		} catch (error) {
			console.log('error in getWorkspaceImages', error);
		}
	};

	const resetWorkspaceAssetsState = () => {
		dispatch({
			type: Actions.RESET_STATE,
		});
	};

	return {
		...state,
		getWorkspaceImages,
		resetWorkspaceAssetsState,
	};
};

export default WorkspaceAssetsState;
