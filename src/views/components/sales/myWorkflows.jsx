import React from 'react';
import '../../../assets/scss/sales/myWorkFlows.scss';
import MyWorkFlowStatsCard from './myWorkFlowStatsCard';
function MyWorkflows(props) {
	return (
		<div className="myworkflowsContainer">
			<div className="header">
				<p className="title">My Workflows</p>
				<a href="/sales/workflows">
					<p className="button">New Workflow</p>
				</a>
			</div>
			<MyWorkFlowStatsCard />
			<MyWorkFlowStatsCard />
		</div>
	);
}

export default MyWorkflows;
