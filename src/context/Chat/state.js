import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './action';
import {
	getAllUsersFromMetaDataApi,
	getAllUsersConversationApi,
	markUnreadMessagesApi,
	getPageInfoApi,
	getChatFiltersCountApi,
} from './graphQlFunctions';
import Service from '../../services/graphQlServices';

export const intialState = {
	usersList: null,
	moreUsersList: null,
	messages: null,
	moreMessages: null,
	pageInfoData: null,
	chatFiltersCount: null,
};

export const ChatState = (props) => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const getAllUsersFromMeta = async (workspaceID, payload, fetchMore = false) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const response = await Service.query(
				getAllUsersFromMetaDataApi,
				payload,
				workspaceID,
				usertoken,
				've_conversations_api',
			);
			const variableSelection = fetchMore ? 'moreUsersList' : 'usersList';

			if (response?.[0]) {
				const payload = response?.[1]?.data?.pageUsersList;
				dispatch({
					type: Actions.GET_USERS_FROM_META_SUCCESS,
					payload,
					variableSelection,
				});
			} else {
				dispatch({
					type: Actions.GET_USERS_FROM_META_FAILURE,
					payload: response?.[1]?.message || 'Something went wrong ',
				});
			}
		} catch (error) {
			console.log('error==>getAllUsersFromMeta', error);
		}
	};

	const getAllUsersConversation = async (workspaceID, payload, fetchMore = false) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const response = await Service.query(
				getAllUsersConversationApi,
				payload,
				workspaceID,
				usertoken,
				've_conversations_api',
			);
			const variableSelection = fetchMore ? 'moreMessages' : 'messages';

			if (response?.[0]) {
				const payload = response?.[1]?.data?.getConversations;

				dispatch({
					type: Actions.GET_USERS_ALL_CONVERSATIONS_SUCCESS,
					payload,
					variableSelection,
				});
			} else {
				dispatch({
					type: Actions.GET_USERS_ALL_CONVERSATIONS_FAILURE,
					payload: response?.[1]?.message || 'Something went wrong ',
				});
			}
		} catch (error) {
			console.log('error==>getAllUsersConversation', error);
		}
	};

	const markUnreadMessages = async (workspaceID, payload) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const response = await Service.query(
				markUnreadMessagesApi,
				payload,
				workspaceID,
				usertoken,
				've_conversations_api',
			);

			if (response?.[0]) {
				return [true];
			} else {
				console.log('api failed', response);
				return [false];
			}
		} catch (error) {
			console.log('error==>markUnreadMessages', error);
		}
	};

	const getPageInfo = async (payload) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const workspaceId = localStorage.getItem('workspaceId');
			const response = await Service.query(
				getPageInfoApi,
				payload,
				workspaceId,
				usertoken,
				've_conversations_api',
			);
			if (response?.[0]) {
				dispatch({
					type: Actions.GET_PAGEINFO_DATA_SUCCESS,
					payload: response?.[1]?.data?.getPages,
				});
			}
		} catch (error) {
			console.log('error==>getPageInfo', error);
		}
	};

	const getChatFiltersCount = async (workspaceId, payload) => {
		try {
			const usertoken = localStorage.getItem('usertoken');
			const response = await Service.query(
				getChatFiltersCountApi,
				payload,
				workspaceId,
				usertoken,
				've_conversations_api',
			);
			if (response?.[0]) {
				const data = response?.[1]?.data?.conversationsDefaultFilters;
				const obj = {};
				for (let i = 0; i < data.length; i++) {
					if (data?.[i]?.platform !== null) {
						obj[data?.[i]?.platform] = data?.[i]?.count;
					}
				}

				dispatch({
					type: Actions.GET_PAGEINFO_CHAT_FILTERS_COUNT_SUCCESS,
					payload: obj,
				});
			} else {
				console.log('api failed getChatFiltersCount', response);
				return [false];
			}
		} catch (error) {
			console.log('error==>getChatFiltersCount', error);
		}
	};

	const resetChatState = async () => {
		try {
			dispatch({ type: Actions.RESET_STATE });
		} catch (error) {
			console.log('error==>resetChatState', error);
		}
	};

	return {
		...state,
		getAllUsersFromMeta,
		getAllUsersConversation,
		markUnreadMessages,
		getPageInfo,
		getChatFiltersCount,
		resetChatState,
	};
};
