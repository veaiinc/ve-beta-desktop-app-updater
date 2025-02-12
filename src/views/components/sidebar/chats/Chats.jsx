import { Drawer } from 'antd';
import React, { useContext, useEffect, memo } from 'react';
import '../../../../assets/scss/chats.scss';
import { ReactComponent as Back } from '../../../../assets/svg/sidebar/notifications/back.svg';
import Context from '../../../../context/context';
import { FetchMoreLoaderComp } from '../../../../helpers';
import InfiniteScroll from 'react-infinite-scroll-component';

const infiniteScrollHeight = 'calc(100vh - 72px)';

const Chats = ({ showChatsDrawer, setShowChatsDrawer }) => {
	let {
		aiSetup: { getAiChatSessions, aiChatSessions },
	} = useContext(Context);

	useEffect(() => {
		if (showChatsDrawer) {
			getAiChatSessions(1, 30, true);
		}
	}, [showChatsDrawer]);

	const chats = aiChatSessions?.data;
	const emptyChatsState = aiChatSessions?.data?.length === 0;
	const loadingState = aiChatSessions?.data === undefined;
	const hasNextPage = aiChatSessions?.hasMore || false;
	const currentPage = aiChatSessions?.currentPage || 1;

	const handleCloseDrawer = () => {
		setShowChatsDrawer(false);
	};

	const formatTimestamp = (timestamp) => {
		const date = new Date(timestamp * 1000);
		const now = new Date();
		const isToday = date?.toDateString() === now?.toDateString();

		if (isToday) {
			return date?.toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
			});
		}

		return date?.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
	};

	const fetchMoreChats = () => {
		if (hasNextPage) {
			getAiChatSessions(currentPage + 1, 30, false);
		}
	};

	return (
		<Drawer
			title={null}
			open={showChatsDrawer}
			onClose={handleCloseDrawer}
			placement="left"
			width={346}
			rootClassName="sidebar-chats-drawer"
			closeIcon={null}
		>
			<div className="chats-drawer-container">
				<div className="header">
					<h1 className="title">Recent AI Chats</h1>
					<div onClick={handleCloseDrawer} className="cta-container">
						<Back />
					</div>
				</div>
				<div className="chats-container">
					{loadingState ? (
						<div className="loading-state">
							<p className="message">Loading AI chats...</p>
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
							loader={<FetchMoreLoaderComp />}
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'flex-start',
								gap: '8px',
								flex: '1 0 0',
								alignSelf: 'stretch',
							}}
							height={infiniteScrollHeight}
						>
							{chats?.map((chat) => (
								<div key={chat?.id} className="chat-container">
									<p className="chat-title">{chat?.query}</p>
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

export default memo(Chats);
