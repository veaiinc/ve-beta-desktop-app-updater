import { useReducer } from 'react';
import Reducer from './reducer';
import { Actions } from './actions';
import * as API from '../../controllers/oldActionTypes';
import jwt_decode from 'jwt-decode';
import service from '../../services/index';

export const ProfileState = () => {
    const intialState = {};

    const [state, dispatch] = useReducer(Reducer, intialState);

    let usertoken = localStorage.getItem('usertoken');
    let workspaceId = localStorage.getItem('workspaceId');
    let decoded = jwt_decode(usertoken);
    console.log(decoded, 'this is from the state');
    const getTenantSettings = async () => {
        try {
            const response = await service.fetchGet(`/${workspaceId}`, usertoken, 'tenant');
            return response;
        } catch (error) {
            console.log('error==>getAllUsersFromMeta', error);
        }
    };
    const getUserDetails = async () => {
        try {
            const userDetails = await service.fetchGet(
                API.TENANTS.myProfile,
                usertoken,
                'tenant-users',
            );
            console.log(userDetails, 'these tensts are from the functions');
            return userDetails;
        } catch (error) {
            console.log('error==>getAllUsersFromMeta', error);
        }
    };
    const getTenantUserDetails = async () => {
        try {
            const responseData = await service.fetchGet(
                '/' + workspaceId + API.TENANTS.tenantUsers + '/' + decoded.user_id,
                usertoken,
                'tenant',
            );
            console.log(responseData, 'this is the data');
            return responseData;
        } catch (error) {
            console.log('error==>getAllUsersFromMeta', error);
        }
    };
    const get2FAQrCode = async () => {
        const qrCode = await service.fetchGet(
            API.TENANT_USER_LOGIN_SIGNUP_API.set2FASettings +
                API.TENANT_USER_LOGIN_SIGNUP_API.googleAuthenticator +
                API.TENANT_USER_LOGIN_SIGNUP_API.qrCode,
            usertoken,
            'tenant-users',
        );
        return qrCode;
        console.log(qrCode);
    };

    return {
        ...state,
        getTenantSettings,
        getUserDetails,
        getTenantUserDetails,
        get2FAQrCode,
    };
};
