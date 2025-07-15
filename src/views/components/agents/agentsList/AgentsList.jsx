import { memo, useState } from 'react';
import s from './agentsList.module.scss';
import Spinner from '../../loaders/Spinner';
import AgentsCardView from './AgentsCardView';
import AgentsListView from './AgentsListView';
import ViewToggle from './ViewToggle';

const AgentsList = ({ agents = [], isLoading = false }) => {
	const [viewMode, setViewMode] = useState('card');

	const showLoading = isLoading && agents.length === 0;

	const handleViewModeChange = (mode) => {
		setViewMode(mode);
	};

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
			<div className={s.viewToggleWrapper}>
				<div className={s.headerActions}>
					<div className={s.headerTitle}>Your Agents</div>
				</div>
				<ViewToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />
			</div>
			{viewMode === 'card' ? (
				<AgentsCardView agents={agents} />
			) : (
				<AgentsListView agents={agents} />
			)}
		</div>
	);
};

export default memo(AgentsList);
