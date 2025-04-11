import React, { memo, useState, useEffect, useCallback } from 'react';
import HeaderComponent from './HeaderComponent';
import ActionDetailsBlock from './ActionDetailsBlock';
import { message, Spin } from 'antd';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import {
	containerStyle,
	dropDownStyle,
	dropDownTextStyling,
	selectedValueStyling,
} from '../../../features/automationBuilder/automationContentsHelper';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/inAppActions.scss';

const delayInOptions = [
	{
		label: 'Minutes',
		value: 'minutes',
	},
	{
		label: 'Hours',
		value: 'hours',
	},
	{
		label: 'Days',
		value: 'days',
	},
];

const enforceMinMax = (val) => {
	let min = 1;
	if (val < min) {
		return min + '';
	}
	return val;
};

const Delay = ({
	onBack,
	onSave,
	addTriggerLoading,
	variables,
	activeStepsData,
	handleChangeClick,
}) => {
	const [info, setInfo] = useState({
		title: '',
		description: '',
		delayIn: delayInOptions[0],
		duration: '1',
	});

	useEffect(() => {
		if (activeStepsData) {
			setInfo((prev) => ({
				...prev,
				title: activeStepsData?.title,
				description: activeStepsData?.description,
				delayIn: delayInOptions.find(
					(option) => option.value === activeStepsData?.inputBody?.delayIn,
				),
				duration: activeStepsData?.inputBody?.duration + '',
			}));
		}
	}, [activeStepsData]);

	const createNewTaskNode = useCallback(async () => {
		let { title, description, delayIn, duration } = info;
		if (!title?.trim().length) {
			message.error('Title is mandatory');
			return;
		}
		if (!description?.trim().length) {
			message.error('Description is mandatory');
			return;
		}

		if (!delayIn?.value?.trim().length) {
			message.error('Delay in is mandatory');
			return;
		}
		if (!duration?.trim().length) {
			message.error('Duration is mandatory');
			return;
		}

		const payload = {
			title: title,
			description: description,
			type: 'delay',
			inputBody: {
				delayIn: delayIn?.value,
				duration: Number(duration),
			},
		};
		onSave(payload, false);
	}, [info, onSave]);

	const updateInfo = useCallback((data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	return (
		<div className="inAppActionsContainer">
			<HeaderComponent onBack={onBack} heading="Delay" />
			<ActionDetailsBlock
				heading="Actions"
				actionLabel="Delay"
				title={info?.title}
				description={info?.description}
				updaterFn={updateInfo}
				onChangeButtonClick={onBack}
				showChangeButton={activeStepsData ? false : true}
			/>
			<div className="inAppActionsInputsContainer">
				<h2 className="InputBlockHeading">Inputs</h2>
				<div className="inputWrapper">
					<span className="inputLabel">Delay in</span>
					<HeadersDropDownComp
						options={delayInOptions}
						selectedValue={info?.delayIn?.label}
						onChangeFunc={(option) => updateInfo({ delayIn: option })}
						showIcon={false}
						containerStyle={{
							...containerStyle,
							background: '#1C1C1C',
							border: '1px solid #2C2D2E',
							borderRadius: '12px',
							height: '40px',
						}}
						outerContainerStyle={{ width: '100%' }}
						dropDownStyle={{
							...dropDownStyle,
							background: '#1C1C1C',
							border: '1px solid #2C2C2C',
						}}
						dropDownTextStyling={{
							...dropDownTextStyling,
							color: '#FFFFFF',
						}}
						showSelectedValueTick={true}
						uniqueIdentifierForTickIcon={'value'}
						selectedValueObj={info?.delayIn}
						selectedValueStyle={{
							...selectedValueStyling,
							color: '#FFFFFF',
						}}
					/>
				</div>
				<div className="inputWrapper">
					<span className="inputLabel">Duration</span>
					<input
						type="number"
						className="inputField"
						placeholder="Enter duration"
						value={info?.duration}
						onChange={(e) => updateInfo({ duration: e?.target?.value })}
						onBlur={(e) => updateInfo({ duration: enforceMinMax(e?.target?.value) })}
						min={1}
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

export default memo(Delay);
