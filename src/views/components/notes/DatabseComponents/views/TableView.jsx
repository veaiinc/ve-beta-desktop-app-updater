import { memo, useCallback, useContext, useEffect, useState } from 'react';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import s from '../../../../../assets/scss/notes/databaseComponents/tableView.module.scss';
import { DragDropContext } from 'react-beautiful-dnd';
import GroupToggler from '../GroupToggler';
import Context from '../../../../../context/context';

const TableView = ({ groupData, metaInfo, columns, colors, databaseId, pageId, view, blockId }) => {
	const {
		notes: { handleLoadMoreGroups },
	} = useContext(Context);
	const [resizingColumn, setResizingColumn] = useState(null);
	const [resizeStartX, setResizeStartX] = useState(0);
	const [resizeStartWidth, setResizeStartWidth] = useState(0);
	const [localColumns, setLocalColumns] = useState(columns);
	const [loadingMoreGroups, setLoadingMoreGroups] = useState(false);

	useEffect(() => {
		setLocalColumns(columns);
	}, [columns]);

	const handleResizeStart = useCallback(
		(e, columnIndex) => {
			e.preventDefault();
			const column = localColumns[columnIndex];
			setResizingColumn(columnIndex);
			setResizeStartX(e.clientX);
			setResizeStartWidth(column.width);
		},
		[localColumns],
	);

	const handleResizeMove = useCallback(
		(e) => {
			if (resizingColumn === null) return;

			const deltaX = e.clientX - resizeStartX;
			const newWidth = Math.max(180, resizeStartWidth + deltaX);

			setLocalColumns((prev) => {
				const newColumns = [...prev];
				newColumns[resizingColumn] = {
					...newColumns[resizingColumn],
					width: newWidth,
					userResized: true,
				};
				return newColumns;
			});
		},
		[resizingColumn, resizeStartX, resizeStartWidth],
	);

	const handleResizeEnd = useCallback(() => {
		setResizingColumn(null);
	}, []);

	const handleDragEnd = useCallback((result) => {
		if (!result.destination) return;

		const sourceIndex = result.source.index;
		const destinationIndex = result.destination.index;

		if (sourceIndex === destinationIndex) return;

		setLocalColumns((prev) => {
			const newColumns = [...prev];
			const [removed] = newColumns.splice(sourceIndex, 1);
			newColumns.splice(destinationIndex, 0, removed);
			return newColumns;
		});
	}, []);

	useEffect(() => {
		if (resizingColumn !== null) {
			window.addEventListener('mousemove', handleResizeMove);
			window.addEventListener('mouseup', handleResizeEnd);
			return () => {
				window.removeEventListener('mousemove', handleResizeMove);
				window.removeEventListener('mouseup', handleResizeEnd);
			};
		}
	}, [resizingColumn, handleResizeMove, handleResizeEnd]);

	const { hasNextPage, currentPage } = metaInfo;

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
				groupPage: currentPage + 1,
				search: metaInfo?.searchQuery || '',
			},
		};
		const [success] = await handleLoadMoreGroups(payload, { viewId: view?._id, blockId });
		setLoadingMoreGroups(false);
	}, [loadingMoreGroups, pageId, databaseId, view, currentPage, metaInfo, blockId]);

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className={`${s.tableView} ${resizingColumn !== null ? s.resizing : ''}`}>
				<div className={s.tableScrollContainer}>
					<div className={s.tableContent}>
						{view?.groupBy?.defaultGroups?.map((item, index) => {
							const { totalDocs, currentPage, totalPages, hasNextPage, docs } =
								groupData?.[item?._id || null] || {};
							return (
								<GroupToggler
									key={index}
									groupData={item}
									type={metaInfo?.fieldType}
									totalDocs={totalDocs}
									currentPage={currentPage}
									totalPages={totalPages}
									hasNextPage={hasNextPage}
									viewId={view?._id}
									blockId={blockId}
									databaseId={databaseId}
									pageId={pageId}
								>
									<>
										<TableHeader
											columns={localColumns}
											handleResizeStart={handleResizeStart}
											loading={false}
											databaseId={databaseId}
											pageId={pageId}
										/>
										<TableBody
											data={docs || []}
											columns={localColumns}
											colors={colors}
											pageId={pageId}
											viewId={view?._id}
											databaseId={databaseId}
											groupId={item?._id}
											blockId={blockId}
										/>
									</>
								</GroupToggler>
							);
						})}
					</div>
				</div>
				{hasNextPage && (
					<div className={s.tableFooter}>
						<button
							className={s.tableFooterButton}
							onClick={loadMoreGroups}
							disabled={loadingMoreGroups}
						>
							{loadingMoreGroups ? 'Loading...' : 'Load more groups'}
						</button>
					</div>
				)}
			</div>
		</DragDropContext>
	);
};

export default memo(TableView);
