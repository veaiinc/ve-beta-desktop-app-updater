import { lazy } from 'react';

export const safeLazy = (importFunc, moduleName = 'Module') => {
	return lazy(async () => {
		try {
			return await importFunc();
		} catch (error) {
			console.error(`Error loading ${moduleName}:`, error);
			if (
				error instanceof TypeError &&
				error.message.includes('Failed to fetch dynamically imported module')
			) {
				console.warn('Detected dynamic import network failure. Reloading...');
				window.location.reload(true); // Hard reload
			}
			throw error;
		}
	});
};
