/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/triggers.scss';
import { ReactComponent as Search } from '../../../../assets/svg/worflow_builder/buildercard/search.svg';
import { ReactComponent as Google } from '../../../../assets/svg/worflow_builder/buildercard/google.svg';
import { ReactComponent as Slack } from '../../../../assets/svg/worflow_builder/buildercard/slack.svg';
import { ReactComponent as RightArrow } from '../../../../assets/svg/worflow_builder/buildercard/rightArrow.svg';
import { useCallback } from 'react';
import Context from '../../../../context/context';
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
			{
				app: 'inApp',
				icon: null,
				label: 'Task Created',
				event: 'create',
				module: 'task',
			},
			{
				app: 'inApp',
				icon: null,
				label: 'Task Updated',
				event: 'update',
				module: 'task',
			},
			{
				app: 'inApp',
				icon: null,
				label: 'Task Deleted',
				event: 'delete',
				module: 'task',
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

const Triggers = ({ onCLose, automationId, editMode, activeStepsData, step }) => {
	const {
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

	// const handleSearch = (e) => {
	// 	setInfo((prev) => ({ ...prev, search: e.target.value, searchChanged: true }));
	// };

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

	// useEffect(() => {
	// 	if (activeStepsData?.app) {
	// 		const trigger = triggersList?.[activeStepsData?.app]?.triggers?.find(
	// 			(trigger) => trigger?.event === activeStepsData?.criteria?.event,
	// 		);
	// 		updateTriggerInfo({
	// 			selectedTrigger: {
	// 				...trigger,
	// 				triggerType: trigger?.triggerType,
	// 			},
	// 		});
	// 	}
	// }, [activeStepsData]);

	const updateTriggerInfo = useCallback((updateData) => {
		setInfo((prev) => ({ ...prev, ...updateData }));
	}, []);

	// const handleBack = useCallback(() => {
	// 	if (info?.activeStage === 'stage2') {
	// 		setInfo((prev) => ({ ...prev, activeStage: 'stage1' }));
	// 	}
	// 	if (info?.activeStage === 'stage1') {
	// 		onCLose();
	// 	}
	// }, [info?.activeStage, onCLose]);

	const addNewTrigger = useCallback(
		async (data) => {
			updateTriggerInfo({ saveLoader: true });
			const response = await addTrigger(automationId, data);
			updateTriggerInfo({ saveLoader: false });
			if (response?.[0]) {
				setInfo((prev) => ({ ...prev, activeStage: 'stage2' }));
				getAutomation(automationId);
				onCLose();
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
					onSave={addNewTrigger}
					addTriggerLoading={info?.saveLoader}
					triggerData={info?.selectedTrigger}
					connectedIntegrations={connectedIntegrations}
					activeStepsData={activeStepsData}
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
					connectedIntegrations={connectedIntegrations}
					activeStepsData={activeStepsData}
				/>
			),
		};
	}, [
		info?.selectedTrigger,
		addNewTrigger,
		updateTriggerInfo,
		connectedIntegrations,
		activeStepsData,
	]);

	return info?.selectedTrigger ? (
		triggerMapper?.[info?.selectedTrigger?.app]
	) : (
		<>
			<HeaderComponent onBack={() => onCLose()} heading="Triggers" />
			<Step1 checkConnection={checkConnection} updateTriggerInfo={updateTriggerInfo} />
		</>
	);
};

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
