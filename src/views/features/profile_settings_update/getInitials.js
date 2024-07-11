export const getInitials = (firstName, lastName) => {
	const firstNameInitial = firstName ? firstName.charAt(0) : '-';
	const lastNameInitial = lastName ? lastName.charAt(0) : '';
	const initials = `${firstNameInitial.toUpperCase()}${lastNameInitial.toUpperCase()}`;
	return initials;
};
export const getBuisnessName = (name) => {
	const words = name.split(' ');

	if (words.length === 1) {
		return words[0].substring(0, 2).toUpperCase();
	} else {
		// If there are multiple words, return the initials of the first two words
		const initials = words
			.slice(0, 2)
			.map((word) => word.charAt(0).toUpperCase())
			.join('');
		return initials;
	}
};
