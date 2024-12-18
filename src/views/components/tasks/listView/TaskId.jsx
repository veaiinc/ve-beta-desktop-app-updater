import React, { memo } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';

const TaskId = ({ value }) => {
	return <div className="listItem-id">{value}</div>;
};

export default memo(TaskId);
