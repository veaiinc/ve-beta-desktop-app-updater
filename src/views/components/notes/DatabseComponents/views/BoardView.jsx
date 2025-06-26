import { memo, useCallback, useContext, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import s from '../../../../../assets/scss/notes/databaseComponents/boardView.module.scss';
import { rowTypes } from '../../Database';
import Context from '../../../../../context/context';
import { colors } from '../../../../../helpers/databaseHelpers';
import Board from './Board';

const BoardView = ({ groupData, metaInfo, columns, databaseId, pageId, view, blockId }) => {
	const {
		notes: { updateDatabaseRow },
	} = useContext(Context);

	const [dragState, setDragState] = useState({
		isDragging: false,
		sourceGroupId: null,
		destinationGroupId: null,
		destinationIndex: null,
	});

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
			const rowId = result.draggableId;

			// Reset drag state
			setDragState({
				isDragging: false,
				sourceGroupId: null,
				destinationGroupId: null,
				destinationIndex: null,
			});

			// If dropped in the same position, do nothing
			if (sourceGroupId === destinationGroupId && sourceIndex === destinationIndex) {
				return;
			}

			// Get the group field ID from the view
			const groupFieldId = view?.groupBy?.fieldId;
			if (!groupFieldId) return;

			// Get the destination group value
			const destinationGroup = view?.groupBy?.defaultGroups?.find(
				(group) => group._id === destinationGroupId,
			);
			if (!destinationGroup) return;

			// Prepare the update payload
			const payload = {
				updateDatabaseRowId: rowId,
				input: {
					values: {
						[groupFieldId]:
							destinationGroup._id === 'null' ? null : destinationGroup._id,
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
		[pageId, updateDatabaseRow, databaseId, view, blockId],
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
					/>
				))}
			</div>
		</DragDropContext>
	);
};

export default memo(BoardView);
