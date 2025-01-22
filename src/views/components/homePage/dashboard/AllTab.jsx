import React from 'react';
import { memo } from 'react';
import '../../../../assets/scss/home_page/homepage.scss';
import {
	WeddingDayTimelineGeneratorCard,
	WorkflowWeddingDayCard,
} from '../workflows/workflowCards';

const AllTab = () => {
	return (
		<div className={`all-tab`}>
			<WeddingDayTimelineGeneratorCard />
			<WorkflowWeddingDayCard />
		</div>
	);
};

export default memo(AllTab);
