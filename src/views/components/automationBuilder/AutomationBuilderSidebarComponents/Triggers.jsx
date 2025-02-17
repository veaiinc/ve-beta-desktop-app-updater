import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/triggers.scss';
import { ReactComponent as DoubleArrow } from '../../../../assets/svg/worflow_builder/buildercard/doubleArrow.svg';
import { ReactComponent as Search } from '../../../../assets/svg/worflow_builder/buildercard/search.svg';
import { ReactComponent as Google } from '../../../../assets/svg/worflow_builder/buildercard/google.svg';
import { ReactComponent as Slack } from '../../../../assets/svg/worflow_builder/buildercard/slack.svg';
import { ReactComponent as RightArrow } from '../../../../assets/svg/worflow_builder/buildercard/rightArrow.svg';
import { useCallback } from 'react';
import Context from '../../../../context/context';
import HeadersDropDownComp from '../../dropDown/HeadersDropDownComp';
import {
	containerStyle,
	dropDownStyle,
	dropDownTextStyling,
	selectedValueStyling,
} from '../../../features/automation_builder/automationContentsHelper';
import { message } from 'antd';
import InAppTriggers from './InAppTriggers';
import HeaderComponent from './HeaderComponent';
import GoogleTriggers from './GoogleTriggers';

const actionsList = {
	tasks: { title: 'Create Tasks' },
	meeting: { title: 'Create Meeting' },
};

const triggersList = {
	google: {
		label: 'Google',
		icon: <Google />,
		value: 'google',
		triggerType: 'app',
		triggers: [
			{
				app: 'gmail',
				icon: <Google />,
				label: 'On Message received',
				event: 'messageReceived',
			},
		],
	},
	inApp: {
		label: 'In App',
		// icon: <InApp />,
		value: 'inApp',
		triggerType: 'database',
		triggers: [
			{
				app: 'inApp',
				icon: null,
				label: 'Form Submission',
				event: 'create',
				module: 'formResponse',
			},
		],
	},
};

const availableIntegrations = [
	{
		label: 'Google',
		value: 'google',
		icon: <Google />,
	},
	{
		label: 'Slack',
		value: 'slack',
		icon: <Slack />,
	},
];

const Triggers = ({
	onCLose,
	automationId,
	activeEdge,
	editMode,
	activeStepsData,
	refetchWorkflowBuilderData,
	slackConnected,
	googleConnected,
	step,
}) => {
	const {
		templates: { addNewSteps, updateStateValues, specificTemplatesInfo, updateSteps },
		automationBuilder: { connectedIntegrations, addTrigger, getAutomation },
	} = useContext(Context);
	const [info, setInfo] = useState({
		search: '',
		list: Object.values(actionsList),
		searchChanged: false,
		activeStage: `stage${step || 1}`, //stage1, stage2, stage3
		saveLoader: false,
		connectedIntegrations,
		selectedTrigger: null,
	});

	useEffect(() => {
		setInfo((prev) => ({ ...prev, activeStage: `stage${step || 1}` }));
	}, [step]);

	useEffect(() => {
		if (info?.searchChanged) {
			handleDebouce();
		}
	}, [info?.searchChanged, info?.search]);

	useEffect(() => {
		if (connectedIntegrations) {
			setInfo((prev) => ({ ...prev, connectedIntegrations }));
		}
	}, [connectedIntegrations]);

	useEffect(() => {
		if (editMode && activeStepsData) {
			if (activeStepsData?.actionType === 'createTask') {
				setInfo((prev) => ({ ...prev, activeStage: 'stage2' }));
			}
			if (activeStepsData?.actionType === 'createMeeting') {
				setInfo((prev) => ({ ...prev, activeStage: 'stage3' }));
			}
		}
	}, [editMode, activeStepsData]);

	const handleSearch = (e) => {
		setInfo((prev) => ({ ...prev, search: e.target.value, searchChanged: true }));
	};

	const handleDebouce = useCallback(() => {
		clearTimeout(info?.timeout);
		let timeout = setTimeout(() => {
			const filtered = Object.values(actionsList)?.filter((action) =>
				action.title.toLowerCase().includes(info?.search?.toLowerCase()),
			);
			setInfo((prev) => ({ ...prev, list: filtered }));
		}, 800);
		setInfo((prev) => ({ ...prev, timeout }));
	}, [info?.timeout, info?.search]);

	const checkConnection = useCallback(
		(integration) => {
			if (integration === 'inApp') {
				return true;
			}
			const isConnected = connectedIntegrations?.[integration] || [];
			return isConnected?.length > 0;
		},
		[connectedIntegrations],
	);

	const updateTriggerInfo = useCallback((updateData) => {
		setInfo((prev) => ({ ...prev, ...updateData }));
	}, []);

	const handleBack = useCallback(() => {
		if (info?.activeStage === 'stage2') {
			setInfo((prev) => ({ ...prev, activeStage: 'stage1' }));
		}
		if (info?.activeStage === 'stage1') {
			onCLose();
		}
	}, [info?.activeStage, onCLose]);

	const addNewTrigger = useCallback(
		async (trigger) => {
			const payload = {
				title: trigger?.title,
				description: trigger?.description,
				triggerType: trigger?.triggerType,
				app: trigger?.app,
				type: 'trigger',
			};
			if (trigger?.event === 'messageReceived') {
				payload.gmail = {
					connectedEmail: connectedIntegrations?.google?.[0]?.email,
					event: trigger?.event,
				};
			}
			if (trigger?.event === 'create') {
				payload.inApp = {
					event: trigger?.event,
					module: trigger?.module,
					workflowTemplateId: trigger?.workflowTemplateId,
				};
			}
			updateTriggerInfo({ saveLoader: true });
			const response = await addTrigger(automationId, payload);
			updateTriggerInfo({ saveLoader: false });
			if (response?.[0]) {
				setInfo((prev) => ({ ...prev, activeStage: 'stage2' }));
				getAutomation(automationId);
			} else {
				message?.error(response?.[1] || 'Failed to add trigger');
			}
		},
		[connectedIntegrations, addTrigger, automationId, getAutomation],
	);

	const triggerMapper = useMemo(() => {
		return {
			gmail: (
				<GoogleTriggers
					addNewTrigger={addNewTrigger}
					selectedTrigger={info?.selectedTrigger}
					onClose={() => updateTriggerInfo({ selectedTrigger: null })}
				/>
			),
			inApp: (
				<InAppTriggers
					addNewTrigger={addNewTrigger}
					selectedTrigger={info?.selectedTrigger}
					onClose={() => updateTriggerInfo({ selectedTrigger: null })}
					onSave={addNewTrigger}
					addTriggerLoading={info?.saveLoader}
					triggerData={info?.selectedTrigger}
				/>
			),
		};
	}, [info?.selectedTrigger, addNewTrigger, updateTriggerInfo]);

	console.log(info);

	return info?.selectedTrigger ? (
		triggerMapper?.[info?.selectedTrigger?.app]
	) : (
		<>
			<HeaderComponent />
			<Step1 checkConnection={checkConnection} updateTriggerInfo={updateTriggerInfo} />
		</>
	);
};

// <div className="triggersSidebarComponents">
// 	<div className="triggersSidebarComponentsHeader">
// 		<span onClick={handleBack} style={{ cursor: 'pointer' }}>
// 			<DoubleArrow />
// 		</span>
// 		<span className="triggerSidebarTitle">Trigger</span>
// 	</div>
// 	{info?.activeStage === 'stage1' ? (
// 		<Step1 checkConnection={checkConnection} addNewTrigger={addNewTrigger} />
// 	) : (
// 		<Step2 connectedIntegrations={connectedIntegrations} />
// 	)}
// </div>

export default memo(Triggers);

const Step1 = ({ checkConnection, updateTriggerInfo }) => {
	return (
		<>
			<div className="triggersHeaderContainer">
				<div className="titleContainer">
					<div className="triggersHeaderTitle">Change triggers</div>
					<div className="triggersHeaderDescription">
						Pick an event to start this workflow
					</div>
				</div>
				<div className="triggerSidebarSearchContainer">
					<span style={{ paddingTop: '12px', paddingBottom: '12px' }}>
						<Search />
					</span>
					<input
						type="text"
						className="triggerSidebarSearch"
						placeholder="Search trigger"
					/>
				</div>
			</div>
			<div className="triggersContentContainer">
				{Object?.values(triggersList)
					?.filter((integration) => checkConnection(integration.value))
					?.map((integration) => (
						<div className="triggerContainer" key={integration.label}>
							<h2 className="triggerIntegrationName">{integration.label}</h2>
							<div className="availableIntegrationsList">
								{integration?.triggers?.map((trigger) => (
									<div
										className="availableIntegrationItem"
										key={trigger.event}
										onClick={() =>
											updateTriggerInfo({
												selectedTrigger: {
													...trigger,
													triggerType: integration?.triggerType,
												},
											})
										}
									>
										<span className="integrationIcon">{trigger.icon}</span>
										<span className="integrationLabel">{trigger.label}</span>
									</div>
								))}
							</div>
						</div>
					))}

				<div className="availableIntegrationsContainer">
					<h2 className="availableIntegrationHeading">Available Integrations</h2>
					<div className="availableIntegrationsList">
						{availableIntegrations?.map((integration) => (
							<div className="availableIntegrationItem" key={integration.value}>
								<span className="integrationIcon">{integration.icon}</span>
								<span className="integrationLabel">{integration.label}</span>
								{checkConnection(integration.value) ? (
									<button className="integrationButton">Connected</button>
								) : (
									<button
										className="integrationButton"
										onClick={() =>
											(window.location.href = '/settings/integrations')
										}
									>
										Connect <RightArrow />
									</button>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	);
};

// const Step2 = ({ connectedIntegrations }) => {
// 	const [info, setInfo] = useState({
// 		googleAccountOptions: [],
// 		selectedGoogleAccount: { label: 'Select an option', value: 'default' },
// 		pollModeOptions: [
// 			{ label: 'Every Minute', value: 'minute' },
// 			{ label: 'Every Hour', value: 'hour' },
// 			{ label: 'Every Day', value: 'day' },
// 			{ label: 'Every Week', value: 'week' },
// 			{ label: 'Every Month', value: 'month' },
// 		],
// 		selectedPollMode: { label: 'Every Minute', value: 'minute' },
// 	});

// 	useEffect(() => {
// 		if (connectedIntegrations) {
// 			setInfo((prev) => ({
// 				...prev,
// 				googleAccountOptions: connectedIntegrations?.google?.map((account) => ({
// 					label: account?.email,
// 					value: account?.email,
// 				})),
// 				selectedGoogleAccount: {
// 					label: connectedIntegrations?.google?.[0]?.email,
// 					value: connectedIntegrations?.google?.[0]?.email,
// 				},
// 			}));
// 		}
// 	}, [connectedIntegrations]);

// 	const onChangeGoogleAccount = (data) => {
// 		if (data?.value === info?.selectedGoogleAccount?.value) return;
// 		setInfo((prev) => ({ ...prev, selectedGoogleAccount: data }));
// 	};

// 	const onChangePollMode = (data) => {
// 		if (data?.value === info?.selectedPollMode?.value) return;
// 		setInfo((prev) => ({ ...prev, selectedPollMode: data }));
// 	};

// 	return (
// 		<div className="step2Container">
// 			<div className="step2HeaderContainer">
// 				<div className="triggerInfoContainer">
// 					<div className="triggerInfo">
// 						<span className="triggerInfoTitle">Trigger</span>
// 						<span className="triggerInfoDescription">Receive message</span>
// 					</div>
// 					<button className="changeTriggerButton">Change</button>
// 				</div>
// 				<div className="step2TitleDescriptionContainer">
// 					<input type="text" className="step2InputTitle" placeholder="Step title" />
// 					<input
// 						type="text"
// 						className="step2InputDescription"
// 						placeholder="step description"
// 					/>
// 				</div>
// 			</div>
// 			<div className="step2InputsContainer">
// 				<h2 className="step2InputsHeading">Inputs</h2>
// 				<div className="step2InputItem">
// 					<label className="step2InputLabel">Google Account</label>
// 					<HeadersDropDownComp
// 						options={info?.googleAccountOptions}
// 						selectedValue={info?.selectedGoogleAccount?.label}
// 						onChangeFunc={onChangeGoogleAccount}
// 						showIcon={false}
// 						containerStyle={{
// 							...containerStyle,
// 							background: '#1C1C1C',
// 							border: '1px solid #2C2D2E',
// 							borderRadius: '12px',
// 							height: '40px',
// 						}}
// 						outerContainerStyle={{ width: '100%' }}
// 						dropDownStyle={{
// 							...dropDownStyle,
// 							background: '#1C1C1C',
// 							border: '1px solid #2C2C2C',
// 						}}
// 						dropDownTextStyling={{
// 							...dropDownTextStyling,
// 							color: '#FFFFFF',
// 						}}
// 						showSelectedValueTick={true}
// 						uniqueIdentifierForTickIcon={'value'}
// 						selectedValueObj={info?.selectedGoogleAccount}
// 						selectedValueStyle={{
// 							...selectedValueStyling,
// 							color: '#FFFFFF',
// 						}}
// 					/>
// 				</div>
// 				<div className="step2InputItem">
// 					<label className="step2InputLabel">
// 						Poll Mode<sup>*</sup>
// 					</label>
// 					<HeadersDropDownComp
// 						options={info?.pollModeOptions}
// 						selectedValue={info?.selectedPollMode?.label}
// 						onChangeFunc={onChangePollMode}
// 						showIcon={false}
// 						containerStyle={{
// 							...containerStyle,
// 							background: '#1C1C1C',
// 							border: '1px solid #2C2D2E',
// 							borderRadius: '12px',
// 							height: '40px',
// 						}}
// 						outerContainerStyle={{ width: '100%' }}
// 						dropDownStyle={{
// 							...dropDownStyle,
// 							background: '#1C1C1C',
// 							border: '1px solid #2C2C2C',
// 						}}
// 						dropDownTextStyling={{
// 							...dropDownTextStyling,
// 							color: '#FFFFFF',
// 						}}
// 						showSelectedValueTick={true}
// 						uniqueIdentifierForTickIcon={'value'}
// 						selectedValueObj={info?.selectedPollMode}
// 						selectedValueStyle={{
// 							...selectedValueStyling,
// 							color: '#FFFFFF',
// 						}}
// 					/>
// 				</div>
// 				<button className="step2AddInputButton">Add Poll Time</button>
// 			</div>
// 		</div>
// 	);
// };
