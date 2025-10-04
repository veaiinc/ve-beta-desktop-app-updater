import { memo, useEffect, useContext, useState, useMemo, useCallback, useRef } from 'react';
import styles from './proactiveCards.module.scss';
import Context from '../../../../context/context';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as FilterIcon } from '../../../../assets/svg/tasks/newFiltersIcon.svg';
import { ReactComponent as TickIcon } from '../../../../assets/svg/tick.svg';
import { ReactComponent as CloseSvg } from '../../../../assets/svg/close.svg';
import { ReactComponent as SearchSvg } from '../../../../assets/svg/workflow/search.svg';
import { ReactComponent as CloseSearchbarIcon } from '../../../features/homePage/assets/svg/closeIcon.svg';
import { Tooltip } from 'antd';
import Spinner from '../../../components/loaders/Spinner';
import upgradeCardImage from '../../../../assets/images/image.png';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import InfiniteScroll from 'react-infinite-scroll-component';
import AmbientAiModal from '../../modalsV2/homePage/AmbientAiModal';

const priorityClassMap = {
	High: 'red',
	Medium: 'yellow',
	Low: 'green',
};
const payload = {
	page: 1,
	limit: 10,
	sortBy: 'createdAt',
	// sortType: -1,
};
const skeletonLoaders = [1, 2, 3, 4];
export const filterGroups = [
	{
		title: 'Priority Level',
		options: [
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

const optionsList = [
	{
		insight_type: 'onboarding',
		count: 2,
	},
];

const onboardingCards = [
	{
		id: 'upgradeCard',
		background: upgradeCardImage,
		title: '',
		subTitle: '',
		type: 'upgrade',
	},
	{
		title: 'What VE.AI do',
		subTitle: 'For You',
		description:
			'Ve auto-detects key emails, drafts replies, and reminds you about missed threads all in the background.',
		btnText: 'Show me',
		type: 'onboard',
	},
	{
		title: 'Try asking',
		subTitle: 'Ve',
		description: 'Ask: "What can you do for me?" or "Show me how to get started."',
		type: 'askVe',
	},
];

const proPlanOnboardingCards = [
	{
		title: 'What VE.AI do',
		subTitle: 'For You',
		description:
			'Ve auto-detects key emails, drafts replies, and reminds you about missed threads all in the background.',
		btnText: 'Show me',
		type: 'onboard',
	},
	{
		title: 'Try asking',
		subTitle: 'Ve',
		description: 'Ask: "What can you do for me?" or "Show me how to get started."',
		type: 'askVe',
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

const ProactiveCards = () => {
	const {
		templates: {
			aiSuggestedPendingActions,
			getAISuggestedPendingActions,
			pendingActionsUpdate,
			updateStateValues,
		},
		profileInfo: { insightTypes, getAiInsightTypes },
		subscriptionInfo: { currentPlan },
	} = useContext(Context);

	const isProPlan = currentPlan?.aiTier === 'pro';

	const [info, setInfo] = useState({
		hoverCard: null,
		selectedFilters: [
			{
				id: 6,
				title: 'Unread',
				value: false,
				group: 'Read Status',
			},
		],
		searchQuery: '',
		searchOpen: false,
		openFilter: false,
		searchLoading: false,
		options: [],
		selectedOption: '',
		loading: false,
		openModal: false,
		activeCardContent: null,
		currentIndex: 0,
		selectedCardNumber: null,
		trainedFeedbackIds: null,
	});

	const searchContainerRef = useRef(null);
	const searchInputRef = useRef(null);
	const navigate = useNavigate();
	const isInitialLoad = useRef(true);

	useEffect(() => {
		if (!aiSuggestedPendingActions) {
			getAISuggestedPendingActions();
		}
	}, [aiSuggestedPendingActions]);

	// Handle API response to set loading to false
	useEffect(() => {
		if (aiSuggestedPendingActions) {
			setInfo((prev) => ({ ...prev, loading: false }));
		}
	}, [aiSuggestedPendingActions]);

	// Trigger API call when filters change (excluding onboarding option)
	useEffect(() => {
		if (info?.selectedOption === 'onboarding') return;

		// Skip initial load to prevent unnecessary API call
		if (isInitialLoad.current) {
			isInitialLoad.current = false;
			return;
		}

		// Set loading state
		setInfo((prev) => ({ ...prev, loading: true }));

		// Create payload for API call based on current filters
		const createPayload = () => {
			const getFilterValues = (group, excludeTitle = null) =>
				info?.selectedFilters
					?.filter(
						(f) => f?.group === group && (!excludeTitle || f?.title !== excludeTitle),
					)
					.map((f) => f?.value) || [];

			const selectedPriority = getFilterValues('Priority Level');
			const selectedReadStatus = getFilterValues('Read Status', 'All');
			const selectedConfidenceScore = getFilterValues('Confidence level');
			const [favourite] = getFilterValues('Other');

			// Date range logic
			const getDateRangeFromFilters = (filters) => {
				const selectedDateFilter = filters?.find((f) => f?.group === 'Date');
				if (!selectedDateFilter?.value) return {};

				const SECONDS_IN_DAY = 86400;
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

			const { from, to } = getDateRangeFromFilters(info?.selectedFilters);

			return {
				page: 1,
				limit: 10,
				sortBy: 'createdAt',
				sortType: -1,
				...(selectedPriority.length && { priority: selectedPriority }),
				...(selectedReadStatus.length && { read: selectedReadStatus }),
				...(selectedConfidenceScore.length && { confidenceScore: selectedConfidenceScore }),
				...(from !== undefined && to !== undefined && { from, to }),
				...(favourite && { isFavourited: favourite }),
				...(info?.searchQuery && { search: info?.searchQuery }),
				...(info?.selectedOption !== 'onboarding' && { insightType: info?.selectedOption }),
			};
		};

		// Trigger API call with current filters
		const payload = createPayload();
		getAISuggestedPendingActions(payload, true); // true for reset
	}, [info?.selectedFilters, info?.selectedOption]);

	// Debounced search effect to avoid too many API calls while typing
	useEffect(() => {
		if (info?.selectedOption === 'onboarding') return;

		// Skip if no search query (initial state)
		if (!info?.searchQuery) return;

		const timeoutId = setTimeout(() => {
			// Set loading state
			setInfo((prev) => ({ ...prev, loading: true }));

			// Create payload for API call based on current filters including search
			const createPayload = () => {
				const getFilterValues = (group, excludeTitle = null) =>
					info?.selectedFilters
						?.filter(
							(f) =>
								f?.group === group && (!excludeTitle || f?.title !== excludeTitle),
						)
						.map((f) => f?.value) || [];

				const selectedPriority = getFilterValues('Priority Level');
				const selectedReadStatus = getFilterValues('Read Status', 'All');
				const selectedConfidenceScore = getFilterValues('Confidence level');
				const [favourite] = getFilterValues('Other');

				// Date range logic
				const getDateRangeFromFilters = (filters) => {
					const selectedDateFilter = filters?.find((f) => f?.group === 'Date');
					if (!selectedDateFilter?.value) return {};

					const SECONDS_IN_DAY = 86400;
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

				const { from, to } = getDateRangeFromFilters(info?.selectedFilters);

				return {
					page: 1,
					limit: 10,
					sortBy: 'createdAt',
					sortType: -1,
					...(selectedPriority.length && { priority: selectedPriority }),
					...(selectedReadStatus.length && { read: selectedReadStatus }),
					...(selectedConfidenceScore.length && {
						confidenceScore: selectedConfidenceScore,
					}),
					...(from !== undefined && to !== undefined && { from, to }),
					...(favourite && { isFavourited: favourite }),
					...(info?.searchQuery && { search: info?.searchQuery }),
					...(info?.selectedOption !== 'onboarding' && {
						insightType: info?.selectedOption,
					}),
				};
			};

			// Trigger API call with current filters including search
			const payload = createPayload();
			getAISuggestedPendingActions(payload, true); // true for reset
		}, 500); // 500ms debounce

		return () => clearTimeout(timeoutId);
	}, [info?.searchQuery]);

	// Handle options from insightTypes
	useEffect(() => {
		if (!insightTypes) {
			getAiInsightTypes(); // Uncomment if needed
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

			setInfo((prev) => ({
				...prev,
				options: finalOptions,
				selectedOption: finalOptions?.[0]?.insight_type,
			}));
		}
	}, [insightTypes]);

	// Filter data based on selected filters and search query
	const filteredActions = useMemo(() => {
		// Handle onboarding cards
		if (info?.selectedOption === 'onboarding') {
			return isProPlan ? proPlanOnboardingCards : onboardingCards;
		}

		if (!aiSuggestedPendingActions?.pendingActions) return [];

		let filtered = [...aiSuggestedPendingActions.pendingActions];

		// Apply search filter
		if (info.searchQuery) {
			const searchLower = info.searchQuery.toLowerCase();
			filtered = filtered.filter(
				(action) =>
					action.title?.toLowerCase().includes(searchLower) ||
					action.description?.toLowerCase().includes(searchLower),
			);
		}

		// Apply other filters
		info.selectedFilters.forEach((filter) => {
			if (filter.group === 'Priority Level' && filter.value) {
				filtered = filtered.filter((action) => action.priority === filter.value);
			}
			if (filter.group === 'Read Status' && filter.value !== undefined) {
				filtered = filtered.filter((action) => action.read === filter.value);
			}
			if (filter.group === 'Confidence level' && filter.value) {
				if (filter.value === '0.9 - 1.0') {
					filtered = filtered.filter((action) => {
						const confidenceScore = action.confidenceScore || 0;
						return confidenceScore >= 0.9;
					});
				} else if (filter.value === '0.7 - 0.89') {
					filtered = filtered.filter((action) => {
						const confidenceScore = action.confidenceScore || 0;
						return confidenceScore >= 0.7 && confidenceScore < 0.9;
					});
				} else if (filter.value === '< 0.7') {
					filtered = filtered.filter((action) => {
						const confidenceScore = action.confidenceScore || 0;
						return confidenceScore < 0.7;
					});
				}
			}
			if (filter.group === 'Date' && filter.value) {
				const now = new Date();

				switch (filter.value) {
					case 'today':
						filtered = filtered.filter((action) => {
							const actionDate = new Date(action.updatedAt * 1000);
							return actionDate.toDateString() === now.toDateString();
						});
						break;
					case 'last7days':
						const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
						filtered = filtered.filter((action) => {
							const actionDate = new Date(action.updatedAt * 1000);
							return actionDate >= sevenDaysAgo;
						});
						break;
					case 'last30days':
						const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
						filtered = filtered.filter((action) => {
							const actionDate = new Date(action.updatedAt * 1000);
							return actionDate >= thirtyDaysAgo;
						});
						break;
				}
			}
			if (filter.group === 'Other' && filter.value) {
				filtered = filtered.filter((action) => action.isFavourite === filter.value);
			}
		});

		// Fallback logic: if unread filter returns no results, switch to read filter
		const hasUnreadFilter = info.selectedFilters.some(
			(filter) => filter.group === 'Read Status' && filter.value === false,
		);

		if (hasUnreadFilter && filtered.length === 0) {
			// Update the filter state to show "Read" instead of "Unread"
			const updatedFilters = info.selectedFilters.map((filter) => {
				if (filter.group === 'Read Status' && filter.value === false) {
					return {
						...filter,
						title: 'Read',
						value: true,
					};
				}
				return filter;
			});

			// Update the state to reflect the filter change
			setInfo((prev) => ({
				...prev,
				selectedFilters: updatedFilters,
			}));

			// Remove unread filter and apply read filter instead
			const otherFilters = info.selectedFilters.filter(
				(filter) => !(filter.group === 'Read Status' && filter.value === false),
			);

			// Re-apply all filters except the unread one, then apply read filter
			let fallbackFiltered = [...aiSuggestedPendingActions.pendingActions];

			// Apply search filter
			if (info.searchQuery) {
				const searchLower = info.searchQuery.toLowerCase();
				fallbackFiltered = fallbackFiltered.filter(
					(action) =>
						action.title?.toLowerCase().includes(searchLower) ||
						action.description?.toLowerCase().includes(searchLower),
				);
			}

			// Apply other filters (excluding the unread filter)
			otherFilters.forEach((filter) => {
				if (filter.group === 'Priority Level' && filter.value) {
					fallbackFiltered = fallbackFiltered.filter(
						(action) => action.priority === filter.value,
					);
				}
				if (filter.group === 'Confidence level' && filter.value) {
					if (filter.value === '0.9 - 1.0') {
						fallbackFiltered = fallbackFiltered.filter((action) => {
							const confidenceScore = action.confidenceScore || 0;
							return confidenceScore >= 0.9;
						});
					} else if (filter.value === '0.7 - 0.89') {
						fallbackFiltered = fallbackFiltered.filter((action) => {
							const confidenceScore = action.confidenceScore || 0;
							return confidenceScore >= 0.7 && confidenceScore < 0.9;
						});
					} else if (filter.value === '< 0.7') {
						fallbackFiltered = fallbackFiltered.filter((action) => {
							const confidenceScore = action.confidenceScore || 0;
							return confidenceScore < 0.7;
						});
					}
				}
				if (filter.group === 'Date' && filter.value) {
					const now = new Date();
					switch (filter.value) {
						case 'today':
							fallbackFiltered = fallbackFiltered.filter((action) => {
								const actionDate = new Date(action.updatedAt * 1000);
								return actionDate.toDateString() === now.toDateString();
							});
							break;
						case 'last7days':
							const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
							fallbackFiltered = fallbackFiltered.filter((action) => {
								const actionDate = new Date(action.updatedAt * 1000);
								return actionDate >= sevenDaysAgo;
							});
							break;
						case 'last30days':
							const thirtyDaysAgo = new Date(
								now.getTime() - 30 * 24 * 60 * 60 * 1000,
							);
							fallbackFiltered = fallbackFiltered.filter((action) => {
								const actionDate = new Date(action.updatedAt * 1000);
								return actionDate >= thirtyDaysAgo;
							});
							break;
					}
				}
				if (filter.group === 'Other' && filter.value) {
					fallbackFiltered = fallbackFiltered.filter(
						(action) => action.isFavourite === filter.value,
					);
				}
			});

			// Apply read filter (read: true)
			fallbackFiltered = fallbackFiltered.filter((action) => action.read === true);

			// If we have results with read filter, return them
			if (fallbackFiltered.length > 0) {
				return fallbackFiltered;
			}
		}

		return filtered;
	}, [
		aiSuggestedPendingActions?.pendingActions,
		info.searchQuery,
		info.selectedFilters,
		info.selectedOption,
		isProPlan,
	]);

	const fetchMorePendingActions = () => {
		if (aiSuggestedPendingActions?.metaInfo?.hasNextPage) {
			const nextPage = aiSuggestedPendingActions?.metaInfo?.currentPage + 1;
			const newPayload = { ...payload, page: nextPage };
			getAISuggestedPendingActions(newPayload, false);
		}
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

			return {
				...prev,
				selectedFilters: updatedFilters,
			};
		});
	};

	const removeFilter = (index) => {
		setInfo((prev) => {
			const updatedFilters = prev.selectedFilters.filter((_, i) => i !== index);
			return {
				...prev,
				selectedFilters: updatedFilters,
			};
		});
	};

	const handleSearchQueryChange = (e) => {
		setInfo((prev) => ({
			...prev,
			searchQuery: e.target?.value,
		}));
	};

	const handleSearchToggle = () => {
		setInfo((prev) => ({
			...prev,
			searchOpen: !prev.searchOpen,
		}));
	};

	const handleOptionSelection = (option) => {
		if (info?.selectedOption === option) return;

		setInfo((prev) => ({
			...prev,
			selectedOption: option,
		}));
	};

	const handleCardClick = useCallback(
		async (card, index) => {
			if (card?.id === 'upgradeCard') {
				navigate('/settings/pricing');
				return;
			}

			// Mark as read if it's not an onboarding card and not already read
			if (!card?.read && info?.selectedOption !== 'onboarding') {
				await pendingActionsUpdate(card?._id, { read: true });
				const payload = { read: true };
				const reset = false;
				getAISuggestedPendingActions(payload, reset, 'update', card?._id);
			}

			setInfo((prev) => ({
				...prev,
				activeCardContent: card,
				openModal: true,
				currentIndex: index,
				selectedCardNumber: index + 1,
			}));
		},
		[info?.selectedOption, pendingActionsUpdate, getAISuggestedPendingActions, navigate],
	);

	const handleCloseModal = () => {
		setInfo((prev) => ({
			...prev,
			openModal: false,
			selectedCardNumber: null,
		}));
	};

	const handleNextCard = useCallback(() => {
		const currentIndex = info.currentIndex;
		const totalCards = filteredActions.length;
		const nextIndex = (currentIndex + 1) % totalCards;

		setInfo((prev) => ({
			...prev,
			currentIndex: nextIndex,
			activeCardContent: filteredActions[nextIndex],
			selectedCardNumber: nextIndex + 1,
		}));
	}, [info.currentIndex, filteredActions]);

	const handlePrevCard = useCallback(() => {
		const currentIndex = info.currentIndex;
		const totalCards = filteredActions.length;
		const prevIndex = (currentIndex - 1 + totalCards) % totalCards;

		setInfo((prev) => ({
			...prev,
			currentIndex: prevIndex,
			activeCardContent: filteredActions[prevIndex],
			selectedCardNumber: prevIndex + 1,
		}));
	}, [info.currentIndex, filteredActions]);

	// Handle click outside search
	useEffect(() => {
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
	return (
		<>
			<div style={{ marginTop: '100px', width: '100%', maxWidth: '868px' }}>
				<div className={styles.proactiveCardTypes}>
					<div className={styles.proactiveCardsLeft}>
						{/* Options from ProactiveSuggestions */}
						{info?.options?.length > 0 && (
							<div className={styles.optionsWrapper}>
								<div className={styles.optionsContainer}>
									{info?.options?.map(({ count, insight_type }, index) => (
										<div
											className={`${styles.option} ${
												info?.selectedOption === insight_type
													? styles.active
													: ''
											}`}
											onClick={() => handleOptionSelection(insight_type)}
											key={index}
										>
											<div className={styles.optionLabel}>
												{info?.selectedOption === insight_type && (
													<span className={styles.activeIndicator}></span>
												)}
												<span
													className={`${styles.optionName} ${
														info?.selectedOption === insight_type
															? styles.active
															: ''
													}`}
												>
													{insight_type}
												</span>
												{info?.selectedOption === insight_type && (
													<span className={styles.optionValue}>
														{count}
													</span>
												)}
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>
					<div className={styles.proactiveCardsRight}>
						{/* Search and Filter Controls */}
						<div className={styles.searchAndFilterContainer}>
							{info?.selectedFilters?.length > 0 && (
								<div className={styles.selectedFilters}>
									Filters : {`${info?.selectedFilters?.[0]?.title}`}
									{info?.selectedFilters?.length > 1 && (
										<span className={styles.filterCount}>
											+{info?.selectedFilters?.length - 1}
										</span>
									)}
									<button
										className={styles.removeFilterBtn}
										onClick={() => removeFilter(0)}
										aria-label="Remove filter"
									>
										<CloseSvg />
									</button>
								</div>
							)}
							{/* Search Bar */}
							<div className={styles.searchMainContainer} ref={searchContainerRef}>
								<button
									className={`${styles.searchBtn} ${
										info?.searchOpen ? styles.expanded : ''
									}`}
									onClick={handleSearchToggle}
									aria-label="Toggle search"
								>
									<SearchSvg stroke="var(--secondary-font)" />
								</button>
								<div
									className={`${styles.searchWrapper} ${
										info?.searchOpen ? styles.expanded : ''
									}`}
								>
									<input
										className={styles.searchInput}
										placeholder="Search"
										onChange={handleSearchQueryChange}
										ref={searchInputRef}
										value={info.searchQuery}
									/>
									{info?.searchLoading && (
										<Spinner
											color="var(--primary-button)"
											borderWidth={2}
											width="30px"
											height="30px"
										/>
									)}
									{info?.searchOpen && (
										<button
											className={styles.closeBtn}
											onClick={handleSearchToggle}
											aria-label="Close search"
										>
											<CloseSearchbarIcon />
										</button>
									)}
								</div>
							</div>

							{/* Filter Button */}
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
									<div className={styles.filterContainer}>
										<div className={styles.filterItems}>
											{filterGroups?.map((group, idx) => (
												<div key={group?.title} style={{ width: '100%' }}>
													<div className={styles.filterItem}>
														<div className={styles.filterItemTitle}>
															{group?.title || ''}
														</div>
														<div className={styles.filterItemOptions}>
															{group?.options?.map((item) => {
																const itemWithGroup = {
																	...item,
																	group: group?.title,
																};

																const isSelected =
																	info?.selectedFilters?.some(
																		(option) =>
																			option?.title ===
																				itemWithGroup?.title &&
																			option?.group ===
																				itemWithGroup?.group,
																	);
																return (
																	<div
																		key={item?.id}
																		className={
																			styles.eachOption
																		}
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
																				className={
																					styles.indicator
																				}
																				style={{
																					backgroundColor:
																						item?.bgColor ||
																						'',
																				}}
																			></div>
																		)}
																		<div
																			className={
																				styles.optionText
																			}
																		>
																			<span
																				className={
																					styles.optionTextContent
																				}
																			>
																				{item?.title || ''}
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
															})}
														</div>
													</div>
													{idx < filterGroups?.length - 1 && (
														<hr
															style={{
																width: '100%',
																height: '1px',
																backgroundColor: 'var(--stroke)',
																border: 'none',
																marginTop: '10px',
															}}
														/>
													)}
												</div>
											))}
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
									className={`${styles.filterBtn} ${
										info.openFilter ? styles.active : ''
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

							{/* Selected Filters Display */}
						</div>
					</div>
				</div>

				<div className={styles.proactiveCards} id="proactiveCardsContainer">
					<InfiniteScroll
						dataLength={filteredActions?.length || 0}
						next={fetchMorePendingActions}
						hasMore={aiSuggestedPendingActions?.metaInfo?.hasNextPage}
						scrollableTarget="proactiveCardsContainer"
					>
						<div className={styles.proactiveCardsContainer}>
							{info?.loading ? (
								<div className={styles.loadingContainer}>
									{skeletonLoaders.map((skeleton) => (
										<Skeleton
											height={175}
											width={170}
											style={{
												'--highlight-color': 'gray',
												'--base-color': 'transparent',
											}}
										/>
									))}
								</div>
							) : filteredActions?.length === 0 ? (
								<div className={styles.noData}>
									{info?.selectedFilters?.length > 0 || info?.searchQuery
										? 'No insights found for the selected filters'
										: 'No insights found'}
								</div>
							) : (
								filteredActions?.map((action, index) => {
									// Handle onboarding cards differently
									if (info?.selectedOption === 'onboarding') {
										return (
											<div
												className={styles.proactiveCard}
												key={action?.id || index}
												onClick={() => handleCardClick(action, index)}
												onMouseEnter={() =>
													setInfo((prev) => ({
														...prev,
														hoverCard: action,
													}))
												}
												onMouseLeave={() =>
													setInfo((prev) => ({
														...prev,
														hoverCard: null,
													}))
												}
												style={{ cursor: 'pointer' }}
											>
												{action?.type === 'upgrade' &&
													action?.background && (
														<div
															style={{
																position: 'absolute',
																width: '100%',
																height: '80px',
																left: 0,
																display: 'flex',
																justifyContent: 'center',
																alignItems: 'center',
																color: 'var(--primary-font)',
																fontSize: '14px',
																fontWeight: '600',
																lineHeight: 'normal',
																fontFamily:
																	'var(--primary-font-family)',
															}}
														>
															<p
																style={{
																	color: 'rgba(242, 242, 243, 0.90)',
																	fontFamily:
																		'var(--primary-font-family)',
																	fontSize: '19px',
																	fontStyle: 'normal',
																	fontWeight: '500',
																	lineHeight: '22px',
																	letterSpacing: '-0.76px',
																	textAlign: 'center',
																}}
															>
																Upgrade to{' '}
																<span
																	style={{
																		color: 'var(--primary-button)',
																	}}
																>
																	Pro Plan
																</span>{' '}
																to see Proactive Insights
															</p>
														</div>
													)}
												<div className={styles.proactiveCardTitle}>
													{action?.title}
												</div>
												{action?.subTitle && (
													<div className={styles.proactiveCardSubTitle}>
														{action?.subTitle}
													</div>
												)}
												<div className={styles.proactiveCardDescription}>
													{action?.description}
												</div>
											</div>
										);
									}

									// Handle regular action cards
									return (
										<div
											className={styles.proactiveCard}
											key={action?._id}
											onClick={() => handleCardClick(action, index)}
											onMouseEnter={() =>
												setInfo((prev) => ({ ...prev, hoverCard: action }))
											}
											onMouseLeave={() =>
												setInfo((prev) => ({ ...prev, hoverCard: null }))
											}
											style={{ cursor: 'pointer' }}
										>
											<div className={styles.proactiveCardTitle}>
												{action?.title}
											</div>
											<div className={styles.proactiveCardDescription}>
												{action?.description}
											</div>
											{info?.hoverCard?._id === action?._id && (
												<div className={styles.proactiveCardHover}>
													<div
														className={
															styles.proactiveCardHoverModuleType
														}
													>
														{action?.moduleType === 'form_response'
															? 'Form'
															: action?.moduleType}
													</div>
													<div
														className={
															styles.proactiveCardHoverPriority
														}
													>
														<span
															className={
																styles.proactiveCardHoverPriorityIndicator
															}
															style={{
																backgroundColor:
																	priorityClassMap[
																		action?.priority
																	],
															}}
														></span>
														<span
															className={
																styles.proactiveCardHoverPriorityText
															}
														>
															{action?.priority}
														</span>
														<span
															className={
																styles.proactiveCardHoverPrioritySeparator
															}
														></span>
														<span
															className={
																styles.proactiveCardHoverPriorityUpdatedAt
															}
														>
															{dayjs(
																action?.updatedAt * 1000,
															)?.fromNow()}
														</span>
													</div>
												</div>
											)}
										</div>
									);
								})
							)}
						</div>
					</InfiniteScroll>
				</div>
			</div>
			<AmbientAiModal
				open={info?.openModal}
				onClose={handleCloseModal}
				data={info?.activeCardContent}
				onNextCardClick={handleNextCard}
				onPrevCardClick={handlePrevCard}
				totalDocs={aiSuggestedPendingActions?.metaInfo?.totalDocs}
				selectedCardNumber={info?.selectedCardNumber}
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
	);
};

export default memo(ProactiveCards);
