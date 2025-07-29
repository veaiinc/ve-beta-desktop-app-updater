import React, { memo, useRef, useLayoutEffect, useState, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Tooltip } from 'antd';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import '../../../../assets/scss/tasks/tabHeader.scss';
import TabDropDown from '../../dropDown/tasks/TabDropDown';
import DropDown from '../../dropDown/tasks/DropDown';
import SixDotsSvg from '../../../../assets/svg/tasks/SixDotsSvg';
import EditSvg from '../../../../assets/svg/ai_assistant/EditSvg';
import DuplicateSvg from '../../../../assets/svg/tasks/DuplicateSvg';
import DeleteSvg from '../../../../assets/svg/tasks/DeleteSvg';

const tabDropdownOptions = [
	{ icon: <EditSvg />, label: 'Rename View', value: 'renameView' },
	{ icon: <EditSvg />, label: 'Edit View', value: 'editView' },
	{ icon: <DuplicateSvg />, label: 'Duplicate View', value: 'duplicateView' },
	{
		icon: <DeleteSvg />,
		label: 'Delete View',
		value: 'deleteView',
	},
];

const TAB_GAP = 8;
const HEADER_HEIGHT = 43;
const MORE_BUTTON_WIDTH = 85;
const ADD_BUTTON_WIDTH = 32;
const MINIMUM_TAB_WIDTH = 80;
const MAXIMUM_TAB_WIDTH = 200; // Maximum width for a tab
const TAB_PADDING = 16; // 8px padding on each side

const TabHeader = ({
	activeTab,
	onTabChange,
	tabs,
	onTabsReorder,
	showDropDown = false,
	handleTabDropdownClick,
	layoutOptions,
	handleLayoutOptionClick,
}) => {
	const containerRef = useRef(null);
	const tabsContainerRef = useRef(null);
	const [tabList, setTabList] = useState([]);
	const [dimensions, setDimensions] = useState({
		containerWidth: 0,
		tabSizes: new Map(),
	});
	const [visibility, setVisibility] = useState({
		visibleCount: 0,
		shouldShowOverflow: false,
	});
	const dimensionsRef = useRef(dimensions);
	dimensionsRef.current = dimensions;

	const [info, setInfo] = useState({
		dropdownIsOpen: false,
	});

	const handleDropDown = (value) => {
		setInfo((prevInfo) => ({ ...prevInfo, dropdownIsOpen: value }));
	};

	useLayoutEffect(() => {
		const tabArray = Object.values(tabs || {}).sort((a, b) => a.order - b.order);
		setTabList(tabArray);
	}, [tabs]);

	const measureTabSizes = useCallback(() => {
		if (!tabsContainerRef.current) return new Map();

		const newTabSizes = new Map();
		const tabElements = Array.from(tabsContainerRef.current.children).filter((child) =>
			child.classList.contains('tabHeaderButton'),
		);

		tabElements.forEach((tab, index) => {
			// Measure the content width without constraints
			const label = tab.querySelector('.tab-label');
			const icon = tab.querySelector('.tab-icon');

			// Start with minimum width
			let contentWidth = MINIMUM_TAB_WIDTH;

			if (label) {
				// Create a measurement div with the same text but not constrained
				const measureDiv = document.createElement('div');
				measureDiv.style.position = 'absolute';
				measureDiv.style.visibility = 'hidden';
				measureDiv.style.whiteSpace = 'nowrap';
				measureDiv.style.width = 'auto';
				measureDiv.style.fontFamily = getComputedStyle(label).fontFamily;
				measureDiv.style.fontSize = getComputedStyle(label).fontSize;
				measureDiv.style.fontWeight = getComputedStyle(label).fontWeight;
				measureDiv.innerText = label.innerText;
				document.body.appendChild(measureDiv);

				// Calculate content width: text width + icon width (if exists) + padding
				contentWidth = measureDiv.getBoundingClientRect().width;
				if (icon) {
					contentWidth += icon.getBoundingClientRect().width + 8; // 8px gap between icon and text
				}
				contentWidth += TAB_PADDING; // Add padding

				document.body.removeChild(measureDiv);
			}

			// Constrain width between minimum and maximum
			const width = Math.min(Math.max(contentWidth, MINIMUM_TAB_WIDTH), MAXIMUM_TAB_WIDTH);

			newTabSizes.set(index, width);
		});

		return newTabSizes;
	}, []);

	useLayoutEffect(() => {
		if (!containerRef.current) return;

		const updateDimensions = () => {
			// First, ensure we have the correct tab list data
			const newTabSizes = measureTabSizes();

			// Update dimensions with the new container width and tab sizes
			setDimensions({
				containerWidth: containerRef.current?.offsetWidth || 0,
				tabSizes: newTabSizes,
			});
		};

		// Initial update
		updateDimensions();

		// Set up resize observer for responsive behavior
		const resizeObserver = new ResizeObserver(() => {
			requestAnimationFrame(updateDimensions);
		});

		resizeObserver.observe(containerRef.current);
		return () => resizeObserver.disconnect();
	}, [measureTabSizes, tabList]);

	useLayoutEffect(() => {
		if (!dimensions.containerWidth || !tabList.length) return;

		const calculateVisibility = () => {
			// Account for padding, add button, and extra space for potential "more" button
			const availableWidth = dimensions.containerWidth - ADD_BUTTON_WIDTH - TAB_GAP * 2;

			// Calculate total width if all tabs were shown
			const tabWidths = [];
			let allTabsWidth = 0;

			// Get all tab widths
			for (let i = 0; i < tabList.length; i++) {
				const tabWidth = dimensions.tabSizes.get(i) || MINIMUM_TAB_WIDTH;
				tabWidths.push(tabWidth);
				allTabsWidth += tabWidth + (i < tabList.length - 1 ? TAB_GAP : 0);
			}

			// If all tabs fit, show them all
			if (allTabsWidth <= availableWidth) {
				return {
					visibleCount: tabList.length,
					shouldShowOverflow: false,
				};
			}

			// Otherwise, calculate how many tabs can fit
			let totalWidth = 0;
			let visibleCount = 0;

			// First pass: try to fit as many tabs as possible, reserve space for "more" button
			const moreButtonSpace = MORE_BUTTON_WIDTH + TAB_GAP; // Space for "more" button
			const availableForTabs = availableWidth - moreButtonSpace;

			for (let i = 0; i < tabList.length; i++) {
				const tabWidth = tabWidths[i];
				const widthWithGap = tabWidth + (i < tabList.length - 1 ? TAB_GAP : 0);

				if (totalWidth + widthWithGap <= availableForTabs) {
					totalWidth += widthWithGap;
					visibleCount++;
				} else {
					break;
				}
			}

			// If we can show all tabs without the "more" button, do so
			if (visibleCount === tabList.length) {
				return {
					visibleCount: tabList.length,
					shouldShowOverflow: false,
				};
			}

			// Otherwise, show what fits plus the "more" button
			return {
				visibleCount: Math.max(1, visibleCount),
				shouldShowOverflow: true,
			};
		};

		const newVisibility = calculateVisibility();
		setVisibility(newVisibility);
	}, [dimensions, tabList]);

	useLayoutEffect(() => {
		if (!tabList.length) return;

		requestAnimationFrame(() => {
			const newTabSizes = measureTabSizes();
			setDimensions((prev) => ({
				...prev,
				tabSizes: newTabSizes,
			}));
		});
	}, [tabList, measureTabSizes]);

	const handleDragEnd = (result) => {
		if (!result?.destination) return;

		const sourceIndex = result?.source?.index;
		const destinationIndex = result?.destination?.index;

		const newTabList = Array.from(tabList);
		const [movedItem] = newTabList?.splice(sourceIndex, 1);
		newTabList?.splice(destinationIndex, 0, movedItem);

		setTabList(newTabList);
		onTabsReorder(newTabList, movedItem, destinationIndex);
	};

	// Function to adjust tab widths to distribute available space
	const getTabStyle = (index) => {
		const baseWidth = dimensions.tabSizes.get(index) || MINIMUM_TAB_WIDTH;

		// If we're showing all tabs and there's extra space, distribute it
		if (!visibility.shouldShowOverflow && visibility.visibleCount === tabList.length) {
			const totalTabsWidth = Array.from(
				{ length: tabList.length },
				(_, i) => dimensions.tabSizes.get(i) || MINIMUM_TAB_WIDTH,
			).reduce((sum, width, i) => sum + width + (i < tabList.length - 1 ? TAB_GAP : 0), 0);

			const availableWidth = dimensions.containerWidth - ADD_BUTTON_WIDTH - TAB_GAP * 2;

			if (totalTabsWidth < availableWidth) {
				// Calculate how much extra width each tab can get
				const extraWidth = availableWidth - totalTabsWidth;
				const extraWidthPerTab = extraWidth / tabList.length;

				// Set a fixed width that includes the distributed extra space
				const newWidth = baseWidth + extraWidthPerTab;

				return {
					width: `${newWidth}px`,
					minWidth: `${MINIMUM_TAB_WIDTH}px`,
					// Use flex grow for smooth space distribution
					flex: `${baseWidth} 1 ${baseWidth}px`,
				};
			}
		}

		// Default style with explicit width
		return {
			width: `${baseWidth}px`,
			minWidth: `${MINIMUM_TAB_WIDTH}px`,
			maxWidth: `${MAXIMUM_TAB_WIDTH}px`,
		};
	};

	return (
		<div className="tabHeader" ref={containerRef}>
			<DragDropContext onDragEnd={handleDragEnd}>
				<Droppable droppableId="tabs" direction="horizontal">
					{(provided) => (
						<div
							className="tabs-container"
							ref={(el) => {
								provided.innerRef(el);
								tabsContainerRef.current = el;
							}}
							{...provided.droppableProps}
						>
							{tabList.map((tab, index) => (
								<Draggable
									key={tab._id}
									draggableId={tab._id}
									index={index}
									isDragDisabled={index >= visibility.visibleCount}
								>
									{(provided, snapshot) => (
										<Tooltip
											placement="bottom"
											arrow={false}
											color="transparent"
											trigger="click"
											destroyOnHidden={true}
											open={
												showDropDown &&
												activeTab === tab?._id &&
												info?.dropdownIsOpen &&
												index < visibility.visibleCount
											}
											onOpenChange={(open) => {
												if (!open) {
													handleDropDown(false);
												}
											}}
											classNames={{ root: 'tab-dropdown' }}
											title={
												activeTab === tab._id &&
												index < visibility.visibleCount ? (
													<TabDropDown
														options={tabDropdownOptions?.filter(
															(item) =>
																!(
																	tabList?.length == 1 &&
																	item.value === 'deleteView'
																),
														)}
														onOptionClick={(option) => {
															handleDropDown(false);
															handleTabDropdownClick(option);
														}}
													/>
												) : null
											}
										>
											<div
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className={`tabHeaderButton ${
													activeTab === tab._id ? 'active' : ''
												} ${snapshot.isDragging ? 'dragging' : ''}`}
												onClick={() => {
													if (index < visibility.visibleCount) {
														onTabChange(tab);
														handleDropDown(true);
													}
												}}
												style={{
													...provided.draggableProps.style,
													display:
														index >= visibility.visibleCount
															? 'none'
															: undefined,
													...getTabStyle(index),
												}}
												title={tab?.label} // Add title attribute for native browser tooltip
											>
												{tab?.Icon && <tab.Icon className="tab-icon" />}
												<span className="tab-label">{tab?.label}</span>
												<span className="tab-underline" />
											</div>
										</Tooltip>
									)}
								</Draggable>
							))}
							{provided.placeholder}
							<div className="add-tab-button-wrapper">
								<DropDown
									options={layoutOptions}
									title="New view"
									valueSelector="value"
									onOptionClick={handleLayoutOptionClick}
								>
									<div className="add-tab-button">
										<PlusSvg />
									</div>
								</DropDown>
							</div>
						</div>
					)}
				</Droppable>
			</DragDropContext>
			{visibility.shouldShowOverflow && (
				<Tooltip
					placement="bottom"
					arrow={false}
					color="transparent"
					trigger="click"
					classNames={{ root: 'tabs-overflow-dropdown' }}
					title={
						<div className="tabs-overflow-content">
							<div className="tabs-overflow-header">All Tabs</div>
							<DragDropContext onDragEnd={handleDragEnd}>
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
						{tabList.length - visibility.visibleCount} more...
					</button>
				</Tooltip>
			)}
		</div>
	);
};

export default memo(TabHeader);
