import React, { memo } from 'react';
import '../../../assets/scss/sales/myWorkFlows.scss';
import MyWorkFlowStatsCard from './myWorkFlowStatsCard';
import { useNavigate } from 'react-router-dom';

const _ = require('lodash');

const MyWorkflows = ({ workflows, inSights, openModal, source }) => {
	const navigate = useNavigate();
	return (
		<div className="myworkflowsContainer">
			<div className="header">
				<p className="title">My Workflows</p>
				<div onClick={() => navigate('/sales/workflows')}>
					<p className="button">New Workflow</p>
				</div>
			</div>
			{workflows?.map((workflow, index) => (
				<div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
					<span className="workFlowHeader">{workflow?.title}</span>
					<MyWorkFlowStatsCard
						workflow={workflow}
						index={index}
						inSights={_.find(inSights, { templateId: workflow._id })}
						openModal={openModal}
						source={source}
					/>
				</div>
			))}
		</div>
	);
};

export default memo(MyWorkflows);
