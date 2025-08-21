import {
	memo,
	useContext,
	useEffect,
	useState,
	useMemo,
	useCallback,
	Fragment,
	useRef,
} from 'react';
import '../../../assets/scss/globalComponents/taskWidget.scss';
import { accessControlCheck } from '../../../helpers/accessControlCheck';
import { ReactComponent as PlusIcon } from '../../../assets/svg/calendar/add.svg';
import { ReactComponent as ArrowViewIcon } from '../../../assets/svg/calendar/arrowview.svg';
import Context from '../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useLocation } from 'react-router-dom';
import ListViewSidebar from '../modalsV2/tasks/ListViewSidebar';
import { rowTypes } from '../../features/tasks/Tasks';
import { colors } from '../../../helpers/taskHelpers';
import { ReactComponent as ClockSvg } from '../../../assets/svg/activity/clock.svg';
import { ReactComponent as PieSvg } from '../../../assets/svg/tasks/pieHollow.svg';
import { ReactComponent as PrioritySvg } from '../../../assets/svg/tasks/roundChevronRight.svg';
import { ReactComponent as WorkflowSvg } from '../../../assets/svg/tasks/workflow.svg';
import { ReactComponent as PersonSvg } from '../../../assets/svg/tasks/person.svg';
import { ReactComponent as CalendarSvg } from '../../../assets/svg/tasks/calendar.svg';
import { ReactComponent as textSvg } from '../../../assets/svg/tasks/letterA.svg';
import CreateTaskPopup from '../modalsV2/tasks/CreateTaskPopup';
import { message } from '../../components/globalComponents/CustomToast';
import jwtDecode from 'jwt-decode';
import moment from 'moment';
import { FetchMoreLoaderComp } from '../../../helpers';
import { Tooltip } from 'antd';
import ChildTaskComponent from '../tasks/listView/ChildTaskComponent';

const skeletonLoaders = Array.from({ length: 9 }, (_, index) => index + 1);

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
	clients: { show: true, order: 8 },
	assignedTo: { show: true, order: 9 },
	dueDate: { show: true, order: 10 },
	assignedBy: { show: true, order: 11 },
	assignedAt: { show: false, order: 12 },
	completedAt: { show: false, order: 13 },
	createdAt: { show: false, order: 14 },
	updatedAt: { show: false, order: 15 },
};

const TaskWidget = ({ width, height, clientId, onTaskCountUpdate }) => {
	const location = useLocation();
	const isContactPage = location?.pathname?.includes('contact');
	const navigate = useNavigate();
	const {
		tasks: {
			listTasks,
			getListItems,
			hasNextPage,
			taskMetadata,
			getTaskMetadata,
			updateSubTask,
			addSubTask,
			removeSubTask,
			addListItem,
			updateTaskState,
			updateListItem,
			deleteListItem,
			refetchTasks,
			getListTaskWithGroup,
			updateTaskPreferences,
			updateSideBarData,
			sideBarData,
		},
		companyInfo: { getTeamMembers, tenantsUserList },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
		profileInfo: { tenantUserAccessControls },
	} = useContext(Context);

	const isLoading = useRef(true);
	const [info, setInfo] = useState({
		limit: 20,
		page: 1,
		loading: true,
		promptPopupOpen: false,
		selectedCard: null,
		tenantUsers: [],
		taskMetadata: null,
		createTaskPopup: false,
		selectedSubTask: null,
		updated: false,
		listItems: [],
		taskPreferences: {
			preferenceType: 'taskPreference',
			preferences: defaultPreference,
		},
		group: null,
	});
	const { role, accessControls = [] } = tenantUserAccessControls || {};

	useEffect(() => {
		setInfo((prev) => ({ ...prev, loading: true }));
		getTasksList(1);
	}, [location.pathname, clientId]);

	useEffect(() => {
		if (listTasks) {
			if (listTasks?.data) {
				setInfo((prevInfo) => {
					// Reset listItems when clientId changes or on first load
					const shouldReset = prevInfo?.page === 1 || !prevInfo?.listItems?.length;
					const newTasks = shouldReset ? listTasks?.data : prevInfo?.listItems;

					// Calculate client-specific pending tasks only for contact page
					if (isContactPage && onTaskCountUpdate) {
						const clientPendingTasks =
							listTasks?.data?.filter(
								(task) =>
									task?.clients?.some((client) => client?._id === clientId) &&
									!task?.status?.includes('completed'),
							).length || 0;
						onTaskCountUpdate(clientPendingTasks);
					}

					return {
						...prevInfo,
						listItems: newTasks,
						hasMore: listTasks?.hasNextPage && listTasks?.data?.length > 0,
						loading: false,
						infinityLoading: false,
					};
				});
			}
		}
		if (listTasks?.error) {
			setInfo((prevInfo) => ({
				...prevInfo,
				loading: false,
				infinityLoading: false,
				error: listTasks?.error,
				hasMore: false,
			}));
		}
	}, [listTasks, clientId, onTaskCountUpdate, isContactPage]);

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
			clients: {
				type: 'personMultiSelect',
				name: 'Clients',
				Icon: PersonSvg,
				props: {},
			},
		}),
		[info?.tenantUsers, info?.taskMetadata],
	);

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
		if (!taskMetadata) {
			getTaskMetadata();
		} else {
			setInfo((prevInfo) => ({
				...prevInfo,
				taskMetadata: taskMetadata,
			}));
		}
	}, [taskMetadata]);

	const addNewTask = useCallback(
		async (payload) => {
			if (validateExpiryData?.restrictTasks && validateExpiryData?.isExpired) {
				return updateSubscriptionState({
					expiredSubscriptionModal: true,
					expiredSubscriptionType: 'Tasks',
				});
			}

			const isSubtask = info?.isCreatingSubtask;
			const selectedRow = info?.selectedRow;

			if (isSubtask) {
				payload.parentTaskId = selectedRow?._id;
			}

			const response = await addListItem({ input: payload });
			if (!response?.createTask) {
				throw new Error('Failed to add new task');
			}

			const task = response.createTask;
			const token = localStorage.getItem('usertoken');
			const { user_id, userName } = jwtDecode(token);
			const newTask = {
				...task,
				createdBy: { _id: user_id, name: userName },
			};

			if (isSubtask) {
				newTask.parentTask = {
					title: selectedRow?.title,
					_id: selectedRow?._id,
				};
				addSubTask(newTask);
			} else {
				if (payload?.assignedTo || payload?.dueDate) {
					updateTaskState({
						refetchTasksForDue: true,
						listTasksForToday: null,
						listTasksForOverdue: null,
						listTasksDueTillToday: null,
					});
				}
			}

			message.success('Task added successfully');
			updateTaskState({ refetchTasks: true });
		},
		[info?.isCreatingSubtask, info?.selectedRow?._id],
	);

	const mapFiltersPayload = useCallback((filters) => {
		return filters?.map((filter) => ({
			key: filter.key,
			value:
				typeof filter.value === 'object'
					? filter?.value?._id || filter?.value?.value
					: filter?.value,
		}));
	}, []);

	const updateTaskInfo = useCallback((updateData) => {
		if (updateData?.taskPreferences) {
			updateTaskPreferences({
				preferenceType: updateData?.taskPreferences?.preferenceType,
				data: updateData?.taskPreferences?.preferences,
			});
		}
		setInfo((previnfo) => ({ ...previnfo, ...updateData }));
	}, []);

	const getTasksList = async (page) => {
		try {
			// Only set loading to true if it's the first page
			if (page === 1) {
				setInfo((prev) => ({ ...prev, loading: true }));
			}
			const response = await getListItems({
				taskFilterInput: {
					limit: 20,
					page,
					filters: clientId
						? [
								{
									key: 'clients',
									value: clientId,
								},
						  ]
						: [],
				},
			});

			if (response?.[0]) {
				const taskData = response?.[1]?.data?.listTasks;
				setInfo((prev) => ({
					...prev,
					listItems:
						page === 1
							? taskData?.data || []
							: [...prev.listItems, ...(taskData?.data || [])],
					hasNextPage: taskData?.hasNextPage || false,
					page: taskData?.currentPage + 1,
					loading: false,
					infinityLoading: false,
					error: null,
				}));
			} else {
				setInfo((prev) => ({
					...prev,
					loading: false,
					infinityLoading: false,
					error: 'Failed to fetch tasks',
				}));
			}
		} catch (error) {
			setInfo((prev) => ({
				...prev,
				loading: false,
				infinityLoading: false,
				error: error.message,
			}));
		}
	};

	// Add useEffect to reset and refetch tasks when clientId changes
	useEffect(() => {
		if (clientId) {
			setInfo((prev) => ({
				...prev,
				loading: true,
				page: 1,
				listItems: [], // Reset listItems when clientId changes
				hasNextPage: false,
			}));
			getTasksList(1);
		}
	}, [clientId]);

	// Update fetchMoreData to handle client filtering
	const fetchMoreData = useCallback(() => {
		if (info?.hasNextPage && !info?.loading && !info?.infinityLoading) {
			setInfo((prev) => ({ ...prev, infinityLoading: true }));
			getTasksList(info?.page);
		}
	}, [info?.hasNextPage, info?.loading, info?.infinityLoading, info?.page]);

	const handlePromptPopup = (item) => {
		setInfo((prev) => ({ ...prev, promptPopupOpen: true, selectedCard: item }));
	};

	const handleTaskClick = (tasks) => {
		updateSideBarData({ data: tasks, open: true, replace: true });
	};

	const handleModalClose = () => {
		updateSideBarData({ open: false });
	};
	const handleCreateTaskPopup = () => {
		if (!accessControlCheck('task')) return;
		setInfo((prev) => ({
			...prev,
			createTaskPopup: true,
		}));
	};
	const handleCloseTaskPopup = () => {
		setInfo((prev) => ({
			...prev,
			createTaskPopup: false,
		}));
	};

	const fetchListItems = useCallback(
		(page = 1) => {
			if (info?.group) {
				getListTaskWithGroup({
					taskFilterInput: {
						limit: 20,
						page: page,
						sort:
							info?.sort?.length > 0
								? info?.sort?.map((item) => ({
										sortBy: item?.sortBy,
										sortType: item?.sortType,
								  }))
								: [{ sortBy: 'createdAt', sortType: 1 }],
						filters: [
							...(info?.filters || []),
							...(clientId ? [{ key: 'clients', value: clientId }] : []),
						],
						search: info?.searchValue,
						group: info?.group,
					},
				});
			} else {
				getListItems({
					taskFilterInput: {
						limit: 20,
						page: page,
						sort:
							info?.sort?.length > 0
								? info?.sort?.map((item) => ({
										sortBy: item?.sortBy,
										sortType: item?.sortType,
								  }))
								: [{ sortBy: 'createdAt', sortType: 1 }],
						filters: [
							...(info?.filters || []),
							...(clientId ? [{ key: 'clients', value: clientId }] : []),
						],
						search: info?.searchValue,
					},
				});
			}
			setInfo((prevInfo) => ({
				...prevInfo,
				page: page,
			}));
		},
		[info?.sort, info?.filters, info?.searchValue, info?.group, clientId],
	);

	const debouncedUpdateTask = useCallback(
		async (rowId, propName, value, originalValue, isUpdatingSubTask, onSuccess) => {
			try {
				if (propName === 'clients') {
					value = value?.map((client) => client?._id);
				}
				const response = await updateListItem({
					taskId: rowId,
					updateInput: {
						[propName]: propName === 'assignedTo' ? { tenantUsers: value } : value,
					},
				});

				if (response?.[0] === false) {
					throw new Error('Failed to update, Try again later');
				} else {
					// Update state only after successful API call
					if (onSuccess) onSuccess();
					const token = localStorage.getItem('usertoken');
					const { user_id, userName } = jwtDecode(token);
					// Handle assignedTo special case
					if (propName === 'assignedTo') {
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
								const newListItems = prevInfo?.listItems?.map((row) => {
									if (row?._id === rowId) {
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
					if (!isUpdatingSubTask) {
						if (propName === 'assignedTo' || propName === 'dueDate') {
							updateTaskState({
								refetchTasksForDue: true,
								listTasksForToday: null,
								listTasksForOverdue: null,
								listTasksDueTillToday: null,
							});
						}
					}

					setInfo((prevInfo) => {
						const newListItems = prevInfo?.listItems?.map((row) => {
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
				if (!info?.isModalOpen) {
					fetchListItems();
				}
			} catch (error) {
				message.error(error?.message || 'Something went wrong! Please try again.');

				setInfo((prevInfo) => {
					const rolledBackListItems = prevInfo?.listItems?.map((row) => {
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
		[updateListItem, info?.selectedSubTask, info?.isModalOpen],
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
				return updateSubscriptionState({
					expiredSubscriptionModal: true,
					expiredSubscriptionType: 'Tasks',
				});
			}
			let originalValue;
			let updatedValue = value;

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
					const updatedListItems = prevInfo?.listItems?.map((row) => {
						if (row?._id === rowId) {
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

	const deleteTask = useCallback(
		async (payload) => {
			if (
				validateExpiryData &&
				validateExpiryData?.restrictTasks &&
				validateExpiryData?.isExpired
			) {
				return updateSubscriptionState({
					expiredSubscriptionModal: true,
					expiredSubscriptionType: 'Tasks',
				});
			} else {
				const response = await deleteListItem(payload);
				if (response) {
					if (info?.selectedSubTask?._id === payload?.taskId) {
						updateTaskInfo({ selectedSubTask: null });
						removeSubTask(payload?.taskId);
					} else {
						updateTaskState({
							refetchTasksForDue: true,
							listTasksForToday: null,
							listTasksForOverdue: null,
							listTasksDueTillToday: null,
						});
						setInfo((prevInfo) => ({
							...prevInfo,
							listItems: prevInfo?.listItems?.filter(
								(row) => row._id !== payload?.taskId,
							),
							isModalOpen: false,
							selectedRow: null,
						}));
					}
				}
			}
		},
		[info?.selectedSubTask?._id, removeSubTask],
	);

	const handleCreateSubTaskClick = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			createTaskPopup: true,
			isCreatingSubtask: true,
		}));
		updateSideBarData({ open: false });
	}, []);

	return (
		<div className="task-main-container" style={{ width: width, height: height }}>
			<div className="taskGlobalWidgetContainer">
				<div className="taskWidgetBody">
					<div className="taskWidgetBodyHeader">
						<div className="taskWidgetBodyHeaderLeft">
							<span className="taskWidgetDay">
								{isContactPage
									? info?.listItems?.filter(
											(task) => !task?.status?.includes('completed'),
									  ).length
									: listTasks?.analytics?.allPending || 0}
							</span>
							<span className="taskWidgetRemainder">Pending Tasks</span>
						</div>
						{/* <div className="taskWidgetBodyHeaderRight">
							<div className="taskWidgetDaysFilter">
								<span>Today</span>
								<DownArrowIcon />
							</div>
							<FiltersIcon />
						</div> */}
					</div>
					<div
						className="taskWidgetBodyContainer"
						style={{ maxHeight: isContactPage ? '400px' : '380px' }}
						id="taskWidgetBodyContainer"
					>
						{info.loading ? (
							skeletonLoaders?.map((_, index) => (
								<Skeleton
									width="390px"
									height="36px"
									style={{
										'--highlight-color': 'gray',
										'--base-color': 'transparent',
									}}
									key={index}
								/>
							))
						) : info?.listItems?.length === 0 ? (
							<div
								className="taskWidgetEmptyState"
								style={{ fontSize: '12px', alignSelf: 'center' }}
							>
								No tasks found. Create a new one!
							</div>
						) : (
							<InfiniteScroll
								dataLength={info?.listItems?.length || 0}
								hasMore={info?.hasNextPage}
								next={fetchMoreData}
								loader={<FetchMoreLoaderComp />}
								scrollableTarget="taskWidgetBodyContainer"
								scrollThreshold={0.8}
								// endMessage={
								// 	<div
								// 		className="taskWidgetEmptyState"
								// 		style={{ fontSize: '12px', alignSelf: 'center' }}
								// 	>
								// 		No more tasks to load
								// 	</div>
								// }
							>
								<div className="taskWidgetOptionsContainer">
									{info?.listItems
										?.sort((a, b) => {
											// Sort overdue tasks first
											const aIsOverdue =
												a?.dueDate &&
												moment.unix(a.dueDate).isBefore(moment(), 'day');
											const bIsOverdue =
												b?.dueDate &&
												moment.unix(b.dueDate).isBefore(moment(), 'day');
											if (aIsOverdue && !bIsOverdue) return -1;
											if (!aIsOverdue && bIsOverdue) return 1;

											// Then sort today's tasks
											const aIsToday =
												a?.dueDate &&
												moment.unix(a.dueDate).isSame(moment(), 'day');
											const bIsToday =
												b?.dueDate &&
												moment.unix(b.dueDate).isSame(moment(), 'day');
											if (aIsToday && !bIsToday) return -1;
											if (!aIsToday && bIsToday) return 1;

											return 0;
										})
										?.map((eachOption, index) => (
											<Fragment key={index}>
												{index === 0 &&
													eachOption?.dueDate &&
													moment
														.unix(eachOption.dueDate)
														.isSame(moment(), 'day') && (
														<div className="taskWidgetStatusContainer">
															<div className="taskWidgetStatusTitle">
																Today
															</div>
															<hr className="taskWidgetHr" />
														</div>
													)}
												<div
													className="taskWidgetOption"
													onClick={() => handleTaskClick(eachOption)}
												>
													<div className="taskWidgetOptionDetails">
														<div className="taskWidgetOptionTitle">
															{eachOption?.title}
														</div>
														<div className="taskWidgetOptionName">
															<Tooltip
																title={`Assigned By: ${eachOption?.assignedBy?.name}`}
															>
																<span className="taskWidgetOptionNameText">
																	{eachOption?.assignedBy?.name}
																</span>
															</Tooltip>
														</div>
													</div>
													{eachOption?.dueDate && (
														<>
															{moment
																.unix(eachOption.dueDate)
																.isBefore(moment(), 'day') && (
																<div className="taskWidgetDueNow overdue">
																	Over Due
																</div>
															)}
															{moment
																.unix(eachOption.dueDate)
																.isSame(moment(), 'day') && (
																<div className="taskWidgetDueNow">
																	Due Now
																</div>
															)}
														</>
													)}
												</div>
											</Fragment>
										))}
								</div>
							</InfiniteScroll>
						)}
					</div>
				</div>
			</div>
			<div
				className="taskWidgetFooter"
				onClick={() => {
					navigate('/tasks');
				}}
			>
				<div className="taskWidgetFooterTitle">
					<ArrowViewIcon />
					View Tasks
				</div>
				<div
					onClick={(e) => {
						e.stopPropagation();
						handleCreateTaskPopup();
					}}
					className="taskWidgetFooterAdd"
				>
					<PlusIcon
						style={{
							width: '18px',
							height: '18px',
						}}
					/>
				</div>
			</div>
			<ListViewSidebar
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
				prefix={info?.taskMetadata?.prefix}
				groupBy={info?.group}
				sidebarChildren={
					<ChildTaskComponent
						completedStatus={info?.taskMetadata?.completedGroupLabels}
						rowTypes={rowTypes}
						responseMetadata={responseMetadata}
						colors={colors}
						properties={info?.properties}
						onAddButtonClick={handleCreateSubTaskClick}
						handleUpdate={(...args) => updatePropertyValue(...args, true)}
					/>
				}
			/>
			<CreateTaskPopup
				isOpen={info?.createTaskPopup}
				closeModal={() => handleCloseTaskPopup()}
				responseMetadata={responseMetadata}
				colors={colors}
				addNewTask={addNewTask}
				isSubTask={info?.isCreatingSubtask}
				defaultClient={clientId}
			/>
		</div>
	);
};

export default memo(TaskWidget);
