import { memo, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as HorizontalLines } from '../../../../assets/svg/tasks/horizontalLines.svg';
import '../../../../assets/scss/dropdown/tasks/statusEditDropDown.scss';
import Context from '../../../../context/context';
import { message } from '../../globalComponents/CustomToast';
import { colors } from '../../../../helpers/taskHelpers';
import { ReactComponent as Check } from '../../../../assets/svg/tasks/checkmark.svg';
import { ReactComponent as Dustbin } from '../../../../assets/svg/tasks/dustBin.svg';

const StatusEditDropDown = ({ handleEditPropertyChange, handleClose }) => {
	const {
		tasks: { addNewStatusLabel, deleteStatusLabel, updateStatusLabel, taskMetadata },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);
	const [info, setInfo] = useState({
		todoOptions: [],
		inProgressOptions: [],
		completedOptions: [],
		addNewProperty: {
			show: false,
			group: null,
			label: '',
		},
		editingStatus: null,
	});

	// Create ref for debounced update
	const updateStatusDebounceRef = useRef(null);

	const debounceUpdateStatus = (params, sourceId, delay = 500) => {
		if (updateStatusDebounceRef.current) {
			clearTimeout(updateStatusDebounceRef.current);
		}

		updateStatusDebounceRef.current = setTimeout(async () => {
			try {
				const response = await updateStatusLabel(params, sourceId);
				if (response?.[0]) {
					message.success('Status updated successfully');
				} else {
					throw new Error(response?.[1]?.[0]?.message || 'Failed to update status');
				}
			} catch (error) {
				message.error(error?.message || 'Failed to update status');
			}
		}, delay);
	};

	useEffect(() => {
		if (taskMetadata) {
			setInfo((prev) => ({
				...prev,
				todoOptions: taskMetadata?.todoGroupLabels || [],
				inProgressOptions: taskMetadata?.inProgressGroupLabels || [],
				completedOptions: taskMetadata?.completedGroupLabels || [],
				addNewProperty: prev.addNewProperty,
			}));
		}
	}, [taskMetadata]);

	const handleDragEnd = async (result) => {
		if (!result?.destination) return;

		const sourceId = result?.source?.droppableId;
		const destinationId = result?.destination?.droppableId;
		const sourceIndex = result?.source?.index;
		const destinationIndex = result?.destination?.index;

		// Store the previous state for rollback
		const previousState = {
			todoOptions: [...info.todoOptions],
			inProgressOptions: [...info.inProgressOptions],
			completedOptions: [...info.completedOptions],
		};

		try {
			// Update local state first for immediate feedback
			setInfo((prevInfo) => {
				const newInfo = { ...prevInfo };
				const sourcePropName = `${sourceId}Options`;
				const destPropName = `${destinationId}Options`;

				if (sourceId === destinationId) {
					const list = [...(newInfo?.[sourcePropName] || [])];
					const [removed] = list.splice(sourceIndex, 1);
					list.splice(destinationIndex, 0, removed);
					newInfo[sourcePropName] = list;
				} else {
					const sourceList = [...(newInfo?.[sourcePropName] || [])];
					const destList = [...(newInfo?.[destPropName] || [])];
					const [removed] = sourceList?.splice(sourceIndex, 1);

					// Update group when moving between lists
					removed.group = destinationId;
					destList.splice(destinationIndex, 0, removed);

					newInfo[sourcePropName] = sourceList;
					newInfo[destPropName] = destList;
				}

				return newInfo;
			});

			// Get the dragged item and update its group
			const draggedItem = info[`${sourceId}Options`][sourceIndex];
			debounceUpdateStatus(
				{
					labelId: draggedItem._id,
					group: destinationId,
					taskMetadataId: taskMetadata?._id,
					input: {
						order: destinationIndex,
					},
				},
				sourceId,
			);
		} catch (error) {
			// Rollback to previous state
			setInfo((prev) => ({
				...prev,
				...previousState,
			}));
			message.error(error?.message || 'Failed to update status order');
		}
	};

	const handleAddClick = useCallback((group) => {
		setInfo((prev) => {
			// If clicking same group, toggle visibility
			if (prev.addNewProperty.group === group) {
				return {
					...prev,
					addNewProperty: {
						...prev.addNewProperty,
						show: !prev.addNewProperty.show,
						group,
						label: '',
					},
				};
			}

			// If clicking different group, show input for that group
			return {
				...prev,
				addNewProperty: {
					show: true,
					group,
					label: '',
				},
			};
		});
	}, []);

	const handleInputChange = (e) => {
		setInfo((prev) => ({
			...prev,
			addNewProperty: {
				...prev.addNewProperty,
				label: e?.target?.value,
			},
		}));
	};

	const handleInputKeyDown = async (e) => {
		if (e.key === 'Enter' && info.addNewProperty.label.trim()) {
			if (
				validateExpiryData &&
				validateExpiryData?.restrictTasks &&
				validateExpiryData?.isExpired
			) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			}

			const newLabel = info.addNewProperty.label.trim();

			// Check if label already exists in any group
			const labelExists = [
				...(info.todoOptions || []),
				...(info.inProgressOptions || []),
				...(info.completedOptions || []),
			].some((status) => status.label === newLabel);

			if (labelExists) {
				message.error('Status with this label already exists');
				return;
			}

			try {
				// Create temporary object for immediate feedback
				const tempStatus = {
					_id: newLabel, // Temporary ID
					group: info.addNewProperty.group,
					label: newLabel,
					color: '6',
					isDefault: false,
				};

				// Update local state immediately
				setInfo((prev) => ({
					...prev,
					[`${info.addNewProperty.group}Options`]: [
						...prev[`${info.addNewProperty.group}Options`],
						tempStatus,
					],
					addNewProperty: {
						...prev.addNewProperty,
						label: '',
					},
				}));

				// Call API to add new status label
				const response = await addNewStatusLabel({
					taskMetadataId: taskMetadata?._id,
					input: {
						color: '6',
						group: info.addNewProperty.group,
						label: newLabel,
					},
				});
				if (response?.[0]) {
					message.success('Status added successfully');
				} else {
					throw new Error(response?.[1]?.[0]?.message);
				}
			} catch (error) {
				setInfo((prev) => ({
					...prev,
					[`${info.addNewProperty.group}Options`]: prev[
						`${info.addNewProperty.group}Options`
					].filter((status) => status._id !== newLabel),
				}));
				message.error(error?.message || 'Failed to add new status label');
			}
		} else if (e.key === 'Escape') {
			setInfo((prev) => ({
				...prev,
				addNewProperty: {
					...prev.addNewProperty,
					show: false,
					label: '',
				},
			}));
		}
	};

	const handleDeleteStatus = async (status) => {
		if (
			validateExpiryData &&
			validateExpiryData?.restrictTasks &&
			validateExpiryData?.isExpired
		) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		}

		if (status?.isDefault) {
			message.error('Cannot delete the default status');
			return;
		}

		try {
			// Remove from local state first for immediate feedback
			setInfo((prev) => ({
				...prev,
				[`${status.group}Options`]: prev[`${status.group}Options`].filter(
					(item) => item._id !== status._id,
				),
			}));

			// Call API to delete status
			const response = await deleteStatusLabel({
				taskMetadataId: taskMetadata?._id,
				labelId: status._id,
				group: status.group,
			});
			if (response?.[0]) {
				message.success('Status deleted successfully');
			} else {
				throw new Error(response?.[1]?.[0]?.message);
			}
		} catch (error) {
			// Revert the local state if API call fails
			setInfo((prev) => ({
				...prev,
				[`${status.group}Options`]: [...prev[`${status.group}Options`], status],
			}));
			message.error(error?.message || 'Failed to delete status');
		}
	};

	const handleStatusUpdate = async (status, updates) => {
		try {
			// Update local state first for immediate feedback
			if (updates?.label) {
				updates.label = updates?.label?.trim();
				const labelExists = [
					...(info.todoOptions || []),
					...(info.inProgressOptions || []),
					...(info.completedOptions || []),
				].some((status) => status.label === updates?.label);

				if (labelExists) {
					message.error('Status with this label already exists');
					return;
				}
			}

			setInfo((prev) => ({
				...prev,
				[`${status.group}Options`]: prev[`${status.group}Options`].map((item) =>
					item._id === status._id ? { ...item, ...updates } : item,
				),
			}));

			// Call debounced API to update the status
			debounceUpdateStatus(
				{
					taskMetadataId: taskMetadata?._id,
					labelId: status._id,
					group: status.group,
					input: updates,
				},
				status.group,
			);
		} catch (error) {
			// Revert local state on error
			setInfo((prev) => ({
				...prev,
				[`${status.group}Options`]: prev[`${status.group}Options`].map((item) =>
					item._id === status._id ? status : item,
				),
			}));
			message.error(error?.message || 'Failed to update status');
		}
	};
	const handleStatusLabelBlur = (e, option) => {
		if (e?.target?.value !== option?.label && e?.target?.value?.trim() !== '') {
			handleStatusUpdate(option, {
				label: e?.target?.value,
			});
		}
	};

	const StatusList = ({ items, droppableId, title }) => (
		<div className="property-edit-section">
			<div className="property-edit-section-title-wrapper">
				<span className="property-edit-section-title">{title}</span>
				<PlusSvg
					className="add-new-property-icon"
					onClick={() => handleAddClick(droppableId)}
					style={{
						transform:
							info.addNewProperty.show && info.addNewProperty.group === droppableId
								? 'rotate(-45deg)'
								: '',
						transition: 'transform 0.2s ease',
					}}
				/>
			</div>
			{info.addNewProperty.show && info.addNewProperty.group === droppableId && (
				<input
					className="property-add-input-field"
					placeholder="Add new status"
					value={info.addNewProperty.label}
					onChange={handleInputChange}
					onKeyDown={handleInputKeyDown}
					autoFocus
				/>
			)}
			<Droppable droppableId={droppableId}>
				{(provided) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
						className={`property-edit-section-body ${
							items?.length === 0 ? 'empty' : ''
						}`}
					>
						{items?.map((option, index) => (
							<Draggable key={option?._id} draggableId={option?._id} index={index}>
								{(provided, snapshot) => (
									<div
										className={`status-edit-option-container ${
											info.editingStatus === option?._id ? 'active' : ''
										}`}
									>
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											className={`property-edit-section-option-item ${
												snapshot.isDragging ? 'dragging' : ''
											}`}
											onClick={() =>
												setInfo((prev) => ({
													...prev,
													editingStatus:
														prev?.editingStatus === option?._id
															? null
															: option?._id,
												}))
											}
										>
											<div
												{...provided.dragHandleProps}
												className="drag-handle-icon"
												onClick={(e) => e.stopPropagation()}
											>
												<HorizontalLines />
											</div>
											<span className="property-edit-section-body-option-wrapper">
												<span className="status-option-container">
													<span
														className="status-option-dot"
														style={{
															backgroundColor:
																colors?.[option?.color]?.color,
														}}
													></span>
													<input
														className="status-option-label"
														defaultValue={option?.label}
														onBlur={(e) =>
															handleStatusLabelBlur(e, option)
														}
														onKeyDown={(e) => {
															if (e.key === 'Enter') {
																e.preventDefault();
																e.target.blur();
															}
														}}
														onClick={(e) => e.stopPropagation()}
														style={{
															width: `${option?.label?.length}ch`,
														}}
													/>
												</span>
											</span>
											{option?.isDefault ? (
												<span className="default-status-text">Default</span>
											) : (
												''
											)}

											<ChevronRightThinSvg className="edit-status-icon" />
										</div>
										<div className="status-edit-container">
											<div className="colors-wrapper">
												<div className="colors-title">Colors</div>
												<div className="colors-list">
													{Object.entries(colors)?.map(([key, color]) => (
														<div
															className={`color-item ${
																option?.color === key
																	? 'selected'
																	: ''
															}`}
															key={key}
															onClick={() =>
																handleStatusUpdate(option, {
																	color: key,
																})
															}
															style={{
																backgroundColor: color?.color,
															}}
														></div>
													))}
												</div>
											</div>
											<div className="status-edit-footer-btns">
												<button
													className="status-edit-footer-btn"
													disabled={option?.isDefault}
													onClick={() =>
														handleStatusUpdate(option, {
															isDefault: true,
														})
													}
												>
													<Check />
													Set as default
												</button>
												<button
													className="status-edit-footer-btn delete"
													disabled={option?.isDefault}
													onClick={() => handleDeleteStatus(option)}
												>
													<Dustbin />
													Delete
												</button>
											</div>
										</div>
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</div>
	);

	return (
		<div className="options-property-edit-container">
			<div className="options-property-edit-header" onClick={handleClose}>
				<ChevronRightThinSvg className="back-icon" />
				<span className="options-property-edit-header-title">Display</span>
			</div>

			<DragDropContext onDragEnd={handleDragEnd}>
				<StatusList items={info?.todoOptions} droppableId="todo" title="To-do" />
				<StatusList
					items={info?.inProgressOptions}
					droppableId="inProgress"
					title="In Progress"
				/>
				<StatusList
					items={info?.completedOptions}
					droppableId="completed"
					title="Completed"
				/>
			</DragDropContext>
		</div>
	);
};

export default memo(StatusEditDropDown);
