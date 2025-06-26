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
					acc.push(...(statusOptions?.[item]?.map((item) => item?._id) || []));
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
	is_not: (filterValue, dataValue, type = 'primitive', statusOptions = null) => {
		if (type === 'arrayOfStrings') {
			return !filterValue.some((item) => dataValue.includes(item));
		}

		if (type === 'status') {
			const allLabels = filterValue?.groups?.reduce(
				(acc, item) => {
					acc.push(...(statusOptions?.[item]?.map((item) => item?._id) || []));
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

export const getRelativeDateLabel = (unixDate) => {
	const inputDate = moment.unix(unixDate).startOf('day');
	const today = moment().startOf('day');
	const diffDays = inputDate.diff(today, 'days');

	if (diffDays === 0) return 'Today';
	if (diffDays === -1) return 'Yesterday';
	if (diffDays === 1) return 'Tomorrow';

	if (diffDays > 1 && diffDays <= 7) return 'Next 7 Days';
	if (diffDays > 7 && diffDays <= 30) return 'Next 30 Days';

	if (diffDays < -1 && diffDays >= -7) return 'Last 7 Days';
	if (diffDays < -7 && diffDays >= -30) return 'Last 30 Days';

	return inputDate.format('MMM YYYY');
};

export const getDayDateLabel = (unixDate) => {
	return moment.unix(unixDate).format('MMM D, YYYY');
};

export const getWeekDateLabel = (unixDate) => {
	const date = moment.unix(unixDate);

	// Force Sunday as the first day of the week (0 = Sunday)
	const startOfWeek = date.clone().day(0); // Sunday
	const endOfWeek = date.clone().day(6); // Saturday

	const sameMonth = startOfWeek.month() === endOfWeek.month();

	if (sameMonth) {
		return `${startOfWeek.format('MMM D')} - ${endOfWeek.format('D, YYYY')}`;
	} else {
		return `${startOfWeek.format('MMM D')} - ${endOfWeek.format('MMM D, YYYY')}`;
	}
};

export const getMonthDateLabel = (unixDate) => {
	return moment.unix(unixDate).format('MMMM YYYY');
};

export const getYearDateLabel = (unixDate) => {
	return moment.unix(unixDate).format('YYYY');
};

export const handleUpdateInGroup = ({
	groupData,
	updatedRowData,
	groupId = null,
	rowId,
	groupBy = null,
	config = null,
	defaultGroups = [],
	fieldType = null,
	statusOptions = null,
}) => {
	const row = groupData?.[groupId]?.docs?.find((row) => row?._id === rowId);
	let updatedGroups = [];
	const updatedRow = {
		...row,
		...(updatedRowData || {}),
		values: {
			...row?.values,
			...(updatedRowData?.values || {}),
		},
	};
	const updatedFields = Object.keys(updatedRowData?.values || {});
	const updatedGroupData = {};
	let hasUpdated = false;

	let rawValue = updatedRowData?.values?.[updatedFields?.[0]];
	if (fieldType === 'number') {
		const { groupRange = [], groupInterval = 0 } = config?.numberBy || {};
		const [start = 0, end = 0] = groupRange;

		if (groupInterval > 0 && rawValue >= start && rawValue <= end) {
			const groupStart =
				Math.floor((rawValue - start) / groupInterval) * groupInterval + start;
			const groupEnd = groupStart + groupInterval;
			rawValue = `${groupStart}-${groupEnd}`;
		} else {
			rawValue = 'Other';
		}
	}

	if (fieldType === 'checkbox') {
		rawValue = rawValue ? 'true' : 'false';
	}

	if (fieldType === 'date') {
		if ('day' === config?.dateBy) {
			rawValue = getDayDateLabel(rawValue?.startDate);
		}
		if ('week' === config?.dateBy) {
			rawValue = getWeekDateLabel(rawValue?.startDate);
		}
		if ('month' === config?.dateBy) {
			rawValue = getMonthDateLabel(rawValue?.startDate);
		}
		if ('year' === config?.dateBy) {
			rawValue = getYearDateLabel(rawValue?.startDate);
		}
		if ('relative' === config?.dateBy) {
			rawValue = getRelativeDateLabel(rawValue?.startDate);
		}
	}

	if (fieldType === 'status') {
		if (config?.statusBy === 'group') {
			for (const [groupName, values] of Object.entries(statusOptions)) {
				if (values.some((item) => item?._id === rawValue)) {
					rawValue = groupName;
					break;
				}
			}
		}
	}

	const valueArray = Array.isArray(rawValue)
		? rawValue.map((item) => (typeof item === 'object' && item !== null ? item._id : item))
		: typeof rawValue === 'object' && rawValue !== null
		? [rawValue._id]
		: rawValue !== undefined
		? [rawValue]
		: [];

	if (groupBy === updatedFields?.[0]) {
		let groupExists = false;
		for (const group in groupData) {
			const docs = [...(groupData[group]?.docs || [])];
			const hasNextPage = groupData[group]?.hasNextPage;
			const index = docs.findIndex((row) => row?._id === rowId);

			const valueIsEmpty =
				!valueArray || (Array.isArray(valueArray) && valueArray?.length === 0);
			if ((valueIsEmpty && group === 'null') || valueArray?.includes(group)) {
				if (index !== -1) {
					docs[index] = updatedRow;
				} else {
					docs.push(updatedRow);
				}
				hasUpdated = true;
				groupExists = true;
			} else {
				if (index !== -1) {
					// delete row from a group that is not included in the values
					docs.splice(index, 1);
					hasUpdated = true;
				}
			}

			if (docs.length > 0 || hasNextPage) {
				const currentGroup = defaultGroups?.find((item) => item?._id === group);
				updatedGroups.push(currentGroup);
			}

			updatedGroupData[group] = {
				...groupData[group],
				docs,
			};
		}

		if (!groupExists) {
			// if there is no group for the updated row, create a new group
			updatedGroupData[rawValue] = {
				docs: [updatedRow],
			};
			updatedGroups.push({ _id: rawValue, label: rawValue });
			hasUpdated = true;
		}
	} else {
		for (const group in groupData) {
			const updatedDocs = groupData[group]?.docs?.map((row) => {
				if (row?._id === rowId) {
					hasUpdated = true;
					return updatedRow;
				}
				return row;
			});
			updatedGroupData[group] = {
				...groupData[group],
				docs: updatedDocs,
			};
		}
		updatedGroups = [...defaultGroups];
	}
	if (!['text', 'number', 'title', 'date'].includes(fieldType)) {
		updatedGroups = defaultGroups;
	}

	return hasUpdated ? { updatedGroupData, updatedGroups } : { groupData, updatedGroups: null };
};

export const handleDragAndDropInGroup = ({
	groupData,
	updatedRowData,
	groupId = null,
	rowId,
	groupBy = null,
	config = null,
	defaultGroups = [],
	fieldType = null,
	statusOptions = null,
	sourceGroupId,
	destinationGroupId,
	sourceIndex,
	destinationIndex,
	isSameGroup = false,
}) => {
	const updatedGroupData = { ...groupData };
	let updatedGroups = [...(defaultGroups || [])];

	// If it's the same group, just reorder within that group
	if (isSameGroup && sourceGroupId === destinationGroupId) {
		const group = updatedGroupData[sourceGroupId];
		if (group && group.docs) {
			const docs = [...group.docs];
			const [movedItem] = docs.splice(sourceIndex, 1);
			docs.splice(destinationIndex, 0, movedItem);

			updatedGroupData[sourceGroupId] = {
				...group,
				docs,
			};
		}
		return { updatedGroupData, updatedGroups: null };
	}

	// If moving between different groups
	if (sourceGroupId !== destinationGroupId) {
		// Remove from source group
		if (updatedGroupData[sourceGroupId] && updatedGroupData[sourceGroupId].docs) {
			const sourceDocs = [...updatedGroupData[sourceGroupId].docs];
			const [movedItem] = sourceDocs.splice(sourceIndex, 1);

			updatedGroupData[sourceGroupId] = {
				...updatedGroupData[sourceGroupId],
				docs: sourceDocs,
			};

			// Add to destination group at specific position
			if (updatedGroupData[destinationGroupId]) {
				const destDocs = [...(updatedGroupData[destinationGroupId].docs || [])];
				destDocs.splice(destinationIndex, 0, movedItem);

				updatedGroupData[destinationGroupId] = {
					...updatedGroupData[destinationGroupId],
					docs: destDocs,
				};
			} else {
				// Create new group if it doesn't exist
				updatedGroupData[destinationGroupId] = {
					docs: [movedItem],
				};
			}
		}
	}

	return { updatedGroupData, updatedGroups: null };
};

export const handleAddInGroup = ({
	groupData,
	newRowData,
	groupBy,
	config,
	fieldType,
	defaultGroups = [],
	statusOptions = null,
}) => {
	let updatedGroupData = { ...groupData };
	const allFields = Object.keys(newRowData?.values || {});
	const newGroups = [...(defaultGroups || [])];
	let groupsUpdated = false;

	const fieldsWithValues = allFields.filter((field) => {
		const value = newRowData?.values?.[field];
		if (Array.isArray(value)) {
			return value.length > 0;
		}
		return value !== undefined && value !== null && value !== '';
	});

	if (fieldsWithValues?.includes(groupBy)) {
		let value = newRowData?.values?.[groupBy];

		if (fieldType === 'checkbox') {
			value = value ? 'true' : 'false';
		}

		if (fieldType === 'number') {
			const { groupRange = [], groupInterval = 0 } = config?.numberBy || {};
			const [start = 0, end = 0] = groupRange;
			if (groupInterval > 0 && value >= start && value <= end) {
				const groupStart =
					Math.floor((value - start) / groupInterval) * groupInterval + start;
				const groupEnd = groupStart + groupInterval;
				value = `${groupStart}-${groupEnd}`;
			} else {
				value = 'Other';
			}
		}

		if (fieldType === 'date') {
			if ('day' === config?.dateBy) {
				value = getDayDateLabel(value?.startDate);
			}
			if ('week' === config?.dateBy) {
				value = getWeekDateLabel(value?.startDate);
			}
			if ('month' === config?.dateBy) {
				value = getMonthDateLabel(value?.startDate);
			}
			if ('year' === config?.dateBy) {
				value = getYearDateLabel(value?.startDate);
			}
			if ('relative' === config?.dateBy) {
				value = getRelativeDateLabel(value?.startDate);
			}
		}

		if (fieldType === 'status') {
			if (config?.statusBy === 'group') {
				for (const [groupName, values] of Object.entries(statusOptions)) {
					if (values.some((item) => item?._id === value)) {
						value = groupName;
						break;
					}
				}
			}
		}

		if (!groupData?.[value]) {
			newGroups.push({ _id: value, label: value });
			groupsUpdated = true;
		}

		const valueArray = Array.isArray(value)
			? value.every((v) => typeof v === 'object' && v !== null && '_id' in v)
				? value.map((v) => v._id)
				: value
			: [value];
		valueArray.forEach((v) => {
			updatedGroupData[v] = {
				...groupData?.[v],
				docs: [...(groupData?.[v]?.docs || []), newRowData],
			};
		});
	} else {
		updatedGroupData[null] = {
			...groupData?.[null],
			docs: [...(groupData?.[null]?.docs || []), newRowData],
		};
	}

	return { updatedGroupData, updatedGroups: groupsUpdated ? newGroups : null };
};

export const handleDeleteInGroup = ({
	groupData,
	rowId,
	groupBy,
	groupId,
	fieldType,
	config,
	statusOptions = null,
}) => {
	let updatedGroupData = { ...groupData };
	const deletedRow = groupData?.[groupId]?.docs?.find((row) => row?._id === rowId);
	let groupValue = deletedRow?.values?.[groupBy] || null;

	if (fieldType === 'checkbox') {
		groupValue = groupValue ? 'true' : 'false';
	}

	if (fieldType === 'number') {
		const { groupRange = [], groupInterval = 0 } = config?.numberBy || {};
		const [start = 0, end = 0] = groupRange;
		if (groupInterval > 0 && groupValue >= start && groupValue <= end) {
			const groupStart =
				Math.floor((groupValue - start) / groupInterval) * groupInterval + start;
			const groupEnd = groupStart + groupInterval;
			groupValue = `${groupStart}-${groupEnd}`;
		} else {
			groupValue = 'Other';
		}
	}

	if (fieldType === 'date') {
		if ('day' === config?.dateBy) {
			groupValue = getDayDateLabel(groupValue?.startDate);
		}
		if ('week' === config?.dateBy) {
			groupValue = getWeekDateLabel(groupValue?.startDate);
		}
		if ('month' === config?.dateBy) {
			groupValue = getMonthDateLabel(groupValue?.startDate);
		}
		if ('year' === config?.dateBy) {
			groupValue = getYearDateLabel(groupValue?.startDate);
		}
		if ('relative' === config?.dateBy) {
			groupValue = getRelativeDateLabel(groupValue?.startDate);
		}
	}

	if (fieldType === 'status') {
		if (config?.statusBy === 'group') {
			for (const [groupName, values] of Object.entries(statusOptions)) {
				if (values.some((item) => item?._id === groupValue)) {
					groupValue = groupName;
					break;
				}
			}
		}
	}

	const valueArray = Array.isArray(groupValue)
		? groupValue.every((v) => typeof v === 'object' && v !== null && '_id' in v)
			? groupValue.map((v) => v._id)
			: groupValue
		: [groupValue];

	valueArray.forEach((v) => {
		updatedGroupData[v] = {
			...groupData?.[v],
			docs: groupData?.[v]?.docs?.filter((row) => row?._id !== rowId),
		};
	});

	return updatedGroupData;
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
