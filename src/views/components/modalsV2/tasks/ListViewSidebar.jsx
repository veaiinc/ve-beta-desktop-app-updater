/* eslint-disable no-unused-vars */
import { Drawer, Progress } from 'antd';
import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import '../../../../assets/scss/tasks/modals/listViewSidebar.scss';
import { ReactComponent as CloseArrow } from '../../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as RightSvg } from '../../../../assets/svg/activity/right.svg';
import { ReactComponent as DustBinIcon } from '../../../../assets/svg/tasks/dustBin.svg';
import { ReactComponent as PlusSvg } from '../../../../assets/svg/tasks/plus.svg';
import { ReactComponent as SearchSvg } from '../../../../assets/svg/tasks/searchWhite.svg';
import { ReactComponent as HorizontalMoreIcon } from '../../../../assets/svg/tasks/horizontalDotsThin.svg';
import Spinner from '../../loaders/Spinner';
import Context from '../../../../context/context';
import ListViewRow from '../../tasks/listView/ListViewRow';
import Skeleton from 'react-loading-skeleton';

const ListViewSidebar = ({
	selectedRow,
	sidebarIsOpen,
	closeSidebar,
	updatePropertyValue,
	deleteTask,
	rowTypes,
	handleCreateSubTaskClick,
	handleSubTaskClick,
	isShowingSubTask,
	parentTaskNo,
	handleChildTaskClose,
	responseMetadata,
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
	});

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

				if (
					[
						'__typename',
						'_id',
						'title',
						'description',
						'workflowTemplateId',
						'completedAt',
						'taskSlNo',
						'workflowId',
						isShowingSubTask && 'workflow',
					].includes(key)
				) {
					continue;
				}
				const { type = null, name = null, Icon = null, props } = responseMetadata[key];

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
										updatePropertyValue(row._id, key, value, isShowingSubTask)
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
		[isShowingSubTask, responseMetadata, rowTypes, updatePropertyValue],
	);

	const generateSkeleton = useCallback(() => {
		return [...Array(3)].map((_, index) => (
			<div className="" key={index} style={{ marginBottom: '2px' }}>
				<Skeleton width="100%" height="32px" borderRadius="12px" count={1} />
			</div>
		));
	}, []);

	return (
		<Drawer
			onClose={closeSidebar}
			width={480}
			open={sidebarIsOpen}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			<div className="listView-sidebar-container">
				<div className="listView-sidebar-innerContainer">
					<div className="listView-sidebar-wrapper">
						<div className="sidebar-header">
							<CloseArrow
								width={16}
								height={16}
								onClick={closeSidebar}
								className="cursor-pointer"
							/>
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
							<textarea
								className="sidebar-title-input"
								value={selectedRow?.title || ''}
								onChange={(e) => {
									updatePropertyValue(
										selectedRow?._id,
										'title',
										e?.target?.value,
									);
								}}
								placeholder="Enter title"
								rows={1}
							/>
						</div>
						<div className="sidebar-properties-container">
							{generateRow(selectedRow)}
						</div>
						{isShowingSubTask ? (
							''
						) : (
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
										{/* <button className="subtask-action-button">
											<SearchSvg />
										</button> */}
										{/* <button className="subtask-action-button">
									<ThunderSvg />
								</button>
								<button className="subtask-action-button">
									<FilterLinesSvg />
								</button> */}
										{/* <button className="subtask-action-button">
											<HorizontalMoreIcon
												style={{ width: '20px', height: '20px' }}
											/>
										</button> */}
										{/* <Tooltip
									placement="bottom"
									title={
										<OptionsDropDown
											properties={properties}
											togglePropertyVisibility={togglePropertyVisibility}
										/>
									}
									arrow={false}
									trigger={'click'}
									color={'transparent'}
									overlayStyle={{ minWidth: 'fit-content' }}
								>
									<button className="btn-options">
										<HorizontalMoreIcon
											style={{ width: '20px', height: '20px' }}
										/>
									</button>
								</Tooltip> */}
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
												updatePropertyValue={updatePropertyValue}
												isSubTask={true}
												handleRowClick={onSubTaskClick}
											/>
										))
									) : (
										<span className="no-subtasks">No subTasks</span>
									)}
								</div>
							</div>
						)}

						<div className="sidebar-description">
							<textarea
								className="sidebar-description-textarea"
								value={selectedRow?.description || ''}
								onChange={(e) =>
									updatePropertyValue(
										selectedRow?._id,
										'description',
										e.target.value,
									)
								}
								placeholder="Enter description"
								rows={5}
							/>
						</div>
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(ListViewSidebar);
