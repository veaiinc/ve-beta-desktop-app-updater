import { memo } from 'react';
import s from './createNewAgentCard.module.scss';

// icons
import { ReactComponent as CarretRight } from './assets/carret-right.svg';

// images
import AgentsIcons from './assets/agents-icons.png';

const CreateNewAgentCard = ({ handleCreateAgent }) => {
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
