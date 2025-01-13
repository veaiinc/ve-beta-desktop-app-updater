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
import TabListFile from '../../components/tasks/listView/TabListFile';
import Sidebar from '../../components/docs/Sidebar';

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
		showRightDrawer: false,
		activeFileData: null,
		refetchDocsFilesList: false,
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

	// useEffect(() => {
	// 	if (info?.filters?.length > 0 || info?.searchValue) {
	// 		setInfo((prev) => ({ ...prev, page: 1 }));
	// 		fetchClientList(1, true);
	// 	}
	// }, [info?.filters, info?.searchValue]);

	useEffect(() => {
		if (info?.sort?.length > 0 || info?.page > 1) {
			fetchClientList(info?.page, false);
		}
	}, [info?.page, info?.sort]);

	useEffect(() => {
		if (refetchClientList) {
			fetchClientList(info?.page, false);
			updateStateValues({ refetchClientList: false });
		}
	}, [refetchClientList]);

	useEffect(() => {
		if (!clientList) {
			fetchClientList(1, false);
		} else {
			setInfo((prevInfo) => ({
				...prevInfo,
				listItems: clientList?.data,
				hasMore: clientList?.hasNextPage,
				loadingSkeleton: false,
			}));
		}
	}, []);

	useEffect(() => {
		if (clientList) {
			setInfo((prevInfo) => ({
				...prevInfo,
				listItems: clientList?.data,
				hasMore: clientList?.hasNextPage,
				loadingSkeleton: false,
			}));
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

	const filterDebounceTimeout = useRef(null);

	const updateListViewInfo = useCallback((key, value) => {
		setInfo((previnfo) => ({ ...previnfo, [key]: value }));
	}, []);

	const tabs = useMemo(() => {
		return {
			reqActions: { label: 'Req Actions', Component: <div>Required Actions</div> },
			workflows: { label: 'Workflows', Component: <div>Workflows</div> },
			files: {
				label: 'Files',
				Component: (
					<TabListFile
						rowTypes={rowTypes}
						colors={colors}
						handleRowClick={(data) => {
							console.log('data', data);
							setInfo((prev) => ({
								...prev,
								activeFileData: data,
								showRightDrawer: true,
								sidebarIsOpen: false,
							}));
						}}
						refetchDocsFilesList={info?.refetchDocsFilesList}
						updateListViewInfo={updateListViewInfo}
					/>
				),
			},
			payments: { label: 'Payments', Component: <div>Payments</div> },
			activity: { label: 'Activity', Component: <div>Activity</div> },
		};
	}, [rowTypes, colors, info?.refetchDocsFilesList]);

	const fetchClientList = useCallback(
		async (page = 1, shouldDebounce = false) => {
			try {
				if (filterDebounceTimeout.current) {
					clearTimeout(filterDebounceTimeout.current);
				}

				const fetchData = async () => {
					setInfo((prev) => ({
						...prev,
						loading: true,
						// loadingSkeleton: true,
					}));

					const payload = {
						filters: {
							limit: 20,
							page: page,
							// Include sort if exists
							...(info?.sort?.length > 0 && {
								sortBy: info.sort[0].sortBy,
								sortType: info.sort[0].sortType,
							}),
							// Include search if exists
							...(info?.searchValue && {
								search: info.searchValue,
							}),
							// Include filters if exists
							...(info?.filters?.length > 0 && {
								filters: info.filters.map((filter) => ({
									key: filter.key,
									value: filter.value?._id || filter.value,
								})),
							}),
						},
					};

					await getClientList(payload);
				};

				if (shouldDebounce) {
					filterDebounceTimeout.current = setTimeout(fetchData, 800);
				} else {
					await fetchData();
				}
			} catch (error) {
				setInfo((prev) => ({
					...prev,
					error: error.message || 'Failed to fetch clients',
					loading: false,
					loadingSkeleton: false,
				}));
			}
		},
		[getClientList, info?.sort, info?.searchValue, info?.filters],
	);

	const fetchMoreData = useCallback(() => {
		fetchClientList(info?.page + 1, false);
		setInfo((prevInfo) => ({
			...prevInfo,
			page: info?.page + 1,
		}));
	}, [info?.page]);

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
					fetchClientList();
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
				fetchClientList();
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
				fetchListItems={fetchMoreData}
				addButtonOnClick={() => {
					updateListViewInfo('isCreateModalOpen', true);
				}}
				headerTitle={'Contacts'}
				createButtonText={'Create Client'}
				sidebarChildren={<ListTabs tabs={tabs} defaultActiveTab={'reqActions'} />}
				fetchMoreData={fetchClientList}
			/>
			<CreateClientModal
				modalIsOpen={info?.isCreateModalOpen}
				closeModal={() => {
					updateListViewInfo('isCreateModalOpen', false);
				}}
			/>
			<Sidebar
				open={info?.showRightDrawer}
				onClose={() => {
					setInfo((prev) => ({
						...prev,
						showRightDrawer: false,
						sidebarIsOpen: true,
						activeFileData: null,
					}));
				}}
				activeFileData={info?.activeFileData}
				refetchDocsFilesList={() => {
					setInfo((prev) => ({
						...prev,
						refetchDocsFilesList: true,
					}));
				}}
			/>
		</div>
	);
};

export default memo(ClientListView);
