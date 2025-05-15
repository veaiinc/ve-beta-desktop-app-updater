import React, { memo } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';
import { Tooltip } from 'antd';

const ParentTaskComponent = ({ value, showTitle = false }) => {
	return (
		<Tooltip
			title={showTitle ? <div className="tooltip-inner">{'Parent task'}</div> : ''}
			placement="bottom"
			overlayClassName="tooltip-overlay-container"
			color="transparent"
		>
			<div className="parent-task-component">
				<span className="parent-task-title">{value?.title || ''}</span>
			</div>
		</Tooltip>
	);
};

export default memo(ParentTaskComponent);
