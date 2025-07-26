import { memo } from 'react';
import s from '../../../assets/scss/home_page/recentChatsTooltip.module.scss';
import InfiniteScroll from '../../components/globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../helpers';

const RecentChatsTooltip = ({ chats, handleChatNavigation, fetchMoreChats, hasNextPage }) => {
	const chatsLength = chats?.length || 0;
	const emptyChatsState = chatsLength === 0;

	return (
		<div className={s.recentChatTooltip}>
			<div className={s.chatList}>
				<div className={s.chatHeaderTitle}>Chats</div>
				{emptyChatsState ? (
					<div className={s.emptyState}>
						<span>No chats available</span>
					</div>
				) : (
					<InfiniteScroll
						className={s.chatListWrapper}
						dataLength={chatsLength}
						next={fetchMoreChats}
						hasMore={hasNextPage}
						loader={
							<FetchMoreLoaderComp wrapperStyle={{ width: '100%', height: '40px' }} />
						}
						height="100%"
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'flex-start',
							alignSelf: 'stretch',
							gap: '2px',
						}}
					>
						{chats?.map((chat) => (
							<div
								className={s.chatItem}
								key={chat._id}
								onClick={() => handleChatNavigation(chat)}
							>
								<span>{chat.title}</span>
							</div>
						))}
					</InfiniteScroll>
				)}
			</div>
		</div>
	);
};

export default memo(RecentChatsTooltip);
