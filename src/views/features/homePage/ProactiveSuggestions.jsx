import React, { memo, useContext, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import '../../../assets/scss/home_page/proactiveSuggestions.scss';
import Context from '../../../context/context';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as FilterIcon } from '../../../assets/svg/tasks/newFiltersIcon.svg';
import { ReactComponent as TickIcon } from '../../../assets/svg/tick.svg';
import { ReactComponent as CloseIcon } from '../../../assets/svg/close.svg';
import Skeleton from 'react-loading-skeleton';
import AISuggestionsModal from '../../components/modalsV2/homePage/AISuggestionsModal';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import { FetchMoreLoaderComp, getRelativeDayLabel } from '../../../helpers';
import InfiniteScroll from '../../components/globalComponents/InfiniteScroll';
import { message } from '../../components/globalComponents/CustomToast';
import ObjectID from 'bson-objectid';
import { useNavigate } from 'react-router-dom';
import { handleCombinedChainOfThought } from '../../../helpers/chatHelpers';
import AIQuestions from './AIQuestions';
import { ReactComponent as SearchSvg } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as DoubleUpArrowSvg } from '../../../assets/svg/home_page/doubleUpArrow.svg';
import ChatBox from '../../components/chat/ChatBox';
import Suggestions from './Suggestions';
import PromptsWidget from '../../components/globalComponents/PromptsWidget';
import BuildOptions from './BuildOptions';
import { ReactComponent as CommandSvg } from '../../../assets/svg/files/command.svg';
import GlobalWidget from '../../components/globalComponents/GlobalWidget';

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
	'-1': 'left-1',
	'-2': 'left-2',
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

const infiniteScrollStyle = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	alignSelf: 'stretch',
	gap: '8px',
};
const PriorityLevel = {
	High: 'red',
	Medium: 'yellow',
	Low: 'green',
};
const sortOptions = {
	createdAt: {
		sortType: -1,
	},
};
const skeletonLoaders = Array.from({ length: 7 }, (_, index) => index + 1);

const optionsList = ['All'];
const ProactiveSuggestions = ({ previousOption = null, option = null }) => {
	const navigate = useNavigate();
	const currentIndexRef = useRef(0);
	const totalCardsDataRef = useRef([]);
	const isMountedRef = useRef(true);
	const timeoutIdRef = useRef(null);
	const searchFocusedRef = useRef(false);
	const mainContainerRef = useRef(null);
	const optionsContainerRef = useRef(null); // Ref for the options container

	const {
		templates: {
			getAISuggestedPendingActions,
			aiSuggestedPendingActions,
			pendingActionsUpdate,
			updateStateValues,
			// getAiQuestions,
			// aiQuestions,
			currentSessionId,
			handleGlobalChatMessages,
			globalChatMessages,
		},
		aiSetup: { getPromptsData, promptsData },
		profileInfo: { aiCategories, getAiCategories },
		themeInfo: { theme },
	} = useContext(Context);
	const [info, setInfo] = useState({
		totalCardsData: [],
		cards: [],
		activeCardContent: null,
		openModal: false,
		currentIndex: 0,
		loading: true,
		openFilter: false,
		selectedFilters: [],
		selectedCardNumber: null,
		hoveredCard: null,
		isListView: false,
		isApiLoading: false,
		sortBy: 'createdAt',
		activeBtn: 'insights',
		sortOptions,
		searchQuery: '',
		chatQuery: '',
		showExploreMore: false,
		options: optionsList,
		selectedOption: 'All',
		showArrows: {
			left: false,
			right: false,
		},
	});
	const promptsLength = promptsData?.data?.length ?? 0;
	const promptsHasNextPage = Boolean(promptsData?.hasNextPage);
	const promptsCurrentPage = Number(promptsData?.currentPage) || 1;
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
	const handleScroll = (direction) => {
		const container = optionsContainerRef.current;
		if (container) {
			const scrollAmount = 600; // Adjust scroll distance as needed
			const newScrollPosition =
				direction === 'left'
					? container.scrollLeft - scrollAmount
					: container.scrollLeft + scrollAmount;
			container.scrollTo({
				left: newScrollPosition,
				behavior: 'smooth',
			});
		}
	};

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
	}, [checkScroll]);
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
	}, [aiSuggestedPendingActions, info?.activeCardContent]);

	// useEffect(() => {
	// 	if (!aiQuestions) {
	// 		getAiQuestions();
	// 	}
	// }, []);

	useEffect(() => {
		if (!aiCategories) {
			getAiCategoriesOptions();
		}
	}, [aiCategories, info?.options]);

	const getAiCategoriesOptions = async () => {
		const response = await getAiCategories();
		if (response?.[0] === true) {
			setInfo((prev) => ({
				...prev,
				options: [...optionsList, ...response?.[1]],
			}));
		} else {
			setInfo((prev) => ({
				...prev,
				options: optionsList,
			}));
		}
	};
	useEffect(() => {
		if (info?.totalCardsData?.length > 0) {
			updateWindow(info?.currentIndex);
		}
	}, [info?.totalCardsData, info?.currentIndex]);

	useEffect(() => {
		if (info?.selectedOption !== 'All') {
			return;
		}
		fetchPendingActions();
	}, [info?.selectedOption]);

	useEffect(() => {
		if (isMountedRef.current) return;
		fetchPendingActions();
	}, [info?.selectedFilters, info?.sortOptions, info?.sortBy]);

	useEffect(() => {
		if (isMountedRef.current) {
			isMountedRef.current = false;
			return;
		}
		if (timeoutIdRef.current) {
			clearTimeout(timeoutIdRef.current);
		}
		timeoutIdRef.current = setTimeout(() => {
			fetchPendingActions();
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
					...(option !== 'All' && { category: option }),
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
	}, [info?.isApiLoading, aiSuggestedPendingActions, info?.selectedOption]);

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
		if (info?.options?.length > 0 && !info?.selectedOption) {
			setInfo((prev) => ({
				...prev,
				selectedOption: prev?.options[0],
			}));
		}
	}, [info?.selectedOption, info?.options]);

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
				position: Math.abs(diff) <= 2 ? diff : null,
			};
		});

		setInfo((prev) => ({
			...prev,
			cards,
		}));
	};

	const handleCardClick = async (card, index) => {
		if (!card?.read) {
			await pendingActionsUpdate(card?._id, { read: true });
		}
		setInfo((prev) => ({
			...prev,
			activeCardContent: card,
			openModal: true,
			currentIndex: index,
			selectedCardNumber: index + 1,
			cards: prev.cards.map((c) => (c._id === card._id ? { ...c, read: true } : c)),
		}));
		console.log(info?.cards, 'info?.cards');
		currentIndexRef.current = index;
	};

	const handleCloseModal = () =>
		setInfo((prev) => ({
			...prev,
			openModal: false,
			activeCardContent: null,
			selectedCardNumber: null,
		}));

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

	const fetchPendingActions = async () => {
		const reset = true;
		getAISuggestedPendingActions(newUpdatedPayload, reset);
	};

	const fetchMorePendingActions = async () => {
		const nextPage = aiSuggestedPendingActions?.metaInfo?.currentPage + 1;
		const payload = {
			...newUpdatedPayload,
			page: nextPage,
		};

		await getAISuggestedPendingActions(payload, false);
	};

	const handleFavouriteClick = async (id) => {
		const card = info?.cards?.find((c) => c?._id === id);
		const res = await pendingActionsUpdate(id, { isFavourite: !card?.isFavourite });
		if (res?.[0] === true) {
			getAISuggestedPendingActions(
				{
					isFavourite: !card?.isFavourite,
				},
				false,
				'update',
				id,
			);
			message.success(!card?.isFavourite ? 'Added to favourites' : 'Removed from favourites');
		} else {
			message.error('Failed to update');
		}
	};

	const handleViewReportClick = useCallback((card) => {
		const { chain_of_thought } = card;
		const report = handleCombinedChainOfThought(chain_of_thought || []);

		const messages = [
			{
				type: 'user',
				moduleType: 'ai_suggestion_report',
				data: card,
				message: card?.title,
			},
			{
				type: 'AI',
				moduleType: 'ai_suggestion_report',
				data: {
					research_report: card?.research_report,
				},
				processing: 'Report',
				report,
				follow_up_query: card?.suggested_prompts,
				stream_end: true,
			},
		];
		const sessionId = card?.sessionId || ObjectID()?.toString();
		handleGlobalChatMessages({
			updateExtraInfo: true,
			recentChatMessages: messages,
			sessionId,
		});
		navigate(`/chat/${sessionId}`);
	}, []);

	const handleViewChange = (view) => {
		setInfo((prev) => ({
			...prev,
			isListView: view,
		}));
	};

	const handleSortByClick = (sortBy) => {
		setInfo((prev) => {
			const updatedSortOption = {
				...prev?.sortOptions[sortBy],
				sortType: -1 * prev?.sortOptions[sortBy]?.sortType,
			};
			const updatedSortOptions = {
				...prev?.sortOptions,
				[sortBy]: updatedSortOption,
			};
			return {
				...prev,
				sortOptions: updatedSortOptions,
				sortBy: sortBy,
			};
		});
	};

	const handleBtnClick = (btn) => {
		if (info?.activeBtn === btn) return;
		setInfo((prev) => ({
			...prev,
			activeBtn: btn,
		}));
	};

	const handleSearchQueryChange = (e) => {
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
			...(option !== 'All' && { category: option }),
		};
	}, [payload, info?.selectedFilters, info?.sortOptions, info?.sortBy, info?.searchQuery]);

	const groupedCards = useMemo(() => {
		const groups = {};

		info?.cards?.forEach((card) => {
			const label = getRelativeDayLabel(card?.createdAt);
			if (!groups[label]) groups[label] = [];
			groups[label].push(card);
		});

		return groups;
	}, [info?.cards]);
	const handleCustomOnSendFunction = useCallback(
		(data) => {
			updateStateValues({ activePayloadForChat: data });
			navigate(`/chat/${currentSessionId}`);
		},
		[currentSessionId],
	);

	const handleChatQueryChange = (query) => {
		setInfo((prev) => ({
			...prev,
			chatQuery: query,
		}));

		if (query?.length === 0) {
			updateStateValues({ chatBoxSuggestions: null });
		}
	};
	const handleExploreMoreClick = () => {
		setInfo((prev) => ({
			...prev,
			showExploreMore: !prev?.showExploreMore,
		}));
	};
	const fetchAiSuggestedPrompts = async (page = 1, searchQuery = '', reset = true) => {
		const payload = {
			page: page,
			limit: 30,
			...(searchQuery && { search: searchQuery }),
		};
		getPromptsData(payload, reset);
	};
	const fetchMoreAiSuggestedPrompts = () => {
		fetchAiSuggestedPrompts(promptsCurrentPage + 1, info?.searchQuery, false);
	};
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
		currentIndexRef.current = 0;
		setInfo((prev) => ({
			...prev,
			selectedOption: option,
			currentIndex: 0,
		}));
	};
	const renderedOptions = useMemo(() => {
		return info?.options?.map((option, index) => {
			return (
				<div
					className={`option ${info?.selectedOption === option ? 'active' : ''}`}
					onClick={(e) => {
						e.stopPropagation();
						handleOptionSelection(option);
					}}
					key={index}
				>
					<div className="option-label">{option}</div>
				</div>
			);
		});
	}, [info?.options, info?.selectedOption]);
	return (
		<>
			{info?.showExploreMore && (
				<div className="revertExploreMoreContainer">
					<div
						className="revertExploreMore"
						onClick={() => {
							setInfo((prev) => ({
								...prev,
								showExploreMore: false,
							}));
						}}
					>
						<div>Back to insights</div>
						<DoubleUpArrowSvg />
					</div>
				</div>
			)}
			{(aiSuggestedPendingActions?.pendingActions?.length > 0 ||
				info?.searchQuery?.length !== 0) &&
				!info?.showExploreMore && (
					<div className="options-wrapper">
						<div
							className={`arrow left-arrow ${theme === 'light' ? 'light' : ''}`}
							onClick={() => handleScroll('left')}
						>
							<ChevronRightThinSvg style={{ transform: 'rotate(180deg)' }} />
						</div>

						<div
							className={`homepage__options-container`}
							ref={optionsContainerRef}
							style={{
								justifyContent: 'flex-start',
							}}
						>
							{renderedOptions}
						</div>

						<div
							className={`arrow right-arrow ${theme === 'light' ? 'light' : ''}`}
							onClick={() => handleScroll('right')}
						>
							<ChevronRightThinSvg />
						</div>
					</div>
				)}
			<div
				className={`proactive-suggestions-container ${
					info?.showExploreMore ? 'active' : ''
				}`}
				style={{
					marginTop: info?.showExploreMore ? '60px' : '0px',
				}}
				ref={mainContainerRef}
			>
				{!info?.showExploreMore && (
					<>
						{info?.selectedFilters?.length > 0 && (
							<div className="selected-filter">
								{info?.selectedFilters?.map((item) => (
									<div key={item?.id} className="selected-filter-item">
										<span>{item?.title}</span>
										<CloseIcon
											style={{ cursor: 'pointer' }}
											onClick={() => handleFilterClick(item, item?.group)}
										/>
									</div>
								))}
							</div>
						)}

						{info?.activeBtn === 'questions' && (
							<div className="ai-questions-wrapper">
								<AIQuestions />
							</div>
						)}
						{info?.activeBtn === 'insights' && (
							<>
								{info?.selectedOption === 'All' ? (
									(info?.cards?.length > 0 ||
										info?.searchQuery?.length !== 0) && (
										<div
											className="cards-container"
											// style={{
											// 	display: info?.cards?.length > 0 ? '' : 'none',
											// }}
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
														<div
															key={index}
															className={classList.join(' ')}
														>
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
																/>
															</div>
														</div>
													);
												})
											) : info?.cards?.length === 0 ? (
												<div
													className="no-data"
													style={{ color: 'var(--primary-font)' }}
												>
													No data available
												</div>
											) : (
												info?.cards?.map((card, index) => {
													if (card?.position === null) return null;
													const classList = [
														'card',
														positionClassMap[card?.position],
													];
													return (
														<div
															key={index}
															className={classList?.join(' ')}
															onClick={() =>
																handleCardClick(card, index)
															}
														>
															<div className="header">
																<div className="card-description">
																	{card?.title}
																</div>
															</div>
															{classList?.[1] === 'selected' && (
																<div className="footer">
																	<div className="module-type">
																		{card?.moduleType}
																	</div>
																	<div className="module-priority">
																		<span
																			style={{
																				backgroundColor:
																					PriorityLevel[
																						card
																							?.priority
																					],
																			}}
																		></span>
																		<div className="module-priority-text">
																			<div>
																				{card?.priority}
																			</div>
																			{card?.priority &&
																				card?.updatedAt && (
																					<div
																						style={{
																							color: 'var(--secondary-font)',
																						}}
																					>
																						|
																					</div>
																				)}
																			<Tooltip
																				title={dayjs(
																					card?.updatedAt *
																						1000,
																				).format(
																					'MMMM D, YYYY h:mm A',
																				)}
																			>
																				<div>
																					{dayjs(
																						card?.updatedAt *
																							1000,
																					)?.fromNow()}
																				</div>
																			</Tooltip>
																		</div>
																	</div>
																</div>
															)}
														</div>
													);
												})
											)}
										</div>
									)
								) : (
									<PromptsWidget
										option={info?.selectedOption}
										currentIndex={currentIndexRef?.current}
										searchQuery={info?.searchQuery}
									/>
								)}

								<div
									className={`actionMainContainer ${
										info?.selectedOption !== 'All' ? 'onPrompt' : ''
									}`}
								>
									{(info?.cards.length || info?.searchQuery?.length !== 0) && (
										<div className="right-container">
											<div className="searchMainContainer">
												<div
													className="search-wrapper"
													data-tooltip="Search"
												>
													<div className="search-icon">
														<SearchSvg stroke="var(--primary-font)" />
													</div>
													<input
														className="search-input"
														placeholder="Search"
														onChange={handleSearchQueryChange}
														onFocus={() =>
															(searchFocusedRef.current = true)
														}
														onBlur={() =>
															(searchFocusedRef.current = false)
														}
													/>
												</div>
												<div className="searchOptionsContainer">
													<div className="command-icon">
														<span>
															<CommandSvg />
														</span>
													</div>
													<div className="command-icon">
														<span>K</span>
													</div>
												</div>
											</div>
										</div>
									)}
									{info?.cards?.length > 0 && (
										<div className="optionsRightMainContainer">
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
															{filterGroups?.map((group, idx) => (
																<div
																	key={group?.title}
																	style={{ width: '100%' }}
																>
																	<div className="filter-item">
																		<div className="filter-item-title">
																			{group?.title || ''}
																		</div>
																		<div className="filter-item-options">
																			{group?.options?.map(
																				(item) => {
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
																				marginTop: '10px',
																			}}
																		/>
																	)}
																</div>
															))}
														</div>
													</div>
												}
												color={'transparent'}
												style={{
													cursor: 'pointer',
													userSelect: 'none',
												}}
												trigger={'click'}
											>
												<div
													className="action-left"
													onClick={() => {
														if (info?.openFilter) {
															return;
														}
														setInfo((prev) => ({
															...prev,
															openFilter: true,
														}));
													}}
												>
													<button
														className={`filter-btn ${
															info?.openFilter ? 'active' : ''
														}`}
														data-tooltip="Filter"
													>
														<FilterIcon /> Filter
													</button>
												</div>
											</Tooltip>
											{info?.cards?.length > 0 && (
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
															{
																aiSuggestedPendingActions?.metaInfo
																	?.totalDocs
															}
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
											)}
										</div>
									)}
								</div>
							</>
						)}
						<AISuggestionsModal
							open={info?.openModal}
							onClose={handleCloseModal}
							data={info?.activeCardContent}
							onNextCardClick={handleRight}
							onPrevCardClick={handleLeft}
							totalDocs={aiSuggestedPendingActions?.metaInfo?.totalDocs}
							selectedCardNumber={currentIndexRef?.current + 1}
							onFavouriteClick={handleFavouriteClick}
						/>
					</>
				)}
				<div className="proactiveChatContainer">
					<div
						className={`chatbox_container ${
							info?.showExploreMore && info?.cards?.length > 0 ? 'slideUp' : ''
						}`}
					>
						<ChatBox
							onSend={handleCustomOnSendFunction}
							customChatActions={true}
							autoFocus={false}
							animatePlaceholder={true}
							onChatQueryChange={handleChatQueryChange}
							showUpgradeSubscriptionBtn={false}
							customChatBoxClick={() => {
								setInfo((prev) => ({
									...prev,
									showExploreMore: true,
								}));
							}}
						/>
					</div>
					<div className="suggestions-container">
						<Suggestions chatQuery={info?.chatQuery} styles={{ margin: '0 auto' }} />
					</div>
					{/* {info?.chatQuery?.length === 0 &&
						globalChatMessages?.[currentSessionId]?.chatBoxInfo?.build && (
							<BuildOptions />
						)} */}
				</div>
			</div>

			<div
				className={`explore-more-btn ${info?.showExploreMore ? 'active' : ''}`}
				onClick={(e) => {
					e.stopPropagation();
					handleExploreMoreClick(e);
				}}
			>
				Explore More <DoubleUpArrowSvg />
			</div>
			{info?.showExploreMore && (
				<>
					<GlobalWidget />

					{promptsData?.data?.lenght > 0 && (
						<div className="modal-container">
							<InfiniteScroll
								dataLength={promptsLength}
								next={() => fetchMoreAiSuggestedPrompts()}
								hasMore={promptsHasNextPage || false}
								loader={<FetchMoreLoaderComp wrapperStyle={{ width: '100%' }} />}
								height={'60vh'}
							>
								<div className="modal-content-container">
									{promptsData?.data?.map((prompt, index) => (
										<div key={index} className="modal-content">
											<div className="modal-content-title">
												{prompt?.title}
											</div>
											<div className="modal-content-prompt">
												{prompt?.category}
											</div>
										</div>
									))}
								</div>
							</InfiniteScroll>
						</div>
					)}
				</>
			)}
		</>
	);
};

export default memo(ProactiveSuggestions);
