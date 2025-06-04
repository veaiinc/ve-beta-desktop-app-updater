import React, { memo, useCallback, useContext, useEffect, useRef } from 'react';
import Context from '../../../../../context/context';
import s from '../../../../../assets/scss/notes/databaseComponents/tableView.module.scss';
import { rowTypes } from '../../Database';

const TableBody = ({ data, columns, handleUpdate, colors, pageId, viewId, databaseId }) => {
	const {
		notes: { updateDatabaseSidebar, updateDatabaseRow },
	} = useContext(Context);

	const viewIdRef = useRef(viewId);

	useEffect(() => {
		viewIdRef.current = viewId;
	}, [viewId]);

	const handleUpdateRow = useCallback(
		(rowId, key, value) => {
			const payload = {
				updateDatabaseRowId: rowId,
				input: {
					values: { [key]: value },
				},
				pageId,
			};
			updateDatabaseRow(payload, viewIdRef.current, databaseId);
		},
		[pageId, updateDatabaseRow, databaseId],
	);

	const generateCell = useCallback(
		(row, property) => {
			const key = property._id;
			const rowMetadataMapper = {
				serial_number: row?.serialNumber,
				created_by: [row?.createdBy],
				created_time: row?.createdAt,
				last_edited_by: [row?.updatedBy],
				last_edited_time: row?.updatedAt,
			};

			const value = rowMetadataMapper?.[property?.type] || row?.values?.[key];

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

			const options =
				property?.type === 'status' ? property?.config?.status : property?.config?.options;

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
					options={options}
					labelField={'label'}
					linkType={property?.type}
					selectionLimit={property?.selectionLimit}
					multiSelect={true}
					prefix={property?.config?.prefix}
				/>
			);
		},
		[rowTypes, handleUpdate, colors],
	);

	return (
		<div className={s.tableBody}>
			{data.map((row) => (
				<div key={row?._id} className={s.tableRow}>
					{columns.map((column) => (
						<div
							key={`${row?._id}-${column._id}`}
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
