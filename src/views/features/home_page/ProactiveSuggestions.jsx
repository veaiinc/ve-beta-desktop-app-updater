import { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/home_page/proactiveSuggestions.scss';
import Context from '../../../context/context';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';

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
		currentIndex: 0,
	});
	useEffect(() => {
		if (aiSuggestedPendingActions) {
			setInfo((prev) => ({
				...prev,
				totalCardsData: aiSuggestedPendingActions?.pendingActions?.filter(
					(card) => card?.researchTopics?.length > 0,
				),
			}));
		} else {
			getAISuggestedPendingActions(payload);
		}
	}, [aiSuggestedPendingActions]);

	useEffect(() => {
		if (info?.totalCardsData?.length > 0) {
			updateWindow(info?.currentIndex);
		}
	}, [info?.totalCardsData, info.currentIndex]);

	function updateWindow(index) {
		const length = info?.totalCardsData?.length;
		const window = [];
		for (let i = 0; i < 5; i++) {
			const current = (index + i) % length;
			window.push({ ...info?.totalCardsData[current], realIndex: current });
		}
		setInfo((prev) => ({
			...prev,
			cards: window,
		}));
	}

	function handleLeft() {
		setInfo((prev) => ({
			...prev,
			currentIndex:
				(prev?.currentIndex - 1 + info?.totalCardsData?.length) %
				info?.totalCardsData?.length,
		}));
	}

	function handleRight() {
		setInfo((prev) => ({
			...prev,
			currentIndex: (prev?.currentIndex + 1) % info?.totalCardsData?.length,
		}));
	}

	const handleCardClick = (card) => {
		setInfo((prev) => ({
			...prev,
			activeCardContent: card,
		}));
	};

	return (
		<div className="proactive-suggestions-container">
			<div className="cards-container">
				{info?.cards?.map((card, index) => {
					const classList = ['card'];
					if (index === 2) classList.push('selected');
					if (index === 1) classList.push('left-1');
					if (index === 0) classList.push('left-2');
					if (index === 3) classList.push('right-1');
					if (index === 4) classList.push('right-2');
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
		</div>
	);
};

export default memo(ProactiveSuggestions);
