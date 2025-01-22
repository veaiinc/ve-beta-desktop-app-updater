import React from 'react';
import { memo } from 'react';
import '../../../../assets/scss/home_page/homepage.scss';
import { Activity, Drafts } from '../../ai_agents/CreateCards';

const AllTab = () => {
	return (
		<div className={`all-tab-container`}>
			<Activity />
		</div>
	);
};

export default memo(AllTab);
