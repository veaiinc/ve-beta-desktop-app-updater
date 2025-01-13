import React from 'react';
import { Handle, Position } from '@xyflow/react';
import '../../../assets/scss/workflowBuilder/customNodes.scss';
import { ReactComponent as Form } from '../../../assets/svg/worflow_builder/customNodes/form.svg';
import { ReactComponent as Action } from '../../../assets/svg/worflow_builder/customNodes/actionSvg.svg';
import { ReactComponent as IfElse } from '../../../assets/svg/worflow_builder/customNodes/ifelse.svg';
export const TriggerNode = ({ data }) => {
	return (
		<div className="custom-node trigger-node">
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
	return (
		<div className="action-node">
			<div className="upper-action-node-container">
				<span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
					<Action />
					Actions
				</span>
				<span>Create task</span>
			</div>
			<div className="lower-action-node-container">
				<span className="lower-action-node-title">Post editing</span>
				<span className="lower-action-node-subtitle">Post editing for client abhiloss</span>
			</div>
			<Handle type="source" position={Position.Bottom} />
			<Handle type="target" position={Position.Top} />
		</div>
	);
};

export const ConditionNode = ({ data }) => {
	return (
		<div className="action-node">
			<div className="upper-action-node-container">
				<span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
					<IfElse />
					If / else
				</span>
				<span> Condition</span>
			</div>
			<div className="lower-action-node-container">
				<span className="lower-action-node-title">Post editing</span>
				<span className="lower-action-node-subtitle">Post editing for client abhiloss</span>
			</div>
			<Handle type="source" position={Position.Bottom} />
			<Handle type="target" position={Position.Top} />
		</div>
	);
};
