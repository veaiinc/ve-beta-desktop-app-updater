import React from 'react';
import './WorkflowNode.scss';

const WorkflowNode = ({ nodeId, stepsMapper }) => {
	if (!nodeId || !stepsMapper[nodeId]) {
		return null;
	}

	const node = stepsMapper[nodeId].data;

	const renderNodeContent = () => (
		<div className="workflow-node">
			<div className="node-card">
				<div className="node-content">
					<div className="node-text"></div>
				</div>
			</div>
		</div>
	);

	if (node.type === 'condition') {
		return (
			<div className="workflow-step">
				{renderNodeContent()}
				<div className="conditionConnector"></div>
				<div className="condition-branches">
					<div className="left-branches">hello</div>
					<div className="right-branches">there</div>
				</div>
				{/* <div className="condition-branches">
					<div className="branch-labels">
						<span className="yes-label">Yes</span>
						<span className="no-label">No</span>
					</div>
					<div className="branches">
						<div className="branch left-branch">
							<div className="branch-connector"></div>
							<WorkflowNode
								nodeId="66c46cb60d2024cacd650d9e"
								stepsMapper={stepsMapper}
							/>
						</div>
						<div className="branch right-branch">
							<div className="branch-connector"></div>
							<WorkflowNode
								nodeId="66c46ccd0d2024cacd650da0"
								stepsMapper={stepsMapper}
							/>
						</div>
					</div>
				</div> */}
			</div>
		);
	}

	return (
		<div className="workflow-step">
			{renderNodeContent()}
			{node.nextStepId && (
				<>
					<div className="connector"></div>
					<WorkflowNode nodeId={node.nextStepId} stepsMapper={stepsMapper} />
				</>
			)}
		</div>
	);
};

export default WorkflowNode;
