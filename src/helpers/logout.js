import Cookies from 'js-cookie';
import Service from '../services';

const logoutAPI = async () => {
	try {
		const path = '/logout';
		const token = localStorage?.getItem('usertoken') ?? false;
		if (!token) window.location.href = '/';
		const fcmToken = localStorage?.getItem('fcmToken') || Cookies.get('fcmToken') || '';

		let body = null;
		if (fcmToken) {
			body = {
				fcmToken,
			};
		}

		const response = await Service?.fetchPost(path, body, token, 'auth');

		return response;
	} catch (error) {
		console.error('Error logging out:', error);
		return false;
	}
};

const logout = async () => {
	try {
		localStorage.clear();

		Object.keys(Cookies.get()).forEach((cookieName) => {
			Cookies.remove(cookieName);
		});

		window.location.replace('/');
		logoutAPI();
		return true;
	} catch (err) {
		console.error('Failed to perform logout:', err);
		return false;
	}
};

export default logout;
