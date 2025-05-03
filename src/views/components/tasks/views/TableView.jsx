import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import TableHeader from '../listView/TableHeader';
import TableBody from '../listView/TableBody';
// import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../../helpers';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../../../../assets/scss/tasks/tableView.scss';
import InfiniteScroll from '../../globalComponents/InfiniteScroll';
import { Background } from '@xyflow/react';

const TableView = ({
	properties,
	rowTypes,
	data = [],
	responseMetadata,
	handleUpdate,
	handleRowClick,
	colors,
	isSubTask = false,
	loading = false,
	fetchMoreData,
	hasMore,
	error,
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

	useEffect(() => {
		setColumns((prevColumns) => {
			const newProperties = [...(properties || [])]
				?.sort((a, b) => (a?.order || 0) - (b?.order || 0))
				?.filter((prop) => prop.show);

			// Map new properties to columns, preserving existing widths where possible
			return newProperties.map((prop) => {
				const existingColumn = prevColumns.find((col) => col.id === prop.value);

				return {
					...prop,
					id: prop.value,
					order: prop.order || 0,
					width: existingColumn?.userResized ? existingColumn.width : initialColumnWidth,
					userResized: existingColumn?.userResized || false,
				};
			});
		});
	}, [properties]);

	useEffect(() => {
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
			const totalCurrentWidth = columns.reduce((sum, col) => sum + col.width, 0);

			// Only adjust widths if the table is actually smaller than the total column width
			if (tableWidth < totalCurrentWidth) {
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

	// Create loading columns with fixed widths
	const loadingColumns = [
		{ id: 'title', label: 'Title', width: 300 },
		{ id: 'status', label: 'Status', width: 150 },
		{ id: 'priority', label: 'Priority', width: 150 },
		{ id: 'assignedTo', label: 'Assigned To', width: 200 },
		{ id: 'dueDate', label: 'Due Date', width: 150 },
	];

	const generateSkeleton = useCallback(() => {
		return [...Array(16)].map((_, index) => (
			<div className="tableRowSkeleton" key={index}>
				<Skeleton width="100%" height="38px" />
			</div>
		));
	}, []);

	const handleMouseMove = (e) => {
		if (!resizing.isResizing) return;

		const deltaX = e.clientX - resizing.startX;
		const newWidth = Math.max(resizing.startWidth + deltaX, minColumnWidth);

		setColumns((prev) => {
			return prev.map((col, index) => {
				if (index === resizing.columnIndex) {
					return { ...col, width: newWidth, userResized: true };
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
	return (
		<div className={`table-view ${resizing.isResizing ? 'resizing' : ''}`} ref={tableRef}>
			<div className="table-scroll-container">
				<div className="table-content">
					<DragDropContext onDragEnd={handleDragEnd}>
						<TableHeader
							columns={loading ? loadingColumns : columns}
							handleResizeStart={handleResizeStart}
							loading={loading}
						/>
					</DragDropContext>
					{loading ? (
						<div className="tableBodyWrapper">{generateSkeleton()}</div>
					) : error ? (
						<div className="errorContainer">
							<span className="errorMessage">{error}</span>
						</div>
					) : data?.length !== 0 ? (
						<InfiniteScroll
							dataLength={data?.length || 0}
							next={fetchMoreData}
							hasMore={hasMore}
							loader={<FetchMoreLoaderComp />}
							style={{
								overflowY: 'auto',
								minWidth: '100%',
								width: 'fit-content',
							}}
							height="calc(100vh - 160px)"
							scrollThreshold="90%"
						>
							<TableBody
								data={data}
								columns={columns}
								rowTypes={rowTypes}
								responseMetadata={responseMetadata}
								handleUpdate={handleUpdate}
								handleRowClick={handleRowClick}
								colors={colors}
								isSubTask={isSubTask}
							/>
						</InfiniteScroll>
					) : (
						<div className="noDataContainer">
							<span className="noDataMessage">No tasks found</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default memo(TableView);
