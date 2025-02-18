import React, { useEffect, useState } from 'react';
import HeaderComponent from './HeaderComponent';
import ActionDetailsBlock from './ActionDetailsBlock';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/triggers.scss';

import {
	containerStyle,
	dropDownStyle,
	dropDownTextStyling,
	selectedValueStyling,
} from '../../../features/automation_builder/automationContentsHelper';
import { message } from 'antd';

const GoogleTriggers = ({
	onClose,
	onSave,
	addTriggerLoading,
	triggerData,
	connectedIntegrations,
}) => {
	const [info, setInfo] = useState({
		googleAccountOptions: [],
		selectedGoogleAccount: { label: 'Select an option', value: 'default' },
		pollModeOptions: [
			{ label: 'Every Minute', value: 'minute' },
			{ label: 'Every Hour', value: 'hour' },
			{ label: 'Every Day', value: 'day' },
			{ label: 'Every Week', value: 'week' },
			{ label: 'Every Month', value: 'month' },
		],
		selectedPollMode: { label: 'Every Minute', value: 'minute' },
		title: 'Message Received',
		description: 'This will trigger when a message is received',
	});

	useEffect(() => {
		if (connectedIntegrations) {
			setInfo((prev) => ({
				...prev,
				googleAccountOptions: connectedIntegrations?.google?.map((account) => ({
					label: account?.email,
					value: account?.email,
				})),
				selectedGoogleAccount: {
					label: connectedIntegrations?.google?.[0]?.email,
					value: connectedIntegrations?.google?.[0]?.email,
				},
			}));
		}
	}, [connectedIntegrations]);

	const onChangeGoogleAccount = (data) => {
		if (data?.value === info?.selectedGoogleAccount?.value) return;
		setInfo((prev) => ({ ...prev, selectedGoogleAccount: data }));
	};

	const updateStateInfo = (updatedData) => {
		setInfo((prev) => ({ ...prev, ...updatedData }));
	};

	const onChangePollMode = (data) => {
		if (data?.value === info?.selectedPollMode?.value) return;
		setInfo((prev) => ({ ...prev, selectedPollMode: data }));
	};

	const handleSave = () => {
		if (info?.title?.trim() === '') {
			message.error('Please enter a title');
			return;
		}
		if (info?.description?.trim() === '') {
			message.error('Please enter a description');
			return;
		}
		if (info?.selectedGoogleAccount?.value === 'default') {
			message.error('Please select a google account');
			return;
		}
		onSave({
			...triggerData,
			title: info?.title?.trim(),
			description: info?.description?.trim(),
			googleAccount: info?.selectedGoogleAccount?.value,
			pollMode: info?.selectedPollMode?.value,
		});
	};

	return (
		<>
			<HeaderComponent onBack={onClose} heading={'Message Received'} />
			<ActionDetailsBlock
				actionLabel={'Message Received'}
				heading={'Trigger'}
				description={info?.description}
				title={info?.title}
				updaterFn={(updatedData) => {
					updateStateInfo(updatedData);
				}}
			/>
			<div className="step2Container">
				<div className="step2InputsContainer">
					<h2 className="step2InputsHeading">Inputs</h2>
					<div className="step2InputItem">
						<label className="step2InputLabel">Google Account</label>
						<HeadersDropDownComp
							options={info?.googleAccountOptions}
							selectedValue={info?.selectedGoogleAccount?.label}
							onChangeFunc={onChangeGoogleAccount}
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
							selectedValueObj={info?.selectedGoogleAccount}
							selectedValueStyle={{
								...selectedValueStyling,
								color: '#FFFFFF',
							}}
						/>
					</div>
					<div className="step2InputItem">
						<label className="step2InputLabel">
							Poll Mode<sup>*</sup>
						</label>
						<HeadersDropDownComp
							options={info?.pollModeOptions}
							selectedValue={info?.selectedPollMode?.label}
							onChangeFunc={onChangePollMode}
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
							selectedValueObj={info?.selectedPollMode}
							selectedValueStyle={{
								...selectedValueStyling,
								color: '#FFFFFF',
							}}
						/>
					</div>
					<button className="step2AddInputButton">Add Poll Time</button>
				</div>
				<div className="triggerSaveButtonContainer">
					<button
						className="triggerSaveButton"
						onClick={handleSave}
						disabled={addTriggerLoading}
					>
						{addTriggerLoading ? 'Saving...' : 'Save'}
					</button>
				</div>
			</div>
		</>
	);
};

export default GoogleTriggers;
