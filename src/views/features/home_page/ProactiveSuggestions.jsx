import { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/home_page/proactiveSuggestions.scss';
import Context from '../../../context/context';
import AISuggestionsPopup from '../../components/modalsV2/homePage/AISuggestionsPopup';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';

const payload = {
	page: 1,
	limit: 20,
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
		const totalCardsData = cards?.slice(0, 5);
		if (cards?.length > 0) {
			setInfo((prev) => ({
				...prev,
				totalCardsData,
			}));
		} else {
			handleUpdateOptions('proactiveSuggestions');
		}
	};

	const updateWindow = (index) => {
		const length = info?.totalCardsData?.length;
		const cards = info?.totalCardsData?.map((card, i) => {
			// Calculate relative position to current index
			let relativeIndex = (i - index + length) % length;

			// Normalize for left wraparound
			if (relativeIndex > 2) relativeIndex -= length;

			return {
				...card,
				realIndex: i,
				position: relativeIndex, // -2 (left-2) to +2 (right-2)
			};
		});

		setInfo((prev) => ({
			...prev,
			cards,
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
				{info?.cards?.map((card) => {
					const classList = ['card'];
					switch (card.position) {
						case 0:
							classList.push('selected');
							break;
						case -1:
							classList.push('left-1');
							break;
						case -2:
							classList.push('left-2');
							break;
						case 1:
							classList.push('right-1');
							break;
						case 2:
							classList.push('right-2');
							break;
						default:
							return null; // hide any cards beyond this window
					}

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
