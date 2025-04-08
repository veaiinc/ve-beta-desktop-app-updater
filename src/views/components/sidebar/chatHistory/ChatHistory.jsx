import { Drawer } from 'antd';
import Skeleton from 'react-loading-skeleton';
import React, { useContext, useEffect, memo, useCallback } from 'react';
import '../../../../assets/scss/chats.scss';
import { ReactComponent as Back } from '../../../../assets/svg/sidebar/notifications/back.svg';
import Context from '../../../../context/context';
import { FetchMoreLoaderComp } from '../../../../helpers';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import ChatTitleTooltip from './ChatTitleTooltip';

const infiniteScrollHeight = '63vh';
const infiniteScrollStyle = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	flex: '1 0 0',
	alignSelf: 'stretch',
};
const skeletonLoaders = Array.from({ length: 30 }, (_, index) => index + 1);
const page = 1;
const limit = 30;
const append = true;

const ChatHistory = ({ showChatsDrawer, setShowChatsDrawer, setHideClosedSidebarIcon }) => {
	const navigate = useNavigate();
	const { sessionId } = useParams();
	const {
		aiSetup: { getAiChatSessions, aiChatSessions },
		templates: { chatInfo, updateStateValues, currentSessionId },
	} = useContext(Context);

	useEffect(() => {
		if (!aiChatSessions) {
			getAiChatSessions(page, limit, append);
		}
	}, []);

	const chats = aiChatSessions?.data;
	const emptyChatsState = aiChatSessions?.data?.length === 0;
	const loadingState = aiChatSessions?.data === undefined;
	const hasNextPage = aiChatSessions?.hasMore || false;
	const currentPage = aiChatSessions?.currentPage || 1;

	const handleCloseDrawer = () => {
		setShowChatsDrawer(false);
		setHideClosedSidebarIcon(false);
	};

	const formatTimestamp = (timestamp) => {
		const date = moment.unix(timestamp);
		const isToday = date.isSame(moment(), 'day');
		return isToday ? date.format('HH:mm') : date.format('MMM DD');
	};

	const fetchMoreChats = () => {
		if (hasNextPage) {
			const nextPage = currentPage + 1;
			getAiChatSessions(nextPage, limit, !append);
		}
	};

	const handleChatNavigation = useCallback(
		(chat) => {
			if (currentSessionId === chat?._id) return;
			updateStateValues({ chatInfo: { ...chatInfo, agentType: chat?.agentType } });
			navigate(`/chat/${chat?._id}`);
		},
		[currentSessionId, chatInfo],
	);

	const getChatDateGroup = useCallback((timestamp) => {
		const chatDate = moment.unix(timestamp);
		const today = moment().startOf('day');
		const yesterday = moment().subtract(1, 'days').startOf('day');
		const weekAgo = moment().subtract(7, 'days').startOf('day');
		const monthAgo = moment().subtract(1, 'month').startOf('day');

		if (chatDate.isSame(today, 'day')) {
			return 'Today';
		} else if (chatDate.isSame(yesterday, 'day')) {
			return 'Yesterday';
		} else if (chatDate.isAfter(weekAgo)) {
			return 'Previous 7 Days';
		} else if (chatDate.isAfter(monthAgo)) {
			return 'Last Month';
		}
		return 'Older';
	}, []);

	return (
		// <Drawer
		// 	title={null}
		// 	open={showChatsDrawer}
		// 	onClose={handleCloseDrawer}
		// 	placement="left"
		// 	width={250}
		// 	rootClassName="sidebar-chats-drawer"
		// 	closeIcon={null}
		// 	zIndex={1009}
		// >
		<div className="chats-drawer-container">
			{/* <div className="header">
				<h1 className="title">AI Chat History</h1>
				<div onClick={handleCloseDrawer} className="cta-container">
					<Back />
				</div>
			</div> */}
			<div className="chats-container">
				{loadingState ? (
					<div className="skeleton-loader-container">
						{skeletonLoaders?.map((skeletonId) => (
							<Skeleton
								key={skeletonId}
								width="211px"
								height="46px"
								borderRadius="12px"
							/>
						))}
					</div>
				) : emptyChatsState ? (
					<div className="empty-state">
						<p className="message">No AI chats yet!</p>
					</div>
				) : (
					<InfiniteScroll
						dataLength={chats?.length || 0}
						next={fetchMoreChats}
						hasMore={hasNextPage || false}
						loader={<FetchMoreLoaderComp wrapperStyle={{ width: '100%' }} />}
						style={infiniteScrollStyle}
						height={infiniteScrollHeight}
					>
						{chats?.map((chat, index) => {
							const dateGroup = getChatDateGroup(chat.createdAt);
							const showGroupHeader =
								index === 0 ||
								dateGroup !== getChatDateGroup(chats[index - 1].createdAt);

							return (
								<div key={chat?.id} className="chat-container-wrapper ">
									{showGroupHeader && (
										<div className="chat-group-header">{dateGroup}</div>
									)}
									<div
										className={`chat-containers ${
											sessionId === chat?._id ? 'active-chat' : ''
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
									</div>
								</div>
							);
						})}
					</InfiniteScroll>
				)}
			</div>
		</div>
		// </Drawer>
	);
};

export default memo(ChatHistory);
