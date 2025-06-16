import { memo } from 'react';
import s from './agent.module.scss';
import AgentDetails from '../../../components/agents/agentDetails/AgentDetails';

const Agent = () => {
	return (
		<div className={s.agentContainer}>
			<AgentDetails />
		</div>
	);
};

export default memo(Agent);
