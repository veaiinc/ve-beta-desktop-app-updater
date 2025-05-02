import { memo, useContext, useEffect, useRef, useState, useMemo } from 'react';
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
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

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

const PriorityLevel = {
	High: 'red',
	Medium: 'yellow',
	Low: 'green',
};
const ProactiveSuggestions = ({ selectedOption }) => {
	const {
		templates: {
			getAISuggestedPendingActions,
			aiSuggestedPendingActions,
			pendingActionsUpdate,
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
	});

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
			selectedCardNumber: index + 1,
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
			selectedCardNumber: info?.currentIndex,
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

	return (
		<div className="proactive-suggestions-container">
			<div className="cards-container">
				{info?.loading ? (
					[
						{ position: 0 },
						{ position: 1 },
						{ position: 2 },
						{ position: -1 },
						{ position: -2 },
					]?.map((item, index) => {
						const classList = ['card', 'skeleton', positionClassMap[item.position]];
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
					info.cards.map((card, index) => {
						if (card.position === null) return null;
						const classList = ['card', positionClassMap[card.position]];
						return (
							<div
								key={card?._id}
								className={classList.join(' ')}
								onClick={() => handleCardClick(card, index)}
							>
								<div className="header">
									<div className="card-title">{card?.description}</div>
									<div className="card-description">{card?.title}</div>
								</div>
								<div className="footer">
									<div className="module-type">{card?.moduleType}</div>
									<div className="module-priority">
										<span
											style={{
												backgroundColor: PriorityLevel[card?.priority],
											}}
										></span>
										<div className="module-priority-text">
											<div>{card?.priority}</div>
											{card?.priority && card?.updatedAt && (
												<div style={{ color: 'var(--secondary-font)' }}>
													|
												</div>
											)}
											<Tooltip
												title={dayjs(card?.updatedAt * 1000).format(
													'MMMM D, YYYY h:mm A',
												)}
											>
												<div>{dayjs(card?.updatedAt * 1000).fromNow()}</div>
											</Tooltip>
										</div>
									</div>
								</div>
							</div>
						);
					})
				)}
			</div>
			<div className="action-container">
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
				</div>
				{info?.cards?.length > 5 && (
					<div className="action-right">
						<button className="card-change-btn" onClick={handleLeft}>
							<ChevronRightThinSvg className="left-chevron" />
						</button>
						<button className="card-change-btn" onClick={handleRight}>
							<ChevronRightThinSvg />
						</button>
					</div>
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
