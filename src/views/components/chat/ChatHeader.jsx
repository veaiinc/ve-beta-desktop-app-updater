import { memo, useCallback, useContext, useState } from 'react';
import s from '../../../assets/scss/chat/chatHeader.module.scss';
import { ReactComponent as LeftSvg } from '../../../assets/svg/activity/left.svg';
import { ReactComponent as DeleteSvg } from '../../../assets/svg/delete.svg';
import { Tooltip } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import Context from '../../../context/context';

const ChatHeader = ({ sessionId, onNavigateBack, isNewChat = false }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const {
		templates: { currentChatData, deleteChatSession, globalChatMessages },
	} = useContext(Context);

	const [info, setInfo] = useState({
		deleteChatSessionLoading: false,
	});

	const handleNavigateBack = useCallback(() => {
		const pathname = location?.pathname?.split('/')?.[1];
		if (pathname === 'calendar' || pathname === 'contacts' || pathname === 'tasks') {
			onNavigateBack?.();
		} else {
			navigate(-1);
		}
	}, [location?.pathname]);

	const handleDeleteChatClick = useCallback(async () => {
		if (info?.deleteChatSessionLoading || globalChatMessages?.[sessionId]?.isStreaming) {
			return;
		}
		setInfo((prev) => ({ ...prev, deleteChatSessionLoading: true }));
		const response = await deleteChatSession(sessionId);
		if (response?.[0] === true) {
			navigate('/home');
			updateStateValues({
				refetchChatHistoryList: true,
			});
		} else {
			message.error('Failed to delete chat session');
		}
		setInfo((prev) => ({ ...prev, deleteChatSessionLoading: false }));
	}, [deleteChatSession, sessionId, info?.deleteChatSessionLoading, globalChatMessages]);

	return (
		<div className={s.chatHeader}>
			<div className={s.leftContainer}>
				<div className={s.iconContainer} onClick={handleNavigateBack}>
					<LeftSvg />
				</div>
				<div className={s.chatTitle}>{currentChatData?.title || 'New Chat'}</div>
			</div>
			<div className={s.rightContainer}>
				{!isNewChat && (
					<Tooltip
						title={<div className={s.tooltip}>Delete Chat</div>}
						placement="bottom"
						color="transparent"
						arrow={false}
					>
						<button className={s.deleteChatBtn} onClick={handleDeleteChatClick}>
							<DeleteSvg />
						</button>
					</Tooltip>
				)}
			</div>
		</div>
	);
};

export default memo(ChatHeader);
