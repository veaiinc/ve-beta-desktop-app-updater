import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import '../../../assets/scss/home_page/chatPrompts.scss';
import Context from '../../../context/context';
import PromptPopup from '../../components/homePage/PromptPopup';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';
import SearchSvg from '../../../assets/svg/sidebar/SearchSvg';
const promptsList = [
	{
		id: 1,
		label: 'All prompts',
		value: 'all',
	},
	{
		id: 2,
		label: 'Sales',
		value: 'sales',
	},
	{
		id: 3,
		label: 'Marketing',
		value: 'marketing',
	},
	{
		id: 4,
		label: 'Operarions',
		value: 'operations',
	},
];
let timeoutId;
const ChatPrompts = ({
	promptsCategory,
	updatePromptsCategory,
	isHeaderMinimized,
	onMinimizeHeader = null,
	onExpandHeader = null,
}) => {
	const {
		aiSetup: { getPromptsData, promptsData },
	} = useContext(Context);

	const [info, setInfo] = useState({
		promptsData: [],
		hasNextPage: false,
		page: 1,
		searchQuery: '',
		selectedCard: null,
		promptPopupOpen: false,
	});

	const infiniteScrollRef = useRef(null);

	useEffect(() => {
		return () => clearTimeout(timeoutId);
	}, []);

	// useEffect(() => {
	// 	const element = document?.querySelector('.infinite-scroll-container');
	// 	if (element) {
	// 		infiniteScrollRef.current = element;
	// 		element?.addEventListener('scroll', handleScroll);
	// 	}
	// }, []);s

	useEffect(() => {
		if (promptsData) {
			if (
				promptsData?.currentPage === 1 &&
				promptsCategory === 'all' &&
				info?.searchQuery === ''
			) {
				return;
			}
		}
		fetchAiSuggestedPrompts(1, info?.searchQuery);
		setInfo((prev) => ({
			...prev,
			promptsData: [],
			page: 1,
			hasNextPage: false,
		}));
	}, [promptsCategory]);

	useEffect(() => {
		if (promptsData) {
			if (promptsData?.data?.length > 0) {
				setInfo((prev) => ({
					...prev,
					promptsData: [...prev?.promptsData, ...promptsData?.data],
					hasNextPage: promptsData?.hasNextPage,
					page: promptsData?.currentPage,
				}));
			}
		}
	}, [promptsData]);

	// const handleScroll = () => {
	// 	if (infiniteScrollRef?.current?.scrollTop === 0) {
	// 		// if (isHeaderMinimized) {
	// 		onExpandHeader?.();
	// 		// }
	// 	} else {
	// 		// if (!isHeaderMinimized) {
	// 		onMinimizeHeader();

	// 		// }
	// 	}
	// };

	const fetchAiSuggestedPrompts = async (page = 1, searchQuery = '') => {
		const payload = {
			page: page,
			limit: 30,
			category: promptsCategory,
			...(searchQuery && { search: searchQuery }),
		};
		getPromptsData(payload);
	};

	const fetchMoreAiSuggestedPrompts = () => {
		fetchAiSuggestedPrompts(info?.page + 1, info?.searchQuery);
	};

	const handlePromptCardClick = (card) => {
		setInfo((prev) => ({ ...prev, selectedCard: card, promptPopupOpen: true }));
	};

	const handlePromptCategoryClick = (value) => {
		updatePromptsCategory(value);
	};

	const handleSearchQueryChange = (e) => {
		setInfo((prev) => ({ ...prev, searchQuery: e?.target?.value }));

		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			fetchAiSuggestedPrompts(1, e?.target?.value);
			setInfo((prev) => ({
				...prev,
				promptsData: [],
				page: 1,
				hasNextPage: false,
			}));
		}, 1000);
	};

	return (
		<div className="chat-prompts-wrapper">
			<div className="chat-prompts-container">
				{/* <div className="header">
					<div className="title-container">
						<div className="title">
							One Prompt,
							<br />
							Limitless Intelligence!
						</div>
					</div>
					<div className="search-container">
						<SearchSvg />
						<input
							className="search-input"
							type="text"
							placeholder="Search your prompts"
							value={info?.searchQuery}
							onChange={handleSearchQueryChange}
						/>
					</div>
				</div> */}

				<div className="prompts-container">
					<div className="prompts-side-bar">
						{/* <div className="create-prompt-container">
							<button className="create-prompt-button">Create Prompt</button>
						</div> */}

						{/* <div className="prompts-list-container">
							{promptsList?.map((prompt) => (
								<div
									className={`prompt-item ${
										info?.selectedPromptCategory === prompt?.value
											? 'active'
											: ''
									}`}
									key={prompt?.id}
									onClick={() => handlePromptCategoryClick(prompt?.value)}
								>
									{prompt?.label}
								</div>
							))}
						</div> */}
					</div>
					<div className="suggested-prompts">
						<InfiniteScroll
							dataLength={info?.promptsData?.length || 0}
							next={fetchMoreAiSuggestedPrompts}
							hasMore={info?.hasNextPage || false}
							loader={<FetchMoreLoaderComp wrapperStyle={{ width: '100%' }} />}
							height={
								isHeaderMinimized ? 'calc(100vh - 310px)' : `calc(100vh - 435px)`
							}
							className="infinite-scroll-container"
						>
							<div className="suggested-prompts-container">
								{info?.promptsData?.map((card) => (
									<div
										className="suggested-prompt-card"
										onClick={() => handlePromptCardClick(card)}
									>
										<div className="card-title">{card?.title}</div>
										<div className="card-category">{card?.category}</div>
									</div>
								))}
							</div>
						</InfiniteScroll>
					</div>
				</div>

				<PromptPopup
					open={info?.promptPopupOpen}
					closeModal={() =>
						setInfo((prev) => ({
							...prev,
							promptPopupOpen: false,
							selectedCard: null,
						}))
					}
					selectedCard={info?.selectedCard}
				/>
			</div>
		</div>
	);
};

export default memo(ChatPrompts);
