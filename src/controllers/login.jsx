import * as Actions from './actions';

export const verifyAccountExistsUsingEmail = async (email) => {
    let response = await Actions.verifyUserUsingEmail(email);
    return response;
};
