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
	{ id: 1, title: 'Pending Tasks', value: 'Pending tasks' },
	{ id: 2, title: 'Today', value: 'Today' },
	{ id: 3, title: 'Overdue', value: 'Overdue' },
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
			updateListItem,
			deleteListItem,
			removeSubTask,
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
		todayTasksList: [],
		overDueTasksList: [],
		dueTillTodayTasksList: [],
		selectedOption: 'Pending tasks',
		sidebarIsOpen: false,
		selectedRow: null,
		selectedSubTask: null,
		taskMetadata: null,
		workflows: [],
		tenantUsers: [],
		hasNextPageForTodayTasks: false,
		hasNextPageForOverdueTasks: false,
		hasNextPageForDueTillToday: false,
		currentPageForTodayTasks: 1,
		currentPageForOverdueTasks: 1,
		currentPageForDueTillTodayTasks: 1,
		loadingSkeleton: true,
	});

	useEffect(() => {
		if (!tasksCountForToday) {
			getTodayTasksCount();
		}

		if (!tasksCountForOverdue) {
			getOverdueTasksCount();
		}

		if (listTasksForToday) {
			const { currentPage, hasNextPage, data } = listTasksForToday;
			setInfo((prev) => ({
				...prev,
				currentPageForTodayTasks: currentPage,
				hasNextPageForTodayTasks: hasNextPage,
				todayTasksList: data,
			}));
		} else {
			fetchTodayTasks(1);
		}

		if (listTasksForOverdue) {
			const { currentPage, hasNextPage, data } = listTasksForOverdue;
			setInfo((prev) => ({
				...prev,
				currentPageForOverdueTasks: currentPage,
				hasNextPageForTodayTasks: hasNextPage,
				overDueTasksList: data,
			}));
		} else {
			fetchOverdueTasks(1);
		}
		if (listTasksDueTillToday) {
			const { currentPage, hasNextPage, data } = listTasksDueTillToday;
			setInfo((prev) => ({
				...prev,
				currentPageForDueTillTodayTasks: currentPage,
				hasNextPageForDueTillToday: hasNextPage,
				dueTillTodayTasksList: data,
			}));
		} else {
			fetchDueTillTodayTasks(1);
		}
	}, []);

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
		[info?.workflows, info?.tenantUsers, info?.taskMetadata],
	);

	const debounceTimeout = useRef(null);

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
		if (listTasksForToday) {
			if (listTasksForToday?.data) {
				setInfo((prevInfo) => ({
					...prevInfo,
					todayTasksList: listTasksForToday?.data,
					hasNextPageForTodayTasks: listTasksForToday?.hasNextPage,
					loadingSkeleton: false,
				}));
			}
		}

		if (listTasksForOverdue) {
			if (listTasksForOverdue?.data) {
				setInfo((prevInfo) => ({
					...prevInfo,
					overDueTasksList: listTasksForOverdue?.data,
					hasNextPageForOverdueTasks: listTasksForOverdue?.hasNextPage,
					loadingSkeleton: false,
				}));
			}
		}

		if (listTasksDueTillToday) {
			if (listTasksDueTillToday?.data) {
				setInfo((prevInfo) => ({
					...prevInfo,
					dueTillTodayTasksList: listTasksDueTillToday?.data,
					hasNextPageForDueTillToday: listTasksDueTillToday?.hasNextPage,
					loadingSkeleton: false,
				}));
			}
		}
	}, [listTasksForToday, listTasksForOverdue, listTasksDueTillToday]);

	useEffect(() => {
		if (info?.selectedRow) {
			updateTaskInfo({
				selectedRow:
					info?.overDueTasksList?.find((item) => item?._id === info?.selectedRow._id) ||
					info?.todayTasksList?.find((item) => item?._id === info?.selectedRow._id) ||
					info?.dueTillTodayTasksList?.find(
						(item) => item?._id === info?.selectedRow._id,
					),
			});
		}
	}, [
		info?.todayTasksList,
		info?.overDueTasksList,
		info?.dueTillTodayTasksList,
		info?.selectedRow,
	]);

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

	const getTodayTasksCount = () => {
		const payload = {
			filters: {
				limit: 1,
				page: 1,
				startDate: Math.floor(new Date().setHours(0, 0, 0, 0) / 1000),
				endDate: Math.floor(new Date().setHours(23, 59, 59, 999) / 1000),
			},
		};
		getTasksCountForToday(payload);
	};

	const getOverdueTasksCount = () => {
		const payload = {
			filters: {
				limit: 1,
				page: 1,
				endDate: Math.floor(new Date().setHours(-1, 59, 59, 999) / 1000),
			},
		};
		getTasksCountForOverdue(payload);
	};

	const fetchTodayTasks = (page = 1) => {
		const payload = {
			filters: {
				limit: 10,
				page,
				startDate: Math.floor(new Date().setHours(0, 0, 0, 0) / 1000),
				endDate: Math.floor(new Date().setHours(23, 59, 59, 999) / 1000),
			},
		};
		getListTasksForToday(payload);
	};

	const fetchOverdueTasks = async (page) => {
		const payload = {
			filters: {
				limit: 6,
				page,
				endDate: Math.floor(new Date().setHours(-1, 59, 59, 999) / 1000),
			},
		};
		getListTasksForOverdue(payload);
	};

	const fetchDueTillTodayTasks = (page) => {
		const payload = {
			filters: {
				limit: 6,
				page,
				endDate: Math.floor(new Date().setHours(23, 59, 59, 999) / 1000),
			},
		};
		getListTasksDueTillToday(payload);
	};

	const fetchMoreTodayTasks = () => {
		const nextPage = info?.currentPageForTodayTasks + 1;
		fetchTodayTasks(nextPage);
		setInfo((prevInfo) => ({
			...prevInfo,
			currentPageForTodayTasks: nextPage,
		}));
	};

	const fetchMoreOverdueTasks = () => {
		const nextPage = info?.currentPageForOverdueTasks + 1;
		fetchOverdueTasks(nextPage);
		setInfo((prevInfo) => ({
			...prevInfo,
			currentPageForOverdueTasks: nextPage,
		}));
	};

	const fetchMoreTasksDueTillToday = () => {
		const nextPage = info?.currentPageForDueTillTodayTasks + 1;
		fetchDueTillTodayTasks(nextPage);
		setInfo((prevInfo) => ({
			...prevInfo,
			currentPageForDueTillTodayTasks: nextPage,
		}));
	};

	const updateTaskInfo = useCallback((updateData) => {
		setInfo((previnfo) => ({ ...previnfo, ...updateData }));
	}, []);

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
								const newTodayTasksList = prevInfo?.todayTasksList?.map((row) => {
									if (row._id === rowId) {
										return {
											...row,
											assignedBy: { _id: user_id, name: userName },
											assignedAt: moment().unix(),
										};
									}
									return row;
								});

								const newOverdueTasksList = prevInfo?.overDueTasksList?.map(
									(row) => {
										if (row._id === rowId) {
											return {
												...row,
												assignedBy: { _id: user_id, name: userName },
												assignedAt: moment().unix(),
											};
										}
										return row;
									},
								);

								const newDueTillTodayTasksList =
									prevInfo?.dueTillTodayTasksList?.map((row) => {
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
									todayTasksList: newTodayTasksList,
									overDueTasksList: newOverdueTasksList,
									dueTillTodayTasksList: newDueTillTodayTasksList,
								};
							});
						}
					}

					// Update updatedBy for any successful update
					const token = localStorage.getItem('usertoken');
					const { user_id, userName } = jwtDecode(token);

					setInfo((prevInfo) => {
						const newTodayTasksList = prevInfo?.todayTasksList?.map((row) => {
							if (row._id === rowId) {
								return {
									...row,
									updatedBy: { _id: user_id, name: userName },
								};
							}
							return row;
						});

						const newOverdueTasksList = prevInfo?.overDueTasksList?.map((row) => {
							if (row._id === rowId) {
								return {
									...row,
									updatedBy: { _id: user_id, name: userName },
								};
							}
							return row;
						});

						const newDueTillTodayTasksList = prevInfo?.dueTillTodayTasksList?.map(
							(row) => {
								if (row._id === rowId) {
									return {
										...row,
										updatedBy: { _id: user_id, name: userName },
									};
								}
								return row;
							},
						);

						return {
							...prevInfo,
							todayTasksList: newTodayTasksList,
							overDueTasksList: newOverdueTasksList,
							dueTillTodayTasksList: newDueTillTodayTasksList,
						};
					});
				}
				if (!info?.sidebarIsOpen) {
					fetchOverdueTasks(1);
					fetchTodayTasks(1);
				}
			} catch (error) {
				message.error(error?.message || 'Something went wrong! Please try again.');

				setInfo((prevInfo) => {
					const rolledBackTodayTasksList = prevInfo?.todayTasksList?.map((row) => {
						if (row._id === rowId) {
							return { ...row, [propName]: originalValue };
						}
						return row;
					});

					const rolledBackOverdueTasksList = prevInfo?.overDueTasksList?.map((row) => {
						if (row._id === rowId) {
							return { ...row, [propName]: originalValue };
						}
						return row;
					});

					const rolledBackDueTillTodayTasksList = prevInfo?.dueTillTodayTasksList?.map(
						(row) => {
							if (row._id === rowId) {
								return { ...row, [propName]: originalValue };
							}
							return row;
						},
					);

					return {
						...prevInfo,
						todayTasksList: rolledBackTodayTasksList,
						overDueTasksList: rolledBackOverdueTasksList,
						dueTillTodayTasksList: rolledBackDueTillTodayTasksList,
					};
				});
			}
		},
		[updateListItem, info?.workflows, info?.selectedSubTask, info?.sidebarIsOpen],
	);

	const handleDebounceUpdate = useCallback(
		(rowId, propName, value, originalValue, isSubTask, onSuccess) => {
			if (debounceTimeout.current) {
				clearTimeout(debounceTimeout.current);
			}

			debounceTimeout.current = setTimeout(() => {
				debouncedUpdateTask(rowId, propName, value, originalValue, isSubTask, onSuccess);
			}, 800);
		},
		[debouncedUpdateTask],
	);

	const updatePropertyValue = useCallback(
		(rowId, propName, value, isUpdatingSubTask, onSuccess) => {
			if (validateExpiryData?.isExpired) {
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
						selectedSubTask: { ...info?.selectedSubTask, [propName]: updatedValue },
					}));
				}
				setInfo((prevInfo) => ({
					...prevInfo,
				}));
				updateSubTask({ _id: rowId, [propName]: updatedValue });
			} else {
				setInfo((prevInfo) => {
					const updatedTodayTasksList = prevInfo?.todayTasksList?.map((row) => {
						if (row._id === rowId) {
							originalValue = row[propName];
							return { ...row, [propName]: updatedValue };
						}
						return row;
					});

					const updatedOverdueTasksList = prevInfo?.overDueTasksList?.map((row) => {
						if (row._id === rowId) {
							originalValue = row[propName];
							return { ...row, [propName]: updatedValue };
						}
						return row;
					});

					const updatedDueTillTodayTasksList = prevInfo?.dueTillTodayTasksList?.map(
						(row) => {
							if (row._id === rowId) {
								originalValue = row[propName];
								return { ...row, [propName]: updatedValue };
							}
							return row;
						},
					);

					return {
						...prevInfo,
						todayTasksList: updatedTodayTasksList,
						overDueTasksList: updatedOverdueTasksList,
						dueTillTodayTasksList: updatedDueTillTodayTasksList,
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

	const deleteTask = useCallback(
		async (payload) => {
			if (validateExpiryData?.isExpired) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			} else {
				const response = await deleteListItem(payload);
				if (response) {
					if (info?.selectedSubTask?._id === payload?.taskId) {
						updateTaskInfo({ selectedSubTask: null });
						removeSubTask(payload?.taskId);
					} else {
						getOverdueTasksCount();
						getTodayTasksCount();
						setInfo((prevInfo) => ({
							...prevInfo,
							todayTasksList: prevInfo?.todayTasksList?.filter(
								(row) => row?._id !== payload?.taskId,
							),
							overDueTasksList: prevInfo?.overDueTasksList?.filter(
								(row) => row?._id !== payload?.taskId,
							),
							dueTillTodayTasksList: prevInfo?.dueTillTodayTasksList?.filter(
								(row) => row?._id !== payload?.taskId,
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

	const handleRowClick = useCallback(
		(row) => {
			if (info?.selectedRow?._id !== row?._id) {
				resetSubTasks();
			}
			if (row) {
				updateTaskInfo({ selectedRow: row, sidebarIsOpen: true });
			}
		},
		[info?.listItems, resetSubTasks, info?.selectedRow?._id],
	);

	const handleCreateSubTaskClick = useCallback(() => {
		updateTaskInfo({ sidebarIsOpen: false, isCreatingSubtask: true, isCreateModalOpen: true });
	}, []);

	const handleSubTaskClick = useCallback((task) => {
		updateTaskInfo({ selectedSubTask: task });
	}, []);

	const handleCloseSidebar = useCallback(() => {
		updateTaskInfo({ sidebarIsOpen: false, selectedSubTask: null });
	}, []);

	const handleChildTaskClose = useCallback(() => {
		updateTaskInfo({ selectedSubTask: null });
	}, []);

	return (
		<>
			<div className="tasks">
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
											setInfo((prev) => ({
												...prev,
												isDropdownOpen: false,
												selectedOption: option?.value,
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
								<div className="dropdown-text">{info?.selectedOption}</div>
								<div className="dropdown-icon">
									<ChevronRightThinIcon />
								</div>
							</div>
						</button>
					</Tooltip>
				</div>
				{info?.dueTillTodayTasksList?.length > 0 &&
					info?.selectedOption === 'Pending tasks' && (
						<div className="due-till-today-tasks">
							<div className="due-till-today-text">
								Pending tasks till today (
								{tasksCountForToday + tasksCountForOverdue})
							</div>
							<InfiniteScroll
								dataLength={info?.dueTillTodayTasksList?.length || 0}
								hasMore={info?.hasNextPageForDueTillToday}
								next={fetchMoreTasksDueTillToday}
								loader={<FetchMoreLoaderComp />}
								height={470}
							>
								<div className="tasks-container">
									{info?.dueTillTodayTasksList?.map((task) => {
										return (
											<div
												className="task-container"
												onClick={() => {
													handleRowClick(task);
												}}
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
															{task?.assignedTo?.map(
																(person, index) => {
																	return (
																		<div
																			className="persons"
																			key={index}
																		>
																			{person?.name[0]?.toUpperCase()}
																		</div>
																	);
																},
															)}
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
						</div>
					)}

				{info?.todayTasksList?.length > 0 && info?.selectedOption === 'Today' && (
					<div className="today-tasks">
						<div className="today-text">Today ({tasksCountForToday})</div>
						<InfiniteScroll
							dataLength={info?.todayTasksList?.length || 0}
							next={fetchMoreTodayTasks}
							hasMore={info?.hasNextPageForTodayTasks}
							loader={<FetchMoreLoaderComp />}
							height={470}
						>
							<div className="tasks-container">
								{info?.todayTasksList?.map((task) => {
									return (
										<div
											className="task-container"
											onClick={() => {
												handleRowClick(task);
											}}
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
					</div>
				)}
				{info?.overDueTasksList?.length > 0 && info?.selectedOption === 'Overdue' && (
					<div className="over-due-tasks">
						<div className="over-due-text">Overdue ({tasksCountForOverdue})</div>
						<InfiniteScroll
							dataLength={info?.overDueTasksList?.length || 0}
							next={fetchMoreOverdueTasks}
							hasMore={info?.hasNextPageForOverdueTasks}
							loader={<FetchMoreLoaderComp />}
							height={470}
						>
							<div className="tasks-container">
								{info?.overDueTasksList?.map((task) => {
									return (
										<div
											className="task-container"
											onClick={() => {
												handleRowClick(task);
											}}
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
					</div>
				)}
			</div>
			<ListViewSidebar
				selectedRow={info?.selectedSubTask || info?.selectedRow}
				isShowingSubTask={
					info?.selectedSubTask !== undefined && info?.selectedSubTask !== null
				}
				parentTaskNo={info?.selectedRow?.taskSlNo}
				handleChildTaskClose={handleChildTaskClose}
				handleSubTaskClick={handleSubTaskClick}
				sidebarIsOpen={info?.sidebarIsOpen}
				closeSidebar={handleCloseSidebar}
				handleUpdate={updatePropertyValue}
				deleteTask={deleteTask}
				rowTypes={rowTypes}
				handleCreateSubTaskClick={handleCreateSubTaskClick}
				responseMetadata={responseMetadata}
				haveSubTask={false}
				properties={info?.properties}
				colors={colors}
				toggleSidebarExpand={() =>
					updateTaskInfo({ isSidebarExpanded: !info?.isSidebarExpanded })
				}
				isSidebarExpanded={info?.isSidebarExpanded}
			/>
		</>
	);
};

export default TasksTab;
