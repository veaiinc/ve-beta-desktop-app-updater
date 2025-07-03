import React, { useCallback, useContext, useState } from 'react';
import s from '../../../../../assets/scss/notes/databaseComponents/listView.module.scss';
import { rowTypes } from '../../Database';
import Context from '../../../../../context/context';
import GroupToggler from '../GroupToggler';

const ListView = ({ groupData, metaInfo, columns, databaseId, pageId, view, blockId }) => {
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

	const generateRow = useCallback(
		(row, groupId) => {
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
					<div className={s.listItemField} key={element?._id}>
						<Component
							value={metadataMapper?.[element?.type] || item}
							options={options}
							title={element?.name}
							labelField={'label'}
							multiSelect={true}
							disabled={metadataMapper?.[element?.type] !== undefined}
							showTitle={true}
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
					className={s.listItem}
					key={row?._id}
					onClick={() =>
						updateDatabaseSidebar({
							data: {
								rowData: row,
								viewId: view?._id,
								databaseId,
								groupId,
								blockId,
							},
							open: true,
							replace: true,
						})
					}
				>
					{renderData}
				</div>
			);
		},
		[pageId, updateDatabaseRow, databaseId, view?._id, blockId, columns],
	);

	return (
		<div className={s.listView}>
			{view?.groupBy?.defaultGroups?.map((item, index) => {
				const { totalDocs, currentPage, totalPages, hasNextPage, docs } =
					groupData?.[item?._id || null] || {};
				return (
					<GroupToggler
						key={index}
						groupData={item}
						type={metaInfo?.fieldType}
						viewId={view?._id}
						databaseId={databaseId}
						totalDocs={totalDocs}
						currentPage={currentPage}
						totalPages={totalPages}
						hasNextPage={hasNextPage}
						pageId={pageId}
					>
						<div className={s.listViewContainer}>
							{docs?.map((row) => generateRow(row, item?._id))}
						</div>
					</GroupToggler>
				);
			})}
			{metaInfo?.hasNextPage && (
				<div className={s.listViewFooter}>
					<button
						className={s.listViewFooterButton}
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

export default ListView;
