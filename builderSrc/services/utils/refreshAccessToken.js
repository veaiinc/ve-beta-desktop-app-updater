import Cookies from 'js-cookie';
import getBaseUrl from '../../../src/services/baseUrls.js';

const refreshAccessToken = async () => {
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
	return response;
};

export default refreshAccessToken;
