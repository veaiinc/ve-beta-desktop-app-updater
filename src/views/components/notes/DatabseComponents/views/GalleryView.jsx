import { memo, useCallback, useContext } from 'react';
import s from '../../../../../assets/scss/notes/databaseComponents/galleryView.module.scss';
import Context from '../../../../../context/context';
import GroupToggler from '../GroupToggler';
import { rowTypes } from '../../Database';

const GalleryView = ({ groupData, metaInfo, columns, databaseId, pageId, view }) => {
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
			updateDatabaseRow(payload, view?._id, databaseId, groupId);
		},
		[pageId, updateDatabaseRow, databaseId, view?._id],
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
		return <div className={s.galleryCard}>{renderData}</div>;
	};

	return (
		<div className={s.galleryView}>
			{view?.groupBy?.defaultGroups?.map((item, index) => (
				<GroupToggler groupData={item} key={index}>
					<div className={s.galleryViewWrapper}>
						{groupData?.[item?._id || null]?.docs?.map((row) =>
							generateCard(row, item?._id),
						)}
					</div>
				</GroupToggler>
			))}
		</div>
	);
};

export default memo(GalleryView);
