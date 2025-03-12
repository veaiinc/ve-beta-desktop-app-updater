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
			{
				app: 'inApp',
				icon: null,
				label: 'Client Created',
				event: 'create',
				module: 'client',
			},
			{
				app: 'inApp',
				icon: null,
				label: 'Client Updated',
				event: 'update',
				module: 'client',
			},
			{
				app: 'inApp',
				icon: null,
				label: 'Client Deleted',
				event: 'delete',
				module: 'client',
			},
		],
	},
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

const Triggers = ({ onClose, automationId, editMode, activeStepsData, step }) => {
	const {
		automationBuilder: { connectedIntegrations, addTrigger, getAutomation, updateStep },
	} = useContext(Context);
	const [info, setInfo] = useState({
		activeStage: `stage${step || 1}`, //stage1, stage2, stage3
		saveLoader: false,
		connectedIntegrations,
		selectedTrigger: null,
	});

	useEffect(() => {
		if (connectedIntegrations) {
			setInfo((prev) => ({ ...prev, connectedIntegrations }));
		}
	}, [connectedIntegrations]);

	// useEffect(() => {
	// 	if (activeStepsData) {
	// 		const trigger = triggersList?.[
	// 			activeStepsData?.app === 'gmail' ? 'google' : activeStepsData?.app
	// 		]?.triggers?.find((trigger) => trigger?.event === activeStepsData?.event);
	// 		if (trigger) {
	// 			setInfo((prev) => ({ ...prev, selectedTrigger: trigger }));
	// 		}
	// 	}
	// }, [activeStepsData]);

	// useEffect(() => {
	// 	if (editMode && activeStepsData) {
	// 		if (activeStepsData?.actionType === 'createTask') {
	// 			setInfo((prev) => ({ ...prev, activeStage: 'stage2' }));
	// 		}
	// 		if (activeStepsData?.actionType === 'createMeeting') {
	// 			setInfo((prev) => ({ ...prev, activeStage: 'stage3' }));
	// 		}
	// 	}
	// }, [editMode, activeStepsData]);

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

	const addNewTrigger = useCallback(
		async (data) => {
			updateTriggerInfo({ saveLoader: true });
			const response = await addTrigger(automationId, data);
			updateTriggerInfo({ saveLoader: false });
			if (response?.[0]) {
				onClose();
			} else {
				message?.error(response?.[1] || 'Failed to add trigger');
			}
		},
		[connectedIntegrations, addTrigger, automationId, getAutomation],
	);

	const updateTrigger = useCallback(
		async (data) => {
			// updateTriggerInfo({ saveLoader: true });
			// data.stepId = activeStepsData?._id;
			// const response = await updateStep(automationId, data);
			// updateTriggerInfo({ saveLoader: false });
			// if (response?.[0]) {
			// 	message?.success('Trigger updated successfully');
			// 	onClose();
			// } else {
			// 	message?.error(response?.[1] || 'Failed to update trigger');
			// }
			onClose();
		},
		[updateTriggerInfo],
	);

	const onSave = useCallback(
		(data) => {
			if (activeStepsData) {
				updateTrigger(data);
			} else {
				addNewTrigger(data);
			}
		},
		[activeStepsData, updateTrigger, addNewTrigger],
	);

	const handleOnClose = useCallback(() => {
		if (activeStepsData) {
			updateTriggerInfo({ selectedTrigger: null });
			onClose();
		}
		updateTriggerInfo({ selectedTrigger: null });
	}, [onClose, activeStepsData, updateTriggerInfo]);

	const triggerMapper = useMemo(() => {
		return {
			gmail: (
				<GoogleTriggers
					addNewTrigger={addNewTrigger}
					selectedTrigger={info?.selectedTrigger}
					onClose={onClose}
					onSave={onSave}
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
					onClose={onClose}
					onSave={onSave}
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
			<HeaderComponent onBack={handleOnClose} heading="Triggers" />
			<Step1 checkConnection={checkConnection} updateTriggerInfo={updateTriggerInfo} />
		</>
	);
};

export default memo(Triggers);

const Step1 = ({ checkConnection, updateTriggerInfo }) => {
	const [info, setInfo] = useState({
		search: '',
	});

	const handleSearch = (e) => {
		setInfo((prev) => ({ ...prev, search: e.target.value }));
	};

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
						value={info?.search}
						onChange={handleSearch}
					/>
				</div>
			</div>
			<div className="triggersContentContainer">
				{Object.values(triggersList)
					.map((integration) => {
						// Check if search matches group name
						const groupNameMatches =
							!info?.search ||
							integration.label.toLowerCase().includes(info.search.toLowerCase());

						// Filter triggers based on search in label or show all if group name matches
						const filteredTriggers = integration.triggers.filter(
							(trigger) =>
								groupNameMatches ||
								!info?.search ||
								trigger.label.toLowerCase().includes(info.search.toLowerCase()),
						);

						// Remove duplicates based on event + module (if module exists)
						const uniqueTriggers = Array.from(
							new Map(
								filteredTriggers.map((t) => [`${t.event}-${t.module || ''}`, t]),
							).values(),
						);

						// Only return groups that have matching triggers and are connected
						if (!uniqueTriggers.length || !checkConnection(integration.value))
							return null;

						return (
							<div className="triggerContainer" key={integration.label}>
								<h2 className="triggerIntegrationName">{integration.label}</h2>
								<div className="availableIntegrationsList">
									{uniqueTriggers.map((trigger) => (
										<div
											className="availableIntegrationItem"
											key={`${trigger.event}-${trigger.module || ''}`}
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
											<span className="integrationLabel">
												{trigger.label}
											</span>
										</div>
									))}
								</div>
							</div>
						);
					})
					.filter(Boolean)}

				{!info.search &&
					(() => {
						const unconnectedIntegrations = availableIntegrations?.filter(
							(integration) => !checkConnection(integration?.value),
						);

						return unconnectedIntegrations?.length > 0 ? (
							<div className="availableIntegrationsContainer">
								<h2 className="availableIntegrationHeading">
									Available Integrations
								</h2>
								<div className="availableIntegrationsList">
									{unconnectedIntegrations?.map((integration) => (
										<div
											className="availableIntegrationItem"
											key={integration?.value}
										>
											<span className="integrationIcon">
												{integration?.icon}
											</span>
											<span className="integrationLabel">
												{integration?.label}
											</span>
											<button
												className="integrationButton"
												onClick={() =>
													(window.location.href =
														'/settings/integrations')
												}
											>
												Connect <RightArrow />
											</button>
										</div>
									))}
								</div>
							</div>
						) : null;
					})()}
			</div>
		</>
	);
};
