import Cookies from 'universal-cookie';
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();

const env = require('./config').api_server;
const proposalenv = require('./config').proposal_api_server;
const tenantUserenv = require('./config').tenant_user_api_server;
const tenantenv = require('./config').tenant_api_server;
const notificationenv = require('./config').notification_api_server;
const imageenv = require('./config').image_api_server;
const formenv = require('./config').form_api_server;

const cookies = new Cookies();

const Service = {
	fetchGet: async (url, token = null, type = null, body = null) => {
		let URL =
			type === 'form'
				? formenv + url
				: type === 'proposal'
				? proposalenv + url
				: type === 'tenant-users'
				? tenantUserenv + url
				: type === 'tenant'
				? tenantenv + url
				: type === 'notifications'
				? notificationenv + url
				: type === 'image'
				? imageenv + url
				: env + url;

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
		let URL =
			type === 'form'
				? formenv + url
				: type === 'proposal'
				? proposalenv + url
				: type === 'tenant-users'
				? tenantUserenv + url
				: type === 'tenant'
				? tenantenv + url
				: type === 'notifications'
				? notificationenv + url
				: type === 'images'
				? imageenv + url
				: env + url;

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
		let URL =
			type === 'form'
				? formenv + url
				: type === 'proposal'
				? proposalenv + url
				: type === 'tenant-users'
				? tenantUserenv + url
				: type === 'tenant'
				? tenantenv + url
				: type === 'notifications'
				? notificationenv + url
				: env + url;

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
		let URL =
			type === 'form'
				? formenv + url
				: type === 'proposal'
				? proposalenv + url
				: type === 'tenant-users'
				? tenantUserenv + url
				: type === 'tenant'
				? tenantenv + url
				: type === 'notifications'
				? notificationenv + url
				: env + url;

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
		let URL =
			type === 'form'
				? formenv + url
				: type === 'proposal'
				? proposalenv + url
				: type === 'tenant-users'
				? tenantUserenv + url
				: type === 'tenant'
				? tenantenv + url
				: type === 'notifications'
				? notificationenv + url
				: env + url;

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
	console.log('API FAILED ' + url);
	//alert(res.type);
};

const onUserKickedOut = async (res, url) => {
	localStorage.removeItem('usertoken');
	cookies.remove('usertoken', {
		domain:
			window.location.host.split('.')[1] === 'huemn'
				? '.huemn.com'
				: window.location.hostname,
		path: '/',
	});
	window.location.reload();
};

export default Service;
