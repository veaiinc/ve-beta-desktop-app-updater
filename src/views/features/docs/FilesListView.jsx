/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import ListView from '../../components/tasks/listView/ListView';
// import { ReactComponent as ClockSvg } from '../../../assets/svg/activity/clock.svg';
import { ReactComponent as PieSvg } from '../../../assets/svg/tasks/pieHollow.svg';
// import { ReactComponent as PrioritySvg } from '../../../assets/svg/tasks/roundChevronRight.svg';
// import { ReactComponent as WorkflowSvg } from '../../../assets/svg/tasks/workflow.svg';
import { ReactComponent as PersonSvg } from '../../../assets/svg/tasks/person.svg';
import { ReactComponent as CalendarSvg } from '../../../assets/svg/tasks/calendar.svg';
import { ReactComponent as textSvg } from '../../../assets/svg/tasks/letterA.svg';
import Context from '../../../context/context';
// import { message } from 'antd';
// import jwtDecode from 'jwt-decode';
// import moment from 'moment';

const FilesListView = () => {
	const {
		templates: { getWorkflowsList, workflowslist },
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
			title: { type: 'text', name: 'Title', Icon: textSvg, doSplit: true, props: {} },
			description: { type: 'text', name: 'Description', Icon: textSvg, props: {} },
			status: {
				type: 'status',
				name: 'Status',
				Icon: PieSvg,
				props: {
					options: [
						{
							label: 'Enquiry',
							value: 'enquiry',
							color: '#939393',
							backgroundColor: '#373737',
						},
						{
							label: 'Files Sent',
							value: 'filesSent',
							color: '#939393',
							backgroundColor: '#5A5A5A',
						},
						{
							label: 'Files Viewed',
							value: 'filesViewed',
							color: '#3E70C7',
							backgroundColor: '#2F4469',
						},
						{
							label: 'Contract Signed',
							value: 'contractSigned',
							color: '#3B9D59',
							backgroundColor: '#375841',
						},
						{
							label: 'Confirmed',
							value: 'confirmed',
							color: '#939393',
							backgroundColor: '#5A5A5A',
						},
					],
				},
			},
			clientDetails: {
				type: 'person',
				name: 'Client',
				Icon: PersonSvg,
				props: {
					options: [
						// { _id: '1', name: 'John Doe' },
						// { _id: '2', name: 'Jane Doe' },
					],
					parseValue: true,
					disabled: true,
				},
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
		if (workflowslist?.data) {
			setInfo((prevInfo) => ({
				...prevInfo,
				listItems: workflowslist?.data,
				hasMore: workflowslist?.hasNextPage,
				loadingSkeleton: false,
			}));
		} else {
			fetchListItems();
		}
	}, [workflowslist]);

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
		getWorkflowsList({
			filters: {
				limit: 20,
				page: info?.page,
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
				key === '_id' ||
				key === 'workflowTemplateId' ||
				key === 'completedAt'
			) {
				continue;
			}

			const { type = null, name = null, Icon = null } = responseMetadata[key];

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

	const addNewTask = useCallback(async (payload) => {
		if (validateExpiryData?.isExpired) {
			return updateSubscriptionState({ expiredSubscriptionModal: true });
		} else {
			//add Logic
		}
	}, []);

	const deleteTask = useCallback(async (payload) => {
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
				deleteTask={deleteTask}
				addNewTask={addNewTask}
				responseMetadata={responseMetadata}
				fetchListItems={fetchListItems}
				addButtonOnClick={() => {
					console.log('addButtonOnClick');
				}}
				headerTitle={'Files'}
			/>
		</div>
	);
};

export default memo(FilesListView);
