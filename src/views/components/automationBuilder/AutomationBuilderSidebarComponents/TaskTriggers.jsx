import React, { useCallback, useEffect, useMemo, useState } from 'react';
import HeaderComponent from './HeaderComponent';
import ActionDetailsBlock from './ActionDetailsBlock';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/taskTriggers.scss';
import { Tooltip } from 'antd';

const taskFields = [
	{
		label: 'Title',
		value: 'title',
	},
	{
		label: 'Description',
		value: 'description',
	},
	{
		label: 'Status',
		value: 'status',
	},
	{
		label: 'Priority',
		value: 'priority',
	},
	{
		label: 'Assignee',
		value: 'ssignedTo',
	},
	{
		label: 'Due Date',
		value: 'dueDate',
	},
	{
		label: 'Updated By',
		value: 'updatedBy',
	},
	{
		label: 'Assigned By',
		value: 'assignedBy',
	},
	{
		label: 'Assigned At',
		value: 'assignedAt',
	},
	{
		label: 'Updated At',
		value: 'updatedAt',
	},
];

const TaskTriggers = ({ onClose, onSave, addTriggerLoading, triggerData }) => {
	const [info, setInfo] = useState({
		title: '',
		description: '',
		type: 'trigger',
		app: 'inApp',
		triggerType: 'database',
	});

	const updateStateInfo = useCallback((updatedInfo) => {
		setInfo((prev) => ({ ...prev, ...updatedInfo }));
	}, []);

	const eventMapper = useMemo(() => {
		return {
			create: (
				<CreateTaskTrigger
					onSave={onSave}
					info={info}
					addTriggerLoading={addTriggerLoading}
				/>
			),
			update: (
				<UpdateTaskTrigger
					onSave={onSave}
					info={info}
					addTriggerLoading={addTriggerLoading}
				/>
			),
			delete: (
				<DeleteTaskTrigger
					onSave={onSave}
					info={info}
					addTriggerLoading={addTriggerLoading}
				/>
			),
		};
	}, [onSave, info, addTriggerLoading]);

	return (
		<div className="taskTriggerContainer">
			<HeaderComponent onBack={onClose} heading={`Task ${triggerData?.event}d`} />
			<ActionDetailsBlock
				type="trigger"
				actionLabel={`Task ${triggerData?.event}d`}
				heading={'Trigger'}
				description={info?.description}
				title={info?.title}
				updaterFn={(updatedData) => {
					updateStateInfo(updatedData);
				}}
				onChangeButtonClick={onClose}
			/>
			<div className="taskTriggerContent">{eventMapper?.[triggerData?.event]}</div>
		</div>
	);
};

export default TaskTriggers;

const CreateTaskTrigger = ({ onSave, info, addTriggerLoading }) => {
	return (
		<>
			<div className="taskTriggerInputContainer"> </div>
			<button
				className="taskTriggerContentButton"
				disabled={addTriggerLoading}
				onClick={() =>
					onSave({
						...info,
						inApp: { module: 'task', event: 'create' },
					})
				}
			>
				{addTriggerLoading ? 'Saving...' : 'Save Trigger'}
			</button>
		</>
	);
};

const UpdateTaskTrigger = ({ onSave, info, addTriggerLoading }) => {
	const [updateInfo, setUpdateInfo] = useState({
		selectedFields: [],
		isOpen: false,
	});

	const handleFieldSelection = (field) => {
		if (updateInfo.selectedFields.some((f) => f?.value === field?.value)) {
			setUpdateInfo((prev) => ({
				...prev,
				selectedFields: prev?.selectedFields?.filter((f) => f?.value !== field?.value),
			}));
		} else {
			setUpdateInfo((prev) => ({
				...prev,
				selectedFields: [...prev.selectedFields, field],
			}));
		}
	};

	const handleOpenTooltip = (value) => {
		setUpdateInfo((prev) => ({
			...prev,
			isOpen: value,
		}));
	};

	const handleRemoveField = (fieldValue) => {
		setUpdateInfo((prev) => ({
			...prev,
			selectedFields: prev?.selectedFields?.filter((field) => field?.value !== fieldValue),
		}));
	};

	return (
		<>
			<div className="taskTriggerInputContainer">
				<h3 className="taskTriggerInputHeading">Inputs</h3>
				<div className="taskTriggerInputItem">
					<span className="taskTriggerInputLabel">Select fields</span>
					<Tooltip
						placement="bottomLeft"
						arrow={false}
						color="transparent"
						trigger="click"
						onOpenChange={(visible) => {
							if (!visible) {
								handleOpenTooltip(false);
							}
						}}
						title={
							<div className="taskTriggerInputTooltip">
								{taskFields?.map((field) => (
									<span
										key={field?.value}
										className={`taskTriggerInputTooltipItem ${
											updateInfo?.selectedFields?.some(
												(f) => f?.value === field?.value,
											)
												? 'taskTriggerInputTooltipItemSelected'
												: ''
										}`}
										onClick={() => handleFieldSelection(field)}
									>
										{field?.label}
									</span>
								))}
							</div>
						}
					>
						<div
							className="taskTriggerInputTooltipTrigger"
							onClick={() => handleOpenTooltip(true)}
						>
							{updateInfo?.selectedFields?.length > 0 ? (
								updateInfo?.selectedFields?.map((field) => (
									<div
										key={field?.value}
										className="taskTriggerInputTooltipTriggerItem"
									>
										{field?.label}
										<span
											className="removeField"
											onClick={(e) => {
												e.stopPropagation();
												handleRemoveField(field?.value);
											}}
										>
											×
										</span>
									</div>
								))
							) : (
								<div className="taskTriggerInputTooltipTriggerPlaceholder">
									Select fields
								</div>
							)}
						</div>
					</Tooltip>
				</div>
			</div>
			<button
				className="taskTriggerContentButton"
				disabled={addTriggerLoading}
				onClick={() =>
					onSave({
						...info,
						inApp: {
							module: 'task',
							event: 'update',
							fields: updateInfo.selectedFields?.map((field) => field.value),
						},
					})
				}
			>
				{addTriggerLoading ? 'Saving...' : 'Save Trigger'}
			</button>
		</>
	);
};

const DeleteTaskTrigger = ({ onSave, info, addTriggerLoading }) => {
	return (
		<>
			<div className="taskTriggerInputContainer"> </div>
			<button
				className="taskTriggerContentButton"
				disabled={addTriggerLoading}
				onClick={() =>
					onSave({
						...info,
						inApp: { module: 'task', event: 'delete' },
					})
				}
			>
				{addTriggerLoading ? 'Saving...' : 'Save Trigger'}
			</button>
		</>
	);
};
