import React, { memo, useCallback, useState } from 'react';
import ActionDetailsBlock from './ActionDetailsBlock';
import { message, Spin } from 'antd';
import moment from 'moment';
import VariableComponent from './VariableComponent';
import HeaderComponent from './HeaderComponent';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/inAppActions.scss';

const CreateTask = ({ onBack, onSave, addTriggerLoading, variables }) => {
	const [info, setInfo] = useState({
		task: '',
		dueDate: '',
		assignee: '',
		title: '',
		description: '',
		loading: false,
	});

	const createNewTaskNode = useCallback(async () => {
		const variableRegex = /^\{\{.*\}\}$/;
		let { task, title, description, dueDate } = info;
		const variables = {};
		if (task?.match(variableRegex)) {
			variables.task = [task?.slice(2, -2)];
		} else if (!task?.trim().length) {
			message.error('Task name is mandatory');
			return;
		}
		if (!title?.trim().length) {
			message.error('Title is mandatory');
			return;
		}
		if (!description?.trim().length) {
			message.error('Title is mandatory');
			return;
		}
		if (dueDate?.match(variableRegex)) {
			variables.dueDate = [dueDate?.slice(2, -2)];
		} else if (!dueDate) {
			message.error('Due date is mandatory');
			return;
		} else {
			dueDate = moment(dueDate).unix();
		}

		const payload = {
			title,
			description,
			actionType: 'createTask',
			inputBody: {
				title: task,
				dueDate: dueDate,
				action: 'createTask',
			},
		};
		if (Object.keys(variables)?.length) {
			payload.variables = variables;
		}

		onSave(payload);
	}, [info, onSave]);

	const updateInfo = useCallback((data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);
	return (
		<div className="inAppActionsContainer">
			<HeaderComponent onBack={onBack} heading="Create Task" />
			<ActionDetailsBlock
				heading="Actions"
				actionLabel="Create Task"
				title={info?.title}
				description={info?.description}
				updaterFn={updateInfo}
				onChangeButtonClick={onBack}
			/>
			<div className="inAppActionsInputsContainer">
				<h2 className="InputBlockHeading">Inputs</h2>
				<div className="inputWrapper">
					<span className="inputLabel">Task</span>
					<VariableComponent
						variables={variables?.data}
						onChange={(value) => updateInfo({ task: value })}
					/>
				</div>
				<div className="inputWrapper">
					<span className="inputLabel">Due (optional)</span>

					<VariableComponent
						variables={variables?.data}
						onChange={(value) => updateInfo({ dueDate: value })}
						type="date"
					/>
				</div>
			</div>

			<button
				className="actionsSaveButton"
				onClick={createNewTaskNode}
				disabled={addTriggerLoading}
			>
				{addTriggerLoading ? <Spin /> : 'Save'}
			</button>
		</div>
	);
};

export default memo(CreateTask);
