import { memo, useCallback, useContext, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import s from '../../../../../assets/scss/notes/databaseComponents/boardView.module.scss';
import { rowTypes } from '../../Database';
import Context from '../../../../../context/context';
import { colors } from '../../../../../helpers/databaseHelpers';
import Board from './Board';

const BoardView = ({ groupData, metaInfo, columns, databaseId, pageId, view, blockId }) => {
	const {
		notes: { updateDatabaseRow, database },
	} = useContext(Context);

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

			// Determine the new value based on field type
			let newValue;
			if (groupField?.type === 'multi_select') {
				// For multi_select, we need array of option IDs
				const currentArray = Array.isArray(currentGroupValue) ? currentGroupValue : [];
				const sourceGroupValue = sourceGroupId === 'null' ? null : sourceGroupId;
				const destinationGroupValue =
					destinationGroupId === 'null' ? null : destinationGroupId;

				// Remove source value and add destination value
				const filteredArray = currentArray.filter((value) => {
					const valueId = typeof value === 'object' ? value._id : value;
					return valueId !== sourceGroupValue;
				});

				// Add destination value if it's not already in the array
				const destinationExists = filteredArray.some((value) => {
					const valueId = typeof value === 'object' ? value._id : value;
					return valueId === destinationGroupValue;
				});

				if (!destinationExists && destinationGroupValue !== null) {
					// For multi_select, we just add the option ID
					filteredArray.push(destinationGroupValue);
				}

				newValue = filteredArray;
			} else if (
				groupField?.type === 'person' ||
				groupField?.type === 'created_by' ||
				groupField?.type === 'last_edited_by'
			) {
				// For person fields, we need array of person objects
				const currentArray = Array.isArray(currentGroupValue) ? currentGroupValue : [];
				const sourceGroupValue = sourceGroupId === 'null' ? null : sourceGroupId;
				const destinationGroupValue =
					destinationGroupId === 'null' ? null : destinationGroupId;

				// Remove source value and add destination value
				const filteredArray = currentArray.filter((value) => {
					const valueId = typeof value === 'object' ? value._id : value;
					return valueId !== sourceGroupValue;
				});

				// Add destination value if it's not already in the array
				const destinationExists = filteredArray.some((value) => {
					const valueId = typeof value === 'object' ? value._id : value;
					return valueId === destinationGroupValue;
				});

				if (!destinationExists && destinationGroupValue !== null) {
					// For person fields, we need to add the person object
					const destinationGroupObj = view?.groupBy?.defaultGroups?.find(
						(group) => group._id === destinationGroupValue,
					);
					if (destinationGroupObj) {
						filteredArray.push({
							_id: destinationGroupObj._id,
							name: destinationGroupObj.label || destinationGroupObj.name,
						});
					}
				}

				newValue = filteredArray;
			} else if (groupField?.type === 'number') {
				// For number fields, extract the starting value from the destination group ID
				// Group ID format: "100-200" -> extract 100 (the first part)
				if (destinationGroupId === 'null') {
					newValue = null;
				} else {
					const groupIdParts = destinationGroupId.split('-');
					if (groupIdParts.length >= 2) {
						// Extract the first number (starting value of the range)
						const startingValue = parseInt(groupIdParts[0], 10);
						if (!isNaN(startingValue)) {
							newValue = startingValue;
						} else {
							newValue = null;
						}
					} else {
						// If it's not in range format, try to parse as number
						const numericValue = parseFloat(destinationGroupId);
						newValue = isNaN(numericValue) ? null : numericValue;
					}
				}
			} else if (groupField?.type === 'date') {
				// For date fields, we need to handle date grouping
				// The destination group ID will contain the date information
				if (destinationGroupId === 'null') {
					newValue = null;
				} else {
					// For date fields, we might need to parse the group ID to get the actual date
					// This depends on how your date grouping is configured
					// For now, we'll pass the destination group ID and let the backend handle it
					newValue = destinationGroupId;
				}
			} else {
				// For non-array fields, just set the destination value
				newValue = destinationGroup._id === 'null' ? null : destinationGroup._id;
			}

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
		[pageId, updateDatabaseRow, databaseId, view, blockId, groupData, groupField],
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
			</div>
		</DragDropContext>
	);
};

export default memo(BoardView);
