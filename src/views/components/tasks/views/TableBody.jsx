import React, { memo, useCallback } from 'react';

const TableBody = memo(
	({
		data,
		columns,
		rowTypes,
		responseMetadata,
		updatePropertyValue,
		handleEditPropertyChange,
		colors,
		isSubTask,
	}) => {
		const generateCell = useCallback(
			(row, property) => {
				const key = property.id;
				const value = row?.[key];

				const Component = rowTypes?.[property.type];
				if (!Component) return value;

				if (
					key === '__typename' ||
					key === '_id' ||
					key === 'parentTaskId' ||
					key === 'workflowTemplateId' ||
					key === 'completedAt' ||
					(isSubTask && key === 'workflow')
				) {
					return null;
				}

				const metadata = responseMetadata?.[key] || {};
				const { props = {} } = metadata;

				return (
					<Component
						value={value}
						title={property.label}
						onOptionClick={(value) =>
							updatePropertyValue(row?._id, key, value, isSubTask)
						}
						{...props}
						handleEditPropertyChange={handleEditPropertyChange}
						colors={colors}
						readOnly
						showTitle={true}
						showLabel={true}
						style={{ background: 'transparent', padding: 0 }}
					/>
				);
			},
			[
				rowTypes,
				responseMetadata,
				updatePropertyValue,
				isSubTask,
				handleEditPropertyChange,
				colors,
			],
		);

		return (
			<tbody className="table-body">
				{data.map((row, rowIndex) => (
					<tr key={rowIndex} className="table-row">
						{columns.map((column, colIndex) => (
							<td
								key={`${rowIndex}-${column.id}`}
								className={`table-cell table-cell-${colIndex} ${
									column.userResized ? 'user-resized' : ''
								}`}
								style={{ width: column.width }}
							>
								{generateCell(row, column)}
							</td>
						))}
					</tr>
				))}
			</tbody>
		);
	},
);

TableBody.displayName = 'TableBody';
export default TableBody;
