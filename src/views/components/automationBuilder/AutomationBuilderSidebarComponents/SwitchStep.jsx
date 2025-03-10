import React, { memo, useState } from 'react';
import ActionDetailsBlock from './ActionDetailsBlock';
import VariableComponent from './VariableComponent';
import ConditionInput from './ConditionInput';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/switchStep.scss';

const SwitchStep = ({
	variables,
	onSave,
	isLoading,
	hasNextNode,
	onBack,
	activeStepsData = null,
}) => {
	const [info, setInfo] = useState({
		title: '',
		description: '',
		conditions: [
			{ key: 'key', value: 'value', condition: 'isequalto' },
			{ key: 'key', value: 'value', condition: 'isequalto' },
			{ key: 'key', value: 'value', condition: 'isequalto' },
		],
		moveTo: `case1`,
	});

	const updateInfo = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const updateConditionData = (index, data) => {
		const newConditions = [...info?.conditions];

		newConditions[index] = { ...newConditions[index], ...data };
		updateInfo({ conditions: newConditions });
	};

	return (
		<>
			<ActionDetailsBlock
				actionLabel="Switch"
				heading="Conditions"
				title={info?.title}
				description={info?.description}
				updaterFn={updateInfo}
			/>
			<div className="switchStepInputContainer">
				<h3 className="switchStepInputHeading">Inputs</h3>
				{info?.conditions?.map((condition, index) => (
					<ConditionInput
						key={index}
						updateInfo={updateInfo}
						variables={variables?.data}
						title={`Case ${index + 1}`}
						value={condition?.value}
						condition={condition?.condition}
						conditionKey={condition?.key}
						onUpdateCondition={(data) => updateConditionData(index, data)}
					/>
				))}
				{hasNextNode && (
					<div className="switchStepInputConditionContainer">
						<span className="switchStepInputHeading">
							Where should the existing steps go?
						</span>
						<div className="switchStepInputCheckboxContainer">
							{info?.conditions?.map((_, index) => (
								<label htmlFor={`toYes${index}`} key={index}>
									<input
										type="checkbox"
										id={`toYes${index}`}
										checked={info?.moveTo === `case${index + 1}`}
										onChange={(e) => updateInfo({ moveTo: `case${index + 1}` })}
									/>
									{`Case ${index + 1}`}
								</label>
							))}
						</div>
					</div>
				)}
			</div>
			<button className="switchStepInputButton" onClick={() => {}} disabled={isLoading}>
				{isLoading ? 'Saving...' : 'Save'}
			</button>
		</>
	);
};

export default memo(SwitchStep);
