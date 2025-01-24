import React, { useCallback, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import '../../../assets/scss/workflowBuilder/customNodes.scss';
import { ReactComponent as Form } from '../../../assets/svg/worflow_builder/customNodes/form.svg';
import { ReactComponent as Action } from '../../../assets/svg/worflow_builder/customNodes/actionSvg.svg';
import { ReactComponent as IfElse } from '../../../assets/svg/worflow_builder/customNodes/ifelse.svg';
import { ReactComponent as Slack } from '../../../assets/svg/worflow_builder/buildercard/slack.svg';
import { ReactComponent as Google } from '../../../assets/svg/worflow_builder/buildercard/google.svg';
import { ReactComponent as Dustbin } from '../../../assets/svg/worflow_builder/buildercard/labelledDustbin.svg';
import { ReactComponent as Copy } from '../../../assets/svg/worflow_builder/buildercard/labelledCopy.svg';
import { ReactComponent as Eye } from '../../../assets/svg/worflow_builder/buildercard/labelledEye.svg';
import UpdatedDeleteWorkflowStep from '../modalsV2/workflowBuilderModals/UpdatedDeleteStepsModal';
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
};
export const TriggerNode = ({ data }) => {
	const onAddOptionsClick = useCallback(() => {
		if (data?.onToolBarOpen) {
			data.onToolBarOpen({ toolBarOpen: true, sidebarType: 'trigger' });
		}
	}, []);
	return (
		<div className="custom-node trigger-node" onClick={onAddOptionsClick}>
			<div className="trigger-extra-div">
				<span>Trigger</span>
			</div>
			<div className="triggerNodeContentContainer">
				<Form />

				<div className="triggerAcutalContentContainer">
					<div className="triggerUpperContent">
						<span className="triggerUpperContentTitle">Form Submission</span>
						<span className="triggerUpperContentSubtitle">Wedding Inquiry Form</span>
					</div>
					<div
						className="triggerUpperContent"
						style={{ paddingBottom: 0, borderBottom: 'none' }}
					>
						<span className="triggerUpperContentTitle">Enquiries</span>
						<span className="triggerUpperContentSubtitle">
							All the enquiries will come here
						</span>
					</div>
				</div>
			</div>
			<Handle type="source" position={Position.Bottom} />
		</div>
	);
};

export const ActionNode = ({ data }) => {
	const [info, setInfo] = useState({
		deleteModal: false,
	});
	const handleCloseDeleteModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, deleteModal: false }));
	}, [info]);

	const openDeleteModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, deleteModal: true }));
	}, [info]);

	return (
		<Tooltip
			placement="right"
			title={<HoverComponentForNodes openDeleteModal={openDeleteModal} />}
			arrow={false}
			rootClassName="customNodesToolTip"
		>
			<div className="action-node">
				<div className="upper-action-node-container">
					<span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
						{
							actionTypeIconMapper[
								data?.currentStep?.channels?.[0] || data?.currentStep?.actionType
							]
						}
						Actions
					</span>
					<span>
						{actionTypeMapper[
							data?.currentStep?.channels?.[0] || data?.currentStep?.actionType
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

				<UpdatedDeleteWorkflowStep
					modalIsOpen={info?.deleteModal}
					closeModal={handleCloseDeleteModal}
					templateId={data?.templateId}
					stepId={data?.currentStep?._id}
					workflowdata={data?.currentStep}
					refetchWorkflowBuilderData={data?.refetchWorkflowBuilderData}
					stepsMapper={data?.stepsMapper}
				/>
			</div>
		</Tooltip>
	);
};

export const ConditionNode = ({ data }) => {
	const [info, setInfo] = useState({
		deleteModal: false,
	});
	const handleCloseDeleteModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, deleteModal: false }));
	}, [info]);

	const openDeleteModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, deleteModal: true }));
	}, [info]);

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
			title={<HoverComponentForNodes openDeleteModal={openDeleteModal} />}
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
				<UpdatedDeleteWorkflowStep
					modalIsOpen={info?.deleteModal}
					closeModal={handleCloseDeleteModal}
					templateId={data?.templateId}
					stepId={data?.currentStep?._id}
					workflowdata={data?.currentStep}
					refetchWorkflowBuilderData={data?.refetchWorkflowBuilderData}
					stepsMapper={data?.stepsMapper}
				/>
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

const HoverComponentForNodes = ({ openDeleteModal }) => {
	return (
		<div className="rightNodeToolBar">
			<span>
				<Eye />
			</span>
			<span>
				<Copy />
			</span>
			<span onClick={openDeleteModal}>
				<Dustbin />
			</span>
		</div>
	);
};
