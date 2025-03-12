import { BaseEdge, EdgeLabelRenderer, getBezierPath, getSmoothStepPath } from '@xyflow/react';
import React, { useCallback, useState } from 'react';
import '../../../assets/scss/automation_builder/customEdges.scss';
import { Tooltip } from 'antd';
import { ReactComponent as Action } from '../../../assets/svg/worflow_builder/customNodes/actionSvg.svg';
import { ReactComponent as IfElse } from '../../../assets/svg/worflow_builder/customNodes/ifelse.svg';

import { ReactComponent as Notification } from '../../../assets/svg/worflow_builder/customNodes/notification.svg';
// const CustomEdges = ({
// 	id,
// 	sourceX,
// 	sourceY,
// 	targetX,
// 	targetY,
// 	sourcePosition,
// 	targetPosition,
// 	style = {},
// 	markerEnd,
// 	data,
// }) => {
// 	const [edgePath, labelX, labelY] = getBezierPath({
// 		sourceX,
// 		sourceY,
// 		sourcePosition,
// 		targetX,
// 		targetY,
// 		targetPosition,
// 	});

// 	const [info, setInfo] = useState({
// 		addNodesPopUp: false,
// 	});

// 	const onAddOptionsClick = useCallback(
// 		(type) => {
// 			if (data?.onToolBarOpen) {
// 				data.onToolBarOpen({ toolBarOpen: true, sidebarType: type, activeEdge: id });
// 			}
// 			setInfo((prev) => ({ ...prev, addNodesPopUp: false }));
// 		},
// 		[data, id],
// 	);

// 	return (
// 		<>
// 			<BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
// 			<EdgeLabelRenderer>
// 				<div
// 					style={{
// 						position: 'absolute',
// 						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
// 						fontSize: 12,
// 						zIndex: 1000,
// 						pointerEvents: 'all',
// 					}}
// 				>
// 					<Tooltip
// 						placement="bottom"
// 						title={<AddNodesPopUp onAddOptionsClick={onAddOptionsClick} />}
// 						color={'#202020'}
// 						arrow={false}
// 						trigger="click"
// 						overlayClassName="reactFlowNodestoolTipContainer"
// 						open={info?.addNodesPopUp}
// 						onOpenChange={(open) => {
// 							setInfo((prev) => ({ ...prev, addNodesPopUp: open }));
// 						}}
// 					>
// 						{!info?.addNodesPopUp ? (
// 							<button
// 								type="button"
// 								className="edgeButton nodrag nopan"
// 								style={{
// 									pointerEvents: 'all',
// 									cursor: 'pointer',
// 								}}
// 							>
// 								+
// 							</button>
// 						) : (
// 							''
// 						)}
// 					</Tooltip>
// 				</div>
// 			</EdgeLabelRenderer>
// 		</>
// 	);
// };

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
	const [edgePath, labelX, labelY] = getSmoothStepPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
		sourcePosition,
		targetPosition,
		borderRadius: 0, // 90-degree angles
	});

	const [info, setInfo] = useState({
		addNodesPopUp: false,
	});

	const onAddOptionsClick = useCallback(
		(type) => {
			if (data?.onToolBarOpen) {
				data.onToolBarOpen({
					toolBarOpen: true,
					sidebarType: type,
					activeEdge: id,
					activeStepsData: null,
				});
			}
			setInfo((prev) => ({ ...prev, addNodesPopUp: false }));
		},
		[data, id],
	);

	const handleAddButtonClick = useCallback(() => {
		if (data?.onToolBarOpen) {
			data.onToolBarOpen({
				toolBarOpen: false,
				sidebarType: null,
				activeEdge: null,
				editMode: false,
				activeStepsData: null,
			});
		}
	}, [data, id]);

	const getEdgeLabelColor = () => {
		// Handle condition node labels
		if (data?.label === 'Yes') return '#4CAF50'; // Green for Yes
		if (data?.label === 'No') return '#F44336'; // Red for No

		// Handle switch node case labels - use different colors for different cases
		if (data?.label && data.label.startsWith('Case')) {
			// Generate colors based on case number for visual distinction
			const caseNumber = parseInt(data.label.replace('Case ', ''), 10) || 0;
			const colors = ['#FF9800', '#2196F3', '#9C27B0', '#00BCD4', '#FFEB3B', '#795548'];
			return colors[caseNumber % colors.length]; // Cycle through colors
		}

		// Handle switch default case
		if (data?.label === 'Default') return '#607D8B'; // Gray-blue for default

		// Default color for other edges
		return '#ffffff';
	};

	// Determine background color and text style based on label type
	const getLabelStyle = () => {
		if (!data?.label) return {};

		const color = getEdgeLabelColor();

		return {
			backgroundColor: `${color}20`, // 20% opacity of the text color
			color: color,
			padding: '4px 8px',
			borderRadius: '4px',
			fontWeight: 'bold',
			border: `1px solid ${color}40`, // 40% opacity border
		};
	};

	return (
		<>
			{/* Custom 90-degree edge path */}
			<BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />

			<EdgeLabelRenderer>
				<div
					style={{
						position: 'absolute',
						transform: `translate(-50%, ${
							data?.label ? '-65%' : '-50%'
						}) translate(${labelX}px,${labelY}px)`,
						fontSize: 12,
						zIndex: 1000,
						pointerEvents: 'all',
						background: 'transparent',
						padding: 0,
						borderRadius: '4px',
						boxShadow: data?.label ? '0px 2px 5px rgba(0, 0, 0, 0.2)' : 'none',
						display: 'flex',
						alignItems: 'center',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
				>
					{/* Display labels for condition and switch nodes */}
					{data?.label && (
						<span
							style={{
								textAlign: 'center',
								fontSize: '12px',
								...getLabelStyle(),
							}}
						>
							{data.label}
						</span>
					)}

					<Tooltip
						placement="bottom"
						title={<AddNodesPopUp onAddOptionsClick={onAddOptionsClick} />}
						color={'#202020'}
						arrow={false}
						trigger="click"
						overlayClassName="reactFlowNodestoolTipContainer"
						open={info?.addNodesPopUp}
						onOpenChange={(open) =>
							setInfo((prev) => ({ ...prev, addNodesPopUp: open }))
						}
					>
						{!info?.addNodesPopUp && (
							<button
								type="button"
								className="edgeButton nodrag nopan"
								style={{
									pointerEvents: 'all',
									cursor: 'pointer',
									marginTop: data?.label ? '6px' : '0', // Add space if there's a label
								}}
								onClick={handleAddButtonClick}
							>
								+
							</button>
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
			{/* <div className="addNodesTypeCategories" onClick={() => onAddOptionsClick('pipeline')}>
				<Pipeline />
				<span>Move Pipeline</span>
			</div> */}
		</div>
	);
};
