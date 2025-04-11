import React, { memo, useState, useEffect } from 'react';
import ActionDetailsBlock from './ActionDetailsBlock';
import VariableComponent from './VariableComponent';
import ConditionInput from './ConditionInput';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/switchStep.scss';
import { message } from '../../globalComponents/CustomToast';

const conditionsList = [
	{
		label: 'Is exist',
		value: 'isexit',
	},
	{
		label: 'Does not exist',
		value: 'doesnotexist',
	},
	{
		label: 'Is empty',
		value: 'isempty',
	},
	{
		label: 'Is not empty',
		value: 'isnotempty',
	},
	{
		label: 'Is equal to',
		value: 'isequalto',
		needValue: true,
	},
	{
		label: 'Is not equal to',
		value: 'isnotequalto',
		needValue: true,
	},
	{
		label: 'Contains',
		value: 'contains',
		needValue: true,
	},
	{
		label: 'Does not contain',
		value: 'doesnotcontain',
		needValue: true,
	},
	{
		label: 'Is true',
		value: 'istrue',
	},
	{
		label: 'Is false',
		value: 'isfalse',
	},
];

const variableRegex = /^\{\{.*\}\}$/;

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
		conditions: [{ key: '', value: '', condition: '' }],
		moveTo: `case1`,
	});

	useEffect(() => {
		if (activeStepsData) {
			// Convert inputBody cases to conditions array
			const conditions = Object.entries(activeStepsData?.inputBody || {}).map(
				([caseKey, caseData]) => ({
					key: caseData.key,
					condition: caseData.condition,
					value: caseData.value || '',
				}),
			);

			// Find which case has the next steps
			const moveToCase =
				Object.entries(activeStepsData?.cases || {}).find(
					([key, value]) => value.nextStepId !== null,
				)?.[0] || 'case1';

			updateInfo({
				title: activeStepsData?.title,
				description: activeStepsData?.description,
				conditions: conditions,
				moveTo: moveToCase,
			});
		}
	}, [activeStepsData]);

	const updateInfo = (data) => {
		setInfo((prevInfo) => ({ ...prevInfo, ...data }));
	};

	const updateConditionData = (index, data) => {
		const newConditions = [...info?.conditions];

		newConditions[index] = { ...newConditions[index], ...data };
		updateInfo({ conditions: newConditions });
	};
	const addNewCondition = () => {
		updateInfo({
			conditions: [...info?.conditions, { key: '', value: '', condition: '' }],
		});
	};
	const removeCondition = (index) => {
		const newConditions = [...info?.conditions];
		newConditions?.splice(index, 1);
		updateInfo({ conditions: newConditions });
	};

	const handleSave = () => {
		if (!info?.title) {
			message.error('Title is required');
			return;
		}

		if (!info?.description) {
			message.error('Description is required');
			return;
		}

		const hasEmptyCondition = info?.conditions?.some((condition) => {
			const selectedCondition = conditionsList.find((c) => c.value === condition.condition);
			const isValueRequired = selectedCondition?.needValue;
			const isValueEmpty = isValueRequired && condition.value === '';
			return condition.key === '' || condition.condition === '' || isValueEmpty;
		});

		if (hasEmptyCondition) {
			message.error('Please fill all the required fields');
			return;
		}

		// Format the payload
		const formattedPayload = {
			title: info?.title,
			description: info?.description,
			type: 'switch',
			...(!activeStepsData && { moveTo: info?.moveTo }),
			variables: {},
			inputBody: {},
		};

		// Format conditions into cases
		info?.conditions?.forEach((condition, index) => {
			const caseNumber = `case${index + 1}`;

			// Only add to variables if key is in {{}} format
			if (variableRegex.test(condition.key)) {
				const key = condition.key.slice(2, -2); // Remove {{ }}
				formattedPayload.variables[caseNumber] = {
					key: [key],
				};
			}

			// Format inputBody
			formattedPayload.inputBody[caseNumber] = {
				key: condition.key,
				condition: condition.condition,
				...(condition.value && { value: condition.value }),
			};
		});

		onSave(formattedPayload);
	};

	return (
		<>
			<ActionDetailsBlock
				actionLabel="Switch"
				heading="Conditions"
				title={info?.title}
				description={info?.description}
				updaterFn={updateInfo}
				showChangeButton={activeStepsData ? false : true}
			/>
			<div className="switchStepInputContainer">
				<h3 className="switchStepInputHeading">Inputs</h3>
				{info?.conditions?.map((condition, index) => (
					<React.Fragment key={index}>
						<ConditionInput
							updateInfo={updateInfo}
							variables={variables?.data}
							title={`Case ${index + 1}`}
							value={condition?.value}
							condition={condition?.condition}
							conditionKey={condition?.key}
							onUpdateCondition={(data) => updateConditionData(index, data)}
						/>
						{info?.conditions?.length > 1 && (
							<button
								className="switchStepInputRemoveCaseButton"
								onClick={() => removeCondition(index)}
							>
								Remove case
							</button>
						)}
						{index !== info?.conditions?.length - 1 && (
							<div className="switchStepInputSeparator"></div>
						)}
					</React.Fragment>
				))}
				<button className="switchStepInputAddConditionButton" onClick={addNewCondition}>
					Add new case
				</button>
				{/* Only show moveTo UI if there's no activeStepsData and hasNextNode is true */}
				{!activeStepsData && hasNextNode && (
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
			<button className="switchStepInputButton" onClick={handleSave} disabled={isLoading}>
				{isLoading ? 'Saving...' : 'Save'}
			</button>
		</>
	);
};

export default memo(SwitchStep);
