import React from 'react';
import '../../../assets/scss/popover/tooltip.scss';

const ToolTipContainer = ({
	title = '',
	content,
	customContainerStyle = {},
	contentStyling = {},
}) => {
	return (
		<div className={'tooltipParentContainer'} style={{ ...customContainerStyle }}>
			{title?.length ? <span className="tooltipHeadertext">{title}</span> : ''}
			<span className="tooltipHeaderSubtext" style={{ ...contentStyling }}>
				{content}
			</span>
		</div>
	);
};

export default ToolTipContainer;
