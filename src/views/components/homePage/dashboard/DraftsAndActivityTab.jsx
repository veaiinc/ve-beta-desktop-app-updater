import React from 'react';
import { memo } from 'react';
import { Activity, Drafts, Notes } from '../../ai_agents/CreateCards';

const DraftsAndActivityTab = () => {
	return (
		<div className="drafts-and-activity-tab">
			<Activity />
			<Drafts />
			<Notes />
		</div>
	);
};

export default memo(DraftsAndActivityTab);
