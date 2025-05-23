import React, { memo } from 'react';
import '../../../assets/scss/knowledgeAgent/index.scss';
import CardsContainer from '../../components/knowledgeAgent/CardsContainer';
import AgentsHeader from './AgentsHeader';

const KnowledgeAgents = () => {
	return (
		<div className="knowledge-assistants-container">
			<AgentsHeader />
			<CardsContainer />
		</div>
	);
};

export default memo(KnowledgeAgents);
