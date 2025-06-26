import { useCallback, useContext, useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Context from '../../../../../context/context';
import s from '../../../../../assets/scss/notes/databaseComponents/boardView.module.scss';
import { colors } from '../../../../../helpers/databaseHelpers';
import { rowTypes } from '../../Database';

const Board = ({ item, groupData, columns, databaseId, blockId, view, pageId, dragState }) => {
	const {
		notes: { updateDatabaseSidebar, updateDatabaseRow, fetchMoreGroupData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		dataLoading: false,
	});

	const { docs, hasNextPage, totalDocs, currentPage } = groupData?.[item?._id || null] || {};

	const handleUpdateRow = useCallback(
		(rowId, key, value, groupId) => {
			const payload = {
				updateDatabaseRowId: rowId,
				input: {
					values: { [key]: value },
				},
				pageId,
			};
			updateDatabaseRow(payload, { viewId: view?._id, databaseId, groupId, blockId });
		},
		[pageId, updateDatabaseRow, databaseId, view?._id, blockId],
	);

	const generateCard = (row, groupId, index) => {
		const renderData = [];
		for (let i = 0; i < columns.length; i++) {
			const element = columns[i];
			const item = row?.values?.[element?._id];
			if (
				!item &&
				![
					'status',
					'checkbox',
					'created_time',
					'created_by',
					'last_edited_time',
					'last_edited_by',
				].includes(element?.type)
			) {
				continue;
			}
			const Component = rowTypes?.[element?.type] || null;
			if (!Component) {
				continue;
			}

			const metadataMapper = {
				serial_number: row?.serialNumber,
				created_by: [row?.createdBy],
				created_time: {
					startDate: row?.createdAt,
					endDate: row?.createdAt,
					isEndDateEnabled: false,
				},
				last_edited_by: [row?.updatedBy],
				last_edited_time: {
					startDate: row?.updatedAt,
					endDate: row?.updatedAt,
					isEndDateEnabled: false,
				},
			};
			const options =
				element?.type === 'status' ? element?.config?.status : element?.config?.options;
			renderData.push(
				<div className={s.cardField} key={element?._id}>
					<Component
						value={metadataMapper?.[element?.type] || item}
						options={options}
						title={element?.name}
						labelField={'label'}
						multiSelect={true}
						disabled={metadataMapper?.[element?.type] !== undefined}
						showTitle={true}
						showLabel={true}
						onOptionClick={(value) =>
							handleUpdateRow(row?._id, element?._id, value, groupId)
						}
						onChange={(value) =>
							handleUpdateRow(row?._id, element?._id, value, groupId)
						}
					/>
				</div>,
			);
		}
		return (
			<Draggable key={row?._id} draggableId={row?._id} index={index}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						className={`${s.card} ${snapshot.isDragging ? s.dragging : ''}`}
						onClick={() =>
							updateDatabaseSidebar({
								data: {
									rowData: row,
									viewId: view?._id,
									databaseId,
									groupId,
									blockId,
								},
								open: true,
								replace: true,
							})
						}
						style={{
							...provided.draggableProps.style,
							transform: snapshot.isDragging
								? provided.draggableProps.style?.transform
								: 'none',
						}}
					>
						{renderData}
					</div>
				)}
			</Draggable>
		);
	};

	const handleLoadMore = async () => {
		setInfo((prev) => ({ ...prev, dataLoading: true }));
		await fetchMoreGroupData(
			{
				pageId,
				databaseId,
				databaseViewId: view?._id,
				input: {
					docLimit: 25,
					docPage: currentPage + 1,
					groupFilterId: item?._id || null,
				},
			},
			{
				blockId,
			},
		);
		setInfo((prev) => ({ ...prev, dataLoading: false }));
	};

	// Check if this board is the destination for the current drag
	const isDestination = dragState?.isDragging && dragState?.destinationGroupId === item?._id;
	const destinationIndex = isDestination ? dragState?.destinationIndex : null;

	// Generate drop indicators
	const renderDropIndicators = () => {
		if (!isDestination) return null;

		const indicators = [];
		const totalCards = docs?.length || 0;

		// Show indicator at the top if dropping at index 0
		if (destinationIndex === 0) {
			indicators.push(
				<div key="top" className={s.dropIndicator} style={{ marginTop: '6px' }} />,
			);
		}

		// Show indicators between cards
		for (let i = 0; i < totalCards; i++) {
			if (destinationIndex === i + 1) {
				indicators.push(
					<div
						key={`after-${i}`}
						className={s.dropIndicator}
						style={{ marginTop: '6px' }}
					/>,
				);
			}
		}

		return indicators;
	};

	return (
		<div
			key={item?._id}
			className={s.board}
			style={{ backgroundColor: colors?.[item?.color]?.backgroundColor }}
		>
			<div className={s.boardHeader}>
				{item?.label || item?.name || 'No Value'}
				<span className={s.totalDocs}>
					{/* {totalDocs || 0} {totalDocs > 1 ? 'items' : 'item'} */}
				</span>
			</div>
			<Droppable droppableId={item?._id || 'null'}>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={s.boardBody}
					>
						{/* Show top indicator if dropping at index 0 */}
						{isDestination && destinationIndex === 0 && (
							<div className={s.dropIndicator} style={{ marginTop: '6px' }} />
						)}

						{docs?.map((row, index) => (
							<div key={row?._id}>
								{generateCard(row, item?._id, index)}
								{/* Show indicator after this card if it's the drop position */}
								{isDestination && destinationIndex === index + 1 && (
									<div className={s.dropIndicator} style={{ marginTop: '6px' }} />
								)}
							</div>
						))}
					</div>
				)}
			</Droppable>
			{hasNextPage && (
				<div className={s.loadMoreContainer}>
					<button className={s.loadMoreButton} onClick={handleLoadMore}>
						{info?.dataLoading ? 'Loading...' : 'Load more'}
					</button>
				</div>
			)}
		</div>
	);
};

export default Board;
