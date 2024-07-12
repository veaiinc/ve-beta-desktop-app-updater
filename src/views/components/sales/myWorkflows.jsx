import React, { memo } from 'react';
import '../../../assets/scss/sales/myWorkFlows.scss';
import MyWorkFlowStatsCard from './myWorkFlowStatsCard';
const _ = require('lodash');

const MyWorkflows = ({ workflows, inSights, openModal }) => {
	return (
		<div className="myworkflowsContainer">
			<div className="header">
				<p className="title">My Workflows</p>
				<a href="/sales/workflows">
					<p className="button">New Workflow</p>
				</a>
			</div>
			{workflows?.map((workflow, index) => (
				<div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
					<span className="workFlowHeader">{workflow?.title}</span>
					<MyWorkFlowStatsCard
						workflow={workflow}
						index={index}
						inSights={_.find(inSights, { templateId: workflow._id })}
						openModal={openModal}
					/>
				</div>
			))}
		</div>
	);
};

export default memo(MyWorkflows);
