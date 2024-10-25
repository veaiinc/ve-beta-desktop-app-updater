import service from '../../services/graphQlServices';
import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';
import {
	getSmartFileActivityQuery,
	getSmartFileViewersQuery,
	getViewersSessionDetailsQuery,
} from './graphQlFunctions';

export const initialActivityState = {
	activityData: null,
	viewersList: null,
	viewerSessionDetails: null,
	loading: true, // TODO: remove loading state
};

export const ActivityState = (props) => {
	const [state, dispatch] = useReducer(Reducer, initialActivityState);

	const getSmartFileActivity = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getSmartFileActivityQuery,
				payload,
				workspaceId,
				usertoken,
				'activity_api',
			);

			if (response?.[0]) {
				dispatch({
					type: Actions.GET_SMART_FILE_ACTIVITY_SUCCESS,
					payload: response?.[1]?.data?.getSmartFileSummary,
				});
			} else {
				console.log('API failed ==> getSmartFileActivity', response);
			}
		} catch (error) {
			console.log('API Error ==> getSmartFileActivity', error);
		}
	};

	const getSmartFileViewers = async (payload) => {
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getSmartFileViewersQuery,
				payload,
				workspaceId,
				usertoken,
				'activity_api',
			);

			if (response?.[0]) {
				dispatch({
					type: Actions.GET_SMART_FILE_VIEWERS_SUCCESS,
					payload: response?.[1]?.data?.getSmartFileViewers,
				});
			} else {
				console.log('API failed ==> getSmartFileViewers', response);
			}
		} catch (error) {
			console.log('API Error ==> getSmartFileViewers', error);
		}
	};

	const getViewersSessionDetails = async (payload) => {
		console.log('getViewersSessionDetails:', payload);
		try {
			let workspaceId = localStorage.getItem('workspaceId');
			let usertoken = localStorage.getItem('usertoken');
			const response = await service.query(
				getViewersSessionDetailsQuery,
				payload,
				workspaceId,
				usertoken,
				'activity_api',
			);

			if (response?.[0]) {
				dispatch({
					type: Actions.GET_VIEWERS_SESSION_DETAILS_SUCCESS,
					payload: response?.[1]?.data?.getSessionSummary,
				});
			} else {
				console.log('API failed ==> getViewersSessionDetails', response);
			}
		} catch (error) {
			console.log('API Error ==> getViewersSessionDetails', error);
		}
	};

	const resetActivityState = () => {
		dispatch({ type: Actions.RESET_ACTIVITY_STATE });
	};

	return {
		...state,
		getSmartFileActivity,
		getSmartFileViewers,
		getViewersSessionDetails,
		resetActivityState,
	};
};
