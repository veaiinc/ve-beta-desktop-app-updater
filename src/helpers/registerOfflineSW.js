const registerUnifiedSW = async () => {
	if ('serviceWorker' in navigator) {
		try {
			// Register the unified service worker that handles both offline and notifications
			await navigator.serviceWorker.register('/sw.js');

			const registration = await navigator.serviceWorker.ready;
			console.log('Unified service worker registered successfully');

			return registration;
		} catch (error) {
			console.error('Error registering unified SW:', error);
			throw error;
		}
	} else {
		console.warn('Service Workers are not supported in this browser.');
		return null;
	}
};

export default registerUnifiedSW;
