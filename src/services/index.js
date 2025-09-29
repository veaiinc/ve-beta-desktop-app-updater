import mitt from 'mitt';
import Cookies from 'js-cookie';

// const x_access_key = import.meta.env.VITE_APP_X_ACCESS_KEY || 'QWxsb3dBY2Nlc3NUb0ZlZWRiYWNrQVBJ';
import getBaseUrl from './baseUrls.js';

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
		},
		credentials: 'include',
	});
	if (response.status === 200) {
		const jsonData = await response.json();
		const { tokens } = jsonData;
		const { accessToken, accessTokenExpiry } = tokens;
		const host = fetchDomainName();
		Cookies.set('usertoken', accessToken, { sameSite: 'lax', domain: host });
		Cookies.set('accessTokenExpiry', accessTokenExpiry, { sameSite: 'lax', domain: host });
		localStorage.setItem('usertoken', accessToken);
		localStorage.setItem('accessTokenExpiry', accessTokenExpiry);

		const { endpoint, method, headers, body } = requestData;
		const resp = await fetch(endpoint, { method, headers, body });
		return await processResponse(resp, requestData, true);
	} else if (response.status === 401 || response.status === 403) {
		logout();
		return [false, {}, response.status];
	} else {
		const jsonData = await response.json();
		return [false, jsonData, response.status];
	}
};

const processResponse = async (response, requestData, shouldExit = false) => {
	if (shouldExit) logout();
	const jsonData = await response.json();
	const responseStatus = response.status;
	if (responseStatus >= 200 && responseStatus < 300) {
		return [true, jsonData, responseStatus];
	} else if (responseStatus === 401 || responseStatus === 403) {
		return await refreshAccessTokenAndRetry(requestData);
	} else if (responseStatus === 500) {
		internalServerEmitter.emit('serverError', jsonData);
		return [false, jsonData];
	} else {
		return [response.status, jsonData];
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
		return await processResponse(response);
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
