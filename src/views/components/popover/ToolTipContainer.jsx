import React from 'react';
import '../../../assets/scss/popover/tooltip.scss';

const ToolTipContainer = ({ title, content }) => {
	return (
		<div className="tooltipParentContainer">
			<span className="tooltipHeadertext">{title}</span>
			<span className="tooltipHeaderSubtext">{content}</span>
		</div>
	);
};

export default ToolTipContainer;
