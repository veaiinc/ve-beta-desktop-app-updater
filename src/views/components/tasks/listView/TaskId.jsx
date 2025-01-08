import React, { memo } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import { Tooltip } from 'antd';

const TaskId = ({ value, showTitle = false }) => {
	return (
		<div className="listItem-id">
			<Tooltip
				title={showTitle ? <div className="tooltip-inner">{'Task id'}</div> : ''}
				placement="bottom"
				overlayClassName="tooltip-overlay-container"
				color="transparent"
			>
				{value}
			</Tooltip>
		</div>
	);
};

export default memo(TaskId);
