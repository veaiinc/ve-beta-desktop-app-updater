import React, { memo, useContext, useEffect } from 'react';
import '../../../../assets/scss/home_page/recentChats.scss';
import Context from '../../../../context/context';

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
		console.log(aiChatSessions);
	}, []);

	return (
		<div className="RecentAiChatsContainer">
			{data?.map((item) => (
				<div key={item?.id} className="RecentAiChatsContainerEach">
					<div className="recentAiChatsContainerEachTop">
						<div className="recentAiChatsContainerEachTopSubTitle">
							{item?.subTitle}
						</div>
						<div className="recentAiChatsContainerEachTopCreatedAt">
							{item?.createdAt}
						</div>
					</div>
					<div className="recentAiChatsContainerEachTop">
						<div className="recentAiChatsContainerEachTopTitle">{item?.title}</div>
						<div className="recentAiChatsContainerEachTopIcon">
							<img src={item?.src} />
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default memo(RecentChats);
