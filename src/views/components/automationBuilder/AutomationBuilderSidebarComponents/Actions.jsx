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
import SlackActions from './SlackActions';
import CreateMeeting from './CreateMeeting';
import Delay from './Delay';

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
				actionType: 'createFile',
			},
			{
				actionLabel: 'Create Task',
				actionType: 'createTask',
			},
			{
				actionLabel: 'Delay',
				actionType: 'delay',
			},
			// {
			// 	actionLabel: 'Create Meeting',
			// 	actionType: 'createMeeting',
			// },
		],
	},
	{
		_id: 'gmail',
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
			{
				actionLabel: 'Reply to message',
				actionType: 'replyMessage',
				hide: true,
			},
			{
				actionLabel: 'Send Message',
				actionType: 'sendMessage',
				hide: true,
			},
		],
	},
	{
		_id: 'slack',
		groupName: 'Slack',
		icon: <Slack />,
		actions: [
			{
				actionLabel: 'Create Channel',
				actionType: 'createChannel',
			},
			{
				actionLabel: 'Send Message',
				actionType: 'sendMessage',
				hide: true,
			},
			// {
			// 	actionLabel: 'Delete Message',
			// 	actionType: 'deleteMessage',
			// },
			{
				actionLabel: 'Get channel Info',
				actionType: 'getChannelInfo',
			},
			{
				actionLabel: 'Get many channels',
				actionType: 'getManyChannels',
			},
			{
				actionLabel: 'Join Channel',
				actionType: 'joinChannel',
			},
			{
				actionLabel: 'Leave Channel',
				actionType: 'leaveChannel',
			},
			{
				actionLabel: 'Rename Channel',
				actionType: 'renameChannel',
			},
			{
				actionLabel: 'Get channel members',
				actionType: 'channelMembers',
			},
		],
	},
];

const Actions = ({
	onClose,
	activeEdge,
	editMode,
	activeStepsData,
	automationId,
	handleActiveStepData,
}) => {
	const {
		automationBuilder: { connectedIntegrations, variables, addStep, updateStep },
	} = useContext(Context);
	const [info, setInfo] = useState({
		search: '',
		searchChanged: false,
		activeStage: 'stage1',
		saveLoader: false,
		selectedAction: null,
		previousStepId: '',
		connectedIntegrations: ['inApp'],
		selectedGroupId: '',
	});

	useEffect(() => {
		if (activeEdge) {
			setInfo((prev) => ({ ...prev, previousStepId: activeEdge?.split('-')?.[0] }));
		}
	}, [activeEdge]);

	useEffect(() => {
		if (activeStepsData) {
			updateInfo({
				selectedAction: {
					actionType: activeStepsData?.actionType || activeStepsData?.type,
					groupId: activeStepsData?.app || 'inApp',
					actionLabel: actionGroups
						?.find((group) => group?._id === activeStepsData?.app)
						?.actions?.find(
							(action) => action?.actionType === activeStepsData?.actionType,
						)?.actionLabel,
				},
			});
		}
	}, [activeStepsData]);

	useEffect(() => {
		if (connectedIntegrations) {
			const connected = Object?.entries(connectedIntegrations)
				?.map(([key, value]) => (value?.length > 0 ? key : null))
				?.filter(Boolean);
			setInfo((prev) => ({
				...prev,
				connectedIntegrations: [...connected, 'inApp'],
			}));
		}
	}, [connectedIntegrations]);

	const handleSearch = (e) => {
		setInfo((prev) => ({ ...prev, search: e.target.value }));
	};

	const addNode = useCallback(
		async (data, hasAppType = true) => {
			if (info?.saveLoader) {
				return;
			}
			setInfo((prev) => ({ ...prev, saveLoader: true }));

			const previousStepId = activeEdge?.split('-')?.[0];
			const previousStepPath = activeEdge?.split('-')?.[2] || null;

			const payload = {
				type: 'action',
				...(hasAppType && { app: 'inApp' }),
				isEnabled: true,
				previousStepId,
				...(previousStepPath && { previousStepPath }),
				...data,
			};
			const response = await addStep(automationId, payload);
			if (response?.[0]) {
				onClose();
			} else {
				message.error('Failed to add step');
			}
			setInfo((prev) => ({ ...prev, saveLoader: false }));
		},
		[info?.saveLoader, activeEdge, automationId, onClose, addStep],
	);

	const updateNode = useCallback(
		async (data, hasAppType = true) => {
			if (info?.saveLoader) {
				return;
			}
			setInfo((prev) => ({ ...prev, saveLoader: true }));

			const payload = {
				type: 'action',
				...(hasAppType && { app: 'inApp' }),
				isEnabled: true,
				stepId: activeStepsData?._id,
				...data,
			};
			const response = await updateStep(automationId, payload);
			if (response?.[0]) {
				onClose();
			} else {
				message.error('Failed to update step');
			}
			setInfo((prev) => ({ ...prev, saveLoader: false }));
		},
		[info?.saveLoader, activeStepsData, automationId, onClose, updateStep],
	);

	const onSave = useCallback(
		(...data) => {
			if (activeStepsData) {
				updateNode(...data);
			} else {
				addNode(...data);
			}
		},
		[activeStepsData, updateNode, addNode],
	);

	const updateInfo = useCallback((data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	const handleBack = () => {
		if (activeStepsData) {
			handleActiveStepData(null);
			onClose();
		} else {
			updateInfo({ selectedAction: null });
		}
	};

	const handleChangeClick = (groupId) => {
		updateInfo({ selectedGroupId: groupId, selectedAction: null });
	};

	const actionMapper = useMemo(() => {
		return {
			createFile: (
				<CreateFile
					onBack={handleBack}
					onSave={onSave}
					addTriggerLoading={info?.saveLoader}
					activeStepsData={activeStepsData}
					handleChangeClick={handleChangeClick}
				/>
			),
			createTask: (
				<CreateTask
					onBack={handleBack}
					onSave={onSave}
					addTriggerLoading={info?.saveLoader}
					variables={variables}
					activeStepsData={activeStepsData}
					handleChangeClick={handleChangeClick}
				/>
			),
			delay: (
				<Delay
					onBack={handleBack}
					onSave={onSave}
					addTriggerLoading={info?.saveLoader}
					variables={variables}
					activeStepsData={activeStepsData}
					handleChangeClick={handleChangeClick}
				/>
			),
			gmail: (
				<GoogleActions
					onBack={handleBack}
					onSave={onSave}
					loading={info?.saveLoader}
					selectedAction={info?.selectedAction}
					activeStepsData={activeStepsData}
					handleChangeClick={handleChangeClick}
				/>
			),
			slack: (
				<SlackActions
					onBack={handleBack}
					onSave={onSave}
					loading={info?.saveLoader}
					selectedAction={info?.selectedAction}
					activeStepsData={activeStepsData}
					handleChangeClick={handleChangeClick}
				/>
			),
		};
	}, [
		updateInfo,
		onSave,
		info?.saveLoader,
		variables,
		info?.selectedAction,
		activeStepsData,
		handleChangeClick,
	]);

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
								onClose();
							}
						}}
						heading="Actions"
					/>
					<div className="actionSidebarContainer">
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
								?.filter((ele) =>
									info?.connectedIntegrations?.includes(
										ele?._id === 'gmail' ? 'google' : ele?._id,
									),
								)
								?.filter(
									(ele) =>
										!info?.selectedGroupId ||
										ele?._id === info?.selectedGroupId,
								)
								?.map((ele, index) => {
									// Check if search matches group name
									const groupNameMatches =
										!info?.search ||
										ele.groupName
											.toLowerCase()
											.includes(info.search.toLowerCase());

									// Filter actions based on search in action label or show all if group name matches
									const filteredActions = ele.actions.filter(
										(action) =>
											!action?.hide &&
											(groupNameMatches ||
												!info?.search ||
												action.actionLabel
													.toLowerCase()
													.includes(info.search.toLowerCase())),
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
													<div className="actionItemIcon">
														{ele?.icon}
													</div>
													<div className="actionItemLabel">
														{action?.actionLabel}
													</div>
												</div>
											))}
										</div>
									);
								})
								.filter(Boolean)}

							{!info.search &&
								integrations?.filter(
									(ele) =>
										!info?.connectedIntegrations?.includes(
											ele?._id === 'gmail' ? 'google' : ele?._id,
										),
								)?.length > 0 && (
									<div className="actionGroupItem">
										<h3>Available Integrations</h3>
										{integrations
											?.filter(
												(ele) =>
													!info?.connectedIntegrations?.includes(
														ele?._id === 'gmail' ? 'google' : ele?._id,
													),
											)
											?.map((action, index) => (
												<div
													className="actionItem"
													key={index}
													onClick={() => {
														if (
															!info?.connectedIntegrations?.includes(
																action?._id,
															)
														) {
															window.location.href =
																'/settings/integrations';
														}
													}}
												>
													<div className="actionItemIcon">
														{action?.icon}
													</div>
													<div className="actionItemLabel">
														{action?.groupName}
													</div>
													<div className="actionItemStatus">
														{info?.connectedIntegrations?.includes(
															action?._id,
														) ? (
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
					</div>
				</>
			)}
		</div>
	);
};

export default memo(Actions);
