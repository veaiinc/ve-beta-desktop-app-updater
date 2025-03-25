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
import QuickActions from '../../components/globalComponents/QuickActions';
import moment from 'moment';
import '../../../assets/scss/tasks/taskFullView.scss';

const optionsForQuickActions = [
	{ id: 4, title: 'Document', value: 'document' },
	{ id: 6, title: 'Proposal', value: 'proposal' },
	{ id: 7, title: 'Invoice', value: 'invoice' },
	{ id: 8, title: 'Contract', value: 'contract' },
];

const TaskFullView = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [taskData, setTaskData] = useState(null);
	const {
		tasks: { getListItems, listTasks },
	} = useContext(Context);

	useEffect(() => {
		if (id) {
			// Using getListItems to fetch task data
			getListItems({
				taskFilterInput: {
					filters: [{ key: '_id', value: id }],
				},
			});
		}
	}, [id]);

	useEffect(() => {
		if (listTasks?.data?.[0]) {
			setTaskData(listTasks.data[0]);
		}
	}, [listTasks]);

	const handleClose = () => {
		navigate(-1);
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
								{taskData.assignedTo?.name || 'Assigned To'}
							</div>
						</div>

						<div className="propertyItem">
							<div className="propertyLabel">
								<PieSvg />
								<span>Status</span>
							</div>
							<div className="propertyValue status-badge">Department</div>
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
							<div
								className={`propertyValue priority-${taskData.priority?.toLowerCase()}`}
							>
								{taskData.priority || 'No priority'}
							</div>
						</div>

						<div className="propertyItem">
							<div className="propertyLabel">
								<WorkflowSvg />
								<span>Project</span>
							</div>
							<div className="propertyValue">
								{taskData.workflow?.title || 'Select project'}
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

					{taskData.childTasks?.length > 0 && (
						<div className="childTasksSection">
							<div className="childTasksHeader">
								<h3>Sub Tasks</h3>
								<span className="taskCount">
									{
										taskData.childTasks.filter(
											(task) => task.status === 'completed',
										).length
									}
									/{taskData.childTasks.length}
								</span>
							</div>
							<div className="childTasksList">
								{taskData.childTasks.map((childTask) => (
									<div key={childTask._id} className="childTaskItem">
										<div className="childTaskTitle">{childTask.title}</div>
										<div className="childTaskMeta">
											<span className="status">{childTask.status}</span>
											<span className="priority">Medium</span>
											<span className="date">Feb 08</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{taskData.description && (
						<div className="descriptionSection">
							<textarea
								placeholder="Enter description"
								value={taskData.description}
								readOnly
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default TaskFullView;
