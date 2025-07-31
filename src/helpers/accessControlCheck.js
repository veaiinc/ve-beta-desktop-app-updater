import { message } from '../views/components/globalComponents/CustomToast';

export const accessControlCheck = (accessControl) => {
	const accessControls = JSON.parse(localStorage.getItem('accessControls'));
	const { role, accessControls: accessControlsArray } = accessControls || {};

	// If admin → allow everything
	if (role === 'admin') return true;

	// Find if the required app exists AND is enabled
	const hasAccess = accessControlsArray?.some(
		(item) => item.app === accessControl && item.isEnabled,
	);

	if (!hasAccess) {
		message.error(`You are not authorized to create ${accessControl}. Please contact admin.`);
		return false;
	}

	return true;
};
