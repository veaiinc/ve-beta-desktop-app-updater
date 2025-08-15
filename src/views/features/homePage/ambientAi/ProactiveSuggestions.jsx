import { memo, useContext, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import '../../../../assets/scss/home_page/ambientAi/proactiveSuggestions.scss';
import Context from '../../../../context/context';
import { ReactComponent as ChevronRightThinSvg } from '../../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as FilterIcon } from '../../../../assets/svg/tasks/newFiltersIcon.svg';
import { ReactComponent as TickIcon } from '../../../../assets/svg/tick.svg';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
// import AIQuestions from './AIQuestions';
import { ReactComponent as SearchSvg } from '../../../../assets/svg/workflow/search.svg';
import Spinner from '../../../components/loaders/Spinner';
import { ReactComponent as CloseSearchbarIcon } from '../assets/svg/closeIcon.svg';
import AmbientAiModal from '../../../components/modalsV2/homePage/AmbientAiModal';
import ProactiveCards from './ProactiveCards';

const payload = {
	page: 1,
	limit: 20,
	sortBy: 'createdAt',
	// sortOrder: '-1',
};
const positionClassMap = {
	0: 'selected',
	1: 'right-1',
	2: 'right-2',
	3: 'right-3',
	'-1': 'left-1',
	'-2': 'left-2',
	'-3': 'left-3',
};

export const filterGroups = [
	{
		title: 'Priority Level',
		options: [
			// { id: 1, title: 'Urgent Priority', value: 'High' },
			{ id: 2, title: 'High', value: 'High', bgColor: 'var(--error)' },
			{ id: 3, title: 'Medium ', value: 'Medium', bgColor: 'var(--pending)' },
			{ id: 4, title: 'Low ', value: 'Low', bgColor: 'var(--success)' },
		],
	},
	{
		title: 'Read Status',
		options: [
			{ id: 5, title: 'Read', value: true },
			{ id: 6, title: 'Unread', value: false },
			// { id: 7, title: 'Flagges', value: 'Flagges' },
			{ id: 8, title: 'All' },
		],
	},
	{
		title: 'Confidence level',
		options: [
			{ id: 9, title: 'High 90-100%', value: '0.9 - 1.0' },
			{ id: 10, title: 'Medium 70-89%', value: '0.7 - 0.89' },
			{ id: 11, title: 'Below 70%', value: '< 0.7' },
		],
	},
	{
		title: 'Date',
		options: [
			{ id: 12, title: 'Today', value: 'today' },
			{ id: 13, title: 'Last 7 days', value: 'last7days' },
			{ id: 14, title: 'Last 30 days', value: 'last30days' },
		],
	},

	{
		title: 'Other',
		options: [
			{
				id: 15,
				title: 'Favourites',
				value: true,
			},
		],
	},
];

const insightOptionsInOrder = {
	actions: 0,
	suggestion: 1,
	drafts: 2,
	risks: 3,
	opportunity: 4,
	goals: 5,
	others: 6,
};

const sortByInsightsOrder = (data, orderMap) => {
	return data?.slice()?.sort((a, b) => {
		const indexA = orderMap[a?.insight_type] ?? Infinity;
		const indexB = orderMap[b?.insight_type] ?? Infinity;
		return indexA - indexB;
	});
};

// const infiniteScrollStyle = {
// 	display: 'flex',
// 	flexDirection: 'column',
// 	alignItems: 'flex-start',
// 	alignSelf: 'stretch',
// 	gap: '8px',
// };
const sortOptions = {
	createdAt: {
		sortType: -1,
	},
};
// const skeletonLoaders = Array.from({ length: 7 }, (_, index) => index + 1);

const optionsList = [
	{
		insight_type: 'onboarding',
		count: 2,
	},
];
const onboardingCards = [
	{
		title: 'What VE.AI do',
		subTitle: 'For You',
		description:
			'Ve auto-detects key emails, drafts replies, and reminds you about missed threads all in the background.',
		btnText: 'Show me',
		type: 'onboard',
	},
	// {
	// 	title: 'Connect your',
	// 	subTitle: 'Integration',
	// 	description:
	// 		'Ve connects with your tools to detect meetings, track replies, and surface follow-ups without any extra work.',
	// 	btnText: 'Connect Now',
	// 	type: 'integration',
	// },
	{
		title: 'Try asking',
		subTitle: 'Ve',
		description: 'Ask: “What can you do for me?” or “Show me how to get started.”',
		type: 'askVe',
	},
];
const ProactiveSuggestions = () => {
	const navigate = useNavigate();
	const currentIndexRef = useRef(0);
	const totalCardsDataRef = useRef(onboardingCards);
	const isMountedRef = useRef(true);
	const timeoutIdRef = useRef(null);
	const searchFocusedRef = useRef(false);
	const optionsContainerRef = useRef(null); // Ref for the options container
	const searchInputRef = useRef(null);
	const selectedFiltersRef = useRef([]);
	const searchQueryRef = useRef('');
	const searchContainerRef = useRef(null);
	const insightTypesRef = useRef([]);
	const selectedOptionRef = useRef('onboarding');

	const {
		templates: {
			getAISuggestedPendingActions,
			aiSuggestedPendingActions,
			pendingActionsUpdate,
			updateStateValues,
			// getAiQuestions,
			// aiQuestions,
		},
		profileInfo: { insightTypes, getAiInsightTypes },
	} = useContext(Context);

	const [info, setInfo] = useState({
		totalCardsData: [],
		cards: [],
		activeCardContent: null,
		openModal: false,
		currentIndex: 0,
		loading: true,
		openFilter: false,
		selectedFilters: [
			{
				id: 5,
				title: 'Unread',
				value: false,
				group: 'Read Status',
			},
		],
		selectedCardNumber: null,
		hoveredCard: null,
		isListView: false,
		isApiLoading: false,
		sortBy: 'createdAt',
		activeBtn: 'insights',
		sortOptions,
		searchQuery: '',
		chatQuery: '',
		options: [],
		selectedOption: '',
		showArrows: {
			left: false,
			right: false,
		},
		searchOpen: false,
		settingsOpen: false,
		hasCards: true,
		trainedFeedbackIds: null,
		headline: null,
	});

	const [touchStartX, setTouchStartX] = useState(null);
	const [touchEndX, setTouchEndX] = useState(null);
	const minSwipeDistance = 50;

	const checkScroll = useCallback(() => {
		const container = optionsContainerRef.current;
		if (container) {
			const isOverflowing = container.scrollWidth > container.clientWidth;
			setInfo((prev) => ({
				...prev,
				showArrows: {
					left: true,
					right:
						isOverflowing &&
						container.scrollLeft < container.scrollWidth - container.clientWidth - 1,
				},
			}));
		}
	}, []);

	// Handle scroll on arrow click
	// const handleScroll = (direction) => {
	// 	const container = optionsContainerRef.current;
	// 	if (container) {
	// 		const scrollAmount = 600; // Adjust scroll distance as needed
	// 		const newScrollPosition =
	// 			direction === 'left'
	// 				? container.scrollLeft - scrollAmount
	// 				: container.scrollLeft + scrollAmount;
	// 		container.scrollTo({
	// 			left: newScrollPosition,
	// 			behavior: 'smooth',
	// 		});
	// 	}
	// };

	useEffect(() => {
		const container = optionsContainerRef.current;
		if (container) {
			container.addEventListener('scroll', checkScroll);
		}
		return () => {
			if (container) {
				container.removeEventListener('scroll', checkScroll);
			}
		};
	}, []);

	useEffect(() => {
		if (aiSuggestedPendingActions) {
			updateCardsData();
			if (info?.activeCardContent) {
				setInfo((prev) => ({
					...prev,
					activeCardContent: aiSuggestedPendingActions?.pendingActions?.find(
						(c) => c?._id === info?.activeCardContent?._id,
					),
				}));
			}
		}
	}, [aiSuggestedPendingActions]);

	// useEffect(() => {
	// 	if (!aiQuestions) {
	// 		getAiQuestions();
	// 	}
	// }, []);

	// useEffect(() => {
	// 	if (!aiCategories) {
	// 		getAiCategoriesOptions();
	// 	} else {
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			options: [...aiCategories],
	// 		}));
	// 	}
	// }, [aiCategories, aiSuggestedPendingActions]);

	useEffect(() => {
		if (!insightTypes) {
			getAiInsightTypes();
		} else {
			const { insights, headline } = insightTypes || {};

			// Sort insights by predefined order
			const sortedInsights = sortByInsightsOrder(insights, insightOptionsInOrder);

			// Extract the first insight (to be placed first)
			const firstInsight = sortedInsights[0];
			// Remaining insights (excluding the first one)
			const remainingInsights = sortedInsights.slice(1);

			// Define the onboarding option
			const onboardingOption = {
				insight_type: 'onboarding',
				count: 2,
			};

			// Build final options: [firstInsight, onboarding, ...rest]
			const finalOptions = firstInsight
				? [firstInsight, onboardingOption, ...remainingInsights]
				: [onboardingOption, ...sortedInsights]; // fallback if no insights

			// Update refs and state
			insightTypesRef.current = finalOptions;

			setInfo((prev) => ({
				...prev,
				options: finalOptions,
				headline,
				selectedOption: finalOptions?.[0]?.insight_type,
			}));
		}
	}, [insightTypes]);

	useEffect(() => {
		if (info?.totalCardsData?.length > 0) {
			updateWindow(info?.currentIndex);
		}
	}, [info?.totalCardsData, info?.currentIndex]);

	useEffect(() => {
		return () => {
			updateStateValues({ aiSuggestedPendingActions: null });

			// if (
			// 	selectedFiltersRef.current?.length ||
			// 	searchQueryRef.current?.length ||
			// 	!selectedOptionRef.current ||
			// 	selectedOptionRef.current !== insightTypesRef.current?.[0]?.insight_type
			// ) {
			// 	updateStateValues({ aiSuggestedPendingActions: null });
			// }
		};
	}, []);

	useEffect(() => {
		if (isMountedRef.current || info?.selectedOption === 'onboarding') return;

		fetchPendingActions();
	}, [info?.selectedFilters, info?.sortOptions, info?.sortBy]);

	useEffect(() => {
		if (isMountedRef.current) return;

		if (info?.selectedOption === 'onboarding') {
			totalCardsDataRef.current = onboardingCards;
			setInfo((prev) => ({
				...prev,
				totalCardsData: onboardingCards,
				loading: false,
				hasCards: true,
			}));
			return;
		}

		fetchPendingActions();
	}, [info?.selectedOption]);

	useEffect(() => {
		if (isMountedRef.current) {
			isMountedRef.current = false;
			return;
		}
		if (info?.selectedOption === 'onboarding') return;
		if (timeoutIdRef.current) {
			clearTimeout(timeoutIdRef.current);
		}
		setInfo((prev) => ({
			...prev,
			searchLoading: true,
		}));
		timeoutIdRef.current = setTimeout(async () => {
			await fetchPendingActions();
			setInfo((prev) => ({
				...prev,
				searchLoading: false,
			}));
		}, 500);
	}, [info?.searchQuery]);

	const handleLeft = useCallback(() => {
		const index =
			(currentIndexRef.current - 1 + totalCardsDataRef.current?.length) %
			totalCardsDataRef.current?.length;
		setInfo((prev) => ({
			...prev,
			currentIndex: index,
			activeCardContent: totalCardsDataRef.current[index],
			selectedCardNumber: index,
		}));
		currentIndexRef.current = index;
	}, []);

	const handleRight = useCallback(async () => {
		if (info?.isApiLoading) return;
		const isLastCard = currentIndexRef.current === totalCardsDataRef.current.length - 2;
		const totalCards = totalCardsDataRef.current.length;

		if (isLastCard) {
			if (aiSuggestedPendingActions?.metaInfo?.hasNextPage) {
				setInfo((prev) => ({
					...prev,
					isApiLoading: true,
				}));
				const nextPage = aiSuggestedPendingActions.metaInfo.currentPage + 1;
				const payload = {
					...newUpdatedPayload,
					page: nextPage,
				};

				await getAISuggestedPendingActions(payload, false);
				setInfo((prev) => ({
					...prev,
					isApiLoading: false,
				}));
				return;
			}
		}

		// Normal forward movement
		const index = (currentIndexRef.current + 1) % totalCards;
		setInfo((prev) => ({
			...prev,
			currentIndex: index,
			activeCardContent: totalCardsDataRef.current[index],
			selectedCardNumber: index + 1,
		}));
		currentIndexRef.current = index;
	}, [info?.isApiLoading, aiSuggestedPendingActions]);

	const handleKeyDown = useCallback(
		(e) => {
			if (searchFocusedRef.current) return;
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

	useEffect(() => {
		if (info?.searchOpen && searchInputRef.current) {
			searchInputRef.current.focus();
		} else if (searchInputRef?.current?.focused) {
			searchInputRef.current.blur();
		}

		if (!info?.searchOpen) return;

		function handleClickOutside(event) {
			if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
				setInfo((prev) => ({ ...prev, searchOpen: false }));
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [info?.searchOpen]);

	const getDateRangeFromFilters = (filters) => {
		const selectedDateFilter = filters?.find((f) => f?.group === 'Date');

		if (!selectedDateFilter?.value) return {};

		const SECONDS_IN_DAY = 86400; // 24 * 60 * 60 seconds
		const todayStart = new Date();
		todayStart.setHours(0, 0, 0, 0);
		const startTime = Math.floor(todayStart.getTime() / 1000);
		const endTime = startTime + SECONDS_IN_DAY;

		let from;
		let to = endTime;
		switch (selectedDateFilter?.value) {
			case 'today':
				from = startTime;
				break;
			case 'last7days':
				from = startTime - SECONDS_IN_DAY * 6;
				break;
			case 'last30days':
				from = startTime - SECONDS_IN_DAY * 29;
				break;
			default:
				return {};
		}

		return { from, to };
	};

	const updateCardsData = () => {
		const cards = aiSuggestedPendingActions?.pendingActions;

		if (cards?.length > 0) {
			totalCardsDataRef.current = cards;

			setInfo((prev) => ({
				...prev,
				totalCardsData: cards,
				loading: false,
				hasCards: true,
			}));
		} else {
			totalCardsDataRef.current = [];
			setInfo((prev) => ({
				...prev,
				loading: false,
				totalCardsData: [],
				cards: [],
			}));
		}
	};

	const updateWindow = (index) => {
		const length = info?.totalCardsData?.length;

		const cards = info?.totalCardsData?.map((card, i) => {
			let diff = i - index;

			if (diff > length / 2) diff -= length;
			if (diff < -length / 2) diff += length;

			return {
				...card,
				position: Math.abs(diff) <= 3 ? diff : null,
			};
		});

		setInfo((prev) => ({
			...prev,
			cards,
		}));
	};

	const handleCardClick = useCallback(
		async (card, index) => {
			if (!card?.read && info?.selectedOption !== 'onboarding') {
				await pendingActionsUpdate(card?._id, { read: true });
				const payload = { read: true },
					reset = false;
				getAISuggestedPendingActions(payload, reset, 'update', card?._id);
			}
			setInfo((prev) => ({
				...prev,
				activeCardContent: card,
				openModal: true,
				currentIndex: index,
				selectedCardNumber: index + 1,
			}));
			currentIndexRef.current = index;
		},
		[info?.selectedOption, pendingActionsUpdate, getAISuggestedPendingActions],
	);

	const handleCloseModal = () => {
		setInfo((prev) => ({
			...prev,
			openModal: false,
			selectedCardNumber: null,
		}));
	};

	const handleFilterClick = (option, group) => {
		setInfo((prev) => {
			const isDateGroup = group === 'Date';

			let updatedFilters = [...prev.selectedFilters];

			if (isDateGroup) {
				// Remove all date filters first
				updatedFilters = updatedFilters.filter((f) => f.group !== 'Date');

				// If already selected, don't re-add (toggle off)
				const isAlreadySelected = prev.selectedFilters.some(
					(f) => f.value === option.value && f.group === group,
				);
				if (!isAlreadySelected) {
					updatedFilters.push({ ...option, group });
				}
			} else {
				// Toggle logic for other filters
				const exists = updatedFilters.some(
					(f) => f.value === option.value && f.group === group,
				);

				if (exists) {
					updatedFilters = updatedFilters.filter(
						(f) => !(f.value === option.value && f.group === group),
					);
				} else {
					updatedFilters.push({ ...option, group });
				}
			}

			selectedFiltersRef.current = updatedFilters;
			return {
				...prev,
				selectedFilters: updatedFilters,
			};
		});
	};

	const removeFilter = (index) => {
		setInfo((prev) => {
			const updatedFilters = prev.selectedFilters.filter((_, i) => i !== index);
			selectedFiltersRef.current = updatedFilters;
			return {
				...prev,
				selectedFilters: updatedFilters,
			};
		});
	};

	const fetchPendingActions = async () => {
		const reset = true;
		getAISuggestedPendingActions(newUpdatedPayload, reset);
	};

	// const handleFavouriteClick = async (id) => {
	// 	const card = info?.cards?.find((c) => c?._id === id);
	// 	const res = await pendingActionsUpdate(id, { isFavourite: !card?.isFavourite });
	// 	if (res?.[0] === true) {
	// 		getAISuggestedPendingActions(
	// 			{
	// 				isFavourite: !card?.isFavourite,
	// 			},
	// 			false,
	// 			'update',
	// 			id,
	// 		);
	// 		message.success(!card?.isFavourite ? 'Added to favourites' : 'Removed from favourites');
	// 	} else {
	// 		message.error('Failed to update');
	// 	}
	// };

	const handleSearchQueryChange = (e) => {
		searchQueryRef.current = e.target?.value;
		setInfo((prev) => ({
			...prev,
			searchQuery: e.target?.value,
		}));
	};

	const newUpdatedPayload = useMemo(() => {
		const getFilterValues = (group, excludeTitle = null) =>
			info?.selectedFilters
				?.filter((f) => f?.group === group && (!excludeTitle || f?.title !== excludeTitle))
				.map((f) => f?.value) || [];

		const selectedPriority = getFilterValues('Priority Level');
		const selectedReadStatus = getFilterValues('Read Status', 'All');
		const selectedConfidenceScore = getFilterValues('Confidence level');
		const [favourite] = getFilterValues('Other');
		const { from, to } = getDateRangeFromFilters(info?.selectedFilters);

		return {
			...payload,
			...(selectedPriority.length && { priority: selectedPriority }),
			...(selectedReadStatus.length && { read: selectedReadStatus }),
			...(selectedConfidenceScore.length && { confidenceScore: selectedConfidenceScore }),
			...(from !== undefined && to !== undefined && { from, to }),
			sortType: info?.sortOptions[info?.sortBy]?.sortType,
			sortBy: info?.sortBy,
			...(favourite && { isFavourited: favourite }),
			search: info?.searchQuery,
			...(info?.selectedOption !== 'onboarding' && { insightType: info?.selectedOption }),
		};
	}, [
		payload,
		info?.selectedFilters,
		info?.sortOptions,
		info?.sortBy,
		info?.searchQuery,
		info?.selectedOption,
	]);

	const handleTouchStart = (e) => {
		setTouchStartX(e.targetTouches[0].clientX);
		setTouchEndX(null); // Reset touchEndX
	};

	const handleTouchMove = (e) => {
		setTouchEndX(e.targetTouches[0].clientX);
	};

	const handleTouchEnd = () => {
		if (!touchStartX || !touchEndX) return;
		const distance = touchStartX - touchEndX;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;

		if (isLeftSwipe) {
			handleRight(); // Swipe left to show next card
		} else if (isRightSwipe) {
			handleLeft(); // Swipe right to show previous card
		}

		// Reset touch coordinates
		setTouchStartX(null);
		setTouchEndX(null);
	};

	const handleOptionSelection = (option) => {
		if (info?.selectedOption === option) return;

		currentIndexRef.current = 0;
		selectedOptionRef.current = option;
		setInfo((prev) => ({
			...prev,
			selectedOption: option,
			currentIndex: 0,
			loading: option === 'onboarding' ? false : true,
			openModal: false,
		}));
		if (option === 'onboarding') {
			updateStateValues({
				aiSuggestedPendingActions: null,
			});
		}
	};

	const handleSearchToggle = () => {
		setInfo((prev) => ({
			...prev,
			searchOpen: !prev.searchOpen,
		}));
	};

	const handleSettingsToggle = () => {
		setInfo((prev) => ({
			...prev,
			settingsOpen: !prev.settingsOpen,
		}));
	};

	return (
		<div
			className="proactive-suggestions-wrapper"
			style={{
				width: info?.openModal
					? window?.innerWidth >= 1500
						? 'calc(100% - 600px)'
						: 'calc(100% - 450px)'
					: '100%',
			}}
		>
			<div className={`proactive-suggestions-container`}>
				{!info?.showExploreMore && (
					<>
						{/* {info?.activeBtn === 'questions' && (
					<div className="ai-questions-wrapper">
						<AIQuestions />
					</div>
				)} */}
						<div className="proactive-suggestions-title">
							{info?.headline ? (
								info?.headline
							) : (
								<>
									<span className="title-highlight">Ambient</span> Insights For
									You
								</>
							)}
						</div>

						<div
							className="cards-container"
							onTouchStart={handleTouchStart}
							onTouchMove={handleTouchMove}
							onTouchEnd={handleTouchEnd}
						>
							{info?.loading ? (
								[
									{ position: 0 },
									{ position: 1 },
									{ position: 2 },
									{ position: -1 },
									{ position: -2 },
								]?.map((item, index) => {
									const classList = [
										'card',
										'skeleton',
										positionClassMap[item.position],
									];
									return (
										<div key={index} className={classList.join(' ')}>
											<div
												className="skeleton-container"
												style={{
													width: '100%',
													height: '100%',
													borderRadius: '10px',
												}}
											>
												<Skeleton
													height={'100%'}
													width={'100%'}
													highlightColor="var(--card-over-card)"
													baseColor="var(--card)"
													style={{
														lineHeight: 'unset',
													}}
												/>
											</div>
										</div>
									);
								})
							) : info?.cards?.length === 0 ? (
								<div className="no-data" style={{ color: 'var(--primary-font)' }}>
									No data available
								</div>
							) : (
								<ProactiveCards
									cards={info?.cards}
									selectedOption={info?.selectedOption}
									handleCardClick={handleCardClick}
								/>
							)}
						</div>

						<div
							className={`actionMainContainer ${
								info?.selectedOption !== 'All' ? 'onPrompt' : ''
							}`}
						>
							{info?.hasCards && (
								<div className="right-container">
									{info?.selectedOption !== 'onboarding' && (
										<div className="options-container">
											{/* ←— unified search bar */}
											<div
												className="searchMainContainer"
												ref={searchContainerRef}
											>
												<button
													className={`search-btn ${
														info?.searchOpen ? 'expanded' : ''
													}`}
													onClick={handleSearchToggle}
													aria-label="Toggle search"
												>
													<SearchSvg stroke="var(--secondary-font)" />
												</button>
												<div
													className={`search-wrapper ${
														info?.searchOpen ? 'expanded' : ''
													}`}
												>
													<input
														className="search-input"
														placeholder="Search"
														onChange={handleSearchQueryChange}
														ref={searchInputRef}
													/>
													{info?.searchLoading && (
														<div className="search-loader">
															<Spinner
																color="var(--primary-button)"
																borderWidth={2}
																width="15px"
																height="15px"
															/>
														</div>
													)}
													{info?.searchOpen && (
														<button
															className="close-btn"
															onClick={handleSearchToggle}
															aria-label="Close search"
														>
															<CloseSearchbarIcon />
														</button>
													)}
												</div>
											</div>
											{info?.hasCards && (
												<div className="optionsRightMainContainer">
													<div className="filter-wrapper">
														<Tooltip
															open={info?.openFilter}
															onOpenChange={() =>
																setInfo((prev) => ({
																	...prev,
																	openFilter: false,
																}))
															}
															placement="top"
															title={
																<div className="filter-container">
																	<div className="filter-items">
																		{filterGroups?.map(
																			(group, idx) => (
																				<div
																					key={
																						group?.title
																					}
																					style={{
																						width: '100%',
																					}}
																				>
																					<div className="filter-item">
																						<div className="filter-item-title">
																							{group?.title ||
																								''}
																						</div>
																						<div className="filter-item-options">
																							{group?.options?.map(
																								(
																									item,
																								) => {
																									const itemWithGroup =
																										{
																											...item,
																											group: group?.title,
																										};

																									const isSelected =
																										info?.selectedFilters?.some(
																											(
																												option,
																											) =>
																												option?.title ===
																													itemWithGroup?.title &&
																												option?.group ===
																													itemWithGroup?.group,
																										);
																									return (
																										<div
																											key={
																												item?.id
																											}
																											className="eachOption"
																											onClick={() =>
																												handleFilterClick(
																													itemWithGroup,
																													group?.title,
																												)
																											}
																										>
																											{group?.title ===
																												'Priority Level' && (
																												<div
																													className="indicator"
																													style={{
																														backgroundColor:
																															item?.bgColor ||
																															'',
																													}}
																												></div>
																											)}
																											<div className="option-text">
																												<span className="option-text-content">
																													{item?.title ||
																														''}
																												</span>
																												{isSelected && (
																													<TickIcon
																														style={{
																															marginLeft:
																																'8px',
																														}}
																													/>
																												)}
																											</div>
																										</div>
																									);
																								},
																							)}
																						</div>
																					</div>
																					{idx <
																						filterGroups?.length -
																							1 && (
																						<hr
																							style={{
																								width: '100%',
																								height: '1px',
																								backgroundColor:
																									'var(--stroke)',
																								border: 'none',
																								marginTop:
																									'10px',
																							}}
																						/>
																					)}
																				</div>
																			),
																		)}
																	</div>
																</div>
															}
															color="transparent"
															trigger="click"
															style={{
																cursor: 'pointer',
																userSelect: 'none',
															}}
														>
															<button
																className={`filter-btn ${
																	info.openFilter ? 'active' : ''
																}`}
																onClick={(e) => {
																	e.stopPropagation();
																	e.preventDefault();
																	if (info.openFilter) return;
																	setInfo((prev) => ({
																		...prev,
																		openFilter: true,
																	}));
																}}
																data-tooltip="Filter"
															>
																<FilterIcon stroke="var(--secondary-font)" />
															</button>
														</Tooltip>

														{info?.selectedFilters?.length > 0 && (
															<div className="selected-filters">
																Filters :{' '}
																{`${info?.selectedFilters?.[0]?.title}`}
																{info?.selectedFilters?.length >
																	1 && (
																	<span className="filter-count">
																		+
																		{info?.selectedFilters
																			?.length - 1}
																	</span>
																)}
																<button
																	className="remove-filter-btn"
																	onClick={() => removeFilter(0)}
																	aria-label="Remove filter"
																>
																	<CloseSvg />
																</button>
															</div>
														)}
													</div>
												</div>
											)}
										</div>
									)}
								</div>
							)}

							{info?.cards?.length > 0 && (
								<div className="optionsRightMainContainer">
									<div className="action-right">
										<button
											className="card-change-btn"
											onClick={(e) => {
												e.stopPropagation();
												e.preventDefault();
												handleLeft();
											}}
										>
											<ChevronRightThinSvg className="left-chevron" />
										</button>
										<div className="card-number">
											<span>{currentIndexRef?.current + 1}</span>/
											<span className="total-docs">
												{info?.selectedOption !== 'onboarding'
													? aiSuggestedPendingActions?.metaInfo?.totalDocs
													: onboardingCards?.length}
											</span>
										</div>
										<button
											className="card-change-btn"
											onClick={(e) => {
												e.stopPropagation();
												e.preventDefault();
												handleRight();
											}}
										>
											<ChevronRightThinSvg />
										</button>
									</div>
								</div>
							)}
						</div>

						{info?.options?.length && (
							<div className="options-wrapper">
								<div
									className={`homepage__options-container`}
									ref={optionsContainerRef}
								>
									{info?.options?.map(({ count, insight_type }, index) => (
										<div
											className={`option ${
												info?.selectedOption === insight_type
													? 'active'
													: ''
											}`}
											onClick={(e) => {
												handleOptionSelection(insight_type);
											}}
											key={index}
										>
											<div className="option-label">
												<span className="option-name">{insight_type}</span>
												<span className="option-value">{count}</span>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
						<AmbientAiModal
							open={info?.openModal}
							onClose={handleCloseModal}
							data={info?.activeCardContent}
							onNextCardClick={handleRight}
							onPrevCardClick={handleLeft}
							totalDocs={aiSuggestedPendingActions?.metaInfo?.totalDocs}
							selectedCardNumber={currentIndexRef?.current + 1}
							selectedOption={info?.selectedOption}
							trainedFeedbackIds={info?.trainedFeedbackIds}
							setTrainedFeedbackIds={(submittedFeedbackId) =>
								setInfo((prev) => ({
									...prev,
									trainedFeedbackIds: [
										...(prev.trainedFeedbackIds || []),
										submittedFeedbackId,
									],
								}))
							}
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default memo(ProactiveSuggestions);
