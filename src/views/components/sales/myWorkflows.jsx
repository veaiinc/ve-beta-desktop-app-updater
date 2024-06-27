import React from 'react';
import '../../../assets/scss/sales/myWorkFlows.scss';
import MyWorkFlowStatsCard from './myWorkFlowStatsCard';
const _ = require('lodash');

function MyWorkflows({ workflows, inSights }) {
	return (
		<div className="myworkflowsContainer">
			<div className="header">
				<p className="title">My Workflows</p>
				<a href="/sales/workflows">
					<p className="button">New Workflow</p>
				</a>
			</div>
			{workflows.map((workflow, index) => (
				<MyWorkFlowStatsCard
					workflow={workflow}
					index={index}
					inSights={_.filter(inSights, { templateId: workflow._id })}
				/>
			))}
		</div>
	);
}

export default MyWorkflows;
