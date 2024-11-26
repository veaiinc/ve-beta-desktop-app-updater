import React, { useLayoutEffect, useRef, useState } from 'react';
import './WorkflowNode.scss';

const WorkflowNode = ({ nodeId, stepsMapper }) => {
	const yesNodesContainerRef = useRef(null);
	const noNodesContainerRef = useRef(null);
	const [info, setInfo] = useState({
		translateXForYes: 0,
		translateForNo: 0,
	});

	useLayoutEffect(() => {
		translatefunction(yesNodesContainerRef, 'Yes');
	}, [yesNodesContainerRef?.current]);

	useLayoutEffect(() => {
		translatefunction(noNodesContainerRef, 'No');
	}, [noNodesContainerRef?.current]);

	const translatefunction = (refData, type) => {
		const width = refData?.current?.getBoundingClientRect().width;
		if (width) {
			const blockWidth = 350;
			const leftOutSpaceOnEachSide = (width - blockWidth) / 2;
			const yesBlockWidth = width - 150;

			if (type === 'Yes') {
				const requiredTransalation =
					yesBlockWidth - (leftOutSpaceOnEachSide + blockWidth / 2);
				setInfo((prev) => ({ ...prev, translateXForYes: requiredTransalation }));
			} else {
				const requiredTransalation = leftOutSpaceOnEachSide + blockWidth / 2 - 150;
				setInfo((prev) => ({ ...prev, translateForNo: requiredTransalation }));
			}
		}
	};

	const renderNodeContent = (type = null) => (
		<div className="workflow-node">
			<div className="node-card">
				<div className="node-content">
					<div className="node-text" style={{ color: '#fff' }}>
						{!type ? nodeId : 'Block Ends Here'}
					</div>
				</div>
			</div>
		</div>
	);

	if (!nodeId || !stepsMapper[nodeId]) {
		return renderNodeContent('end-block');
	}

	const node = stepsMapper[nodeId].data;

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
						<div
							className={`yes-nodes-container ${nodeId}`}
							ref={yesNodesContainerRef}
							style={{
								translate: info?.translateXForYes
									? `-${info?.translateXForYes}px`
									: '', // Apply calculated translation
							}}
						>
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
						<div
							className="no-nodes-container"
							ref={noNodesContainerRef}
							style={{
								translate: info?.translateForNo ? `${info?.translateForNo}px` : '', // Apply calculated translation
							}}
						>
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
