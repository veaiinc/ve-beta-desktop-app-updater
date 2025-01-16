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
					className="nodrag nopan"
				>
					<button
						className="edgeButton"
						onClick={(e) => {
							console.log('Edge button clicked:', id);
						}}
						style={{ pointerEvents: 'all' }}
					>
						+
					</button>
				</div>
			</EdgeLabelRenderer>
		</>
	);
};

export default CustomEdges;
