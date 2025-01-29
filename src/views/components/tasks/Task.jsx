import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/tasks/task.scss';
import ListViewHeader from './listView/ListViewHeader';
import { ReactComponent as ListViewIcon } from '../../../assets/svg/tasks/list.svg';
import { ReactComponent as BoardViewIcon } from '../../../assets/svg/tasks/board.svg';
import { ReactComponent as TableViewIcon } from '../../../assets/svg/tasks/grid.svg';
import ListView from './views/ListView';
// import BoardView from './views/BoardView';
import TableView from './views/TableView';
import TabDropDown from '../dropDown/tasks/TabDropDown';

const icons = {
	list: ListViewIcon,
	board: BoardViewIcon,
	table: TableViewIcon,
};

const Task = ({
	blockTitle,
	createButtonText,
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
	fetchMoreData,
	hasMore,
	error,
	prefix = null,
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
				order: 0,
			},
		},
		activeTab: '1',
	});
	const [showEditViewDropDown, setShowEditViewDropDown] = useState(false);

	const handleEditViewDropDown = useCallback(() => {
		setShowEditViewDropDown(true);
	}, []);

	const closeEditViewDropDown = useCallback(() => {
		setShowEditViewDropDown(false);
	}, []);

	const handleTabChange = useCallback(
		(tabData) => {
			if (taskInfo?.activeTab === tabData?._id) {
				return;
			}
			setTaskInfo((prevTaskInfo) => ({
				...prevTaskInfo,
				activeTab: tabData?._id,
			}));
			updateTaskInfo({
				loadingSkeleton: true,
				sort: [...taskInfo?.tabs?.[tabData?._id]?.sort],
				filters: [...taskInfo?.tabs?.[tabData?._id]?.filters],
			});
		},
		[taskInfo.tabs, updateTaskInfo, taskInfo?.activeTab],
	);

	const handleTabsReorder = useCallback(
		(newTabs) => {
			const reorderedTabs = {};
			newTabs.forEach((tab, index) => {
				reorderedTabs[tab?._id] = {
					...taskInfo.tabs[tab?._id],
					order: index,
				};
			});

			setTaskInfo((prev) => ({
				...prev,
				tabs: reorderedTabs,
			}));
		},
		[taskInfo.tabs],
	);

	const generateNewId = useCallback(() => {
		return new Date().getTime().toString();
	}, []);

	const handleAddTab = useCallback(() => {
		setTaskInfo((prev) => {
			const newTabId = generateNewId();
			const maxOrder = Math.max(...Object.values(prev.tabs)?.map((tab) => tab.order), -1);

			return {
				...prev,
				tabs: {
					...prev.tabs,
					[newTabId]: {
						_id: newTabId,
						view: 'list',
						label: 'List',
						Icon: icons.list,
						filters: [],
						sort: [],
						order: maxOrder + 1,
					},
				},
			};
		});
	}, [generateNewId]);

	const getDefaultLabel = (view) => {
		const labels = {
			list: 'List',
			board: 'Board',
			table: 'Table',
		};
		return labels[view] || 'List';
	};

	const updateViewInfo = useCallback(
		(viewId, updateData) => {
			const newTabs = { ...taskInfo.tabs };

			// If label is empty, use default label based on view
			if (updateData.label === '') {
				updateData.label = getDefaultLabel(updateData.view || newTabs[viewId].view);
			}

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
				// board: BoardView,
				table: TableView,
			};
			const Component = views?.[view] || ListView;
			return (
				<Component
					handleUpdate={handleUpdate}
					responseMetadata={responseMetadata}
					addButtonOnClick={handleAddButtonOnClick}
					colors={colors}
					fetchMoreData={fetchMoreData}
					view={taskInfo?.tabs[taskInfo?.activeTab]?.view}
					data={data}
					loading={loading}
					properties={properties}
					rowTypes={rowTypes}
					handleRowClick={handleRowClick}
					updateTaskInfo={updateTaskInfo}
					hasMore={hasMore}
					error={error}
				/>
			);
		},
		[
			handleUpdate,
			responseMetadata,
			handleAddButtonOnClick,
			colors,
			fetchMoreData,
			taskInfo?.tabs,
			taskInfo?.activeTab,
			data,
			loading,
			properties,
			rowTypes,
			handleRowClick,
			updateTaskInfo,
			hasMore,
			error,
		],
	);

	const handleDeleteTab = useCallback((tabId) => {
		setTaskInfo((prev) => {
			// Prevent deletion if there's only one tab
			if (Object.keys(prev.tabs)?.length <= 1) {
				return prev;
			}

			const newTabs = { ...prev.tabs };
			delete newTabs[tabId];

			// If deleting active tab, switch to first available tab
			let newActiveTab = prev.activeTab;
			if (tabId === prev.activeTab) {
				const remainingTabs = Object.keys(newTabs);
				newActiveTab = remainingTabs[0] || null;
			}

			return {
				...prev,
				tabs: newTabs,
				activeTab: newActiveTab,
			};
		});
	}, []);

	const handleDuplicateTab = useCallback(
		(tabId) => {
			setTaskInfo((prev) => {
				const tabToDuplicate = prev?.tabs?.[tabId];
				const newTabId = new Date().getTime().toString();
				const maxOrder = Math.max(
					...Object.values(prev?.tabs)?.map((tab) => tab?.order),
					-1,
				);

				// Check if the tab exists and can be duplicated
				if (!tabToDuplicate) {
					return prev;
				}

				const newTabs = {
					...prev?.tabs,
					[newTabId]: {
						...tabToDuplicate,
						_id: newTabId,
						label: `${tabToDuplicate?.label} (Copy)`,
						order: maxOrder + 1,
					},
				};

				return {
					...prev,
					tabs: newTabs,
				};
			});
		},
		[generateNewId],
	);

	const handleTabDropdownClick = useCallback(
		(option) => {
			if (option?.value === 'deleteView') {
				// Check if deletion is allowed
				if (Object.keys(taskInfo?.tabs)?.length <= 1) {
					return;
				}
				handleDeleteTab(taskInfo?.activeTab);
			}
			if (option?.value === 'duplicateView') {
				handleDuplicateTab(taskInfo?.activeTab);
			}
			if (option?.value === 'editView' || option?.value === 'renameView') {
				handleEditViewDropDown();
			}
		},
		[
			handleDeleteTab,
			handleDuplicateTab,
			handleEditViewDropDown,
			taskInfo?.activeTab,
			taskInfo?.tabs,
		],
	);

	return (
		<div className="task-container">
			<ListViewHeader
				updateTaskInfo={updateTaskInfo}
				properties={properties}
				taskPreferences={taskPreferences}
				prefix={prefix}
				searchValue={searchValue}
				responseMetadata={responseMetadata}
				blockTitle={blockTitle}
				createButtonText={createButtonText}
				addButtonOnClick={handleAddButtonOnClick}
				editingProperty={null}
				handleEditPropertyChange={() => {}}
				colors={colors}
				view={taskInfo?.tabs?.[taskInfo?.activeTab]?.view}
				handleTabChange={handleTabChange}
				tabs={taskInfo?.tabs}
				handleAddTab={handleAddTab}
				updateViewInfo={updateViewInfo}
				viewData={taskInfo?.tabs?.[taskInfo?.activeTab]}
				handleTabsReorder={handleTabsReorder}
				showEditViewDropDown={showEditViewDropDown}
				closeEditViewDropDown={closeEditViewDropDown}
				handleDuplicateView={handleDuplicateTab}
				handleDeleteView={handleDeleteTab}
				handleTabDropdownClick={handleTabDropdownClick}
			/>
			<div className="task-content-area">
				{viewMapper(taskInfo?.tabs?.[taskInfo?.activeTab]?.view)}
			</div>
		</div>
	);
};

export default memo(Task);
