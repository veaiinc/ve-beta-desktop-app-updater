import React, { memo, useCallback, useEffect, useState } from 'react';
import ReactModal from '../index';
import '../../../../assets/scss/tasks/modals/createTaskPopup.scss';
import { ReactComponent as CrossWhite } from '../../../../assets/svg/Settings/CrossWhite.svg';
import { ReactComponent as HorizontalMoreIcon } from '../../../../assets/svg/tasks/horizontalDotsThin.svg';
// import { ReactComponent as PageIcon } from '../../../../assets/svg/tasks/pagePlus.svg';
// import { ReactComponent as CalendarIcon } from '../../../../assets/svg/calendar-icon.svg';
// import { ReactComponent as LinkIcon } from '../../../../assets/svg/activity/link.svg';
// import { ReactComponent as CalendarIcon } from '../../../../assets/svg/tasks/calendar.svg';
import { ReactComponent as TaskIcon } from '../../../../assets/svg/tasks/taskIcon.svg';
import { ReactComponent as DustbinIcon } from '../../../../assets/svg/tasks/dustBin.svg';

import Priority from '../../tasks/listView/Priority';
import Status from '../../tasks/listView/Status';
import { message } from 'antd';
import Spinner from '../../loaders/Spinner';
import WorkFlow from '../../tasks/listView/WorkFlow';
import Person from '../../tasks/listView/Person';
import DateView from '../../tasks/listView/DateView';
import DropDown from '../../dropDown/tasks/DropDown';

const initialState = {
	assignedTo: [],
	description: '',
	dueDate: null,
	priority: 'low',
	status: 'todo',
	title: '',
	workflowId: '',
	isLoading: false,
	showSubTaskCreate: false,
	subTaskTitle: '',
	subTaskDescription: '',
	subTaskAssignedTo: [],
	subTaskDueDate: null,
	subTaskPriority: 'low',
	subTaskStatus: 'todo',
	subTaskWorkflowId: '',
	childTasks: [],
	isSubTaskEditing: false,
};

const CreateTaskPopup = ({
	isOpen,
	closeModal,
	addNewTask,
	isSubTask = false,
	responseMetadata,
}) => {
	const [info, setInfo] = useState({
		...initialState,
	});

	useEffect(() => {
		setInfo({ ...initialState });
	}, [isOpen]);

	const updateModalInfo = useCallback((key, value) => {
		if (key === 'title') {
			value = value?.trim();
		}
		setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
	}, []);

	const preparePayload = useCallback(
		(info) => {
			const {
				assignedTo,
				description,
				dueDate,
				priority,
				status,
				title,
				workflowId,
				childTasks = [],
			} = info;
			if (!title.trim()) {
				return;
			}
			return Object.entries({
				assignedTo:
					assignedTo.length > 0
						? {
								tenantUsers: assignedTo,
						  }
						: '',
				description,
				dueDate,
				priority,
				status,
				title,
				workflowId,
				childTasks: childTasks?.length > 0 ? childTasks : null,
				workflowTemplateId: workflowId
					? responseMetadata?.['workflow']?.props?.options?.find(
							(workflow) => workflow._id === workflowId,
					  )?.templateId
					: null,
			})
				.filter(([key, value]) => value != null && value !== '')
				.reduce((acc, [key, value]) => {
					acc[key] = value;
					return acc;
				}, {});
		},
		[responseMetadata],
	);

	const handleAddTask = useCallback(async () => {
		try {
			setInfo((prevInfo) => ({ ...prevInfo, isLoading: true }));
			const payload = preparePayload(info);
			await addNewTask(payload);
			setInfo((prevInfo) => ({ ...prevInfo, isLoading: false, ...initialState }));
			closeModal();
		} catch (error) {
			message.error(error?.message || 'Something went wrong! Please try again.');
			setInfo((prevInfo) => ({ ...prevInfo, isLoading: false }));
		}
	}, [addNewTask, closeModal, info, preparePayload]);

	const handleMoreOptionClick = useCallback(
		(value) => {
			console.log(value);
			if (value === 'addSubTask') {
				updateModalInfo('showSubTaskCreate', true);
			}
		},
		[updateModalInfo],
	);

	const handleAddSubTask = useCallback(() => {
		const payload = preparePayload({
			title: info?.subTaskTitle,
			description: info?.subTaskDescription,
			assignedTo: info?.subTaskAssignedTo,
			dueDate: info?.subTaskDueDate,
			priority: info?.subTaskPriority,
			status: info?.subTaskStatus,
			workflowId: info?.subTaskWorkflowId,
		});

		setInfo((prevInfo) => {
			const newChildTasks = [...prevInfo?.childTasks];

			if (info?.isSubTaskEditing) {
				// Replace the edited task
				const editIndex = prevInfo.editingSubTaskIndex;
				newChildTasks[editIndex] = payload;
			} else {
				// Add new task
				newChildTasks.push(payload);
			}

			return {
				...prevInfo,
				childTasks: newChildTasks,
				showSubTaskCreate: false,
				isSubTaskEditing: false,
				editingSubTaskIndex: null,
				subTaskTitle: '',
				subTaskDescription: '',
				subTaskAssignedTo: [],
				subTaskDueDate: null,
				subTaskPriority: 'low',
				subTaskStatus: 'todo',
				subTaskWorkflowId: '',
			};
		});
	}, [
		preparePayload,
		info?.subTaskTitle,
		info?.subTaskDescription,
		info?.subTaskAssignedTo,
		info?.subTaskDueDate,
		info?.subTaskPriority,
		info?.subTaskStatus,
		info?.subTaskWorkflowId,
		info?.isSubTaskEditing,
	]);

	const handleDeleteSubTask = useCallback((index) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			childTasks: prevInfo?.childTasks?.filter((_, idx) => idx !== index),
		}));
	}, []);

	const handleEditSubTask = useCallback((index) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			isSubTaskEditing: true,
			showSubTaskCreate: true,
			editingSubTaskIndex: index, // Store the index being edited
			subTaskTitle: prevInfo?.childTasks[index]?.title,
			subTaskDescription: prevInfo?.childTasks[index]?.description,
			subTaskAssignedTo: prevInfo?.childTasks[index]?.assignedTo || [],
			subTaskDueDate: prevInfo?.childTasks[index]?.dueDate,
			subTaskPriority: prevInfo?.childTasks[index]?.priority,
			subTaskStatus: prevInfo?.childTasks[index]?.status,
			subTaskWorkflowId: prevInfo?.childTasks[index]?.workflowId,
		}));
	}, []);

	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={info?.isLoading ? null : closeModal}
			modalType={'center'}
			customStyles={{
				content: {
					zIndex: 30000,
				},
				overlay: {
					zIndex: 2,
				},
			}}
		>
			<div className="createTask-container">
				<div className="header-wrapper">
					<h2 className="createTask-title">
						{isSubTask ? 'Create Sub Task' : 'Create Task'}
					</h2>
					<div className="actions-wrapper">
						<CrossWhite
							className="crossSvg"
							onClick={info?.isLoading ? null : closeModal}
						/>
					</div>
				</div>
				<div className="text-wrapper">
					<input
						type="text"
						placeholder="Task title"
						onChange={(e) => updateModalInfo('title', e?.target?.value)}
					/>
					<textarea
						name=""
						id=""
						placeholder="Add description..."
						value={info?.description}
						onChange={(e) => updateModalInfo('description', e.target.value)}
					></textarea>
				</div>
				<div className="properties-wrapper">
					<Status
						value={info?.status}
						showLabel={true}
						onOptionClick={(value) => updateModalInfo('status', value)}
						title={'Status'}
					/>
					<Priority
						value={info?.priority}
						showLabel={true}
						onOptionClick={(value) => updateModalInfo('priority', value)}
						title={'Priority'}
					/>
					{!isSubTask ? (
						<WorkFlow
							val={info?.workflowId}
							onOptionClick={(value) => updateModalInfo('workflowId', value)}
							title={'Workflow'}
							{...responseMetadata?.['workflow']?.props}
						/>
					) : (
						''
					)}

					<div className="dateView-wrapper">
						<DateView
							value={info?.dueDate}
							onOptionClick={(value) => updateModalInfo('dueDate', value)}
							title={'Due Date'}
							showIcon={true}
							customListItemStyle={{ margin: '0 6px' }}
						/>
					</div>
					<Person
						value={info?.assignedTo || []}
						{...responseMetadata?.['assignedTo']?.props}
						onOptionClick={(value) => updateModalInfo('assignedTo', value)}
						title={'Assigned To'}
						multiSelect={true}
						parseValue={true}
						removeBtn={true}
					/>
					{!isSubTask ? (
						<DropDown
							value={null}
							valueSelector={'value'}
							options={[
								// {
								// 	Icon: () => <CalendarIcon className="dropdown-icon" />,
								// 	label: 'Set Due date',
								// },
								{
									Icon: () => <TaskIcon />,
									label: 'Add Sub Task',
									value: 'addSubTask',
								},
							]}
							onOptionClick={handleMoreOptionClick}
						>
							<div className="dropdown-item">
								<HorizontalMoreIcon />
							</div>
						</DropDown>
					) : (
						''
					)}
				</div>

				{info?.showSubTaskCreate ? (
					<div className="create-subtask-wrapper">
						<div className="header-wrapper">
							<h2 className="createTask-title">
								{info?.isSubTaskEditing ? 'Edit Sub Task' : 'Create Sub Task'}
							</h2>
						</div>
						<div className="text-wrapper">
							<input
								type="text"
								placeholder="Task title"
								value={info?.subTaskTitle}
								onChange={(e) => updateModalInfo('subTaskTitle', e?.target?.value)}
							/>
							<textarea
								name=""
								id=""
								placeholder="Add description..."
								value={info?.subTaskDescription}
								onChange={(e) =>
									updateModalInfo('subTaskDescription', e?.target?.value)
								}
							></textarea>
						</div>
						<div className="properties-wrapper">
							<Status
								value={info?.subTaskStatus}
								showLabel={true}
								onOptionClick={(value) => updateModalInfo('subTaskStatus', value)}
								title={'Status'}
							/>
							<Priority
								value={info?.subTaskPriority}
								showLabel={true}
								onOptionClick={(value) => updateModalInfo('subTaskPriority', value)}
								title={'Priority'}
							/>
							{!isSubTask ? (
								<WorkFlow
									val={info?.subTaskWorkflowId}
									onOptionClick={(value) =>
										updateModalInfo('subTaskWorkflowId', value)
									}
									title={'Workflow'}
									{...responseMetadata?.['workflow']?.props}
								/>
							) : (
								''
							)}

							<div className="dateView-wrapper">
								<DateView
									value={info?.subTaskDueDate}
									onOptionClick={(value) =>
										updateModalInfo('subTaskDueDate', value)
									}
									title={'Due Date'}
									showIcon={true}
									customListItemStyle={{ margin: '0 6px' }}
								/>
							</div>
							<Person
								value={info?.subTaskAssignedTo || []}
								{...responseMetadata?.['assignedTo']?.props}
								onOptionClick={(value) =>
									updateModalInfo('subTaskAssignedTo', value)
								}
								title={'Assigned To'}
								multiSelect={true}
								parseValue={true}
								removeBtn={true}
							/>
						</div>
						<div className="footer-wrapper">
							{info?.isSubTaskEditing && (
								<button
									className="btn-cancel"
									onClick={() => {
										setInfo((prev) => ({
											...prev,
											showSubTaskCreate: false,
											isSubTaskEditing: false,
											editingSubTaskIndex: null,
											subTaskTitle: '',
											subTaskDescription: '',
											subTaskAssignedTo: [],
											subTaskDueDate: null,
											subTaskPriority: 'low',
											subTaskStatus: 'todo',
											subTaskWorkflowId: '',
										}));
									}}
								>
									Cancel
								</button>
							)}
							<button
								className="btn-createSubTask"
								onClick={handleAddSubTask}
								disabled={info?.isLoading || info?.subTaskTitle?.trim() === ''}
							>
								{info?.isSubTaskEditing ? 'Save Changes' : 'Create Sub Task'}
							</button>
						</div>
					</div>
				) : (
					<>
						{info?.childTasks?.length > 0 && (
							<div className="subtask-list-wrapper">
								<div className="subtask-list-header">
									<h2 className="subtask-list-title">Sub Tasks</h2>
									<span className="subtask-list-count">
										{info?.childTasks?.length}
									</span>
								</div>
								<div className="subtask-list-container">
									{info?.childTasks?.map((task, index) => (
										<div
											className="subtask-item"
											key={index}
											onClick={() => handleEditSubTask(index)}
										>
											<div className="subtask-item-title">{task?.title}</div>
											<DustbinIcon
												className="dustbin-icon"
												onClick={(e) => {
													e?.stopPropagation();
													handleDeleteSubTask(index);
												}}
											/>
										</div>
									))}
								</div>
								<div
									className="subtask-list-footer"
									onClick={() => updateModalInfo('showSubTaskCreate', true)}
								>
									<button className="btn-addSubTask">Add Sub Task</button>
								</div>
							</div>
						)}
						<div className="footer-wrapper">
							<button
								className="btn-createIssue"
								onClick={handleAddTask}
								disabled={info?.isLoading || info?.title.trim() === ''}
							>
								{info?.isLoading ? (
									<Spinner width={'20px'} height={'20px'} />
								) : (
									'Create Task'
								)}
							</button>
						</div>
					</>
				)}
			</div>
		</ReactModal>
	);
};

export default memo(CreateTaskPopup);
