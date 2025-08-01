import React, { useCallback, useContext, useEffect, useState } from 'react';
import './TaskCard.scss';
import Context from '../../../../../src/context/context';
import { colors } from '../../../../../src/helpers/taskHelpers';
import { ReactComponent as PrioritySvg } from '../../../../../src/assets/svg/tasks/ChartBar.svg';
import Status from '../../../../../src/views/components/tasks/listView/Status';
import DateView from '../../../../../src/views/components/tasks/listView/DateView';
import Person from '../../../../../src/views/components/tasks/listView/Person';
import Select from '../../../../../src/views/components/tasks/listView/Select';

function TaskCard({ updateTask, task }) {
	const {
		tasks: { taskMetadata, getTaskMetadata },
		companyInfo: { getTeamMembers, tenantsUserList },
	} = useContext(Context);

	const [localTask, setLocalTask] = useState({
		assignedTo: [],
		priority:
			[
				{ label: 'Low', _id: 'low', color: '6' },
				{ label: 'Medium', _id: 'medium', color: '4' },
				{ label: 'High', _id: 'high', color: '1' },
			] || 'low',
		status:
			{
				todo: taskMetadata?.todoGroupLabels,
				inProgress: taskMetadata?.inProgressGroupLabels,
				completed: taskMetadata?.completedGroupLabels,
			} || '',
		title: task.title || '',
		dueDate: task.dueDate || null,
		task: task,
		// Add other fields as needed
	});

	const [info, setInfo] = useState({
		showTeamMembers: false,
		clients: tenantsUserList || [],
		priority: {
			type: 'select',
			name: 'Priority',
			Icon: PrioritySvg,
			props: {
				options: [
					{ label: 'Low', _id: 'low', color: '6' },
					{ label: 'Medium', _id: 'medium', color: '4' },
					{ label: 'High', _id: 'high', color: '1' },
				],
			},
		},
		options: {
			todo: taskMetadata?.todoGroupLabels,
			inProgress: taskMetadata?.inProgressGroupLabels,
			completed: taskMetadata?.completedGroupLabels,
		},
		subTaskStatus: taskMetadata?.todoGroupLabels || [],

		updatedTask: task,
		assignedTo: [],
		dueDate: null,
	});

	useEffect(() => {
		if (!tenantsUserList || tenantsUserList.length === 0) {
			getTeamMembers();
		}
		if (!taskMetadata || taskMetadata?.length === 0) {
			getTaskMetadata();
		}
		if (taskMetadata) {
			setInfo((prevInfo) => ({
				...prevInfo,
				options: {
					todo: taskMetadata?.todoGroupLabels,
					inProgress: taskMetadata?.inProgressGroupLabels,
					completed: taskMetadata?.completedGroupLabels,
				},
			}));
		}
	}, [tenantsUserList, taskMetadata]);

	useEffect(() => {
		setLocalTask({
			assignedTo: task.assignedTo || [{ name: 'test', _id: 'test' }],
			priority: task.priority || 'low',
			status: task.status || '',
			title: task.title || '',
			dueDate: task.dueDate || null,
			// Add other fields as needed
		});
	}, [task]);

	const handleFieldChange = (key, value) => {
		const updated = {
			...localTask,
			[key]: value, // Remove the conditional wrapping
		};
		setLocalTask(updated);
		updateTask(task, {
			...task,
			[key]: key === 'assignedTo' ? { tenantUsers: value } : value, // Keep the API format only for updateTask
		});
	};

	const updateModalInfo = useCallback((key, value) => {
		setInfo((prevInfo) => ({ ...prevInfo, [key]: value }));
		updateTask(task, { ...task, [key]: value });
	}, []);

	return (
		<div className="taskCard">
			{/* <div className="taskCard-header">
				<div className="taskCard-title">{title}</div>
			</div> */}

			<div className="taskCard-body">
				<div className="taskCard-row">
					<div className="taskCard-info">
						<div className="taskCard-label">ASSIGNED TO</div>

						<div className="team-manager">
							<Person
								value={
									Array.isArray(localTask?.assignedTo)
										? localTask?.assignedTo
										: localTask?.assignedTo?.tenantUsers || []
								}
								onOptionClick={(value) => handleFieldChange('assignedTo', value)}
								showTitle={false}
								title={'Assigned To'}
								multiSelect={true}
								parseValue={true}
								removeBtn={true}
								options={tenantsUserList}
								disabled={false}
								showLabel={true}
							/>
							{/* <TeamMembers
								assignedUsers={task?.assignedTo || []}
								teamMembers={tenantsUserList || []}
								title={'Assigned To'}
								onSelectedMembersChange={(value) =>
									handleFieldChange('assignedTo', value)
								}
							/> */}
						</div>
					</div>

					<div className="taskCard-info">
						<div className="taskCard-label">Priority</div>
						<div className={`taskCard-priority`}>
							<Select
								value={task?.priority || 'low'}
								onOptionClick={(value) => handleFieldChange('priority', value)}
								title={'Priority'}
								colors={colors}
								options={[
									{ label: 'Low', _id: 'low', color: '6' },
									{ label: 'Medium', _id: 'medium', color: '4' },
									{ label: 'High', _id: 'high', color: '1' },
								]}
							/>
							{/* <PrioritySelect
								value={task?.priority || 'low'}
								onOptionClick={(value) => handleFieldChange('priority', value)}
								options={[
									{ label: 'Low', _id: 'low', color: '6' },
									{ label: 'Medium', _id: 'medium', color: '4' },
									{ label: 'High', _id: 'high', color: '1' },
								]}
							/> */}
						</div>
					</div>
					<div className="taskCard-info">
						<div className="taskCard-label">Due Date</div>
						<DateView
							value={task?.dueDate}
							onOptionClick={(value) => handleFieldChange('dueDate', value)}
							title={'Due Date'}
							showIcon={true}
							customListItemStyle={{ margin: '0 6px' }}
						/>
						{/* <DateSelection
							value={task?.dueDate} // This should be epoch timestamp
							onChange={(epochValue) => handleFieldChange('dueDate', epochValue)}
							title={'Due Date'}
							showTime={true}
							format="YYYY-MM-DD HH:mm"
							placeholder="Select due date"
						/> */}
					</div>

					<div className="taskCard-info">
						<div className="taskCard-label">Status</div>
						<Status
							value={task?.status || taskMetadata?.todoGroupLabels?.[0]?._id}
							showLabel={true}
							options={info?.options}
							onOptionClick={(value) => handleFieldChange('status', value)}
							title={'Status'}
							colors={colors}
							setDefault={info?.isSubTaskEditing ? false : true}
						/>
						{/* <StatusSelection
							value={task?.status || 'Pending'}
							placeholder={'Select Status'}
							onOptionClick={(value) => handleFieldChange('status', value)}
							options={[
								{ id: 'pending', label: 'Pending', color: '#f59e0b' },
								{ id: 'in-progress', label: 'In Progress', color: '#3b82f6' },
								{ id: 'completed', label: 'Completed', color: '#10b981' },
								{ id: 'cancelled', label: 'Cancelled', color: '#ef4444' },
							]}
							title={'Status'}
							colors={colors}
						/> */}
					</div>
				</div>

				<div className="taskCard-footer">
					<div className="taskCard-metrics">
						<div className="taskCard-section">
							<div className="taskCard-label">Description</div>
							<p className="taskCard-description">{task?.description}</p>
						</div>
						<div className="taskCard-info">
							<div className="taskCard-label">Qty</div>
							<div className="taskCard-value">{task?.quantity}</div>
						</div>
						<div className="taskCard-info">
							<div className="taskCard-label">Unit</div>
							<div className="taskCard-value">{task?.unit || ''}</div>
						</div>
						<div className="taskCard-info">
							<div className="taskCard-label">Price</div>
							<div className="taskCard-value">${task?.amount}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default TaskCard;
