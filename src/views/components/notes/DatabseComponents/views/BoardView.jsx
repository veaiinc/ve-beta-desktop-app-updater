import { memo, useCallback, useContext } from 'react';
import s from '../../../../../assets/scss/notes/databaseComponents/boardView.module.scss';
import { rowTypes } from '../../Database';
import Context from '../../../../../context/context';
import { colors } from '../../../../../helpers/databaseHelpers';

const BoardView = ({ groupData, metaInfo, columns, databaseId, pageId, view, blockId }) => {
	const {
		notes: { updateDatabaseSidebar, updateDatabaseRow },
	} = useContext(Context);

	const handleUpdateRow = useCallback(
		(rowId, key, value, groupId) => {
			const payload = {
				updateDatabaseRowId: rowId,
				input: {
					values: { [key]: value },
				},
				pageId,
			};
			updateDatabaseRow(payload, { viewId: view?._id, databaseId, groupId, blockId });
		},
		[pageId, updateDatabaseRow, databaseId, view?._id, blockId],
	);
	const generateCard = (row, groupId) => {
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
				serial_number: row?.serialNumber,
				created_by: [row?.createdBy],
				created_time: {
					startDate: row?.createdAt,
					endDate: row?.createdAt,
					isEndDateEnabled: false,
				},
				last_edited_by: [row?.updatedBy],
				last_edited_time: {
					startDate: row?.updatedAt,
					endDate: row?.updatedAt,
					isEndDateEnabled: false,
				},
			};
			const options =
				element?.type === 'status' ? element?.config?.status : element?.config?.options;
			renderData.push(
				<div className={s.cardField} key={element?._id}>
					<Component
						value={metadataMapper?.[element?.type] || item}
						options={options}
						title={element?.name}
						labelField={'label'}
						multiSelect={true}
						disabled={metadataMapper?.[element?.type] !== undefined}
						showTitle={true}
						showLabel={true}
						onOptionClick={(value) =>
							handleUpdateRow(row?._id, element?._id, value, groupId)
						}
						onChange={(value) =>
							handleUpdateRow(row?._id, element?._id, value, groupId)
						}
					/>
				</div>,
			);
		}
		return (
			<div
				className={s.card}
				key={row?._id}
				onClick={() =>
					updateDatabaseSidebar({
						data: { rowData: row, viewId: view?._id, databaseId, groupId, blockId },
						open: true,
						replace: true,
					})
				}
			>
				{renderData}
			</div>
		);
	};
	return (
		<div className={s.boardViewWrapper}>
			{view?.groupBy?.defaultGroups?.map((item, index) => (
				<div
					key={item?._id}
					className={s.board}
					style={{ backgroundColor: colors?.[item?.color]?.backgroundColor }}
				>
					<div className={s.boardHeader}>{item?.label || item?.name || 'No Value'}</div>
					<div className={s.boardBody}>
						{groupData?.[item?._id || null]?.docs?.map((row) =>
							generateCard(row, item?._id),
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(BoardView);
