import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../../context/context';
import InfiniteScroll from './InfiniteScroll';
import '../../../assets/scss/globalComponents/promptWidget.scss';
import ChatBox from '../chat/ChatBox';
import Suggestions from '../../features/homePage/Suggestions';
import Skeleton from 'react-loading-skeleton';
import AISuggestionsModal from '../modalsV2/homePage/AISuggestionsModal';
const skeletonLoaders = [1, 2, 3, 4, 5, 6, 7, 8];

const PromptsWidget = ({ option }) => {
	const {
		templates: {
			aiSuggestedPendingActions,
			getAISuggestedPendingActions,
			updateStateValues,
			currentSessionId,
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

	const getUpdatedSuggestedPendingActions = async (page = 1, shouldReset = false) => {
		await getAISuggestedPendingActions(
			{
				page: page,
				limit: 20,
				sortBy: 'createdAt',
				sortType: -1,
				category: option,
			},
			shouldReset,
		);
	};

	const fetchNextCards = () => {
		if (cardsHasNextPage) {
			const page = cardsCurrentPage + 1;
			const shouldReset = false;
			getUpdatedSuggestedPendingActions(page, shouldReset);
		}
	};

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
	const handlePromptClick = (card) => {
		setInfo((prev) => ({
			...prev,
			openSuggestionsModal: true,
			selectedCard: card,
		}));
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

	const cardsData = aiSuggestedPendingActions?.pendingActions;
	const cardsLoading = aiSuggestedPendingActions ? false : true;
	const cardsEmpty = aiSuggestedPendingActions?.pendingActions?.length === 0 && !cardsLoading;
	const cardsLength = aiSuggestedPendingActions?.pendingActions?.length ?? 0;
	const cardsHasNextPage = Boolean(aiSuggestedPendingActions?.metaInfo?.hasNextPage);
	const cardsCurrentPage = Number(aiSuggestedPendingActions?.metaInfo?.currentPage) || 1;

	// Indices of cards to animate with dealing effect (4th, 5th, 8th, 10th, 12th)
	const animatedIndices = [];

	return (
		<>
			<div
				className="prompts-widget"
				style={{ height: cardsData?.length > 0 ? '93vh' : '10px' }}
			>
				{info?.cardsLoading ? (
					<div className="prompts-widget-cards-loading">
						{skeletonLoaders?.map((item) => (
							<Skeleton key={item} height={'160px'} width={'175px'} />
						))}
					</div>
				) : cardsEmpty ? (
					''
				) : (
					<InfiniteScroll
						hasMore={cardsHasNextPage}
						next={() => fetchNextCards()}
						dataLength={cardsLength}
						loader={<></>}
						height={cardsData?.length > 0 ? '80vh' : '100%'}
						style={{ width: '760px' }}
					>
						<div className="prompts-widget-cards">
							{cardsData?.map((card, index) => (
								<div
									key={card?.id}
									className={`prompts-widget-each-card ${
										info.animateCards
											? animatedIndices.includes(index)
												? `deal-animate deal-path-${animatedIndices.indexOf(
														index,
												  )}`
												: 'slide-animate'
											: ''
									}`}
									onClick={() => handlePromptClick(card)}
								>
									<div className="promptsCardTitle">{card?.title}</div>
									{/* <div className="promptsCardDescription">{card?.description}</div> */}
								</div>
							))}
						</div>
					</InfiniteScroll>
				)}
			</div>
			<div className="prompts-widget-bottom">
				<div className="chatbox-container">
					<ChatBox
						onSend={handleCustomOnSendFunction}
						customChatActions={true}
						autoFocus={false}
						animatePlaceholder={true}
						onChatQueryChange={handleChatQueryChange}
						showUpgradeSubscriptionBtn={false}
					/>
				</div>
				<div className="suggestions-container">
					<Suggestions chatQuery={info?.chatQuery} styles={{ margin: '0 auto' }} />
				</div>
			</div>
			<AISuggestionsModal
				open={info?.openSuggestionsModal}
				onClose={() => setInfo((prev) => ({ ...prev, openSuggestionsModal: false }))}
				data={info?.selectedCard}
				totalDocs={aiSuggestedPendingActions?.metaInfo?.totalDocs}
				// selectedCardNumber={currentIndexRef?.current + 1}
				onFavouriteClick={handleFavouriteClick}
				shouldShowCards={false}
			/>
		</>
	);
};

export default PromptsWidget;
