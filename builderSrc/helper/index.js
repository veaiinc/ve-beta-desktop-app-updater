import Cookies from 'js-cookie';

const hostNameMapper = {
	localhost: 'http://localhost:3000',
	'builder.ve.ai': 'https://ve.ai',
	'builder.ve.co': 'https://ve.co',
	'www.builder.ve.co': 'https://ve.co',
	'www.builder.ve.ai': 'https://ve.ai',
};

export const fetchOriginSelection = () => {
	const hostname = window.location.hostname;
	return hostNameMapper?.[hostname];
};
export const handleParams = (params) => {
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

export const nameShortner = (name) => {
	let newName = name?.split(' ');
	let str = '';
	str += newName?.[0]?.[0] || '' + (newName?.[1]?.[0] ? newName?.[1]?.[0] : '');
	return str?.toUpperCase();
};

export const handleCookieSetupOnMounting = () => {
	const usertoken = Cookies.get('usertoken');
	const workspaceID = Cookies.get('workspaceID');
	const region = Cookies.get('region') || 'ap-south-1';

	if (usertoken && workspaceID) {
		localStorage.setItem('usertoken', usertoken);
		localStorage.setItem('workspaceID', workspaceID);
		localStorage.setItem('region', region);
		return {
			usertoken,
			workspaceID,
			region,
		};
	}
	return null;
};

export const getNumberFromPx = (px = '0px') => {
	if (typeof px === 'string' && px.includes('px')) {
		return Number(px.replace('px', ''));
	}
	return Number(px);
};
