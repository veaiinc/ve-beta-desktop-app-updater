import * as API from './actionTypes';

import service from '../../src/services/index';

/*

    -------------------------------------
                Login Actions
    -------------------------------------
    
*/
export const verifyUserUsingEmail = async (payload) => {
	return await service.fetchGet(
		`${API.USERS_LOGIN.VERIFY_EMAIL_EXISTS}${payload}`,
		null,
		'tenant_users_api',
	);
};
