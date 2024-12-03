import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './WorkflowNode.scss';
import WorkflowBuilderCards from '../../components/workflowBuilderComponents/WorkflowBuilderCards';
import WorkflowConnector from '../../components/workflowBuilderComponents/WorkflowConnector';

const WorkflowNode = ({
	nodeId,
	stepsMapper,
	templateData,
	openModal,
	openPreviewModal,
	alterData,
	// handleNodesRedering,
}) => {
	const yesNodesContainerRef = useRef(null);
	const noNodesContainerRef = useRef(null);
	const [info, setInfo] = useState({
		translateXForYes: 0,
		translateForNo: 0,
	});

	// useEffect(() => {
	// 	// return () => {
	// 	// console.log('I am getting unmounted');
	// 	handleNodesRedering(nodeId);
	// 	// };
	// }, []);

	useLayoutEffect(() => {
		translatefunction(yesNodesContainerRef, 'Yes');
	}, [yesNodesContainerRef?.current]);

	useLayoutEffect(() => {
		translatefunction(noNodesContainerRef, 'No');
	}, [noNodesContainerRef?.current]);

	const translatefunction = (refData, type) => {
		const width = refData?.current?.getBoundingClientRect().width;
		if (width) {
			const blockWidth = 300;
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
		<WorkflowBuilderCards
			workflowdata={stepsMapper?.[nodeId]?.data}
			openModal={openModal}
			index={'sfsfs'}
			templateData={templateData}
			openPreviewModal={openPreviewModal}
		/>
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

							<WorkflowConnector
								style={{ marginLeft: '40px' }}
								alterData={alterData}
								previousStepPath={'condition-yes'}
								previousStepId={nodeId}
							/>
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
								templateData={templateData}
								openPreviewModal={openPreviewModal}
								openModal={openModal}
								alterData={alterData}
								// handleNodesRedering={handleNodesRedering}
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
								<WorkflowConnector
									alterData={alterData}
									previousStepPath={'condition-no'}
									previousStepId={nodeId}
									style={{ marginRight: '40px', alignSelf: 'baseline' }}
								/>
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
								templateData={templateData}
								openPreviewModal={openPreviewModal}
								openModal={openModal}
								alterData={alterData}
								// handleNodesRedering={handleNodesRedering}
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

			<>
				<WorkflowConnector
					alterData={alterData}
					previousStepPath={'straight'}
					previousStepId={nodeId}
				/>
				<WorkflowNode
					nodeId={node.nextStepId}
					stepsMapper={stepsMapper}
					templateData={templateData}
					openPreviewModal={openPreviewModal}
					openModal={openModal}
					alterData={alterData}
					// handleNodesRedering={handleNodesRedering}
				/>
			</>
		</div>
	);
};

export default WorkflowNode;
