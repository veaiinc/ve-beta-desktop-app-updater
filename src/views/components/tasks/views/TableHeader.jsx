import React, { memo } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Skeleton from 'react-loading-skeleton';

const TableHeader = ({ columns, handleResizeStart, loading }) => {
	return (
		<Droppable droppableId="table-header" direction="horizontal">
			{(provided) => (
				<thead
					className="table-header"
					ref={provided.innerRef}
					{...provided.droppableProps}
				>
					<tr>
						{columns.map((column, index) => (
							<Draggable
								key={column.id}
								draggableId={column.id}
								index={index}
								isDragDisabled={loading}
							>
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
											width: column?.width,
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
											<div className="header-label">
												{loading ? (
													<Skeleton
														height={16}
														width="80%"
														baseColor="#202020"
														highlightColor="#444"
													/>
												) : (
													column?.label
												)}
											</div>
										</div>
										{!loading && index < columns?.length - 1 && (
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
