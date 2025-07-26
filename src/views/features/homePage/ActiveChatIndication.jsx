import { memo, useCallback, useContext, useEffect } from 'react';
import s from '../../../assets/scss/home_page/activeChatIndication.module.scss';
import { Tooltip } from 'antd';
import RecentChatsTooltip from './RecentChatsTooltip';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import moment from 'moment';

const page = 1;
const limit = 10;
const append = true;

const ActiveChatIndication = ({ activeChatIndex }) => {
	const navigate = useNavigate();
	const {
		aiSetup: { getAiChatSessions, aiChatSessions },
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

	useEffect(() => {
		if (!aiChatSessions || aiChatSessions?.getData) {
			fetchChats();
		}
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

	const fetchChats = useCallback(() => {
		getAiChatSessions(page, limit, append);
	}, []);

	const handleChatNavigation = useCallback(
		(chat) => {
			if (currentSessionId === chat?._id) return;

			if (chatLoadingSessions?.[chat?._id]?.isNotSeen) {
				updateChatLoadingSessions({ sessionId: chat?._id, removeSessionId: true });
			}

			if (chat?.agentType === 'knowledge_agent') {
				navigate(
					`/chat/${chat?._id}?agentType=knowledge_agent&assistantId=${chat?.assistantId}`,
				);
			} else {
				navigate(`/chat/${chat?._id}`);
			}
		},
		[currentSessionId, updateChatLoadingSessions],
	);

	const chats = aiChatSessions?.data;
	const hasNextPage = aiChatSessions?.hasMore || false;
	const currentPage = aiChatSessions?.currentPage || 1;

	const fetchMoreChats = () => {
		if (hasNextPage) {
			const nextPage = currentPage + 1;
			getAiChatSessions(nextPage, limit, !append);
		}
	};

	const totlaChats = chats?.length;

	const totalCards = totlaChats + 1;
	const maxIndicators = 10;
	const totalIndicators = totalCards <= maxIndicators ? totalCards : maxIndicators;

	const indicatorIndex =
		totalCards <= maxIndicators
			? activeChatIndex
			: Math.round((activeChatIndex * (maxIndicators - 1)) / (totalCards - 1));

	const tabArray = Array.from({ length: totalIndicators });

	return (
		<Tooltip
			title={
				<RecentChatsTooltip
					chats={chats}
					fetchMoreChats={fetchMoreChats}
					hasNextPage={hasNextPage}
					handleChatNavigation={handleChatNavigation}
				/>
			}
			placement="right"
			color="transparent"
		>
			<div className={s.activeChatIndication}>
				{tabArray.map((tab, index) => (
					<div
						className={`${s.chatTab} ${index === indicatorIndex ? s.active : ''}`}
						key={index}
					/>
				))}
			</div>
		</Tooltip>
	);
};

export default memo(ActiveChatIndication);
