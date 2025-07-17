import React, { useState, memo, useRef, useEffect, useCallback } from 'react';
import '../../../../assets/scss/tasks/listTabs.scss';
import { Tooltip } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ReactComponent as SixDotsSvg } from '../../../../assets/svg/tasks/sixDots.svg';

const ListTabs = ({ tabs, defaultActiveTab }) => {
	const containerRef = useRef(null);
	const tabRefs = useRef({});
	const [activeTab, setActiveTab] = useState(defaultActiveTab || Object.keys(tabs)[0]);
	const [tabList, setTabList] = useState(Object.keys(tabs));
	const [visibleCount, setVisibleCount] = useState(Object.keys(tabs).length);

	useEffect(() => {
		calculateVisibleTabs();
	}, []);

	useEffect(() => {
		const resizeObserver = new ResizeObserver(() => {
			calculateVisibleTabs();
		});

		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		return () => resizeObserver.disconnect();
	}, []);

	const calculateVisibleTabs = useCallback(() => {
		if (!containerRef.current) return;

		const containerWidth = containerRef.current.offsetWidth;
		const moreButtonWidth = 80; // Approximate width of "more" button
		let availableWidth = containerWidth - moreButtonWidth;
		let count = 0;

		setVisibleCount(tabList.length);

		setTimeout(() => {
			for (const tab of tabList) {
				const tabElement = tabRefs.current[tab];
				if (!tabElement) continue;

				const tabWidth = tabElement.offsetWidth + 8; // 8px for gap
				if (availableWidth >= tabWidth) {
					count++;
					availableWidth -= tabWidth;
				} else {
					break;
				}
			}

			setVisibleCount(count);
		}, 0);
	}, [tabList]);

	const handleDragEnd = (result) => {
		if (!result.destination) return;

		const items = Array.from(tabList);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		setTabList(items);
	};

	return (
		<div className="list-tabs">
			<div className="list-tabs-header" ref={containerRef}>
				<DragDropContext onDragEnd={handleDragEnd}>
					<Droppable droppableId="tabs" direction="horizontal">
						{(provided) => (
							<div
								className="list-tabs-header-tabs-wrapper"
								ref={provided.innerRef}
								{...provided.droppableProps}
							>
								{tabList.slice(0, visibleCount).map((tab, index) => (
									<Draggable key={tab} draggableId={tab} index={index}>
										{(provided, snapshot) => (
											<div
												ref={(el) => {
													provided.innerRef(el);
													tabRefs.current[tab] = el;
												}}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												className={`list-tabs-header-tab ${
													activeTab === tab ? 'active' : ''
												} ${snapshot.isDragging ? 'dragging' : ''}`}
												onClick={() => setActiveTab(tab)}
											>
												<span className="list-tabs-header-tab-label">
													{tabs?.[tab]?.label}
												</span>
												<span className="list-tabs-header-tab-underline" />
											</div>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>

				<Tooltip
					placement="bottom"
					arrow={false}
					color="transparent"
					trigger="click"
					overlayClassName="list-tabs-header-more-button-tooltip"
					title={
						<div className="list-tabs-header-more-button-tooltip-content">
							<div className="list-tabs-header-more-button-tooltip-content-header">
								All Tabs
							</div>
							<DragDropContext onDragEnd={handleDragEnd}>
								<Droppable droppableId="more-tabs">
									{(provided) => (
										<div
											className="list-tabs-header-more-button-tooltip-content-list-wrapper"
											ref={provided.innerRef}
											{...provided.droppableProps}
										>
											{tabList.map((tab, index) => (
												<Draggable
													key={tab}
													draggableId={tab}
													index={index}
												>
													{(provided, snapshot) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															className={`list-tabs-header-more-button-tooltip-content-list-wrapper-item ${
																snapshot.isDragging
																	? 'dragging'
																	: ''
															} ${activeTab === tab ? 'active' : ''}`}
															onClick={() => setActiveTab(tab)}
														>
															<div
																{...provided.dragHandleProps}
																className="drag-handle"
															>
																<SixDotsSvg />
															</div>
															{tabs?.[tab]?.label}
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
					{tabList.length - visibleCount > 0 && (
						<button className="list-tabs-header-more-button">
							{tabList.length - visibleCount} more...
						</button>
					)}
				</Tooltip>
			</div>
			<div className="list-tabs-content">{tabs?.[activeTab]?.Component || ''}</div>
		</div>
	);
};

export default memo(ListTabs);
