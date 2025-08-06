import { memo } from 'react';
import s from '../../../assets/scss/home_page/recentChatsTooltip.module.scss';
import InfiniteScroll from '../../components/globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../helpers';
import Skeleton from 'react-loading-skeleton';

const infinityScrollStyles = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	alignSelf: 'stretch',
	gap: '2px',
};

const RecentChatsTooltip = ({
	chats,
	handleChatNavigation,
	fetchMoreChats,
	hasNextPage,
	activeChatData,
}) => {
	const chatsLength = chats?.length || 0;
	const emptyChatsState = chatsLength === 0;
	const loadingState = chats === undefined;

	return (
		<div className={s.recentChatTooltip}>
			<div className={s.chatList}>
				<div className={s.chatHeaderTitle}>Chats</div>

				{loadingState ? (
					<div className={s.loading}>
						<Skeleton
							count={15}
							height={27}
							highlightColor="var(--card-hover)"
							baseColor="var(--card)"
						/>
					</div>
				) : (
					<>
						{' '}
						{emptyChatsState ? (
							<div className={s.emptyState}>
								<span>No chats available</span>
							</div>
						) : (
							<InfiniteScroll
								className={s.chatListWrapper}
								dataLength={chatsLength}
								next={fetchMoreChats}
								hasMore={hasNextPage || false}
								loader={
									<FetchMoreLoaderComp
										wrapperStyle={{ width: '100%', height: '40px' }}
									/>
								}
								height="100%"
								style={infinityScrollStyles}
							>
								{chats?.map((chat) => (
									<div
										className={s.chatItem}
										key={chat?._id}
										onClick={() => handleChatNavigation?.(chat)}
									>
										<span className={s.chatTitle}>{chat?.title}</span>
										{activeChatData?._id === chat?._id && (
											<span className={s.activeChatIndicator} />
										)}
									</div>
								))}
							</InfiniteScroll>
						)}
					</>
				)}
			</div>
		</div>
	);
};

export default memo(RecentChatsTooltip);
