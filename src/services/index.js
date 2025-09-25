import mitt from 'mitt';
import Cookies from 'js-cookie';
import { fetchDomainName } from '../helpers';
// const x_access_key = import.meta.env.VITE_APP_X_ACCESS_KEY || 'QWxsb3dBY2Nlc3NUb0ZlZWRiYWNrQVBJ';
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

const parseJson = async (resp) => {
	try {
		return await resp.json();
	} catch {
		return {};
	}
};

export const internalServerEmitter = mitt();

const refreshAccessTokenAndRetry = async (requestData) => {
	const token = Cookies.get('usertoken') ?? localStorage.getItem('usertoken');
	const region = Cookies.get('region') ?? localStorage.getItem('region') ?? 'us-east-1';
	const baseUrl = getBaseUrl({ type: 'auth', region });
	const endpoint = baseUrl + '/refresh-token';
	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-access-token': token,
			credentials: 'include',
		},
	});
	if (response.status === 200) {
		const jsonData = await parseJson(response);
		const { tokens } = jsonData;
		const { accessToken, accessTokenExpiry, refreshTokenExpiry } = tokens;
		const host = fetchDomainName();
		Cookies.set('usertoken', accessToken, { sameSite: 'lax', domain: host });
		Cookies.set('accessTokenExpiry', accessTokenExpiry, { sameSite: 'lax', domain: host });
		Cookies.set('refreshTokenExpiry', refreshTokenExpiry, {
			sameSite: 'lax',
			domain: host,
		});
		localStorage.setItem('usertoken', accessToken);
		localStorage.setItem('accessTokenExpiry', accessTokenExpiry);
		localStorage.setItem('refreshTokenExpiry', refreshTokenExpiry);

		const { endpoint, method, headers, body } = requestData;
		const resp = await fetch(endpoint, { method, headers, body });
		return await processResponse(resp, requestData);
	} else if (response.status === 401 || response.status === 403) {
		logout();
		return [false, {}, response.status];
	} else {
		const jsonData = await parseJson(response);
		return [false, jsonData, response.status];
	}
};

const processResponse = async (response, requestData) => {
	const jsonData = await parseJson(response);
	const responseStatus = response.status;
	if (responseStatus >= 200 && responseStatus < 300) {
		return [true, jsonData, responseStatus];
	} else if (responseStatus === 401 || responseStatus === 403) {
		return await refreshAccessTokenAndRetry(requestData);
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

const apiFetch = async (url, method, body, token, type, isPublicChat = false) => {
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

		const headers = handleHeaders(token, type, isPublicChat);

		const options = { method, headers };
		if (body) {
			options.body = JSON.stringify(body);
		}
		if (type === 'auth') {
			options.credentials = 'include';
		}

		const response = await fetch(endpoint, options);
		const requestData = { endpoint, ...options };
		const [success, data, status] = await processResponse(response, requestData);
		return [success, data, status];
	} catch (error) {
		console.log('Api Failed: ' + error.message);
		return [false, { message: error.message }, 500];
	}
};

const Service = {
	fetchGet: async (url, token = null, type = null, params = {}) => {
		let completeUrl = url;
		if (Object.keys(params)?.length > 0) {
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
