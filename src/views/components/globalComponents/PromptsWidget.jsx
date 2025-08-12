import { useContext, useState, useEffect, useRef } from 'react';
import Context from '../../../context/context';
// import InfiniteScroll from './InfiniteScroll';
import '../../../assets/scss/globalComponents/promptWidget.scss';
// import ChatBox from '../chat/ChatBox';
// import Suggestions from '../../features/homePage/Suggestions';
import Skeleton from 'react-loading-skeleton';
import { message } from '../../components/globalComponents/CustomToast';
import { getRelativeDayLabel } from '../../../helpers';
import AmbientAiModal from '../modalsV2/homePage/AmbientAiModal';

const skeletonLoaders = [1, 2, 3, 4];

const PriorityLevel = {
	High: 'red',
	Medium: 'yellow',
	Low: 'green',
};
const PromptsWidget = ({ option, currentIndex, searchQuery }) => {
	const cardsPerView = 4; // Number of cards to show at a time
	const cardWidth = 226; // Card width (216px) + margin-right (10px)
	const containerRef = useRef(null);

	const {
		templates: {
			aiSuggestedPendingActions,
			getAISuggestedPendingActions,
			pendingActionsUpdate,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		animateCards: false,
		chatQuery: '',
		cardsLoading: false,
		selectedCard: null,
		openSuggestionsModal: false,
	});

	const cardsData = aiSuggestedPendingActions?.pendingActions;
	const cardsLoading = aiSuggestedPendingActions ? false : true;
	const cardsEmpty = aiSuggestedPendingActions?.pendingActions?.length === 0 && !cardsLoading;
	const cardsLength = aiSuggestedPendingActions?.pendingActions?.length ?? 0;
	const cardsHasNextPage = Boolean(aiSuggestedPendingActions?.metaInfo?.hasNextPage);
	const cardsCurrentPage = Number(aiSuggestedPendingActions?.metaInfo?.currentPage) || 1;

	useEffect(() => {
		if (option) {
			// Reset animateCards to false to allow animation to retrigger
			setInfo((prev) => ({
				...prev,
				animateCards: false,
				cardsLoading: true,
			}));

			const page = 1;
			const shouldReset = true;

			// Fetch new data
			getUpdatedSuggestedPendingActions(page, shouldReset).then(() => {
				// After data is fetched, trigger animation
				setInfo((prev) => ({
					...prev,
					animateCards: true,
					cardsLoading: false,
				}));
			});
		}
	}, [option]);

	useEffect(() => {
		if (containerRef.current && cardsData) {
			const scrollPosition = currentIndex * cardWidth - (934 - 216) / 2; // Center the current card
			containerRef.current.scrollTo({
				left: scrollPosition,
				behavior: 'smooth',
			});
			// Focus the container to allow keydown events
			// containerRef.current.focus();
		}
	}, [currentIndex, cardsData]);

	const handlePromptClick = (card) => {
		setInfo((prev) => ({
			...prev,
			openSuggestionsModal: true,
			selectedCard: card,
		}));
	};
	// Add keydown event listener for Enter key
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const handleKeyDown = (e) => {
			if (e.key === 'Enter' && cardsData && cardsData[currentIndex]) {
				e.preventDefault(); // Prevent default behavior
				handlePromptClick(cardsData[currentIndex]); // Open modal for currentIndex card
			}
		};

		container.addEventListener('keydown', handleKeyDown);
		return () => {
			container.removeEventListener('keydown', handleKeyDown);
		};
	}, [cardsData, currentIndex]);

	const getUpdatedSuggestedPendingActions = async (page = 1, shouldReset = false) => {
		await getAISuggestedPendingActions(
			{
				page: page,
				limit: 20,
				sortBy: 'createdAt',
				sortType: -1,
				insightType: option,
			},
			shouldReset,
		);
	};

	const handleFavouriteClick = async (id) => {
		const card = cardsData?.find((c) => c?._id === id);
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

	// Indices of cards to animate with dealing effect (4th, 5th, 8th, 10th, 12th)
	const animatedIndices = [];

	return (
		<>
			<div
				className="prompts-widget"
				//  style={{ height: '100%' }}
			>
				{info?.cardsLoading ? (
					<div className="prompts-widget-cards-loading">
						{skeletonLoaders?.map((item) => (
							<Skeleton key={item} height={'223px'} width={'216px'} />
						))}
					</div>
				) : cardsEmpty ? (
					<div
						className={`prompts-widget-cards-loading ${
							cardsEmpty ? 'prompts-widget-empty' : ''
						}`}
					>
						No results found
					</div>
				) : (
					<div className="prompts-widget-cards" ref={containerRef} tabIndex={0}>
						{cardsData?.map((card, index) => (
							<div
								key={card?._id}
								className={`prompts-widget-each-card ${
									info.animateCards
										? animatedIndices.includes(index)
											? `deal-animate deal-path-${animatedIndices.indexOf(
													index,
											  )}`
											: 'slide-animate'
										: ''
								} ${currentIndex === index ? 'selected-card' : ''}`}
								onClick={() => handlePromptClick(card)}
							>
								<div className="promptsCardTitle">{card?.title}</div>
								<div className="promptsCardDetails">
									<span className="promptsCardDetailsModuleType">
										{card?.moduleType.toLowerCase() === 'chat_message'
											? 'Chat'
											: card?.moduleType}
									</span>
									<span className="promptsCardDetailsPriority">
										<span className="promptsCardDetailsPriorityValue">
											<span
												className="promptsCardDetailsPriorityValueIcon"
												style={{
													backgroundColor: PriorityLevel[card?.priority],
												}}
											></span>
											{card?.priority}
										</span>
										<span className="promptsCardDetailsPriorityIcon"></span>
										<span className="promptsCardDetailsPriorityDate">
											{getRelativeDayLabel(card?.updatedAt)}
										</span>
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
			<AmbientAiModal
				open={info?.openSuggestionsModal}
				onClose={() => setInfo((prev) => ({ ...prev, openSuggestionsModal: false }))}
				data={info?.selectedCard}
				totalDocs={aiSuggestedPendingActions?.metaInfo?.totalDocs}
				onFavouriteClick={handleFavouriteClick}
				shouldShowCards={false}
			/>
		</>
	);
};

export default PromptsWidget;
