import React, { memo, useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactComponent as ArrowLeftSvg } from '../../../../assets/svg/tasks/arrowLeft.svg';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as SixDotsSvg } from '../../../../assets/svg/tasks/sixDots.svg';
import { ReactComponent as OpenEye } from '../../../../assets/svg/gallery/open-eye.svg';
import '../../../../assets/scss/dropdown/tasks/statusEditDropDown.scss';
import PropertyEditDropDown from './PropertyEditDropDown';

const StatusEditDropDown = ({ options, handleEditPropertyChange, handleClose, colors }) => {
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
		const todoOptions = [];
		const inProgressOptions = [];
		const completedOptions = [];

		options?.forEach((option) => {
			if (option?.group === 'todo') {
				todoOptions?.push(option);
			} else if (option?.group === 'inProgress') {
				inProgressOptions?.push(option);
			} else if (option?.group === 'completed') {
				completedOptions?.push(option);
			}
		});

		setInfo((prev) => ({
			...prev,
			todoOptions,
			inProgressOptions,
			completedOptions,
		}));
	}, [options]);

	const handleDragEnd = (result) => {
		if (!result?.destination) return;

		const sourceId = result?.source?.droppableId;
		const destinationId = result?.destination?.droppableId;
		const sourceIndex = result?.source?.index;
		const destinationIndex = result?.destination?.index;

		setInfo((prevInfo) => {
			const newInfo = { ...prevInfo };

			// Get source and destination lists
			const sourcePropName = `${sourceId}Options`;
			const destPropName = `${destinationId}Options`;

			// Handle same list reordering
			if (sourceId === destinationId) {
				const list = [...newInfo[sourcePropName]];
				const [removed] = list.splice(sourceIndex, 1);
				list.splice(destinationIndex, 0, removed);
				newInfo[sourcePropName] = list;
			}
			// Handle moving between lists
			else {
				const sourceList = [...newInfo[sourcePropName]];
				const destList = [...newInfo[destPropName]];
				const [removed] = sourceList.splice(sourceIndex, 1);

				// Update the group when moving between lists
				removed.group = destinationId;
				destList.splice(destinationIndex, 0, removed);

				newInfo[sourcePropName] = sourceList;
				newInfo[destPropName] = destList;
			}

			return newInfo;
		});
	};

	const handleAddClick = (group) => {
		setInfo((prev) => ({
			...prev,
			addNewProperty: {
				...prev.addNewProperty,
				show: !prev.addNewProperty.show,
				group,
				label: '',
			},
		}));
	};

	const handleInputChange = (e) => {
		setInfo((prev) => ({
			...prev,
			addNewProperty: {
				...prev.addNewProperty,
				label: e?.target?.value,
			},
		}));
	};

	const handleInputKeyDown = (e) => {
		if (e.key === 'Enter' && info.addNewProperty.label.trim()) {
			// Add new status
			const newStatus = {
				_id: `temp_${Date.now()}`,
				group: info.addNewProperty.group,
				label: info.addNewProperty.label.trim(),
				color: 6,
			};

			// Update the appropriate list based on group
			setInfo((prev) => ({
				...prev,
				[`${info.addNewProperty.group}Options`]: [
					...prev[`${info.addNewProperty.group}Options`],
					newStatus,
				],
				addNewProperty: {
					...prev.addNewProperty,
					label: '',
				},
			}));
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
									<PropertyEditDropDown>
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
