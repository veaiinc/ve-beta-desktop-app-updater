import React, { useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import '../../../../assets/scss/home_page/tasks.scss';
import { ReactComponent as ChevronRightThinIcon } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as textSvg } from '../../../../assets/svg/tasks/letterA.svg';
import { ReactComponent as ClockSvg } from '../../../../assets/svg/activity/clock.svg';
import { ReactComponent as PieSvg } from '../../../../assets/svg/tasks/pieHollow.svg';
import { ReactComponent as PrioritySvg } from '../../../../assets/svg/tasks/roundChevronRight.svg';
import { ReactComponent as WorkflowSvg } from '../../../../assets/svg/tasks/workflow.svg';
import { ReactComponent as PersonSvg } from '../../../../assets/svg/tasks/person.svg';
import { ReactComponent as CalendarSvg } from '../../../../assets/svg/tasks/calendar.svg';
import { message, Tooltip } from 'antd';
import Skeleton from 'react-loading-skeleton';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import Context from '../../../../context/context';
import ListViewSidebar from '../../modalsV2/tasks/ListViewSidebar';

import Text from '../../../components/tasks/listView/Text';
import Select from '../../../components/tasks/listView/Select';
import Person from '../../../components/tasks/listView/Person';
import MultiSelect from '../../../components/tasks/listView/MultiSelect';
import DateView from '../../../components/tasks/listView/DateView';
import Status from '../../../components/tasks/listView/Status';
import Priority from '../../../components/tasks/listView/Priority';
import Email from '../../../components/tasks/listView/Email';
import Url from '../../../components/tasks/listView/Url';
import Phone from '../../../components/tasks/listView/Phone';
import CheckBox from '../../../components/tasks/listView/CheckBox';

import WorkFlow from '../../../components/tasks/listView/WorkFlow';
import TaskId from '../../../components/tasks/listView/TaskId';
import ParentTaskComponent from '../../../components/tasks/listView/ParentTaskComponent';
import ChildTaskProgress from '../../../components/tasks/listView/ChildTaskProgress';
import LinkText from '../../../components/tasks/listView/LinkText';
import { FetchMoreLoaderComp } from '../../../../helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import ChildTaskComponent from '../../tasks/listView/ChildTaskComponent';
import CreateTaskPopup from '../../modalsV2/tasks/CreateTaskPopup';

const colors = {
	1: { backgroundColor: '#62344B', color: '#A35A7E' },
	2: { backgroundColor: '#373737', color: '#707070' },
	3: { backgroundColor: '#5B3D2F', color: '#8F614B' },
	4: { backgroundColor: '#7D4F27', color: '#B37339' },
	5: { backgroundColor: '#375841', color: '#588F69' },
	6: { backgroundColor: '#2F4469', color: '#4F71B3' },
	7: { backgroundColor: '#453061', color: '#6F4C99' },
};

const options = [
	{ id: 1, title: 'Pending Tasks', value: 'pending' },
	{ id: 2, title: 'Today', value: 'today' },
	{ id: 3, title: 'Overdue', value: 'overdue' },
];

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

const TasksTab = () => {
	const {
		tasks: {
			listTasksForToday,
			listTasksForOverdue,
			listTasksDueTillToday,
			tasksCountForToday,
			tasksCountForOverdue,
			getListTasksForToday,
			getListTasksForOverdue,
			getListTasksDueTillToday,
			getTasksCountForToday,
			getTasksCountForOverdue,
			addListItem,
			updateListItem,
			deleteListItem,
			addSubTask,
			updateSubTask,
			resetSubTasks,
			taskMetadata,
			getTaskMetadata,
		},
		templates: { getWorkflowsList, workflowslist },
		companyInfo: { getTeamMembers, tenantsUserList },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);

	const [info, setInfo] = useState({
		isDropDownOpen: false,
		isCreateModalOpen: false,
		isCreatingSubtask: true,
		properties: [],
		taskPreferences: {
			preferenceType: 'taskPreference',
			preferences: defaultPreference,
		},
		selectedOption: 'pending',
		sidebarIsOpen: false,
		selectedRow: null,
		taskMetadata: null,
		workflows: [],
		tenantUsers: [],
		taskData: {},
		breadCrumbs: [],
		loadingSkeleton: true,
	});

	const debounceTimeout = useRef(null);

	const taskLabels = useMemo(
		() => ({
			pending: {
				label: 'Pending actions till today',
				count: tasksCountForToday + tasksCountForOverdue,
			},
			today: {
				label: 'Today',
				count: tasksCountForToday,
			},
			overdue: {
				label: 'Overdue',
				count: tasksCountForOverdue,
			},
		}),
		[tasksCountForToday, tasksCountForOverdue],
	);

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
			taskSlNo: { type: 'id', name: 'Id', Icon: textSvg, props: {} },
		}),
		[info?.workflows, info?.tenantUsers, info?.taskMetadata, info?.parentTasks],
	);

	useEffect(() => {
		if (!tasksCountForToday) {
			getTodayTasksCount();
		}

		if (!tasksCountForOverdue) {
			getOverdueTasksCount();
		}
	}, []);

	useEffect(() => {
		if (info?.selectedOption === 'today') {
			if (listTasksForToday) {
				setInfo((prev) => ({
					...prev,
					taskData: {
						...prev?.taskData,
						[info?.selectedOption]: { ...listTasksForToday },
					},
					loadingSkeleton: false,
				}));
			} else {
				fetchTodayTasks(1);
			}
		}

		if (info?.selectedOption === 'overdue') {
			if (listTasksForOverdue) {
				setInfo((prev) => ({
					...prev,
					taskData: {
						...prev?.taskData,
						[info?.selectedOption]: { ...listTasksForOverdue },
					},
					loadingSkeleton: false,
				}));
			} else {
				fetchOverdueTasks(1);
			}
		}

		if (info?.selectedOption === 'pending') {
			if (listTasksDueTillToday) {
				setInfo((prev) => ({
					...prev,
					taskData: {
						...prev?.taskData,
						[info?.selectedOption]: { ...listTasksDueTillToday },
					},
					loadingSkeleton: false,
				}));
			} else {
				fetchDueTillTodayTasks(1);
			}
		}
	}, [info?.selectedOption]);

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
		if (workflowslist === null) {
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
		if (info?.taskPreferences?.preferences) {
			setInfo((prevInfo) => ({
				...prevInfo,
				properties: mapPropertyType(),
			}));
		}
	}, [info?.taskPreferences?.preferences]);

	useEffect(() => {
		if (listTasksForToday) {
			const a = { [info?.selectedOption]: { ...listTasksForToday } };
			setInfo((prevInfo) => ({
				...prevInfo,
				taskData: {
					...prevInfo?.taskData,
					today: { ...listTasksForToday },
				},
				loadingSkeleton: false,
			}));
		}
	}, [listTasksForToday]);

	useEffect(() => {
		if (listTasksForOverdue) {
			setInfo((prevInfo) => ({
				...prevInfo,
				taskData: {
					...prevInfo?.taskData,
					overdue: { ...listTasksForOverdue },
				},
				loadingSkeleton: false,
			}));
		}
	}, [listTasksForOverdue]);

	useEffect(() => {
		if (listTasksDueTillToday) {
			setInfo((prevInfo) => ({
				...prevInfo,
				taskData: {
					...prevInfo?.taskData,
					pending: { ...listTasksDueTillToday },
				},
				loadingSkeleton: false,
			}));
		}
	}, [listTasksDueTillToday]);

	useEffect(() => {
		if (!taskMetadata) {
			getTaskMetadata();
		} else {
			setInfo((prevInfo) => ({
				...prevInfo,
				taskMetadata: taskMetadata,
			}));
		}
	}, [taskMetadata]);

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

	const getTodayTasksCount = () => {
		const payload = {
			filters: {
				limit: 1,
				page: 1,
				startDate: Math?.floor(new Date()?.setHours(0, 0, 0, 0) / 1000),
				endDate: Math?.floor(new Date()?.setHours(23, 59, 59, 999) / 1000),
			},
		};
		getTasksCountForToday(payload);
	};

	const getOverdueTasksCount = () => {
		const payload = {
			filters: {
				limit: 1,
				page: 1,
				endDate: Math?.floor(new Date()?.setHours(-1, 59, 59, 999) / 1000),
			},
		};
		getTasksCountForOverdue(payload);
	};

	const fetchTodayTasks = (page, type = null, task = null) => {
		const payload = {
			filters: {
				limit: 10,
				page,
				startDate: Math?.floor(new Date()?.setHours(0, 0, 0, 0) / 1000),
				endDate: Math?.floor(new Date()?.setHours(23, 59, 59, 999) / 1000),
			},
		};
		getListTasksForToday(payload, type, task);
	};

	const fetchOverdueTasks = async (page, type = null, task = null) => {
		const payload = {
			filters: {
				limit: 10,
				page,
				endDate: Math?.floor(new Date()?.setHours(-1, 59, 59, 999) / 1000),
			},
		};
		getListTasksForOverdue(payload, type, task);
	};

	const fetchDueTillTodayTasks = (page, type = null, task = null) => {
		const payload = {
			filters: {
				limit: 10,
				page,
				endDate: Math?.floor(new Date()?.setHours(23, 59, 59, 999) / 1000),
			},
		};
		getListTasksDueTillToday(payload, type, task);
	};

	const fetchMoreTasksData = () => {
		const nextPage = info?.taskData?.[info?.selectedOption]?.currentPage + 1;
		if (info?.selectedOption === 'pending') {
			fetchDueTillTodayTasks(nextPage);
		} else if (info?.selectedOption === 'today') {
			fetchTodayTasks(nextPage);
		} else {
			fetchOverdueTasks(nextPage);
		}
	};

	const updateTaskInfo = useCallback((updateData) => {
		setInfo((previnfo) => ({ ...previnfo, ...updateData }));
	}, []);

	const debouncedUpdateTask = async (rowId, propName, value, isUpdatingSubTask, onSuccess) => {
		try {
			let task = info?.taskData?.[info?.selectedOption]?.data?.find((row) => {
				return row?._id === rowId;
			});

			if (!task) {
				isUpdatingSubTask = true;
			} else {
				isUpdatingSubTask = false;
			}
			let updatedValue = value;
			if (propName === 'workflow') {
				const workflow = info?.workflows?.find((workflow) => workflow._id === value);
				updatedValue = workflow;
			}

			const token = localStorage.getItem('usertoken');
			const { user_id, userName } = jwtDecode(token);

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

			if (isUpdatingSubTask) {
				if (response?.[0] === false) {
					throw new Error('Failed to update, Try again later');
				} else {
					if (propName === 'assignedTo') {
						updateSubTask({
							_id: rowId,
							assignedBy: { _id: user_id, name: userName },
							assignedAt: moment().unix(),
							[propName]: updatedValue,
						});
					} else if (propName === 'workflow') {
						updateSubTask({
							_id: rowId,
							[propName]: info?.workflows?.find(
								(workflow) => workflow?._id === value,
							),
						});
					} else {
						updateSubTask({
							_id: rowId,
							[propName]: updatedValue,
						});
					}

					if (info?.selectedRow?._id === rowId) {
						setInfo((prev) => ({
							...prev,
							selectedRow: {
								...prev?.selectedRow,
								[propName]: updatedValue,
								assignedBy: { _id: user_id, name: userName },
								assignedAt: moment().unix(),
							},
						}));
					}
				}
			} else {
				if (response?.[0] === false) {
					throw new Error('Failed to update, Try again later');
				} else {
					// Update state only after successful API call
					if (onSuccess) onSuccess();

					// Handle assignedTo special case
					if (propName === 'assignedTo') {
						task = {
							...task,
							assignedBy: { _id: user_id, name: userName },
							assignedAt: moment().unix(),
						};
					}

					// Update updatedBy for any successful update
					task = { ...task, updatedBy: { _id: user_id, name: userName } };
					task = { ...task, [propName]: updatedValue };

					setInfo((prev) => ({
						...prev,
						selectedRow: { ...info?.selectedRow, ...task },
					}));

					if (info?.selectedOption === 'pending') {
						fetchDueTillTodayTasks(1, 'update', task);
						fetchOverdueTasks(1, 'update', task);
						fetchTodayTasks(1, 'update', task);
					} else if (info?.selectedOption === 'today') {
						fetchDueTillTodayTasks(1, 'update', task);
						fetchTodayTasks(1, 'update', task);
					} else if (info?.selectedOption === 'overdue') {
						fetchDueTillTodayTasks(1, 'update', task);
						fetchOverdueTasks(1, 'update', task);
					}
				}
			}
		} catch (error) {
			message.error(error?.message || 'Something went wrong! Please try again.');
		}
	};

	const handleDebounceUpdate = (rowId, propName, value, isSubTask, onSuccess) => {
		if (debounceTimeout.current) {
			clearTimeout(debounceTimeout.current);
		}

		debounceTimeout.current = setTimeout(() => {
			debouncedUpdateTask(rowId, propName, value, isSubTask, onSuccess);
		}, 800);
	};

	const updatePropertyValue = async (rowId, propName, value, isUpdatingSubTask, onSuccess) => {
		if (
			validateExpiryData &&
			validateExpiryData?.restrictContacts &&
			validateExpiryData?.isExpired
		) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		}

		handleDebounceUpdate(rowId, propName, value, isUpdatingSubTask, onSuccess);
	};

	const deleteTask = async (payload) => {
		if (validateExpiryData?.isExpired) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		} else {
			const response = await deleteListItem(payload);

			if (response) {
				let task = info?.taskData?.[info?.selectedOption]?.data?.find((row) => {
					return row?._id === payload?.taskId;
				});

				setInfo((prev) => ({
					...prev,
					selectedRow: null,
					sidebarIsOpen: false,
					breadCrumbs: [],
				}));
				// handleCloseSidebar();
				if (!task) return;

				getOverdueTasksCount();
				getTodayTasksCount();

				if (info?.selectedOption === 'pending') {
					fetchDueTillTodayTasks(1, 'delete', task);
					fetchOverdueTasks(1, 'delete', task);
					fetchTodayTasks(1, 'delete', task);
				} else if (info?.selectedOption === 'today') {
					fetchDueTillTodayTasks(1, 'delete', task);
					fetchTodayTasks(1, 'delete', task);
				} else if (info?.selectedOption === 'overdue') {
					fetchDueTillTodayTasks(1, 'delete', task);
					fetchOverdueTasks(1, 'delete', task);
				}
			}
		}
	};

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
					}
				} else {
					throw new Error('Failed to add new task');
				}
			}
		},
		[info?.workflows, info?.isCreatingSubtask, info?.selectedRow?._id],
	);

	const handleRowClick = useCallback(
		(row) => {
			if (info?.selectedRow?._id !== row?._id) {
				resetSubTasks();
			}
			if (row) {
				updateTaskInfo({ selectedRow: row, sidebarIsOpen: true });
			}
		},
		[resetSubTasks, info?.selectedRow?._id],
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

	const handleCloseSidebar = useCallback(() => {
		updateTaskInfo({
			sidebarIsOpen: false,
			breadCrumbs: [],
			selectedRow: null,
		});
	}, []);

	const handleCloseCreateModal = useCallback(() => {
		if (info?.isCreatingSubtask) {
			updateTaskInfo({ sidebarIsOpen: true });
		}
		updateTaskInfo({ isCreateModalOpen: false });
	}, [info?.isCreatingSubtask]);

	const handleBreadCrumbsClick = useCallback(
		(breadCrumb, index) => {
			const breadCrumbs = [...info?.breadCrumbs];
			const newBreadCrumbs = [...breadCrumbs].slice(0, index);
			updateTaskInfo({ breadCrumbs: newBreadCrumbs, selectedRow: breadCrumb?.data });
		},
		[info?.breadCrumbs],
	);

	return (
		<>
			<div className="tasks">
				<div className="tasks-header">
					<div className="tasks-header-text">
						{`${taskLabels?.[info?.selectedOption]?.label} (${
							taskLabels?.[info?.selectedOption]?.count
						})`}
						<div className="dropdown-container">
							<Tooltip
								placement="bottom"
								color="transparent"
								open={info?.isDropdownOpen}
								trigger={'click'}
								onOpenChange={(open) => {
									setInfo((prev) => ({
										...prev,
										isDropdownOpen: open,
									}));
								}}
								title={
									<div className="dropdown-options">
										{options?.map((option) => (
											<div
												key={option?.id}
												className="dropdown-option"
												onClick={() => {
													if (info?.selectedOption !== option?.value)
														setInfo((prev) => ({
															...prev,
															isDropdownOpen: false,
															selectedOption: option?.value,
															loadingSkeleton: true,
														}));
												}}
											>
												{option?.title}
											</div>
										))}
									</div>
								}
							>
								<button className="dropdown-header">
									<div className="dropdown-content">
										<div className="dropdown-text">
											{
												options?.find(
													(option) =>
														info?.selectedOption === option?.value,
												)?.title
											}
										</div>
										<div className="dropdown-icon">
											<ChevronRightThinIcon />
										</div>
									</div>
								</button>
							</Tooltip>
						</div>
					</div>

					{info?.loadingSkeleton ? (
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								gap: '15px',
								flexWrap: 'wrap',
								paddingTop: '30px',
							}}
						>
							{[1, 2, 3, 4, 5, 6]?.map((ele) => (
								<Skeleton
									height={'231px'}
									width={'268px'}
									style={{
										borderRadius: '16px',
									}}
									key={ele}
								/>
							))}
						</div>
					) : info?.taskData?.[info?.selectedOption]?.data?.length > 0 ? (
						<InfiniteScroll
							dataLength={info?.taskData?.[info?.selectedOption]?.data?.length || 0}
							hasMore={info?.taskData?.[info?.selectedOption]?.hasNextPage}
							next={fetchMoreTasksData}
							loader={<FetchMoreLoaderComp />}
							height={`calc(100vh - 520px)`}
						>
							<div className="tasks-container">
								{info?.taskData?.[info?.selectedOption]?.data?.map((task) => {
									return (
										<div
											className="task-container"
											onClick={() => {
												handleRowClick(task);
											}}
											key={task?._id}
										>
											<div className="task-content">
												<span className="title">{task?.title}</span>
												<div className="description">
													{task?.description}
												</div>
											</div>

											<div className="show-more">
												<div className="assigned-to">
													<div className="persons-container">
														{task?.assignedTo?.map((person, index) => {
															return (
																<div
																	className="persons"
																	key={index}
																>
																	{person?.name[0]?.toUpperCase()}
																</div>
															);
														})}
													</div>
													<div className="remaining-persons-count">
														{task?.assignedTo?.length > 3 &&
															`+${task?.assignedTo?.length - 3}`}
													</div>
												</div>
												<div className="chevron-icon-container">
													<ChevronRightThinIcon />
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</InfiniteScroll>
					) : (
						<div style={{ color: '#f2f2f3', textAlign: 'center' }}> No Tasks Found</div>
					)}
				</div>
			</div>
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
				fetchMoreData={() => {}}
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
					info?.selectedRow?.taskSlNo
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

export default TasksTab;
