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
	// ... (previous state and ref declarations remain the same) ...
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

	// ... (previous useLayoutEffect for tabList update remains the same) ...
	useLayoutEffect(() => {
		const tabArray = Object.values(tabs || {}).sort((a, b) => a.order - b.order);
		setTabList(tabArray);
	}, [tabs]);

	// ... (previous measureTabSizes function remains the same) ...
	const measureTabSizes = useCallback(() => {
		if (!tabsContainerRef.current) return new Map();

		const newTabSizes = new Map();
		const tabElements = Array.from(tabsContainerRef.current.children).filter((child) =>
			child.classList.contains('tabHeaderButton'),
		);

		tabElements.forEach((tab, index) => {
			const width = Math.max(tab.offsetWidth, MINIMUM_TAB_WIDTH);
			newTabSizes.set(index, width);
		});

		return newTabSizes;
	}, []);

	// ... (previous dimension update useLayoutEffect remains the same) ...
	useLayoutEffect(() => {
		if (!containerRef.current) return;

		const updateDimensions = () => {
			const newTabSizes = measureTabSizes();
			setDimensions((prev) => ({
				containerWidth: containerRef.current?.offsetWidth || 0,
				tabSizes: newTabSizes,
			}));
		};

		updateDimensions();
		const resizeObserver = new ResizeObserver(() => {
			requestAnimationFrame(updateDimensions);
		});

		resizeObserver.observe(containerRef.current);
		return () => resizeObserver.disconnect();
	}, [measureTabSizes]);

	// ... (previous visibility calculation useLayoutEffect remains the same) ...
	useLayoutEffect(() => {
		if (!dimensions.containerWidth || !tabList.length) return;

		const calculateVisibility = () => {
			const availableWidth = dimensions.containerWidth - ADD_BUTTON_WIDTH - TAB_GAP * 2;
			let totalWidth = 0;
			let visibleCount = 0;
			let needsOverflow = false;

			// First pass: try to fit all tabs
			for (let i = 0; i < tabList.length; i++) {
				const tabWidth = dimensions.tabSizes.get(i) || MINIMUM_TAB_WIDTH;
				const widthWithGap = tabWidth + TAB_GAP;

				if (totalWidth + widthWithGap <= availableWidth) {
					totalWidth += widthWithGap;
					visibleCount++;
				} else {
					needsOverflow = true;
					break;
				}
			}

			// If we need overflow, recalculate with more button
			if (needsOverflow) {
				totalWidth = 0;
				visibleCount = 0;
				const availableWithMore = availableWidth - MORE_BUTTON_WIDTH;

				for (let i = 0; i < tabList.length; i++) {
					const tabWidth = dimensions.tabSizes.get(i) || MINIMUM_TAB_WIDTH;
					const widthWithGap = tabWidth + TAB_GAP;

					if (totalWidth + widthWithGap <= availableWithMore) {
						totalWidth += widthWithGap;
						visibleCount++;
					} else {
						break;
					}
				}
			}

			return {
				visibleCount: Math.max(1, visibleCount),
				shouldShowOverflow: needsOverflow,
			};
		};

		const newVisibility = calculateVisibility();
		setVisibility((prev) => {
			if (
				prev.visibleCount !== newVisibility.visibleCount ||
				prev.shouldShowOverflow !== newVisibility.shouldShowOverflow
			) {
				return newVisibility;
			}
			return prev;
		});
	}, [dimensions, tabList]);

	// ... (previous tab measurement useLayoutEffect remains the same) ...
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
											destroyTooltipOnHide
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
											overlayClassName="tab-dropdown"
											title={
												activeTab === tab._id &&
												index < visibility.visibleCount ? (
													<TabDropDown
														options={tabDropdownOptions}
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
					overlayClassName="tabs-overflow-dropdown"
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
