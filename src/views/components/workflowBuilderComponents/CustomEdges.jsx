import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';
import React from 'react';
import '../../../assets/scss/workflowBuilder/customEdges.scss';

const CustomEdges = ({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	style = {},
	markerEnd,
}) => {
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	const onEdgeClick = (e) => {
		e.preventDefault();
		e.stopPropagation();
		console.log('Edge button clicked:', id);
	};

	return (
		<>
			<BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
			<EdgeLabelRenderer>
				<div
					style={{
						position: 'absolute',
						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
						fontSize: 12,
						zIndex: 1000,
						pointerEvents: 'all',
					}}
				>
					<button
						type="button"
						className="edgeButton nodrag nopan"
						onClick={onEdgeClick}
						style={{
							pointerEvents: 'all',
							cursor: 'pointer',
						}}
					>
						+
					</button>
				</div>
			</EdgeLabelRenderer>
		</>
	);
};

export default CustomEdges;
