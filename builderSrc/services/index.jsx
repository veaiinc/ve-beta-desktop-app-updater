import Cookies from 'js-cookie';
import getBuilderSrcSharedRefreshToken from './utils/sharedTokenRefresh.js';

const authBearerTypes = new Set(['form', 'design_builder_api_server']);

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

const refreshAccessTokenAndRetry = async (requestData) => {
	const refreshResult = await getBuilderSrcSharedRefreshToken();

	// If refresh failed, return the error
	if (!refreshResult.success) {
		return [false, refreshResult.refreshTokenResponse, refreshResult.status];
	}

	// If refresh succeeded, retry the original request with new token
	const { endpoint, method, body, type } = requestData;
	const headers = handleHeaders(refreshResult.accessToken, type);
	const resp = await fetch(endpoint, { method, headers, body });
	const success = resp.status >= 200 && resp.status < 300;
	const data = await resp.json();
	const status = resp.status;
	return [success, data, status];
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
		return [false, jsonData, responseStatus];
	} else {
		return [false, jsonData, responseStatus];
	}
};

import {
	proposal_api_server,
	tenant_api_server,
	images_api_server,
	graphql_server,
	proposal_api_server_US,
	tenant_api_server_US,
	images_api_server_US,
	ai_assistant_api_server,
	ai_assistant_api_server_US,
	image_generation_api_server,
	image_generation_api_server_US,
	generate_template_api_server,
	generate_template_api_server_US,
	graphql_server_US,
	design_builder_api_server,
	design_builder_api_server_US,
	calendar_api,
	calendar_api_US,
	auth_Api,
	ai_assistant_api,
	ai_assistant_api_US,
	activity_api,
	activity_api_US,
} from './config';

const apiEndPointMapper = {
	proposal: proposal_api_server,
	tenant: tenant_api_server,
	aiAssistant: ai_assistant_api_server,
	aiAssistantImage: image_generation_api_server,
	generateTemplate: generate_template_api_server,
	graphql_server,
	design_builder_api_server,
	calendar: calendar_api,
	auth: auth_Api,
	ai_assistant_api,
	activity_api,
};
const apiEndPointMapperUS = {
	proposal: proposal_api_server_US,
	tenant: tenant_api_server_US,
	aiAssistant: ai_assistant_api_server_US,
	aiAssistantImage: image_generation_api_server_US,
	generateTemplate: generate_template_api_server_US,
	graphql_server: graphql_server_US,
	design_builder_api_server: design_builder_api_server_US,
	calendar: calendar_api_US,
	auth: auth_Api,
	ai_assistant_api: ai_assistant_api_US,
	activity_api: activity_api_US,
};

const Service = {
	fetchGet: async (url, token = null, type = null, body = null) => {
		try {
			const region = Cookies.get('region') ?? localStorage.getItem('region') ?? 'us-east-1';
			let baseUrl;

			if (region === 'ap-south-1') {
				baseUrl = apiEndPointMapper?.[type] ? apiEndPointMapper?.[type] : images_api_server;
			} else {
				baseUrl = apiEndPointMapperUS?.[type]
					? apiEndPointMapperUS?.[type]
					: images_api_server_US;
			}

			const endpoint = baseUrl + url;
			const headers = handleHeaders(token, type);

			if (body) {
				headers['body'] = JSON.stringify(body);
			}

			const response = await fetch(endpoint, { method: 'GET', headers });
			const requestData = { endpoint, method: 'GET', headers, body, type };
			const [success, data, status] = await processResponse(response, requestData);
			return [success, data, status];
		} catch (error) {
			console.log('Api Failed: ' + error.message);
			return [false, { message: error.message }, 500];
		}
	},

	fetchPost: async (url, body, token = null, type = null) => {
		try {
			const region = Cookies.get('region') ?? localStorage.getItem('region') ?? 'us-east-1';
			let baseUrl;

			if (region === 'ap-south-1') {
				baseUrl = apiEndPointMapper?.[type] ? apiEndPointMapper?.[type] : images_api_server;
			} else {
				baseUrl = apiEndPointMapperUS?.[type]
					? apiEndPointMapperUS?.[type]
					: images_api_server_US;
			}

			const endpoint = baseUrl + url;
			const headers = handleHeaders(token, type);

			const response = await fetch(endpoint, {
				method: 'POST',
				headers,
				body: JSON.stringify(body),
			});

			const requestData = { endpoint, method: 'POST', headers, body, type };
			const [success, data, status] = await processResponse(response, requestData);
			return [success, data, status];
		} catch (error) {
			console.log('Api Failed: ' + error.message);
			return [false, { message: error.message }, 500];
		}
	},

	fetchPut: async (url, body, token = null, type = null) => {
		try {
			const region = Cookies.get('region') ?? localStorage.getItem('region') ?? 'us-east-1';
			let baseUrl;

			if (region === 'ap-south-1') {
				baseUrl = apiEndPointMapper?.[type] ? apiEndPointMapper?.[type] : images_api_server;
			} else {
				baseUrl = apiEndPointMapperUS?.[type]
					? apiEndPointMapperUS?.[type]
					: images_api_server_US;
			}

			const endpoint = baseUrl + url;
			const headers = handleHeaders(token, type);

			const response = await fetch(endpoint, {
				method: 'PUT',
				headers,
				body: JSON.stringify(body),
			});

			const requestData = { endpoint, method: 'PUT', headers, body, type };
			const [success, data, status] = await processResponse(response, requestData);
			return [success, data, status];
		} catch (error) {
			console.log('Api Failed: ' + error.message);
			return [false, { message: error.message }, 500];
		}
	},

	fetchDelete: async (url, token = null, body = null, type = null) => {
		try {
			const region = Cookies.get('region') ?? localStorage.getItem('region') ?? 'us-east-1';
			let baseUrl;

			if (region === 'ap-south-1') {
				baseUrl = apiEndPointMapper?.[type] ? apiEndPointMapper?.[type] : images_api_server;
			} else {
				baseUrl = apiEndPointMapperUS?.[type]
					? apiEndPointMapperUS?.[type]
					: images_api_server_US;
			}

			const endpoint = baseUrl + url;
			const headers = handleHeaders(token, type);

			if (type === 'proposal') {
				headers['x-api-key'] = 'MEayJjUZQ9DedOGVbSBA6d5ovx6REAIh';
			}

			let options = {
				method: 'DELETE',
				headers,
			};

			if (body != null) {
				options.body = JSON.stringify(body);
			}

			const response = await fetch(endpoint, options);
			const requestData = { endpoint, ...options, type };
			const [success, data, status] = await processResponse(response, requestData);
			return [success, data, status];
		} catch (error) {
			console.log('Api Failed: ' + error.message);
			return [false, { message: error.message }, 500];
		}
	},

	fetchPostFiles: async (url, body, token = null, type = null) => {
		try {
			const region = Cookies.get('region') ?? localStorage.getItem('region') ?? 'us-east-1';
			let baseUrl;

			if (region === 'ap-south-1') {
				baseUrl = apiEndPointMapper?.[type] ? apiEndPointMapper?.[type] : images_api_server;
			} else {
				baseUrl = apiEndPointMapperUS?.[type]
					? apiEndPointMapperUS?.[type]
					: images_api_server_US;
			}

			const endpoint = baseUrl + url;
			const headers = {};

			if (token) {
				if (type === 'form') {
					headers['Authorization'] = `Bearer ${token}`;
				} else {
					headers['x-access-token'] = token;
				}
			}

			const response = await fetch(endpoint, {
				method: 'POST',
				headers,
				body,
			});

			const requestData = { endpoint, method: 'POST', headers, body, type };
			const [success, data, status] = await processResponse(response, requestData);
			return [success, data, status];
		} catch (error) {
			console.log('Api Failed: ' + error.message);
			return [false, { message: error.message }, 500];
		}
	},
};

export default Service;
