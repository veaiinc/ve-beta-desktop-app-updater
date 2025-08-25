import Cookies from 'js-cookie';
const key = 'pushNotificationPermission';

const requestPushNotificationPermission = async () => {
	try {
		const existingPermission = localStorage.getItem(key);
		if (existingPermission) {
			return existingPermission;
		}
		const permission = await Notification.requestPermission();
		localStorage.setItem(key, permission);
		Cookies.set(key, permission);
		return permission;
	} catch (err) {
		return err;
	}
};

export default requestPushNotificationPermission;
