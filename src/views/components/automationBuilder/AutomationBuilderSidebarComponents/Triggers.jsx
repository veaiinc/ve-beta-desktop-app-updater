import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/triggers.scss';
import { ReactComponent as DoubleArrow } from '../../../../assets/svg/worflow_builder/buildercard/doubleArrow.svg';
import { ReactComponent as Search } from '../../../../assets/svg/worflow_builder/buildercard/search.svg';
import { ReactComponent as Google } from '../../../../assets/svg/worflow_builder/buildercard/google.svg';
import { ReactComponent as Slack } from '../../../../assets/svg/worflow_builder/buildercard/slack.svg';
import { ReactComponent as RightArrow } from '../../../../assets/svg/worflow_builder/buildercard/rightArrow.svg';
import { useCallback } from 'react';
import Context from '../../../../context/context';

const actionsList = {
	tasks: { title: 'Create Tasks' },
	meeting: { title: 'Create Meeting' },
};

const triggersList = {
	google: {
		label: 'Google',
		icon: <Google />,
		value: 'google',
		triggers: [
			{
				icon: <Google />,
				label: 'On Message received',
				value: 'newEmail',
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
	templateId,
	activeEdge,
	editMode,
	activeStepsData,
	refetchWorkflowBuilderData,
	slackConnected,
	googleConnected,
}) => {
	const {
		templates: { addNewSteps, updateStateValues, specificTemplatesInfo, updateSteps },
	} = useContext(Context);
	const [info, setInfo] = useState({
		search: '',
		list: Object.values(actionsList),
		searchChanged: false,
		activeStage: 'stage1', //stage1, stage2, stage3
		saveLoader: false,
	});

	useEffect(() => {
		if (info?.searchChanged) {
			handleDebouce();
		}
	}, [info?.searchChanged, info?.search]);

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

	const changeStage = useCallback((data = {}) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	const checkConnection = useCallback(
		(integration) => {
			if (integration === 'slack') {
				return slackConnected;
			}
			if (integration === 'google') {
				return googleConnected;
			}
			return false;
		},
		[slackConnected, googleConnected],
	);

	return (
		<div className="triggersSidebarComponents">
			<div className="triggersSidebarComponentsHeader">
				<span onClick={onCLose} style={{ cursor: 'pointer' }}>
					<DoubleArrow />
				</span>
				<span className="triggerSidebarTitle">Trigger</span>
			</div>
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
									<div className="availableIntegrationItem" key={trigger.value}>
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
		</div>
	);
};

export default memo(Triggers);
