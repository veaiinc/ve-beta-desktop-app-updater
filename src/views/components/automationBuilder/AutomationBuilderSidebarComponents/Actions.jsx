/* eslint-disable react-hooks/exhaustive-deps */
import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import '../../../../assets/scss/automation_builder/automationBuilderSidebarComponents/actions.scss';
import { ReactComponent as Search } from '../../../../assets/svg/worflow_builder/buildercard/search.svg';
import { ReactComponent as Google } from '../../../../assets/svg/worflow_builder/buildercard/google.svg';
import { ReactComponent as Slack } from '../../../../assets/svg/worflow_builder/buildercard/slack.svg';
import { ReactComponent as RightArrrow } from '../../../../assets/svg/worflow_builder/buildercard/rightArrow.svg';

import { useCallback } from 'react';
import Context from '../../../../context/context';
import { message } from 'antd';
import CreateFile from './CreateFile';
import CreateTask from './CreateTask';
import HeaderComponent from './HeaderComponent';
import GoogleActions from './GoogleActions';

const integrations = [
	{
		_id: 'google',
		groupName: 'Google',
		icon: <Google />,
	},
	{
		_id: 'slack',
		groupName: 'Slack',
		icon: <Slack />,
	},
];

const actionGroups = [
	{
		_id: 'inApp',
		groupName: 'In App',
		icon: null,
		actions: [
			{
				actionLabel: 'Create Document',
				actionType: 'createForm',
			},
			{
				actionLabel: 'Create Task',
				actionType: 'createTask',
			},
		],
	},
	{
		_id: 'google',
		groupName: 'Google',
		icon: <Google />,
		actions: [
			{
				actionLabel: 'Get label info',
				actionType: 'getLabelInfo',
			},
			{
				actionLabel: 'Delete draft',
				actionType: 'deleteDraft',
			},
			{
				actionLabel: 'Get draft',
				actionType: 'getDraft',
			},
			{
				actionLabel: 'Create draft',
				actionType: 'createDraft',
			},
		],
	},
];

const Actions = ({
	onCLose,
	templateId,
	activeEdge,
	editMode,
	activeStepsData,
	refetchWorkflowBuilderData,
	automationId,
}) => {
	const {
		automationBuilder: { connectedIntegrations, variables, addStep },
	} = useContext(Context);
	const [info, setInfo] = useState({
		search: '',
		searchChanged: false,
		activeStage: 'stage1',
		saveLoader: false,
		selectedAction: null,
		previousStepId: '',
		connectedIntegrations: ['inApp'],
	});

	useEffect(() => {
		if (activeEdge) {
			setInfo((prev) => ({ ...prev, previousStepId: activeEdge?.split('-')?.[0] }));
		}
	}, [activeEdge]);

	useEffect(() => {
		if (connectedIntegrations) {
			setInfo((prev) => ({
				...prev,
				connectedIntegrations: [...Object.keys(connectedIntegrations), 'inApp'],
			}));
		}
	}, [connectedIntegrations]);

	const handleSearch = (e) => {
		setInfo((prev) => ({ ...prev, search: e.target.value }));
	};

	const addNode = useCallback(
		async (data) => {
			if (info?.saveLoader) {
				return;
			}
			setInfo((prev) => ({ ...prev, saveLoader: true }));

			const previousStepId = activeEdge?.split('-')?.[0];
			const previousStepPath = activeEdge?.split('-')?.[2] || null;

			const payload = {
				type: 'action',
				app: 'inApp',
				isEnabled: true,
				previousStepId,
				...(previousStepPath && { previousStepPath }),
				...data,
			};
			const response = await addStep(automationId, payload);
			if (response?.[0]) {
				onCLose();
			} else {
				message.error('Failed to add step');
			}
			setInfo((prev) => ({ ...prev, saveLoader: false }));
		},
		[info?.saveLoader, activeEdge, automationId, onCLose, addStep],
	);

	const updateInfo = useCallback((data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	const actionMapper = useMemo(() => {
		return {
			createForm: (
				<CreateFile
					onBack={() => updateInfo({ selectedAction: null })}
					onSave={addNode}
					addTriggerLoading={info?.saveLoader}
					variables={variables}
				/>
			),
			createTask: (
				<CreateTask
					onBack={() => updateInfo({ selectedAction: null })}
					onSave={addNode}
					addTriggerLoading={info?.saveLoader}
					variables={variables}
				/>
			),
			google: (
				<GoogleActions
					onBack={() => updateInfo({ selectedAction: null })}
					onSave={addNode}
					loading={info?.saveLoader}
					variables={variables}
					selectedAction={info?.selectedAction}
				/>
			),
		};
	}, [updateInfo, addNode, info?.saveLoader, variables, info?.selectedAction]);

	return (
		<div className="actionSidebarComponents">
			{info?.selectedAction ? (
				info?.selectedAction?.groupId === 'inApp' ? (
					actionMapper?.[info?.selectedAction?.actionType]
				) : (
					actionMapper?.[info?.selectedAction?.groupId]
				)
			) : (
				<>
					<HeaderComponent
						onBack={() => {
							if (info?.selectedAction) {
								updateInfo({ selectedAction: null });
							} else {
								onCLose();
							}
						}}
						heading="Actions"
					/>
					<div className="actionSideBarSearchbarContainer">
						<div className="actionSidebarSearch">
							<span style={{ paddingTop: '12px', paddingBottom: '12px' }}>
								<Search />
							</span>
							<input
								className="actionSideBarSearchInput"
								placeholder="Search Actions"
								value={info?.search}
								onChange={handleSearch}
							/>
						</div>
					</div>
					<div className="actionGroupsContainer">
						{actionGroups
							?.filter((ele) => info?.connectedIntegrations?.includes(ele?._id))
							?.map((ele, index) => {
								const filteredActions = ele.actions.filter(
									(action) =>
										!info?.search ||
										action.actionLabel
											.toLowerCase()
											.includes(info.search.toLowerCase()),
								);

								if (!filteredActions.length) return null;

								return (
									<div className="actionGroupItem" key={index}>
										<h3>{ele?.groupName}</h3>
										{filteredActions?.map((action, index) => (
											<div
												className="actionItem"
												key={index}
												onClick={() =>
													updateInfo({
														selectedAction: {
															actionType: action?.actionType,
															groupId: ele?._id,
															actionLabel: action?.actionLabel,
														},
													})
												}
											>
												<div className="actionItemIcon">{ele?.icon}</div>
												<div className="actionItemLabel">
													{action?.actionLabel}
												</div>
											</div>
										))}
									</div>
								);
							})
							.filter(Boolean)}

						{!info.search && (
							<div className="actionGroupItem">
								<h3>Integrations</h3>
								{integrations?.map((action, index) => (
									<div
										className="actionItem"
										key={index}
										onClick={() => {
											if (
												!info?.connectedIntegrations?.includes(action?._id)
											) {
												window.location.href = '/settings/integrations';
											}
										}}
									>
										<div className="actionItemIcon">{action?.icon}</div>
										<div className="actionItemLabel">{action?.groupName}</div>
										<div className="actionItemStatus">
											{action?._id === 'google' &&
											info?.connectedIntegrations?.includes(action?._id) ? (
												'Connected'
											) : (
												<span className="actionItemConnect">
													Connect
													<RightArrrow />
												</span>
											)}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default memo(Actions);
