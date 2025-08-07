import { memo, useContext, useEffect, useState, useCallback, useRef } from 'react';
import s from './agents.module.scss';
import Context from '../../../context/context';

// icons
// import { ReactComponent as SearchIcon } from '../../../assets/svg/agents/search.svg';
// import { ReactComponent as SortIcon } from '../../../assets/svg/agents/sort.svg';
// import { ReactComponent as FilterIcon } from '../../../assets/svg/agents/filter.svg';
import { ReactComponent as SearchSvg } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as CloseSearchbarIcon } from '../../../views/features/homePage/assets/svg/closeIcon.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as LucidBotIcon } from './assets/lucid-bot.svg';
import { ReactComponent as PlusIcon } from '../../../assets/svg/agents/add.svg';

// components
// import QuickActions from '../../components/globalComponents/QuickActions';
// import AgentsList from '../../components/agents/agentsList/AgentsList';
// import AgentSuggestion from '../../components/agents/suggestedCard/agentSuggestion';
import Spinner from '../../components/loaders/Spinner';
// import ViewToggle from '../../components/agents/agentsList/ViewToggle';
import { useNavigate } from 'react-router-dom';
import { message } from '../../components/globalComponents/CustomToast';
import { generateRandomAIAgentDetails } from '../../components/agents/agentsList/utils';
import Skeleton from 'react-loading-skeleton';
import { accessControlCheck } from '../../../helpers/accessControlCheck';
import CreateAgentModal from '../../components/modalsV2/agents/CreateAgentModal';

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

const positionClassMap = {
	0: s.selected,
	1: s.right1,
	2: s.right2,
	'-1': s.left1,
	'-2': s.left2,
};

const Agents = () => {
	const {
		knowledgeAgent: {
			knowledgeAssistantsList,
			getKnowledgeAssistantsList,
			createNewKnowledgeAgent,
		},
	} = useContext(Context);

	const searchContainerRef = useRef(null);
	const searchInputRef = useRef(null);
	const navigate = useNavigate();

	const [info, setInfo] = useState({
		search: '',
		sortBy: 'createdAt',
		sortOrder: -1,
		searchLoading: false,
		viewMode: 'card',
		cards: [],
		totalCards: [],
		currentIndex: 0,
		searchOpen: false,
		isApiLoading: false,
		cardsExists: false,
		loading: false,
		createAgentLoader: false,
		createAgentModalOpen: false,
	});

	useEffect(() => {
		if (!knowledgeAssistantsList) {
			getKnowledgeAssistantsList(page, limit, '', 'createdAt', -1);
			setInfo((prev) => ({
				...prev,
				loading: true,
			}));
		} else {
			updateCardsData(knowledgeAssistantsList?.data || []);
			setInfo((prev) => ({
				...prev,
				searchLoading: false,
				currentIndex: 0,
				loading: false,
				...(knowledgeAssistantsList?.data?.length > 0 && {
					cardsExists: true,
				}),
			}));
		}
	}, [knowledgeAssistantsList]);

	useEffect(() => {
		if (info?.totalCards?.length > 0) {
			updateWindow(info?.currentIndex);
		}
	}, [info?.totalCards, info?.currentIndex]);

	const handleLeft = useCallback(() => {
		const index =
			(info?.currentIndex - 1 + info?.totalCards?.length) % info?.totalCards?.length;
		setInfo((prev) => ({
			...prev,
			currentIndex: index,
		}));
	}, [info?.currentIndex, info?.totalCards]);

	const handleRight = useCallback(async () => {
		if (info?.isApiLoading) return;
		const isLastCard = info?.currentIndex === info?.totalCards?.length - 2;
		const totalCards = info?.totalCards?.length;

		if (isLastCard) {
			if (knowledgeAssistantsList?.hasNextPage) {
				setInfo((prev) => ({
					...prev,
					isApiLoading: true,
				}));
				const nextPage = knowledgeAssistantsList?.currentPage + 1;

				await getKnowledgeAssistantsList(
					nextPage,
					limit,
					info?.search,
					info?.sortBy,
					info?.sortOrder,
					false,
				);
				setInfo((prev) => ({
					...prev,
					isApiLoading: false,
				}));
				return;
			}
		}

		// Normal forward movement
		const index = (info?.currentIndex + 1) % totalCards;
		setInfo((prev) => ({
			...prev,
			currentIndex: index,
		}));
	}, [
		info?.isApiLoading,
		knowledgeAssistantsList,
		info?.currentIndex,
		info?.totalCards,
		getKnowledgeAssistantsList,
		info?.search,
		info?.sortBy,
		info?.sortOrder,
	]);

	const handleKeyDown = useCallback(
		(e) => {
			if (e?.key === 'ArrowUp' || e?.key === 'ArrowLeft') {
				handleLeft();
			} else if (e?.key === 'ArrowDown' || e?.key === 'ArrowRight') {
				handleRight();
			}
		},
		[handleLeft, handleRight],
	);

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyDown]);

	const updateWindow = useCallback(
		(index) => {
			const length = info?.totalCards?.length;

			const cards = info?.totalCards?.map((card, i) => {
				let diff = i - index;

				if (diff > length / 2) diff -= length;
				if (diff < -length / 2) diff += length;

				return {
					...card,
					position: Math.abs(diff) <= 2 ? diff : null,
				};
			});

			setInfo((prev) => ({
				...prev,
				cards,
			}));
		},
		[info?.totalCards],
	);

	const updateCardsData = useCallback((data) => {
		if (data?.length > 0) {
			setInfo((prev) => ({
				...prev,
				totalCards: data,
			}));
		} else {
			setInfo((prev) => ({
				...prev,
				totalCard: [],
				cards: [],
			}));
		}
	}, []);

	// const handleViewModeChange = (mode) => {
	// 	setInfo((prev) => ({ ...prev, viewMode: mode }));
	// };

	// Debounced search function
	const debouncedSearch = useDebounce((searchValue, sortBy, sortOrder) => {
		setInfo((prev) => ({ ...prev, searchLoading: true }));
		getKnowledgeAssistantsList(page, limit, searchValue, sortBy, sortOrder);
	}, 500);

	// Handle search input change
	const handleSearchChange = useCallback(
		(e) => {
			const searchValue = e.target.value;
			setInfo((prev) => ({ ...prev, search: searchValue }));
			debouncedSearch(searchValue, info.sortBy, info.sortOrder);
		},
		[debouncedSearch, info.sortBy, info.sortOrder],
	);

	// // Handle sort change
	// const handleSortChange = useCallback(() => {
	// 	const newSortOrder = info.sortOrder === 1 ? -1 : 1;
	// 	setInfo((prev) => ({
	// 		...prev,
	// 		sortOrder: newSortOrder,
	// 		searchLoading: true,
	// 	}));
	// 	getKnowledgeAssistantsList(page, limit, info.search, info.sortBy, newSortOrder);
	// }, [info.sortOrder, info.search, info.sortBy]);

	// Handle filter (placeholder for future implementation)
	// const handleFilterChange = useCallback(() => {
	// 	// TODO: Implement filter functionality
	// 	console.log('Filter functionality to be implemented');
	// }, []);

	const handleSearchToggle = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			searchOpen: !prev.searchOpen,
		}));
	}, []);

	const handleCardClick = useCallback((card, index) => {
		navigate(`/agent/${card?._id}?config=prompt`);
	}, []);

	const handleCreateNewAgent = useCallback(async () => {
		if (!accessControlCheck('knowledgeAgent')) return;
		if (info.createAgentLoader) return;
		setInfo((prev) => ({ ...prev, createAgentLoader: true }));
		const { agentName, agentDescription } = generateRandomAIAgentDetails();
		const [success, data] = await createNewKnowledgeAgent(agentName, agentDescription);
		if (success) {
			const assistantId = data?.insertedId;
			navigate(`/agent/${assistantId}?agentAction=runAgent`);
		} else {
			message.error(data?.message);
		}
		setInfo((prev) => ({ ...prev, createAgentLoader: true }));
	}, [info?.createAgentLoader, createNewKnowledgeAgent]);

	return (
		<div className={s.agentsContainer}>
			<div className={s.titleContainer}>
				<span className={s.titleOne}>Agents</span>
				in motion.
			</div>
			{/* <div className={s.agentsListAndSuggestedAgentsContainer}>
				<div className={s.agentActionsContainer}>
					<div className={s.headerActionsContainer}>
						<div className={s.headerActions}>
							<div className={s.headerTitle}>Your Agents</div>
						</div>
						<div className={s.headerActionsRight}>
							<div className={s.searchContainer}>
								{info.searchLoading ? (
									<Spinner width="16px" height="16px" />
								) : (
									<SearchIcon />
								)}
								<input
									type="text"
									placeholder="Search your agent"
									value={info.search}
									onChange={handleSearchChange}
								/>
							</div>
							<div className={s.actionsContainer} onClick={handleSortChange}>
								<SortIcon />
							</div>
							<div className={s.actionsContainer} onClick={handleFilterChange}>
								<FilterIcon />
							</div>
							<ViewToggle
								viewMode={info.viewMode}
								onViewModeChange={handleViewModeChange}
							/>
						</div>
					</div>

					<div className={s.body}>
						<AgentsList
							agents={knowledgeAssistantsList?.data || []}
							isLoading={info.searchLoading}
							viewMode={info.viewMode}
						/>
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
			</div> */}

			<div className={s.agentCardsContainer}>
				{info?.loading ? (
					[
						{ position: 0 },
						{ position: 1 },
						{ position: 2 },
						{ position: -1 },
						{ position: -2 },
					]?.map((item, index) => {
						const classList = [s.card, s.skeleton, positionClassMap[item.position]];
						return (
							<div key={index} className={classList.join(' ')}>
								<div
									className={s.skeletonContainer}
									style={{
										width: '100%',
										height: '100%',
										borderRadius: '16px',
									}}
								>
									<Skeleton
										height={'100%'}
										width={'100%'}
										highlightColor="var(--card-over-card)"
										baseColor="var(--card)"
									/>
								</div>
							</div>
						);
					})
				) : info?.cards?.length === 0 ? (
					<div className={s.noData}>No data available</div>
				) : (
					info?.cards?.map((card, index) => {
						if (card?.position === null) return null;
						const classList = [s.card, positionClassMap[card?.position]];
						return (
							<div
								className={classList?.join(' ')}
								key={index}
								style={{
									background:
										classList?.[1] === s.selected
											? 'var(--popup)'
											: 'var(--background-color)',
								}}
								onClick={() => {
									handleCardClick(card, index);
								}}
							>
								<div className={s.cardInfo}>
									{card?.knowledgeAgent_profile_picture_s3Key ? (
										<img
											src={card?.knowledgeAgent_profile_picture_s3Key}
											alt="cat"
											className={s.agentImage}
										/>
									) : (
										<div className={s.imageContainer}>
											<LucidBotIcon />
										</div>
									)}

									<div className={s.agentName}>
										{card?.name || 'Untitled Agent'}
									</div>
								</div>
							</div>
						);
					})
				)}
			</div>

			{info?.cardsExists && (
				<div className={s.agentFilterContainer}>
					<div className={s.leftContainer}>
						<div className={s.searchContainer} ref={searchContainerRef}>
							<button
								className={`${s.searchBtn} ${info?.searchOpen ? s.expanded : ''}`}
								onClick={handleSearchToggle}
								aria-label="Toggle search"
							>
								<SearchSvg stroke="var(--secondary-font)" />
							</button>
							<div
								className={`${s.searchWrapper} ${
									info?.searchOpen ? s.expanded : ''
								}`}
							>
								<input
									className={s.searchInput}
									placeholder="Search"
									onChange={handleSearchChange}
									ref={searchInputRef}
								/>
								{info?.searchLoading && (
									<div className={s.searchLoader}>
										<Spinner
											color="var(--primary-font)"
											borderWidth={2}
											width="16px"
											height="16px"
										/>
									</div>
								)}
								{info?.searchOpen && (
									<button
										className={s.closeBtn}
										onClick={handleSearchToggle}
										aria-label="Close search"
									>
										<CloseSearchbarIcon width="16px" height="16px" />
									</button>
								)}
							</div>
						</div>
					</div>

					<div className={s.rightContainer}>
						<button
							className={s.cardChangeBtn}
							onClick={(e) => {
								e.stopPropagation();
								handleLeft();
							}}
						>
							<ChevronRightThinSvg className={s.leftChevron} />
						</button>
						<div className={s.cardNumber}>
							<span>{info?.currentIndex + 1}</span>/
							<span className={s.totalDocs}>
								{knowledgeAssistantsList?.totalDocs}
							</span>
						</div>
						<button
							className={s.cardChangeBtn}
							onClick={(e) => {
								e.stopPropagation();
								handleRight();
							}}
						>
							<ChevronRightThinSvg />
						</button>
					</div>
				</div>
			)}

			<div className={s.agentActionsContainer}>
				<div
					className={s.createNewAgent}
					onClick={() => setInfo((prev) => ({ ...prev, createAgentModalOpen: true }))}
				>
					<div className={s.iconContainer}>
						<PlusIcon />
					</div>
					<div className={s.text}>Create New</div>
				</div>
			</div>

			{/* <QuickActions /> */}
			<CreateAgentModal
				isOpen={info?.createAgentModalOpen}
				closeModal={() => setInfo((prev) => ({ ...prev, createAgentModalOpen: false }))}
			/>
		</div>
	);
};

export default memo(Agents);
