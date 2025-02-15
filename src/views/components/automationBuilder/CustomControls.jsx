import React from 'react';
import { ReactComponent as RearrangeSvg } from '../../../assets/svg/automation_builder/rearrange.svg';
import { ReactComponent as PlusSvg } from '../../../assets/svg/tasks/plus.svg';
import { ReactComponent as MinusSvg } from '../../../assets/svg/automation_builder/minus.svg';
import { useReactFlow, useViewport } from '@xyflow/react';

const CustomControls = ({ rearrangeNodesVertically }) => {
	const { zoomIn, zoomOut } = useReactFlow();
	const { zoom } = useViewport();

	return (
		<div className="viewportControlsContainer">
			<div className="zoomControls">
				<button className="zoomOutBtn" onClick={() => zoomOut()}>
					<MinusSvg />
				</button>
				<span className="zoomLevelText">{Math.round(zoom * 100)}%</span>
				<button className="zoomInBtn" onClick={() => zoomIn()}>
					<PlusSvg />
				</button>
			</div>
			<button className="rearrangeBtn" onClick={rearrangeNodesVertically}>
				<RearrangeSvg />
			</button>
		</div>
	);
};

export default CustomControls;
