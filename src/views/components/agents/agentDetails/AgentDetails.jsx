import { memo, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import s from './agentDetails.module.scss';
import Context from '../../../../context/context';

// components
import RunAndBuildToggle from '../runBuildToggle/RunAndBuildToggle';
import ConfigureAgent from './configureAgent/ConfigureAgent';
import AgentCredentials from './agentCredentials/AgentCredentials';

const AgentDetails = () => {
	const { agentId } = useParams();

	const {
		knowledgeAgent: { activeKnowledgeAssistant, getActiveKnowledgeAgentDetails },
	} = useContext(Context);

	useEffect(() => {
		if (activeKnowledgeAssistant === null && agentId) getActiveKnowledgeAgentDetails(agentId);
	}, []);

	return (
		<div className={s.agentDetailsContainer}>
			<div className={s.agentDetailsContainer}>
				<RunAndBuildToggle />
				<AgentCredentials agentId={agentId} />
				<ConfigureAgent agentId={agentId} />
			</div>
		</div>
	);
};

export default memo(AgentDetails);
