import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import ActionDetailsBlock from './ActionDetailsBlock';
import HeaderComponent from './HeaderComponent';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/templateTriggers.scss';

const TemplateTriggers = ({
	onClose,
	onSave,
	addTriggerLoading,
	triggerData,
	activeStepsData = null,
}) => {
	const [info, setInfo] = useState({
		title: '',
		description: '',
	});

	useEffect(() => {
		if (activeStepsData) {
			setInfo({
				title: activeStepsData?.title,
				description: activeStepsData?.description,
			});
		}
	}, [activeStepsData]);

	const updateInfo = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	};

	const customSaveFn = () => {
		if (!info?.title?.trim()) {
			message.error('Title is required');
			return;
		}
		if (!info?.description?.trim()) {
			message.error('Description is required');
			return;
		}
		onSave({
			app: 'inApp',
			title: info?.title,
			description: info?.description,
			type: 'trigger',
			triggerType: 'database',
			inApp: {
				module: 'template',
				event: triggerData?.event,
			},
		});
	};

	return (
		<div className="templateTriggerContainer">
			<HeaderComponent heading={`Template ${triggerData?.event}d`} onBack={onClose} />
			<ActionDetailsBlock
				actionLabel={`Template ${triggerData?.event}d`}
				heading="Triggers"
				title={info?.title}
				description={info?.description}
				updaterFn={updateInfo}
				onChangeButtonClick={onClose}
				showChangeButton={activeStepsData ? false : true}
			/>
			<div className="templateTriggerContainerBodyContent" />

			<div className="triggerSaveButtonContainer">
				<button
					className="triggerSaveButton"
					onClick={customSaveFn}
					disabled={addTriggerLoading}
				>
					{addTriggerLoading ? 'Saving...' : 'Save'}
				</button>
			</div>
		</div>
	);
};

export default TemplateTriggers;
