import React, { memo } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import { Tooltip } from 'antd';

const Text = ({ value, isTitle = false, showTitle = false, title = '' }) => {
	return (
		<div className={`listItem-text ${isTitle ? `listItem-title` : ``}`}>
			<Tooltip
				title={showTitle ? <div className="tooltip-inner">{title}</div> : ''}
				placement="bottom"
				overlayClassName="tooltip-overlay-container"
				color="transparent"
			>
				{value}
			</Tooltip>
		</div>
	);
};

export default memo(Text);
