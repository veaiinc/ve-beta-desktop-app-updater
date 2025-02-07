import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../assets/scss/tasks/task.scss';
import ListViewHeader from './listView/ListViewHeader';
import { ReactComponent as ListViewIcon } from '../../../assets/svg/tasks/list.svg';
import { ReactComponent as BoardViewIcon } from '../../../assets/svg/tasks/board.svg';
import { ReactComponent as TableViewIcon } from '../../../assets/svg/tasks/grid.svg';
import { ReactComponent as GalleryViewIcon } from '../../../assets/svg/tasks/blocks.svg';
import ListView from './views/ListView';
// import BoardView from './views/BoardView';
import GalleryView from './views/GalleryView';
import TableView from './views/TableView';
import TabDropDown from '../dropDown/tasks/TabDropDown';
import QuickActions from '../globalComponents/QuickActions';

const layouts = {
	list: {
		Icon: ListViewIcon,
		label: 'List view',
	},
	board: {
		Icon: BoardViewIcon,
		label: 'Board view',
	},
	table: {
		Icon: TableViewIcon,
		label: 'Table view',
	},
	gallery: {
		Icon: GalleryViewIcon,
		label: 'Gallery view',
	},
};
const layoutOptions = [
	{
		value: 'list',
		label: 'List',
		Icon: ListViewIcon,
	},
	// {
	// 	value: 'board',
	// 	label: 'Board',
	// },
	{
		value: 'table',
		label: 'Table',
		Icon: TableViewIcon,
	},
	{
		value: 'gallery',
		label: 'Gallery',
		Icon: GalleryViewIcon,
	},
];

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
	views,
	updateView = () => {},
	deleteView = () => {},
	prefix = null,
}) => {
	const [taskInfo, setTaskInfo] = useState({
		tabs: null,
		activeTab: null,
		timeout: null,
	});
	const [showEditViewDropDown, setShowEditViewDropDown] = useState(false);

	const handleEditViewDropDown = useCallback(() => {
		setShowEditViewDropDown(true);
	}, []);

	useEffect(() => {
		if (views) {
			setTaskInfo((prevInfo) => {
				// Only update sort and filters if there was no previous activeTab
				const isInitialLoad = !prevInfo?.activeTab;

				if (isInitialLoad) {
					updateTaskInfo({
						sort: [...views[0]?.sort].map((item) => ({
							sortBy: item?.sortBy,
							sortType: item?.sortType,
						})),
						filters: [...views[0]?.filters].map((item) => ({
							key: item?.key,
							value: item?.value,
						})),
					});
				}

				return {
					...prevInfo,
					tabs: Object.fromEntries(
						views?.map((view, index) => [
							view?._id,
							{
								...view,
								order: index,
								Icon: layouts?.[view?.viewType]?.Icon || ListViewIcon,
							},
						]),
					),
					activeTab: views?.some((view) => view?._id === prevInfo?.activeTab)
						? prevInfo?.activeTab
						: views?.[0]?._id,
				};
			});
		}
	}, [views]);

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
		(newTabs, movedItem, destinationIndex) => {
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
			updateView(movedItem?._id, {
				order: destinationIndex,
			});
		},
		[taskInfo?.tabs, updateView],
	);

	const handleAddTab = useCallback(
		(option) => {
			updateView(null, {
				viewType: option,
				label: layouts?.[option]?.label,
				filters: [],
				sort: [],
				order: views?.length || 0,
			});
		},
		[views?.length, updateView],
	);

	const getDefaultLabel = (view) => {
		const labels = {
			list: 'List',
			board: 'Board',
			table: 'Table',
		};
		return labels[view] || 'List';
	};

	const handleDebounceViewUpdate = useCallback(
		(viewId, updateData) => {
			clearInterval(taskInfo?.timeout);
			const timeout = setTimeout(() => {
				updateView(viewId, {
					...updateData,
				});
				setTaskInfo((prev) => ({
					...prev,
					timeout: null,
				}));
			}, 800);
			setTaskInfo((prev) => ({ ...prev, timeout }));
		},
		[taskInfo?.timeout, updateView],
	);

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
				Icon: layouts?.[updateData?.view]?.Icon || newTabs[viewId]?.Icon,
			};

			setTaskInfo((prev) => ({ ...prev, tabs: newTabs }));
			if (updateData?.sort) {
				updateTaskInfo({ sort: updateData?.sort });
				updateData.sort = updateData?.sort?.map((item) => ({
					sortBy: item?.sortBy,
					sortType: item?.sortType,
				}));
			}
			if (updateData?.filters) {
				updateTaskInfo({ filters: updateData?.filters });
				updateData.filters = updateData?.filters?.map((item) => ({
					key: item?.key,
					value: item?.value,
				}));
			}
			const { page, ...rest } = updateData;
			handleDebounceViewUpdate(viewId, rest);
		},
		[taskInfo.tabs, updateTaskInfo, handleDebounceViewUpdate],
	);

	// const handleDebounceViewUpdate = useCallback(
	// 	(viewId, updateData) => {
	// 		clearInterval(taskInfo?.timeout);
	// 		const timeout = setTimeout(() => {
	// 			updateViewInfo(viewId, {
	// 				filters: updateData?.filters,
	// 			});
	// 		}, 800);
	// 	},
	// 	[taskInfo?.timeout, updateViewInfo],
	// );
	const viewMapper = useCallback(
		(view) => {
			const views = {
				list: ListView,
				// board: BoardView,
				table: TableView,
				gallery: GalleryView,
			};
			const Component = views?.[view] || ListView;
			return (
				<Component
					handleUpdate={handleUpdate}
					responseMetadata={responseMetadata}
					addButtonOnClick={handleAddButtonOnClick}
					colors={colors}
					fetchMoreData={fetchMoreData}
					data={data}
					loading={loading}
					properties={properties}
					rowTypes={rowTypes}
					handleRowClick={handleRowClick}
					hasMore={hasMore}
					error={error}
					handleAddButtonOnClick={handleAddButtonOnClick}
				/>
			);
		},
		[
			handleUpdate,
			responseMetadata,
			handleAddButtonOnClick,
			colors,
			fetchMoreData,
			data,
			loading,
			properties,
			rowTypes,
			handleRowClick,
			hasMore,
			error,
		],
	);

	const handleDeleteTab = useCallback(
		(tabId) => {
			if (Object.keys(taskInfo?.tabs || {})?.length <= 1) {
				return;
			}
			deleteView(tabId);
			updateTaskInfo({ activeTab: null });
		},
		[taskInfo?.tabs, deleteView, updateTaskInfo],
	);

	const handleDuplicateTab = useCallback(
		(tabId) => {
			const selectedTab = taskInfo?.tabs?.[tabId];

			updateView(null, {
				viewType: selectedTab?.viewType,
				label: `${selectedTab?.label} (Copy)`,
				order: views?.length || 0,
			});
		},
		[taskInfo?.tabs, updateView, views?.length],
	);

	const handleTabDropdownClick = useCallback(
		(option) => {
			if (option?.value === 'deleteView') {
				handleDeleteTab(taskInfo?.activeTab);
			}
			if (option?.value === 'duplicateView') {
				handleDuplicateTab(taskInfo?.activeTab);
			}
			if (option?.value === 'editView' || option?.value === 'renameView') {
				handleEditViewDropDown();
			}
		},
		[handleDeleteTab, handleDuplicateTab, handleEditViewDropDown, taskInfo?.activeTab],
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
				// view={taskInfo?.tabs?.[taskInfo?.activeTab]?.view}
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
				layoutOptions={layoutOptions}
				handleLayoutOptionClick={handleAddTab}
			/>
			<div className="task-content-area">
				{viewMapper(taskInfo?.tabs?.[taskInfo?.activeTab]?.viewType)}
			</div>
		</div>
	);
};

export default memo(Task);
