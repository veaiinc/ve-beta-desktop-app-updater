import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import '../../../../assets/scss/tasks/listView.scss';
import Text from './Text';
import Id from './Id';
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

const rowTypes = {
	text: Text,
	select: Select,
	person: Person,
	'multi-select': MultiSelect,
	date: DateView,
	id: Id,
	status: Status,
	priority: Priority,
	email: Email,
	phone: Phone,
	url: Url,
	checkbox: CheckBox,
	workflow: WorkFlow,
};

const responseTypes = {
	title: 'text',
	description: 'text',
	status: 'status',
	priority: 'priority',
	workflowTemplateId: 'text',
	workflowId: 'workflow',
	client: 'person',
	assignedTo: 'person',
	dueDate: 'date',
	assignedBy: 'person',
	assignedAt: 'date',
	completedAt: 'date',
	createdAt: 'date',
	updatedAt: 'date',
	createdBy: 'person',
	updatedBy: 'person',
	serialNumber: 'id',
};

const ListView = () => {
	const {
		tasks: { listTasks, getListItems, addListItem, updateListItem, deleteListItem, getTask },
		templates: { getTemplatesListForCreateLead, templatesListForCreateLead },
		companyInfo: { getTeamMembers, tenantsUserList },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);

	const [info, setInfo] = useState({
		listItems: [],
		isOptionsDropDownOpen: false,
		isCreateModalOpen: false,
		properties: [],
		sidebarIsOpen: false,
		selectedRow: null,
		workflows: [],
		tenantUsers: [],
		clients: [],
		page: 1,
		hasMore: false,
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
		getTemplatesListForCreateLead();
		getTeamMembers();
	}, [info?.page]);

	useEffect(() => {
		if (listTasks) {
			// Get unique tasks by _id to avoid duplicates
			const uniqueTasks = [
				...new Map(
					[...info.listItems, ...listTasks.data].map((task) => [task._id, task]),
				).values(),
			];

			setInfo((prevInfo) => ({
				...prevInfo,
				listItems: uniqueTasks,
				properties: mapPropertyType(listTasks?.data?.[0]),
				hasMore: listTasks?.hasNextPage,
			}));
		}
	}, [listTasks]);

	useEffect(() => {
		if (templatesListForCreateLead) {
			setInfo((prevInfo) => ({
				...prevInfo,
				workflows: templatesListForCreateLead?.data || [],
			}));
		}
	}, [templatesListForCreateLead]);

	useEffect(() => {
		if (tenantsUserList) {
			const persons = tenantsUserList?.map((person) => ({
				label: person.firstName + ' ' + person.lastName,
				value: person._id,
			}));
			setInfo((prevInfo) => ({
				...prevInfo,
				tenantUsers: persons,
			}));
		}
	}, [tenantsUserList]);

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

	const mapPropertyType = useCallback((row) => {
		let properties = [];
		for (let key in row) {
			if (key === '__typename' || key === '_id' || key === 'workflowTemplateId') {
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

	const updatePropertyValue = useCallback(
		(rowId, propName, value) => {
			if (validateExpiryData?.isExpired) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			} else {
				setInfo((prevInfo) => {
					const updatedListItems = prevInfo.listItems.map((row) => {
						if (row._id === rowId) {
							return { ...row, [propName]: value };
						}
						return row;
					});

					return {
						...prevInfo,
						listItems: updatedListItems,
					};
				});

				// Debounce the API call
				if (debounceTimeout.current) {
					clearTimeout(debounceTimeout.current);
				}

				debounceTimeout.current = setTimeout(async () => {
					try {
						const response = await updateListItem({
							taskId: rowId,
							updateInput: { [propName]: value },
						});
					} catch (error) {
						console.error('Failed to update:', error);

						// Rollback state if API fails
						setInfo((prevInfo) => {
							const rolledBackListItems = prevInfo.listItems.map((row) => {
								if (row._id === rowId) {
									return { ...row, [propName]: row[propName] }; // Reset to original value
								}
								return row;
							});

							return {
								...prevInfo,
								listItems: rolledBackListItems,
							};
						});
					}
				}, 800); // Adjust debounce delay as needed
			}
		},
		[updateListItem],
	);

	const addNewTask = useCallback(async (payload) => {
		if (false) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		} else {
			const response = await addListItem({ input: payload });
			if (response) {
				const task = await getTask({ taskId: response?.createTask?._id });
				if (task) {
					setInfo((prevInfo) => ({
						...prevInfo,
						listItems: [...prevInfo?.listItems, task?.getTask],
					}));
				}
			} else {
				throw new Error('Failed to add new task');
			}
		}
	}, []);

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
			<ListViewHeader
				updateListViewInfo={updateListViewInfo}
				properties={info?.properties}
				togglePropertyVisibility={togglePropertyVisibility}
			/>
			<div className="listContainer">
				<div className="listInnerContainer">
					{info?.listItems?.length !== 0 ? (
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
			/>
		</div>
	);
};

export default memo(ListView);
