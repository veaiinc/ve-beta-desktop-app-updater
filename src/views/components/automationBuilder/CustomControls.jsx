import React from 'react';
import { ReactComponent as RearrangeSvg } from '../../../assets/svg/automation_builder/rearrange.svg';
import { ReactComponent as PlusSvg } from '../../../assets/svg/tasks/plus.svg';
import { ReactComponent as MinusSvg } from '../../../assets/svg/automation_builder/minus.svg';
import { useReactFlow, useViewport } from '@xyflow/react';
import { Tooltip } from 'antd';
import '../../../assets/scss/automation_builder/customControls.scss';
const CustomControls = ({ rearrangeNodes }) => {
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
			<Tooltip
				title={
					<div className="rearrangeTooltipContainer">
						<span className="rearrangeTooltipText">Organise blocks</span>
					</div>
				}
				arrow={false}
				color="transparent"
			>
				<button className="rearrangeBtn" onClick={rearrangeNodes}>
					<RearrangeSvg />
				</button>
			</Tooltip>
		</div>
	);
};

export default CustomControls;
