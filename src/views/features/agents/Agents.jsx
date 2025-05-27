import { memo } from 'react';
import s from './agents.module.scss';

// components
import QuickActions from '../../components/globalComponents/QuickActions';

// icons
import { ReactComponent as CarretRight } from './assets/carret-right.svg';

const Agents = () => {
	return (
		<div className={s.agentsContainer}>
			<h1 className={s.title}>Workflow Agent</h1>
			<div className={s.body}>
				<div className={s.agentIntroCard}>
					<h1 className={s.title}>Every Agent is truly Proactive AI</h1>
					<h2 className={s.subtitle}>Smart action before you even ask</h2>
					<button className={s.createAgentBtn}>
						<span className={s.title}>Create Agent</span>
						<CarretRight />
					</button>
					<div className={s.divider}></div>
				</div>
			</div>
			<QuickActions />
		</div>
	);
};

export default memo(Agents);
