import React, { memo, useCallback, useContext } from 'react';
import Context from '../../../../../context/context';
import s from '../../../../../assets/scss/notes/databaseComponents/tableView.module.scss';
import { rowTypes } from '../../Database';

const TableBody = ({ data, columns, handleUpdate, colors, pageId, blockId }) => {
	const {
		notes: { updateDatabaseSidebar, updateDatabaseRow },
	} = useContext(Context);

	const handleUpdateRow = useCallback(
		(rowId, key, value) => {
			const payload = {
				updateDatabaseRowId: rowId,
				input: {
					values: { [key]: value },
				},
				pageId,
			};
			updateDatabaseRow(payload, blockId);
		},
		[updateDatabaseRow, blockId],
	);

	const generateCell = useCallback(
		(row, property) => {
			const key = property._id;
			const value = row?.values?.[key];

			let type = property.type;

			const Component = rowTypes?.[type];
			if (!Component) return value;

			if (
				key === '__typename' ||
				key === '_id' ||
				key === 'parentTaskId' ||
				key === 'workflowTemplateId' ||
				key === 'completedAt'
			) {
				return null;
			}

			return (
				<Component
					value={value}
					title={property?.name}
					onOptionClick={(value) => handleUpdateRow(row?._id, key, value)}
					onChange={(value) => handleUpdateRow(row?._id, key, value)}
					colors={colors}
					showTitle={true}
					showLabel={true}
					style={{ background: 'transparent', padding: 0 }}
					disabled={property?.isReadOnly}
					timestamp={property?.isReadOnly}
					maxWidth={false}
					options={property?.config?.options}
					labelField={'label'}
					linkType={property?.type}
					selectionLimit={property?.selectionLimit}
					multiSelect={true}
				/>
			);
		},
		[rowTypes, handleUpdate, colors],
	);

	return (
		<div className={s.tableBody}>
			{data.map((row, rowIndex) => (
				<div key={rowIndex} className={s.tableRow}>
					{columns.map((column, colIndex) => (
						<div
							key={`${rowIndex}-${column._id}`}
							className={`${s.tableCell} ${column.userResized ? s.userResized : ''}`}
							style={{
								'--width': `${column?.width}px`,
								width: column?.width,
								flex: '1 0 auto',
							}}
							onClick={() =>
								updateDatabaseSidebar({
									data: row?.values,
									open: true,
									replace: true,
								})
							}
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
