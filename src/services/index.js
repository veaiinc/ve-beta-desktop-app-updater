import mitt from 'mitt';
import Cookies from 'js-cookie';

// const x_access_key = import.meta.env.VITE_APP_X_ACCESS_KEY || 'QWxsb3dBY2Nlc3NUb0ZlZWRiYWNrQVBJ';
import getBaseUrl from './baseUrls.js';
import logout from '../helpers/logout.js';
import { fetchDomainName } from '../helpers/index.jsx';

const authBearerTypes = new Set([
	'form',
	'ai_setup',
	'ai_predictions',
	'calendar_chat',
	'slack_api',
	'elastic_search_api',
	'microsoft_integration_api',
	'meeting_summary_api',
	'generate_voice_agent_token_api',
]);

const handleHeaders = (token, type, isPublicChat = false) => {
	const headers = { 'Content-Type': 'application/json' };

	if (token) {
		headers['x-access-token'] = token;
		if (authBearerTypes.has(type)) {
			headers['Authorization'] = `Bearer ${token}`;
		}
	}

	// if (isPublicChat && type === 'ai_assistant_api') {
	// 	headers['x-access-key'] = x_access_key;
	// }

	return headers;
};

export const internalServerEmitter = mitt();

let isRefreshing = false;
let refreshPromise = null;

const processResponse = async (response, requestInit, endpoint, type, isPublicChat) => {
	try {
		const jsonData = await response.json();

		if (response.status >= 200 && response.status < 300) {
			return [true, jsonData];
		} else if (response.status === 401) {
			try {
				// ensure only one refresh at a time
				if (!isRefreshing) {
					isRefreshing = true;
					refreshPromise = getNewAccessToken()
						.then((res) => {
							isRefreshing = false;
							return res;
						})
						.catch((err) => {
							isRefreshing = false;
							throw err;
						});
				}

				const [success, data] = await refreshPromise;

				if (success) {
					const { tokens } = data;
					const host = fetchDomainName();

					// update tokens
					localStorage.setItem('usertoken', tokens.accessToken);
					localStorage.setItem('refreshToken', tokens.refreshToken);
					localStorage.setItem('accessTokenExpiry', tokens.accessTokenExpiry);
					localStorage.setItem('refreshTokenExpiry', tokens.refreshTokenExpiry);

					Cookies.set('usertoken', tokens.accessToken, { sameSite: 'lax', domain: host });
					Cookies.set('refreshToken', tokens.refreshToken, {
						sameSite: 'lax',
						domain: host,
					});
					Cookies.set('accessTokenExpiry', tokens.accessTokenExpiry, {
						sameSite: 'lax',
						domain: host,
					});
					Cookies.set('refreshTokenExpiry', tokens.refreshTokenExpiry, {
						sameSite: 'lax',
						domain: host,
					});

					// retry original request with new token
					const retryHeaders = handleHeaders(tokens.accessToken, type, isPublicChat);
					const retryResponse = await fetch(endpoint, {
						...requestInit,
						headers: retryHeaders,
					});
					return await processResponse(
						retryResponse,
						requestInit,
						endpoint,
						type,
						isPublicChat,
					);
				} else {
					await logout();
					return [false, { message: 'Session expired. Please log in again.' }];
				}
			} catch (refreshError) {
				console.error('Token refresh failed:', refreshError);
				await logout();
				return [false, { message: 'Session expired. Please log in again.' }];
			}
		} else if (response.status === 500) {
			internalServerEmitter.emit('serverError', jsonData);
			return [false, jsonData];
		} else {
			return [response.status, jsonData];
		}
	} catch (error) {
		console.error('processResponse failed:', error);
		return [false, { message: error.message || 'Unexpected error' }];
	}
};

const handleParams = (params) => {
	let subUrl = '';
	if (Object.keys(params)?.length) {
		subUrl += '?';
		const keys = Object.keys(params);
		for (let i = 0; i < keys.length; i++) {
			subUrl += `${keys[i]}=${encodeURIComponent(params[keys[i]])}&`;
		}
	}
	return subUrl;
};

const apiFetch = async (url, method, body, token, type, isPublicChat = false) => {
	try {
		const region = Cookies.get('region') ?? localStorage.getItem('region') ?? 'us-east-1';
		const baseUrl = getBaseUrl({ type, region });

		if (!baseUrl) {
			console.error(`No base URL found for type: ${type} and region: ${region}`);
			return [
				false,
				{ message: `No base URL found for type: ${type} and region: ${region}` },
			];
		}

		const endpoint = baseUrl + url;

		const headers = handleHeaders(token, type, isPublicChat);

		body && (body = JSON.stringify(body));

		const requestInit =
			type === 'auth'
				? { method, headers, body, credentials: 'include' }
				: { method, headers, body };
		const response = await fetch(endpoint, requestInit);
		return await processResponse(response, requestInit, endpoint, type, isPublicChat);
	} catch (error) {
		console.log('Api Failed: ' + error.message);
		return [false];
	}
};

const Service = {
	fetchGet: async (url, token = null, type = null, params = {}) => {
		let completeUrl = url;
		if (Object.keys(params)?.length) {
			completeUrl += handleParams(params);
		}
		return await apiFetch(completeUrl, 'GET', null, token, type);
	},

	fetchPost: async (url, body, token = null, type = null) =>
		await apiFetch(url, 'POST', body, token, type),

	fetchPut: async (url, body, token = null, type = null, isPublicChat = false) =>
		await apiFetch(url, 'PUT', body, token, type, isPublicChat),

	fetchDelete: async (url, token = null, body = null, type = null) =>
		await apiFetch(url, 'DELETE', body, token, type),
};

export default Service;
