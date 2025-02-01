import React, { useCallback } from 'react';
import '../../../../assets/scss/tasks/cardItem.scss';
const CardItem = ({
	task,
	responseMetadata,
	colors,
	rowTypes,
	properties,
	handleUpdate,
	onClick,
}) => {
	const generateRows = useCallback(
		(row) => {
			const rowItems = [];

			// Sort properties by order
			const sortedProperties = [...(properties || [])]
				?.sort((a, b) => (a?.order || 0) - (b?.order || 0))
				?.filter((property) => property?.show);

			// Loop through sorted properties
			sortedProperties?.forEach((property) => {
				const key = property?.value;
				const value = row?.[key];

				const { type = null, name = null, props = {} } = responseMetadata?.[key] || {};

				if (type === null) {
					return;
				}

				const RowComponent = rowTypes?.[type] || null;

				if (
					(typeof value === 'object' && !Array.isArray(value)
						? !value?._id
						: key === '!title' && !value) ||
					(Array?.isArray(value) && value?.length === 0) ||
					key === '__typename' ||
					key === '_id'
				) {
					return;
				}

				if (RowComponent) {
					rowItems.push(
						<RowComponent
							key={key}
							value={value}
							title={name}
							onOptionClick={(value) => handleUpdate(task?._id, key, value)}
							{...props}
							colors={colors}
							showTitle={true}
							showEditProperty={true}
							showLabel={true}
							wrap={false}
						/>,
					);
				}
			});

			return rowItems;
		},
		[properties, responseMetadata, rowTypes, colors, handleUpdate, task?._id],
	);

	return (
		<div className="task-card-item" onClick={onClick ? onClick : null}>
			{generateRows(task)}
		</div>
	);
};

export default CardItem;
