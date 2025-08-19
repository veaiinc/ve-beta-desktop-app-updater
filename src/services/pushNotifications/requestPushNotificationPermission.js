import Cookies from 'js-cookie';
const key = 'pushNotificationPermission';

const requestPushNotificationPermission = async () => {
	console.log('[Permission] Checking existing permission in localStorage...');

	const existingPermission = localStorage.getItem(key);
	if (existingPermission) {
		console.log('[Permission] Found existing permission:', existingPermission);
		return existingPermission;
	}

	try {
		console.log('[Permission] Requesting new permission...');
		const permission = await Notification.requestPermission();
		console.log('[Permission] User responded with:', permission);

		localStorage.setItem(key, permission);
		Cookies.set(key, permission);

		console.log('[Permission] Saved permission to localStorage and cookies');
		return permission;
	} catch (err) {
		console.error('[Permission] Error requesting permission:', err);
		return 'error';
	}
};

export default requestPushNotificationPermission;
