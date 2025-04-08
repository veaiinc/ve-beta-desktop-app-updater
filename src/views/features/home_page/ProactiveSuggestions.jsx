import { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/home_page/proactiveSuggestions.scss';
import Context from '../../../context/context';
import AISuggestionsPopup from '../../components/modalsV2/homePage/AISuggestionsPopup';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';

const payload = {
	page: 1,
	limit: 20,
	sortBy: 'createdAt',
	sortOrder: '-1',
};
const ProactiveSuggestions = ({ handleUpdateOptions }) => {
	const {
		templates: { getAISuggestedPendingActions, aiSuggestedPendingActions },
	} = useContext(Context);

	const [info, setInfo] = useState({
		totalCardsData: [],
		cards: [],
		activeCardContent: null,
		openPopup: false,
		currentIndex: 0,
	});
	useEffect(() => {
		if (aiSuggestedPendingActions) {
			updateCardsData();
		} else {
			getAISuggestedPendingActions(payload);
		}
	}, [aiSuggestedPendingActions]);

	useEffect(() => {
		if (info?.totalCardsData?.length > 0) {
			updateWindow(info?.currentIndex);
		}
	}, [info?.totalCardsData, info.currentIndex]);

	const updateCardsData = () => {
		const cards = aiSuggestedPendingActions?.pendingActions?.filter(
			(card) => card?.researchTopics?.length > 0,
		);
		if (cards?.length > 0) {
			setInfo((prev) => ({
				...prev,
				totalCardsData: cards,
			}));
		} else {
			handleUpdateOptions('proactiveSuggestions');
		}
	};

	const updateWindow = (index) => {
		const length = info?.totalCardsData?.length || 0;
		const window = [];
		const windowSize = Math.min(5, length); // adjust size to available cards

		for (let i = 0; i < windowSize; i++) {
			const current = (index + i) % length;
			window.push({ ...info?.totalCardsData[current], realIndex: current });
		}

		setInfo((prev) => ({
			...prev,
			cards: window,
		}));
	};

	const handleLeft = () => {
		setInfo((prev) => ({
			...prev,
			currentIndex:
				(prev?.currentIndex - 1 + info?.totalCardsData?.length) %
				info?.totalCardsData?.length,
		}));
	};

	const handleRight = () => {
		setInfo((prev) => ({
			...prev,
			currentIndex: (prev?.currentIndex + 1) % info?.totalCardsData?.length,
		}));
	};

	const handleCardClick = (card) => {
		setInfo((prev) => ({
			...prev,
			activeCardContent: card,
			openPopup: true,
		}));
	};

	return (
		<div className="proactive-suggestions-container">
			<div className="cards-container">
				{info?.cards?.map((card, index) => {
					const classList = ['card'];
					const cardCount = info?.cards?.length;
					const middleIndex = Math.floor(cardCount / 2);
					const offset = index - middleIndex;

					if (offset === 0) classList.push('selected');
					else if (offset === -1) classList.push('left-1');
					else if (offset === -2) classList.push('left-2');
					else if (offset === 1) classList.push('right-1');
					else if (offset === 2) classList.push('right-2');
					return (
						<div
							key={card?.realIndex}
							className={classList.join(' ')}
							onClick={() => handleCardClick(card)}
						>
							<div className="header">
								<div className="card-title">{card?.researchTopics?.[0]?.title}</div>
								<div className="card-description">
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
			<div className="action-container">
				<div className="action-left"></div>
				<div className="action-right">
					<button className="card-change-btn" onClick={handleLeft}>
						<ChevronRightThinSvg className="left-chevron" />
					</button>
					<button className="card-change-btn" onClick={handleRight}>
						<ChevronRightThinSvg />
					</button>
				</div>
			</div>
			<AISuggestionsPopup
				open={info?.openPopup}
				closeModal={() => setInfo((prev) => ({ ...prev, openPopup: false }))}
				data={info?.activeCardContent}
			/>
		</div>
	);
};

export default memo(ProactiveSuggestions);
