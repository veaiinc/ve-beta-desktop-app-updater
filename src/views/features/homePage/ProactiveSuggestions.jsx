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

dayjs.extend(relativeTime);

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
];

const PriorityLevel = {
	High: 'red',
	Medium: 'yellow',
	Low: 'green',
};
const ProactiveSuggestions = ({ selectedOption }) => {
	const {
		templates: { getAISuggestedPendingActions, aiSuggestedPendingActions },
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
	});

	const selectedPriority =
		info?.selectedFilters?.filter((f) => f?.group === 'Priority Level').map((f) => f?.value) ||
		[];

	const selectedReadStatus =
		info?.selectedFilters
			?.filter((f) => f?.group === 'Read Status' && f?.title !== 'All')
			.map((f) => f?.value) || [];

	const selectedConfidenceScore =
		info?.selectedFilters
			?.filter((f) => f?.group === 'Confidence level')
			.map((f) => f?.value) || [];

	const selectedOptionRef = useRef(selectedOption);
	const currentIndexRef = useRef(0);
	const totalCardsDataRef = useRef([]);

	useEffect(() => {
		selectedOptionRef.current = selectedOption;
	}, [selectedOption]);

	useEffect(() => {
		if (aiSuggestedPendingActions) {
			updateCardsData();
		} else {
			getAISuggestedPendingActions(payload);
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

	const newUpdatedPayload = useMemo(() => {
		return {
			...payload,
			...(selectedPriority.length && { priority: selectedPriority }),
			...(selectedReadStatus.length && { read: selectedReadStatus }),
			...(selectedConfidenceScore.length && { confidenceScore: selectedConfidenceScore }),
		};
	}, [payload, selectedPriority, selectedReadStatus, selectedConfidenceScore]);
	useEffect(() => {
		if (!info?.selectedFilters) return;

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
		}));
		currentIndexRef.current = index;
	};

	const handleRight = async () => {
		const isLastCard = currentIndexRef.current === totalCardsDataRef.current.length - 2;

		if (isLastCard) {
			if (aiSuggestedPendingActions?.metaInfo?.hasNextPage) {
				const nextPage = aiSuggestedPendingActions.metaInfo.currentPage + 1;

				// Extract selected filters
				const selectedPriority = info.selectedFilters
					?.filter((f) => f.group === 'Priority Level')
					.map((f) => f.value || f.title);

				const selectedReadStatus = info.selectedFilters
					?.filter((f) => f.group === 'Read Status')
					.map((f) => f.value || f.title);

				const filterPayload = {
					page: nextPage,
					...(selectedPriority?.length > 0 && { priority: selectedPriority }),
					...(selectedReadStatus?.length > 0 && { read: selectedReadStatus }),
				};

				// Merge with base payload
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
		}));
		currentIndexRef.current = index;
	};

	const handleCardClick = (card, index) => {
		setInfo((prev) => ({
			...prev,
			activeCardContent: card,
			openModal: true,
			currentIndex: index,
		}));
		currentIndexRef.current = index;
	};

	const handleCloseModal = () =>
		setInfo((prev) => ({ ...prev, openModal: false, activeCardContent: null }));

	const handleFilterClick = (item) => {
		setInfo((prev) => {
			const isSelected = prev.selectedFilters.some(
				(option) =>
					option.id === item.id &&
					option.title === item.title &&
					option.group === item.group,
			);

			let updatedFilters;

			if (isSelected) {
				// Remove this item from selectedFilters
				updatedFilters = prev.selectedFilters.filter(
					(option) =>
						!(
							option.id === item.id &&
							option.title === item.title &&
							option.group === item.group
						),
				);
			} else {
				// Add this item to selectedFilters
				updatedFilters = [...prev.selectedFilters, item];
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
											<div style={{ color: 'var(--secondary-font)' }}>|</div>
											<div>{dayjs(card?.updatedAt * 1000).fromNow()}</div>
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
																	handleFilterClick(itemWithGroup)
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
										onClick={() => handleFilterClick(item)}
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
			/>
		</div>
	);
};

export default memo(ProactiveSuggestions);
