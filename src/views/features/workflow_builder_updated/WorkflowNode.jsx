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
					<div className="node-text">{node?._id}</div>
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
					<div className="left-branches">
						<div className="yes-branch-container">
							<div className="yes-block-wrapper">
								<div className="yes-block">Yes</div>
								<div className="yes-right-seperator"></div>
							</div>
							<div className="connector" style={{ marginLeft: '40px' }}></div>
						</div>
						<div className="yes-nodes-container">
							<WorkflowNode
								nodeId={node?.ifYes?.nextStepId}
								stepsMapper={stepsMapper}
							/>
						</div>
					</div>
					<div className="right-branches">
						<div className="no-branch-container">
							<div className="no-block-wrapper">
								<div className="right-seperator"></div>
								<div className="yes-block">No</div>
							</div>
							<div
								className="no-block-wrapper"
								style={{ justifyContent: 'flex-end' }}
							>
								<div
									className="connector"
									style={{ marginRight: '40px', alignSelf: 'baseline' }}
								></div>
							</div>
						</div>
						<div className="no-nodes-container">
							<WorkflowNode
								nodeId={node?.ifNo?.nextStepId}
								stepsMapper={stepsMapper}
							/>
						</div>
					</div>
				</div>
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
