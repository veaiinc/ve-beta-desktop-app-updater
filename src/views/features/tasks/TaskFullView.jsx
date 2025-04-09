import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import { ReactComponent as CloseSvg } from '../../../assets/svg/tasks/doubleRightArrow.svg';
import { ReactComponent as PieSvg } from '../../../assets/svg/tasks/pieHollow.svg';
import { ReactComponent as PrioritySvg } from '../../../assets/svg/tasks/roundChevronRight.svg';
import { ReactComponent as WorkflowSvg } from '../../../assets/svg/tasks/workflow.svg';
import { ReactComponent as PersonSvg } from '../../../assets/svg/tasks/person.svg';
import { ReactComponent as CalendarSvg } from '../../../assets/svg/tasks/calendar.svg';
import { ReactComponent as ClockSvg } from '../../../assets/svg/activity/clock.svg';
import { ReactComponent as DeleteSvg } from '../../../assets/svg/tasks/dustBin.svg';
import { ReactComponent as DotsSvg } from '../../../assets/svg/docs/vertidot.svg';
import { ReactComponent as PlusSvg } from '../../../assets/svg/tasks/plus.svg';
import QuickActions from '../../components/globalComponents/QuickActions';
import Status from '../../components/tasks/listView/Status';
import Priority from '../../components/tasks/listView/Priority';
import Person from '../../components/tasks/listView/Person';
import WorkFlow from '../../components/tasks/listView/WorkFlow';
import DateView from '../../components/tasks/listView/DateView';
import DeleteLeadModal from '../../components/modalsV2/workflowsModals/DeleteLeadModal.jsx';
import CreateTaskPopup from '../../components/modalsV2/tasks/CreateTaskPopup';
import CustomTextArea from '../../components/globalComponents/CusomTextArea';
import { Tooltip, Progress } from 'antd';
import moment from 'moment';
import '../../../assets/scss/tasks/taskFullView.scss';

const optionsForQuickActions = [
	{ id: 4, title: 'Document', value: 'document' },
	{ id: 6, title: 'Proposal', value: 'proposal' },
	{ id: 7, title: 'Invoice', value: 'invoice' },
	{ id: 8, title: 'Contract', value: 'contract' },
];

const TaskFullView = () => {
	const { taskId } = useParams();
	const navigate = useNavigate();
	const [taskData, setTaskData] = useState(null);
	const [description, setDescription] = useState('');
	const [info, setInfo] = useState({
		openMoreOptions: false,
		deleteLeadModal: false,
		createSubTaskModal: false,
		completedSubtaskCount: 0,
		totalSubtaskCount: 0,
	});

	const {
		tasks: {
			getTask,
			deleteListItem,
			updateListItem,
			getSubTasks,
			subTasks,
			addListItem,
			getTaskMetadata,
		},
		templates: { getWorkflowsList, workflowslist },
		companyInfo: { getTeamMembers, tenantsUserList },
	} = useContext(Context);

	const [responseMetadata, setResponseMetadata] = useState({
		status: {
			props: {
				options: {
					todo: [{ _id: 'todo', label: 'To-do', color: '1' }],
					inProgress: [{ _id: 'inProgress', label: 'In Progress', color: '2' }],
					completed: [{ _id: 'completed', label: 'Completed', color: '3' }],
				},
			},
		},
		priority: {
			props: {
				options: [
					{ label: 'Low', _id: 'low', color: '1' },
					{ label: 'Medium', _id: 'medium', color: '2' },
					{ label: 'High', _id: 'high', color: '3' },
				],
			},
		},
		workflow: {
			props: {
				options: [],
			},
		},
		assignedTo: {
			props: {
				options: [],
				multiSelect: true,
				parseValue: true,
			},
		},
	});

	const colors = {
		1: { backgroundColor: '#62344B', color: '#A35A7E' },
		2: { backgroundColor: '#373737', color: '#707070' },
		3: { backgroundColor: '#5B3D2F', color: '#8F614B' },
		4: { backgroundColor: '#7D4F27', color: '#B37339' },
		5: { backgroundColor: '#375841', color: '#588F69' },
		6: { backgroundColor: '#2F4469', color: '#4F71B3' },
		7: { backgroundColor: '#453061', color: '#6F4C99' },
	};

	useEffect(() => {
		const fetchTaskData = async () => {
			if (taskId) {
				try {
					const response = await getTask({ taskId: taskId });
					if (response) {
						setTaskData(response);
						setDescription(response.description || '');

						// Fetch subtasks
						getSubTasks({ taskId: taskId });

						// Fetch task metadata
						getTaskMetadata();
					}
				} catch (error) {
					console.error('Error fetching task:', error);
				}
			}
		};
		fetchTaskData();
	}, [taskId, getTask, getSubTasks, getTaskMetadata]);

	useEffect(() => {
		if (subTasks?.data) {
			const completedCount = subTasks.data.filter(
				(task) => task.status === 'completed',
			).length;

			setInfo((prev) => ({
				...prev,
				completedSubtaskCount: completedCount,
				totalSubtaskCount: subTasks.data.length,
			}));
		}
	}, [subTasks]);

	useEffect(() => {
		if (!workflowslist) {
			getWorkflowsList({
				filters: {
					limit: 20,
					page: 1,
				},
			});
		} else {
			setResponseMetadata((prev) => ({
				...prev,
				workflow: {
					...prev.workflow,
					props: {
						...prev.workflow.props,
						options: workflowslist?.data?.map(({ title, _id, templateId }) => ({
							label: title,
							_id,
							templateId,
						})),
					},
				},
			}));
		}
	}, [workflowslist, getWorkflowsList]);

	useEffect(() => {
		if (!tenantsUserList) {
			getTeamMembers();
		} else {
			const formattedUsers = tenantsUserList?.map(({ firstName, lastName, _id }) => ({
				label: `${firstName} ${lastName}`,
				value: _id,
			}));

			setResponseMetadata((prev) => ({
				...prev,
				assignedTo: {
					...prev.assignedTo,
					props: {
						...prev.assignedTo.props,
						options: formattedUsers,
					},
				},
			}));
		}
	}, [tenantsUserList, getTeamMembers]);

	const handleClose = () => {
		navigate(-1);
	};

	const handleMoreVisibility = (visible) => {
		setInfo((prev) => ({ ...prev, openMoreOptions: visible }));
	};

	const openDeleteModal = () => {
		setInfo((prev) => ({ ...prev, deleteLeadModal: true }));
		handleMoreVisibility(false);
	};

	const deleteTaskFunc = async () => {
		if (taskId) {
			const payload = { taskId: taskId };
			await deleteListItem(payload);
			setInfo((prev) => ({ ...prev, deleteLeadModal: false }));
			navigate('/tasks');
		}
	};

	const handleUpdate = async (propertyName, value) => {
		if (taskId) {
			try {
				const updatePayload =
					propertyName === 'workflow'
						? {
								workflowId: value,
								workflowTemplateId: responseMetadata.workflow.props.options.find(
									(workflow) => workflow._id === value,
								)?.templateId,
						  }
						: propertyName === 'assignedTo'
						? { assignedTo: { tenantUsers: value } }
						: { [propertyName]: value };

				await updateListItem({
					taskId: taskId,
					updateInput: updatePayload,
				});

				// Update local state
				setTaskData((prev) => ({
					...prev,
					...updatePayload,
					[propertyName]:
						propertyName === 'workflow'
							? responseMetadata.workflow.props.options.find((w) => w._id === value)
							: value,
				}));
			} catch (error) {
				console.error(`Error updating ${propertyName}:`, error);
			}
		}
	};

	const handleDescriptionChange = (e) => {
		const newDescription = e.target.value;
		setDescription(newDescription);

		// Update description after a delay
		if (taskId) {
			setTimeout(() => {
				updateListItem({
					taskId: taskId,
					updateInput: { description: newDescription },
				});
			}, 800);
		}
	};

	const openCreateSubTaskModal = () => {
		setInfo((prev) => ({ ...prev, createSubTaskModal: true }));
	};

	const closeCreateSubTaskModal = () => {
		setInfo((prev) => ({ ...prev, createSubTaskModal: false }));
	};

	const addNewSubTask = async (payload) => {
		payload.parentTaskId = taskId;
		await addListItem({ input: payload });

		// Refresh subtasks
		getSubTasks({ taskId: taskId });
		closeCreateSubTaskModal();
	};

	const handleSubTaskClick = (subTaskId) => {
		navigate(`/task/${subTaskId}`);
	};

	if (!taskData) {
		return (
			<div className="taskFullView">
				<div className="taskFullViewContent">
					<div className="loading">Loading...</div>
				</div>
			</div>
		);
	}

	return (
		<div className="taskFullView">
			<div className="taskFullViewContent">
				<div className="headerContainer">
					<div className="headerLeft">
						<CloseSvg onClick={handleClose} />
						<div className="taskTitle">{taskData.taskSlNo}</div>
					</div>
					{/* <div className="headerRight">
						<QuickActions
							customActions={optionsForQuickActions}
							clientDetails={taskData}
						/>
					</div> */}
					<DeleteSvg onClick={openDeleteModal} style={{ cursor: 'pointer' }} />
				</div>

				<div className="taskContainer">
					<div className="titleSection">
						<h1>
							<CustomTextArea
								value={taskData.title || ''}
								onChange={(e) => handleUpdate('title', e.target.value)}
								placeholder="Enter title"
								className="sidebar-title-input"
								autoResize={true}
							/>
						</h1>
					</div>

					<div className="propertiesSection">
						<div className="propertyItem">
							<div className="propertyLabel">
								<PersonSvg />
								<span>Assigned To</span>
							</div>
							<div className="propertyValue">
								<Person
									value={taskData.assignedTo}
									options={responseMetadata.assignedTo.props.options}
									onOptionClick={(value) => handleUpdate('assignedTo', value)}
									multiSelect={true}
									parseValue={true}
									removeBtn={true}
									title="Assigned To"
								/>
							</div>
						</div>

						<div className="propertyItem">
							<div className="propertyLabel">
								<PieSvg />
								<span>Status</span>
							</div>
							<div className="propertyValue status-badge">
								<Status
									value={taskData.status}
									options={responseMetadata.status.props.options}
									onOptionClick={(value) => handleUpdate('status', value)}
									colors={colors}
									showLabel={true}
								/>
							</div>
						</div>

						<div className="propertyItem">
							<div className="propertyLabel">
								<ClockSvg />
								<span>Due Date</span>
							</div>
							<div className="propertyValue">
								<DateView
									value={taskData.dueDate}
									onOptionClick={(value) => handleUpdate('dueDate', value)}
									title="Due Date"
									showIcon={true}
								/>
							</div>
						</div>

						<div className="propertyItem">
							<div className="propertyLabel">
								<PrioritySvg />
								<span>Priority</span>
							</div>
							<div className="propertyValue">
								<Priority
									value={taskData.priority}
									options={responseMetadata.priority.props.options}
									onOptionClick={(value) => handleUpdate('priority', value)}
								/>
							</div>
						</div>

						<div className="propertyItem">
							<div className="propertyLabel">
								<WorkflowSvg />
								<span>Project</span>
							</div>
							<div className="propertyValue">
								<WorkFlow
									value={taskData.workflow}
									options={responseMetadata.workflow.props.options}
									onOptionClick={(value) => handleUpdate('workflow', value)}
									title="Project"
								/>
							</div>
						</div>

						<div className="propertyItem">
							<div className="propertyLabel">
								<PersonSvg />
								<span>Assigned By</span>
							</div>
							<div className="propertyValue">
								{taskData.assignedBy?.name || 'No data'}
							</div>
						</div>

						<div className="propertyItem">
							<div className="propertyLabel">
								<CalendarSvg />
								<span>Assigned At</span>
							</div>
							<div className="propertyValue">
								{taskData.assignedAt
									? moment.unix(taskData.assignedAt).format('MMM DD')
									: 'No data'}
							</div>
						</div>

						<div className="propertyItem">
							<div className="propertyLabel">
								<CalendarSvg />
								<span>Created At</span>
							</div>
							<div className="propertyValue">
								{moment.unix(taskData.createdAt).format('MMM DD')}
							</div>
						</div>

						<div className="propertyItem">
							<div className="propertyLabel">
								<CalendarSvg />
								<span>Updated At</span>
							</div>
							<div className="propertyValue">
								{moment.unix(taskData.updatedAt).format('MMM DD')}
							</div>
						</div>

						<div className="propertyItem">
							<div className="propertyLabel">
								<PersonSvg />
								<span>Created By</span>
							</div>
							<div className="propertyValue">{taskData.createdBy?.name}</div>
						</div>

						<div className="propertyItem">
							<div className="propertyLabel">
								<PersonSvg />
								<span>Updated By</span>
							</div>
							<div className="propertyValue">{taskData.updatedBy?.name}</div>
						</div>
					</div>

					<div className="descriptionSection">
						<h3>Description</h3>
						<CustomTextArea
							value={description}
							onChange={handleDescriptionChange}
							placeholder="Enter description"
							className="sidebar-description-textarea"
							autoResize={true}
						/>
					</div>

					<div className="childTasksSection">
						<div className="childTasksHeader">
							<h3>Sub Tasks</h3>
							<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
								<span className="taskCount">
									<Progress
										type="circle"
										percent={
											(info.completedSubtaskCount /
												Math.max(info.totalSubtaskCount, 1)) *
											100
										}
										size={16}
										strokeColor={'#6055EC'}
										trailColor={'#2F2F2F'}
										strokeWidth={14}
									/>
									<span style={{ marginLeft: '8px' }}>
										{info.completedSubtaskCount}/{info.totalSubtaskCount}
									</span>
								</span>
								<div
									style={{
										cursor: 'pointer',
										display: 'flex',
										alignItems: 'center',
										background: 'var(--card-hover)',
										padding: '4px 8px',
										borderRadius: '4px',
									}}
									onClick={openCreateSubTaskModal}
								>
									<PlusSvg
										style={{
											width: '16px',
											height: '16px',
											marginRight: '4px',
										}}
									/>
								</div>
							</div>
						</div>
						<div className="childTasksList">
							{subTasks?.data?.map((childTask) => (
								<div
									key={childTask._id}
									className="childTaskItem"
									onClick={() => handleSubTaskClick(childTask._id)}
									style={{ cursor: 'pointer' }}
								>
									<div className="childTaskTitle">{childTask.title}</div>
									<div className="childTaskMeta">
										<span className="status">
											<Status
												value={childTask.status}
												options={responseMetadata.status.props.options}
												onOptionClick={(value) => {
													updateListItem({
														taskId: childTask._id,
														updateInput: { status: value },
													});
													// Refresh subtasks
													getSubTasks({ taskId: taskId });
												}}
												colors={colors}
												showLabel={true}
											/>
										</span>
										<span className="priority">
											<Priority
												value={childTask.priority}
												options={responseMetadata.priority.props.options}
												onOptionClick={(value) => {
													updateListItem({
														taskId: childTask._id,
														updateInput: { priority: value },
													});
													// Refresh subtasks
													getSubTasks({ taskId: taskId });
												}}
											/>
										</span>
										<span className="date">
											{childTask.dueDate
												? moment.unix(childTask.dueDate).format('MMM DD')
												: 'No date'}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			<DeleteLeadModal
				open={info.deleteLeadModal}
				closeModal={() => setInfo((prev) => ({ ...prev, deleteLeadModal: false }))}
				deleteLeadFunc={deleteTaskFunc}
			/>

			<CreateTaskPopup
				isOpen={info.createSubTaskModal}
				closeModal={closeCreateSubTaskModal}
				addNewTask={addNewSubTask}
				isSubTask={true}
				responseMetadata={responseMetadata}
				colors={colors}
			/>
		</div>
	);
};

export default TaskFullView;
