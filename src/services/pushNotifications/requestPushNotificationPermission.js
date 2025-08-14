import Cookies from 'js-cookie';
const key = 'pushNotificationPermission';

const requestPushNotificationPermission = async () => {
	const permission = await Notification.requestPermission();
	localStorage.setItem(key, permission);
	Cookies.set(key, permission);

	return permission; // 'granted', 'denied', or 'default'
};

export default requestPushNotificationPermission;
