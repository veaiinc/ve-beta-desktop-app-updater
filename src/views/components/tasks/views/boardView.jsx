import React, { memo, useState, useCallback } from 'react';
import '../../../../assets/scss/tasks/boardView.scss';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactComponent as PlusIcon } from '../../../../assets/svg/tasks/plus.svg';
import Select from '../listView/Select';
const BoardView = ({ colors }) => {
	const [columns, setColumns] = useState([
		{
			id: 'column-1',
			title: 'Status 1',
			items: [
				{ _id: '1', name: 'Task 1' },
				{ _id: '2', name: 'Task 2' },
			],
		},
		{
			id: 'column-2',
			title: 'Status 2',
			items: [
				{ _id: '23', name: 'Task 3' },
				{ _id: '24', name: 'Task 4' },
			],
		},
		{
			id: 'column-3',
			title: 'Status 3',
			items: [
				{ _id: '33', name: 'Task 3' },
				{ _id: '34', name: 'Task 4' },
			],
		},
		{
			id: 'column-4',
			title: 'Status 4',
			items: [
				{ _id: '43', name: 'Task 3' },
				{ _id: '44', name: 'Task 4' },
			],
		},
		{
			id: 'column-5',
			title: 'Status 5',
			items: [
				{ _id: '53', name: 'Task 3' },
				{ _id: '54', name: 'Task 4' },
			],
		},
		{
			id: 'column-6',
			title: 'Status 6',
			items: [
				{ _id: '63', name: 'Task 3' },
				{ _id: '64', name: 'Task 4' },
			],
		},
		// ... other columns
	]);

	const handleDragEnd = useCallback(
		(result) => {
			if (!result.destination) return;

			const { source, destination } = result;

			// If dropped in the same column
			if (source.droppableId === destination.droppableId) {
				const column = columns.find((col) => col.id === source.droppableId);
				const copiedItems = [...column.items];
				const [removed] = copiedItems.splice(source.index, 1);
				copiedItems.splice(destination.index, 0, removed);

				setColumns((prev) =>
					prev.map((col) =>
						col.id === source.droppableId ? { ...col, items: copiedItems } : col,
					),
				);
			} else {
				// If dropped in a different column
				const sourceColumn = columns.find((col) => col.id === source.droppableId);
				const destColumn = columns.find((col) => col.id === destination.droppableId);
				const sourceItems = [...sourceColumn.items];
				const destItems = [...destColumn.items];
				const [removed] = sourceItems.splice(source.index, 1);
				destItems.splice(destination.index, 0, removed);

				setColumns((prev) =>
					prev.map((col) => {
						if (col.id === source.droppableId) {
							return { ...col, items: sourceItems };
						}
						if (col.id === destination.droppableId) {
							return { ...col, items: destItems };
						}
						return col;
					}),
				);
			}
		},
		[columns],
	);

	return (
		<div className="board-view">
			<DragDropContext onDragEnd={handleDragEnd}>
				<div className="board-view-container">
					{columns.map((column) => (
						<div className="board-view-item" key={column.id}>
							<div className="board-view-item-header">
								<span className="statusItem">
									<span className="statusItem-icon"></span>
									<span className="statusItem-text">{column.title}</span>
								</span>
								<span className="board-view-item-header-count">
									{column.items.length}
								</span>
							</div>
							<Droppable droppableId={column.id}>
								{(provided) => (
									<div
										className="board-view-item-cards"
										ref={provided.innerRef}
										{...provided.droppableProps}
									>
										{column.items.map((item, index) => (
											<Draggable
												key={item._id}
												draggableId={item._id}
												index={index}
											>
												{(provided, snapshot) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														className={`board-view-card ${
															snapshot.isDragging ? 'dragging' : ''
														}`}
													>
														<p>{item.name}</p>
														{item._id === '1' ? (
															<Select colors={colors} />
														) : (
															<div>hi</div>
														)}
													</div>
												)}
											</Draggable>
										))}
										{provided.placeholder}
										<div className="board-view-item-add-card">
											<PlusIcon />
											<span className="board-view-item-add-card-text">
												New Task
											</span>
										</div>
									</div>
								)}
							</Droppable>
						</div>
					))}
				</div>
			</DragDropContext>
		</div>
	);
};

export default memo(BoardView);
