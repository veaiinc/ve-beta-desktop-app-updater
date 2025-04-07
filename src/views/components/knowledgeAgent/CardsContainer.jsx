import { memo, useCallback, useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../assets/scss/knowledgeAgent/index.scss';
import Context from '../../../context/context';
import Spinner from '../../components/loaders/Spinner';
import { message } from 'antd';
import defaultImage from '../../../assets/svg/agents/agent1.svg';
import { ReactComponent as AgentSvg1 } from '../../../assets/svg/agents/agent1.svg';
import { ReactComponent as FastSvg } from '../../../assets/svg/agents/default.svg';
import { ReactComponent as AgentSvg2 } from '../../../assets/svg/agents/agent2.svg';
import { ReactComponent as searchIconn } from '../../../assets/svg/agents/search.svg';
import { ReactComponent as GreenCardIcon } from '../../../assets/svg/agents/Back.svg';

import fastImage from '../../../assets/svg/agents/default.svg';
import hoverImage from '../../../assets/svg/agents/agent2.svg';
import searchIcon from '../../../assets/svg/agents/search.svg';
import greenCardIcon from '../../../assets/svg/agents/Back.svg';

const defaultCards = [
	{
		title: "Let's launch new",
		subtitle: 'Knowledge Agent',
		type: 'new',
		isDefault: true,
		content: null, // No content for the green card
	},
];
const AGENTS_PER_PAGE = 20; // Assuming 20 is the limit per page

// Card Components
const Card = ({ className, ...props }) => <div className={`${className || ''}`} {...props} />;

const CardContent = ({ className, ...props }) => (
	<div className={`${className || ''}`} {...props} />
);

// Main Component

const CardsContainer = () => {
	const {
		knowledgeAgent: {
			createNewKnowledgeAgent,
			getKnowledgeAssistantsList,
			knowledgeAssistantsList,
		},
	} = useContext(Context);

	const navigate = useNavigate();
	const containerRef = useRef(null);
	const searchInputRef = useRef(null);
	const loadMoreRef = useRef(null);

	const [info, setInfo] = useState({
		aiAssistantsList: [],
		hasNextPage: false,
		currentPage: 1,
		aiAssistantName: 'Untitled Assistant',
		aiAssistantId: null,
		creatingNewAiAssistantLoading: false,
		activeAiAssistant: null,
		loading: true,
	});

	const getMoreAiAssistants = useCallback(() => {
		if (info?.hasNextPage) {
			getKnowledgeAssistantsList(info?.currentPage + 1, 20);
		}
	}, [info?.currentPage, info?.hasNextPage, getKnowledgeAssistantsList]);

	useEffect(() => {
		return () => {
			setInfo((prev) => ({ ...prev, creatingNewAiAssistantLoading: false }));
		};
	}, []);

	useEffect(() => {
		getKnowledgeAssistantsList();
	}, []);

	useEffect(() => {
		if (knowledgeAssistantsList) {
			setInfo((prev) => ({
				...prev,
				aiAssistantsList:
					knowledgeAssistantsList?.currentPage === 1
						? [...(knowledgeAssistantsList?.data || [])]
						: [
								...(info?.aiAssistantsList || []),
								...(knowledgeAssistantsList?.data || []),
						  ],
				hasNextPage: knowledgeAssistantsList?.hasNextPage,
				currentPage: knowledgeAssistantsList?.currentPage,
				loading: false,
			}));
		}
	}, [knowledgeAssistantsList]);

	// Add scroll handler for horizontal infinite scroll
	const handleScroll = useCallback(
		(e) => {
			const container = e.target;
			const scrollPosition = container.scrollLeft + container.clientWidth;
			const scrollWidth = container.scrollWidth;

			// Check if we're near the right edge (within 100px)
			const isNearEnd = scrollWidth - scrollPosition < 100;

			if (
				isNearEnd &&
				info?.hasNextPage &&
				!info?.loading &&
				info?.aiAssistantsList?.length >= AGENTS_PER_PAGE &&
				info?.currentPage === knowledgeAssistantsList?.currentPage
			) {
				setInfo((prev) => ({ ...prev, loading: true }));
				getMoreAiAssistants();
			}
		},
		[
			info?.hasNextPage,
			info?.loading,
			info?.aiAssistantsList?.length,
			info?.currentPage,
			knowledgeAssistantsList?.currentPage,
			getMoreAiAssistants,
		],
	);

	// Add scroll event listener
	useEffect(() => {
		const scrollContainer = containerRef.current;
		if (scrollContainer) {
			scrollContainer.addEventListener('scroll', handleScroll);
			return () => scrollContainer.removeEventListener('scroll', handleScroll);
		}
	}, [handleScroll]);

	const handleCreateNewKnowledgeAgent = async () => {
		const [, data] = await createNewKnowledgeAgent('Untitled Assistant');
		if (data?.insertedId) {
			navigate(`/knowledge-agent/${data?.insertedId}/edit`);
		} else {
			message.error(data?.message);
		}
	};

	const assistants = info?.aiAssistantsList?.length
		? info.aiAssistantsList?.map((ele) => ({
				aiAssistantId: ele?._id,
				assistantName: ele?.name,
				createdBy: ele?.createdBy || 'AI',
				type: 'regular',
				isDefault: false,
				content: [
					{
						default: {
							image: defaultImage,
							text: 'Placeholder Text', // Placeholder for API
							description: 'Placeholder description.', // Placeholder for API
						},
						hover: {
							image: hoverImage,
							text: 'Hover Text', // Placeholder for API
							description: ' Hover description.', // Placeholder for API
						},
					},
				],
				...ele,
		  }))
		: [];

	const allCards = [...defaultCards, ...assistants];

	return (
		<div className="cards-wrapper">
			<header className="page-header">
				<h1>
					<span className="header-subtitle">Browse your Knowledge Agents</span>
					<span className="header-title">Curiosity is Superpower.</span>
				</h1>
			</header>
			<div className="card-scrollable-wrapper">
				<div className="agents-scroll-area" ref={containerRef}>
					<div className="agents-container">
						{info?.loading && assistants.length === 0 ? (
							<div className="loading-container">
								{[...Array(5)]?.map((_, index) => (
									<Card key={index} className="agent-card loading-card">
										<CardContent className="card-content" />
									</Card>
								))}
							</div>
						) : allCards.length > 0 ? (
							allCards?.map((card, index) => (
								<Card
									key={card?.isDefault ? `default-${index}` : card?.aiAssistantId}
									className={`agent-card ${
										card?.type === 'new' ? 'new-card' : ''
									}`}
									onClick={
										!card?.isDefault
											? () =>
													navigate(
														`/knowledge-agent/${card?.aiAssistantId}`,
														{
															state: { assistant: card },
														},
													)
											: () => {
													handleCreateNewKnowledgeAgent();
											  }
									}
								>
									<CardContent className="card-content">
										<div className="agent-info">
											<div className="agent-title">
												{card?.isDefault
													? card?.title
													: card?.assistantName}
											</div>
											<div className="agent-subtitle">
												{card?.isDefault
													? card?.subtitle
													: `Created by ${card?.createdBy}`}
											</div>
										</div>

										<div className="agent-icon">
											{card.type === 'new' ? (
												<img
													src={greenCardIcon}
													alt="Green Card Icon"
													className="green-card-icon"
												/>
											) : (
												<button className="ask-me-button">
													<img
														src={searchIcon}
														alt="Search Icon"
														className="search-icon"
													/>
													Ask Me
												</button>
											)}
										</div>
									</CardContent>
								</Card>
							))
						) : (
							<div className="no-results">No agents found.</div>
						)}

						{/* Add loading skeletons */}
						{info?.loading && (
							<>
								{[...Array(3)].map((_, index) => (
									<Card
										key={`skeleton-${index}`}
										className="agent-card loading-card"
									>
										<CardContent className="card-content">
											<div className="agent-info">
												<div className="agent-title skeleton" />
												<div className="agent-subtitle skeleton" />
											</div>
											<div className="inspired-people skeleton" />
											<div className="agent-icon skeleton" />
										</CardContent>
									</Card>
								))}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(CardsContainer);
