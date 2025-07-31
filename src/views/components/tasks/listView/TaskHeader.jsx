import { memo, useState } from 'react';
import '../../../../assets/scss/tasks/taskHeader.scss';
import { ReactComponent as PlusIcon } from '../../../../assets/svg/tasks/plus.svg';
import { ReactComponent as ListViewIcon } from '../../../../assets/svg/tasks/list.svg';
import { ReactComponent as BoardViewIcon } from '../../../../assets/svg/tasks/board.svg';
import { ReactComponent as TableViewIcon } from '../../../../assets/svg/tasks/grid.svg';
import { ReactComponent as GalleryViewIcon } from '../../../../assets/svg/tasks/blocks.svg';
import { Tooltip } from 'antd';
import TabEditDropdown from '../../dropDown/tasks/TabEditDropdown';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const tooltipStyles = {
	body: { minWidth: 'fit-content', padding: '0' },
};

export const layouts = {
	list: {
		Icon: <ListViewIcon />,
		label: 'List',
		viewType: 'list',
	},
	board: {
		Icon: <BoardViewIcon />,
		label: 'Board',
		viewType: 'board',
	},
	table: {
		Icon: <TableViewIcon />,
		label: 'Table',
		viewType: 'table',
	},
	gallery: {
		Icon: <GalleryViewIcon />,
		label: 'Widget',
		viewType: 'gallery',
	},
};

const TaskHeader = ({
	tabArray,
	activeTab,
	handleTabChange,
	handleAddTab,
	handleTabDropdownClick,
	handleTabsReorder,
	showEditDuplicate = true,
}) => {
	const [info, setInfo] = useState({
		showAddNewTabDropDown: false,
	});

	const handleStateChange = (data) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			...data,
		}));
	};

	// const tabArray = useMemo(() => Object?.values(tabs || {}), [tabs]);

	const onDragEnd = (result) => {
		if (!result.destination) return;

		const items = Array.from(tabArray);
		const [reorderedItem] = items.splice(result.source.index, 1);
		items.splice(result.destination.index, 0, reorderedItem);

		handleTabsReorder(items, reorderedItem, result.destination.index);
	};

	return (
		<div className="task-tabs-header-container">
			<DragDropContext onDragEnd={onDragEnd}>
				<Droppable droppableId="tabs" direction="horizontal">
					{(provided) => (
						<div
							className="tab-wrapper"
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
							{tabArray?.map((tab, index) => (
								<Draggable key={tab?._id} draggableId={tab?._id} index={index}>
									{(provided) => (
										<div
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
										>
											<TabEditDropdown
												tab={tab}
												activeTab={activeTab}
												handleTabChange={handleTabChange}
												handleTabDropdownClick={handleTabDropdownClick}
												tabLength={tabArray?.length}
												showEditDuplicate={showEditDuplicate}
											/>
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
			<div className="tab-divider" />
			<Tooltip
				title={
					<div className="add-new-tab-tooltip-content">
						<div className="add-new-tab-tooltip-header">New view</div>
						<div className="add-new-tab-tooltip-body">
							{Object.values(layouts)
								?.filter((layout) => layout?.label !== 'Table view')
								?.map((layout) => (
									<div
										className="add-new-tab-tooltip-body-item"
										onClick={() => {
											handleAddTab(layout?.viewType);
											handleStateChange({ showAddNewTabDropDown: false });
										}}
										key={layout?.viewType}
									>
										<div className="add-new-tab-tooltip-body-item-icon">
											{layout?.Icon}
										</div>
										<div className="add-new-tab-tooltip-body-item-label">
											{layout?.label}
										</div>
									</div>
								))}
						</div>
					</div>
				}
				open={info?.showAddNewTabDropDown}
				onOpenChange={(open) => handleStateChange({ showAddNewTabDropDown: open })}
				arrow={false}
				trigger={'click'}
				color={'transparent'}
				styles={tooltipStyles}
				style={{ padding: 0 }}
				placement="bottomLeft"
			>
				<button
					className="add-new-tab-button"
					onClick={() =>
						handleStateChange({ showAddNewTabDropDown: !info?.showAddNewTabDropDown })
					}
				>
					<PlusIcon />
				</button>
			</Tooltip>
		</div>
	);
};

export default memo(TaskHeader);
