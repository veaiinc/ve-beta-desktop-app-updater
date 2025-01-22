import React, { memo } from 'react';
import Sales from '../../../features/sales/Sales';
import WeddingDayTimeLine from '../workflows/workflowCards';
import '../../../../assets/scss/home_page/homepage.scss';

const WorkflowsTab = () => {
	return (
		<div className="workflows-tab">
			<WeddingDayTimeLine />
			<Sales />
		</div>
	);
};

export default memo(WorkflowsTab);
