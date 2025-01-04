import { Tooltip } from 'antd';
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import '../../../../assets/scss/dropdown/tasks/optionsDropDown.scss';
import { ReactComponent as HorizontalMoreIcon } from '../../../../assets/svg/tasks/horizontalDotsThin.svg';
import { ReactComponent as OpenEye } from '../../../../assets/svg/gallery/open-eye.svg';
import { ReactComponent as CrossedOpenEye } from '../../../../assets/svg/gallery/crossedOpenEye.svg';
import { ReactComponent as CrossSvg } from '../../../../assets/svg/gallery/cross.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as SixDotsSvg } from '../../../../assets/svg/tasks/sixDots.svg';
import { ReactComponent as ArrowLeftSvg } from '../../../../assets/svg/tasks/arrowLeft.svg';
import Context from '../../../../context/context';
import StatusEditDropDown from './StatusEditDropDown';

const OptionsDropDown = ({
	properties,
	updateListViewInfo,
	taskPreferences,
	editingProperty,
	handleEditPropertyChange,
	responseMetadata,
	colors,
}) => {
	const {
		companyInfo: { updateTaskPreferences },
	} = useContext(Context);
	const [info, setInfo] = useState({
		selected: null,
		hiddenProperties: [],
		shownProperties: [],
		isOpen: false,

		addNewProperty: {
			show: false,
			group: null,
			label: '',
		},
	});

	useEffect(() => {
		const shownArray = [];
		const hiddenArray = [];
		const sortedProperties = [...properties].sort((a, b) => a.order - b.order);

		sortedProperties.forEach((property) => {
			if (property?.show) {
				shownArray?.push(property);
			} else {
				hiddenArray?.push(property);
			}
		});

		setInfo((prevInfo) => ({
			...prevInfo,
			shownProperties: shownArray,
			hiddenProperties: hiddenArray,
		}));
	}, [properties]);

	useEffect(() => {
		if (editingProperty) {
			setInfo((prevInfo) => ({
				...prevInfo,
				isOpen: true,
			}));
		}
	}, [editingProperty]);

	const updatePropertyPreference = useCallback(
		(propName, value) => {
			let newOrder = 1;

			if (value?.show) {
				const maxOrder = Math?.max(
					...properties?.filter((p) => p?.show)?.map((p) => p?.order || 0),
					0,
				);
				newOrder = maxOrder + 1;
			}

			const newProperties = properties?.map((property) => {
				if (property?.value === propName) {
					return {
						...property,
						...value,
						order: newOrder,
					};
				}
				return property;
			});

			const sortedProperties = newProperties?.sort((a, b) => a?.order - b?.order);

			updateListViewInfo('properties', sortedProperties);

			const newTaskPreferences = {
				...taskPreferences,
				[propName]: {
					...taskPreferences?.[propName],
					...value,
					order: newOrder,
				},
			};
			updateListViewInfo('taskPreferences', newTaskPreferences);
			updateTaskPreferences(newTaskPreferences);
		},
		[properties, updateListViewInfo, taskPreferences, updateTaskPreferences],
	);

	const handleDragEnd = useCallback(
		(result) => {
			if (!result?.destination) return;

			const sourceIndex = result?.source?.index;
			const destinationIndex = result?.destination?.index;
			const sourceListType = result?.source?.droppableId;
			const destinationListType = result?.destination?.droppableId;

			// Get updated lists first
			let updatedShownList = [...info?.shownProperties] || [];
			let updatedHiddenList = [...info?.hiddenProperties] || [];

			// Handle same list reordering or cross-list movement
			if (sourceListType === destinationListType) {
				const list = sourceListType === 'shown' ? updatedShownList : updatedHiddenList;
				const [removed] = list?.splice(sourceIndex, 1) || [];
				list?.splice(destinationIndex, 0, removed);

				if (sourceListType === 'shown') {
					updatedShownList = list;
				} else {
					updatedHiddenList = list;
				}
			} else {
				const sourceList =
					sourceListType === 'shown' ? updatedShownList : updatedHiddenList;
				const destList =
					destinationListType === 'shown' ? updatedShownList : updatedHiddenList;
				const [removed] = sourceList?.splice(sourceIndex, 1) || [];

				if (removed?.value === 'title' && destinationListType === 'hidden') {
					updatedShownList?.push(removed);
				} else {
					removed.show = destinationListType === 'shown';
					destList?.splice(destinationIndex, 0, removed);
				}
			}

			// Update local state
			setInfo((prev) => ({
				...prev,
				shownProperties: updatedShownList,
				hiddenProperties: updatedHiddenList,
			}));

			// Update properties and preferences
			const updatedProperties = [...properties];
			let currentOrder = 1;

			updatedShownList?.forEach((prop) => {
				const propertyIndex = updatedProperties?.findIndex((p) => p?.value === prop?.value);
				if (propertyIndex !== -1) {
					updatedProperties[propertyIndex] = {
						...updatedProperties[propertyIndex],
						show: true,
						order: currentOrder++,
					};
				}
			});

			updatedHiddenList?.forEach((prop) => {
				const propertyIndex = updatedProperties?.findIndex((p) => p?.value === prop?.value);
				if (propertyIndex !== -1) {
					updatedProperties[propertyIndex] = {
						...updatedProperties[propertyIndex],
						show: false,
						order: currentOrder++,
					};
				}
			});

			const newTaskPreferences = { ...taskPreferences };
			updatedProperties?.forEach((property) => {
				newTaskPreferences[property?.value] = {
					...newTaskPreferences[property?.value],
					show: property?.show,
					order: property?.order,
				};
			});

			updateListViewInfo('properties', updatedProperties);
			updateListViewInfo('taskPreferences', newTaskPreferences);
			updateTaskPreferences(newTaskPreferences);
		},
		[properties, updateListViewInfo, taskPreferences, updateTaskPreferences, info],
	);

	const handleShowAll = useCallback(() => {
		let maxOrder = Math.max(...properties.filter((p) => p.show).map((p) => p.order || 0), 0);

		const newProperties = properties?.map((property) => {
			if (!property.show) {
				maxOrder++;
				return {
					...property,
					show: true,
					order: maxOrder,
				};
			}
			return property;
		});

		updateListViewInfo('properties', newProperties);

		const newTaskPreferences = { ...taskPreferences };
		newProperties.forEach((property) => {
			newTaskPreferences[property.value] = {
				...newTaskPreferences[property.value],
				show: true,
				order: property.order,
			};
		});
		updateListViewInfo('taskPreferences', newTaskPreferences);
		updateTaskPreferences(newTaskPreferences);
	}, [properties, updateListViewInfo, taskPreferences, updateTaskPreferences]);

	const handleHideAll = useCallback(() => {
		let currentOrder = 1;

		const newProperties = properties?.map((property) => {
			if (property.value === 'title') {
				return {
					...property,
					show: true,
					order: 1,
				};
			}
			currentOrder++;
			return {
				...property,
				show: false,
				order: currentOrder,
			};
		});

		updateListViewInfo('properties', newProperties);

		const newTaskPreferences = { ...taskPreferences };
		newProperties.forEach((property) => {
			newTaskPreferences[property.value] = {
				...newTaskPreferences[property.value],
				show: property.value === 'title',
				order: property.order,
			};
		});
		updateListViewInfo('taskPreferences', newTaskPreferences);
		updateTaskPreferences(newTaskPreferences);
	}, [properties, updateListViewInfo, taskPreferences, updateTaskPreferences]);

	const handleDropdownVisibility = useCallback(
		(visible) => {
			setInfo((prev) => ({ ...prev, isOpen: visible }));
			if (!visible) {
				handleEditPropertyChange(null);
			}
		},
		[handleEditPropertyChange],
	);

	const handleClose = useCallback(() => {
		setInfo((prev) => ({ ...prev, isOpen: false }));
		handleEditPropertyChange(null);
	}, [handleEditPropertyChange]);

	const PropertyList = ({ items, droppableId }) => (
		<Droppable droppableId={droppableId}>
			{(provided) => (
				<div
					ref={provided.innerRef}
					{...provided.droppableProps}
					className="options-dropdown-property-container"
				>
					{items?.map(({ Icon = null, label, value }, index) => (
						<Draggable key={value} draggableId={value} index={index}>
							{(provided, snapshot) => (
								<div
									ref={provided.innerRef}
									{...provided.draggableProps}
									className={`property-listItem ${
										snapshot.isDragging ? 'dragging' : ''
									}`}
									onClick={() => {
										if (value === 'status') {
											handleEditPropertyChange({
												propName: 'status',
											});
										}
									}}
								>
									<div {...provided.dragHandleProps} className="drag-handle-icon">
										<SixDotsSvg />
									</div>
									{Icon && <Icon />}
									<span className="property-listItem-title">{label}</span>
									{droppableId === 'shown' ? (
										value === 'title' ? (
											<OpenEye className="crossed-eye-icon" />
										) : (
											<OpenEye
												onClick={() =>
													updatePropertyPreference(value, { show: false })
												}
											/>
										)
									) : (
										<CrossedOpenEye
											className="crossed-eye-icon"
											onClick={() =>
												updatePropertyPreference(value, { show: true })
											}
										/>
									)}
									{value === 'status' ? (
										<ChevronRightThinSvg />
									) : (
										<div style={{ width: '16px' }}></div>
									)}
								</div>
							)}
						</Draggable>
					))}
					{provided.placeholder}
				</div>
			)}
		</Droppable>
	);

	return (
		<Tooltip
			placement="bottomRight"
			open={info.isOpen}
			onOpenChange={handleDropdownVisibility}
			title={
				!editingProperty ? (
					<div className="options-dropdown-container">
						<div className="options-dropdown-header">
							<span className="options-dropdown-header-title-wrapper">
								<ArrowLeftSvg className="cursor-pointer" onClick={handleClose} />
								<span className="options-dropdown-header-title">Properties</span>
							</span>
							<CrossSvg className="cursor-pointer" onClick={handleClose} />
						</div>
						<DragDropContext onDragEnd={handleDragEnd}>
							{info?.shownProperties?.length > 0 && (
								<div className="options-dropdown-body-show-container-header">
									<span className="section-title">Shown in List</span>
									<button
										className="btn-show-all"
										onClick={handleHideAll}
										disabled={info?.shownProperties?.length <= 1}
									>
										Hide all
									</button>
								</div>
							)}
							<PropertyList items={info.shownProperties} droppableId="shown" />

							{info?.hiddenProperties?.length > 0 && (
								<div className="options-dropdown-body-hide-container-header">
									<span className="section-title">Hidden in List</span>
									<button
										className="btn-show-all"
										onClick={handleShowAll}
										disabled={info?.hiddenProperties?.length === 0}
									>
										Show all
									</button>
								</div>
							)}
							<PropertyList items={info.hiddenProperties} droppableId="hidden" />
						</DragDropContext>
						{/* <div className="options-dropdown-footer">
						<PlusSvg className="add-new-property-icon" />
						<span className="add-new-property-title">Add new property</span>
						<ChevronRightThinSvg />
					</div> */}
					</div>
				) : (
					<StatusEditDropDown
						handleEditPropertyChange={handleEditPropertyChange}
						handleClose={handleClose}
						options={responseMetadata?.[editingProperty?.propName]?.props?.options}
						colors={colors}
					/>
				)
			}
			arrow={false}
			trigger={'click'}
			color={'transparent'}
			overlayStyle={{ minWidth: 'fit-content' }}
			overlayClassName="options-dropdown-tooltip"
		>
			<button className="btn-options">
				<HorizontalMoreIcon style={{ width: '20px', height: '20px' }} />
			</button>
		</Tooltip>
	);
};

export default memo(OptionsDropDown);
