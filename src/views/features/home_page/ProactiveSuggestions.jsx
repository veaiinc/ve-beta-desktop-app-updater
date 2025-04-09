import { memo, useContext, useEffect, useState } from 'react';
import '../../../assets/scss/home_page/proactiveSuggestions.scss';
import Context from '../../../context/context';
import AISuggestionsPopup from '../../components/modalsV2/homePage/AISuggestionsPopup';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import Skeleton from 'react-loading-skeleton';

const payload = {
	page: 1,
	limit: 20,
};
const positionClassMap = {
	0: 'selected',
	1: 'right-1',
	2: 'right-2',
	'-1': 'left-1',
	'-2': 'left-2',
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
		loading: true,
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
				loading: false,
			}));
		} else {
			handleUpdateOptions('proactiveSuggestions');
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
				{info?.loading
					? [
							{ position: 0 },
							{ position: 1 },
							{ position: 2 },
							{ position: -1 },
							{ position: -2 },
					  ]?.map((item) => {
							const classList = ['card', 'skeleton', positionClassMap[item.position]];
							return (
								<div key={item?._id} className={classList.join(' ')}>
									<div
										className="skeleton-container"
										style={{
											width: '100%',
											height: '100%',
											// backgroundColor: 'red',
											borderRadius: '10px',
										}}
									>
										<Skeleton height={'100%'} width={'100%'} />
									</div>
								</div>
							);
					  })
					: info?.cards?.map((card) => {
							if (card.position === null) return null;
							const classList = ['card', positionClassMap[card.position]];
							return (
								<div
									key={card?._id}
									className={classList.join(' ')}
									onClick={() => handleCardClick(card)}
								>
									<div className="header">
										<div className="card-title">
											{card?.researchTopics?.[0]?.title}
										</div>
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
