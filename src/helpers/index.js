export const nameShortner = (name) => {
	let newName = name?.split(' ');
	let str = '';
	str += newName?.[0]?.[0] + (newName?.[1]?.[0] ? newName?.[1]?.[0] : '');
	return str?.toUpperCase();
};
