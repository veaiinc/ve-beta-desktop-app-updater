import React, { useCallback, useContext } from 'react';
import s from '../../../../../assets/scss/notes/databaseComponents/listView.module.scss';
import { rowTypes } from '../../Database';
import Context from '../../../../../context/context';

const ListView = ({ data, columns, databaseId, pageId, viewId }) => {
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
			updateDatabaseRow(payload, viewId, databaseId);
		},
		[pageId, updateDatabaseRow, databaseId, viewId],
	);

	const generateRow = useCallback((row) => {
		const renderData = [];
		for (let i = 0; i < columns.length; i++) {
			const element = columns[i];
			const item = row?.values?.[element?._id];
			if (
				!item &&
				![
					'status',
					'checkbox',
					'created_time',
					'created_by',
					'last_edited_time',
					'last_edited_by',
				].includes(element?.type)
			) {
				continue;
			}
			const Component = rowTypes?.[element?.type] || null;
			if (!Component) {
				continue;
			}

			const metadataMapper = {
				created_time: row?.createdAt,
				created_by: [row?.createdBy],
				last_edited_time: row?.updatedAt,
				last_edited_by: [row?.updatedBy],
			};
			const options =
				element?.type === 'status' ? element?.config?.status : element?.config?.options;
			renderData.push(
				<div className={s.listItemField} key={element?._id}>
					<Component
						value={metadataMapper?.[element?.type] || item}
						options={options}
						title={element?.name}
						labelField={'label'}
						multiSelect={true}
						disabled={metadataMapper?.[element?.type] !== undefined}
						showTitle={true}
						onOptionClick={(value) => handleUpdateRow(row?._id, element?._id, value)}
						onChange={(value) => handleUpdateRow(row?._id, element?._id, value)}
					/>
				</div>,
			);
		}
		return (
			<div
				className={s.listItem}
				onClick={() =>
					updateDatabaseSidebar({
						data: {
							rowData: row,
							viewId,
							databaseId,
						},
						open: true,
						replace: true,
					})
				}
			>
				{renderData.map((item) => item)}
			</div>
		);
	}, []);

	return <div className={s.listViewContainer}>{data?.map((row) => generateRow(row))}</div>;
};

export default ListView;
