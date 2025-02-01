/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ReactComponent as CalendarSvg } from '../../../assets/svg/tasks/calendar.svg';
import { ReactComponent as textSvg } from '../../../assets/svg/tasks/letterA.svg';
import Context from '../../../context/context';
import CreateClientModal from '../../components/modalsV2/contacts/CreateClientModal';
import { message } from 'antd';
import Sidebar from '../../components/docs/Sidebar';
import ListTabs from '../../components/tasks/listView/ListTabs';
import TabListFile from '../../components/tasks/listView/TabListFile';
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
import Task from '../../components/tasks/Task';
import ListViewSidebar from '../../components/modalsV2/tasks/ListViewSidebar';

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

const defaultPreference = {
	name: { show: true, order: 1 },
	email: { show: true, order: 2 },
	phoneNumber: { show: false, order: 3 },
	createdAt: { show: false, order: 4 },
	updatedAt: { show: false, order: 5 },
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
const Contacts = () => {
	const {
		// templates: { getClientList, clientList },
		contacts: {
			clientList,
			getClients,
			refetchClientList,
			updateStateValues,
			deleteClient,
			updateClient,
		},
		subscriptionInfo: { validateExpiryData, updateSubscriptionState },
		companyInfo: { getTaskPreferences, taskPreference, updateTaskPreferences },
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

		taskPreferences: {
			preferenceType: 'contactPreference',
			preferences: defaultPreference,
		},
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

	const filterDebounceTimeout = useRef(null);
	const isInitialMount = useRef(true);

	useEffect(() => {
		if (taskPreference === null) {
			getTaskPreferences({ preferences: 'contactPreference' });
		} else if (taskPreference?.data === false) {
			updateTaskPreferences({ preferenceType: 'contactPreference', data: defaultPreference });
			setInfo((prevInfo) => ({
				...prevInfo,
				taskPreferences: {
					preferenceType: 'contactPreference',
					preferences: defaultPreference,
				},
			}));
		} else if (taskPreference?.error) {
			setInfo((prevInfo) => ({
				...prevInfo,
				taskPreferences: {
					preferenceType: 'contactPreference',
					preferences: defaultPreference,
				},
			}));
		} else {
			setInfo((prevInfo) => ({
				...prevInfo,
				taskPreferences: {
					preferenceType: 'contactPreference',
					preferences: taskPreference?.data,
				},
			}));
		}
	}, [taskPreference]);

	useEffect(() => {
		if (!clientList) {
			updateListViewInfo({ loadingSkeleton: true });
			fetchClientList(1, info.filters, info.searchValue, info.sort);
		} else {
			if (clientList?.data) {
				setInfo((prevInfo) => ({
					...prevInfo,
					listItems:
						clientList?.data?.currentPage === 1
							? clientList?.data?.data || []
							: [...(prevInfo?.listItems || []), ...(clientList?.data?.data || [])],
					hasMore: clientList?.data?.hasNextPage,
					loadingSkeleton: false,
				}));
			} else {
				setInfo((prevInfo) => ({
					...prevInfo,
					listItems: [],
					hasMore: false,
					loadingSkeleton: false,
					error: clientList?.error || 'Failed to get clients, try again',
				}));
			}
		}
	}, [clientList]);

	useEffect(() => {
		if (info?.taskPreferences?.preferences) {
			setInfo((prevInfo) => ({
				...prevInfo,
				properties: mapPropertyType(),
			}));
		}
	}, [info?.taskPreferences?.preferences]);

	useEffect(() => {
		if (refetchClientList && !info?.sidebarIsOpen) {
			setInfo((prev) => ({ ...prev, page: 1 }));
			fetchClientList(1, info.filters, info.searchValue, info.sort);
			updateListViewInfo({ refetchClientList: false });
		}
	}, [refetchClientList]);

	// Filter and search effect
	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}

		if (filterDebounceTimeout.current) {
			clearTimeout(filterDebounceTimeout.current);
		}

		if (info?.filters || info?.searchValue) {
			filterDebounceTimeout.current = setTimeout(() => {
				setInfo((prev) => ({ ...prev, page: 1 }));
				updateListViewInfo({ loadingSkeleton: true });
				fetchClientList(1, info.filters, info.searchValue, info.sort);
			}, 800);
		}

		return () => {
			if (filterDebounceTimeout.current) {
				clearTimeout(filterDebounceTimeout.current);
			}
		};
	}, [info.filters, info.searchValue]);

	// Sort effect
	useEffect(() => {
		if (info?.sort?.length > 0) {
			setInfo((prev) => ({ ...prev, page: 1 }));
			fetchClientList(1, info.filters, info.searchValue, info.sort);
		}
	}, [info.sort]);

	useEffect(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			properties: mapPropertyType(),
		}));
	}, []);

	const fetchClientList = useCallback(
		(page = 1, filters = null, search = null, sort = null) => {
			const payload = {
				clientFilterInput: {
					limit: 20,
					page: page,
					sort:
						info?.sort.length > 0 ? info?.sort : [{ sortBy: 'createdAt', sortType: 1 }],
					...(search && {
						search: search,
					}),
					...(filters?.length > 0 && {
						filters: filters.map((filter) => ({
							key: filter.key,
							value: filter.value?._id || filter.value,
						})),
					}),
				},
			};
			getClients(payload);
		},
		[getClients],
	);

	const updateListViewInfo = useCallback((updateInfo) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...updateInfo }));
	}, []);

	const tabs = useMemo(() => {
		return {
			// reqActions: { label: 'Req Actions', Component: <div>Required Actions</div> },
			// workflows: { label: 'Workflows', Component: <div>Workflows</div> },
			files: {
				label: 'Files',
				Component: (
					<TabListFile
						rowTypes={rowTypes}
						colors={colors}
						handleRowClick={(data) => {
							setInfo((prevInfo) => ({
								...prevInfo,
								activeFileData: data,
								showRightDrawer: true,
								sidebarIsOpen: false,
							}));
						}}
						refetchDocsFilesList={info?.refetchDocsFilesList}
						onUpdate={updateListViewInfo}
					/>
				),
			},
			// payments: { label: 'Payments', Component: <div>Payments</div> },
			// activity: { label: 'Activity', Component: <div>Activity</div> },
		};
	}, [rowTypes, colors, info?.refetchDocsFilesList]);

	const mapPropertyType = useCallback(() => {
		let properties = [];
		for (let key in responseMetadata) {
			if (key === '__typename' || key === '_id') {
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

	const updatePropertyValue = useCallback(
		async (rowId, propName, value, _, onSuccess) => {
			if (
				validateExpiryData &&
				validateExpiryData?.restrictContacts &&
				validateExpiryData?.isExpired
			) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			}

			const response = await updateClient({
				updateClientId: rowId,
				updateClientInput: {
					[propName]: value,
				},
			});

			if (response?.[0]) {
				updateStateValues({ refetchClientList: true });
			} else {
				message?.error(response?.[1]);
			}

			if (onSuccess) {
				onSuccess(response?.[0]);
			}
		},
		[validateExpiryData?.isExpired, updateClient, updateStateValues],
	);

	const handleDeleteClient = useCallback(
		async (payload) => {
			if (
				validateExpiryData &&
				validateExpiryData?.restrictContacts &&
				validateExpiryData?.isExpired
			) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			}

			const response = await deleteClient({ deleteClientId: payload?.taskId });
			if (response?.[0]) {
				setInfo((prevInfo) => ({
					...prevInfo,
					selectedRow: null,
					sidebarIsOpen: false,
				}));
				message?.success('Client deleted successfully');
				updateStateValues({ refetchClientList: true });
			} else {
				message?.error(response?.[1]);
			}
		},
		[validateExpiryData, deleteClient, updateStateValues],
	);

	const handleRowClick = useCallback(
		(row) => {
			if (row) {
				updateListViewInfo({ selectedRow: row, sidebarIsOpen: true });
			}
		},
		[info?.listItems, info?.selectedRow?._id],
	);

	const handleCloseSidebar = useCallback(() => {
		if (refetchClientList) {
			updateListViewInfo({ loadingSkeleton: true });
			fetchClientList(1, info.filters, info.searchValue, info.sort);
			updateListViewInfo({ refetchClientList: false });
		}
		updateListViewInfo({ sidebarIsOpen: false, selectedSubTask: null });
	}, [info?.refetchClientList]);

	const fetchMoreData = useCallback(() => {
		if (info.hasMore) {
			const nextPage = info.page + 1;
			fetchClientList(nextPage);
			setInfo((prevInfo) => ({
				...prevInfo,
				page: nextPage,
			}));
		}
	}, [info.hasMore, info.page, fetchClientList]);
	return (
		<div>
			<Task
				responseMetadata={responseMetadata}
				handleAddButtonOnClick={() => {
					updateListViewInfo({ isCreateModalOpen: true });
				}}
				handleRowClick={handleRowClick}
				colors={colors}
				updateTaskInfo={updateListViewInfo}
				rowTypes={rowTypes}
				data={info?.listItems}
				loading={info?.loadingSkeleton}
				handleUpdate={updatePropertyValue}
				properties={info?.properties}
				taskPreferences={info?.taskPreferences}
				searchValue={info?.searchValue}
				hasMore={info?.hasMore}
				error={info?.error}
				fetchMoreData={fetchMoreData}
				blockTitle={'Contacts'}
				createButtonText={'Create Lead'}
			/>

			<CreateClientModal
				modalIsOpen={info?.isCreateModalOpen}
				closeModal={() => {
					updateListViewInfo({ isCreateModalOpen: false });
				}}
			/>

			<ListViewSidebar
				selectedRow={info?.selectedRow}
				parentTaskNo={info?.selectedRow?.taskSlNo}
				sidebarIsOpen={info?.sidebarIsOpen}
				closeSidebar={handleCloseSidebar}
				handleUpdate={updatePropertyValue}
				deleteTask={handleDeleteClient}
				rowTypes={rowTypes}
				responseMetadata={responseMetadata}
				properties={info?.properties}
				colors={colors}
				sidebarChildren={<ListTabs tabs={tabs} defaultActiveTab={'files'} />}
				toggleSidebarExpand={() =>
					updateListViewInfo({ isSidebarExpanded: !info?.isSidebarExpanded })
				}
				isSidebarExpanded={info?.isSidebarExpanded}
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

export default memo(Contacts);
