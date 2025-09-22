import mitt from 'mitt';
const DEV_ENVIRONMENT = import.meta.env.VITE_APP_DEV_ENVIRONMENT || 'development';

async function loadConfig() {
	if (DEV_ENVIRONMENT === 'production') {
		return await import('./config.live.js');
	} else {
		return await import('./config.dev.js');
	}
}

let cachedConfig = null;
async function getConfig() {
	if (!cachedConfig) {
		cachedConfig = await loadConfig();
	}
	return cachedConfig;
}
export { getConfig };

const handleHeaders = (token, body, type, isPublicChat = false) => {
	const headers = { 'Content-Type': 'application/json' };
	const x_access_key = 'QWxsb3dBY2Nlc3NUb0ZlZWRiYWNrQVBJ';

	if (token) {
		headers['x-access-token'] = token;
		if (
			type === 'form' ||
			type === 'ai_setup' ||
			type === 'ai_predictions' ||
			type === 'calendar_chat' ||
			type === 'slack_api' ||
			type === 'elastic_search_api' ||
			type === 'microsoft_integration_api' ||
			type === 'meeting_summary_api' ||
			type === 'generate_voice_agent_token_api'
		) {
			headers['Authorization'] = `Bearer ${token}`;
		}
	}

	if (isPublicChat && type === 'ai_assistant_api') {
		headers['x-access-key'] = x_access_key;
	}

	return headers;
};

export const internalServerEmitter = mitt();

const processResponse = async (response) => {
	const jsonData = await response.json();
	if (response.status >= 200 && response.status < 300) {
		return [true, jsonData];
	} else if (response.status === 401) {
		// onUserKickedOut();
		return [false, jsonData];
	} else if (response.status === 500) {
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

const onFailure = async (res, url) => {
	console.log('API FAILED ' + url);
};

const onUserKickedOut = async (res, url) => {
	localStorage.clear();
	window.location.reload();
};

const apiFetch = async (url, method, body, token, type, isPublicChat = false) => {
	try {
		const config = await getConfig();

		const {
			tenant_users_api,
			tenant_api,
			proposals_api,
			auth_Api,
			auth_Api_US,
			tenant_users_api_US,
			tenant_api_US,
			proposals_api_US,
			galleries,
			ai_assistant_api,
			ai_assistant_api_US,
			galleries_api_US,
			ai_predictions_US,
			ai_predictions,
			calendar_api,
			calendar_api_US,
			third_party_integrations_api,
			third_party_integrations_api_US,
			microsoft_integration_api,
			microsoft_integration_api_US,
			slack_api,
			slack_api_US,
			workflows_Api,
			workflows_Api_US,
			multi_agent_chat,
			multi_agent_chat_US,
			automation_builder_api,
			automation_builder_api_US,
			elastic_search_api,
			elastic_search_api_US,
			workspace_images_api,
			workspace_images_api_US,
			custom_domain_api,
			custom_domain_api_US,
			browser_api,
			browser_api_US,
			meeting_summary_api,
			meeting_summary_api_US,
			generate_voice_agent_token_api,
		} = config;

		const apiEndpoints = {
			tenant_users_api,
			tenant: tenant_api,
			'tenant-users': tenant_users_api,
			proposals_api,
			auth: auth_Api,
			galleries,
			ai_assistant_api,
			ai_predictions,
			calendar_chat: ai_predictions,
			calendar_api,
			third_party_integrations_api,
			microsoft_integration_api,
			slack_api,
			workflow: workflows_Api,
			multi_agent_chat,
			automation_builder_api,
			elastic_search_api,
			workspace_images_api,
			custom_domain_api,
			browser_api,
			meeting_summary_api,
			generate_voice_agent_token_api,
		};

		const apiEndpointsUS = {
			tenant_users_api: tenant_users_api_US,
			tenant: tenant_api_US,
			'tenant-users': tenant_users_api_US,
			proposals_api: proposals_api_US,
			auth: auth_Api_US,
			ai_assistant_api: ai_assistant_api_US,
			galleries: galleries_api_US,
			ai_predictions: ai_predictions_US,
			calendar_chat: ai_predictions_US,
			calendar_api: calendar_api_US,
			third_party_integrations_api: third_party_integrations_api_US,
			microsoft_integration_api: microsoft_integration_api_US,
			slack_api: slack_api_US,
			workflow: workflows_Api_US,
			multi_agent_chat: multi_agent_chat_US,
			automation_builder_api: automation_builder_api_US,
			elastic_search_api: elastic_search_api_US,
			workspace_images_api: workspace_images_api_US,
			custom_domain_api: custom_domain_api_US,
			browser_api: browser_api_US,
			meeting_summary_api: meeting_summary_api_US,
			generate_voice_agent_token_api,
		};

		const region = localStorage.getItem('region') || 'us-east-1';
		const endpoint =
			(region === 'ap-south-1' ? apiEndpoints[type] : apiEndpointsUS?.[type]) + url;

		const headers = handleHeaders(token, body, type, isPublicChat);

		body && (body = JSON.stringify(body));

		const requestInit =
			type === 'auth'
				? { method, headers, body, credentials: 'include' }
				: { method, headers, body };
		const response = await fetch(endpoint, requestInit);
		return await processResponse(response);
	} catch (error) {
		onFailure('network', url);
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
