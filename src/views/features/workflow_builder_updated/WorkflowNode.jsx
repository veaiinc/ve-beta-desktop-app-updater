import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import './WorkflowNode.scss';
import WorkflowBuilderCards from '../../components/workflowBuilderComponents/WorkflowBuilderCards';
import WorkflowConnector from '../../components/workflowBuilderComponents/WorkflowConnector';
import debounce from 'lodash/debounce';
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

	// Memoize the translate function
	const translatefunction = useCallback((refData, type) => {
		const width = refData?.current?.getBoundingClientRect().width;
		if (width) {
			const blockWidth = 300;
			const leftOutSpaceOnEachSide = (width - blockWidth) / 2;
			const yesBlockWidth = width - 137; //initialy 150, if there is problem revert this to 150 and connetor width to 8px instead of current 20 px

			if (type === 'Yes') {
				const requiredTransalation =
					yesBlockWidth - (leftOutSpaceOnEachSide + blockWidth / 2);
				setInfo((prev) => ({ ...prev, translateXForYes: requiredTransalation }));
			} else {
				const requiredTransalation = leftOutSpaceOnEachSide + blockWidth / 2 - 137;
				setInfo((prev) => ({ ...prev, translateForNo: requiredTransalation }));
			}
		}
	}, []);

	// Create a debounced version of the calculations
	const debouncedTranslate = useCallback(
		debounce(() => {
			if (noNodesContainerRef.current) {
				translatefunction(noNodesContainerRef, 'No');
			}
			if (yesNodesContainerRef.current) {
				translatefunction(yesNodesContainerRef, 'Yes');
			}
		}, 150), // 150ms debounce time
		[translatefunction],
	);

	// Set up observers for size changes
	useEffect(() => {
		if (!noNodesContainerRef.current || !yesNodesContainerRef.current) return;

		// Create ResizeObserver
		const resizeObserver = new ResizeObserver(debouncedTranslate);

		// Observe both containers
		resizeObserver.observe(noNodesContainerRef.current);
		resizeObserver.observe(yesNodesContainerRef.current);

		// Initial calculation
		debouncedTranslate();

		// Cleanup
		return () => {
			resizeObserver.disconnect();
			debouncedTranslate.cancel();
		};
	}, [debouncedTranslate, nodeId, stepsMapper]);

	const renderNodeContent = (type = null) => (
		<WorkflowBuilderCards
			workflowdata={stepsMapper?.[nodeId]?.data}
			openModal={openModal}
			index={'sfsfs'}
			templateData={templateData}
			openPreviewModal={openPreviewModal}
			stepsMapper={stepsMapper}
		/>
	);

	if (!nodeId || !stepsMapper[nodeId]) {
		return renderNodeContent('end-block');
	}

	const node = stepsMapper[nodeId].data;

	if (node.type === 'condition') {
		return (
			<div className="workflow-step" data-node-id={nodeId}>
				{renderNodeContent()}
				<div style={{ display: 'flex', width: '20px', justifyContent: 'center' }}>
					<div className="conditionConnector"></div>
				</div>
				<div className="condition-branches">
					<div className="left-branches">
						<div className="yes-branch-container">
							<div className="yes-block-wrapper">
								<div className="yes-block">Yes</div>
								<div className="yes-right-seperator"></div>
							</div>

							<WorkflowConnector
								style={{ marginLeft: '27px' }}
								alterData={alterData}
								previousStepPath={'condition-yes'}
								previousStepId={nodeId}
								stepsMapper={stepsMapper}
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
									style={{ marginRight: '27px', alignSelf: 'baseline' }}
									stepsMapper={stepsMapper}
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
		<div className="workflow-step" data-node-id={nodeId}>
			{renderNodeContent()}

			<>
				<WorkflowConnector
					alterData={alterData}
					previousStepPath={'straight'}
					previousStepId={nodeId}
					stepsMapper={stepsMapper}
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

export default memo(WorkflowNode);
