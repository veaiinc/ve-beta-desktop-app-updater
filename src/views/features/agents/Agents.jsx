import { memo, useContext, useEffect } from 'react';
import s from './agents.module.scss';
import Context from '../../../context/context';

// components
import QuickActions from '../../components/globalComponents/QuickActions';
import CreateNewAgentCard from '../../components/agents/createNewAgentCard/CreateNewAgentCard';

const Agents = () => {
	const {
		knowledgeAgent: { knowledgeAssistantsList, getKnowledgeAssistantsList },
	} = useContext(Context);

	useEffect(() => {
		if (knowledgeAssistantsList === null) {
			getKnowledgeAssistantsList();
		}
	}, []);

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
