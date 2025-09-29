import mitt from 'mitt';
import Cookies from 'js-cookie';
import { fetchDomainName } from '../helpers';
import getBaseUrl from './baseUrls.js';
import logout from '../helpers/logout.js';

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

const handleHeaders = (token, type) => {
	const headers = { 'Content-Type': 'application/json' };

	if (token) {
		headers['x-access-token'] = token;
		if (authBearerTypes.has(type)) {
			headers['Authorization'] = `Bearer ${token}`;
		}
	}

	return headers;
};

export const internalServerEmitter = mitt();

const refreshAccessToken = async () => {
	const token = Cookies.get('usertoken') ?? localStorage.getItem('usertoken');
	const region = Cookies.get('region') ?? localStorage.getItem('region') ?? 'us-east-1';
	const baseUrl = getBaseUrl({ type: 'auth', region });
	const endpoint = baseUrl + '/refresh-token';
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': token,
		},
		credentials: 'include',
	});
	return response;
};

const refreshAccessTokenAndRetry = async (requestData) => {
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
		// retry the request with the new access token
		const { endpoint, method, body, type } = requestData;
		const headers = handleHeaders(accessToken, type);
		const resp = await fetch(endpoint, { method, headers, body });
		const success = resp.status >= 200 && resp.status < 300;
		const data = await resp.json();
		const status = resp.status;
		return [success, data, status];
	} else if (status === 401 || status === 403) {
		if (
			refreshTokenResponse.message === 'jwt expired' ||
			refreshTokenResponse.message === 'Invalid refresh token, please login again'
		) {
			logout();
			return [false, refreshTokenResponse, status];
		} else {
			return [false, refreshTokenResponse, status];
		}
	} else {
		return [false, refreshTokenResponse, status];
	}
};

const processResponse = async (response, requestData) => {
	const jsonData = await response.json();
	const responseStatus = response.status;
	if (responseStatus >= 200 && responseStatus < 300) {
		return [true, jsonData, responseStatus];
	} else if (responseStatus === 401 && jsonData.message === 'jwt expired') {
		const [success, data, status] = await refreshAccessTokenAndRetry(requestData);
		return [success, data, status];
	} else if (responseStatus === 500) {
		internalServerEmitter.emit('serverError', jsonData);
		return [false, jsonData, responseStatus];
	} else {
		return [false, jsonData, responseStatus];
	}
};

const handleParams = (params) => {
	const query = new URLSearchParams(params).toString();
	return query ? `?${query}` : '';
};

const apiFetch = async (url, method, body, token, type, abortSignal = null) => {
	try {
		const region = Cookies.get('region') ?? localStorage.getItem('region') ?? 'us-east-1';
		const baseUrl = getBaseUrl({ type, region });

		if (!baseUrl) {
			console.error(`No base URL found for type: ${type} and region: ${region}`);
			return [
				false,
				{ message: `No base URL found for type: ${type} and region: ${region}` },
				404,
			];
		}

		const endpoint = baseUrl + url;

		const headers = handleHeaders(token, type);

		let options = { method, headers };
		if (body) {
			options.body = JSON.stringify(body);
		}
		if (type === 'auth') {
			options.credentials = 'include';
		}
		if (abortSignal) {
			options.signal = abortSignal;
		}

		const response = await fetch(endpoint, options);
		const requestData = { endpoint, ...options, type };
		const [success, data, status] = await processResponse(response, requestData);
		return [success, data, status];
	} catch (error) {
		console.log('Api Failed: ' + error.message);
		return [false, { message: error.message }, 500];
	}
};

const Service = {
	fetchGet: async (url, token = null, type = null, params = {}, abortSignal = null) => {
		let completeUrl = url;
		if (Object.keys(params)?.length > 0) {
			completeUrl += handleParams(params);
		}
		return await apiFetch(completeUrl, 'GET', null, token, type, abortSignal);
	},

	fetchPost: async (url, body, token = null, type = null, abortSignal = null) =>
		await apiFetch(url, 'POST', body, token, type, abortSignal),

	fetchPut: async (url, body, token = null, type = null, abortSignal = null) =>
		await apiFetch(url, 'PUT', body, token, type, abortSignal),

	fetchDelete: async (url, token = null, body = null, type = null, abortSignal = null) =>
		await apiFetch(url, 'DELETE', body, token, type, abortSignal),
};

export default Service;
