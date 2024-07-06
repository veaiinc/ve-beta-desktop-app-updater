export const getInitials = (firstName, lastName) => {
	const firstNameInitial = firstName ? firstName.charAt(0) : '-';
	const lastNameInitial = lastName ? lastName.charAt(0) : '';
	const initials = `${firstNameInitial.toUpperCase()}${lastNameInitial.toUpperCase()}`;
	return initials;
};
