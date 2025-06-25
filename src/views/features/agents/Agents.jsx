import { memo, useContext, useEffect, useState, useCallback, useRef } from 'react';
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
import Spinner from '../../components/loaders/Spinner';

// constants
const page = 1,
	limit = 20;

// Debounce hook
const useDebounce = (func, timeout = 500) => {
	const timeoutRef = useRef(null);

	return (...args) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			func(...args);
		}, timeout);
	};
};

const Agents = () => {
	const {
		knowledgeAgent: { knowledgeAssistantsList, getKnowledgeAssistantsList },
	} = useContext(Context);

	const [searchParams, setSearchParams] = useState({
		search: '',
		sortBy: 'createdAt',
		sortOrder: -1,
		searchLoading: false,
	});

	// Debounced search function
	const debouncedSearch = useDebounce((searchValue, sortBy, sortOrder) => {
		setSearchParams((prev) => ({ ...prev, searchLoading: true }));
		getKnowledgeAssistantsList(page, limit, searchValue, sortBy, sortOrder);
	}, 500);

	// Handle search input change
	const handleSearchChange = useCallback(
		(e) => {
			const searchValue = e.target.value;
			setSearchParams((prev) => ({ ...prev, search: searchValue }));
			debouncedSearch(searchValue, searchParams.sortBy, searchParams.sortOrder);
		},
		[debouncedSearch, searchParams.sortBy, searchParams.sortOrder],
	);

	// Handle sort change
	const handleSortChange = useCallback(() => {
		const newSortOrder = searchParams.sortOrder === 1 ? -1 : 1;
		setSearchParams((prev) => ({
			...prev,
			sortOrder: newSortOrder,
			searchLoading: true,
		}));
		getKnowledgeAssistantsList(
			page,
			limit,
			searchParams.search,
			searchParams.sortBy,
			newSortOrder,
		);
	}, [searchParams.sortOrder, searchParams.search, searchParams.sortBy]);

	// Handle filter (placeholder for future implementation)
	const handleFilterChange = useCallback(() => {
		// TODO: Implement filter functionality
		console.log('Filter functionality to be implemented');
	}, []);

	useEffect(() => {
		if (knowledgeAssistantsList === null) {
			getKnowledgeAssistantsList(page, limit, '', 'createdAt', -1);
		}
	}, []);

	// Update loading state when data is received
	useEffect(() => {
		if (knowledgeAssistantsList) {
			setSearchParams((prev) => ({ ...prev, searchLoading: false }));
		}
	}, [knowledgeAssistantsList]);

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
							{searchParams.searchLoading ? (
								<Spinner width="16px" height="16px" />
							) : (
								<SearchIcon />
							)}
							<input
								type="text"
								placeholder="Search your agent"
								value={searchParams.search}
								onChange={handleSearchChange}
							/>
						</div>
						<div className={s.actionsContainer} onClick={handleSortChange}>
							<SortIcon />
						</div>
						<div className={s.actionsContainer} onClick={handleFilterChange}>
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
