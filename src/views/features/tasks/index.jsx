/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ReactComponent as ClockSvg } from '../../../assets/svg/activity/clock.svg';
import { ReactComponent as PieSvg } from '../../../assets/svg/tasks/pieHollow.svg';
import { ReactComponent as PrioritySvg } from '../../../assets/svg/tasks/roundChevronRight.svg';
import { ReactComponent as WorkflowSvg } from '../../../assets/svg/tasks/workflow.svg';
import { ReactComponent as PersonSvg } from '../../../assets/svg/tasks/person.svg';
import { ReactComponent as CalendarSvg } from '../../../assets/svg/tasks/calendar.svg';
import { ReactComponent as textSvg } from '../../../assets/svg/tasks/letterA.svg';
import Context from '../../../context/context';
import { message } from 'antd';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import CreateTaskPopup from '../../components/modalsV2/tasks/CreateTaskPopup';
import Task from '../../components/tasks/Task';
import ListViewSidebar from '../../components/modalsV2/tasks/ListViewSidebar';

import Text from '../../components/tasks/listView/Text';
import Select from '../../components/tasks/listView/Select';
import Person from '../../components/tasks/listView/Person';
import MultiSelect from '../../components/tasks/listView/MultiSelect';
import DateView from '../../components/tasks/listView/DateView';
import Status from '../../components/tasks/listView/Status';
import Priority from '../../components/tasks/listView/Priority';
import Email from '../../components/tasks/listView/Email';
import Url from '../../components/tasks/listView/Url';
import Phone from '../../components/tasks/listView/Phone';
import CheckBox from '../../components/tasks/listView/CheckBox';
import WorkFlow from '../../components/tasks/listView/WorkFlow';
import TaskId from '../../components/tasks/listView/TaskId';
import ParentTaskComponent from '../../components/tasks/listView/ParentTaskComponent';
import ChildTaskProgress from '../../components/tasks/listView/ChildTaskProgress';
import LinkText from '../../components/tasks/listView/LinkText';
import ChildTaskComponent from '../../components/tasks/listView/ChildTaskComponent';

const defaultPreference = {
	taskSlNo: { show: false, order: 1 },
	title: { show: true, order: 2 },
	parentTask: { show: false, order: 3 },
	childTasks: { show: false, order: 4 },
	description: { show: false, order: 5 },
	status: { show: true, order: 6 },
	priority: { show: true, order: 7 },
	workflow: { show: true, order: 8 },
	assignedTo: { show: true, order: 9 },
	dueDate: { show: true, order: 10 },
	assignedBy: { show: true, order: 11 },
	assignedAt: { show: false, order: 12 },
	completedAt: { show: false, order: 13 },
	createdAt: { show: false, order: 14 },
	updatedAt: { show: false, order: 15 },
};

const colors = {
	1: { backgroundColor: '#62344B', color: '#A35A7E' },
	2: { backgroundColor: '#373737', color: '#707070' },
	3: { backgroundColor: '#5B3D2F', color: '#8F614B' },
	4: { backgroundColor: '#7D4F27', color: '#B37339' },
	5: { backgroundColor: '#375841', color: '#588F69' },
	6: { backgroundColor: '#2F4469', color: '#4F71B3' },
	7: { backgroundColor: '#453061', color: '#6F4C99' },
};

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
	parentTask: ParentTaskComponent,
	childTasks: ChildTaskProgress,
	linkText: LinkText,
};

const Tasks = () => {
	const {
		tasks: {
			listTasks,
			getListItems,
			addListItem,
			updateListItem,
			deleteListItem,
			addSubTask,
			removeSubTask,
			updateSubTask,
			resetSubTasks,
			taskMetadata,
			refetchTasks,
			updateTaskState,
			getTaskMetadata,
			updateTaskViews,
			deleteTaskView,
		},
		templates: { getWorkflowsList, workflowslist },
		companyInfo: {
			getTeamMembers,
			tenantsUserList,
			getTaskPreferences,
			taskPreference,
			updateTaskPreferences,
		},
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);

	const [info, setInfo] = useState({
		listItems: [],
		isOptionsDropDownOpen: false,
		isCreateModalOpen: false,
		isCreatingSubtask: true,
		properties: [],
		taskPreferences: {
			preferenceType: 'taskPreference',
			preferences: defaultPreference,
		},
		sidebarIsOpen: false,
		selectedRow: null,
		selectedSubTask: null,
		taskMetadata: null,
		workflows: [],
		tenantUsers: [],
		page: 1,
		hasMore: false,
		loadingSkeleton: true,
		error: null,
		sort: [],
		filters: [],
		searchValue: '',
		updated: false,
		infinityLoading: false,
		view: 'table',
		breadCrumbs: [],
		timeout: null,
	});

	const responseMetadata = useMemo(
		() => ({
			title: {
				type: 'text',
				name: 'Title',
				Icon: textSvg,
				props: {},
				doSplit: true,
				isTitle: true,
			},
			description: { type: 'text', name: 'Description', Icon: textSvg, props: {} },
			status: {
				type: 'status',
				name: 'Status',
				Icon: PieSvg,
				props: {
					options: {
						todo: info?.taskMetadata?.todoGroupLabels,
						inProgress: info?.taskMetadata?.inProgressGroupLabels,
						completed: info?.taskMetadata?.completedGroupLabels,
					},
				},
			},
			priority: {
				type: 'select',
				name: 'Priority',
				Icon: PrioritySvg,
				props: {
					options: [
						{ label: 'Low', _id: 'low', color: '1' },
						{ label: 'Medium', _id: 'medium', color: '2' },
						{ label: 'High', _id: 'high', color: '3' },
					],
				},
			},
			workflow: {
				type: 'workflow',
				name: 'Project',
				Icon: WorkflowSvg,
				props: { options: info?.workflows },
			},
			parentTask: {
				type: 'parentTask',
				name: 'Parent Task',
				Icon: WorkflowSvg,
				props: { options: info?.parentTasks },
			},
			childTasks: {
				type: 'childTasks',
				name: 'Sub Tasks',
				Icon: WorkflowSvg,
				props: {},
			},
			assignedTo: {
				type: 'person',
				name: 'Assigned To',
				Icon: PersonSvg,
				props: {
					options: info?.tenantUsers || [],
					multiSelect: true,
					parseValue: true,
				},
			},
			dueDate: { type: 'date', name: 'Due Date', Icon: ClockSvg, props: {} },
			assignedBy: {
				type: 'person',
				name: 'Assigned By',
				Icon: PersonSvg,
				props: {
					options: info?.tenantUsers || [],
					disabled: true,
					parseValue: true,
				},
			},
			assignedAt: {
				type: 'date',
				name: 'Assigned At',
				Icon: ClockSvg,
				props: { timestamp: true },
			},
			completedAt: { type: 'date', name: 'Completed At', Icon: CalendarSvg, props: {} },
			createdAt: {
				type: 'date',
				name: 'Created At',
				Icon: CalendarSvg,
				props: { timestamp: true },
			},
			updatedAt: {
				type: 'date',
				name: 'Updated At',
				Icon: CalendarSvg,
				props: { timestamp: true },
			},
			createdBy: {
				type: 'person',
				name: 'Created By',
				Icon: PersonSvg,
				props: { options: info?.tenantUsers, disabled: true, parseValue: true },
			},
			updatedBy: {
				type: 'person',
				name: 'Updated By',
				Icon: PersonSvg,
				props: { options: info?.tenantUsers, disabled: true, parseValue: true },
			},
			taskSlNo: {
				type: 'id',
				name: 'Id',
				Icon: textSvg,
				props: { prefix: info?.taskMetadata?.prefix },
			},
		}),
		[info?.workflows, info?.tenantUsers, info?.taskMetadata],
	);

	useEffect(() => {
		handleDebounceFetch();
	}, [info?.filters, info?.searchValue, info?.sort]);

	useEffect(() => {
		if (!tenantsUserList) {
			getTeamMembers();
		} else {
			const formattedUsers = tenantsUserList?.map(({ firstName, lastName, _id }) => ({
				label: `${firstName} ${lastName}`,
				value: _id,
			}));

			setInfo((prevInfo) => ({
				...prevInfo,
				tenantUsers: formattedUsers,
			}));
		}
	}, [tenantsUserList]);

	useEffect(() => {
		if (taskPreference === null) {
			getTaskPreferences({ preferences: 'taskPreference' });
		} else if (taskPreference?.data === false) {
			updateTaskPreferences({ preferenceType: 'taskPreference', data: defaultPreference });
			setInfo((prevInfo) => ({
				...prevInfo,
				taskPreferences: {
					preferenceType: 'taskPreference',
					preferences: defaultPreference,
				},
			}));
		} else if (taskPreference?.error) {
			setInfo((prevInfo) => ({
				...prevInfo,
				taskPreferences: {
					preferenceType: 'taskPreference',
					preferences: defaultPreference,
				},
			}));
		} else {
			setInfo((prevInfo) => ({
				...prevInfo,
				taskPreferences: {
					preferenceType: 'taskPreference',
					preferences: taskPreference?.data,
				},
			}));
		}
	}, [taskPreference]);

	useEffect(() => {
		if (!workflowslist) {
			getWorkflowsList({
				filters: {
					limit: 20,
					page: 1,
				},
			});
		} else {
			setInfo((prevInfo) => ({
				...prevInfo,
				workflows: workflowslist?.data?.map(({ title, _id, templateId }) => ({
					label: title,
					_id,
					templateId,
				})),
			}));
		}
	}, [workflowslist]);

	useEffect(() => {
		if (listTasks) {
			if (listTasks?.data) {
				setInfo((prevInfo) => ({
					...prevInfo,
					listItems:
						info?.page === 1
							? listTasks?.data
							: [...prevInfo?.listItems, ...listTasks?.data],
					hasMore: listTasks?.hasNextPage && listTasks?.data?.length > 0,
					loadingSkeleton: false,
					infinityLoading: false,
				}));
			}
		}
		if (listTasks?.error) {
			setInfo((prevInfo) => ({
				...prevInfo,
				loadingSkeleton: false,
				infinityLoading: false,
				error: listTasks?.error,
				hasMore: false,
			}));
		}
	}, [listTasks]);

	useEffect(() => {
		if (info?.taskPreferences?.preferences) {
			setInfo((prevInfo) => ({
				...prevInfo,
				properties: mapPropertyType(),
			}));
		}
	}, [info?.taskPreferences?.preferences]);

	useEffect(() => {
		if (info?.selectedRow) {
			updateTaskInfo({
				selectedRow: info?.listItems.find((item) => item._id === info?.selectedRow._id),
			});
		}
	}, [info?.listItems, info?.selectedRow]);

	useEffect(() => {
		if (!taskMetadata) {
			getTaskMetadata();
		} else {
			if (!taskMetadata?.views) {
				updateView(
					null,
					{
						label: 'List view',
						filters: [],
						icon: null,
						order: null,
						sort: [],
						viewType: 'list',
					},
					taskMetadata?._id,
				);
			}
			setInfo((prevInfo) => ({
				...prevInfo,
				taskMetadata: taskMetadata,
			}));
		}
	}, [taskMetadata]);

	useEffect(() => {
		if (refetchTasks) {
			fetchListItems();
			updateTaskState({ refetchTasks: false });
		}
	}, [refetchTasks]);

	const fetchListItems = useCallback(
		(page = 1) => {
			getListItems({
				taskFilterInput: {
					limit: 20,
					page: page,
					sort:
						info?.sort.length > 0 ? info?.sort : [{ sortBy: 'createdAt', sortType: 1 }],
					filters: mapFiltersPayload(info?.filters),
					search: info?.searchValue,
				},
			});
			setInfo((prevInfo) => ({
				...prevInfo,
				page: page,
			}));
		},
		[info?.sort, info?.filters, info?.searchValue],
	);
	const handleDebounceFetch = useCallback(() => {
		clearInterval(info?.timeout);
		const timeout = setTimeout(() => {
			fetchListItems(1);
			setInfo((prev) => ({
				...prev,
				loading: true,
				timeout: null,
			}));
		}, 800);
		setInfo((prev) => ({ ...prev, timeout }));
	}, [info?.timeout, fetchListItems]);

	const fetchMoreData = useCallback(() => {
		if (info.hasMore) {
			const nextPage = info.page + 1;
			fetchListItems(nextPage);
			setInfo((prevInfo) => ({
				...prevInfo,
				infinityLoading: true,
			}));
		}
	}, [info.infinityLoading, info.hasMore, info.page, fetchListItems]);

	const mapFiltersPayload = useCallback((filters) => {
		return filters.map((filter) => ({
			key: filter.key,
			value:
				typeof filter.value === 'object'
					? filter?.value?._id || filter?.value?.value
					: filter?.value,
		}));
	}, []);

	const updateTaskInfo = useCallback((updateData) => {
		setInfo((previnfo) => ({ ...previnfo, ...updateData }));
	}, []);

	const mapPropertyType = useCallback(() => {
		let properties = [];
		for (let key in responseMetadata) {
			if (
				key === '__typename' ||
				key === '_id' ||
				key === 'workflowTemplateId' ||
				key === 'completedAt'
			) {
				continue;
			}

			const {
				type = null,
				name = null,
				Icon = null,
				isTitle = false,
			} = responseMetadata[key] || {};
			const { show, order } = info?.taskPreferences?.preferences?.[key] || {
				show: false,
				order: 0,
			};

			properties.push({
				value: key,
				type,
				label: name,
				Icon,
				show,
				order,
				isTitle,
			});
		}
		return properties;
	}, [info?.taskPreferences?.preferences]);

	const debouncedUpdateTask = useCallback(
		async (rowId, propName, value, originalValue, isUpdatingSubTask, onSuccess) => {
			try {
				const response = await updateListItem({
					taskId: rowId,
					updateInput:
						propName === 'workflow'
							? {
									workflowId: value,
									workflowTemplateId: info?.workflows?.find(
										(workflow) => workflow?._id === value,
									)?.templateId,
							  }
							: {
									[propName]:
										propName === 'assignedTo' ? { tenantUsers: value } : value,
							  },
				});

				if (response?.[0] === false) {
					throw new Error('Failed to update, Try again later');
				} else {
					// Update state only after successful API call
					if (onSuccess) onSuccess();

					// Handle assignedTo special case
					if (propName === 'assignedTo') {
						const token = localStorage.getItem('usertoken');
						const { user_id, userName } = jwtDecode(token);
						if (isUpdatingSubTask) {
							setInfo((prevInfo) => ({
								...prevInfo,
								selectedSubTask: prevInfo?.selectedSubTask
									? {
											...info?.selectedSubTask,
											assignedBy: { _id: user_id, name: userName },
											assignedAt: moment().unix(),
									  }
									: null,
							}));
							updateSubTask({
								_id: rowId,
								assignedBy: { _id: user_id, name: userName },
								assignedAt: moment().unix(),
							});
						} else {
							setInfo((prevInfo) => {
								const newListItems = prevInfo.listItems.map((row) => {
									if (row._id === rowId) {
										return {
											...row,
											assignedBy: { _id: user_id, name: userName },
											assignedAt: moment().unix(),
										};
									}
									return row;
								});

								return {
									...prevInfo,
									listItems: newListItems,
								};
							});
						}
					}

					// Update updatedBy for any successful update
					const token = localStorage.getItem('usertoken');
					const { user_id, userName } = jwtDecode(token);

					setInfo((prevInfo) => {
						const newListItems = prevInfo.listItems.map((row) => {
							if (row._id === rowId) {
								return {
									...row,
									updatedBy: { _id: user_id, name: userName },
								};
							}
							return row;
						});

						return {
							...prevInfo,
							listItems: newListItems,
						};
					});
				}
				if (!info?.sidebarIsOpen) {
					fetchListItems();
				}
			} catch (error) {
				message.error(error?.message || 'Something went wrong! Please try again.');

				setInfo((prevInfo) => {
					const rolledBackListItems = prevInfo.listItems.map((row) => {
						if (row._id === rowId) {
							return { ...row, [propName]: originalValue };
						}
						return row;
					});

					return {
						...prevInfo,
						listItems: rolledBackListItems,
					};
				});
			}
		},
		[updateListItem, info?.workflows, info?.selectedSubTask, info?.sidebarIsOpen],
	);

	const handleDebounceUpdate = useCallback(
		(rowId, propName, value, originalValue, isSubTask, onSuccess) => {
			clearInterval(info?.timeout);
			const timeout = setTimeout(() => {
				debouncedUpdateTask(rowId, propName, value, originalValue, isSubTask, onSuccess);
				setInfo((prev) => ({
					...prev,
					loading: true,
					timeout: null,
				}));
			}, 800);
			setInfo((prev) => ({ ...prev, timeout }));
		},
		[debouncedUpdateTask, info?.timeout],
	);

	const updatePropertyValue = useCallback(
		(rowId, propName, value, isUpdatingSubTask, onSuccess) => {
			if (
				validateExpiryData &&
				validateExpiryData?.restrictTasks &&
				validateExpiryData?.isExpired
			) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			}
			let originalValue;
			let updatedValue = value;
			if (propName === 'workflow') {
				const workflow = info?.workflows?.find((workflow) => workflow._id === value);
				updatedValue = workflow;
			}

			if (info?.selectedSubTask || isUpdatingSubTask) {
				if (info?.selectedSubTask) {
					setInfo((prevInfo) => ({
						...prevInfo,
						updated: true,
						selectedSubTask: { ...info?.selectedSubTask, [propName]: updatedValue },
					}));
				}
				setInfo((prevInfo) => ({
					...prevInfo,
					updated: true,
				}));
				updateSubTask({ _id: rowId, [propName]: updatedValue });
			} else {
				setInfo((prevInfo) => {
					const updatedListItems = prevInfo.listItems.map((row) => {
						if (row._id === rowId) {
							originalValue = row[propName];
							return { ...row, [propName]: updatedValue };
						}
						return row;
					});

					return {
						...prevInfo,
						updated: true,
						listItems: updatedListItems,
					};
				});
			}

			handleDebounceUpdate(
				rowId,
				propName,
				value,
				originalValue,
				isUpdatingSubTask || info?.selectedSubTask !== null,
				onSuccess,
			);
		},
		[
			validateExpiryData?.isExpired,
			updateSubscriptionState,
			debouncedUpdateTask,
			info?.selectedSubTask,
		],
	);

	const addNewTask = useCallback(
		async (payload) => {
			if (
				validateExpiryData &&
				validateExpiryData?.restrictTasks &&
				validateExpiryData?.isExpired
			) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			} else {
				if (info?.isCreatingSubtask) {
					payload.parentTaskId = info?.selectedRow?._id;
				}
				const response = await addListItem({ input: payload });

				if (response) {
					const task = response?.createTask;

					if (task) {
						const token = localStorage.getItem('usertoken');
						const { user_id, userName } = jwtDecode(token);

						const newTask = { ...task };
						const newWorkflow = info?.workflows?.find(
							(workflow) => workflow._id === payload?.workflowId,
						);
						newTask.workflow = newWorkflow
							? { _id: newWorkflow._id, title: newWorkflow.label }
							: null;
						newTask.workflowId = null;
						newTask.createdBy = { _id: user_id, name: userName };
						newTask.updatedBy = { _id: user_id, name: userName };
						if (info?.isCreatingSubtask) {
							newTask.parentTask = {
								title: info?.selectedRow?.title,
								_id: info?.selectedRow?._id,
							};
							addSubTask(newTask);
						}
						message.success('Task added successfully');
						fetchListItems();
					}
				} else {
					throw new Error('Failed to add new task');
				}
			}
		},
		[info?.workflows, info?.isCreatingSubtask, info?.selectedRow?._id],
	);

	const deleteTask = useCallback(
		async (payload) => {
			if (
				validateExpiryData &&
				validateExpiryData?.restrictTasks &&
				validateExpiryData?.isExpired
			) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			} else {
				const response = await deleteListItem(payload);
				if (response) {
					if (info?.selectedSubTask?._id === payload?.taskId) {
						updateTaskInfo({ selectedSubTask: null });
						removeSubTask(payload?.taskId);
					} else {
						setInfo((prevInfo) => ({
							...prevInfo,
							listItems: prevInfo?.listItems?.filter(
								(row) => row._id !== payload?.taskId,
							),
							sidebarIsOpen: false,
							selectedRow: null,
						}));
					}
				}
			}
		},
		[info?.selectedSubTask?._id, removeSubTask],
	);

	const handleAddButtonOnClick = () => {
		updateTaskInfo({ isCreatingSubtask: false, isCreateModalOpen: true });
	};

	const handleCloseCreateModal = useCallback(() => {
		if (info?.isCreatingSubtask) {
			updateTaskInfo({ sidebarIsOpen: true });
		}
		updateTaskInfo({ isCreateModalOpen: false });
	}, [info?.isCreatingSubtask]);

	const handleRowClick = useCallback(
		(row) => {
			if (info?.selectedRow?._id !== row?._id) {
				resetSubTasks();
			}
			if (row) {
				updateTaskInfo({ selectedRow: row, sidebarIsOpen: true, breadCrumbs: [] });
			}
		},
		[info?.listItems, resetSubTasks, info?.selectedRow?._id],
	);

	const handleCreateSubTaskClick = useCallback(() => {
		updateTaskInfo({ sidebarIsOpen: false, isCreatingSubtask: true, isCreateModalOpen: true });
	}, []);

	const handleSubTaskClick = useCallback(
		(task) => {
			const breadCrumbs = [
				...info?.breadCrumbs,
				{
					label:
						`${info?.taskMetadata?.prefix ? info?.taskMetadata?.prefix + '-' : ''}` +
						info?.selectedRow?.taskSlNo,
					data: info?.selectedRow,
				},
			];
			updateTaskInfo({ selectedRow: task, breadCrumbs });
		},
		[info?.selectedRow, info?.breadCrumbs],
	);

	const handleBreadCrumbsClick = useCallback(
		(breadCrumb, index) => {
			const breadCrumbs = [...info?.breadCrumbs];
			const newBreadCrumbs = [...breadCrumbs].slice(0, index);
			updateTaskInfo({ breadCrumbs: newBreadCrumbs, selectedRow: breadCrumb?.data });
		},
		[info?.breadCrumbs],
	);

	const handleCloseSidebar = useCallback(() => {
		if (info?.updated) {
			updateTaskInfo({ loadingSkeleton: true });
			fetchListItems();
			updateTaskInfo({ updated: false });
		}
		updateTaskInfo({ sidebarIsOpen: false, selectedSubTask: null });
	}, [info?.updated]);

	const updateView = useCallback(
		(viewId, updateData, taskMetadataId) => {
			const data = {
				taskMetadataId: taskMetadataId || info?.taskMetadata?._id,
				viewId,
				input: updateData,
			};
			updateTaskViews(data);
		},
		[updateTaskViews, info?.taskMetadata?._id],
	);

	const deleteView = useCallback(
		(viewId) => {
			deleteTaskView({ taskMetadataId: info?.taskMetadata?._id, viewId });
		},
		[deleteTaskView, info?.taskMetadata?._id],
	);

	return (
		<>
			<Task
				responseMetadata={responseMetadata}
				handleAddButtonOnClick={handleAddButtonOnClick}
				handleRowClick={handleRowClick}
				colors={colors}
				updateTaskInfo={updateTaskInfo}
				rowTypes={rowTypes}
				data={info?.listItems}
				loading={info?.loadingSkeleton}
				handleUpdate={updatePropertyValue}
				properties={info?.properties}
				taskPreferences={info?.taskPreferences}
				searchValue={info?.searchValue}
				infinityLoading={info?.infinityLoading}
				hasMore={info?.hasMore}
				error={info?.error}
				fetchMoreData={fetchMoreData}
				blockTitle={'Tasks'}
				createButtonText={'Create Task'}
				prefix={info?.taskMetadata?.prefix}
				views={info?.taskMetadata?.views}
				updateView={updateView}
				deleteView={deleteView}
			/>
			<CreateTaskPopup
				isOpen={info?.isCreateModalOpen}
				closeModal={handleCloseCreateModal}
				addNewTask={addNewTask}
				workflows={info?.workflows}
				tenantUsers={info?.tenantUsers}
				clients={info?.clients}
				isSubTask={info?.isCreatingSubtask}
				responseMetadata={responseMetadata}
				colors={colors}
				fetchMoreData={fetchMoreData}
				hasMore={info?.hasMore}
				error={info?.error}
			/>
			<ListViewSidebar
				selectedRow={info?.selectedRow}
				sidebarIsOpen={info?.sidebarIsOpen}
				closeSidebar={handleCloseSidebar}
				handleUpdate={updatePropertyValue}
				deleteTask={deleteTask}
				rowTypes={rowTypes}
				responseMetadata={responseMetadata}
				properties={info?.properties}
				colors={colors}
				toggleSidebarExpand={() =>
					updateTaskInfo({ isSidebarExpanded: !info?.isSidebarExpanded })
				}
				isSidebarExpanded={info?.isSidebarExpanded}
				headerText={
					`${info?.taskMetadata?.prefix ? info?.taskMetadata?.prefix + '-' : ''}` +
					(info?.selectedRow?.taskSlNo || '')
				}
				breadCrumbs={info?.breadCrumbs}
				handleBreadCrumbsClick={handleBreadCrumbsClick}
				sidebarChildren={
					info?.selectedRow ? (
						<ChildTaskComponent
							parentTaskId={info?.selectedRow?._id}
							childTasks={info?.selectedRow?.childTasks}
							completedStatus={info?.taskMetadata?.completedGroupLabels}
							rowTypes={rowTypes}
							responseMetadata={responseMetadata}
							colors={colors}
							properties={info?.properties}
							onAddButtonClick={handleCreateSubTaskClick}
							handleUpdate={(...args) => updatePropertyValue(...args, true)}
							handleRowClick={handleSubTaskClick}
						/>
					) : null
				}
			/>
		</>
	);
};

export default memo(Tasks);
