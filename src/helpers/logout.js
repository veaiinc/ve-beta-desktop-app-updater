import Cookies from 'js-cookie';
import Service from '../services';
import { reloadApp } from '../hooks/useBroadcastChannel';

const logoutAPI = async () => {
	try {
		const path = '/logout';
		const token = localStorage?.getItem('usertoken') ?? false;
		if (!token) {
			window.location.hash = '/';
			reloadApp();
		}
		const fcmToken = localStorage?.getItem('fcmToken') || Cookies.get('fcmToken') || '';

		let body = null;
		if (fcmToken) {
			body = {
				fcmToken,
			};
		}

		localStorage.clear();
		const response = await Service?.fetchPost(path, body, token, 'auth');

		return response;
	} catch (error) {
		console.error('Error logging out:', error);
		return false;
	}
};

const logout = async () => {
	try {
		const theme = localStorage.getItem('theme');
		const cookieTheme = Cookies.get('theme');

		if (theme) {
			localStorage.setItem('theme', theme);
		}

		Object.keys(Cookies.get()).forEach((cookieName) => {
			if (cookieName !== 'theme') {
				Cookies.remove(cookieName);
			}
		});

		if (cookieTheme) {
			Cookies.set('theme', cookieTheme, { expires: 365 });
		}

		window.location.replace('/');
		logoutAPI();
		return true;
	} catch (err) {
		console.error('Failed to perform logout:', err);
		return false;
	}
};

export default logout;
