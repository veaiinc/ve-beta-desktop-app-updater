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
import QuickActions from '../../components/globalComponents/QuickActions';
import Status from '../../components/tasks/listView/Status';
import Priority from '../../components/tasks/listView/Priority';
import DeleteLeadModal from '../../components/modalsV2/workflowsModals/DeleteLeadModal.jsx';
import { Tooltip } from 'antd';
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
	const [info, setInfo] = useState({
		openMoreOptions: false,
		deleteLeadModal: false,
	});

	const {
		tasks: { getTask, deleteListItem, updateListItem },
	} = useContext(Context);

	useEffect(() => {
		const fetchTaskData = async () => {
			if (taskId) {
				try {
					const response = await getTask({ taskId: taskId });
					if (response) {
						setTaskData(response);
					}
				} catch (error) {
					console.error('Error fetching task:', error);
				}
			}
		};
		fetchTaskData();
	}, [taskId, getTask]);

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

	const handleStatusUpdate = async (newStatus) => {
		if (taskId) {
			try {
				await updateListItem({
					taskId: taskId,
					updateInput: { status: newStatus },
				});
				setTaskData((prev) => ({ ...prev, status: newStatus }));
			} catch (error) {
				console.error('Error updating status:', error);
			}
		}
	};

	const handlePriorityUpdate = async (newPriority) => {
		if (taskId) {
			try {
				await updateListItem({
					taskId: taskId,
					updateInput: { priority: newPriority },
				});
				setTaskData((prev) => ({ ...prev, priority: newPriority }));
			} catch (error) {
				console.error('Error updating priority:', error);
			}
		}
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
					<div className="headerRight">
						<QuickActions
							customActions={optionsForQuickActions}
							clientDetails={taskData}
						/>
						<Tooltip
							placement="bottomRight"
							open={info?.openMoreOptions}
							onOpenChange={handleMoreVisibility}
							arrow={false}
							trigger={'click'}
							color={'transparent'}
							overlayStyle={{ minWidth: 'fit-content', padding: '0' }}
							overlayClassName="dot-svg-tooltip"
							title={
								<div className="dot-svg-tooltip-content">
									<hr style={{ width: '100%', opacity: 0.1 }} />
									<div className="deleteItem" onClick={openDeleteModal}>
										<DeleteSvg />
										<span>Delete</span>
									</div>
								</div>
							}
						>
							<DotsSvg />
						</Tooltip>
					</div>
				</div>

				<div className="taskContainer">
					<div className="titleSection">
						<h1>{taskData.title}</h1>
					</div>

					<div className="propertiesSection">
						<div className="propertyItem">
							<div className="propertyLabel">
								<PersonSvg />
								<span>Assigned To</span>
							</div>
							<div className="propertyValue">
								{taskData.assignedTo?.name || 'Not assigned'}
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
									options={{
										todo: [{ _id: 'todo', title: 'To Do' }],
										inProgress: [{ _id: 'inProgress', title: 'In Progress' }],
										completed: [{ _id: 'completed', title: 'Completed' }],
									}}
									onUpdate={handleStatusUpdate}
									takeFullspace={true}
								/>
							</div>
						</div>

						<div className="propertyItem">
							<div className="propertyLabel">
								<ClockSvg />
								<span>Due Date</span>
							</div>
							<div className="propertyValue">
								{taskData.dueDate
									? moment.unix(taskData.dueDate).format('MMM DD')
									: 'No date'}
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
									options={[
										{ label: 'Low', _id: 'low', color: '1' },
										{ label: 'Medium', _id: 'medium', color: '2' },
										{ label: 'High', _id: 'high', color: '3' },
									]}
									onUpdate={handlePriorityUpdate}
									takeFullspace={true}
								/>
							</div>
						</div>

						{/* ... existing properties ... */}
					</div>

					{/* ... existing sections ... */}
				</div>
			</div>

			<DeleteLeadModal
				open={info.deleteLeadModal}
				closeModal={() => setInfo((prev) => ({ ...prev, deleteLeadModal: false }))}
				deleteLeadFunc={deleteTaskFunc}
			/>
		</div>
	);
};

export default TaskFullView;
