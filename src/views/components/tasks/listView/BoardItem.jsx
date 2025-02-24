import React, { useState, useEffect, memo } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactComponent as PlusIcon } from '../../../../assets/svg/tasks/plus.svg';
import CardItem from './CardItem';
import Status from './Status';
import Select from './Select';
import InfiniteScroll from 'react-infinite-scroll-component';

const headerMapper = {
	status: Status,
	priority: Select,
};

const BoardItem = ({
	group,
	groupData,
	groupBy,
	headerProps,
	colors,
	responseMetadata,
	rowTypes,
	properties,
	handleUpdate,
	onClick,
	isEmpty = false,
	fetchGroupMoreData,
	handleAddButtonOnClick,
}) => {
	const [columnData, setColumnData] = useState({
		group: group._id,
		totalPages: 0,
		totalDocs: 0,
		limit: 20,
		currentPage: 1,
		hasNextPage: false,
		hasPrevPage: false,
		prevPage: null,
		nextPage: null,
		data: [],
	});

	useEffect(() => {
		if (groupData) {
			setColumnData(groupData);
		}
	}, [groupData]);

	const renderHeader = ({ value, colors }) => {
		if (groupBy) {
			const HeaderComponent = headerMapper?.[groupBy];
			return (
				<HeaderComponent value={value} {...headerProps} disabled={true} colors={colors} />
			);
		}
		return null;
	};

	const fetchMoreData = () => {
		if (!columnData.hasNextPage) return;
		fetchGroupMoreData({
			limit: columnData.limit || 10,
			page: columnData.nextPage,
			groupFilters: {
				key: groupBy,
				value: group._id,
			},
		});
	};

	// 1) Handle "empty" group scenario:
	if (isEmpty) {
		return (
			<Droppable droppableId={String(group._id)}>
				{(provided, snapshot) => (
					<div
						className="empty-group-item"
						ref={provided.innerRef}
						{...provided.droppableProps}
						style={{
							minHeight: '100px',
							// background: snapshot.isDraggingOver ? '#f4f4f4' : '',
						}}
					>
						{renderHeader({
							value: group._id,
							colors: colors,
						})}
						{/* placeholder must be in the same element */}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		);
	}

	// 2) Normal group with tasks
	return (
		<div className="board-view-item">
			<div className="board-view-item-header">
				{renderHeader({
					value: group._id,
					colors: colors,
				})}
				<span className="board-view-item-header-count">{columnData?.totalDocs || 0}</span>
			</div>

			<div className="board-view-item-wrapper">
				{/* Make the Droppable itself the scroll container */}
				<Droppable droppableId={String(group._id)} direction="vertical">
					{(provided, snapshot) => (
						<div
							id={`scrollable-board-${group._id}`}
							className="board-view-item-cards"
							ref={provided.innerRef}
							{...provided.droppableProps}
							style={{
								maxHeight: 'calc(100vh - 200px)',
								overflow: 'auto',
								background: snapshot.isDraggingOver ? '#f6f6f6' : '',
							}}
						>
							<InfiniteScroll
								dataLength={columnData?.data?.length || 0}
								next={fetchMoreData}
								hasMore={columnData.hasNextPage}
								loader={
									columnData.hasNextPage && (
										<div className="board-view-loader">Loading...</div>
									)
								}
								scrollableTarget={`scrollable-board-${group._id}`}
								scrollThreshold={0.8}
							>
								{columnData?.data?.map((item, index) => (
									<Draggable
										key={String(item._id)}
										draggableId={String(item._id)} // ensure it's a string
										index={index}
									>
										{(providedDraggable, snapshotDraggable) => (
											<div
												ref={providedDraggable.innerRef}
												{...providedDraggable.draggableProps}
												{...providedDraggable.dragHandleProps}
												className={`board-view-card ${
													snapshotDraggable.isDragging ? 'dragging' : ''
												}`}
												style={providedDraggable.draggableProps.style}
											>
												<CardItem
													task={item}
													responseMetadata={responseMetadata}
													colors={colors}
													rowTypes={rowTypes}
													properties={properties}
													handleUpdate={handleUpdate}
													onClick={onClick}
												/>
											</div>
										)}
									</Draggable>
								))}
								{/* 5) Place the placeholder inside the same container as Draggables */}
								{provided.placeholder}
							</InfiniteScroll>

							<div
								className="board-view-item-add-card"
								onClick={() => handleAddButtonOnClick(group._id)}
							>
								<PlusIcon />
								<span className="board-view-item-add-card-text">New Task</span>
							</div>
						</div>
					)}
				</Droppable>
			</div>
		</div>
	);
};

export default memo(BoardItem);
