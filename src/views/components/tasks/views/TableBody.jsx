import React, { memo, useCallback } from 'react';

const TableBody = ({
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
					onOptionClick={(value) => updatePropertyValue(row?._id, key, value, isSubTask)}
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
		<tbody className="table-body" style={{ width: '100%', minWidth: '100%' }}>
			{data.map((row, rowIndex) => (
				<tr
					key={rowIndex}
					className="table-row"
					style={{
						display: 'flex',
						width: '100%',
						minWidth: '100%',
					}}
				>
					{columns.map((column, colIndex) => (
						<td
							key={`${rowIndex}-${column.id}`}
							className={`table-cell table-cell-${colIndex} ${
								column.userResized ? 'user-resized' : ''
							}`}
							style={{
								'--width': `${column?.width}px`,
								flex: '1 0 auto',
							}}
						>
							{generateCell(row, column)}
						</td>
					))}
				</tr>
			))}
		</tbody>
	);
};

export default memo(TableBody);
