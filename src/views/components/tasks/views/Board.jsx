import React, { memo, useState, useCallback, useEffect, useMemo, useContext } from 'react';
import '../../../../assets/scss/tasks/boardView.scss';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactComponent as PlusIcon } from '../../../../assets/svg/tasks/plus.svg';
import Status from '../listView/Status';
import Select from '../listView/Select';
import CardItem from '../listView/CardItem';
import Skeleton from 'react-loading-skeleton';
import BoardItem from '../listView/BoardItem';
import Context from '../../../../context/context';

const headerMapper = {
	status: Status,
	priority: Select,
};

const Board = ({
	colors,
	responseMetadata,
	rowTypes,
	properties,
	handleUpdate,
	onClick,
	groupBy = null,
	onLoadMore,
	handleAddButtonOnClick,
}) => {
	const {
		tasks: { handleGroupChange, listTaskWithGroup, fetchGroupData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		columns: [],
		groups: [],
		headerProps: responseMetadata?.[groupBy]?.props,
		loading: true,
		error: null,
	});

	useEffect(() => {
		console.log('data in board', listTaskWithGroup);
		if (listTaskWithGroup?.groups && info?.groups?.length) {
			setInfo((prev) => ({
				...prev,
				columns: mapColumns(),
				loading: false,
			}));
		} else if (listTaskWithGroup?.error) {
			setInfo((prev) => ({
				...prev,
				error: listTaskWithGroup?.error,
				loading: false,
			}));
		}
	}, [listTaskWithGroup?.groups, info.groups]);

	useEffect(() => {
		if (responseMetadata) {
			createColumns();
		}
	}, [responseMetadata, groupBy]);

	useEffect(() => {
		if (responseMetadata) {
			setInfo((prev) => ({
				...prev,
				headerProps: responseMetadata?.[groupBy]?.props,
			}));
		}
	}, [responseMetadata, groupBy]);
	const createColumns = useCallback(() => {
		const groups = [];
		const options = responseMetadata?.[groupBy]?.props?.options;

		if (groupBy === 'status') {
			if (options) {
				groups.push(
					...(options.todo || []),
					...(options.inProgress || []),
					...(options.done || []),
				);
			}
		} else {
			groups.push(...(options || []));
		}

		const newColumns = groups.map((group) => ({
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
		}));

		setInfo((prev) => ({
			...prev,
			groups,
			columns: newColumns,
		}));
	}, [groupBy, responseMetadata]);

	const mapColumns = useCallback(() => {
		// Create a map of existing data
		const dataMap = new Map(listTaskWithGroup?.groups?.map((group) => [group.group, group]));

		// Map through groups and merge with data
		return info.groups.map((group) => ({
			group: group._id,
			totalPages: dataMap.get(group._id)?.totalPages || 0,
			totalDocs: dataMap.get(group._id)?.totalDocs || 0,
			limit: dataMap.get(group._id)?.limit || 20,
			currentPage: dataMap.get(group._id)?.currentPage || 1,
			hasNextPage: dataMap.get(group._id)?.hasNextPage || false,
			hasPrevPage: dataMap.get(group._id)?.hasPrevPage || false,
			prevPage: dataMap.get(group._id)?.prevPage || null,
			nextPage: dataMap.get(group._id)?.nextPage || null,
			data: dataMap.get(group._id)?.data || [],
		}));
	}, [info.groups, listTaskWithGroup]);

	const fetchGroupMoreData = useCallback((payload) => {
		console.log('getting call here', payload);

		fetchGroupData({
			taskFilterInput: payload,
		});
	}, []);

	const handleDragEnd = useCallback(
		(result) => {
			if (!result.destination) return;

			const { source, destination, draggableId } = result;

			// If dropped in the same column
			if (source.droppableId === destination.droppableId) {
				const column = info.columns.find((col) => col.group === source.droppableId);
				if (!column) return;

				const copiedItems = [...column.data];
				const [removed] = copiedItems.splice(source.index, 1);
				copiedItems.splice(destination.index, 0, removed);

				setInfo((prev) => ({
					...prev,
					columns: prev.columns.map((col) =>
						col.group === source.droppableId ? { ...col, data: copiedItems } : col,
					),
				}));
			} else {
				// If dropped in a different column
				const sourceColumn = info.columns.find((col) => col.group === source.droppableId);
				const destColumn = info.columns.find(
					(col) => col.group === destination.droppableId,
				);

				if (!sourceColumn || !destColumn) return;

				const sourceItems = [...sourceColumn.data];
				const destItems = [...destColumn.data];
				const [removed] = sourceItems.splice(source.index, 1);
				destItems.splice(destination.index, 0, removed);

				// Update UI immediately for better UX
				// setInfo((prev) => ({
				// 	...prev,
				// 	columns: prev.columns.map((col) => {
				// 		if (col.group === source.droppableId) {
				// 			return {
				// 				...col,
				// 				data: sourceItems,
				// 				totalDocs: col.totalDocs - 1,
				// 			};
				// 		}
				// 		if (col.group === destination.droppableId) {
				// 			return {
				// 				...col,
				// 				data: destItems,
				// 				totalDocs: col.totalDocs + 1,
				// 			};
				// 		}
				// 		return col;
				// 	}),
				// }));

				handleGroupChange({
					groupBy,
					sourceGroup: source.droppableId,
					targetGroup: destination.droppableId,
					taskId: draggableId,
					sourceIndex: source.index,
					targetIndex: destination.index,
				});

				// Make API call to update the task's status/group
				// try {
				// 	handleUpdate(
				// 		draggableId, // task id
				// 		groupBy, // field to update (status/priority)
				// 		destination.droppableId, // new value
				// 	);
				// } catch (error) {
				// 	// Revert the UI changes if API call fails
				// 	setInfo((prev) => ({
				// 		...prev,
				// 		columns: prev.columns.map((col) => {
				// 			if (col.group === source.droppableId) {
				// 				return {
				// 					...col,
				// 					data: [...sourceColumn.data, removed],
				// 					totalDocs: col.totalDocs + 1,
				// 				};
				// 			}
				// 			if (col.group === destination.droppableId) {
				// 				return {
				// 					...col,
				// 					data: destItems.filter((item) => item._id !== removed._id),
				// 					totalDocs: col.totalDocs - 1,
				// 				};
				// 			}
				// 			return col;
				// 		}),
				// 	}));
				// }
			}
		},
		[info.columns, handleUpdate, groupBy],
	);

	// New function to sort columns - empty ones go to right
	const sortColumns = useCallback((columns) => {
		return [...columns].sort((a, b) => {
			if (a.data.length === 0 && b.data.length > 0) return 1;
			if (a.data.length > 0 && b.data.length === 0) return -1;
			return 0;
		});
	}, []);

	const { emptyGroups, activeGroups } = useMemo(() => {
		return (info?.columns || []).reduce(
			(acc, column) => {
				if (column.data.length === 0) {
					acc.emptyGroups.push(column);
				} else {
					acc.activeGroups.push(column);
				}
				return acc;
			},
			{ emptyGroups: [], activeGroups: [] },
		);
	}, [info?.columns]);

	const handleLoadMore = (groupId, nextPage) => {
		if (onLoadMore) {
			onLoadMore(groupId, nextPage);
		}
	};

	const renderContent = () => {
		// Revert back to simple loading check
		if (info?.loading) {
			return (
				<div className="board-view-container">
					{[...Array(3)].map((_, index) => (
						<div className="board-view-item" key={index}>
							<div className="board-view-item-header">
								<Skeleton width={120} height={24} borderRadius={12} />
								<Skeleton width={30} height={20} borderRadius={12} />
							</div>
							<div className="board-view-item-wrapper">
								<div className="board-view-item-cards">
									{[...Array(4)].map((_, cardIndex) => (
										<div className="board-view-card-skeleton" key={cardIndex}>
											<Skeleton height={100} borderRadius={12} />
										</div>
									))}
								</div>
							</div>
						</div>
					))}
				</div>
			);
		}

		if (info?.error) {
			return <span className="board-view-message">{info.error}</span>;
		}

		if (!listTaskWithGroup?.groups?.length) {
			return <span className="board-view-message">No tasks found</span>;
		}

		return (
			<DragDropContext onDragEnd={handleDragEnd}>
				<div className="board-view-container">
					{/* Active columns */}
					{activeGroups.map((groupData) => {
						const group = info.groups.find((g) => g._id === groupData.group);
						return (
							<BoardItem
								key={groupData.group}
								group={group}
								groupData={groupData}
								groupBy={groupBy}
								headerProps={info.headerProps}
								colors={colors}
								responseMetadata={responseMetadata}
								rowTypes={rowTypes}
								properties={properties}
								handleUpdate={handleUpdate}
								onClick={onClick}
								onLoadMore={handleLoadMore}
								fetchGroupMoreData={fetchGroupMoreData}
								handleAddButtonOnClick={handleAddButtonOnClick}
							/>
						);
					})}

					{/* Empty groups column */}
					{!info?.loading && emptyGroups.length > 0 && (
						<div className="board-view-item empty-groups-column">
							<div className="board-view-item-header">
								<span className="board-view-item-header-title">Empty Groups</span>
								<span className="board-view-item-header-count">
									{emptyGroups.length}
								</span>
							</div>
							<div className="board-view-item-wrapper">
								{emptyGroups?.map((groupData) => {
									const group = info.groups.find(
										(g) => g._id === groupData.group,
									);
									return (
										<BoardItem
											key={groupData.group}
											group={group}
											groupData={groupData}
											groupBy={groupBy}
											headerProps={info.headerProps}
											colors={colors}
											responseMetadata={responseMetadata}
											rowTypes={rowTypes}
											properties={properties}
											handleUpdate={handleUpdate}
											onClick={onClick}
											isEmpty={true}
											onLoadMore={handleLoadMore}
											fetchGroupMoreData={fetchGroupMoreData}
										/>
									);
								})}
							</div>
						</div>
					)}
				</div>
			</DragDropContext>
		);
	};

	return <div className="board-view">{renderContent()}</div>;
};

export default memo(Board);
