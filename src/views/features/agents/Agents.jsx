import { memo, useContext, useEffect } from 'react';
import s from './agents.module.scss';
import Context from '../../../context/context';

// icons
import { ReactComponent as SearchIcon } from '../../../assets/svg/agents/search.svg';
import { ReactComponent as SortIcon } from '../../../assets/svg/agents/sort.svg';
import { ReactComponent as FilterIcon } from '../../../assets/svg/agents/filter.svg';

// components
import QuickActions from '../../components/globalComponents/QuickActions';
import AgentsList from '../../components/agents/agentsList/AgentsList';
import AgentSuggestion from '../../components/agents/suggestedCard/agentSuggestion';

// constants
const page = 1,
	limit = 20;

const Agents = () => {
	const {
		knowledgeAgent: { knowledgeAssistantsList, getKnowledgeAssistantsList },
	} = useContext(Context);

	useEffect(() => {
		if (knowledgeAssistantsList === null) {
			getKnowledgeAssistantsList(page, limit);
		}
	}, []);

	return (
		<div className={s.agentsContainer}>
			<div className={s.titleContainer}>
				<div className={s.titleOne}>Every Agent is</div>
				<div className={s.titleTwo}>Truly Proactive AI</div>
			</div>
			<div className={s.agentsListAndSuggestedAgentsContainer}>
				<div className={s.agentActionsContainer}>
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
					</div>
					<div className={s.headerActions}>
						<div className={s.headerTitle}>Your Agents</div>
					</div>
					<div className={s.body}>
						<AgentsList agents={knowledgeAssistantsList?.data || []} />
					</div>
				</div>
				<div className={s.suggestionsContainer}>
					<div className={s.suggestionsHeader}>Suggested for you</div>
					<div className={s.suggestionsBody}>
						<AgentSuggestion
							isAiCreated={false}
							title={'Monthly Report'}
							description={
								'Detected from : 6 past meeting notes + transcript uploads'
							}
						/>
						<AgentSuggestion />
						<AgentSuggestion />
						<AgentSuggestion />
					</div>
				</div>
			</div>
			<QuickActions />
		</div>
	);
};

export default memo(Agents);
