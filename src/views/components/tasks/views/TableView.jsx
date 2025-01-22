import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import '../../../../assets/scss/tasks/tableView.scss';

const TableView = ({
	properties,
	rowTypes,
	data = [],
	responseMetadata,
	updatePropertyValue,
	handleEditPropertyChange,
	colors,
	isSubTask = false,
}) => {
	const initialColumnWidth = 180;
	const minColumnWidth = 80;
	const tableRef = useRef(null);

	// State
	const [columns, setColumns] = useState(
		() =>
			[...(properties || [])]
				?.sort((a, b) => (a?.order || 0) - (b?.order || 0))
				?.filter((prop) => prop.show)
				?.map((prop) => ({
					...prop,
					id: prop?.value,
					order: prop?.order || 0,
					width: initialColumnWidth,
				})) || [],
	);

	const [resizing, setResizing] = useState({
		isResizing: false,
		columnIndex: null,
		startX: null,
		startWidth: null,
		columnX: null,
	});

	const handleResizeStart = useCallback(
		(e, columnIndex) => {
			e.preventDefault();
			const headerCell = e.target.closest('.table-header-cell');
			const columnRect = headerCell.getBoundingClientRect();

			setResizing({
				isResizing: true,
				columnIndex,
				startX: e.clientX,
				startWidth: columns[columnIndex].width,
				columnX: columnRect.left,
			});
		},
		[columns],
	);

	const handleDragEnd = useCallback((result) => {
		if (!result.destination) return;

		setColumns((prev) => {
			const items = Array.from(prev);
			const [reorderedItem] = items.splice(result.source.index, 1);
			items.splice(result.destination.index, 0, reorderedItem);

			return items.map((item, index) => ({
				...item,
				order: index,
			}));
		});
	}, []);

	// Effects
	useEffect(() => {
		setColumns(
			[...(properties || [])]
				?.sort((a, b) => (a?.order || 0) - (b?.order || 0))
				?.filter((prop) => prop.show)
				?.map((prop) => ({
					...prop,
					id: prop?.value,
					order: prop?.order || 0,
					width: initialColumnWidth,
				})) || [],
		);
	}, [properties, initialColumnWidth]);

	useEffect(() => {
		const handleMouseMove = (e) => {
			if (!resizing.isResizing) return;

			const deltaX = e.clientX - resizing.startX;
			const newWidth = Math.max(resizing.startWidth + deltaX, minColumnWidth);

			setColumns((prev) => {
				const nextColumnIndex = resizing.columnIndex + 1;
				if (nextColumnIndex >= prev.length) return prev;

				const nextColWidth = prev[nextColumnIndex].width;
				const widthDiff = newWidth - prev[resizing.columnIndex].width;

				// Prevent resizing if next column would become too small
				if (nextColWidth - widthDiff < minColumnWidth) {
					return prev;
				}

				return prev.map((col, index) => {
					if (index === resizing.columnIndex) {
						return { ...col, width: newWidth, userResized: true };
					}
					if (index === nextColumnIndex) {
						return { ...col, width: nextColWidth - widthDiff, userResized: true };
					}
					return col;
				});
			});
		};

		const handleMouseUp = () => {
			setResizing({
				isResizing: false,
				columnIndex: null,
				startX: null,
				startWidth: null,
				columnX: null,
			});
		};

		if (resizing.isResizing) {
			document.addEventListener('mousemove', handleMouseMove);
			document.addEventListener('mouseup', handleMouseUp);
		}

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [resizing, minColumnWidth]);

	useEffect(() => {
		const handleResize = () => {
			if (!tableRef.current) return;

			const tableWidth = tableRef.current.clientWidth;
			const totalColumns = columns.length;
			const minTotalWidth = totalColumns * minColumnWidth;

			// If table width is greater than minimum total width, distribute extra space
			if (tableWidth > minTotalWidth) {
				const equalWidth = Math.max(Math.floor(tableWidth / totalColumns), minColumnWidth);

				setColumns((prev) =>
					prev.map((col) => ({
						...col,
						width: col.userResized ? col.width : equalWidth,
					})),
				);
			}
		};

		window.addEventListener('resize', handleResize);
		handleResize(); // Initial calculation

		return () => window.removeEventListener('resize', handleResize);
	}, [columns.length, minColumnWidth]);

	return (
		<div className={`table-view ${resizing.isResizing ? 'resizing' : ''}`} ref={tableRef}>
			<div className="table-scroll-container">
				<table className="table-content">
					<DragDropContext onDragEnd={handleDragEnd}>
						<TableHeader columns={columns} handleResizeStart={handleResizeStart} />
					</DragDropContext>
					<TableBody
						data={data}
						columns={columns}
						rowTypes={rowTypes}
						responseMetadata={responseMetadata}
						updatePropertyValue={updatePropertyValue}
						handleEditPropertyChange={handleEditPropertyChange}
						colors={colors}
						isSubTask={isSubTask}
					/>
				</table>
			</div>
		</div>
	);
};

export default memo(TableView);
