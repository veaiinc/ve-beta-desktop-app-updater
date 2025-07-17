import React, { memo } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import { Tooltip } from 'antd';

const TaskId = ({ value, showTitle = false, prefix = null }) => {
	return (
		<div className="listItem-id">
			<Tooltip
				title={showTitle ? <div className="tooltip-inner">{'Task id'}</div> : ''}
				placement="bottom"
				overlayClassName="tooltip-overlay-container"
				color="transparent"
			>
				{prefix ? `${prefix}-${value}` : value}
			</Tooltip>
		</div>
	);
};

export default memo(TaskId);
