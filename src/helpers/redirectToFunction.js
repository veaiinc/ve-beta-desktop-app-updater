export const redirectTo = (type, id) => {
	if (type === 'gmail') {
		window.open(`https://mail.google.com/mail/u/0/#inbox/${id}`, '_blank');
	} else if (type === 'notes') {
	} else if (type === 'drive') {
	} else if (type === 'task') {
	} else if (type === 'contacts') {
	}
};
