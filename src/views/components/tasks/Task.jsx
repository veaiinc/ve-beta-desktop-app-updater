import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/tasks/task.scss';
import ListViewHeader from './listView/ListViewHeader';
import { ReactComponent as ListViewIcon } from '../../../assets/svg/tasks/list.svg';
import { ReactComponent as BoardViewIcon } from '../../../assets/svg/tasks/board.svg';
import { ReactComponent as TableViewIcon } from '../../../assets/svg/tasks/grid.svg';
import ListView from './views/ListView';
import boardView from './views/BoardView';
import TableView from './views/TableView';

const icons = {
	list: ListViewIcon,
	board: BoardViewIcon,
	table: TableViewIcon,
};

const Task = ({
	// info,
	responseMetadata,
	handleAddButtonOnClick,
	colors,
	updateTaskInfo,
	data,
	loading,
	rowTypes,
	handleRowClick,
	handleUpdate,
	properties,
	taskPreferences,
	searchValue,
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
				page: 1,
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
					page: 1,
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

	const viewMapper = useCallback(
		(view) => {
			const views = {
				list: ListView,
				board: boardView,
				table: TableView,
			};
			const Component = views?.[view] || ListView;
			return (
				<Component
					resetSubTasks={() => {}}
					handleUpdate={handleUpdate}
					deleteTask={() => {}}
					addNewTask={() => {}}
					responseMetadata={responseMetadata}
					fetchListItems={() => {}}
					addButtonOnClick={handleAddButtonOnClick}
					haveSubTask={true}
					colors={colors}
					fetchMoreData={() => {}}
					view={taskInfo?.tabs[taskInfo?.activeTab]?.view}
					data={data}
					loading={loading}
					properties={properties}
					rowTypes={rowTypes}
					isSubTask={false}
					handleRowClick={handleRowClick}
					updateTaskInfo={updateTaskInfo}
				/>
			);
		},
		[
			handleUpdate,
			responseMetadata,
			handleAddButtonOnClick,
			colors,
			taskInfo?.tabs,
			taskInfo?.activeTab,
			data,
			loading,
			properties,
			rowTypes,
			handleRowClick,
			updateTaskInfo,
		],
	);

	return (
		<div className="task-container">
			<ListViewHeader
				updateTaskInfo={updateTaskInfo}
				properties={properties}
				taskPreferences={taskPreferences}
				searchValue={searchValue}
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
				handleAddTab={handleAddTab}
				updateViewInfo={updateViewInfo}
				viewData={taskInfo?.tabs?.[taskInfo?.activeTab]}
			/>
			<div className="task-content-area">
				{viewMapper(taskInfo?.tabs?.[taskInfo?.activeTab]?.view)}
			</div>
		</div>
	);
};

export default memo(Task);
