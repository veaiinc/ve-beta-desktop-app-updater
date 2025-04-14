import React, { memo, useCallback, useState } from 'react';
import ActionDetailsBlock from './ActionDetailsBlock';
import { Spin } from 'antd';
import VariableComponent from './VariableComponent';
import HeaderComponent from './HeaderComponent';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/inAppActions.scss';

const CreateMeeting = ({ onBack, onSave, addTriggerLoading, variables }) => {
	const [info, setInfo] = useState({
		title: '',
		description: '',
		meetingTitle: '',
		meetingDescription: '',
		agenda: '',
		location: '',
		meetingLink: '',
		attendees: '',
		startTime: '',
		endTime: '',
		category: '',
	});

	const createNewTaskNode = useCallback(async () => {
		// const variableRegex = /^\{\{.*\}\}$/;
		// let { task, title, description, dueDate } = info;
		// const variables = {};
		// if (task?.match(variableRegex)) {
		// 	variables.task = [task?.slice(2, -2)];
		// } else if (!task?.trim().length) {
		// 	message.error('Task name is mandatory');
		// 	return;
		// }
		// if (!title?.trim().length) {
		// 	message.error('Title is mandatory');
		// 	return;
		// }
		// if (!description?.trim().length) {
		// 	message.error('Title is mandatory');
		// 	return;
		// }
		// if (dueDate?.match(variableRegex)) {
		// 	variables.dueDate = [dueDate?.slice(2, -2)];
		// } else if (!dueDate) {
		// 	message.error('Due date is mandatory');
		// 	return;
		// } else {
		// 	dueDate = moment(dueDate).unix();
		// }
		// const payload = {
		// 	title,
		// 	description,
		// 	actionType: 'createTask',
		// 	inputBody: {
		// 		title: task,
		// 		dueDate: dueDate,
		// 		action: 'createTask',
		// 	},
		// };
		// if (Object.keys(variables)?.length) {
		// 	payload.variables = variables;
		// }
		// onSave(payload);
	}, [info, onSave]);

	const updateInfo = useCallback((data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);
	return (
		<div className="inAppActionsContainer">
			<HeaderComponent onBack={onBack} heading="Create Meeting" />
			<ActionDetailsBlock
				heading="Actions"
				actionLabel="Create Meeting"
				title={info?.title}
				description={info?.description}
				updaterFn={updateInfo}
				onChangeButtonClick={onBack}
			/>
			<div className="inAppActionsInputsContainer">
				<h2 className="InputBlockHeading">Inputs</h2>
				<div className="inputWrapper">
					<span className="inputLabel">Agenda</span>
					<VariableComponent
						variables={variables?.data}
						value={info?.meetingTitle}
						onChange={(value) => updateInfo({ meetingTitle: value })}
						type="text"
					/>
				</div>
				<div className="inputWrapper">
					<span className="inputLabel">Description</span>

					<VariableComponent
						variables={variables?.data}
						value={info?.meetingDescription}
						onChange={(value) => updateInfo({ meetingDescription: value })}
						type="text"
					/>
				</div>
				<div className="inputWrapper">
					<span className="inputLabel">Start Time</span>

					<VariableComponent
						variables={variables?.data}
						value={info?.startTime}
						onChange={(value) => updateInfo({ startTime: value })}
						type="datetime-local"
					/>
				</div>
				<div className="inputWrapper">
					<span className="inputLabel">End Time</span>

					<VariableComponent
						variables={variables?.data}
						value={info?.endTime}
						onChange={(value) => updateInfo({ endTime: value })}
						type="datetime-local"
					/>
				</div>
				<div className="inputWrapper">
					<span className="inputLabel">Category</span>

					<VariableComponent
						variables={variables?.data}
						value={info?.category}
						onChange={(value) => updateInfo({ category: value })}
						type="dropdown"
					/>
				</div>
				<div className="inputWrapper">
					<span className="inputLabel">Location</span>

					<VariableComponent
						variables={variables?.data}
						onChange={(value) => updateInfo({ location: value })}
						type="text"
					/>
				</div>
				<div className="inputWrapper">
					<span className="inputLabel">Meeting Link</span>

					<VariableComponent
						variables={variables?.data}
						onChange={(value) => updateInfo({ meetingLink: value })}
						type="text"
					/>
				</div>
				<div className="inputWrapper">
					<span className="inputLabel">Attendees</span>

					<VariableComponent
						variables={variables?.data}
						onChange={(value) => updateInfo({ attendees: value })}
						type="text"
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

export default memo(CreateMeeting);
