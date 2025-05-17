import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../../../assets/scss/tasks/task.scss';
import ListViewHeader from './listView/ListViewHeader';
import { ReactComponent as ListViewIcon } from '../../../assets/svg/tasks/list.svg';
import { ReactComponent as BoardViewIcon } from '../../../assets/svg/tasks/board.svg';
import { ReactComponent as TableViewIcon } from '../../../assets/svg/tasks/grid.svg';
import { ReactComponent as GalleryViewIcon } from '../../../assets/svg/tasks/blocks.svg';
import ListView from './views/ListView';
import BoardView from './views/Board';
import GalleryView from './views/GalleryView';
import TableView from './views/TableView';
import QuickActions from '../globalComponents/QuickActions';
import ChatLeftBarComponent from '../ChatLeftBarComponent';
import Taskwidget from './Taskwidget';
import TaskHeader from './listView/TaskHeader';

const layouts = {
	list: {
		Icon: ListViewIcon,
		label: 'List',
	},
	board: {
		Icon: BoardViewIcon,
		label: 'Board',
	},
	table: {
		Icon: TableViewIcon,
		label: 'Table',
	},
	gallery: {
		Icon: GalleryViewIcon,
		label: 'Widget',
	},
};

const Task = ({
	responseMetadata,
	handleAddButtonOnClick,
	colors,
	updateTaskInfo,
	searchLoader,
	data,
	loading,
	rowTypes,
	handleUpdate,
	properties,
	taskPreferences,
	searchValue,
	fetchMoreData,
	hasMore,
	error,
	views,
	activeTab,
	updateActiveTab,
	updateView = () => {},
	deleteView = () => {},
	availableViews = ['list', 'board', 'table', 'gallery'],
}) => {
	const timeoutRef = useRef(null);

	const [taskInfo, setTaskInfo] = useState({
		tabs: null,
		activeTab: null,
		timeout: null,
		showEditViewDropDown: false,
	});
	const [showEditViewDropDown, setShowEditViewDropDown] = useState(false);

	const handleEditViewDropDown = useCallback((value) => {
		setShowEditViewDropDown(value);
	}, []);

	useEffect(() => {
		if (views) {
			setTaskInfo((prevInfo) => {
				const prevTabs = Object.keys(prevInfo?.tabs || {});
				const isInitialLoad = !prevInfo?.activeTab;
				const newTabs = Object.fromEntries(
					views?.map((view, index) => [
						view?._id,
						{
							...view,
							order: index,
							Icon: layouts?.[view?.viewType]?.Icon || ListViewIcon,
						},
					]),
				);

				const resolvedActiveTab =
					prevTabs.length !== 0 && views.length !== prevTabs.length
						? views[views.length - 1]?._id
						: views.some((view) => view?._id === prevInfo?.activeTab)
						? prevInfo?.activeTab
						: activeTab
						? activeTab
						: views?.[0]?._id;

				// if (isInitialLoad) {
				const activeView = views.find((v) => v._id === resolvedActiveTab);
				if (activeView) {
					updateTaskInfo({
						sort: (activeView?.sort || []).map((item) => ({
							sortBy: item?.sortBy,
							sortType: item?.sortType,
						})),
						filters: (activeView?.filters || []).map((item) => ({
							key: item?.key,
							value: item?.value,
						})),
						group:
							activeView?.viewType === 'board' ? activeView?.group || 'status' : null,
					});
				}
				// }

				return {
					...prevInfo,
					tabs: newTabs,
					activeTab: resolvedActiveTab,
				};
			});
		}
	}, [views]);

	const layoutOptions = useMemo(() => {
		return [
			{
				value: 'list',
				label: 'List',
				Icon: ListViewIcon,
			},
			{
				value: 'board',
				label: 'Board',
				Icon: BoardViewIcon,
			},
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
		].filter((item) => availableViews.includes(item?.value));
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
				group:
					taskInfo?.tabs?.[tabData?._id]?.viewType === 'board'
						? taskInfo?.tabs?.[tabData?._id]?.group || 'status'
						: null,
			});
			updateActiveTab({
				input: {
					selectedTaskView: tabData?._id,
				},
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
				group: option === 'board' ? 'status' : null,
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
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => {
				updateView(viewId, {
					...updateData,
				});
			}, 800);
		},
		[timeoutRef, updateView],
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
				updateData.sort = updateData?.sort?.map((item) => ({
					sortBy: item?.sortBy,
					sortType: item?.sortType,
				}));
				updateTaskInfo({ sort: updateData?.sort });
			}
			if (updateData?.filters) {
				updateData.filters = updateData?.filters?.map((item) => ({
					key: item?.key,
					value: item?.value,
				}));
				updateTaskInfo({ filters: updateData?.filters });
			}
			if (updateData?.viewType === 'board') {
				updateData.group = 'status';
			}

			if (updateData?.group) {
				updateTaskInfo({ group: updateData?.group });
			}
			const { page, ...rest } = updateData;
			handleDebounceViewUpdate(viewId, rest);
		},
		[taskInfo.tabs, updateTaskInfo, handleDebounceViewUpdate],
	);

	const viewMapper = useCallback(
		(view) => {
			const views = {
				list: ListView,
				board: BoardView,
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
			updateTaskInfo({
				activeTab: taskInfo?.activeTab === tabId ? null : taskInfo?.activeTab,
			});
		},
		[taskInfo?.tabs, deleteView, updateTaskInfo, taskInfo?.activeTab],
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
			if (option?.value === 'delete') {
				handleDeleteTab(option?.tabId);
			}
			if (option?.value === 'duplicate') {
				handleDuplicateTab(option?.tabId);
			}
			if (option?.value === 'edit' || option?.value === 'rename') {
				handleEditViewDropDown(true);
			}
		},
		[handleDeleteTab, handleDuplicateTab, handleEditViewDropDown, taskInfo?.activeTab],
	);

	return (
		<>
			<ChatLeftBarComponent>
				<div className="tasks-left-container">
					<Taskwidget
						properties={properties}
						responseMetadata={responseMetadata}
						colors={colors}
						viewData={taskInfo?.tabs?.[taskInfo?.activeTab]}
						updateViewInfo={updateViewInfo}
						updateTaskInfo={updateTaskInfo}
						searchValue={searchValue}
						showEditViewDropDown={showEditViewDropDown}
						handleEditViewDropDown={handleEditViewDropDown}
						taskPreferences={taskPreferences}
						searchLoader={searchLoader}
					/>
				</div>
			</ChatLeftBarComponent>
			<div className="tasks-right-container">
				<div className="task-container">
					<div className="task-header-container">
						<TaskHeader
							tabs={taskInfo?.tabs}
							activeTab={taskInfo?.activeTab}
							handleTabChange={handleTabChange}
							handleAddTab={handleAddTab}
							handleTabDropdownClick={handleTabDropdownClick}
							handleTabsReorder={handleTabsReorder}
						/>
						{/* <ListViewHeader
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
						/> */}
						<div className="quick-actions-btn">
							<QuickActions />
						</div>
					</div>

					<div className="task-content-area">
						{taskInfo?.tabs?.[taskInfo?.activeTab]?.viewType === 'board' ? (
							<BoardView
								handleUpdate={handleUpdate}
								responseMetadata={responseMetadata}
								handleAddButtonOnClick={handleAddButtonOnClick}
								colors={colors}
								fetchMoreData={fetchMoreData}
								properties={properties}
								rowTypes={rowTypes}
								groupBy={taskInfo?.tabs?.[taskInfo?.activeTab]?.group}
								sort={taskInfo?.tabs?.[taskInfo?.activeTab]?.sort}
								filters={taskInfo?.tabs?.[taskInfo?.activeTab]?.filters}
							/>
						) : (
							viewMapper(taskInfo?.tabs?.[taskInfo?.activeTab]?.viewType)
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default memo(Task);
