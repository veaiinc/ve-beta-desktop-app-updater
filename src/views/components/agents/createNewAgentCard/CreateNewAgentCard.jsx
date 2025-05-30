import { memo, useContext } from 'react';
import s from './createNewAgentCard.module.scss';

// icons
import { ReactComponent as CarretRight } from './assets/carret-right.svg';

// images
import AgentsIcons from './assets/agents-icons.png';
import Context from '../../../../context/context';

// utils
import { generateRandomAIAgentName } from './utils';
import { message } from '../../globalComponents/CustomToast';
import { useNavigate } from 'react-router-dom';

const CreateNewAgentCard = () => {
	const navigate = useNavigate();

	const {
		knowledgeAgent: { createNewKnowledgeAgent },
	} = useContext(Context);

	const handleCreateAgent = async () => {
		const agentName = generateRandomAIAgentName();
		console.log('agentName', agentName);
		const [success, data] = await createNewKnowledgeAgent(agentName);
		if (success) {
			const assistantId = data?.insertedId;
			navigate(`/agent/${assistantId}`);
		} else {
			message.error(data?.message);
		}
	};

	return (
		<div className={s.agentIntroCard}>
			<h1 className={s.title}>Every Agent is truly Proactive AI</h1>
			<h2 className={s.subtitle}>Smart action before you even ask</h2>
			<button onClick={handleCreateAgent} className={s.createAgentBtn}>
				<span className={s.title}>Create new agent</span>
				<CarretRight />
			</button>
			<div className={s.divider}></div>
			<img src={AgentsIcons} alt="agents-icons" />
		</div>
	);
};

export default memo(CreateNewAgentCard);
