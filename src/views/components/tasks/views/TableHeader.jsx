import React, { memo } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const TableHeader = ({ columns, handleResizeStart }) => {
	return (
		<Droppable droppableId="table-header" direction="horizontal">
			{(provided) => (
				<thead
					className="table-header"
					ref={provided.innerRef}
					{...provided.droppableProps}
					style={{
						borderBottom: '1px solid #e0e0e0',
					}}
				>
					<tr
						style={{
							display: 'flex',
							width: '100%',
							minWidth: '100%',
							borderBottom: '1px solid #e0e0e0',
						}}
					>
						{columns.map((column, index) => (
							<Draggable key={column.id} draggableId={column.id} index={index}>
								{(provided, snapshot) => (
									<th
										ref={provided.innerRef}
										{...provided.draggableProps}
										className={`table-header-cell ${
											column?.userResized ? 'user-resized' : ''
										} ${snapshot?.isDragging ? 'dragging' : ''}`}
										style={{
											...provided.draggableProps.style,
											'--width': `${column?.width}px`,
											flex: '1 0 auto',
										}}
									>
										<div
											className="header-content"
											{...provided.dragHandleProps}
										>
											{column?.Icon && (
												<column.Icon className="table-header-icon" />
											)}
											<div className="header-label">{column?.label}</div>
										</div>
										{index < columns?.length - 1 && (
											<div
												className="resize-handle"
												onMouseDown={(e) => handleResizeStart(e, index)}
											/>
										)}
									</th>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</tr>
				</thead>
			)}
		</Droppable>
	);
};

export default memo(TableHeader);
