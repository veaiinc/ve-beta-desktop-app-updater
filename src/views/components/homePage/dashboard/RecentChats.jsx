import React, { memo, useContext, useEffect } from 'react';
import '../../../../assets/scss/home_page/recentChats.scss';
import Context from '../../../../context/context';
import InfiniteScroll from 'react-infinite-scroll-component';

const baseData = {
	id: 0,
	subTitle: 'Ai design and task',
	title: 'Generate a file and collect lead and make sales',
	src: 'img',
	createdAt: '8-Oct',
};

const multipleOptions = (count) => {
	return Array.from({ length: count }, (_, index) => ({
		...baseData,
		id: index,
	}));
};

const data = multipleOptions(20);

const RecentChats = () => {
	let {
		aiSetup: { getAiChatSessions, aiChatSessions },
	} = useContext(Context);

	useEffect(() => {
		getAiChatSessions(1, 10, true);
		console.log(aiChatSessions, 'aiChatSessions');
	}, []);

	const formatDate = (epochTime) => {
		if (!epochTime) return '';
		const date = new Date(epochTime * 1000); // Multiply by 1000 to convert seconds to milliseconds
		return date.toLocaleString('en-US', { month: 'short', day: '2-digit' });
	};

	return (
		<InfiniteScroll
			dataLength={aiChatSessions?.data?.length}
			next={() => getAiChatSessions(aiChatSessions?.currentPage + 1, 10, false)}
			hasMore={aiChatSessions?.hasMore}
			scrollableTarget="RecentAiChatsContainer"
			style={{ width: '100%' }}
		>
			<div className="RecentAiChatsContainer" id="RecentAiChatsContainer">
				{aiChatSessions?.data?.map((item) => (
					<div key={item?.id} className="RecentAiChatsContainerEach">
						{/* <div className="recentAiChatsContainerEachTop">
						<div className="recentAiChatsContainerEachTopSubTitle">
							{item?.subTitle}
						</div>
						<div className="recentAiChatsContainerEachTopCreatedAt"></div>
					</div> */}
						<div className="recentAiChatsContainerEachTop">
							<div className="recentAiChatsContainerEachTopTitle">{item?.query}</div>
							<div className="recentAiChatsContainerEachTopSubTitle">
								{formatDate(item?.createdAt)}
							</div>
						</div>
					</div>
				))}
			</div>
		</InfiniteScroll>
	);
};

export default memo(RecentChats);
