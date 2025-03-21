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

const infiniteScrollHeight = 'calc(100vh - 72px)';
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
	} = useContext(Context);

	useEffect(() => {
		if (showChatsDrawer) {
			getAiChatSessions(page, limit, append);
		}
	}, [showChatsDrawer]);

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

	const handleChatNavigation = useCallback((chat) => {
		navigate(`/chat/${chat?._id}`);
	}, []);

	return (
		<Drawer
			title={null}
			open={showChatsDrawer}
			onClose={handleCloseDrawer}
			placement="left"
			width={250}
			rootClassName="sidebar-chats-drawer"
			closeIcon={null}
			zIndex={1009}
		>
			<div className="chats-drawer-container">
				<div className="header">
					<h1 className="title">AI Chat History</h1>
					<div onClick={handleCloseDrawer} className="cta-container">
						<Back />
					</div>
				</div>
				<div className="chats-container">
					{loadingState ? (
						<div className="skeleton-loader-container">
							{skeletonLoaders?.map((skeletonId) => (
								<Skeleton
									key={skeletonId}
									width="230px"
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
							{chats?.map((chat) => (
								<div
									key={chat?.id}
									className={`chat-container ${
										sessionId === chat?._id ? 'active-chat' : ''
									}`}
									onClick={() => handleChatNavigation(chat)}
								>
									<div className="chat-title-and-query">
										{/* // Todo: uncomment after styling tooltip properly, no need to render tooltip in safari. Perform conditional rendering based on browser */}
										{/* <ChatTitleTooltip content={chat?.title}> */}
										<p className="chat-title">{chat?.title}</p>
										{/* </ChatTitleTooltip> */}
										<p className="chat-query">{chat?.query}</p>
									</div>
									<p className="chat-timestamp">
										{formatTimestamp(chat?.createdAt)}
									</p>
								</div>
							))}
						</InfiniteScroll>
					)}
				</div>
			</div>
		</Drawer>
	);
};

export default memo(ChatHistory);
