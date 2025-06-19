import { useContext, useState, useEffect, useCallback } from 'react';
import Context from '../../../context/context';
import InfiniteScroll from './InfiniteScroll';
import '../../../assets/scss/globalComponents/promptWidget.scss';
import Skeleton from 'react-loading-skeleton';
import ChatBox from '../chat/ChatBox';

const skeletonLoaders = [1, 2, 3, 4];

const PromptsWidget = ({ option }) => {
	const {
		templates: {
			aiSuggestedPendingActions,
			getAISuggestedPendingActions,
			updateStateValues,
			currentSessionId,
		},
	} = useContext(Context);

	const [animateCards, setAnimateCards] = useState(false);

	useEffect(() => {
		if (option) {
			const page = 1;
			const shouldReset = true;
			getUpdatedSuggestedPendingActions(page, shouldReset);
			setTimeout(() => {
				setAnimateCards(true); // Start card animations
			}, 100);
		}
	}, []);

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

	const cardsData = aiSuggestedPendingActions?.pendingActions;
	const cardsLoading = aiSuggestedPendingActions ? false : true;
	const cardsEmpty = cardsData?.length === 0 && !cardsLoading;
	const cardsLength = cardsData?.length ?? 0;
	const cardsHasNextPage = Boolean(aiSuggestedPendingActions?.metaInfo?.hasNextPage);
	const cardsCurrentPage = Number(aiSuggestedPendingActions?.metaInfo?.currentPage) || 1;

	// Indices of cards to animate with dealing effect (4th, 5th, 8th, 10th, 12th)
	const animatedIndices = [3, 4, 7, 9, 11];

	return (
		<>
			<div
				className="prompts-widget"
				style={{ height: cardsData?.length > 0 ? '93vh' : '300px' }}
			>
				{cardsEmpty ? (
					<div className="prompts-widget-empty">
						<div className="prompts-widget-empty-title">No prompts found</div>
					</div>
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
										animateCards
											? animatedIndices.includes(index)
												? `deal-animate deal-path-${animatedIndices.indexOf(
														index,
												  )}`
												: 'slide-animate'
											: ''
									}`}
								>
									<div className="promptsCardTitle">{card?.title}</div>
									{/* <div className="promptsCardDescription">{card?.description}</div> */}
								</div>
							))}
						</div>
					</InfiniteScroll>
				)}
			</div>
			<div className="chatbox-container">
				<ChatBox
					onSend={handleCustomOnSendFunction}
					customChatActions={true}
					autoFocus={false}
					animatePlaceholder={true}
					onChatQueryChange={handleChatQueryChange}
				/>
			</div>
		</>
	);
};

export default PromptsWidget;
