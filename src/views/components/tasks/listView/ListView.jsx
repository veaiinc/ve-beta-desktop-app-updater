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
	title: { type: 'text', name: 'Title' },
	description: { type: 'text', name: 'Description' },
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
	taskSlNo: { type: 'id', name: 'Id' },
};

const ListView = () => {
	const {
		tasks: { listTasks, getListItems, addListItem, updateListItem, deleteListItem },
		templates: { getWorkflowsList, workflowslist },
		companyInfo: { getTeamMembers, tenantsUserList },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);
	const [messageApi, contextHolder] = message.useMessage();

	const [info, setInfo] = useState({
		listItems: [],
		isOptionsDropDownOpen: false,
		isCreateModalOpen: false,
		properties: [],
		sidebarIsOpen: false,
		selectedRow: null,
		workflows: [],
		tenantUsers: [],
		page: 1,
		hasMore: false,
		loadingSkeleton: true,
		error: null,
	});

	const debounceTimeout = useRef(null);

	useEffect(() => {
		getListItems({
			filters: {
				limit: 30,
				page: info?.page,
				sortBy: 'createdAt',
				sortType: 1,
			},
		});
	}, [info?.page]);

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
					value: _id,
					templateId,
				})),
			}));
		}
	}, [workflowslist]);

	useEffect(() => {
		if (listTasks) {
			if (listTasks?.data) {
				// Get unique tasks by _id to avoid duplicates
				const uniqueTasks = [
					...new Map(
						[...info?.listItems, ...listTasks.data].map((task) => [task._id, task]),
					).values(),
				];

				setInfo((prevInfo) => ({
					...prevInfo,
					listItems: uniqueTasks,
					properties: mapPropertyType(listTasks?.data?.[0]),
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
		if (info?.selectedRow) {
			updateListViewInfo(
				'selectedRow',
				info?.listItems.find((item) => item._id === info?.selectedRow._id),
			);
		}
	}, [info?.listItems, info?.selectedRow]);

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

	const mapPropertyType = useCallback((row) => {
		let properties = [];
		for (let key in row) {
			if (
				key === '__typename' ||
				key === '_id' ||
				key === 'workflowTemplateId' ||
				key === 'completedAt'
			) {
				continue;
			}

			properties.push({
				propName: key,
				type: responseTypes[key],
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
		async (rowId, propName, value, originalValue) => {
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
										propName === 'assignedTo'
											? typeof value === 'object'
												? { userId: value.value }
												: value
											: value,
							  },
				});

				if (response?.[0] === false) {
					throw new Error('Failed to update, Try again later');
				} else {
					if (propName === 'assignedTo') {
						setInfo((prevInfo) => {
							const token = localStorage.getItem('usertoken');
							const { user_id, userName } = jwtDecode(token);
							const newListItems = prevInfo.listItems.map((row) => {
								if (row._id === rowId) {
									return { ...row, assignedBy: { _id: user_id, name: userName } };
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
		(rowId, propName, value, originalValue) => {
			if (debounceTimeout.current) {
				clearTimeout(debounceTimeout.current);
			}

			debounceTimeout.current = setTimeout(() => {
				debouncedUpdateTask(rowId, propName, value, originalValue);
			}, 800);
		},
		[debouncedUpdateTask],
	);

	const updatePropertyValue = useCallback(
		(rowId, propName, value) => {
			if (validateExpiryData?.isExpired) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			}

			let originalValue;
			setInfo((prevInfo) => {
				const updatedListItems = prevInfo.listItems.map((row) => {
					if (row._id === rowId) {
						originalValue = row[propName];
						return { ...row, [propName]: value };
					}
					return row;
				});

				return {
					...prevInfo,
					listItems: updatedListItems,
				};
			});

			handleDebounceUpdate(rowId, propName, value, originalValue);
		},
		[validateExpiryData?.isExpired, updateSubscriptionState, debouncedUpdateTask],
	);

	const addNewTask = useCallback(
		async (payload) => {
			if (validateExpiryData?.isExpired) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			} else {
				const response = await addListItem({ input: payload });
				if (response) {
					const task = response?.createTask;

					if (task) {
						const token = localStorage.getItem('usertoken');
						const { user_id, userName } = jwtDecode(token);

						const newTask = { ...task };
						// console.log(payload?.workflowId, 'payload?.workflowId', info?.workflows);
						const newWorkflow = info?.workflows?.find(
							(workflow) => workflow.value === payload?.workflowId,
						);

						newTask.workflow = newWorkflow
							? { _id: newWorkflow.value, title: newWorkflow.label }
							: null;

						newTask.workflowId = null;
						newTask.createdBy = { _id: user_id, name: userName };
						newTask.updatedBy = { _id: user_id, name: userName };
						setInfo((prevInfo) => ({
							...prevInfo,
							listItems: [...prevInfo?.listItems, newTask],
						}));
					}
				} else {
					throw new Error('Failed to add new task');
				}
			}
		},
		[info?.workflows],
	);

	const deleteTask = useCallback(async (payload) => {
		if (validateExpiryData?.isExpired) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		} else {
			const response = await deleteListItem(payload);
			if (response) {
				setInfo((prevInfo) => ({
					...prevInfo,
					listItems: prevInfo?.listItems?.filter((row) => row._id !== payload?.taskId),
					sidebarIsOpen: false,
					selectedRow: null,
				}));
			}
		}
	}, []);

	const handleRowClick = useCallback(
		(rowId) => {
			const row = info?.listItems?.find((row) => row._id === rowId);
			if (row) {
				updateListViewInfo('selectedRow', row);
				updateListViewInfo('sidebarIsOpen', true);
			}
		},
		[info?.listItems],
	);

	return (
		<div className="listViewParentContainer">
			{contextHolder}
			<ListViewHeader
				updateListViewInfo={updateListViewInfo}
				properties={info?.properties}
				togglePropertyVisibility={togglePropertyVisibility}
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
				closeModal={() => updateListViewInfo('isCreateModalOpen', false)}
				addNewTask={addNewTask}
				workflows={info?.workflows}
				tenantUsers={info?.tenantUsers}
				clients={info?.clients}
			/>
			<ListViewSidebar
				selectedRow={info?.selectedRow}
				sidebarIsOpen={info?.sidebarIsOpen}
				closeSidebar={() => updateListViewInfo('sidebarIsOpen', false)}
				updatePropertyValue={updatePropertyValue}
				workflows={info?.workflows}
				tenantUsers={info?.tenantUsers}
				deleteTask={deleteTask}
				responseTypes={responseTypes}
				rowTypes={rowTypes}
				clients={info?.clients}
			/>
		</div>
	);
};

export default memo(ListView);
