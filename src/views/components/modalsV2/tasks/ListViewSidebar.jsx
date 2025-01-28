/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { Drawer, Progress } from 'antd';
import React, { memo, useCallback, useContext, useEffect, useState, useRef } from 'react';
import '../../../../assets/scss/tasks/modals/listViewSidebar.scss';
import { ReactComponent as CloseArrow } from '../../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as RightSvg } from '../../../../assets/svg/activity/right.svg';
import { ReactComponent as DustBinIcon } from '../../../../assets/svg/tasks/dustBin.svg';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import { ReactComponent as ExpandSvg } from '../../../../assets/svg/docs/expand.svg';
// import { ReactComponent as CollapseSvg } from '../../../../assets/svg/docs/collapse.svg';
import Spinner from '../../loaders/Spinner';
import Context from '../../../../context/context';
import ListViewRow from '../../tasks/listView/ListViewRow';
import Skeleton from 'react-loading-skeleton';
import CustomTextArea from '../../globalComponents/CusomTextArea';

const ListViewSidebar = ({
	selectedRow,
	sidebarIsOpen,
	closeSidebar,
	handleUpdate,
	deleteTask,
	rowTypes,
	handleCreateSubTaskClick,
	handleSubTaskClick,
	isShowingSubTask,
	parentTaskNo,
	handleChildTaskClose,
	responseMetadata,
	haveSubTask,
	properties,
	colors,
	sidebarChildren,
	isSidebarExpanded = false,
	toggleSidebarExpand,
}) => {
	const {
		tasks: { subTasks, getSubTasks },
	} = useContext(Context);

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

	useEffect(() => {
		if (isShowingSubTask) {
			return;
		}
		if (selectedRow?._id && !subTasks) {
			setInfo((prevInfo) => ({
				...prevInfo,
				subTaskLoading: true,
			}));
			getSubTasks({ taskId: selectedRow?._id });
		} else {
			if (subTasks?.data) {
				setInfo((prevInfo) => ({
					...prevInfo,
					subTasks: [...subTasks?.data],
					subTaskLoading: false,
					completedSubtaskCount: subTasks?.data?.filter(
						(subTask) => subTask?.status === 'completed',
					).length,
				}));
			} else {
				setInfo((prevInfo) => ({
					...prevInfo,
					subTaskError: subTasks?.error,
					subTaskLoading: false,
				}));
			}
		}
	}, [subTasks, selectedRow?._id, isShowingSubTask, getSubTasks]);

	useEffect(() => {
		// console.log('responseMetadata changed:', responseMetadata);
		console.log('assignTo props:', responseMetadata?.assignedTo?.props);
	}, [responseMetadata]);

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

	const onSubTaskClick = useCallback(
		(taskId) => {
			const task = info?.subTasks?.find((task) => task?._id === taskId);
			handleSubTaskClick(task);
		},
		[info?.subTasks, handleSubTaskClick],
	);

	const generateRow = useCallback(
		(row) => {
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
				// console.log('responseMetadata', props);
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
						isShowingSubTask && 'workflow',
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
									{...(type === 'date' ? { format: 'MMM DD, YYYY h:mm A' } : {})}
									{...props}
									onOptionClick={(value) =>
										handleUpdate(row._id, key, value, isShowingSubTask)
									}
									colors={colors}
									takeFullspace={true}
									onUpdate={(value, onSuccess) =>
										handleUpdate(
											row._id,
											key,
											value,
											isShowingSubTask,
											onSuccess,
										)
									}
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
		[isShowingSubTask, responseMetadata, rowTypes, handleUpdate],
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
							<div className="breadcrumbs">
								{isShowingSubTask ? (
									<span
										className="breadcrumbs-item"
										onClick={handleChildTaskClose}
									>
										{parentTaskNo} <RightSvg height={12} width={12} />
									</span>
								) : (
									''
								)}
								<span className="breadcrumbs-item">{selectedRow?.taskSlNo}</span>
							</div>
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
						{!sidebarChildren && haveSubTask && !isShowingSubTask ? (
							<div className="sidebar-subtask-container">
								<div className="sidebar-subtask-header">
									<span className="sidebar-subtask-header-title">Sub Tasks</span>
									<span className="sidebar-subtask-header-count">
										<Progress
											type="circle"
											percent={
												(info?.completedSubtaskCount /
													info?.subTasks?.length) *
												100
											}
											size={16}
											strokeColor={'#6055EC'}
											trailColor={'#2F2F2F'}
											strokeWidth={14}
										/>
										<span className="task-count">
											{info?.completedSubtaskCount || 0}/
											{info?.subTasks?.length || 0}
										</span>
									</span>
									<div className="subtask-actions-wrapper">
										<button
											className="subtask-action-button"
											onClick={handleCreateSubTaskClick}
										>
											<PlusSvg style={{ width: '20px', height: '20px' }} />
										</button>
									</div>
								</div>
								<div className="subtask-list-container">
									{info?.subTaskLoading ? (
										generateSkeleton()
									) : info?.subTaskError ? (
										<span className="no-subtasks">{info?.subTaskError}</span>
									) : info?.subTasks?.length !== 0 ? (
										info?.subTasks?.map((subTask) => (
											<ListViewRow
												task={subTask}
												key={subTask?._id}
												rowTypes={rowTypes}
												responseMetadata={responseMetadata}
												handleUpdate={handleUpdate}
												isSubTask={true}
												handleRowClick={onSubTaskClick}
												properties={properties}
												colors={colors}
											/>
										))
									) : (
										<span className="no-subtasks">No subTasks</span>
									)}
								</div>
							</div>
						) : (
							''
						)}

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
