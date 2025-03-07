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

const optionsForQuickActions = (title) => {
	const options = [];
	options.push({ id: 0, title: `Create meeting on ${title}`, value: 'document' });
	return options;
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
							{Icon && <Icon width={16} height={16} />}
							{name}
						</span>
						<span className={`property-value`}>
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
								/>
							) : (
								<div key={key}>{value}</div>
							)}
						</span>
					</div>,
				);
			}

			return listItems;
		},
		[responseMetadata, rowTypes, handleUpdate, colors],
	);

	const generateSkeleton = useCallback(() => {
		return [...Array(3)]?.map((_, index) => (
			<div className="" key={index} style={{ marginBottom: '2px' }}>
				<Skeleton width="100%" height="32px" borderRadius="12px" count={1} />
			</div>
		));
	}, []);

	return (
		<Drawer
			onClose={closeSidebar}
			width={'fit-content'}
			open={sidebarIsOpen}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			<div
				className={`listView-sidebar-container ${
					isSidebarExpanded ? 'listView-sidebar-container-expanded' : ''
				}`}
			>
				<div className="listView-sidebar-innerContainer">
					<div className="listView-sidebar-wrapper">
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
									onClick={toggleSidebarExpand}
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
							</div>

							<div className="sidebar-header-right-container">
								{showQuickActions && isSidebarExpanded && (
									<QuickActions
										suggestedOptions={optionsForQuickActions(
											selectedRow?.title,
										)}
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
						{headerText && (
							<div className="breadCrumbs-container">
								{breadCrumbs?.map((item, index) => (
									<div
										className="breadCrumbs-item"
										key={item?.label}
										onClick={() => {
											handleBreadCrumbsClick(item, index);
										}}
									>
										{item?.label}
										<div className="right-svg">
											<RightSvg height={12} width={12} />
										</div>
									</div>
								))}
								<div className="breadCrumbs-item active">{headerText}</div>
							</div>
						)}

						<div className="sidebar-title">
							<CustomTextArea
								value={localTitle}
								onChange={handleTitleChange}
								placeholder="Enter title"
								className="sidebar-title-input"
								autoResize={true}
							/>
						</div>
						<div className="sidebar-properties-container">
							{generateRow(selectedRow)}
						</div>
						{sidebarChildren}
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
				</div>
			</div>
		</Drawer>
	);
};

export default memo(ListViewSidebar);
