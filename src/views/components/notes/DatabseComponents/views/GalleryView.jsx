import { memo, useCallback, useContext, useState } from 'react';
import s from '../../../../../assets/scss/notes/databaseComponents/galleryView.module.scss';
import Context from '../../../../../context/context';
import GroupToggler from '../GroupToggler';
import { rowTypes } from '../../Database';

const GalleryView = ({ groupData, metaInfo, columns, databaseId, pageId, view, blockId }) => {
	const {
		notes: { updateDatabaseSidebar, updateDatabaseRow, handleLoadMoreGroups },
	} = useContext(Context);

	const [loadingMoreGroups, setLoadingMoreGroups] = useState(false);

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

	const loadMoreGroups = useCallback(async () => {
		if (loadingMoreGroups) return;

		setLoadingMoreGroups(true);
		const payload = {
			pageId,
			databaseId,
			databaseViewId: view?._id,
			input: {
				docLimit: 25,
				docPage: 1,
				groupLimit: 10,
				groupPage: metaInfo?.currentPage + 1,
				search: metaInfo?.searchQuery || '',
			},
		};
		const [success] = await handleLoadMoreGroups(payload, { viewId: view?._id, blockId });
		setLoadingMoreGroups(false);
	}, [loadingMoreGroups, pageId, databaseId, view, metaInfo, blockId, handleLoadMoreGroups]);

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
				className={s.galleryCard}
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
		<div className={s.galleryView}>
			{view?.groupBy?.defaultGroups?.map((item, index) => {
				const { totalDocs, currentPage, totalPages, hasNextPage, docs } =
					groupData?.[item?._id || null] || {};
				return (
					<GroupToggler
						groupData={item}
						key={index}
						type={metaInfo?.fieldType}
						viewId={view?._id}
						databaseId={databaseId}
						totalDocs={totalDocs}
						currentPage={currentPage}
						totalPages={totalPages}
						hasNextPage={hasNextPage}
						pageId={pageId}
					>
						<div className={s.galleryViewWrapper}>
							{docs?.map((row) => generateCard(row, item?._id))}
						</div>
					</GroupToggler>
				);
			})}
			{metaInfo?.hasNextPage && (
				<div className={s.galleryViewFooter}>
					<button
						className={s.galleryViewFooterButton}
						onClick={loadMoreGroups}
						disabled={loadingMoreGroups}
					>
						{loadingMoreGroups ? 'Loading...' : 'Load more groups'}
					</button>
				</div>
			)}
		</div>
	);
};

export default memo(GalleryView);
