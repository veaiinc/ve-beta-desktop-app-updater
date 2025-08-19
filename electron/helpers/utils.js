export const sanitizeFilename = (name) => {
	return (
		name
			.replace(/[^a-zA-Z0-9._\-]/g, '_')
			.replace(/\s+/g, '_')
			.substring(0, 200) || 'file.jpg'
	);
};
