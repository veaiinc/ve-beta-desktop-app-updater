import { memo, useCallback, useContext, useEffect, useState } from 'react';
import s from '../../../assets/scss/home_page/activeChatIndication.module.scss';
import { Tooltip } from 'antd';
import RecentChatsTooltip from './RecentChatsTooltip';
import { useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import ObjectID from 'bson-objectid';

const page = 1;
const limit = 10;
const append = true;

const ActiveChatIndication = ({ activeChatData }) => {
	const navigate = useNavigate();
	const {
		aiSetup: { getAiChatSessions, aiChatSessions },
		templates: {
			refetchChatHistoryList,
			updateStateValues,
			currentSessionId,
			chatLoadingSessions,
			updateChatLoadingSessions,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		previousChats: 0,
		activeChatIndex: -1,
	});

	const chats = aiChatSessions?.data;
	const hasNextPage = aiChatSessions?.hasMore || false;
	const currentPage = aiChatSessions?.currentPage || 1;
	const totalChats = chats?.length;
	const totalCards = totalChats + 1;
	const maxIndicators = 10;
	const totalIndicators = totalCards <= maxIndicators ? totalCards : maxIndicators;
	const tabArray = Array.from({ length: totalIndicators });

	useEffect(() => {
		if (!aiChatSessions || aiChatSessions?.getData) {
			fetchChats();
		}
	}, []);

	useEffect(() => {
		if (activeChatData && aiChatSessions?.data) {
			let index = aiChatSessions?.data?.findIndex(
				(chat) => chat?._id === activeChatData?._id,
			);

			// if (index === -1) {
			// 	if (activeChatData?._id === 'chatbox') {
			// 		index = 0;
			// 	}
			// }

			if (index !== -1) {
				setInfo((prev) => ({
					...prev,
					previousChats: index,
					activeChatIndex: index % 10,
				}));
			} else {
				index = 0;
				setInfo((prev) => ({
					...prev,
					previousChats: 0,
					activeChatIndex: -1,
				}));
			}
		}
	}, [activeChatData, aiChatSessions?.data]);

	useEffect(() => {
		if (currentSessionId) {
			const index = aiChatSessions?.data?.findIndex((chat) => chat?._id === currentSessionId);
			if (typeof index === 'number' && index !== -1) {
				updateStateValues?.({ currentChatData: aiChatSessions?.data?.[index] });
			}
		}
	}, [currentSessionId, aiChatSessions]);

	useEffect(() => {
		if (refetchChatHistoryList) {
			fetchChats();
			updateStateValues?.({ refetchChatHistoryList: false });
		}
	}, [refetchChatHistoryList]);

	const fetchChats = useCallback(() => {
		getAiChatSessions?.(page, limit, append);
	}, []);

	const fetchMoreChats = () => {
		if (hasNextPage) {
			const nextPage = currentPage + 1;
			getAiChatSessions?.(nextPage, limit, !append);
		}
	};

	const handleChatNavigation = useCallback(
		(chat) => {
			if (currentSessionId === chat?._id) return;

			if (chatLoadingSessions?.[chat?._id]?.isNotSeen) {
				updateChatLoadingSessions?.({ sessionId: chat?._id, removeSessionId: true });
			}

			if (chat?.agentType === 'knowledge_agent') {
				navigate?.(
					`/chat/${chat?._id}?agentType=knowledge_agent&assistantId=${chat?.assistantId}`,
				);
			} else if (chat?._id === 'chatbox') {
				const sessionId = ObjectID()?.toString();
				navigate?.(`/chat/${sessionId}`);
			} else {
				navigate?.(`/chat/${chat?._id}`);
			}
		},
		[currentSessionId, updateChatLoadingSessions],
	);

	return (
		<Tooltip
			title={
				<RecentChatsTooltip
					chats={chats}
					fetchMoreChats={fetchMoreChats}
					hasNextPage={hasNextPage}
					handleChatNavigation={handleChatNavigation}
					loading={chatLoadingSessions}
					activeChatData={activeChatData}
				/>
			}
			placement="center"
			color="transparent"
		>
			<div className={s.chatsWrapper}>
				{chats?.length && <div className={s.previousChatsCount}>{info?.previousChats}</div>}

				<div className={s.activeChatIndication}>
					{tabArray?.map((tab, index) => (
						<div
							className={`${s.chatTab} ${
								index === info?.activeChatIndex ? s.active : ''
							}`}
							key={index}
						/>
					))}
				</div>
				{chats?.length && <div className={s.totalChatsCount}>{chats?.length}</div>}
			</div>
		</Tooltip>
	);
};

export default memo(ActiveChatIndication);
