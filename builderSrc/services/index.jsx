import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

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
		let URL;
		const region = localStorage.getItem('region') || 'us-east-1';
		if (region === 'ap-south-1') {
			URL = (apiEndPointMapper?.[type] ? apiEndPointMapper?.[type] : images_api_server) + url;
		} else {
			URL =
				(apiEndPointMapperUS?.[type] ? apiEndPointMapperUS?.[type] : images_api_server_US) +
				url;
		}

		const headers = { 'Content-Type': 'application/json' };
		if (token) {
			if (type === 'form') {
				headers['Authorization'] = `Bearer ${token}`;
			} else {
				headers['x-access-token'] = token;
			}
		}
		if (body) {
			headers['body'] = JSON.stringify(body);
		}
		try {
			const res = await fetch(URL, { method: 'GET', headers: headers });
			const ress = await res.json();

			if (res.status >= 200 && res.status < 400) {
				return [true, ress];
			} else if (res.status === 401) {
				onUserKickedOut();
				return false;
			} else if (res.status === 403) {
				history.replace(`/${history.location.pathname.split('/')[1]}/access-denied`);
				return [false];
			} else if (res.status >= 400) {
				return [res.status, ress];
			} else {
				onFailure('server', url);
				return false;
			}
		} catch (e) {
			onFailure('network', url);
			return false;
		}
	},

	fetchPost: async (url, body, token = null, type = null) => {
		let URL;

		const region = localStorage.getItem('region') || 'us-east-1';
		if (region === 'ap-south-1') {
			URL = (apiEndPointMapper?.[type] ? apiEndPointMapper?.[type] : images_api_server) + url;
		} else {
			URL =
				(apiEndPointMapperUS?.[type] ? apiEndPointMapperUS?.[type] : images_api_server_US) +
				url;
		}

		const headers = { 'Content-Type': 'application/json' };
		if (token) {
			if (type === 'form' || type === 'design_builder_api_server') {
				headers['Authorization'] = `Bearer ${token}`;
			} else {
				headers['x-access-token'] = token;
			}
		}

		try {
			const res = await fetch(URL, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify(body),
			});
			const ress = await res.json();

			if (res.status >= 200 && res.status < 400) {
				return [true, ress];
			} else if (
				(res.status === 403 || res.status === 401) &&
				url !== '/login-with-password' &&
				url !== '/request-password-reset' &&
				url !== '/verify-password-reset' &&
				url !== '/verify-email-address'
			) {
				onUserKickedOut();
				return false;
			} else if (res.status >= 400) {
				return [res.status, ress];
			}
		} catch (e) {
			return false;
		}
	},

	fetchPut: async (url, body, token = null, type = null) => {
		let URL;

		const region = localStorage.getItem('region') || 'use-east-1';
		if (region === 'ap-south-1') {
			URL = (apiEndPointMapper?.[type] ? apiEndPointMapper?.[type] : images_api_server) + url;
		} else {
			URL =
				(apiEndPointMapperUS?.[type] ? apiEndPointMapperUS?.[type] : images_api_server_US) +
				url;
		}

		const headers = { 'Content-Type': 'application/json' };
		if (token) {
			if (type === 'form') {
				headers['Authorization'] = `Bearer ${token}`;
			} else {
				headers['x-access-token'] = token;
			}
		}
		try {
			const res = await fetch(URL, {
				method: 'PUT',
				headers: headers,
				body: JSON.stringify(body),
			});
			const ress = await res.json();
			if (res.status >= 200 && res.status < 400) {
				return [true, ress];
			} else if (res.status === 401) {
				onUserKickedOut();
				return false;
			} else if (res.status >= 400) {
				return [res.status, ress];
			}
		} catch (e) {
			return false;
		}
	},

	fetchDelete: async (url, token = null, body = null, type = null) => {
		let URL;

		const region = localStorage.getItem('region') || 'use-east-1';
		if (region === 'ap-south-1') {
			URL = (apiEndPointMapper?.[type] ? apiEndPointMapper?.[type] : images_api_server) + url;
		} else {
			URL =
				(apiEndPointMapperUS?.[type] ? apiEndPointMapperUS?.[type] : images_api_server_US) +
				url;
		}
		const headers = { 'Content-Type': 'application/json' };
		if (token) {
			if (type === 'form') {
				headers['Authorization'] = `Bearer ${token}`;
			} else {
				headers['x-access-token'] = token;
			}
		}
		if (type === 'proposal') {
			headers['x-api-key'] = 'MEayJjUZQ9DedOGVbSBA6d5ovx6REAIh';
		}
		try {
			let json = {
				method: 'DELETE',
				headers: headers,
			};

			if (body != null) {
				json = {
					...json,
					body: JSON.stringify(body),
				};
			}

			const res = await fetch(URL, json);
			const ress = await res.json();
			if (res.status >= 200 && res.status < 400) {
				return [true, ress];
			} else if (res.status === 401) {
				onUserKickedOut();
				return false;
			} else if (res.status >= 400) {
				return [res.status, ress];
			}
		} catch (e) {
			return false;
		}
	},

	fetchPostFiles: async (url, body, token = null, type = null) => {
		let URL;

		const region = localStorage.getItem('region') || 'use-east-1';
		if (region === 'ap-south-1') {
			URL = (apiEndPointMapper?.[type] ? apiEndPointMapper?.[type] : images_api_server) + url;
		} else {
			URL =
				(apiEndPointMapperUS?.[type] ? apiEndPointMapperUS?.[type] : images_api_server_US) +
				url;
		}
		const headers = {};
		if (token) {
			if (type === 'form') {
				headers['Authorization'] = `Bearer ${token}`;
			} else {
				headers['x-access-token'] = token;
			}
		}
		try {
			const res = await fetch(URL, {
				method: 'POST',
				headers: headers,
				body: body,
			});
			const ress = await res.json();
			if (res.status >= 200 && res.status < 400) {
				return [true, ress];
			} else if (res.status >= 400) {
				return [false, ress];
			}
		} catch (e) {
			return false;
		}
	},
};

const onFailure = async (res, url) => {
	//alert(res.type);
};

const onUserKickedOut = async (res, url) => {
	// localStorage.removeItem('usertoken');
	// window.location.reload();
};

export default Service;
