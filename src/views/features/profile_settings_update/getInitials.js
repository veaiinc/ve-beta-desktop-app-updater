export const getInitials = (firstName, lastName) => {
	const firstNameInitial = firstName ? firstName.charAt(0) : '-';
	const lastNameInitial = lastName ? lastName.charAt(0) : '';
	const initials = `${firstNameInitial.toUpperCase()}${lastNameInitial.toUpperCase()}`;
	return initials;
};
export const getBuisnessName = (name) => {
	const words = name.split(' ');
	const initials = words.map((word) => word.charAt(0).toUpperCase()).join('');
	return initials;
};
