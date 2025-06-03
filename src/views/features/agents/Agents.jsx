import { memo, useContext, useEffect } from 'react';
import s from './agents.module.scss';
import Context from '../../../context/context';
import { ReactComponent as SearchIcon } from '../../../assets/svg/agents/search.svg';
import { ReactComponent as SortIcon } from '../../../assets/svg/agents/sort.svg';
import { ReactComponent as FilterIcon } from '../../../assets/svg/agents/filter.svg';
import { ReactComponent as CardIcon } from '../../../assets/svg/agents/card.svg';
import { ReactComponent as ListIcon } from '../../../assets/svg/agents/list.svg';

// components
import QuickActions from '../../components/globalComponents/QuickActions';
import CreateNewAgentCard from '../../components/agents/createNewAgentCard/CreateNewAgentCard';
import AgentSuggestion from '../../components/agents/suggestedCard/agentSuggestion';

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
			<div className={s.titleContainer}>
				<div className={s.titleOne}>Every Agent is</div>
				<div className={s.titleTwo}>Truly Proactive AI</div>
			</div>
			<div className={s.agentActionsContainer}>
				<div className={s.header}>
					<div className={s.headerActions}>
						<div className={s.headerTitle}>Your Agents</div>
						<div className={s.headerActionsContainer}>
							<div className={s.searchContainer}>
								<SearchIcon />
								<input type="text" placeholder="Search your agent" />
							</div>
							<div className={s.actionsContainer}>
								<SortIcon />
							</div>
							<div className={s.actionsContainer}>
								<FilterIcon />
							</div>
							<div className={s.viewContainer}>
								<div className={`${s.viewIcon} ${s.active}`}>
									<CardIcon />
								</div>
								<div className={s.viewIcon}>
									<ListIcon />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={s.body}>
					<CreateNewAgentCard agents={knowledgeAssistantsList?.data || []} />
				</div>
			</div>
			<div className={s.suggestionsContainer}>
				<div className={s.suggestionsHeader}>Suggested for you</div>
				<div className={s.suggestionsBody}>
					<AgentSuggestion
						isAiCreated={false}
						title={'Monthly Report'}
						description={'Detected from : 6 past meeting notes + transcript uploads'}
					/>
					<AgentSuggestion />
					<AgentSuggestion />
					<AgentSuggestion />
					<AgentSuggestion />
					<AgentSuggestion />
					<AgentSuggestion />
					<AgentSuggestion />
					<AgentSuggestion />
					<AgentSuggestion />
					<AgentSuggestion />
					<AgentSuggestion />
					<AgentSuggestion />
				</div>
			</div>
			<QuickActions />
		</div>
	);
};

export default memo(Agents);
