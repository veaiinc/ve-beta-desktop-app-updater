import moment from 'moment';

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
};

const baseConditions = {
	title: [
		COMMON_CONDITIONS.contains,
		COMMON_CONDITIONS.is,
		COMMON_CONDITIONS.isNot,
		COMMON_CONDITIONS.doesNotContain,
		COMMON_CONDITIONS.startsWith,
		COMMON_CONDITIONS.endsWith,
	],
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
		COMMON_CONDITIONS.is,
		COMMON_CONDITIONS.isBefore,
		COMMON_CONDITIONS.isAfter,
		COMMON_CONDITIONS.isOnOrBefore,
		COMMON_CONDITIONS.isOnOrAfter,
		COMMON_CONDITIONS.isBetween,
		COMMON_CONDITIONS.relativeToToday,
	],
	checkbox: [COMMON_CONDITIONS.is, COMMON_CONDITIONS.isNot],
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

const resolveBaseType = (fieldType) => {
	if (baseConditions[fieldType]) return fieldType;

	const matchedEntry = Object.entries(aliasMap).find(([_, aliases]) =>
		aliases.includes(fieldType),
	);

	return matchedEntry?.[0] || null;
};

export const getFilterConditions = (fieldType) => {
	const resolved = resolveBaseType(fieldType);
	return resolved ? baseConditions[resolved] : [];
};

export const getRelativeToTodayRange = (timeScope, timeFrame, timeFrameCount) => {
	const today = moment();
	const count = timeFrameCount || 1;

	const ranges = {
		this: {
			day: [today.clone().startOf('day'), today.clone().endOf('day')],
			week: [today.clone().startOf('week'), today.clone().endOf('week')],
			month: [today.clone().startOf('month'), today.clone().endOf('month')],
			year: [today.clone().startOf('year'), today.clone().endOf('year')],
		},
		past: {
			day: [today.clone().subtract(count, 'days').startOf('day'), today.clone().endOf('day')],
			week: [
				today.clone().subtract(count, 'weeks').startOf('day'),
				today.clone().endOf('day'),
			],
			month: [
				today.clone().subtract(count, 'months').startOf('day'),
				today.clone().endOf('day'),
			],
			year: [
				today.clone().subtract(count, 'years').startOf('day'),
				today.clone().endOf('day'),
			],
		},
		next: {
			day: [today.clone().startOf('day'), today.clone().add(count, 'days').endOf('day')],
			week: [today.clone().startOf('day'), today.clone().add(count, 'weeks').endOf('day')],
			month: [today.clone().startOf('day'), today.clone().add(count, 'months').endOf('day')],
			year: [today.clone().startOf('day'), today.clone().add(count, 'years').endOf('day')],
		},
	};

	return ranges[timeScope]?.[timeFrame] || [null, null];
};

const filterHelper = {
	contains: (filterValue, dataValue, type = 'primitive') => {
		if (type === 'arrayOfStrings') {
			return filterValue.some((item) => dataValue.includes(item));
		}
		return dataValue?.toLowerCase()?.includes(filterValue?.toLowerCase());
	},
	does_not_contain: (filterValue, dataValue, type = 'primitive') => {
		if (type === 'arrayOfStrings') {
			return !filterValue.some((item) => dataValue.includes(item));
		}
		return !dataValue?.toLowerCase()?.includes(filterValue?.toLowerCase());
	},
	is_empty: (_, dataValue) => {
		if (Array.isArray(dataValue)) {
			return dataValue.length === 0;
		}
		return !dataValue;
	},
	is_not_empty: (_, dataValue) => {
		if (Array.isArray(dataValue)) {
			return dataValue.length > 0;
		}
		return Boolean(dataValue);
	},
	is: (filterValue, dataValue, type = 'primitive', statusOptions = null) => {
		if (type === 'arrayOfStrings') {
			return filterValue.some((item) => dataValue.includes(item));
		}
		if (type === 'date') {
			const { dateType, date } = filterValue;

			return dataValue[dateType] === date;
		}

		if (type === 'status') {
			const allLabels = filterValue?.groups?.reduce(
				(acc, item) => {
					acc.push(...statusOptions?.[item]?.map((item) => item?._id));
					return acc;
				},
				[...(filterValue?.labels || [])],
			);
			return allLabels?.includes(dataValue);
		}

		if (typeof dataValue === 'string') {
			return dataValue?.toLowerCase() === filterValue?.toLowerCase();
		}
		return dataValue === filterValue;
	},
	is_not: (filterValue, dataValue, type = 'primitive') => {
		if (type === 'arrayOfStrings') {
			return !filterValue.some((item) => dataValue.includes(item));
		}

		if (type === 'status') {
			const allLabels = filterValue?.groups?.reduce(
				(acc, item) => {
					acc.push(...statusOptions?.[item]?.map((item) => item?._id));
					return acc;
				},
				[...(filterValue?.labels || [])],
			);
			return !allLabels?.includes(dataValue);
		}

		if (typeof dataValue === 'string') {
			return dataValue?.toLowerCase() !== filterValue?.toLowerCase();
		}
		return dataValue !== filterValue;
	},
	starts_with: (filterValue, dataValue, type = 'primitive') => {
		if (type === 'arrayOfStrings') {
			return dataValue.some((item) => item.startsWith(filterValue));
		}
		return dataValue?.toLowerCase()?.startsWith(filterValue?.toLowerCase());
	},
	ends_with: (filterValue, dataValue, type = 'primitive') => {
		if (type === 'arrayOfStrings') {
			return dataValue.some((item) => item.endsWith(filterValue));
		}
		return dataValue?.toLowerCase()?.endsWith(filterValue?.toLowerCase());
	},
	is_before: (filterValue, dataValue, type = 'primitive') => {
		if (type === 'date') {
			const { dateType, date } = filterValue;

			return dataValue[dateType] < date;
		}
	},
	is_after: (filterValue, dataValue, type = 'primitive') => {
		if (type === 'date') {
			const { dateType, date } = filterValue;

			return dataValue[dateType] > date;
		}
	},
	is_on_or_before: (filterValue, dataValue, type = 'primitive') => {
		if (type === 'date') {
			const { dateType, date } = filterValue;

			return dataValue[dateType] <= date;
		}
	},
	is_on_or_after: (filterValue, dataValue, type = 'primitive') => {
		if (type === 'date') {
			const { dateType, date } = filterValue;

			return dataValue[dateType] >= date;
		}
	},
	is_between: (filterValue, dataValue, type = 'primitive') => {
		if (type === 'date') {
			const { dateType, date } = filterValue;
			return date[0] <= dataValue[dateType] && date[1] >= dataValue[dateType];
		}
	},
	relative_to_today: (filterValue, dataValue, type = 'primitive') => {
		if (type === 'date') {
			const { timeScope, timeFrame, timeFrameCount, dateType } = filterValue;
			const [startDate, endDate] = getRelativeToTodayRange(
				timeScope,
				timeFrame,
				timeFrameCount,
			);

			return dataValue[dateType] >= startDate.unix() && dataValue[dateType] <= endDate.unix();
		}
	},
	equals: (filterValue, dataValue, type = 'primitive') => {
		return filterValue === dataValue;
	},
	not_equals: (filterValue, dataValue, type = 'primitive') => {
		return filterValue !== dataValue;
	},
	greater_than: (filterValue, dataValue, type = 'primitive') => {
		return filterValue > dataValue;
	},
	less_than: (filterValue, dataValue, type = 'primitive') => {
		return filterValue < dataValue;
	},
	greater_than_or_equal: (filterValue, dataValue, type = 'primitive') => {
		return filterValue >= dataValue;
	},
	less_than_or_equal: (filterValue, dataValue, type = 'primitive') => {
		return filterValue <= dataValue;
	},
};

const typeMap = {
	primitive: ['text', 'number', 'email', 'url', 'phone', 'checkbox'],
	arrayOfStrings: ['multi_select', 'select'],
	arrayOfObjects: ['person', 'created_by', 'last_edited_by'],
	getType: (fieldType) => {
		if (typeMap.primitive.includes(fieldType)) return 'primitive';
		if (typeMap.arrayOfStrings.includes(fieldType)) return 'arrayOfStrings';
		if (typeMap.arrayOfObjects.includes(fieldType)) return 'arrayOfObjects';
		return fieldType;
	},
};

export const applyFilter = (filters, row, statusOptions = null) => {
	let include = true;
	for (const filter of filters) {
		const { fieldId, value, operator, fieldType } = filter;
		const data = row?.values?.[fieldId];
		include = filterHelper?.[operator]?.(
			value,
			data,
			typeMap.getType(fieldType),
			statusOptions,
		);
		if (!include) break;
	}
	return include;
};

export const relativeTodayTimeScopes = {
	this: { label: 'This', value: 'this' },
	next: { label: 'Next', value: 'next' },
	past: { label: 'Past', value: 'past' },
};

export const relativeTodayTimeFrames = {
	day: { label: 'Day', value: 'day' },
	week: { label: 'Week', value: 'week' },
	month: { label: 'Month', value: 'month' },
	year: { label: 'Year', value: 'year' },
};

export const relativeTodayTimeScopesArray = Object.values(relativeTodayTimeScopes);
export const relativeTodayTimeFramesArray = Object.values(relativeTodayTimeFrames);
