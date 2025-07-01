import { getDateValueFromLabel } from './databaseHelpers';

export const fieldTypeHandlers = {
	multi_select: ({
		currentGroupValue,
		sourceGroupId,
		destinationGroupId,
		destinationGroup,
		view,
	}) => {
		const currentArray = Array.isArray(currentGroupValue) ? currentGroupValue : [];
		const sourceGroupValue = sourceGroupId === 'null' ? null : sourceGroupId;
		const destinationGroupValue = destinationGroupId === 'null' ? null : destinationGroupId;

		// Remove source value and add destination value
		const filteredArray = currentArray.filter((value) => {
			const valueId = typeof value === 'object' ? value._id : value;
			return valueId !== sourceGroupValue;
		});

		// Add destination value if it's not already in the array
		const destinationExists = filteredArray.some((value) => {
			const valueId = typeof value === 'object' ? value._id : value;
			return valueId === destinationGroupValue;
		});

		if (!destinationExists && destinationGroupValue !== null) {
			// For multi_select, we just add the option ID
			filteredArray.push(destinationGroupValue);
		}

		return filteredArray;
	},

	person: ({ currentGroupValue, sourceGroupId, destinationGroupId, destinationGroup, view }) => {
		const currentArray = Array.isArray(currentGroupValue) ? currentGroupValue : [];
		const sourceGroupValue = sourceGroupId === 'null' ? null : sourceGroupId;
		const destinationGroupValue = destinationGroupId === 'null' ? null : destinationGroupId;

		// Remove source value and add destination value
		const filteredArray = currentArray.filter((value) => {
			const valueId = typeof value === 'object' ? value._id : value;
			return valueId !== sourceGroupValue;
		});

		// Add destination value if it's not already in the array
		const destinationExists = filteredArray.some((value) => {
			const valueId = typeof value === 'object' ? value._id : value;
			return valueId === destinationGroupValue;
		});

		if (!destinationExists && destinationGroupValue !== null) {
			// For person fields, we need to add the person object
			const destinationGroupObj = view?.groupBy?.defaultGroups?.find(
				(group) => group._id === destinationGroupValue,
			);
			if (destinationGroupObj) {
				filteredArray.push({
					_id: destinationGroupObj._id,
					name: destinationGroupObj.label || destinationGroupObj.name,
				});
			}
		}

		return filteredArray;
	},

	created_by: function (params) {
		// Reuse person handler logic using 'this'
		return this.person(params);
	},

	last_edited_by: function (params) {
		// Reuse person handler logic using 'this'
		return this.person(params);
	},

	number: ({ destinationGroupId }) => {
		// For number fields, extract the starting value from the destination group ID
		// Group ID format: "100-200" -> extract 100 (the first part)
		if (destinationGroupId === 'null') {
			return null;
		} else {
			const groupIdParts = destinationGroupId.split('-');
			if (groupIdParts.length >= 2) {
				// Extract the first number (starting value of the range)
				const startingValue = parseInt(groupIdParts[0], 10);
				if (!isNaN(startingValue)) {
					return startingValue;
				} else {
					return null;
				}
			} else {
				// If it's not in range format, try to parse as number
				const numericValue = parseFloat(destinationGroupId);
				return isNaN(numericValue) ? null : numericValue;
			}
		}
	},

	date: ({ destinationGroupId, view }) => {
		// For date fields, we need to handle date grouping
		// The destination group ID will contain the date label
		if (destinationGroupId === 'null') {
			return null;
		} else {
			// Get the dateBy configuration from the view
			const dateBy = view?.groupBy?.config?.dateBy;

			// Convert the group label to actual date value
			return getDateValueFromLabel(destinationGroupId, dateBy);
		}
	},

	status: ({ destinationGroupId, view, columns, groupFieldId }) => {
		// For status fields, we need to handle status grouping
		if (destinationGroupId === 'null') {
			return null;
		} else {
			// Get the status configuration from the view
			const statusBy = view?.groupBy?.config?.statusBy;

			if (statusBy === 'group') {
				// Find the status field in columns using groupFieldId
				const statusField = columns?.find((col) => col._id === groupFieldId);
				const statusOptions = statusField?.config?.status;

				if (statusOptions) {
					// Find the group that matches the destination group ID
					const groupValues = statusOptions[destinationGroupId];
					if (groupValues && groupValues.length > 0) {
						// Use the first status option's ID from the group as the new value
						return groupValues[0]._id;
					} else {
						return null;
					}
				} else {
					return null;
				}
			} else {
				// For non-grouped status, use the destination group ID directly
				return destinationGroupId;
			}
		}
	},

	checkbox: ({ destinationGroup }) => {
		return destinationGroup._id === 'null' ? null : Boolean(destinationGroup._id);
	},

	// Default handler for other field types
	default: ({ destinationGroup }) => {
		// For non-array fields, just set the destination value
		return destinationGroup._id === 'null' ? null : destinationGroup._id;
	},
};
