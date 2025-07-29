import { message } from '../views/components/globalComponents/CustomToast';

export const accessControlCheck = (accessControl) => {
	const accessControls = JSON.parse(localStorage.getItem('accessControls'));
	const { role, accessControls: accessControlsArray } = accessControls || {};

	if (role !== 'admin' && !accessControlsArray?.includes(accessControl)) {
		message.error(`You are not authorized to create ${accessControl}. Please contact admin.`);
		return false;
	}

	return true;
};
