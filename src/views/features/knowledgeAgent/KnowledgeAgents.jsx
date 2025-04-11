import React, { memo } from 'react';
import '../../../assets/scss/knowledgeAgent/index.scss';
import QuickActions from '../../components/globalComponents/QuickActions';
import CardsContainer from '../../components/knowledgeAgent/CardsContainer';

const KnowledgeAgents = () => {
	return (
		<div className="knowledge-assistants-container">
			<div className="quick-actions-container">
				<header className="page-header">
					<h1>
						<span className="header-subtitle">Browse your Knowledge Agents</span>
						<span className="header-title">Curiosity is Superpower.</span>
					</h1>
				</header>
				<QuickActions />
			</div>
			<CardsContainer />
		</div>
	);
};

export default memo(KnowledgeAgents);
