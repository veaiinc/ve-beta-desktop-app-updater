const {
	tenant_users_api,
	tenant_api,
	proposals_api,
	auth_Api,
	tenant_users_api_US,
	tenant_api_US,
	proposals_api_US,
	ai_setup_api,
	ai_setup_api_US,
} = require('./config');

const apiEndpoints = {
	tenant_users_api,
	tenant: tenant_api,
	'tenant-users': tenant_users_api,
	proposals_api,
	auth: auth_Api,
	ai_setup: ai_setup_api,
};
const apiEndpointsUS = {
	tenant_users_api: tenant_users_api_US,
	tenant: tenant_api_US,
	'tenant-users': tenant_users_api_US,
	proposals_api: proposals_api_US,
	auth: auth_Api,
	ai_setup: ai_setup_api_US,
};

const handleHeaders = (token, body, type) => {
	const headers = { 'Content-Type': 'application/json' };
	if (token) {
		headers['x-access-token'] = token;
		if (type === 'form' || type === 'ai_setup') {
			headers['Authorization'] = `Bearer ${token}`;
		}
	}
	return headers;
};

const processResponse = async (response) => {
	const jsonData = await response.json();
	if (response.status >= 200 && response.status < 300) {
		return [true, jsonData];
	} else if (response.status === 401) {
		// onUserKickedOut();
		return [false, jsonData];
	} else {
		return [response.status, jsonData];
	}
};

const apiFetch = async (url, method, body, token, type) => {
	const region = localStorage.getItem('region') || 'ap-south-1';
	const endpoint = (region === 'ap-south-1' ? apiEndpoints[type] : apiEndpointsUS?.[type]) + url;
	const headers = handleHeaders(token, body, type);
	if (body) {
		body = JSON.stringify(body);
	}
	try {
		const response = await fetch(endpoint, { method, headers, body });
		return processResponse(response);
	} catch (error) {
		onFailure('network', url);
		return [false];
	}
};

const handleParams = (params) => {
	let subUrl = '';
	if (Object.keys(params)?.length) {
		subUrl += '?';
		const keys = Object.keys(params);
		for (let i = 0; i < keys?.length; i++) {
			subUrl += `${keys[i]}=${encodeURIComponent(params[keys[i]])}&`;
		}
	}
	return subUrl;
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
	fetchPut: async (url, body, token = null, type = null) =>
		await apiFetch(url, 'PUT', body, token, type),
	fetchDelete: async (url, token = null, body = null, type = null) =>
		await apiFetch(url, 'DELETE', body, token, type),
};

const onFailure = async (res, url) => {
	console.log('API FAILED ' + url);
};

const onUserKickedOut = async (res, url) => {
	localStorage.clear();
	window.location.reload();
};

export default Service;
