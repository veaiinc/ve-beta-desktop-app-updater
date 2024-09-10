const {
	tenant_users_api,
	tenant_api,
	proposals_api,
	auth_Api,
	tenant_users_api_US,
	tenant_api_US,
	proposals_api_US,
} = require('./config');

const apiEndpoints = {
	tenant_users_api,
	tenant: tenant_api,
	'tenant-users': tenant_users_api,
	proposals_api,
	auth: auth_Api,
};
const apiEndpointsUS = {
	tenant_users_api: tenant_users_api_US,
	tenant: tenant_api_US,
	'tenant-users': tenant_users_api_US,
	proposals_api: proposals_api_US,
	auth: auth_Api,
};

const handleHeaders = (token, body, type) => {
	const headers = { 'Content-Type': 'application/json' };
	if (token) {
		headers['x-access-token'] = token;
		if (type === 'form') {
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
		console.log('Hellow rold');
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

const Service = {
	fetchGet: (url, token = null, type = null) => apiFetch(url, 'GET', null, token, type),
	fetchPost: (url, body, token = null, type = null) => apiFetch(url, 'POST', body, token, type),
	fetchPut: (url, body, token = null, type = null) => apiFetch(url, 'PUT', body, token, type),
	fetchDelete: (url, token = null, body = null, type = null) =>
		apiFetch(url, 'DELETE', body, token, type),
};

const onFailure = async (res, url) => {
	console.log('API FAILED ' + url);
};

const onUserKickedOut = async (res, url) => {
	localStorage.clear();
	window.location.reload();
};

export default Service;
