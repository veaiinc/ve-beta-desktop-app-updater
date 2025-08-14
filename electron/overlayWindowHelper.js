const log = require('electron-log');

export const toggleOverlayWindow = async (windowHelper) => {
	try {
		if (!windowHelper) {
			return { success: false, error: 'Window helper not initialized' };
		}
		windowHelper.toggleOverlayWindow();
		return { success: true };
	} catch (error) {
		log.error('Error toggling overlay window:', error);
		return { success: false, error: error.message };
	}
};

export const updateOverlayDimensions = async (event, { width, height }, windowHelper) => {
	try {
		if (!windowHelper) {
			return { success: false, error: 'Window helper not initialized' };
		}
		windowHelper.updateWindowDimensions(width, height);
		return { success: true };
	} catch (error) {
		log.error('Error updating overlay dimensions:', error);
		return { success: false, error: error.message };
	}
};
