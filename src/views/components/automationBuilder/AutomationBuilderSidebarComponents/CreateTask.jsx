import React, { memo, useCallback, useEffect, useState } from 'react';
import ActionDetailsBlock from './ActionDetailsBlock';
import { message, Spin } from 'antd';
import moment from 'moment';
import VariableComponent from './VariableComponent';
import HeaderComponent from './HeaderComponent';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/inAppActions.scss';

const CreateTask = ({
	onBack,
	onSave,
	addTriggerLoading,
	variables,
	activeStepsData,
	handleChangeClick,
}) => {
	const [info, setInfo] = useState({
		title: '',
		dueDate: '',
		assignee: '',
		stepTitle: '',
		stepDescription: '',
		loading: false,
	});

	useEffect(() => {
		if (activeStepsData) {
			setInfo((prev) => ({
				...prev,
				title: activeStepsData?.inputBody?.title,
				dueDate: new Date(activeStepsData?.inputBody?.dueDate * 1000)
					.toISOString()
					.split('T')[0],
				stepTitle: activeStepsData?.title,
				stepDescription: activeStepsData?.description,
			}));
		}
	}, [activeStepsData]);

	const createNewTaskNode = useCallback(async () => {
		const variableRegex = /^\{\{.*\}\}$/;
		let { title, stepTitle, stepDescription, dueDate } = info;
		const variables = {};
		if (title?.match(variableRegex)) {
			variables.title = [title?.slice(2, -2)];
		} else if (!title?.trim().length) {
			message.error('Task title is mandatory');
			return;
		}
		if (!stepTitle?.trim().length) {
			message.error('Step title is mandatory');
			return;
		}
		if (!stepDescription?.trim().length) {
			message.error('Step description is mandatory');
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
			title: stepTitle,
			description: stepDescription,
			actionType: 'createTask',
			inputBody: {
				title: title,
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

	const onChangeButtonClick = useCallback(() => {
		if (activeStepsData) {
			handleChangeClick(activeStepsData?.app);
		} else {
			onBack();
		}
	}, [handleChangeClick, activeStepsData, onBack]);

	return (
		<div className="inAppActionsContainer">
			<HeaderComponent onBack={onBack} heading="Create Task" />
			<ActionDetailsBlock
				heading="Actions"
				actionLabel="Create Task"
				title={info?.stepTitle}
				description={info?.stepDescription}
				updaterFn={(data) => {
					if (data?.title) {
						updateInfo({ stepTitle: data?.title });
					}
					if (data?.description) {
						updateInfo({ stepDescription: data?.description });
					}
				}}
				onChangeButtonClick={onChangeButtonClick}
			/>
			<div className="inAppActionsInputsContainer">
				<h2 className="InputBlockHeading">Inputs</h2>
				<div className="inputWrapper">
					<span className="inputLabel">Task</span>
					<VariableComponent
						variables={variables?.data}
						onChange={(value) => updateInfo({ title: value })}
						value={info?.title}
					/>
				</div>
				<div className="inputWrapper">
					<span className="inputLabel">Due Date</span>

					<VariableComponent
						variables={variables?.data}
						onChange={(value) => updateInfo({ dueDate: value })}
						type="date"
						value={info?.dueDate}
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
