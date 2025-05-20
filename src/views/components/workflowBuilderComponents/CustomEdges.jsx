import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';
import React, { useCallback, useState } from 'react';
import '../../../assets/scss/workflowBuilder/customEdges.scss';
import { Tooltip } from 'antd';
import Action from '../../../assets/svg/worflow_builder/customNodes/actionSvg.svg?react';
import IfElse from '../../../assets/svg/worflow_builder/customNodes/ifelse.svg?react';

import Pipeline from '../../../assets/svg/worflow_builder/customNodes/movePipeline.svg?react';
import Notification from '../../../assets/svg/worflow_builder/customNodes/notification.svg?react';
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
	data,
}) => {
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	const [info, setInfo] = useState({
		addNodesPopUp: false,
	});

	const onAddOptionsClick = useCallback((type) => {
		if (data?.onToolBarOpen) {
			data.onToolBarOpen({ toolBarOpen: true, sidebarType: type, activeEdge: id });
		}
		setInfo((prev) => ({ ...prev, addNodesPopUp: false }));
	}, []);

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
					<Tooltip
						placement="bottom"
						title={<AddNodesPopUp onAddOptionsClick={onAddOptionsClick} />}
						color={'#202020'}
						arrow={false}
						trigger="click"
						overlayClassName="reactFlowNodestoolTipContainer"
						open={info?.addNodesPopUp}
						onOpenChange={(open) => {
							setInfo((prev) => ({ ...prev, addNodesPopUp: open }));
						}}
					>
						{!info?.addNodesPopUp ? (
							<button
								type="button"
								className="edgeButton nodrag nopan"
								style={{
									pointerEvents: 'all',
									cursor: 'pointer',
								}}
							>
								+
							</button>
						) : (
							''
						)}
					</Tooltip>
				</div>
			</EdgeLabelRenderer>
		</>
	);
};

export default CustomEdges;

const AddNodesPopUp = ({ onAddOptionsClick }) => {
	return (
		<div className="addNewNodesPopUpContainer">
			<div
				className="addNodesTypeCategories"
				onClick={() => onAddOptionsClick('notifications')}
			>
				<Notification />
				<span>Send Notification</span>
			</div>
			<div className="addNodesTypeCategories" onClick={() => onAddOptionsClick('actions')}>
				<Action />
				<span>Action</span>
			</div>
			<div className="addNodesTypeCategories" onClick={() => onAddOptionsClick('conditions')}>
				<IfElse />
				<span>Condition</span>
			</div>
			<div className="addNodesTypeCategories" onClick={() => onAddOptionsClick('pipeline')}>
				<Pipeline />
				<span>Move Pipeline</span>
			</div>
		</div>
	);
};
