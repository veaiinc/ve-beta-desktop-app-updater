/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ListView from '../../components/tasks/listView/ListView';
// import { ReactComponent as ClockSvg } from '../../../assets/svg/activity/clock.svg';
// import { ReactComponent as PieSvg } from '../../../assets/svg/tasks/pieHollow.svg';
// import { ReactComponent as PrioritySvg } from '../../../assets/svg/tasks/roundChevronRight.svg';
// import { ReactComponent as WorkflowSvg } from '../../../assets/svg/tasks/workflow.svg';
// import { ReactComponent as PersonSvg } from '../../../assets/svg/tasks/person.svg';
import { ReactComponent as CalendarSvg } from '../../../assets/svg/tasks/calendar.svg';
import { ReactComponent as textSvg } from '../../../assets/svg/tasks/letterA.svg';
import Context from '../../../context/context';
import CreateLeadModal from '../../components/modalsV2/proposalModals/CreateLeadModal';
import CreateClientModal from '../../components/modalsV2/contacts/CreateClientModal';
import { message } from 'antd';
import ChildTaskComponent from '../../components/tasks/listView/ChildTaskComponent';
import Select from '../../components/tasks/listView/Select';
import Person from '../../components/tasks/listView/Person';
import MultiSelect from '../../components/tasks/listView/MultiSelect';
import DateView from '../../components/tasks/listView/DateView';
import TaskId from '../../components/tasks/listView/TaskId';
import Status from '../../components/tasks/listView/Status';
import Priority from '../../components/tasks/listView/Priority';
import Email from '../../components/tasks/listView/Email';
import Phone from '../../components/tasks/listView/Phone';
import Url from '../../components/tasks/listView/Url';
import CheckBox from '../../components/tasks/listView/CheckBox';
import WorkFlow from '../../components/tasks/listView/WorkFlow';
import ParentTaskComponent from '../../components/tasks/listView/ParentTaskComponent';
import ChildTaskProgress from '../../components/tasks/listView/ChildTaskProgress';
import LinkText from '../../components/tasks/listView/LinkText';
import Text from '../../components/tasks/listView/Text';
import ListTabs from '../../components/tasks/listView/ListTabs';

// import { message } from 'antd';
// import jwtDecode from 'jwt-decode';
// import moment from 'moment';

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

const colors = {
	1: { backgroundColor: '#62344B', color: '#A35A7E' },
	2: { backgroundColor: '#373737', color: '#707070' },
	3: { backgroundColor: '#5B3D2F', color: '#8F614B' },
	4: { backgroundColor: '#7D4F27', color: '#B37339' },
	5: { backgroundColor: '#375841', color: '#588F69' },
	6: { backgroundColor: '#2F4469', color: '#4F71B3' },
	7: { backgroundColor: '#453061', color: '#6F4C99' },
};

const ClientListView = () => {
	const {
		templates: { getClientList, clientList, workflows, getWorkflowsList },
		contacts: { refetchClientList, updateStateValues, deleteClient, updateClient },
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
	} = useContext(Context);

	const [info, setInfo] = useState({
		listItems: [],
		isOptionsDropDownOpen: false,
		isCreateModalOpen: false,
		properties: [],
		sidebarIsOpen: false,
		selectedRow: null,
		page: 1,
		hasMore: false,
		loadingSkeleton: true,
		error: null,
		sort: [],
		filters: [],
		searchValue: '',
		updated: false,
		isSidebarExpanded: false,
	});

	const responseMetadata = useMemo(
		() => ({
			name: {
				type: 'text',
				name: 'Name',
				Icon: textSvg,
				doSplit: true,
				isTitle: true,
				props: {},
			},
			email: {
				type: 'linkText',
				name: 'Email',
				Icon: textSvg,
				doSplit: false,
				props: { linkType: 'email' },
			},
			phoneNumber: {
				type: 'linkText',
				name: 'Phone Number',
				Icon: textSvg,
				doSplit: false,
				props: { linkType: 'phone' },
			},
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
		}),
		[],
	);

	const tabs = useMemo(() => {
		return {
			reqActions: { label: 'Req Actions', Component: <div>Request Actions</div> },
			workflows: { label: 'Workflows', Component: <div>Workflows</div> },
			files: { label: 'Files', Component: <div>Files</div> },
			payments: { label: 'Payments', Component: <div>Payments</div> },
			activity: { label: 'Activity', Component: <div>Activity</div> },
		};
	}, []);

	const filterDebounceTimeout = useRef(null);

	useEffect(() => {
		if (filterDebounceTimeout.current) {
			clearTimeout(filterDebounceTimeout.current);
		}

		if (info?.filters || info?.searchValue) {
			filterDebounceTimeout.current = setTimeout(() => {
				updateListViewInfo('loadingSkeleton', true);
				fetchListItems();
			}, 800);
		} else {
			updateListViewInfo('loadingSkeleton', true);
			fetchListItems();
		}

		return () => {
			if (filterDebounceTimeout.current) {
				clearTimeout(filterDebounceTimeout.current);
			}
		};
	}, [info?.page, info?.sort, info?.filters, info?.searchValue]);

	useEffect(() => {
		if (refetchClientList) {
			fetchListItems();
			updateStateValues({ refetchClientList: false });
		}
	}, [refetchClientList]);

	useEffect(() => {
		if (clientList) {
			setInfo((prevInfo) => ({
				...prevInfo,
				listItems: clientList?.data,
				hasMore: clientList?.hasNextPage,
				loadingSkeleton: false,
			}));
		} else {
			fetchListItems();
		}
	}, [clientList]);

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
		getClientList({
			filters: {
				limit: 20,
				page: info?.page,
				// sort: info?.sort.length > 0 ? info?.sort : [{ sortBy: 'createdAt', sortType: 1 }],
				// filters: mapFiltersPayload(info?.filters),
				// search: info?.searchValue,
			},
		});
	}, [info?.page, info?.sort, info?.filters, info?.searchValue]);

	// const mapFiltersPayload = useCallback((filters) => {
	// 	return filters.map((filter) => ({
	// 		key: filter.key,
	// 		value:
	// 			typeof filter.value === 'object'
	// 				? filter?.value?._id || filter?.value?.value
	// 				: filter?.value,
	// 	}));
	// }, []);

	const updateListViewInfo = useCallback((key, value) => {
		setInfo((previnfo) => ({ ...previnfo, [key]: value }));
	}, []);

	const mapPropertyType = useCallback(() => {
		let properties = [];
		for (let key in responseMetadata) {
			if (
				key === '__typename' ||
				key === '_id'
				// key === 'workflowTemplateId' ||
				// key === 'completedAt'
			) {
				continue;
			}

			const {
				type = null,
				name = null,
				Icon = null,
				isTitle = false,
			} = responseMetadata[key];

			properties.push({
				value: key,
				type,
				label: name,
				Icon,
				show: true,
				isTitle,
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
		async (rowId, propName, value, isUpdatingSubTask, onSuccess) => {
			if (validateExpiryData?.isExpired) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			} else {
				const response = await updateClient({
					updateClientId: rowId,
					updateClientInput: {
						[propName]: value,
					},
				});
				if (response?.[0]) {
					fetchListItems();
				} else {
					message?.error(response?.[1]);
				}
				if (onSuccess) {
					onSuccess(response?.[0]);
				}
			}
		},
		[],
	);

	const handleDeleteClient = useCallback(async (payload) => {
		if (validateExpiryData?.isExpired) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		} else {
			const response = await deleteClient({ deleteClientId: payload?.taskId });
			if (response?.[0]) {
				setInfo((prevInfo) => ({
					...prevInfo,
					selectedRow: null,
					sidebarIsOpen: false,
				}));
				message?.success('Client deleted successfully');
				fetchListItems();
			} else {
				message?.error(response?.[1]);
			}
		}
	}, []);

	return (
		<div>
			<ListView
				info={info}
				updateListViewInfo={updateListViewInfo}
				togglePropertyVisibility={togglePropertyVisibility}
				updatePropertyValue={updatePropertyValue}
				deleteTask={handleDeleteClient}
				responseMetadata={responseMetadata}
				fetchListItems={fetchListItems}
				addButtonOnClick={() => {
					updateListViewInfo('isCreateModalOpen', true);
				}}
				headerTitle={'Contacts'}
				createButtonText={'Create Client'}
				sidebarChildren={<ListTabs tabs={tabs} defaultActiveTab={'reqActions'} />}
			/>
			<CreateClientModal
				modalIsOpen={info?.isCreateModalOpen}
				closeModal={() => {
					updateListViewInfo('isCreateModalOpen', false);
				}}
			/>
		</div>
	);
};

export default memo(ClientListView);
