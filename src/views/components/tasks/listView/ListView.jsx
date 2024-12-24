/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
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
import Context from '../../../../context/context';
import ListViewSidebar from '../../modalsV2/tasks/ListViewSidebar';
import WorkFlow from './WorkFlow';
import ListViewHeader from './ListViewHeader';
import ListViewRow from './ListViewRow';
import Skeleton from 'react-loading-skeleton';
import jwtDecode from 'jwt-decode';
import { message } from 'antd';
import TaskId from './TaskId';
import { ReactComponent as ClockSvg } from '../../../../assets/svg/activity/clock.svg';
import { ReactComponent as PieSvg } from '../../../../assets/svg/tasks/pieHollow.svg';
import { ReactComponent as PrioritySvg } from '../../../../assets/svg/tasks/roundChevronRight.svg';
import { ReactComponent as WorkflowSvg } from '../../../../assets/svg/tasks/workflow.svg';
import { ReactComponent as PersonSvg } from '../../../../assets/svg/tasks/person.svg';
import { ReactComponent as CalendarSvg } from '../../../../assets/svg/tasks/calendar.svg';
import { ReactComponent as textSvg } from '../../../../assets/svg/tasks/letterA.svg';
import moment from 'moment';

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

const responseTypes = {
	title: { type: 'text', name: 'Title', Icon: textSvg },
	description: { type: 'text', name: 'Description', Icon: textSvg },
	status: { type: 'status', name: 'Status', Icon: PieSvg },
	priority: { type: 'priority', name: 'Priority', Icon: PrioritySvg },
	workflow: { type: 'workflow', name: 'Workflow', Icon: WorkflowSvg },
	assignedTo: { type: 'person', name: 'Assigned To', Icon: PersonSvg },
	dueDate: { type: 'date', name: 'Due Date', Icon: ClockSvg },
	assignedBy: { type: 'person', name: 'Assigned By', Icon: PersonSvg },
	assignedAt: { type: 'date', name: 'Assigned At', Icon: ClockSvg },
	completedAt: { type: 'date', name: 'Completed At', Icon: CalendarSvg },
	createdAt: { type: 'date', name: 'Created At', Icon: CalendarSvg },
	updatedAt: { type: 'date', name: 'Updated At', Icon: CalendarSvg },
	createdBy: { type: 'person', name: 'Created By', Icon: PersonSvg },
	updatedBy: { type: 'person', name: 'Updated By', Icon: PersonSvg },
	taskSlNo: { type: 'id', name: 'Id', Icon: textSvg },
};

const ListView = () => {
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
		},
		templates: { getWorkflowsList, workflowslist },
		companyInfo: { getTeamMembers, tenantsUserList },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);
	const [messageApi, contextHolder] = message.useMessage();

	const [info, setInfo] = useState({
		listItems: [],
		isOptionsDropDownOpen: false,
		isCreateModalOpen: false,
		isCreatingSubtask: true,
		properties: [],
		sidebarIsOpen: false,
		selectedRow: null,
		selectedSubTask: null,
		workflows: [],
		tenantUsers: [],
		page: 1,
		hasMore: false,
		loadingSkeleton: true,
		error: null,
		sort: [],
		filters: [],
		searchValue: '',
	});

	const debounceTimeout = useRef(null);
	const filterDebounceTimeout = useRef(null);

	useEffect(() => {
		if (filterDebounceTimeout.current) {
			clearTimeout(filterDebounceTimeout.current);
		}

		if (info?.filters || info?.searchValue) {
			filterDebounceTimeout.current = setTimeout(() => {
				fetchListItems();
			}, 800);
		} else {
			fetchListItems();
		}

		return () => {
			if (filterDebounceTimeout.current) {
				clearTimeout(filterDebounceTimeout.current);
			}
		};
	}, [info?.page, info?.sort, info?.filters, info?.searchValue]);

	useEffect(() => {
		if (!tenantsUserList) {
			getTeamMembers();
		} else {
			setInfo((prevInfo) => ({
				...prevInfo,
				tenantUsers: tenantsUserList?.map(({ firstName, lastName, _id }) => ({
					label: `${firstName} ${lastName}`,
					value: _id,
				})),
			}));
		}
	}, [tenantsUserList]);

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
					hasMore: listTasks?.hasNextPage,
					loadingSkeleton: false,
				}));
			}
		}
		if (listTasks?.error) {
			setInfo((prevInfo) => ({
				...prevInfo,
				loadingSkeleton: false,
				error: listTasks?.error,
			}));
		}
	}, [listTasks]);

	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			properties: mapPropertyType(),
		}));
	}, []);

	useEffect(() => {
		if (info?.selectedRow) {
			updateListViewInfo(
				'selectedRow',
				info?.listItems.find((item) => item._id === info?.selectedRow._id),
			);
		}
	}, [info?.listItems, info?.selectedRow]);

	const fetchListItems = useCallback(() => {
		getListItems({
			taskFilterInput: {
				limit: 30,
				page: info?.page,
				sort: info?.sort.length > 0 ? info?.sort : [{ sortBy: 'createdAt', sortType: 1 }],
				filters: info?.filters,
				search: info?.searchValue,
			},
		});
	}, [info?.page, info?.sort, info?.filters, info?.searchValue]);

	const updateListViewInfo = useCallback((key, value) => {
		setInfo((previnfo) => ({ ...previnfo, [key]: value }));
	}, []);

	const generateSkeleton = useCallback(() => {
		return [...Array(6)].map((_, index) => (
			<div className="listItemSkeleton" key={index}>
				<Skeleton width="100%" height="38px" borderRadius="12px" />
			</div>
		));
	}, []);

	const mapPropertyType = useCallback(() => {
		let properties = [];
		for (let key in responseTypes) {
			if (
				key === '__typename' ||
				key === '_id' ||
				key === 'workflowTemplateId' ||
				key === 'completedAt'
			) {
				continue;
			}

			const { type = null, name = null, Icon = null } = responseTypes[key];

			properties.push({
				value: key,
				type,
				label: name,
				Icon,
				show: true,
			});
		}
		return properties;
	}, []);

	const togglePropertyVisibility = useCallback((index, value) => {
		setInfo((prevInfo) => {
			const newProperties = [...prevInfo?.properties];
			newProperties[index] = { ...newProperties[index], show: value };
			return {
				...prevInfo,
				properties: newProperties,
			};
		});
	}, []);

	const debouncedUpdateTask = useCallback(
		async (rowId, propName, value, originalValue, isUpdatingSubTask) => {
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
				}
			} catch (error) {
				messageApi.open({
					type: 'error',
					content: error?.message || 'Something went wrong! Please try again.',
				});

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
		[messageApi, updateListItem, info?.workflows],
	);

	const handleDebounceUpdate = useCallback(
		(rowId, propName, value, originalValue, isSubTask) => {
			if (debounceTimeout.current) {
				clearTimeout(debounceTimeout.current);
			}

			debounceTimeout.current = setTimeout(() => {
				debouncedUpdateTask(rowId, propName, value, originalValue, isSubTask);
			}, 800);
		},
		[debouncedUpdateTask],
	);

	const updatePropertyValue = useCallback(
		(rowId, propName, value, isUpdatingSubTask) => {
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
			if (validateExpiryData?.isExpired) {
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
							addSubTask(newTask);
						} else {
							setInfo((prevInfo) => ({
								...prevInfo,
								listItems: [...prevInfo?.listItems, newTask],
							}));
						}
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
			if (validateExpiryData?.isExpired) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			} else {
				const response = await deleteListItem(payload);
				if (response) {
					if (info?.selectedSubTask?._id === payload?.taskId) {
						updateListViewInfo('selectedSubTask', null);
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
		updateListViewInfo('sidebarIsOpen', false);
		updateListViewInfo('selectedSubTask', null);
	}, []);

	const handleChildTaskClose = useCallback(() => {
		updateListViewInfo('selectedSubTask', null);
	}, []);

	return (
		<div className="listViewParentContainer">
			{contextHolder}
			<ListViewHeader
				updateListViewInfo={updateListViewInfo}
				properties={info?.properties}
				togglePropertyVisibility={togglePropertyVisibility}
				sort={info?.sort}
				filters={info?.filters}
				responseTypes={responseTypes}
				workflows={info?.workflows}
				tenantUsers={info?.tenantUsers}
				searchValue={info?.searchValue}
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
								responseTypes={responseTypes}
								rowTypes={rowTypes}
								updatePropertyValue={updatePropertyValue}
								workflows={info?.workflows}
								tenantUsers={info?.tenantUsers}
								handleRowClick={handleRowClick}
								clients={info?.clients}
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
				workflows={info?.workflows}
				tenantUsers={info?.tenantUsers}
				deleteTask={deleteTask}
				responseTypes={responseTypes}
				rowTypes={rowTypes}
				handleCreateSubTaskClick={handleCreateSubTaskClick}
			/>
		</div>
	);
};

export default memo(ListView);
