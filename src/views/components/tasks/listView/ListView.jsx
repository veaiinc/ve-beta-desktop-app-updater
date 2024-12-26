/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback } from 'react';
import '../../../../assets/scss/tasks/listView.scss';
import Text from './Text';
import Select from './Select';
import Person from './Person';
import MultiSelect from './MultiSelect';
import DateView from './DateView';
import Status from './Status';
import Priority from './Priority';
import Email from './Email';
import Url from './Url';
import Phone from './Phone';
import CheckBox from './CheckBox';
import CreateTaskPopup from '../../modalsV2/tasks/CreateTaskPopup';
import ListViewSidebar from '../../modalsV2/tasks/ListViewSidebar';
import WorkFlow from './WorkFlow';
import ListViewHeader from './ListViewHeader';
import ListViewRow from './ListViewRow';
import TaskId from './TaskId';
import Skeleton from 'react-loading-skeleton';

const rowTypes = {
	text: Text,
	select: Select,
	person: Person,
	'multi-select': MultiSelect,
	date: DateView,
	id: TaskId,
	status: Status,
	priority: Priority,
	email: Email,
	phone: Phone,
	url: Url,
	checkbox: CheckBox,
	workflow: WorkFlow,
};

const ListView = ({
	info,
	updateListViewInfo,
	resetSubTasks,
	togglePropertyVisibility,
	updatePropertyValue,
	deleteTask,
	addNewTask,
	responseMetadata,
	fetchListItems,
}) => {
	const handleRowClick = useCallback(
		(rowId) => {
			if (info?.selectedRow?._id !== rowId) {
				resetSubTasks();
			}
			const row = info?.listItems?.find((row) => row._id === rowId);
			if (row) {
				updateListViewInfo('selectedRow', row);
				updateListViewInfo('sidebarIsOpen', true);
			}
		},
		[info?.listItems, resetSubTasks, info?.selectedRow?._id],
	);

	const handleCreateSubTaskClick = useCallback(() => {
		updateListViewInfo('sidebarIsOpen', false);
		updateListViewInfo('isCreatingSubtask', true);
		updateListViewInfo('isCreateModalOpen', true);
	}, []);

	const handleCloseCreateModal = useCallback(() => {
		if (info?.isCreatingSubtask) {
			updateListViewInfo('sidebarIsOpen', true);
		}
		updateListViewInfo('isCreateModalOpen', false);
	}, [info?.isCreatingSubtask]);

	const handleSubTaskClick = useCallback((task) => {
		updateListViewInfo('selectedSubTask', task);
	}, []);

	const handleCloseSidebar = useCallback(() => {
		if (info?.updated && info?.filters?.length !== 0) {
			updateListViewInfo('loadingSkeleton', true);
			fetchListItems();
			updateListViewInfo('updated', false);
		}
		updateListViewInfo('sidebarIsOpen', false);
		updateListViewInfo('selectedSubTask', null);
	}, [info?.updated]);

	const handleChildTaskClose = useCallback(() => {
		updateListViewInfo('selectedSubTask', null);
	}, []);
	const generateSkeleton = useCallback(() => {
		return [...Array(6)].map((_, index) => (
			<div className="listItemSkeleton" key={index}>
				<Skeleton width="100%" height="38px" borderRadius="12px" />
			</div>
		));
	}, []);

	return (
		<div className="listViewParentContainer">
			<ListViewHeader
				updateListViewInfo={updateListViewInfo}
				properties={info?.properties}
				togglePropertyVisibility={togglePropertyVisibility}
				sort={info?.sort}
				filters={info?.filters}
				workflows={info?.workflows}
				tenantUsers={info?.tenantUsers}
				searchValue={info?.searchValue}
				responseMetadata={responseMetadata}
			/>
			<div className="listContainer">
				<div className="listInnerContainer">
					{info?.loadingSkeleton ? (
						generateSkeleton()
					) : info?.error ? (
						<span style={{ color: '#ff9b9b', margin: '10px auto' }}>{info?.error}</span>
					) : info?.listItems?.length !== 0 ? (
						info?.listItems?.map((task, index) => (
							<ListViewRow
								task={task}
								key={index}
								properties={info?.properties}
								rowTypes={rowTypes}
								updatePropertyValue={updatePropertyValue}
								workflows={info?.workflows}
								tenantUsers={info?.tenantUsers}
								handleRowClick={handleRowClick}
								clients={info?.clients}
								responseMetadata={responseMetadata}
							/>
						))
					) : (
						<span style={{ color: '#808080', margin: '10px auto' }}>
							No tasks found
						</span>
					)}
				</div>
			</div>
			{info?.hasMore && (
				<div className="loadMoreContainer">
					<button onClick={() => updateListViewInfo('page', info?.page + 1)}>
						Load More
					</button>
				</div>
			)}
			<CreateTaskPopup
				isOpen={info?.isCreateModalOpen}
				closeModal={handleCloseCreateModal}
				addNewTask={addNewTask}
				workflows={info?.workflows}
				tenantUsers={info?.tenantUsers}
				clients={info?.clients}
				isSubTask={info?.isCreatingSubtask}
				responseMetadata={responseMetadata}
			/>
			<ListViewSidebar
				selectedRow={info?.selectedSubTask || info?.selectedRow}
				isShowingSubTask={info?.selectedSubTask !== null}
				parentTaskNo={info?.selectedRow?.taskSlNo}
				handleChildTaskClose={handleChildTaskClose}
				handleSubTaskClick={handleSubTaskClick}
				sidebarIsOpen={info?.sidebarIsOpen}
				closeSidebar={handleCloseSidebar}
				updatePropertyValue={updatePropertyValue}
				deleteTask={deleteTask}
				rowTypes={rowTypes}
				handleCreateSubTaskClick={handleCreateSubTaskClick}
				responseMetadata={responseMetadata}
			/>
		</div>
	);
};

export default memo(ListView);
