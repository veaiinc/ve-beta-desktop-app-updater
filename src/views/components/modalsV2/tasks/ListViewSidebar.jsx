/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Drawer } from 'antd';
import React, { memo, useCallback, useEffect, useState, useRef } from 'react';
import '../../../../assets/scss/tasks/modals/listViewSidebar.scss';
import { ReactComponent as CloseArrow } from '../../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as RightSvg } from '../../../../assets/svg/activity/right.svg';
import { ReactComponent as DustBinIcon } from '../../../../assets/svg/tasks/dustBin.svg';
import { ReactComponent as ExpandSvg } from '../../../../assets/svg/docs/expand.svg';
import Spinner from '../../loaders/Spinner';
import Skeleton from 'react-loading-skeleton';
import CustomTextArea from '../../globalComponents/CusomTextArea';
import QuickActions from '../../globalComponents/QuickActions';
import { useSearchParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
const optionsForQuickActions = [
	{ id: 4, title: 'Document', value: 'document' },
	{ id: 6, title: 'Proposal', value: 'proposal' },
	{ id: 7, title: 'Invoice', value: 'invoice' },
	{ id: 8, title: 'Contract', value: 'contract' },
];

const getFormattedDate = (date) => {
	if (!date) return '';
	return moment(date * 1000)?.format('DD/MM/YYYY - hh:mm A');
};

const customStyles = {
	height: 'calc(100dvh - 41px)',
	marginTop: '53px',
};

const ListViewSidebar = ({
	selectedRow,
	sidebarIsOpen,
	closeSidebar,
	handleUpdate,
	deleteTask,
	rowTypes,
	handleSubTaskClick,
	responseMetadata,
	colors,
	sidebarChildren,
	isSidebarExpanded = false,
	toggleSidebarExpand,
	headerText,
	breadCrumbs,
	handleBreadCrumbsClick,
	showQuickActions = true,
	renewBanner
}) => {


	const [info, setInfo] = useState({
		subTasks: [],
		subTaskLoading: true,
		subTaskError: null,
		deleteLoading: false,
		completedSubtaskCount: 0,
		titlePropName: null,
	});

	const [localTitle, setLocalTitle] = useState('');
	const [localDescription, setLocalDescription] = useState('');
	const titleDebounceRef = useRef(null);
	const descriptionDebounceRef = useRef(null);
	const navigate = useNavigate();
	const suggestedOptions = [
		{
			id: 0,
			title: `Create meeting on ${localTitle}`,
			value: 'meeting',
			controlValue: 'calendar',
			action: ({ navigate }) => {
				navigate('/calendar');
			},
		},
	];

	useEffect(() => {
		if (selectedRow?.title !== localTitle) {
			const titlePropName = Object.keys(responseMetadata).find(
				(key) => responseMetadata[key]?.isTitle,
			);
			setInfo((prevInfo) => ({
				...prevInfo,
				titlePropName: titlePropName,
			}));
			setLocalTitle(selectedRow?.[titlePropName] || '');
		}
		if (selectedRow?.description !== localDescription) {
			setLocalDescription(selectedRow?.description || '');
		}
	}, [selectedRow?._id]);

	useEffect(() => {
		return () => {
			if (titleDebounceRef.current) {
				clearTimeout(titleDebounceRef.current);
			}
			if (descriptionDebounceRef.current) {
				clearTimeout(descriptionDebounceRef.current);
			}
		};
	}, []);

	const debouncedTitleUpdate = useCallback(
		(value) => {
			if (titleDebounceRef.current) {
				clearTimeout(titleDebounceRef.current);
			}
			titleDebounceRef.current = setTimeout(() => {
				handleUpdate(selectedRow?._id, info?.titlePropName, value, null, null, () => {
					setLocalTitle(value);
				});
			}, 800);
		},
		[selectedRow?._id, handleUpdate],
	);

	const debouncedDescriptionUpdate = useCallback(
		(value) => {
			if (descriptionDebounceRef.current) {
				clearTimeout(descriptionDebounceRef.current);
			}
			descriptionDebounceRef.current = setTimeout(() => {
				handleUpdate(selectedRow?._id, 'description', value, null, null, () => {
					setLocalDescription(value);
				});
			}, 800);
		},
		[selectedRow?._id, handleUpdate],
	);

	const handleTitleChange = useCallback(
		(e) => {
			const newTitle = e.target.value;
			setLocalTitle(newTitle);
			debouncedTitleUpdate(newTitle);
		},
		[debouncedTitleUpdate],
	);

	const handleDescriptionChange = useCallback(
		(e) => {
			const newDescription = e.target.value;
			setLocalDescription(newDescription);
			debouncedDescriptionUpdate(newDescription);
		},
		[debouncedDescriptionUpdate],
	);

	const handleDeleteTask = useCallback(async () => {
		setInfo((prevInfo) => ({
			...prevInfo,
			deleteLoading: true,
		}));
		await deleteTask({ taskId: selectedRow?._id });
		setInfo((prevInfo) => ({
			...prevInfo,
			deleteLoading: false,
		}));
	}, [deleteTask, selectedRow?._id]);

	const generateRow = useCallback(
		(row) => {
			if (!row) return [];

			const listItems = [];
			for (let key in row) {
				const value = row[key];

				const {
					type = null,
					name = null,
					Icon = null,
					isTitle = false,
					props = {},
				} = responseMetadata[key] || {};

				if (
					[
						'__typename',
						'_id',
						'description',
						'workflowTemplateId',
						'completedAt',
						'taskSlNo',
						'workflowId',
						'parentTask',
						'childTasks',
						'assignedBy',
						'assignedAt',
						'createdAt',
						'createdBy',
						'updatedAt',
						'updatedBy',
						// 'clients',
					].includes(key) ||
					isTitle
				) {
					continue;
				}

				if (type === null) {
					continue;
				}

				const RowComponent = rowTypes?.[type] || null;

				listItems.push(
					<div className="property-list" key={key}>
						<span className="property-title">
							{Icon && <Icon width={16} height={16} className="property-icon" />}

							{RowComponent ? (
								<RowComponent
									key={key}
									value={value}
									title={name}
									showLabel
									defaultLabel={'Not selected'}
									options={props.options}
									multiSelect={props.multiSelect}
									parseValue={props.parseValue}
									disabled={props.disabled}
									{...props}
									onOptionClick={(value) => handleUpdate(row._id, key, value)}
									colors={colors}
									onUpdate={(value, onSuccess) =>
										handleUpdate(row._id, key, value, false, onSuccess)
									}
									takeFullspace={true}
									className={key === 'dueDate' ? 'listview-date-picker' : ''}
								/>
							) : (
								<div key={key}>{value}</div>
							)}
						</span>
						<span className={`property-value`}>{name}</span>
					</div>,
				);
			}

			return listItems;
		},
		[responseMetadata, rowTypes, handleUpdate, colors],
	);

	const generateTimestampDiv = useCallback((row) => {
		return (
			<div className="timestamp-div">
				<div className="timestamp-cell">
					<div className="timestamp-item">
						<span className="timestamp-label">Created at</span>
						<span className="timestamp-value">{getFormattedDate(row?.createdAt)}</span>
						<span className="timestamp-assignee">{row?.createdBy?.name}</span>
					</div>
					<div className="timestamp-item">
						<span className="timestamp-label">Assigned at</span>
						<span className="timestamp-value">{getFormattedDate(row?.assignedAt)}</span>
						<span className="timestamp-assignee">{row?.assignedBy?.name}</span>
					</div>
					<div className="timestamp-item">
						<span className="timestamp-label">Updated at</span>
						<span className="timestamp-value">{getFormattedDate(row?.updatedAt)}</span>
						<span className="timestamp-assignee">{row?.updatedBy?.name}</span>
					</div>
				</div>
			</div>
		);
	}, []);

	const generateSkeleton = useCallback(() => {
		return [...Array(3)]?.map((_, index) => (
			<div className="" key={index} style={{ marginBottom: '2px' }}>
				<Skeleton width="100%" height="32px" borderRadius="12px" count={1} />
			</div>
		));
	}, []);

	const handleExpandClick = () => {
		if (selectedRow?._id) {
			const isTask = !!selectedRow?.taskSlNo;
			const path = isTask ? `/task/${selectedRow._id}` : `/contact/${selectedRow._id}`;
			navigate(path);
			closeSidebar();
		}
	};

	return (
		<Drawer
			onClose={closeSidebar}
			width={'fit-content'}
			open={sidebarIsOpen}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px', overflow: 'hidden' }}
			className="listview-sidebar-drawer"
		>
			<div
				className={`listView-sidebar-container ${
					isSidebarExpanded ? 'listView-sidebar-container-expanded' : ''
				}`}
			>
				<div className="listView-sidebar-innerContainer" style={renewBanner ? customStyles : ''}>
					<div className="sidebar-header">
						<div className="sidebar-header-left-container">
							<div className="sidebar-header-expand-button">
								{!isSidebarExpanded ? (
									<CloseArrow
										width={16}
										height={16}
										onClick={closeSidebar}
										style={{ cursor: 'pointer' }}
									/>
								) : (
									''
								)}
							</div>
							<div
								className="sidebar-header-expand-button"
								onClick={handleExpandClick}
							>
								{isSidebarExpanded ? (
									<ExpandSvg
										width={16}
										height={16}
										style={{ cursor: 'pointer' }}
									/>
								) : (
									<ExpandSvg
										width={16}
										height={16}
										style={{ cursor: 'pointer' }}
									/>
								)}
							</div>
							<div className="sidebar-header-id">{headerText}</div>
						</div>

						<div className="sidebar-header-right-container">
							{showQuickActions && isSidebarExpanded && (
								<QuickActions
									suggestedOptions={suggestedOptions}
									// clientDetails={selectedRow}
								/>
							)}
							<button
								className="sidebar-delete-button"
								onClick={() => {
									handleDeleteTask();
								}}
								disabled={info?.deleteLoading}
							>
								{info?.deleteLoading ? (
									<Spinner width={20} height={20} color="#7d7d7d" />
								) : (
									<DustBinIcon
										width={20}
										height={20}
										className="cursor-pointer"
									/>
								)}
							</button>
						</div>
					</div>
					<div className="listView-sidebar-wrapper">
						<div className="sidebar-title">
							<CustomTextArea
								value={localTitle}
								onChange={handleTitleChange}
								placeholder="Enter title"
								className="sidebar-title-input"
								autoResize={true}
							/>
							{selectedRow?.description !== undefined && (
								<div className="sidebar-description">
									<CustomTextArea
										value={localDescription}
										onChange={handleDescriptionChange}
										placeholder="Enter description"
										className="sidebar-description-textarea"
										autoResize={true}
									/>
								</div>
							)}
						</div>
						<div className="sidebar-properties-container">
							<h4>Details</h4>
							{generateRow(selectedRow)}
						</div>
						{sidebarChildren}
						<div className="sidebar-timestamp-container">
							{generateTimestampDiv(selectedRow)}
						</div>
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(ListViewSidebar);
