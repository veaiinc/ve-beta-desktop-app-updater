import { memo } from 'react';
import s from './agent.module.scss';
import AgentDetails from '../../../components/agents/agentDetails/AgentDetails';

const Agent = () => {
	return (
		<div className={s.container}>
			<AgentDetails />
		</div>
	);
};

export default memo(Agent);
