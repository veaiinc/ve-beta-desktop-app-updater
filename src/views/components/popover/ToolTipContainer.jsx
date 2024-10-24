import React from 'react';
import '../../../assets/scss/popover/tooltip.scss';

const ToolTipContainer = ({ showTitle, title, content, style }) => {
	return (
		<div {...(style ? { style } : { className: 'tooltipParentContainer' })}>
			{showTitle && <span className="tooltipHeadertext">{title}</span>}
			<span className="tooltipHeaderSubtext">{content}</span>
		</div>
	);
};

export default ToolTipContainer;
