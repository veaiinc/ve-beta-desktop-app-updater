import React, { memo } from 'react';
import Sales from '../../../features/sales/Sales';
import { WeddingDayTimelineGeneratorCard } from '../workflows/workflowCards';
import '../../../../assets/scss/home_page/homepage.scss';

const WorkflowsTab = () => {
	return (
		<div className="workflows-tab">
			<WeddingDayTimelineGeneratorCard />
			<WeddingDayTimelineGeneratorCard />
			<Sales />
		</div>
	);
};

export default memo(WorkflowsTab);
