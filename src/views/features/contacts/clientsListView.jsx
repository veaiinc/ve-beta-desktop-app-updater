/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ListView from '../../components/tasks/listView/ListView';
// import { ReactComponent as ClockSvg } from '../../../assets/svg/activity/clock.svg';
// import { ReactComponent as PieSvg } from '../../../assets/svg/tasks/pieHollow.svg';
// import { ReactComponent as PrioritySvg } from '../../../assets/svg/tasks/roundChevronRight.svg';
// import { ReactComponent as WorkflowSvg } from '../../../assets/svg/tasks/workflow.svg';
// import { ReactComponent as PersonSvg } from '../../../assets/svg/tasks/person.svg';
// import { ReactComponent as CalendarSvg } from '../../../assets/svg/tasks/calendar.svg';
import { ReactComponent as textSvg } from '../../../assets/svg/tasks/letterA.svg';
import Context from '../../../context/context';
import CreateLeadModal from '../../components/modalsV2/proposalModals/CreateLeadModal';
// import { message } from 'antd';
// import jwtDecode from 'jwt-decode';
// import moment from 'moment';

const ClientListView = () => {
	// let {
	// 	templates: {
	// 		getClientList,
	// 		clientList,
	// 		getTemplatesListForCreateLead,
	// 		templatesListForCreateLead,
	// 		createLeadfromTemplates,
	// 		updateStateValues,
	// 		toggleCreateLeadModal,
	// 		createLeadModalContextState,
	// 	},
	// } = useContext(Context);
	const {
		templates: {
			getClientList,
			clientList,
			toggleCreateLeadModal,
			salePageRefresh,
			createLeadModalContextState,
		},
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
			// description: { type: 'text', name: 'Description', Icon: textSvg, props: {} },
			// status: {
			// 	type: 'status',
			// 	name: 'Status',
			// 	Icon: PieSvg,
			// 	props: {
			// 		options: [
			// 			{
			// 				label: 'Enquiry',
			// 				value: 'enquiry',
			// 				color: '#939393',
			// 				backgroundColor: '#373737',
			// 			},
			// 			{
			// 				label: 'Files Sent',
			// 				value: 'filesSent',
			// 				color: '#939393',
			// 				backgroundColor: '#5A5A5A',
			// 			},
			// 			{
			// 				label: 'Files Viewed',
			// 				value: 'filesViewed',
			// 				color: '#3E70C7',
			// 				backgroundColor: '#2F4469',
			// 			},
			// 			{
			// 				label: 'Contract Signed',
			// 				value: 'contractSigned',
			// 				color: '#3B9D59',
			// 				backgroundColor: '#375841',
			// 			},
			// 			{
			// 				label: 'Confirmed',
			// 				value: 'confirmed',
			// 				color: '#939393',
			// 				backgroundColor: '#5A5A5A',
			// 			},
			// 		],
			// 	},
			// },
			// clientDetails: {
			// 	type: 'person',
			// 	name: 'Client',
			// 	Icon: PersonSvg,
			// 	props: {
			// 		options: [
			// 			// { _id: '1', name: 'John Doe' },
			// 			// { _id: '2', name: 'Jane Doe' },
			// 		],
			// 		parseValue: true,
			// 		disabled: true,
			// 	},
			// },
			// createdAt: {
			// 	type: 'date',
			// 	name: 'Created At',
			// 	Icon: CalendarSvg,
			// 	props: { timestamp: true },
			// },
			// updatedAt: {
			// 	type: 'date',
			// 	name: 'Updated At',
			// 	Icon: CalendarSvg,
			// 	props: { timestamp: true },
			// },
		}),
		[],
	);

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
		console.log('salePageRefresh', salePageRefresh);
		if (salePageRefresh) {
			fetchListItems();
			toggleCreateLeadModal({ salePageRefresh: false });
		}
	}, [salePageRefresh]);

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
		(rowId, propName, value, isUpdatingSubTask, onSuccess) => {
			if (validateExpiryData?.isExpired) {
				return updateSubscriptionState({ expiredSubscriptionModal: true });
			} else {
				//update Logic
			}
		},
		[],
	);

	const addNewClient = useCallback(async (payload) => {
		if (validateExpiryData?.isExpired) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		} else {
			//add Logic
		}
	}, []);

	const deleteClient = useCallback(async (payload) => {
		if (validateExpiryData?.isExpired) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		} else {
			//delete Logic
		}
	}, []);

	return (
		<div>
			<ListView
				info={info}
				updateListViewInfo={updateListViewInfo}
				togglePropertyVisibility={togglePropertyVisibility}
				updatePropertyValue={updatePropertyValue}
				deleteTask={deleteClient}
				addNewTask={addNewClient}
				responseMetadata={responseMetadata}
				fetchListItems={fetchListItems}
				addButtonOnClick={() => {
					toggleCreateLeadModal({ createLeadModalContextState: true });
				}}
				headerTitle={'Contacts'}
				createButtonText={'Create Client'}
			/>
		</div>
	);
};

export default memo(ClientListView);
