import service from '../';

export const checkAccountExistsUsingEmail = async (email) => {
	const path = '/account-with-email';
	const params = { email };

	try {
		const response = await service?.fetchGet(path, null, 'auth', params);
		console.log('response', response);
		if (response[0]) {
			return response[1];
		} else {
			throw new Error(response?.[1]?.message || 'Failed to check email');
		}
	} catch (error) {
		console.error('Error checking email existence:', error);
		throw error;
	}
};
