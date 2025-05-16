import React, { memo, useCallback, useContext } from 'react';
import Context from '../../../../context/context';

const TableBody = ({ data, columns, rowTypes, responseMetadata, handleUpdate, colors }) => {
	const {
		tasks: { updateSideBarData },
	} = useContext(Context);

	const generateCell = useCallback(
		(row, property) => {
			const key = property.id;
			const value = row?.[key];

			const Component = rowTypes?.[property.type];
			if (!Component) return value;
			if (key === 'createdWithAi' && !value) {
				return null;
			}

			if (
				key === '__typename' ||
				key === '_id' ||
				key === 'parentTaskId' ||
				key === 'workflowTemplateId' ||
				key === 'completedAt'
			) {
				return null;
			}

			const metadata = responseMetadata?.[key] || {};
			const { props = {} } = metadata;

			return (
				<Component
					value={value}
					title={property.label}
					onOptionClick={(value) => handleUpdate(row?._id, key, value)}
					{...props}
					colors={colors}
					readOnly
					showTitle={true}
					showLabel={true}
					style={{ background: 'transparent', padding: 0 }}
				/>
			);
		},
		[rowTypes, responseMetadata, handleUpdate, colors],
	);

	return (
		<div className="table-body">
			{data.map((row, rowIndex) => (
				<div key={rowIndex} className="table-row">
					{columns.map((column, colIndex) => (
						<div
							key={`${rowIndex}-${column.id}`}
							className={`table-cell table-cell-${colIndex} ${
								column.userResized ? 'user-resized' : ''
							}`}
							style={{
								'--width': `${column?.width}px`,
								width: column?.width,
								flex: '1 0 auto',
							}}
							onClick={() => updateSideBarData({ data: row, open: true })}
						>
							{generateCell(row, column)}
						</div>
					))}
				</div>
			))}
		</div>
	);
};

export default memo(TableBody);
