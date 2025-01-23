import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/tasks/task.scss';
import ListViewHeader from './listView/ListViewHeader';
import { ReactComponent as ListViewIcon } from '../../../assets/svg/tasks/list.svg';
import { ReactComponent as BoardViewIcon } from '../../../assets/svg/tasks/board.svg';
import { ReactComponent as TableViewIcon } from '../../../assets/svg/tasks/grid.svg';
import TabHeader from './listView/TabHeader';
import ListView from './listView/ListView';

const icons = {
	list: ListViewIcon,
	board: BoardViewIcon,
	table: TableViewIcon,
};

const Task = ({
	info,
	updateListViewInfo,
	responseMetadata,
	handleAddButtonOnClick,
	colors,
	updateTaskInfo,
}) => {
	const [taskInfo, setTaskInfo] = useState({
		tabs: {
			1: {
				_id: '1',
				view: 'list',
				label: 'List',
				Icon: icons.list,
				filters: [],
				sort: [],
			},
			2: {
				_id: '2',
				view: 'board',
				label: 'Board',
				Icon: icons.board,
				filters: [],
				sort: [],
			},
			3: {
				_id: '3',
				view: 'table',
				label: 'Table',
				Icon: icons.table,
				filters: [],
				sort: [],
			},
		},
		activeTab: '1',
	});

	const handleTabChange = useCallback(
		(tabData) => {
			setTaskInfo((prev) => ({ ...prev, activeTab: tabData?._id }));
			updateTaskInfo({
				loadingSkeleton: true,
				sort: taskInfo?.tabs?.[tabData?._id]?.sort,
				filters: taskInfo?.tabs?.[tabData?._id]?.filters,
			});
		},
		[taskInfo.tabs, updateTaskInfo],
	);

	const handleAddTab = useCallback(() => {
		setTaskInfo((prev) => ({
			...prev,
			tabs: {
				...prev.tabs,
				[Object.keys(prev.tabs).length + 1 + '']: {
					_id: Object.keys(prev.tabs).length + 1 + '',
					view: 'list',
					label: 'List',
					Icon: icons.list,
					filters: [],
					sort: [],
				},
			},
		}));
	}, []);

	const updateViewInfo = useCallback(
		(viewId, updateData) => {
			const newTabs = { ...taskInfo.tabs };
			newTabs[viewId] = {
				...newTabs[viewId],
				...updateData,
				Icon: icons?.[updateData?.view] || newTabs[viewId]?.Icon,
			};
			setTaskInfo((prev) => ({ ...prev, tabs: newTabs }));
			if (updateData?.sort) {
				updateTaskInfo({ sort: updateData?.sort });
			}
			if (updateData?.filters) {
				updateTaskInfo({ filters: updateData?.filters });
			}
		},
		[taskInfo.tabs, updateTaskInfo],
	);

	return (
		<div className="task-container">
			<ListViewHeader
				updateListViewInfo={updateListViewInfo}
				properties={info?.properties}
				taskPreferences={info?.taskPreferences}
				searchValue={info?.searchValue}
				responseMetadata={responseMetadata}
				headerTitle={'Tasks'}
				addButtonOnClick={handleAddButtonOnClick}
				editingProperty={null}
				handleEditPropertyChange={() => {}}
				colors={colors}
				createButtonText={'Add Task'}
				view={taskInfo?.tabs?.[taskInfo?.activeTab]?.view}
				handleTabChange={handleTabChange}
				tabs={taskInfo?.tabs}
				activeTab={taskInfo?.activeTab}
				handleAddTab={handleAddTab}
				updateViewInfo={updateViewInfo}
			/>
			<div className="task-content-area">
				<ListView
					info={info}
					updateListViewInfo={updateListViewInfo}
					resetSubTasks={() => {}}
					updatePropertyValue={() => {}}
					deleteTask={() => {}}
					addNewTask={() => {}}
					responseMetadata={responseMetadata}
					fetchListItems={() => {}}
					addButtonOnClick={handleAddButtonOnClick}
					haveSubTask={true}
					colors={colors}
					fetchMoreData={() => {}}
					view={taskInfo?.tabs[taskInfo?.activeTab]?.view}
				/>
			</div>
		</div>
	);
};

export default memo(Task);
