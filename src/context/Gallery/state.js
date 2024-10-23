import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './action';
import * as API from './actionTypes';
import jwt_decode from 'jwt-decode';
import service from '../../services/index';
import axios from 'axios';
export const intialState = {
	tenantGalleries: null,
};

export const Galleries = () => {
	const [state, dispatch] = useReducer(Reducer, intialState);

	const getGalleries = async (params) => {
		console.log('this is triggerd in gallery');
		try {
			let usertoken = localStorage.getItem('usertoken');
			let workspaceId = localStorage.getItem('workspaceId');
			const response = await service.fetchGet(
				`/${workspaceId}/${API.GALLERY.galleries}`,
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

	return {
		...state,
		getGalleries,
	};
};
