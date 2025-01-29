import React, { memo, useRef, useLayoutEffect, useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Tooltip } from 'antd';
import { ReactComponent as SixDotsSvg } from '../../../../assets/svg/tasks/sixDots.svg';
import { ReactComponent as EditIcon } from '../../../../assets/svg/tasks/pencilWithLine.svg';
import { ReactComponent as DuplicateIcon } from '../../../../assets/svg/tasks/duplicate.svg';
import { ReactComponent as DeleteIcon } from '../../../../assets/svg/tasks/dustBin.svg';
import '../../../../assets/scss/tasks/tabHeader.scss';
import TabDropDown from '../../dropDown/tasks/TabDropDown';

const tabDropdownOptions = [
	{ icon: <EditIcon />, label: 'Rename View', value: 'renameView' },
	{ icon: <EditIcon />, label: 'Edit View', value: 'editView' },
	{ icon: <DuplicateIcon />, label: 'Duplicate View', value: 'duplicateView' },
	{
		icon: <DeleteIcon className="task-delete-icon" />,
		label: 'Delete View',
		value: 'deleteView',
	},
];

const TabHeader = ({
	activeTab,
	onTabChange,
	tabs,
	onTabsReorder,
	showDropDown = false,
	handleTabDropdownClick,
}) => {
	const containerRef = useRef(null);
	const tabRefs = useRef({});
	const [tabList, setTabList] = useState([]);
	const [visibleCount, setVisibleCount] = useState(0);

	const [info, setInfo] = useState({
		dropdownIsOpen: false,
	});

	const handleDropDown = (value) => {
		setInfo((prevInfo) => ({ ...prevInfo, dropdownIsOpen: value }));
	};

	// Update tabList when tabs prop changes, sorting by order
	useLayoutEffect(() => {
		const tabArray = Object.values(tabs || {}).sort((a, b) => a.order - b.order);
		setTabList(tabArray);
		setVisibleCount(tabArray.length);
	}, [tabs]);

	const calculateVisibleTabs = useCallback(() => {
		if (!containerRef.current || !tabList.length) return;

		const containerWidth = containerRef.current.offsetWidth;
		const moreButtonWidth = 80;
		let availableWidth = containerWidth - moreButtonWidth;
		let count = 0;

		// Calculate visible count synchronously
		for (const tab of tabList) {
			const tabElement = tabRefs.current[tab._id];
			if (!tabElement) continue;

			const tabWidth = tabElement.offsetWidth + 8;
			if (availableWidth >= tabWidth) {
				count++;
				availableWidth -= tabWidth;
			} else {
				break;
			}
		}

		setVisibleCount(count);
	}, [tabList]);

	useLayoutEffect(() => {
		calculateVisibleTabs();
	}, [calculateVisibleTabs]);

	useLayoutEffect(() => {
		const resizeObserver = new ResizeObserver(() => {
			requestAnimationFrame(calculateVisibleTabs);
		});

		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		return () => resizeObserver.disconnect();
	}, [calculateVisibleTabs]);

	const handleDragEnd = (result) => {
		if (!result.destination) return;

		const sourceIndex = result.source.index;
		const destinationIndex = result.destination.index;

		const newTabList = Array.from(tabList);
		const [movedItem] = newTabList.splice(sourceIndex, 1);
		newTabList.splice(destinationIndex, 0, movedItem);

		setTabList(newTabList);
		onTabsReorder(newTabList);
	};

	const handleOverflowDragEnd = (result) => {
		if (!result.destination) return;
		handleDragEnd(result);
	};

	return (
		<div className="tabHeader" ref={containerRef}>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId="tabs" direction="horizontal">
					{(provided) => (
						<div
							className="tabs-container"
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
							{tabList.slice(0, visibleCount).map((tab, index) => (
								<Draggable key={tab._id} draggableId={tab._id} index={index}>
									{(provided, snapshot) => (
										<Tooltip
											placement="bottom"
											arrow={false}
											color="transparent"
											trigger="click"
											destroyTooltipOnHide
											open={
												showDropDown &&
												activeTab === tab._id &&
												info?.dropdownIsOpen
											}
											onOpenChange={(open) => {
												if (!open) {
													handleDropDown(false);
												}
											}}
											overlayClassName="tab-dropdown"
											title={
												activeTab === tab._id ? (
													<TabDropDown
														options={tabDropdownOptions}
														onOptionClick={(option) => {
															handleTabDropdownClick(option);
														}}
													/>
												) : null
											}
										>
											<div
												ref={(el) => {
													provided.innerRef(el);
													tabRefs.current[tab._id] = el;
												}}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className={`tabHeaderButton ${
													activeTab === tab._id ? 'active' : ''
												} ${snapshot.isDragging ? 'dragging' : ''}`}
												onClick={() => {
													onTabChange(tab);
													handleDropDown(true);
												}}
											>
												{tab?.Icon && <tab.Icon />}
												<span className="tab-label">{tab?.label}</span>
												<span className="tab-underline" />
											</div>
										</Tooltip>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>

			{tabList.length > visibleCount && (
				<Tooltip
					placement="bottom"
					arrow={false}
					color="transparent"
					trigger="click"
					overlayClassName="tabs-overflow-dropdown"
					title={
						<div className="tabs-overflow-content">
							<div className="tabs-overflow-header">All Tabs</div>
							<DragDropContext onDragEnd={handleOverflowDragEnd}>
								<Droppable droppableId="more-tabs">
									{(provided) => (
										<div
											className="tabs-overflow-list"
											ref={provided.innerRef}
											{...provided.droppableProps}
										>
											{tabList.map((tab, index) => (
												<Draggable
													key={tab._id}
													draggableId={tab._id}
													index={index}
												>
													{(provided, snapshot) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															className={`overflow-tab-item ${
																snapshot.isDragging
																	? 'dragging'
																	: ''
															} ${
																activeTab === tab._id
																	? 'active'
																	: ''
															}`}
															onClick={() => onTabChange(tab)}
														>
															<div
																{...provided.dragHandleProps}
																className="drag-handle"
															>
																<SixDotsSvg />
															</div>
															{tab?.Icon && <tab.Icon />}
															<span className="tab-label">
																{tab?.label}
															</span>
														</div>
													)}
												</Draggable>
											))}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</DragDropContext>
						</div>
					}
				>
					<button className="more-tabs-button">
						{tabList.length - visibleCount} more...
					</button>
				</Tooltip>
			)}
		</div>
	);
};

export default memo(TabHeader);
