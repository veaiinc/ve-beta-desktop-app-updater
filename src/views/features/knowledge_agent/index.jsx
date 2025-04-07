import React, { memo } from 'react';
import '../../../assets/scss/knowledgeAgent/index.scss';
import QuickActions from '../../components/globalComponents/QuickActions';
import CardsContainer from '../../components/knowledgeAgent/CardsContainer';

const KnowledgeAgents = () => {
	return (
		<div className="knowledge-assistants-container">
			<div className="quick-actions-container">
				<QuickActions />
			</div>
			<CardsContainer />
		</div>
	);
};

export default memo(KnowledgeAgents);
