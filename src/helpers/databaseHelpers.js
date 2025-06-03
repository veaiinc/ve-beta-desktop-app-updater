export const colors = {
	1: { backgroundColor: '#62344B', color: '#A35A7E' },
	2: { backgroundColor: '#373737', color: '#707070' },
	3: { backgroundColor: '#5B3D2F', color: '#8F614B' },
	4: { backgroundColor: '#7D4F27', color: '#B37339' },
	5: { backgroundColor: '#375841', color: '#588F69' },
	6: { backgroundColor: '#2F4469', color: '#4F71B3' },
	7: { backgroundColor: '#453061', color: '#6F4C99' },
};

const COMMON_CONDITIONS = {
	is: { label: 'is', value: 'is' },
	isNot: { label: 'is not', value: 'is_not' },
	contains: { label: 'contains', value: 'contains' },
	doesNotContain: { label: 'does not contain', value: 'does_not_contain' },
	startsWith: { label: 'starts with', value: 'starts_with' },
	endsWith: { label: 'ends with', value: 'ends_with' },
	isEmpty: { label: 'is empty', value: 'is_empty', noValue: true },
	isNotEmpty: { label: 'is not empty', value: 'is_not_empty', noValue: true },
	equals: { label: 'equals', value: 'equals' },
	notEquals: { label: 'not equals', value: 'not_equals' },
	greaterThan: { label: 'greater than', value: 'greater_than' },
	lessThan: { label: 'less than', value: 'less_than' },
	greaterThanOrEqual: { label: 'greater than or equal', value: 'greater_than_or_equal' },
	lessThanOrEqual: { label: 'less than or equal', value: 'less_than_or_equal' },
	isBefore: { label: 'is before', value: 'is_before' },
	isAfter: { label: 'is after', value: 'is_after' },
	isOnOrBefore: { label: 'is on or before', value: 'is_on_or_before' },
	isOnOrAfter: { label: 'is on or after', value: 'is_on_or_after' },
	isBetween: { label: 'is between', value: 'is_between' },
	relativeToToday: { label: 'relative to today', value: 'relative_to_today' },
	checked: { label: 'is checked', value: 'checked' },
	unchecked: { label: 'is unchecked', value: 'unchecked' },
};

const baseConditions = {
	text: [
		COMMON_CONDITIONS.contains,
		COMMON_CONDITIONS.is,
		COMMON_CONDITIONS.isNot,
		COMMON_CONDITIONS.doesNotContain,
		COMMON_CONDITIONS.startsWith,
		COMMON_CONDITIONS.endsWith,
	],
	number: [
		COMMON_CONDITIONS.equals,
		COMMON_CONDITIONS.notEquals,
		COMMON_CONDITIONS.greaterThan,
		COMMON_CONDITIONS.lessThan,
		COMMON_CONDITIONS.greaterThanOrEqual,
		COMMON_CONDITIONS.lessThanOrEqual,
		COMMON_CONDITIONS.isEmpty,
		COMMON_CONDITIONS.isNotEmpty,
	],
	date: [
		COMMON_CONDITIONS.isBefore,
		COMMON_CONDITIONS.isAfter,
		COMMON_CONDITIONS.isOnOrBefore,
		COMMON_CONDITIONS.isOnOrAfter,
		COMMON_CONDITIONS.isBetween,
		COMMON_CONDITIONS.relativeToToday,
	],
	checkbox: [COMMON_CONDITIONS.checked, COMMON_CONDITIONS.unchecked],
	person: [
		COMMON_CONDITIONS.contains,
		COMMON_CONDITIONS.doesNotContain,
		COMMON_CONDITIONS.isEmpty,
		COMMON_CONDITIONS.isNotEmpty,
	],
	select: [
		COMMON_CONDITIONS.is,
		COMMON_CONDITIONS.isNot,
		COMMON_CONDITIONS.isEmpty,
		COMMON_CONDITIONS.isNotEmpty,
	],
	status: [COMMON_CONDITIONS.is, COMMON_CONDITIONS.isNot],
};

// Multiple aliases per type
const aliasMap = {
	text: ['email', 'url', 'phone'],
	date: ['created_time', 'last_edited_time'],
	person: ['created_by', 'last_edited_by', 'multi_select'],
};

function resolveBaseType(fieldType) {
	if (baseConditions[fieldType]) return fieldType;

	const matchedEntry = Object.entries(aliasMap).find(([_, aliases]) =>
		aliases.includes(fieldType),
	);

	return matchedEntry?.[0] || null;
}

export function getFilterConditions(fieldType) {
	const resolved = resolveBaseType(fieldType);
	return resolved ? baseConditions[resolved] : [];
}
