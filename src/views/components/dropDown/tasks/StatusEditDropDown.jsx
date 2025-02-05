import React, { memo, useContext, useEffect, useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactComponent as ArrowLeftSvg } from '../../../../assets/svg/tasks/arrowLeft.svg';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as SixDotsSvg } from '../../../../assets/svg/tasks/sixDots.svg';
import { ReactComponent as OpenEye } from '../../../../assets/svg/gallery/open-eye.svg';
import '../../../../assets/scss/dropdown/tasks/statusEditDropDown.scss';
import PropertyEditDropDown from './PropertyEditDropDown';
import Context from '../../../../context/context';
import { message } from 'antd';

const StatusEditDropDown = ({ handleEditPropertyChange, handleClose, colors }) => {
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
	});

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
			const response = await updateStatusLabel(
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

			if (response?.[0]) {
				message.success('Status order updated successfully');
			} else {
				throw new Error(response?.[1]?.[0]?.message || 'Failed to update status order');
			}
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

			// Call API to update the status

			const response = await updateStatusLabel(
				{
					taskMetadataId: taskMetadata?._id,
					labelId: status._id,
					group: status.group,
					input: updates,
				},
				status.group,
			);
			if (response?.[0]) {
				message.success('Status updated successfully');
			} else {
				throw new Error(response?.[1]?.[0]?.message);
			}
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
									<PropertyEditDropDown
										colors={colors}
										value={option}
										onDelete={() => handleDeleteStatus(option)}
										onUpdate={(updates) => handleStatusUpdate(option, updates)}
									>
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											className={`property-edit-section-option-item ${
												snapshot.isDragging ? 'dragging' : ''
											}`}
										>
											<div
												{...provided.dragHandleProps}
												className="drag-handle-icon"
											>
												<SixDotsSvg />
											</div>
											<span className="property-edit-section-body-option-wrapper">
												<span
													className="status-option-container"
													style={{
														backgroundColor:
															colors?.[option?.color]
																?.backgroundColor,
													}}
												>
													<span
														className="status-option-dot"
														style={{
															backgroundColor:
																colors?.[option?.color]?.color,
														}}
													></span>
													<span className="status-option-label">
														{option?.label}
													</span>
												</span>
											</span>
											{option?.isDefault ? (
												<span className="default-status-text">DEFAULT</span>
											) : (
												''
											)}
											<ChevronRightThinSvg />
										</div>
									</PropertyEditDropDown>
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
			<div className="options-property-edit-header">
				<ArrowLeftSvg
					className="cursor-pointer"
					onClick={() => handleEditPropertyChange(null)}
				/>
				<span className="options-property-edit-header-title">Edit property</span>
				<CrossSvg className="cursor-pointer" onClick={handleClose} />
			</div>

			<div className="property-edit-section">
				<div className="property-edit-section-body">
					<div className="property-edit-section-body-item">
						<div className="property-edit-section-body-item-title">Name</div>
						<div className="property-edit-section-body-item-value">Status</div>
					</div>
					<div className="property-edit-section-body-item">
						<div className="property-edit-section-body-item-title">Shown as</div>
						<div className="property-edit-section-body-item-value">Status</div>
					</div>
				</div>
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

			<div className="property-edit-footer">
				<OpenEye />
				<span className="property-edit-footer-title">Show in view</span>
			</div>
		</div>
	);
};

export default memo(StatusEditDropDown);
