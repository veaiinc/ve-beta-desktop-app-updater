const registerOfflineSW = async () => {
	if ('serviceWorker' in navigator) {
		try {
			// Register offline service worker
			await navigator.serviceWorker.register('/offline-sw.js');

			// Wait until it's active/ready
			const registration = await navigator.serviceWorker.ready;
			console.log('Offline SW registered:', registration);

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
