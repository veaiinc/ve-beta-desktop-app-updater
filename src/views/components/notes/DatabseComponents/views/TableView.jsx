import React, { memo, useCallback, useContext, useState } from 'react';
import Context from '../../../../../context/context';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import s from '../../../../../assets/scss/notes/databaseComponents/tableView.module.scss';
import { DragDropContext } from 'react-beautiful-dnd';
import GroupToggler from '../GroupToggler';

const TableView = ({ groupData, metaInfo, columns, colors, databaseId, pageId, view, blockId }) => {
	const [resizingColumn, setResizingColumn] = useState(null);
	const [resizeStartX, setResizeStartX] = useState(0);
	const [resizeStartWidth, setResizeStartWidth] = useState(0);
	const [localColumns, setLocalColumns] = useState(columns);

	React.useEffect(() => {
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

	React.useEffect(() => {
		if (resizingColumn !== null) {
			window.addEventListener('mousemove', handleResizeMove);
			window.addEventListener('mouseup', handleResizeEnd);
			return () => {
				window.removeEventListener('mousemove', handleResizeMove);
				window.removeEventListener('mouseup', handleResizeEnd);
			};
		}
	}, [resizingColumn, handleResizeMove, handleResizeEnd]);

	return (
		<DragDropContext onDragEnd={handleDragEnd}>
			<div className={`${s.tableView} ${resizingColumn !== null ? s.resizing : ''}`}>
				<div className={s.tableScrollContainer}>
					<div className={s.tableContent}>
						{view?.groupBy?.defaultGroups?.map((item, index) => (
							<GroupToggler key={index} groupData={item} type={metaInfo?.fieldType}>
								<TableHeader
									columns={localColumns}
									handleResizeStart={handleResizeStart}
									loading={false}
									databaseId={databaseId}
									pageId={pageId}
								/>
								<TableBody
									data={groupData?.[item?._id || null]?.docs || []}
									columns={localColumns}
									colors={colors}
									pageId={pageId}
									viewId={view?._id}
									databaseId={databaseId}
									groupId={item?._id}
									blockId={blockId}
								/>
							</GroupToggler>
						))}
					</div>
				</div>
			</div>
		</DragDropContext>
	);
};

export default memo(TableView);
