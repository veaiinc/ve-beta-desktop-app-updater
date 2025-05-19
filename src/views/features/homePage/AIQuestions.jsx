import { memo, useContext, useMemo, useState, useEffect } from 'react';
import '../../../assets/scss/home_page/aiQuestions.scss';
import { getRelativeDayLabel } from '../../../helpers';
import AIQuestionsModal from '../../components/modalsV2/homePage/AIQuestionsModal';
import Context from '../../../context/context';

const questions = [];
const AIQuestions = () => {
	const {
		templates: { aiQuestions, getAiQuestions },
	} = useContext(Context);
	const [info, setInfo] = useState({
		selectedCard: null,
		isModalOpen: false,
	});

	useEffect(() => {
		getAiQuestions();
	}, []);

	const handleCardClick = (card) => {
		setInfo((prev) => ({
			...prev,
			selectedCard: card,
			isModalOpen: true,
		}));
	};
	const handleCloseModal = () => {
		setInfo((prev) => ({
			...prev,
			selectedCard: null,
			isModalOpen: false,
		}));
	};
	const groupedCards = useMemo(() => {
		const groups = {};

		questions?.forEach((question) => {
			const label = getRelativeDayLabel(question?.createdAt);
			if (!groups[label]) groups[label] = [];
			groups[label]?.push(question);
		});

		return groups;
	}, []);
	return (
		<div className="ai-questions-container">
			{/* <InfiniteScroll
				dataLength={info?.cards?.length || 0}
				hasMore={aiSuggestedPendingActions?.metaInfo?.hasNextPage}
				next={fetchMorePendingActions}
				style={infiniteScrollStyle}
				height={'100%'}
				endMessage={<div style={{ paddingBottom: '50px' }}></div>}
				className="scrollable-container"
			> */}
			{/* <div style={{ margin: 'auto' }}> */}
			{Object?.entries(groupedCards)?.map(([label, cards], index) => (
				<div key={index} className="groupedQuestionsContainer">
					<div
						className="dateLabel"
						style={{
							marginTop: `${index !== 0 ? '50px' : '0px'}`,
						}}
					>
						{label}
					</div>
					{cards?.map((card, index) => {
						return (
							<div
								className="cardContainer"
								key={index}
								onClick={() => handleCardClick(card, index)}
							>
								<div className="text-container">{card?.question}</div>
							</div>
						);
					})}
				</div>
			))}
			{/* </div> */}
			{/* </InfiniteScroll> */}
			<AIQuestionsModal open={info?.isModalOpen} onClose={handleCloseModal} />
		</div>
	);
};

export default memo(AIQuestions);
