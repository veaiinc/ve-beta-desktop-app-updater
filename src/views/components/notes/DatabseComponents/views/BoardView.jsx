import { memo, useCallback, useContext, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import s from '../../../../../assets/scss/notes/databaseComponents/boardView.module.scss';
import Context from '../../../../../context/context';
import { colors } from '../../../../../helpers/databaseHelpers';
import { fieldTypeHandlers } from '../../../../../helpers/databaseDragAndDropHelpers';
import Board from './Board';

const BoardView = ({ groupData, metaInfo, columns, databaseId, pageId, view, blockId }) => {
	const {
		notes: { updateDatabaseRow, database, handleLoadMoreGroups },
	} = useContext(Context);

	const [loadingMoreGroups, setLoadingMoreGroups] = useState(false);

	const [dragState, setDragState] = useState({
		isDragging: false,
		sourceGroupId: null,
		destinationGroupId: null,
		destinationIndex: null,
	});

	// Get the group field to check if it's read-only
	const groupFieldId = view?.groupBy?.fieldId;
	const groupField = database?.[databaseId]?.databaseMetadata?.fields?.find(
		(field) => field._id === groupFieldId,
	);
	const isGroupFieldReadOnly = groupField?.isReadOnly || false;

	// Function to get new value based on field type
	const getNewValue = (params) => {
		const { groupField, columns, groupFieldId } = params;
		const fieldType = groupField?.type;
		const handler = fieldTypeHandlers?.[fieldType] || fieldTypeHandlers?.default;

		return handler(params);
	};

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

	const handleDragEnd = useCallback(
		(result) => {
			if (!result.destination) {
				setDragState({
					isDragging: false,
					sourceGroupId: null,
					destinationGroupId: null,
					destinationIndex: null,
				});

				return;
			}

			const { source, destination } = result;
			const sourceGroupId = source.droppableId;
			const destinationGroupId = destination.droppableId;
			const sourceIndex = source.index;
			const destinationIndex = destination.index;

			// If dropped in the same position, do nothing
			if (sourceGroupId === destinationGroupId && sourceIndex === destinationIndex) {
				return;
			}

			// Extract the actual row ID from the draggable ID (format: groupId|||cardId|||index)
			const draggableId = result.draggableId;

			// The draggable ID format is: groupId|||cardId|||index
			// Using ||| as separator to avoid conflicts with any user input
			const parts = draggableId.split('|||');

			// Extract the rowId (second part) and index (third part)
			const rowId = parts[1]; // cardId
			const index = parts[2]; // index

			// Reset drag state
			setDragState({
				isDragging: false,
				sourceGroupId: null,
				destinationGroupId: null,
				destinationIndex: null,
			});

			// Get the group field ID from the view
			const groupFieldId = view?.groupBy?.fieldId;
			if (!groupFieldId) return;

			// Get the destination group value
			const destinationGroup = view?.groupBy?.defaultGroups?.find(
				(group) => group._id === destinationGroupId,
			);
			if (!destinationGroup) return;

			// Find the dragged row to get its current values
			const draggedRow = groupData?.[sourceGroupId]?.docs?.find((row) => row._id === rowId);
			if (!draggedRow) return;

			// Get the current value of the group field
			const currentGroupValue = draggedRow?.values?.[groupFieldId];

			// Get new value using the field type handler
			const newValue = getNewValue({
				currentGroupValue,
				sourceGroupId,
				destinationGroupId,
				destinationGroup,
				view,
				columns,
				groupFieldId,
				groupField,
			});

			// Prepare the update payload
			const payload = {
				updateDatabaseRowId: rowId,
				input: {
					values: {
						[groupFieldId]: newValue,
					},
				},
				pageId,
			};

			// Perform optimistic update immediately for drag and drop
			updateDatabaseRow(payload, {
				viewId: view?._id,
				databaseId,
				groupId: sourceGroupId,
				blockId,
				// Pass additional context for reordering
				reorderContext: {
					sourceGroupId,
					destinationGroupId,
					sourceIndex,
					destinationIndex,
					isSameGroup: sourceGroupId === destinationGroupId,
				},
				// Flag to indicate this is an optimistic update
				isOptimisticUpdate: true,
			});
		},
		[pageId, updateDatabaseRow, databaseId, view, blockId, groupData, groupField, columns],
	);

	const handleDragUpdate = useCallback((update) => {
		if (update.destination) {
			setDragState({
				isDragging: true,
				sourceGroupId: update.source?.droppableId,
				destinationGroupId: update.destination.droppableId,
				destinationIndex: update.destination.index,
			});
		}
	}, []);

	const handleDragStart = useCallback((start) => {
		setDragState({
			isDragging: true,
			sourceGroupId: start.source.droppableId,
			destinationGroupId: null,
			destinationIndex: null,
		});
	}, []);

	// If the group field is read-only, render without drag and drop
	if (isGroupFieldReadOnly) {
		return (
			<div className={s.boardViewWrapper}>
				{view?.groupBy?.defaultGroups?.map((item, index) => (
					<Board
						key={item?._id}
						item={item}
						groupData={groupData}
						columns={columns}
						databaseId={databaseId}
						blockId={blockId}
						view={view}
						pageId={pageId}
						dragState={dragState}
						isGroupFieldReadOnly={isGroupFieldReadOnly}
						groupField={groupField}
					/>
				))}
				{metaInfo?.hasNextPage && (
					<div className={s.boardViewFooter}>
						<button
							className={s.boardViewFooterButton}
							onClick={loadMoreGroups}
							disabled={loadingMoreGroups}
						>
							{loadingMoreGroups ? 'Loading...' : 'Load more groups'}
						</button>
					</div>
				)}
			</div>
		);
	}

	return (
		<DragDropContext
			onDragEnd={handleDragEnd}
			onDragUpdate={handleDragUpdate}
			onDragStart={handleDragStart}
		>
			<div className={s.boardViewWrapper}>
				{view?.groupBy?.defaultGroups?.map((item, index) => (
					<Board
						key={item?._id}
						item={item}
						groupData={groupData}
						columns={columns}
						databaseId={databaseId}
						blockId={blockId}
						view={view}
						pageId={pageId}
						dragState={dragState}
						isGroupFieldReadOnly={isGroupFieldReadOnly}
						groupField={groupField}
					/>
				))}
				{metaInfo?.hasNextPage && (
					<div className={s.boardViewFooter}>
						<button
							className={s.boardViewFooterButton}
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

export default memo(BoardView);
