import Cookies from 'js-cookie';
import refreshAccessToken from './refreshAccessToken.js';
import { fetchDomainName } from '../../helpers';
import logout from '../../helpers/logout.js';

// Global shared token refresh queue to prevent multiple concurrent refresh token calls
// across both REST and GraphQL services
let sharedRefreshTokenPromise = null;

const performSharedTokenRefresh = async () => {
	const response = await refreshAccessToken();
	const status = response.status;
	const refreshTokenResponse = await response.json();

	if (status === 200) {
		// set the new access token and access token expiry
		const { tokens } = refreshTokenResponse;
		const { accessToken, accessTokenExpiry } = tokens;
		const host = fetchDomainName();
		Cookies.set('usertoken', accessToken, { sameSite: 'lax', domain: host });
		Cookies.set('accessTokenExpiry', accessTokenExpiry, { sameSite: 'lax', domain: host });
		localStorage.setItem('usertoken', accessToken);
		localStorage.setItem('accessTokenExpiry', accessTokenExpiry);
		return { success: true, accessToken, refreshTokenResponse, status };
	} else if (status === 401 || status === 403) {
		if (
			refreshTokenResponse.message === 'jwt expired' ||
			refreshTokenResponse.message === 'Invalid refresh token, please login again'
		) {
			logout();
			return { success: false, refreshTokenResponse, status };
		} else {
			return { success: false, refreshTokenResponse, status };
		}
	} else {
		return { success: false, refreshTokenResponse, status };
	}
};

/**
 * Shared token refresh function that ensures only one refresh token call happens
 * across all services (REST and GraphQL) at any given time
 * @returns {Promise<{success: boolean, accessToken?: string, refreshTokenResponse?: any, status?: number}>}
 */
export const getSharedRefreshToken = async () => {
	// If there's already a refresh token call in progress, wait for it
	if (sharedRefreshTokenPromise) {
		return await sharedRefreshTokenPromise;
	}

	// Start a new refresh token call
	sharedRefreshTokenPromise = performSharedTokenRefresh();

	try {
		return await sharedRefreshTokenPromise;
	} finally {
		// Clear the promise so future calls can start a new refresh if needed
		sharedRefreshTokenPromise = null;
	}
};

export default getSharedRefreshToken;
