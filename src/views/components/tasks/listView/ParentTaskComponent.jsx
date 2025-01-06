import React, { memo } from 'react';
import '../../../../assets/scss/tasks/listItems.scss';

import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';

const ParentTaskComponent = ({ value }) => {
	return (
		<div className="parent-task-component">
			<ChevronRightThinSvg />
			<span className="parent-task-title">{value?.title || ''}</span>
		</div>
	);
};

export default memo(ParentTaskComponent);
