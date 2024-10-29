import React from 'react';
import '../../../assets/scss/popover/tooltip.scss';

const ToolTipContainer = ({ title = '', content, style = {}, removeClassName = false }) => {
	return (
		<div className={removeClassName ? '' : 'tooltipParentContainer'} style={{ ...style }}>
			{title ? <span className="tooltipHeadertext">{title}</span> : ''}
			<span className="tooltipHeaderSubtext">{content}</span>
		</div>
	);
};

export default ToolTipContainer;
