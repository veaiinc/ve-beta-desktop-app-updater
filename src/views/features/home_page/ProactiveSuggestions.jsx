import { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/home_page/proactiveSuggestions.scss';
import Context from '../../../context/context';
const payload = {
	page: 1,
	limit: 20,
};
const ProactiveSuggestions = () => {
	const {
		templates: { getAISuggestedPendingActions, aiSuggestedPendingActions },
	} = useContext(Context);

	const [info, setInfo] = useState({
		totalCardsData: [],
		cards: [],
		activeCardContent: null,
	});
	useEffect(() => {
		if (aiSuggestedPendingActions) {
			setInfo((prev) => ({
				...prev,
				totalCardsData: aiSuggestedPendingActions?.pendingActions,
			}));
		} else {
			getAISuggestedPendingActions(payload);
		}
	}, []);

	useEffect(() => {
		if (aiSuggestedPendingActions) {
			setInfo((prev) => ({
				...prev,
				totalCardsData: aiSuggestedPendingActions?.pendingActions,
			}));
		}
	}, [aiSuggestedPendingActions]);

	const handleCardClick = (card) => {
		setInfo((prev) => ({
			...prev,
			activeCardContent: card,
		}));
	};

	// console.log('info?.totalCardsData', info?.totalCardsData, info?.activeCardContent);
	return (
		<div className="proactive-suggestions-container">
			<div className="cards-container">
				{info?.totalCardsData
					?.filter((card) => card?.researchTopics?.length > 0)
					.map((card) => {
						return (
							<div className="card" onClick={() => handleCardClick(card)}>
								<div className="header">
									<div className="title">{card?.researchTopics?.[0]?.title}</div>
									<div className="description">
										{card?.researchTopics?.[0]?.description}
									</div>
								</div>
								<div className="footer">
									<div className="module-type">{card?.moduleType}</div>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	);
};

export default memo(ProactiveSuggestions);
