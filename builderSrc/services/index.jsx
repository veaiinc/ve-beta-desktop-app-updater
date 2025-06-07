import { createBrowserHistory } from 'history';
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

const history = createBrowserHistory();

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

const onFailure = async (res, url) => {
	// alert(res.type);
};

const onUserKickedOut = async (res, url) => {
	// localStorage.removeItem('usertoken');
	// window.location.reload();
};

const Service = {
	fetchGet: async (url, token = null, type = null, body = null) => {
		const region = localStorage.getItem('region') || 'ap-south-1';
		const URL =
			(region === 'ap-south-1'
				? apiEndPointMapper?.[type] || images_api_server
				: apiEndPointMapperUS?.[type] || images_api_server_US) + url;

		const headers = { 'Content-Type': 'application/json' };
		if (token) {
			headers[type === 'form' ? 'Authorization' : 'x-access-token'] =
				type === 'form' ? `Bearer ${token}` : token;
		}
		if (body) {
			headers['body'] = JSON.stringify(body);
		}

		try {
			const res = await fetch(URL, { method: 'GET', headers });
			const ress = await res.json();

			if (res.status >= 200 && res.status < 400) return [true, ress];
			if (res.status === 401) {
				onUserKickedOut();
				return false;
			}
			if (res.status === 403) {
				history.replace(`/${history.location.pathname.split('/')[1]}/access-denied`);
				return [false];
			}
			if (res.status >= 400) return [res.status, ress];

			onFailure('server', url);
			return false;
		} catch (e) {
			onFailure('network', url);
			return false;
		}
	},

	fetchPost: async (url, body, token = null, type = null) => {
		const region = localStorage.getItem('region') || 'ap-south-1';
		const URL =
			(region === 'ap-south-1'
				? apiEndPointMapper?.[type] || images_api_server
				: apiEndPointMapperUS?.[type] || images_api_server_US) + url;

		const headers = { 'Content-Type': 'application/json' };
		if (token) {
			headers[
				type === 'form' || type === 'design_builder_api_server'
					? 'Authorization'
					: 'x-access-token'
			] = type === 'form' || type === 'design_builder_api_server' ? `Bearer ${token}` : token;
		}

		try {
			const res = await fetch(URL, {
				method: 'POST',
				headers,
				body: JSON.stringify(body),
			});
			const ress = await res.json();

			if (res.status >= 200 && res.status < 400) return [true, ress];
			if (
				(res.status === 401 || res.status === 403) &&
				![
					'/login-with-password',
					'/request-password-reset',
					'/verify-password-reset',
					'/verify-email-address',
				].includes(url)
			) {
				onUserKickedOut();
				return false;
			}
			if (res.status >= 400) return [res.status, ress];
		} catch (e) {
			return false;
		}
	},

	fetchPut: async (url, body, token = null, type = null) => {
		const region = localStorage.getItem('region') || 'ap-south-1';
		const URL =
			(region === 'ap-south-1'
				? apiEndPointMapper?.[type] || images_api_server
				: apiEndPointMapperUS?.[type] || images_api_server_US) + url;

		const headers = { 'Content-Type': 'application/json' };
		if (token) {
			headers[type === 'form' ? 'Authorization' : 'x-access-token'] =
				type === 'form' ? `Bearer ${token}` : token;
		}

		try {
			const res = await fetch(URL, {
				method: 'PUT',
				headers,
				body: JSON.stringify(body),
			});
			const ress = await res.json();
			if (res.status >= 200 && res.status < 400) return [true, ress];
			if (res.status === 401) {
				onUserKickedOut();
				return false;
			}
			if (res.status >= 400) return [res.status, ress];
		} catch (e) {
			return false;
		}
	},

	fetchDelete: async (url, token = null, body = null, type = null) => {
		const region = localStorage.getItem('region') || 'ap-south-1';
		const URL =
			(region === 'ap-south-1'
				? apiEndPointMapper?.[type] || images_api_server
				: apiEndPointMapperUS?.[type] || images_api_server_US) + url;

		const headers = { 'Content-Type': 'application/json' };
		if (token) {
			headers[type === 'form' ? 'Authorization' : 'x-access-token'] =
				type === 'form' ? `Bearer ${token}` : token;
		}
		if (type === 'proposal') {
			headers['x-api-key'] = 'MEayJjUZQ9DedOGVbSBA6d5ovx6REAIh';
		}

		try {
			const fetchOptions = {
				method: 'DELETE',
				headers,
				...(body ? { body: JSON.stringify(body) } : {}),
			};

			const res = await fetch(URL, fetchOptions);
			const ress = await res.json();

			if (res.status >= 200 && res.status < 400) return [true, ress];
			if (res.status === 401) {
				onUserKickedOut();
				return false;
			}
			if (res.status >= 400) return [res.status, ress];
		} catch (e) {
			return false;
		}
	},

	fetchPostFiles: async (url, body, token = null, type = null) => {
		const region = localStorage.getItem('region') || 'ap-south-1';
		const URL =
			(region === 'ap-south-1'
				? apiEndPointMapper?.[type] || images_api_server
				: apiEndPointMapperUS?.[type] || images_api_server_US) + url;

		const headers = {};
		if (token) {
			headers[type === 'form' ? 'Authorization' : 'x-access-token'] =
				type === 'form' ? `Bearer ${token}` : token;
		}

		try {
			const res = await fetch(URL, {
				method: 'POST',
				headers,
				body,
			});
			const ress = await res.json();
			if (res.status >= 200 && res.status < 400) return [true, ress];
			if (res.status >= 400) return [false, ress];
		} catch (e) {
			return false;
		}
	},
};

export default Service;
