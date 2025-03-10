import React, { memo, useState, useEffect } from 'react';
import VariableComponent from './VariableComponent';
import { Tooltip } from 'antd';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/ConditionInput.scss';

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

const ConditionInput = ({
	value,
	condition,
	conditionKey,
	variables,
	onUpdateCondition,
	title,
}) => {
	const [info, setInfo] = useState({
		open: false,
		selectedCondition: null,
	});

	useEffect(() => {
		if (condition) {
			const conditionData = conditionsList?.find((cond) => cond?.value === condition);
			updateStateInfo({ selectedCondition: conditionData });
		}
	}, [condition]);

	const updateStateInfo = (data) => {
		setInfo({ ...info, ...data });
	};

	return (
		<div className="conditionInputContainer">
			<h2 className="conditionInputContainerHeading">{title}</h2>
			<div className="conditionInputContainerFilterContainer">
				<span className="conditionInputContainerFilterHeading">Filter</span>
				<VariableComponent
					value={conditionKey}
					onChange={(value) => {
						onUpdateCondition({ key: value });
					}}
					variables={variables?.data}
				/>
			</div>
			<div className="conditionInputContainerFilterContainer">
				<span className="conditionInputContainerFilterHeading">Condition</span>
				<Tooltip
					placement="bottomLeft"
					arrow={false}
					color="transparent"
					trigger={['click']}
					open={info?.open}
					onOpenChange={(open) => {
						if (!open) {
							updateStateInfo({ open: false });
						}
					}}
					title={
						<div className="conditionInputContainerConditionTooltip">
							<span className="conditionInputContainerConditionText">
								Select Condition
							</span>
							<div className="conditionInputContainerConditionList">
								{conditionsList?.map((condition) => (
									<div
										className="conditionInputContainerConditionItem"
										key={condition?.value}
										onClick={() => {
											onUpdateCondition({ condition: condition?.value });
											updateStateInfo({ open: false });
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
						className="conditionInputContainerCondition"
						onClick={() => {
							updateStateInfo({ open: true });
						}}
					>
						{info?.selectedCondition?.label ? (
							<span className="conditionInputContainerConditionText conditionInputContainerConditionTextSelected">
								{info?.selectedCondition?.label}
							</span>
						) : (
							<span className="conditionInputContainerConditionText">
								Select Condition
							</span>
						)}
					</div>
				</Tooltip>
			</div>
			{info?.selectedCondition?.needValue && (
				<div className="conditionInputContainerFilterContainer">
					<span className="conditionInputContainerFilterHeading">Value</span>
					<input
						type="text"
						className="conditionInputContainerValue"
						placeholder="Enter value"
						value={value}
						onChange={(e) => onUpdateCondition({ value: e.target.value })}
					/>
				</div>
			)}
		</div>
	);
};

export default memo(ConditionInput);
