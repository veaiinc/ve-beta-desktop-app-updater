/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import '../../../assets/scss/docs/fileListView.scss';
import ListView from '../../components/tasks/listView/ListView';
// import { ReactComponent as ClockSvg } from '../../../assets/svg/activity/clock.svg';
import { ReactComponent as PieSvg } from '../../../assets/svg/tasks/pieHollow.svg';
// import { ReactComponent as PrioritySvg } from '../../../assets/svg/tasks/roundChevronRight.svg';
// import { ReactComponent as WorkflowSvg } from '../../../assets/svg/tasks/workflow.svg';
import { ReactComponent as PersonSvg } from '../../../assets/svg/tasks/person.svg';
import { ReactComponent as CalendarSvg } from '../../../assets/svg/tasks/calendar.svg';
import { ReactComponent as textSvg } from '../../../assets/svg/tasks/letterA.svg';
import { ReactComponent as CloseSvg } from '../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as ExpandSvg } from '../../../assets/svg/docs/expand.svg';
import { ReactComponent as ShareSvg } from '../../../assets/svg/docs/share.svg';
import { ReactComponent as DotsSvg } from '../../../assets/svg/docs/vertidot.svg';
import Context from '../../../context/context';
import RequiredActions from '../../components/docs/RequiredActions';
import Preview from '../../components/docs/Preview';
import { Drawer } from 'antd';
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
		showRightDrawer: false,
		activeTab: 'reqActions',
	});

	// const [activeTab, setActiveTab] = useState('reqActions');

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

	const rowClickHandler = useCallback((data) => {
		console.log('rowClickHandler==>', data);
		setInfo((prev) => ({ ...prev, showRightDrawer: !prev.showRightDrawer }));
	}, []);

	const tabs = useMemo(
		() => [
			{
				id: 'reqActions',
				label: 'Req Actions',
				Component: () => <RequiredActions />,
			},
			{
				id: 'preview',
				label: 'Preview',
				Component: () => <Preview />,
			},
			{
				id: 'activity',
				label: 'Activity',
				Component: () => <div>Activity</div>,
			},
		],
		[],
	);

	const handleTabChange = useCallback((tabId) => {
		setInfo((prev) => ({ ...prev, activeTab: tabId }));
	}, []);

	const renderActiveComponent = useCallback(() => {
		const activeTabConfig = tabs?.find((tab) => tab?.id === info?.activeTab);
		if (!activeTabConfig) return null;

		const { Component } = activeTabConfig;
		return <Component />;
	}, [info?.activeTab, tabs]);

	return (
		<>
			<ListView
				info={info}
				updateListViewInfo={updateListViewInfo}
				togglePropertyVisibility={togglePropertyVisibility}
				updatePropertyValue={updatePropertyValue}
				deleteTask={deleteTask}
				addNewTask={addNewTask}
				responseMetadata={responseMetadata}
				fetchListItems={fetchListItems}
				addButtonOnClick={() => {}}
				headerTitle={'Files'}
				rowClickHandler={rowClickHandler}
			/>

			<Drawer
				// open={info?.showRightDrawer}
				open={true}
				onClose={() => setInfo((prev) => ({ ...prev, showRightDrawer: false }))}
				style={{ padding: '10px', backgroundColor: 'transparent' }}
				headerStyle={{ display: 'none' }}
				bodyStyle={{ padding: '0px' }}
				width={480}
			>
				<div className="fileListViewDrawer">
					<div className="headerContainer">
						<div className="headerLeftLabel">
							<CloseSvg
								onClick={() =>
									setInfo((prev) => ({ ...prev, showRightDrawer: false }))
								}
							/>
							<ExpandSvg />
						</div>
						<div className="headerRightLabel">
							<div>Draft</div>
							<div className="editLabel">Edit</div>
							<ShareSvg />
							<DotsSvg />
						</div>
					</div>

					<div className="listViewContainer">ListViewSidebar</div>

					<div className="tabsViewWrapper">
						<div className="tabsView">
							{tabs?.map((tab) => (
								<div
									key={tab?.id}
									className={`tabViewLabel ${
										info?.activeTab === tab?.id ? 'active' : ''
									}`}
									onClick={() => handleTabChange(tab?.id)}
								>
									{tab?.label}
								</div>
							))}
						</div>

						<div className="respectiveView">{renderActiveComponent() || ''}</div>
					</div>
				</div>
			</Drawer>
		</>
	);
};

export default memo(FilesListView);
