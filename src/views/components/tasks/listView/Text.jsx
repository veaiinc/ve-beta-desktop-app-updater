import React, { memo } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import { Tooltip } from 'antd';

const Text = ({ value, isTitle = false, showTitle = false, title = '', wrap = false }) => {
	return (
		<div
			className={`listItem-text ${isTitle ? `listItem-title` : ``}`}
			style={{
				maxWidth: !wrap ? '400px' : '',
				overflow: !wrap ? 'hidden' : 'visible',
				textOverflow: !wrap ? 'ellipsis' : 'wrap',
				whiteSpace: !wrap ? 'nowrap' : 'normal',
				wordBreak: !wrap ? 'normal' : 'break-word',
				overflowWrap: !wrap ? 'normal' : 'break-word',
			}}
		>
			<Tooltip
				title={showTitle ? <div className="tooltip-inner">{title}</div> : ''}
				placement="bottom"
				overlayClassName="tooltip-overlay-container"
				color="transparent"
			>
				<span
					className="tooltip-text"
					// style={{
					// 	maxWidth: !wrap ? '400px' : '200px',
					// 	overflow: !wrap ? 'hidden' : 'visible',
					// 	textOverflow: !wrap ? 'ellipsis' : 'wrap',
					// 	whiteSpace: !wrap ? 'nowrap' : 'normal',
					// }}
				>
					{value}
				</span>
			</Tooltip>
		</div>
	);
};

export default memo(Text);
