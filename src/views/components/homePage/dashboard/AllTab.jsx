import React from 'react';
import { memo } from 'react';
import '../../../../assets/scss/home_page/homepage.scss';
import { WeddingDayTimelineGeneratorCard, PromptCard } from './workflows/workflowCards';
import WorkflowsTab from './WorkflowsTab';

const AllTab = () => {
	return (
		<div className={`all-tab`}>
			<WorkflowsTab />
			{/* <PromptCard /> */}
		</div>
	);
};

export default memo(AllTab);
