import { memo, useContext, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import '../../../assets/scss/home_page/proactiveSuggestions.scss';
import Context from '../../../context/context';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as FilterIcon } from '../../../assets/svg/tasks/newFiltersIcon.svg';
import { ReactComponent as TickIcon } from '../../../assets/svg/tick.svg';
import { ReactComponent as CloseIcon } from '../../../assets/svg/close.svg';
import EmailIcon from '../../../assets/svg/login_page/GmailIcon';
import { ReactComponent as QuestionSvg } from '../../../assets/svg/home_page/question.svg';
import { ReactComponent as ListDashesSvg } from '../../../assets/svg/home_page/listDashes.svg';
import Skeleton from 'react-loading-skeleton';
import AISuggestionsModal from '../../components/modalsV2/homePage/AISuggestionsModal';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import { getRelativeDayLabel } from '../../../helpers';
import InfiniteScroll from '../../components/globalComponents/InfiniteScroll';
import { message } from '../../components/globalComponents/CustomToast';
import ObjectID from 'bson-objectid';
import { useNavigate } from 'react-router-dom';
import { handleCombinedChainOfThought } from '../../../helpers/chatHelpers';
import { ReactComponent as RelativeTimeSvg } from '../../../assets/svg/home_page/relativeTime.svg';
import { ReactComponent as ListViewSvg } from '../../../assets/svg/home_page/listView.svg';
import { ReactComponent as FocusViewSvg } from '../../../assets/svg/home_page/focusView.svg';
import { ReactComponent as SortDescSvg } from '../../../assets/svg/home_page/sortDesc.svg';
import { ReactComponent as SortAscSvg } from '../../../assets/svg/home_page/sortAsc.svg';
import { ReactComponent as AgentIcon } from '../../../assets/svg/sidebar/agentsIcon.svg';
import AIQuestions from './AIQuestions';
import { ReactComponent as StarSvg } from '../../../assets/svg/home_page/star.svg';
import { ReactComponent as SearchSvg } from '../../../assets/svg/workflow/search.svg';

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
const filterGroups = [
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

const ProactiveSuggestions = () => {
	const navigate = useNavigate();
	const currentIndexRef = useRef(0);
	const totalCardsDataRef = useRef([]);
	const isMountedRef = useRef(true);
	const timeoutIdRef = useRef(null);

	const {
		templates: {
			getAISuggestedPendingActions,
			aiSuggestedPendingActions,
			pendingActionsUpdate,
			updateStateValues,
			getAiQuestions,
			aiQuestions,
		},
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
	});

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

	useEffect(() => {
		if (!aiQuestions) {
			getAiQuestions();
		}
	}, []);

	const handleKeyDown = (e) => {
		if (e?.key === 'ArrowUp' || e?.key === 'ArrowLeft') {
			handleLeft();
		} else if (e?.key === 'ArrowDown' || e?.key === 'ArrowRight') {
			handleRight();
		}
	};
	useEffect(() => {
		window?.addEventListener('keydown', handleKeyDown);

		// Clean up on unmount
		return () => {
			window?.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyDown]);

	useEffect(() => {
		if (info?.totalCardsData?.length > 0) {
			updateWindow(info?.currentIndex);
		}
	}, [info?.totalCardsData, info.currentIndex]);

	useEffect(() => {
		if (!aiSuggestedPendingActions) return;
		if (
			aiSuggestedPendingActions?.metaInfo?.currentPage === 1 &&
			info?.selectedFilters?.length === 0 &&
			isMountedRef.current
		) {
			isMountedRef.current = false;
			return;
		}
		fetchPendingActions();
	}, [info?.selectedFilters, info?.sortOptions, info?.sortBy]);

	useEffect(() => {
		if (info?.searchQuery) {
			if (timeoutIdRef.current) {
				clearTimeout(timeoutIdRef.current);
			}
			timeoutIdRef.current = setTimeout(() => {
				fetchPendingActions();
			}, 1000);
		}
	}, [info?.searchQuery]);

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
		};
	}, [payload, info?.selectedFilters, info?.sortOptions, info?.sortBy, info?.searchQuery]);

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

	const handleLeft = () => {
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
	};

	const handleRight = async () => {
		if (info?.isApiLoading) return;
		const isLastCard = currentIndexRef.current === totalCardsDataRef.current.length - 2;

		if (isLastCard) {
			setInfo((prev) => ({
				...prev,
				isApiLoading: true,
			}));
			if (aiSuggestedPendingActions?.metaInfo?.hasNextPage) {
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
			} else {
				const index = 0;
				setInfo((prev) => ({
					...prev,
					currentIndex: index,
					activeCardContent: totalCardsDataRef.current[index],
					isApiLoading: false,
				}));
				currentIndexRef.current = index;
				return;
			}
		}

		// Normal forward movement
		const index = currentIndexRef.current + 1;
		setInfo((prev) => ({
			...prev,
			currentIndex: index,
			activeCardContent: totalCardsDataRef.current[index],
			selectedCardNumber: index + 1,
		}));
		currentIndexRef.current = index;
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
		updateStateValues({ globalChatMessages: messages });
		if (card?.sessionId) {
			navigate(`/chat/${card?.sessionId}`);
		} else {
			navigate(`/chat/${ObjectID()?.toString()}`);
		}
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

	const groupedCards = useMemo(() => {
		const groups = {};

		info?.cards?.forEach((card) => {
			const label = getRelativeDayLabel(card?.createdAt);
			if (!groups[label]) groups[label] = [];
			groups[label].push(card);
		});

		return groups;
	}, [info?.cards]);

	return (
		<div className="proactive-suggestions-container">
			<div className="action-container">
				<div className="left-container">
					{/* {info?.isListView && ( */}
					<div className="btns-container">
						<div
							className={`btn ${info?.activeBtn === 'insights' ? 'active' : ''}`}
							onClick={() => handleBtnClick('insights')}
						>
							<div className="icon-container">
								<ListDashesSvg />
							</div>
							<div className="text-container">Insights</div>
						</div>
						{aiQuestions?.data?.length > 0 && (
							<div
								className={`btn ${info?.activeBtn === 'questions' ? 'active' : ''}`}
								onClick={() => handleBtnClick('questions')}
							>
								<div className="icon-container">
									<QuestionSvg />
								</div>
								<div className="text-container">Questions</div>
							</div>
						)}
					</div>
					{/* )} */}
				</div>
				<div className="right-container">
					<div className="viewSelectionContainer">
						<Tooltip
							arrow={false}
							title={<div className="tooltipTitle">List View</div>}
							color="transparent"
							placement="bottom"
							trigger={'hover'}
						>
							<div
								className={`viewSelection ${info?.isListView ? 'active' : ''}`}
								onClick={() => handleViewChange(true)}
							>
								<ListViewSvg className={info?.isListView ? 'active-icon' : ''} />
							</div>
						</Tooltip>
						<Tooltip
							arrow={false}
							title={<div className="tooltipTitle">Focus View</div>}
							color="transparent"
							placement="bottom"
						>
							<div
								className={`viewSelection ${!info?.isListView ? 'active' : ''}`}
								onClick={() => handleViewChange(false)}
							>
								<FocusViewSvg className={!info?.isListView ? 'active-icon' : ''} />
							</div>
						</Tooltip>
					</div>

					<div style={{ display: 'flex', flexDirection: 'row', gap: '6px' }}>
						<Tooltip
							placement="bottom"
							title={<div className="tooltipTitle">Sort by created at</div>}
							color="transparent"
							arrow={false}
						>
							<div
								className="sort-by-created-at"
								onClick={() => handleSortByClick('createdAt')}
							>
								{info?.sortOptions[info?.sortBy]?.sortType === -1 ? (
									<SortAscSvg />
								) : (
									<SortDescSvg />
								)}
							</div>
						</Tooltip>
						<Tooltip
							open={info?.openFilter}
							onOpenChange={() => setInfo((prev) => ({ ...prev, openFilter: false }))}
							placement="top"
							title={
								<div className="filter-container">
									<div className="filter-items">
										{filterGroups?.map((group, idx) => (
											<div key={group?.title} style={{ width: '100%' }}>
												<div className="filter-item">
													<div className="filter-item-title">
														{group?.title || ''}
													</div>
													<div className="filter-item-options">
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
							color={'transparent'}
							style={{ cursor: 'pointer', userSelect: 'none' }}
							trigger={'click'}
						>
							<div
								className="action-left"
								onClick={() => {
									if (info?.openFilter) {
										return;
									}
									setInfo((prev) => ({ ...prev, openFilter: true }));
								}}
							>
								<button
									className={`filter-btn ${info?.openFilter ? 'active' : ''}`}
									data-tooltip="Filter"
								>
									<FilterIcon />
								</button>
							</div>
						</Tooltip>

						<div className="search-wrapper" data-tooltip="Search">
							<div className="search-icon">
								<SearchSvg />
							</div>
							<input
								className="search-input"
								placeholder="Search"
								onChange={handleSearchQueryChange}
							/>
						</div>
					</div>
				</div>

				{/* {info?.cards?.length > 5 && (
					<div className="action-right">
						<button className="card-change-btn" onClick={handleLeft}>
							<ChevronRightThinSvg className="left-chevron" />
						</button>
						<button className="card-change-btn" onClick={handleRight}>
							<ChevronRightThinSvg />
						</button>
					</div>
				)} */}
			</div>
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
			</>
			{info?.activeBtn === 'questions' && (
				<div className="ai-questions-wrapper">
					<AIQuestions />
				</div>
			)}
			{info?.isListView && info?.activeBtn === 'insights' ? (
				<div className="proactiveSuggestionsContainer">
					{info?.loading && !aiSuggestedPendingActions?.pendingActions?.length ? (
						<div className="skeleton-container">
							{skeletonLoaders?.map((_, index) => (
								<Skeleton
									width="739px"
									height="100px"
									style={{
										'--highlight-color': 'gray',
										'--base-color': 'transparent',
									}}
									key={index}
								/>
							))}
						</div>
					) : aiSuggestedPendingActions?.pendingActions?.length === 0 ? (
						<div
							className="no-data"
							style={{ color: 'var(--primary-font)', margin: '0 auto' }}
						>
							No data available
						</div>
					) : (
						<div className="list-view-container">
							{info?.activeBtn === 'insights' && (
								<InfiniteScroll
									dataLength={info?.cards?.length || 0}
									hasMore={
										(aiSuggestedPendingActions?.metaInfo?.hasNextPage &&
											info?.cards?.length) ||
										false
									}
									next={fetchMorePendingActions}
									style={infiniteScrollStyle}
									height={'100%'}
									endMessage={<div style={{ paddingBottom: '50px' }}></div>}
									className="scrollable-container"
								>
									<div style={{ margin: 'auto' }}>
										{Object?.entries(groupedCards)?.map(
											([label, cards], index) => (
												<div key={index} className="groupedCardsContainer">
													<div
														className="dateLabel"
														style={{
															marginTop: `${
																index !== 0 ? '50px' : '0px'
															}`,
														}}
													>
														{label}
													</div>
													{cards?.map((card, index) => {
														const priority = card?.priority;
														const isRead = card?.read;
														const messageAt = dayjs(
															card?.knowledgeBase?.[0]?.metadata
																?.messages?.[0]?.messagedAt * 1000,
														).format('MMMM D, YYYY  h:mm A');
														return (
															<div
																className="eachCardContainer"
																key={index}
																onMouseEnter={() =>
																	setInfo((prev) => ({
																		...prev,
																		hoveredCard: card,
																	}))
																}
																onMouseLeave={() =>
																	setInfo((prev) => ({
																		...prev,
																		hoveredCard: null,
																	}))
																}
																onClick={() =>
																	handleCardClick(card, index)
																}
															>
																{/* <Tooltip
															title={
																<div className="tooltipContainer">
																	{card?.description || ''}
																</div>
															}
															placement="bottomLeft"
															arrow={false}
															color={'transparent'}
															mouseEnterDelay={0}
															mouseLeaveDelay={0}
															overlayStyle={{
																position: 'fixed',
																pointerEvents: 'none',
															}}
															overlayClassName={`tooltip-${card?._id}`}
														> */}
																<div
																	className="cardContainerUnreadIndicator"
																	style={{ cursor: 'pointer' }}
																	onMouseMove={(e) => {
																		const tooltip =
																			document?.querySelector(
																				`.tooltip-${card?._id}`,
																			);
																		if (tooltip) {
																			tooltip.style.left = `${
																				e.clientX + 10
																			}px`;
																			tooltip.style.top = `${
																				e.clientY + 10
																			}px`;
																		}
																	}}
																>
																	{!isRead && (
																		<span className="unread"></span>
																	)}
																	<div className="cardContianerTitle">
																		<span>
																			{card?.title} -{' '}
																		</span>
																		{card?.description}
																	</div>
																</div>
																{/* </Tooltip> */}
																<div
																	className={`cardOptionsMainContainer`}
																>
																	<div className="cardOptionsContainer">
																		<Tooltip
																			title={
																				<div className="priorityTooltip">{`${
																					card?.isFavourite ===
																					true
																						? 'Favorite'
																						: 'Not Favourited'
																				}`}</div>
																			}
																			placement="bottom"
																			trigger={'hover'}
																			arrow={false}
																			color={'transparent'}
																		>
																			<div
																				className={`starLogoContainer ${
																					card?.isFavourite ===
																					true
																						? 'active'
																						: ''
																				}`}
																				onClick={(e) => {
																					e?.stopPropagation();
																					handleFavouriteClick(
																						card?._id,
																					);
																				}}
																			>
																				<StarSvg />
																			</div>
																		</Tooltip>
																		{card?.moduleType ===
																			'gmail' && (
																			<>
																				<div className="verticalLine"></div>
																				<Tooltip
																					title={
																						<div className="emailContainer">
																							{/* <div className="emailHeader">
																				<div className="emailTitle">
																					Summary of the mail
																				</div>
																				<div className="emailDescription">
																					Establish ongoing
																					check-ins and feedback
																					sessions to identify
																					customer requirements
																					and modify our products
																					as needed.Establish
																					ongoing check-ins and
																					feedback sessions to
																					identify customer
																					requirements and
																					modifyEstablish ongoing
																					check-ins and feedback
																					sessions to identify
																					customer requirements
																					and modify our products
																					as needed.Establish
																					ongoing check-ins and
																					feedback sessions to
																					identify customer
																					requirements and modify.
																				</div>
																			</div> */}
																							<div className="relativeTime">
																								<EmailIcon
																									width={
																										16
																									}
																									height={
																										12
																									}
																								/>
																								{
																									messageAt
																								}
																							</div>
																						</div>
																					}
																					placement="bottom"
																					trigger={
																						'hover'
																					}
																					arrow={false}
																					color={
																						'transparent'
																					}
																				>
																					<div>
																						<EmailIcon
																							width={
																								16
																							}
																							height={
																								12
																							}
																						/>
																					</div>
																				</Tooltip>
																			</>
																		)}
																		<div className="verticalLine"></div>

																		{priority && (
																			<>
																				<div className="priorityOption">
																					<Tooltip
																						title={
																							<div className="priorityTooltip">
																								{`Priority: ${priority}`}
																							</div>
																						}
																						placement="bottom"
																						trigger={
																							'hover'
																						}
																						arrow={
																							false
																						}
																						color={
																							'transparent'
																						}
																					>
																						<div className="priority">
																							<div
																								className="indicator"
																								style={{
																									background:
																										priority ===
																										'High'
																											? 'red'
																											: priority ===
																											  'Medium'
																											? 'orange'
																											: 'green',
																								}}
																							></div>
																							<div className="priority-text">
																								{
																									priority
																								}
																							</div>
																						</div>
																					</Tooltip>
																				</div>
																				<div className="verticalLine"></div>
																			</>
																		)}

																		<Tooltip
																			title={
																				<div className="confidenceScoreContainer">
																					<AgentIcon fill="var(--primary-button)" />
																					<div className="confidenceScoreDescription">
																						<span>
																							{card?.confidence_score *
																								100}
																							{'  '}%
																						</span>{' '}
																						Confidence
																						that this
																						task/message
																						is aligned
																						with the
																						user's
																						intent or
																						ready for
																						action.
																					</div>
																				</div>
																			}
																			placement="bottom"
																			trigger={'hover'}
																			arrow={false}
																			color={'transparent'}
																		>
																			<div
																				style={{
																					fontSize:
																						'12px',
																				}}
																				className="confidenceScore"
																			>
																				{card?.confidence_score *
																					100}{' '}
																				%
																			</div>
																		</Tooltip>
																		<div className="verticalLine"></div>
																		<Tooltip
																			title={
																				<div className="priorityTooltip">
																					Last Updated At
																				</div>
																			}
																			placement="bottom"
																			trigger={'hover'}
																			arrow={false}
																			color={'transparent'}
																		>
																			<div className="relativeTime">
																				<RelativeTimeSvg />
																				{dayjs(
																					card?.updatedAt *
																						1000,
																				).fromNow()}
																			</div>
																		</Tooltip>
																	</div>
																	{info?.hoveredCard?._id ===
																		card?._id && (
																		<div className="cardButtonsContainer">
																			<div
																				className="checkButton"
																				onClick={(e) => {
																					e.stopPropagation();
																					handleViewReportClick(
																						card,
																					);
																				}}
																			>
																				Check
																				<ChevronRightThinSvg />
																			</div>
																		</div>
																	)}
																</div>
															</div>
														);
													})}
												</div>
											),
										)}
									</div>
								</InfiniteScroll>
							)}
						</div>
					)}
				</div>
			) : (
				info?.activeBtn === 'insights' && (
					<>
						<div className="cards-container">
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
												<Skeleton height={'100%'} width={'100%'} />
											</div>
										</div>
									);
								})
							) : info?.cards?.length === 0 ? (
								<div className="no-data" style={{ color: 'var(--primary-font)' }}>
									No data available
								</div>
							) : (
								info?.cards?.map((card, index) => {
									if (card?.position === null) return null;
									const classList = ['card', positionClassMap[card?.position]];
									return (
										<div
											key={index}
											className={classList?.join(' ')}
											onClick={() => handleCardClick(card, index)}
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
																	PriorityLevel[card?.priority],
															}}
														></span>
														<div className="module-priority-text">
															<div>{card?.priority}</div>
															{card?.priority && card?.updatedAt && (
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
																	card?.updatedAt * 1000,
																).format('MMMM D, YYYY h:mm A')}
															>
																<div>
																	{dayjs(
																		card?.updatedAt * 1000,
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

						<div className="action-right">
							<button className="card-change-btn" onClick={handleLeft}>
								<ChevronRightThinSvg className="left-chevron" />
							</button>
							<div className="card-number">
								<span>{currentIndexRef?.current + 1}</span>/
								<span>{aiSuggestedPendingActions?.metaInfo?.totalDocs}</span>
							</div>
							<button className="card-change-btn" onClick={handleRight}>
								<ChevronRightThinSvg />
							</button>
						</div>
					</>
				)
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
		</div>
	);
};

export default memo(ProactiveSuggestions);
