import { memo } from 'react';
import s from './agentsList.module.scss';
import Spinner from '../../loaders/Spinner';
import AgentsCardView from './AgentsCardView';
import AgentsListView from './AgentsListView';

const AgentsList = ({ agents = [], isLoading = false, viewMode = 'card' }) => {
	const showLoading = isLoading && agents.length === 0;

	if (showLoading) {
		return (
			<div className={s.agentsListContainer}>
				<div className={s.loadingContainer}>
					<Spinner
						width="32px"
						height="32px"
						color="var(--primary-button)"
						borderTopColor="transparent"
					/>
					<span className={s.loadingText}>Loading agents...</span>
				</div>
			</div>
		);
	}

	return (
		<div className={s.agentsListWrapper}>
			{viewMode === 'card' ? (
				<AgentsCardView agents={agents} />
			) : (
				<AgentsListView agents={agents} />
			)}
		</div>
	);
};

export default memo(AgentsList);
