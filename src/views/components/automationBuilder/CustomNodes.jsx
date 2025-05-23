import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import '../../../assets/scss/automation_builder/customNodes.scss';
import { ReactComponent as Form } from '../../../assets/svg/worflow_builder/customNodes/form.svg';
import { ReactComponent as Action } from '../../../assets/svg/worflow_builder/customNodes/actionSvg.svg';
import { ReactComponent as IfElse } from '../../../assets/svg/worflow_builder/customNodes/ifelse.svg';
import { ReactComponent as Slack } from '../../../assets/svg/worflow_builder/buildercard/slack.svg';
import { ReactComponent as Google } from '../../../assets/svg/worflow_builder/buildercard/google.svg';
import { ReactComponent as Dustbin } from '../../../assets/svg/worflow_builder/buildercard/labelledDustbin.svg';
import { ReactComponent as Copy } from '../../../assets/svg/worflow_builder/buildercard/labelledCopy.svg';
import { ReactComponent as ShockIcon } from '../../../assets/svg/automation_builder/shock.svg';
import { ReactComponent as SwitchIcon } from '../../../assets/svg/automation_builder/switch.svg';
import UpdatedDeleteWorkflowStep from '../modalsV2/automationBuilder/UpdatedDeleteStepsModal';
import { ReactComponent as OpenEye } from '../../../assets/svg/gallery/open-eye.svg';
import { ReactComponent as CrossedOpenEye } from '../../../assets/svg/gallery/crossedOpenEye.svg';
import { ReactComponent as ClockSvg } from '../../../assets/svg/activity/clock.svg';
import { Tooltip } from 'antd';

const actionTypeMapper = {
	email: 'Send Email',
	whatsapp: 'Whatsapp',
	phone: 'Phone',
	slack: 'Slack',
	createTask: 'Create Task',
	createMeeting: 'Create Meeting',
};
const actionTypeIconMapper = {
	email: <Google />,
	whatsapp: 'Whatsapp',
	phone: 'Phone',
	slack: <Slack />,
	createTask: <Action />,
	createMeeting: <Action />,
	gmail: <Google />,
	null: <Action />,
};

const eventTypeMapper = {
	// triggers
	messageReceived: 'Message Received',
	formResponse_create: 'Form Response',
	task_create: 'Task Created',
	task_update: 'Task Updated',
	task_delete: 'Task Deleted',
	client_create: 'Client Created',
	client_update: 'Client Updated',
	client_delete: 'Client Deleted',
	createFile_create: 'File Created',
	createFile_delete: 'File Deleted',
	template_create: 'Template Created',
	template_delete: 'Template Deleted',

	// actions
	sendMessage: 'Send Message',
	sendReply: 'Send Reply',
	getLabelInfo: 'Get Label Info',
	createLabel: 'Create Label',
	createDraft: 'Create Draft',
	deleteDraft: 'Delete Draft',
	getDraft: 'Get Draft',
	createTask: 'Create Task',
	createFile: 'Create Document',
	joinChannel: 'Join Channel',
	leaveChannel: 'Leave Channel',
	renameChannel: 'Rename Channel',
	channelMembers: 'Channel Members',
	getChannelInfo: 'Get Channel Info',
	getManyChannels: 'Get Many Channels',
	createChannel: 'Create Channel',
	replyMessage: 'Reply to message',
};

const appNameMapper = {
	gmail: 'Gmail',
	slack: 'Slack',
	inApp: 'In App',
	null: 'In App',
};

export const StartStepNode = ({ data }) => {
	const onAddOptionsClick = useCallback(() => {
		if (data?.onToolBarOpen) {
			data.onToolBarOpen({
				toolBarOpen: true,
				sidebarType: 'triggers',
			});
		}
	}, [data]);
	return (
		<div className="start-trigger-node" onClick={onAddOptionsClick}>
			<div className="start-trigger-node-title">
				<span>Set a trigger</span>
			</div>
		</div>
	);
};

export const TriggerNode = ({ data }) => {
	const onAddOptionsClick = useCallback(() => {
		if (data?.onToolBarOpen) {
			data.onToolBarOpen({
				toolBarOpen: true,
				sidebarType: 'triggers',
				step: '2',
				activeStepsData: data?.currentStep,
			});
		}
	}, [data]);

	return (
		<div className="custom-node trigger-node selectedNode" onClick={onAddOptionsClick}>
			<div className="trigger-extra-div">
				<ShockIcon />
				<span>Trigger</span>
			</div>
			<div className="triggerNodeContentContainer">
				<div className="triggerIconContainer">
					{actionTypeIconMapper[data?.currentStep?.app]}
				</div>

				<div className="triggerAcutalContentContainer">
					<div className="triggerUpperContent">
						<span className="triggerUpperContentTitle">
							{eventTypeMapper?.[
								data?.currentStep?.module
									? `${data?.currentStep?.module}_${data?.currentStep?.event}`
									: data?.currentStep?.event
							] ?? data?.currentStep?.event}
						</span>
						<span className="triggerUpperContentSubtitle">
							{appNameMapper?.[data?.currentStep?.app] ?? data?.currentStep?.app}
						</span>
					</div>
					<div
						className="triggerBottomContent"
						style={{ paddingBottom: 0, borderBottom: 'none' }}
					>
						<span className="triggerBottomContentTitle">
							{data?.currentStep?.title}
						</span>
						<span className="triggerBottomContentSubtitle">
							{data?.currentStep?.description}
						</span>
					</div>
				</div>
			</div>
			<Handle type="source" position={Position.Bottom} />
		</div>
	);
};

export const ActionNode = ({ data }) => {
	const openDeleteModal = useCallback(() => {
		if (data?.onToolBarOpen) {
			data.onToolBarOpen({
				deleteModalOpen: true,
				deleteStepData: data?.currentStep,
			});
		}
	}, [data]);

	const onActionNodeClick = useCallback(() => {
		if (data?.onToolBarOpen) {
			data.onToolBarOpen({
				toolBarOpen: true,
				sidebarType:
					data?.currentStep?.actionType === 'notification' ? 'notifications' : 'actions',
				activeStepsData: data?.currentStep,
				editMode: true,
			});
		}
	}, [data]);

	return (
		<Tooltip
			placement="right"
			title={
				<HoverComponentForNodes
					openDeleteModal={openDeleteModal}
					isHidden={data?.currentStep?.isHidden}
					onHideClick={() => {
						data?.changePipelineVisibility(
							data?.currentStep?._id,
							!data?.currentStep?.isHidden,
						);
					}}
					onDuplicateClick={() => {
						data?.duplicateStep(data?.currentStep?._id);
					}}
				/>
			}
			arrow={false}
			rootClassName="customNodesToolTip"
		>
			<div className="action-node" onClick={onActionNodeClick}>
				<div className="upper-action-node-container">
					<span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
						{
							actionTypeIconMapper[
								data?.currentStep?.channels?.[0] || data?.currentStep?.app
							]
						}
						{eventTypeMapper?.[
							data?.currentStep?.module || data?.currentStep?.criteria?.event
						] ?? data?.currentStep?.criteria?.event}
					</span>
					<span>
						{appNameMapper[
							data?.currentStep?.channels?.[0] || data?.currentStep?.app
						] || 'Email'}
					</span>
				</div>
				<div className="lower-action-node-container">
					<span className="lower-action-node-title">
						{data?.currentStep?.title || 'Steps Title'}
					</span>
					<span className="lower-action-node-subtitle">
						{data?.currentStep?.description || 'Steps Description'}
					</span>
				</div>
				<Handle type="source" position={Position.Bottom} />
				<Handle type="target" position={Position.Top} />
			</div>
		</Tooltip>
	);
};

export const ConditionNode = ({ data }) => {
	const openDeleteModal = useCallback(() => {
		if (data?.onToolBarOpen) {
			data.onToolBarOpen({
				deleteModalOpen: true,
				deleteStepData: data?.currentStep,
			});
		}
	}, [data]);

	const onConditionNodeClick = useCallback(() => {
		if (data?.onToolBarOpen) {
			data.onToolBarOpen({
				toolBarOpen: true,
				sidebarType: 'conditions',
				activeStepsData: data?.currentStep,
				editMode: true,
			});
		}
	}, [data]);

	return (
		<Tooltip
			placement="right"
			title={
				<HoverComponentForNodes
					openDeleteModal={openDeleteModal}
					isHidden={data?.currentStep?.isHidden}
					onHideClick={() => {
						data?.changePipelineVisibility(
							data?.currentStep?._id,
							!data?.currentStep?.isHidden,
						);
					}}
					onDuplicateClick={() => {
						data?.duplicateStep(data?.currentStep?._id);
					}}
					showDuplicate={false}
				/>
			}
			arrow={false}
			rootClassName="customNodesToolTip"
		>
			<div className="action-node" onClick={onConditionNodeClick}>
				<div className="upper-action-node-container">
					<span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
						<IfElse />
						If / else
					</span>
					<span> Condition</span>
				</div>
				<div className="lower-action-node-container">
					<span className="lower-action-node-title">
						{data?.currentStep?.title || 'Steps Title'}
					</span>

					<span className="lower-action-node-subtitle">
						{data?.currentStep?.description || 'Steps Description'}
					</span>
				</div>
				<Handle type="source" position={Position.Bottom} />
				<Handle type="target" position={Position.Top} />
			</div>
		</Tooltip>
	);
};

export const EndNode = ({ data }) => {
	return (
		<div className="action-node">
			<div className="upper-action-node-container">
				<span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>End Node</span>
				<span> End</span>
			</div>

			<Handle type="target" position={Position.Top} />
		</div>
	);
};

const HoverComponentForNodes = ({
	openDeleteModal,
	isHidden,
	onHideClick,
	onDuplicateClick,
	showDuplicate = true,
}) => {
	const hideTimeoutRef = useRef();
	const duplicateTimeoutRef = useRef();

	const handleDebouncedHide = useCallback(() => {
		if (hideTimeoutRef.current) {
			clearTimeout(hideTimeoutRef.current);
		}
		hideTimeoutRef.current = setTimeout(() => {
			onHideClick();
		}, 500);
	}, [onHideClick]);

	const handleDebouncedDuplicate = useCallback(() => {
		if (duplicateTimeoutRef.current) {
			clearTimeout(duplicateTimeoutRef.current);
		}
		duplicateTimeoutRef.current = setTimeout(() => {
			onDuplicateClick();
		}, 500);
	}, [onDuplicateClick]);

	return (
		<div className="rightNodeToolBar">
			<span>
				{isHidden ? (
					<CrossedOpenEye onClick={handleDebouncedHide} />
				) : (
					<OpenEye onClick={handleDebouncedHide} />
				)}
			</span>
			{showDuplicate && (
				<span onClick={handleDebouncedDuplicate}>
					<Copy />
				</span>
			)}
			<span onClick={openDeleteModal}>
				<Dustbin />
			</span>
		</div>
	);
};

export const SwitchNode = ({ data }) => {
	const openDeleteModal = useCallback(() => {
		if (data?.onToolBarOpen) {
			data.onToolBarOpen({
				deleteModalOpen: true,
				deleteStepData: data?.currentStep,
			});
		}
	}, [data]);

	const onSwitchNodeClick = useCallback(() => {
		if (data?.onToolBarOpen) {
			data.onToolBarOpen({
				toolBarOpen: true,
				sidebarType: 'conditions',
				activeStepsData: data?.currentStep,
				editMode: true,
			});
		}
	}, [data]);

	return (
		<Tooltip
			placement="right"
			title={
				<HoverComponentForNodes
					openDeleteModal={openDeleteModal}
					isHidden={data?.currentStep?.isHidden}
					onHideClick={() => {
						data?.changePipelineVisibility(
							data?.currentStep?._id,
							!data?.currentStep?.isHidden,
						);
					}}
					onDuplicateClick={() => {
						data?.duplicateStep(data?.currentStep?._id);
					}}
					showDuplicate={false}
				/>
			}
			arrow={false}
			rootClassName="customNodesToolTip"
		>
			<div className="action-node" onClick={onSwitchNodeClick}>
				<div className="upper-action-node-container">
					<span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
						<SwitchIcon />
						Switch
					</span>
					<span> Condition</span>
				</div>
				<div className="lower-action-node-container">
					<span className="lower-action-node-title">
						{data?.currentStep?.title || 'Switch Title'}
					</span>
					<span className="lower-action-node-subtitle">
						{data?.currentStep?.description || 'Switch Description'}
					</span>
				</div>
				<Handle type="source" position={Position.Bottom} />
				<Handle type="target" position={Position.Top} />
			</div>
		</Tooltip>
	);
};

export const DelayNode = ({ data }) => {
	const openDeleteModal = useCallback(() => {
		if (data?.onToolBarOpen) {
			data.onToolBarOpen({
				deleteModalOpen: true,
				deleteStepData: data?.currentStep,
			});
		}
	}, [data]);

	const onDelayNodeClick = useCallback(() => {
		if (data?.onToolBarOpen) {
			data.onToolBarOpen({
				toolBarOpen: true,
				sidebarType: 'actions',
				activeStepsData: data?.currentStep,
				editMode: true,
			});
		}
	}, [data]);

	return (
		<Tooltip
			placement="right"
			title={
				<HoverComponentForNodes
					openDeleteModal={openDeleteModal}
					isHidden={data?.currentStep?.isHidden}
					onHideClick={() => {
						data?.changePipelineVisibility(
							data?.currentStep?._id,
							!data?.currentStep?.isHidden,
						);
					}}
					onDuplicateClick={() => {
						data?.duplicateStep(data?.currentStep?._id);
					}}
				/>
			}
			arrow={false}
			rootClassName="customNodesToolTip"
		>
			<div className="action-node" onClick={onDelayNodeClick}>
				<div className="upper-action-node-container">
					<span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
						<ClockSvg />
						Delay{' '}
						{`( ${data?.currentStep?.inputBody?.duration} ${data?.currentStep?.inputBody?.delayIn} )`}
					</span>
					<span> In App</span>
				</div>
				<div className="lower-action-node-container">
					<span className="lower-action-node-title">
						{data?.currentStep?.title || 'Delay Title'}
					</span>
					<span className="lower-action-node-subtitle">
						{data?.currentStep?.description || 'Delay Description'}
					</span>
				</div>
				<Handle type="source" position={Position.Bottom} />
				<Handle type="target" position={Position.Top} />
			</div>
		</Tooltip>
	);
};
