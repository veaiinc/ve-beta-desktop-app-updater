import React from 'react';
import { memo } from 'react';
import '../../../../assets/scss/home_page/homepage.scss';
import { WeddingDayTimelineGeneratorCard, PromptCard } from '../workflows/workflowCards';

const AllTab = () => {
	return (
		<div className={`all-tab`}>
			<WeddingDayTimelineGeneratorCard />
			<PromptCard />
		</div>
	);
};

export default memo(AllTab);
