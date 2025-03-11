import React, { memo, useCallback, useEffect, useState } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/ifElse.scss';
import ActionDetailsBlock from './ActionDetailsBlock';
import { message, Tooltip } from 'antd';
import VariableComponent from './VariableComponent';

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

const IfElse = ({ variables, onSave, isLoading, hasNextNode, onBack, activeStepsData = null }) => {
	const [info, setInfo] = useState({
		heading: 'Conditions',
		title: '',
		description: '',
		open: false,
		key: '',
		selectedCondition: null,
		value: '',
		moveToYes: true,
	});

	useEffect(() => {
		if (activeStepsData) {
			setInfo((prev) => ({
				...prev,
				title: activeStepsData?.title,
				description: activeStepsData?.description,
				key: activeStepsData?.inputBody?.key,
				selectedCondition: conditionsList.find(
					(condition) => condition?.value === activeStepsData?.inputBody?.condition,
				),
				value: activeStepsData?.inputBody?.value,
			}));
		}
	}, [activeStepsData]);

	const updateInfo = useCallback((data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	const handleOpen = useCallback((value) => {
		setInfo((prev) => ({ ...prev, open: value }));
	}, []);

	const handleAddCondition = useCallback(() => {
		const variableRegex = /^\{\{.*\}\}$/;
		const variables = {};

		if (!info?.title?.trim()) {
			message.error('Title is required');
			return;
		}

		if (!info?.description?.trim()) {
			message.error('Description is required');
			return;
		}

		if (!info?.key?.trim()) {
			message.error('Filter is required');
			return;
		} else if (variableRegex.test(info?.key)) {
			variables.key = [info?.key?.slice(2, -2)];
		}

		if (!info?.selectedCondition?.value) {
			message.error('Condition is required');
			return;
		}

		if (info?.selectedCondition?.needValue && !info?.value?.trim()) {
			message.error('Value is required');
			return;
		} else if (variableRegex.test(info?.value)) {
			variables.value = [info?.value?.slice(2, -2)];
		}

		onSave({
			title: info?.title,
			description: info?.description,
			type: 'condition',
			...(activeStepsData && {
				app: null,
			}),
			variables,
			...(!activeStepsData && { moveTo: info?.moveToYes ? 'yes' : 'no' }),
			inputBody: {
				key: info?.key?.trim(),
				condition: info?.selectedCondition?.value,
				...(info?.selectedCondition?.needValue && { value: info?.value?.trim() }),
			},
		});
	}, [info, onSave, activeStepsData]);

	return (
		<>
			<ActionDetailsBlock
				actionLabel="If Else"
				heading="Conditions"
				title={info?.title}
				description={info?.description}
				updaterFn={updateInfo}
				onChangeButtonClick={onBack}
			/>

			<div className="ifElseInputContainer">
				<h3 className="ifElseInputHeading">Inputs</h3>
				<div className="ifElseInputConditionContainer">
					<span className="ifElseInputHeading">Filter</span>
					<VariableComponent
						value={info?.key}
						onChange={(value) => {
							updateInfo({ key: value });
						}}
						variables={variables?.data}
					/>
				</div>
				<div className="ifElseInputConditionContainer">
					<span className="ifElseInputHeading">Condition</span>
					<Tooltip
						placement="bottomLeft"
						arrow={false}
						color="transparent"
						trigger={['click']}
						open={info?.open}
						onOpenChange={(open) => {
							if (!open) {
								handleOpen(false);
							}
						}}
						title={
							<div className="ifElseInputConditionTooltip">
								<span className="ifElseInputConditionText">Select Condition</span>
								<div className="ifElseInputConditionList">
									{conditionsList?.map((condition) => (
										<div
											className="ifElseInputConditionItem"
											key={condition?.value}
											onClick={() => {
												updateInfo({ selectedCondition: condition });
												handleOpen(false);
											}}
										>
											{condition?.label}
										</div>
									))}
								</div>
							</div>
						}
					>
						<div
							className="ifElseInputCondition"
							onClick={() => {
								handleOpen(true);
							}}
						>
							{info?.selectedCondition?.label ? (
								<span className="ifElseInputConditionText ifElseInputConditionTextSelected">
									{info?.selectedCondition?.label}
								</span>
							) : (
								<span className="ifElseInputConditionText">Select Condition</span>
							)}
						</div>
					</Tooltip>
				</div>
				{info?.selectedCondition?.needValue && (
					<div className="ifElseInputConditionContainer">
						<span className="ifElseInputHeading">Value</span>
						<input
							type="text"
							className="ifElseInputValue"
							placeholder="Enter value"
							value={info?.value}
							onChange={(e) => updateInfo({ value: e.target.value })}
						/>
					</div>
				)}
				{hasNextNode && (
					<div className="ifElseInputConditionContainer">
						<span className="ifElseInputHeading">
							Where should the existing steps go?
						</span>
						<div className="ifElseInputCheckboxContainer">
							<label htmlFor="toYes">
								<input
									type="checkbox"
									id="toYes"
									checked={info?.moveToYes}
									onChange={(e) => updateInfo({ moveToYes: e.target.checked })}
								/>
								To Yes
							</label>
							<label htmlFor="toNo">
								<input
									type="checkbox"
									id="toNo"
									checked={!info?.moveToYes}
									onChange={(e) => updateInfo({ moveToYes: !e.target.checked })}
								/>
								To No
							</label>
						</div>
					</div>
				)}
			</div>
			<button className="ifElseInputButton" onClick={handleAddCondition} disabled={isLoading}>
				{isLoading ? 'Saving...' : 'Save'}
			</button>
		</>
	);
};

export default memo(IfElse);
