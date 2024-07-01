import * as API from './actionTypes';
import Service from '../../services/index';
import { useReducer } from 'react';
import Reducer from './reducer';

export const UserLoginState = (props) => {
    const intialState = {};
    const [state, dispatch] = useReducer(Reducer, intialState);

    const verifyAccountExistsUsingEmail = async (email) => {
        let response = await Service.fetchGet(
            `${API.USERS_LOGIN.VERIFY_EMAIL_EXISTS}${email}`,
            null,
            'tenant_users_api',
        );

        if (response[0]) {
            return [true, response[1]];
        } else {
            return [false, response?.[1]?.message];
        }
    };

    const createUsersAccount = async (payload) => {
        let response = await Service.fetchPost(
            `${API.USERS_LOGIN.SIGNUP}`,
            payload,
            null,
            'tenant_users_api',
        );

        if (response[0] === true) {
            return [true, response[1]];
        } else {
            return [false, response[1]];
        }
    };

    const verifyUserEmailCode = async (payload) => {
        let response = await Service.fetchPost(
            `${API.USERS_LOGIN.VERIFY_SIGNUP_CODE}`,
            payload,
            null,
            'tenant_users_api',
        );

        if (response[0] === true) {
            return [true, response[1]];
        } else {
            return [false, response[1]];
        }
    };

    const userLogin = async (payload) => {
        let response = await Service.fetchPost(
            `${API.USERS_LOGIN.LOGIN}`,
            payload,
            null,
            'tenant_users_api',
        );

        const { accessToken, accessibleWorkspaces } = response?.[1] || {};

        localStorage.setItem('usertoken', accessToken);
        localStorage.setItem('accessibleWorkspaces', JSON.stringify(accessibleWorkspaces));
        localStorage.setItem('workspaceId', accessibleWorkspaces?.[0]);

        if (response[0] === true) {
            return [true];
        } else {
            return [false];
        }
    };

    return {
        verifyAccountExistsUsingEmail,
        createUsersAccount,
        verifyUserEmailCode,
        userLogin,
    };
};
