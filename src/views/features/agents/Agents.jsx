import { memo, useState } from 'react';
import s from './agents.module.scss';

// components
import QuickActions from '../../components/globalComponents/QuickActions';
import CreateNewAgentCard from '../../components/agents/createNewAgentCard/CreateNewAgentCard';
// import AgentDetails from '../../components/agents/agentName/AgentDetails';
// import RunAndBuildToggle from '../../components/agents/runBuildToggle/RunAndBuildToggle';

// svgs
import { ReactComponent as LeftCaret } from './assets/left-caret.svg';

const Agents = () => {
	return (
		<div className={s.agentsContainer}>
			<h1 className={s.title}>Workflow Agents</h1>
			<div className={s.body}>
				<CreateNewAgentCard />
			</div>
			<QuickActions />
		</div>
	);
};

export default memo(Agents);
