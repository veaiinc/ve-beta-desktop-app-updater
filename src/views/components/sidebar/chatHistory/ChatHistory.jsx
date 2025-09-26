import Skeleton from 'react-loading-skeleton';
import React, { useContext, useEffect, memo, useCallback } from 'react';
import '../../../../assets/scss/chats.scss';
import Context from '../../../../context/context';
import { FetchMoreLoaderComp } from '../../../../helpers';
import InfiniteScroll from '../../../components/globalComponents/InfiniteScroll';
import moment from 'moment';
import { useNavigate, useSearchParams } from 'react-router-dom';
// import ObjectID from 'bson-objectid';
import Spinner from '../../loaders/Spinner';
import ObjectID from 'bson-objectid';

const infiniteScrollStyle = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	alignSelf: 'stretch',
	gap: '2px',

	// height: '38vh',
};
const skeletonLoaders = Array?.from({ length: 30 }, (_, index) => index + 1);
const page = 1;
const limit = 10;
const reset = true;

const ChatHistory = ({ onChatSelect, isClosed = false }) => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const {
		aiSetup: {
			getAiChatSessions,
			aiChatSessions,
			aiChatSessionsFilters,
			updateStateValues: updateAiSetupStateValues,
		},
		templates: {
			refetchChatHistoryList,
			updateStateValues,
			currentSessionId,
			currentChatData,
			chatLoadingSessions,
			updateChatLoadingSessions,
		},
		subscriptionInfo: { currentPlan },
	} = useContext(Context);
	// const previousSearchQuery = useRef('');
	// const [searchQuery, setSearchQuery] = useState('');

	// const debouncedSearch = useCallback(
	// 	debounce((query) => {
	// 		previousSearchQuery.current = query;
	// 		getAiChatSessions(page, limit, append, query);
	// 	}, 500),
	// 	[],
	// );

	useEffect(() => {
		const filterAgentType = aiChatSessionsFilters?.agentType ?? 'multi_agent';
		const paramsAgentType = searchParams?.get('agentType') ?? 'multi_agent';

		if (!aiChatSessions || aiChatSessions?.getData || filterAgentType !== paramsAgentType) {
			fetchChats();
		}
		// const timeoutId = setTimeout(() => {
		// 	if (!searchQuery) {
		// 		getAiChatSessions(page, limit, append);
		// 	} else {
		// 		debouncedSearch(searchQuery);
		// 	}
		// }, 0);

		// return () => {
		// 	clearTimeout(timeoutId);
		// 	debouncedSearch.cancel();
		// };
	}, []);

	useEffect(() => {
		if (currentSessionId) {
			const index = aiChatSessions?.data?.findIndex((chat) => chat?._id === currentSessionId);
			if (typeof index === 'number' && index !== -1) {
				updateStateValues({ currentChatData: aiChatSessions?.data[index] });
			}
		}
	}, [currentSessionId, aiChatSessions]);

	useEffect(() => {
		if (refetchChatHistoryList) {
			fetchChats();
			updateStateValues({ refetchChatHistoryList: false });
		}
	}, [refetchChatHistoryList]);

	const fetchChats = useCallback(async () => {
		const agentType = searchParams?.get('agentType') ?? 'multi_agent';
		const exclude = agentType === 'multi_agent' ? true : false;
		await getAiChatSessions({
			reset,
			filters: { page, limit, agentType: ['knowledge_agent'], exclude },
		});
		updateAiSetupStateValues({
			aiChatSessionsFilters: { agentType },
		});
	}, [searchParams]);

	const fetchMoreChats = () => {
		const agentType = searchParams?.get('agentType') ?? 'multi_agent';
		const exclude = agentType === 'multi_agent' ? true : false;

		if (hasNextPage) {
			const nextPage = currentPage + 1;
			getAiChatSessions({
				reset: !reset,
				filters: { page: nextPage, limit, agentType: ['knowledge_agent'], exclude },
			});
		}
	};

	const handleChatNavigation = useCallback(
		(chat) => {
			if (currentSessionId === chat?._id) return;

			if (chatLoadingSessions?.[chat?._id]?.isNotSeen) {
				updateChatLoadingSessions({ sessionId: chat?._id, removeSessionId: true });
			}

			// Close mobile dropdown when chat is selected
			if (onChatSelect) {
				onChatSelect();
			}

			if (chat?.agentType === 'knowledge_agent') {
				navigate(
					`/chat/${chat?._id}?agentType=knowledge_agent&assistantId=${chat?.assistantId}`,
				);
			} else {
				navigate(`/chat/${chat?._id}`);
			}
		},
		[currentSessionId, updateChatLoadingSessions, onChatSelect],
	);

	const getChatDateGroup = useCallback((timestamp) => {
		const chatDate = moment.unix(timestamp).startOf('day');
		const today = moment().startOf('day');
		const yesterday = moment().subtract(1, 'day').startOf('day');
		const weekAgo = moment().subtract(7, 'days').startOf('day');
		const monthAgo = moment().subtract(1, 'month').startOf('day');

		if (chatDate.isSame(today)) return 'Today';
		if (chatDate.isSame(yesterday)) return 'Yesterday';
		if (chatDate.isAfter(weekAgo)) return 'Previous 7 Days';
		if (chatDate.isAfter(monthAgo)) return 'Last Month';

		return 'Older';
	}, []);

	const paramsAgentType = searchParams?.get('agentType') ?? 'multi_agent';
	const chats = aiChatSessions?.data;
	const emptyChatsState = aiChatSessions?.data?.length === 0;
	const loadingState =
		aiChatSessions?.data === undefined || paramsAgentType !== aiChatSessionsFilters?.agentType;
	const hasNextPage = aiChatSessions?.hasMore || false;
	const currentPage = aiChatSessions?.currentPage || 1;

	return (
		<div className={`chats-drawer-container${isClosed ? ' closed' : ''}`}>
			<div className="chats-container">
				{/* {(chats?.length > 10 || previousSearchQuery.current) && (
					<div className="searchContainer">
						<Search />
						<input
							type="text"
							placeholder="Ai Chat History"
							className="search-input"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				)} */}
				{loadingState ? (
					<div className="skeleton-loader-container">
						{skeletonLoaders?.map((skeletonId) => (
							<Skeleton
								key={skeletonId}
								width="211px"
								height="46px"
								borderRadius="12px"
								baseColor="var(--card)"
								highlightColor="gray"
							/>
						))}
					</div>
				) : emptyChatsState ? (
					// <div className="empty-state">
					// 	<button className="create-chat-btn" onClick={handleCreateChat}>
					// 		Create New Chat
					// 	</button>
					// </div>
					''
				) : (
					<InfiniteScroll
						dataLength={chats?.length || 0}
						next={fetchMoreChats}
						hasMore={hasNextPage || false}
						loader={<FetchMoreLoaderComp wrapperStyle={{ width: '100%' }} />}
						style={{
							...infiniteScrollStyle,
							marginBottom: !currentPlan?.totalAiCreditLimit === 0 ? '140px' : '70px',
						}}
						className="chat-history-scroll"
						// scrollableTarget="chatsScroll"
						height={'100%'}
					>
						<button
							className="new-chat-btn"
							onClick={() => navigate(`/chat/${ObjectID()?.toString()}`)}
						>
							New Chat
						</button>
						{chats?.map((chat, index) => {
							const dateGroup = getChatDateGroup(chat.createdAt);
							const showGroupHeader =
								index === 0 ||
								dateGroup !== getChatDateGroup(chats[index - 1].createdAt);

							return (
								<div key={index} className="chat-container-wrapper ">
									{showGroupHeader && (
										<div
											className="chat-group-header"
											style={{
												marginTop: `${index !== 0 ? '20px' : '0'}`,
											}}
										>
											{dateGroup}
										</div>
									)}
									<div
										className={`chat-containers ${
											currentSessionId === chat?._id ? 'active-chat' : ''
										}`}
										onClick={() => handleChatNavigation(chat)}
									>
										<div className="chat-title-and-query">
											<p
												className={`chat-title ${
													index === chats.length - 1
														? 'last-chat-title'
														: ''
												}`}
											>
												{chat?.title}
											</p>
										</div>
										{(chatLoadingSessions?.[chat?._id]?.isStreaming ||
											chatLoadingSessions?.[chat?._id]?.isNotSeen) &&
											chat?._id !== currentSessionId && (
												<div className="loader-container">
													{chatLoadingSessions?.[chat?._id]
														?.isStreaming && (
														<Spinner width={'15px'} height={'14.5px'} />
													)}
													{chatLoadingSessions?.[chat?._id]
														?.isNotSeen && (
														<div className="not-seen-badge" />
													)}
												</div>
											)}
									</div>
								</div>
							);
						})}
					</InfiniteScroll>
				)}
			</div>
		</div>
	);
};

export default memo(ChatHistory);
