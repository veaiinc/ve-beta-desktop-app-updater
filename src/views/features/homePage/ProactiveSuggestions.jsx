import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import '../../../assets/scss/home_page/proactiveSuggestions.scss';
import Context from '../../../context/context';
import AISuggestionsPopup from '../../components/modalsV2/homePage/AISuggestionsPopup';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import Skeleton from 'react-loading-skeleton';
import AISuggestionsModal from '../../components/modalsV2/homePage/AISuggestionsModal';

const payload = {
	page: 1,
	limit: 20,
	sortBy: 'createdAt',
	sortOrder: '-1',
};
const positionClassMap = {
	0: 'selected',
	1: 'right-1',
	2: 'right-2',
	'-1': 'left-1',
	'-2': 'left-2',
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
	});

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

	const updateCardsData = () => {
		const cards = aiSuggestedPendingActions?.pendingActions?.filter(
			(card) => card?.title?.length > 0,
		);
		if (cards?.length > 0) {
			totalCardsDataRef.current = cards;
			setInfo((prev) => ({
				...prev,
				totalCardsData: cards,
				loading: false,
			}));
		} else {
			totalCardsDataRef.current = [];
			setInfo((prev) => ({
				...prev,
				totalCardsData: [],
				loading: false,
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

	const handleRight = () => {
		const index = (currentIndexRef.current + 1) % totalCardsDataRef.current?.length;
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
					: info?.cards?.map((card, index) => {
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
									</div>
								</div>
							);
					  })}
			</div>
			{info?.cards?.length > 5 && (
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
			)}

			<AISuggestionsModal
				open={info?.openModal}
				onClose={handleCloseModal}
				data={info?.activeCardContent}
				onNextCardClick={handleRight}
				onPrevCardClick={handleLeft}
			/>
		</div>
	);
};

export default memo(ProactiveSuggestions);
