const registerOfflineSW = async () => {
	if ('serviceWorker' in navigator) {
		try {
			await navigator.serviceWorker.register('/offline-sw.js');

			const registration = await navigator.serviceWorker.ready;

			return registration;
		} catch (error) {
			console.error('Error registering offline SW:', error);
			throw error;
		}
	} else {
		console.warn('Service Workers are not supported in this browser.');
		return null;
	}
};

export default registerOfflineSW;
