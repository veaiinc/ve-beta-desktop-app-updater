import { memo, useContext, useEffect, useRef, useState, useMemo, useCallback } from 'react';
import '../../../assets/scss/home_page/proactiveSuggestions.scss';
import Context from '../../../context/context';
// import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as FilterIcon } from '../../../assets/svg/tasks/newFiltersIcon.svg';
import { ReactComponent as TickIcon } from '../../../assets/svg/tick.svg';
import { ReactComponent as CloseIcon } from '../../../assets/svg/close.svg';
import { ReactComponent as ThumbsUpSvg } from '../../../assets/svg/thumbsUp.svg';
import { ReactComponent as EmailIcon } from '../../../assets/svg/login_page/gmail.svg';
import Skeleton from 'react-loading-skeleton';
import AISuggestionsModal from '../../components/modalsV2/homePage/AISuggestionsModal';
import { Tooltip } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import InfiniteScroll from '../../components/globalComponents/InfiniteScroll';
import { ReactComponent as AiSuggestionIcon } from '../../../assets/svg/home_page/aiSuggestion.svg';
import { message } from '../../components/globalComponents/CustomToast';
import ObjectID from 'bson-objectid';
import { useNavigate } from 'react-router-dom';
import { handleCombinedChainOfThought } from '../../../helpers/chatHelpers';
import { ReactComponent as RelativeTimeSvg } from '../../../assets/svg/home_page/relativeTime.svg';
import { ReactComponent as BookIcon } from '../../../assets/svg/home_page/bookIcon.svg';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
	relativeTime: {
		future: 'in %s',
		past: '%s ago',
		s: '%d sec',
		m: '1 min',
		mm: '%d min',
		h: '1 hr',
		hh: '%d hr',
		d: '1 day',
		dd: '%d days',
		M: '1 month',
		MM: '%d months',
		y: '1 year',
		yy: '%d years',
	},
});

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
			{ id: 2, title: 'High Priority', value: 'High' },
			{ id: 3, title: 'Medium Priority', value: 'Medium' },
			{ id: 4, title: 'Low Priority', value: 'Low' },
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
];

const infiniteScrollStyle = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	alignSelf: 'stretch',
	gap: '8px',
	paddingBottom: '40px',
};

const skeletonLoaders = Array.from({ length: 7 }, (_, index) => index + 1);
const ProactiveSuggestions = ({ selectedOption }) => {
	const {
		templates: {
			getAISuggestedPendingActions,
			aiSuggestedPendingActions,
			pendingActionsUpdate,
			updateStateValues,
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
	});
	const navigate = useNavigate();
	const selectedOptionRef = useRef(selectedOption);
	const currentIndexRef = useRef(0);
	const totalCardsDataRef = useRef([]);
	const isMountedRef = useRef(true);

	useEffect(() => {
		selectedOptionRef.current = selectedOption;
	}, [selectedOption]);

	useEffect(() => {
		if (aiSuggestedPendingActions) {
			updateCardsData();
		}
	}, [aiSuggestedPendingActions]);

	useEffect(() => {
		window?.addEventListener('keydown', handleKeyDown);

		// Clean up on unmount
		return () => {
			window?.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	useEffect(() => {
		if (info?.totalCardsData?.length > 0) {
			updateWindow(info?.currentIndex);
		}
	}, [info?.totalCardsData, info.currentIndex]);

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

		const { from, to } = getDateRangeFromFilters(info?.selectedFilters);

		return {
			...payload,
			...(selectedPriority.length && { priority: selectedPriority }),
			...(selectedReadStatus.length && { read: selectedReadStatus }),
			...(selectedConfidenceScore.length && { confidenceScore: selectedConfidenceScore }),
			...(from !== undefined && to !== undefined && { from, to }),
		};
	}, [payload, info?.selectedFilters]);

	useEffect(() => {
		if (!info?.selectedFilters) return;
		if (
			aiSuggestedPendingActions?.metaInfo?.currentPage === 1 &&
			info?.selectedFilters?.length === 0 &&
			isMountedRef.current
		) {
			isMountedRef.current = false;
			return;
		}
		getAISuggestedPendingActions(newUpdatedPayload);
	}, [info?.selectedFilters]);

	const updateCardsData = () => {
		const cards = aiSuggestedPendingActions?.pendingActions?.filter(
			(card) => card?.title?.length > 0,
		);

		const isPagination = aiSuggestedPendingActions?.metaInfo?.currentPage > 1;

		if (cards?.length > 0) {
			const updatedCards = isPagination
				? [...totalCardsDataRef.current, ...cards]
				: [...cards];

			totalCardsDataRef.current = updatedCards;

			setInfo((prev) => ({
				...prev,
				totalCardsData: updatedCards,
				loading: false,
			}));
		} else {
			setInfo((prev) => ({
				...prev,
				loading: false,
				totalCardsData: [],
				cards: [],
			}));
		}
	};

	const handleKeyDown = (e) => {
		if (e?.key === 'ArrowLeft') {
			handleLeft();
		} else if (e?.key === 'ArrowRight') {
			handleRight();
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
		const isLastCard = currentIndexRef.current === totalCardsDataRef.current.length - 2;

		if (isLastCard) {
			if (aiSuggestedPendingActions?.metaInfo?.hasNextPage) {
				const nextPage = aiSuggestedPendingActions.metaInfo.currentPage + 1;

				const filters = info.selectedFilters || [];

				const selectedPriority = filters
					?.filter((f) => f.group === 'Priority Level')
					.map((f) => f.value || f.title);

				const selectedReadStatus = filters
					?.filter((f) => f.group === 'Read Status')
					.map((f) => f.value || f.title);

				const selectedConfidenceScore = filters
					?.filter((f) => f.group === 'Confidence level')
					.map((f) => f.value || f.title);

				const { from, to } = getDateRangeFromFilters(filters);

				const filterPayload = {
					page: nextPage,
					...(selectedPriority?.length > 0 && { priority: selectedPriority }),
					...(selectedReadStatus?.length > 0 && { read: selectedReadStatus }),
					...(selectedConfidenceScore?.length > 0 && {
						confidenceScore: selectedConfidenceScore,
					}),
					...(from !== undefined && to !== undefined && { from, to }),
				};

				const newPayload = {
					...payload,
					...filterPayload,
				};

				await getAISuggestedPendingActions(newPayload);
				return;
			} else {
				const index = 0;
				setInfo((prev) => ({
					...prev,
					currentIndex: index,
					activeCardContent: totalCardsDataRef.current[index],
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
	const fetchMorePendingActions = async () => {
		const nextPage = aiSuggestedPendingActions.metaInfo.currentPage + 1;

		const filters = info.selectedFilters || [];

		const selectedPriority = filters
			?.filter((f) => f.group === 'Priority Level')
			.map((f) => f.value || f.title);

		const selectedReadStatus = filters
			?.filter((f) => f.group === 'Read Status')
			.map((f) => f.value || f.title);

		const selectedConfidenceScore = filters
			?.filter((f) => f.group === 'Confidence level')
			.map((f) => f.value || f.title);

		const { from, to } = getDateRangeFromFilters(filters);

		const filterPayload = {
			page: nextPage,
			...(selectedPriority?.length > 0 && { priority: selectedPriority }),
			...(selectedReadStatus?.length > 0 && { read: selectedReadStatus }),
			...(selectedConfidenceScore?.length > 0 && {
				confidenceScore: selectedConfidenceScore,
			}),
			...(from !== undefined && to !== undefined && { from, to }),
		};

		const newPayload = {
			...payload,
			...filterPayload,
		};

		await getAISuggestedPendingActions(newPayload);
	};

	const handleThumbClick = async (id, type) => {
		const card = info?.cards?.find((c) => c._id === id);
		if (card?.feedback === type) return;
		const res = await pendingActionsUpdate(id, { feedback: type });
		if (res?.[0] === true) {
			setInfo((prevInfo) => ({
				...prevInfo,
				cards: prevInfo?.cards?.map((card) =>
					card._id === id ? { ...card, feedback: type } : card,
				),
			}));
			message.success('Updated the feedback');
		} else {
			message.error('Failed to update feedback');
		}
	};

	const handleIgnoreClick = async (id) => {
		const card = info?.cards?.find((c) => c?._id === id);
		if (card?.isIgnored === true) return;
		const res = await pendingActionsUpdate(id, { isIgnored: true });
		if (res?.[0] === true) {
			setInfo((prevInfo) => ({
				...prevInfo,
				cards: prevInfo?.cards?.map((card) =>
					card?._id === id ? { ...card, isIgnored: true } : card,
				),
			}));
			message?.success('Card IgnoredSuccessfully');
		} else {
			message?.success('Failed to updated he card status');
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
		navigate(`/chat/${ObjectID()?.toString()}`);
	}, []);
	return (
		<div className="proactive-suggestions-container">
			<div className="action-container">
				<div className="suggestionPromptContainer">
					<AiSuggestionIcon />
					<div className="suggestionPrompt">
						timely suggestions—helping you act smartly before issues arise.
					</div>
				</div>
				<div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
					<Tooltip
						open={info?.openFilter}
						onOpenChange={() => setInfo((prev) => ({ ...prev, openFilter: false }))}
						placement="top"
						title={
							<div className="filter-container">
								<div className="filter-items">
									{filterGroups.map((group, idx) => (
										<div key={group.title} style={{ width: '100%' }}>
											<div className="filter-item">
												<div className="filter-item-title">
													{group.title}
												</div>
												<div className="filter-item-options">
													{group.options.map((item) => {
														const itemWithGroup = {
															...item,
															group: group.title,
														};

														const isSelected =
															info?.selectedFilters?.some(
																(option) =>
																	option?.title ===
																		itemWithGroup.title &&
																	option?.group ===
																		itemWithGroup.group,
															);
														return (
															<div
																key={item.id}
																className="eachOption"
																onClick={() =>
																	handleFilterClick(
																		itemWithGroup,
																		group?.title,
																	)
																}
																style={{
																	display: 'flex',
																	justifyContent: 'space-between',
																	alignItems: 'center',
																}}
															>
																<span>{item.title}</span>
																{isSelected && (
																	<TickIcon
																		style={{
																			marginLeft: '8px',
																		}}
																	/>
																)}
															</div>
														);
													})}
												</div>
											</div>
											{idx < filterGroups.length - 1 && (
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
					>
						<div
							className="action-left"
							onClick={() => setInfo((prev) => ({ ...prev, openFilter: true }))}
						>
							<button className="filter-btn" style={{ cursor: 'pointer' }}>
								Filters <FilterIcon />
							</button>
						</div>
					</Tooltip>
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
			<div className="proactiveSuggestionsContainer">
				{info?.loading ? (
					skeletonLoaders?.map((_, index) => (
						<Skeleton
							width="908px"
							height="120px"
							style={{
								'--highlight-color': 'gray',
								'--base-color': 'transparent',
							}}
							key={index}
						/>
					))
				) : info?.cards?.length === 0 ? (
					<div className="no-data" style={{ color: 'var(--primary-font)' }}>
						No data available
					</div>
				) : (
					<InfiniteScroll
						dataLength={info?.cards?.length}
						hasMore={aiSuggestedPendingActions?.metaInfo?.hasNextPage}
						next={fetchMorePendingActions}
						style={infiniteScrollStyle}
						height={'100%'}
					>
						{info?.cards?.map((card, index) => {
							const priority = card?.priority;
							const isRead = card?.read;
							return (
								<div
									className="eachCardContainer"
									key={card?._id}
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
									onClick={() => handleCardClick(card, index)}
								>
									<Tooltip
										title={
											<div className="tooltipContainer">
												<span>{card?.title}</span> {card?.description}
											</div>
										}
										placement="bottomLeft"
										arrow={false}
									>
										<div className="cardContianerTitle">
											{!isRead && <span className="unread"></span>}
											<span>{card?.title} - </span>
											{card?.description}
										</div>
									</Tooltip>
									<div
										className={`cardOptionsMainContainer ${
											info?.hoveredCard?._id === card?._id
												? 'linearBorder'
												: ''
										}`}
									>
										<div className="cardOptionsContainer ">
											{priority && (
												<>
													<div className="priorityOption">
														<Tooltip title={`Priority: ${priority}`}>
															<div className="priority">
																<div
																	className="indicator"
																	style={{
																		background:
																			priority === 'High'
																				? 'red'
																				: priority ===
																				  'Medium'
																				? 'orange'
																				: 'green',
																	}}
																></div>
																<div className="priority-text">{`${priority}`}</div>
															</div>
														</Tooltip>
													</div>
													<div className="verticalLine"></div>
												</>
											)}
											<div
												className={`${
													card?.feedback === 'thumbsup'
														? 'thumbsUpContainer'
														: ''
												}`}
												onClick={(e) => {
													e.stopPropagation();
													handleThumbClick(card?._id, 'thumbsup');
												}}
												style={{ cursor: 'pointer' }}
											>
												<BookIcon
													style={{
														color: `${
															card?.feedback === 'thumbsup'
																? 'var(--primary-font)'
																: 'var(--secondary-font)'
														}`,
													}}
												/>
											</div>
											<div className="verticalLine"></div>
											<div style={{ fontSize: '12px' }}>
												{card?.confidence_score * 100} %
											</div>
											<div className="verticalLine"></div>
											<div>
												<EmailIcon width={16} height={12} />
											</div>
											<div className="verticalLine"></div>
											<div className="relativeTime">
												<RelativeTimeSvg />
												{dayjs(card?.updatedAt * 1000).fromNow()}
											</div>
										</div>
										{info?.hoveredCard?._id === card?._id && (
											<div className="cardButtonsContainer">
												<button
													className="skipButton"
													onClick={(e) => {
														e.stopPropagation();
														handleIgnoreClick(card?._id);
													}}
												>
													Ignore
												</button>
												<button
													className="checkButton"
													onClick={(e) => {
														e.stopPropagation();
														handleViewReportClick(card);
													}}
												>
													View Report
												</button>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</InfiniteScroll>
				)}
			</div>
			<AISuggestionsModal
				open={info?.openModal}
				onClose={handleCloseModal}
				data={info?.activeCardContent}
				onNextCardClick={handleRight}
				onPrevCardClick={handleLeft}
				totalDocs={aiSuggestedPendingActions?.metaInfo?.totalDocs}
				selectedCardNumber={info?.selectedCardNumber}
			/>
		</div>
	);
};

export default memo(ProactiveSuggestions);
