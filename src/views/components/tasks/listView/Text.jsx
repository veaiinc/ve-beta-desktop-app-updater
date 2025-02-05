import React, { memo } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import { Tooltip } from 'antd';

const Text = ({ value, isTitle = false, showTitle = false, title = '', wrap = true }) => {
	return (
		<div
			className={`listItem-text ${isTitle ? `listItem-title` : ``}`}
			style={{
				maxWidth: wrap ? '400px' : 'auto',
				overflow: wrap ? 'hidden' : 'visible',
				textOverflow: wrap ? 'ellipsis' : 'clip',
				whiteSpace: wrap ? 'nowrap' : 'normal',
			}}
		>
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
