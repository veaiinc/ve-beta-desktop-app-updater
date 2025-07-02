import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import s from '../../../assets/scss/chat/chatHeader.module.scss';
import { ReactComponent as LeftSvg } from '../../../assets/svg/activity/left.svg';
import { ReactComponent as DeleteSvg } from '../../../assets/svg/delete.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as TickSvg } from '../../../assets/svg/tick.svg';

import { Tooltip } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import Context from '../../../context/context';

const ChatHeader = ({
	sessionId,
	onNavigateBack,
	isNewChat = false,
	smoothScrollToParticularMessage = null,
}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const timeoutRef = useRef(null);
	const {
		templates: { currentChatData, deleteChatSession, globalChatMessages },
	} = useContext(Context);

	const [info, setInfo] = useState({
		deleteChatSessionLoading: false,
		chatDropdownExpanded: false,
		userMessages: [],
		activeUserMessageIndex: -1,
	});

	useEffect(() => {
		const messages = globalChatMessages?.[sessionId]?.messages;

		if (messages?.length > 0) {
			const userMessages = [];
			let index = 0,
				lastIndex;

			for (const message of messages) {
				if (message?.type?.toLowerCase() === 'user') {
					userMessages.push({
						message: message?.message,
						index: index++,
					});
				}
			}

			lastIndex = userMessages?.length - 1;

			if (userMessages?.length > 0) {
				setInfo((prev) => ({
					...prev,
					activeUserMessageIndex: lastIndex,
					userMessages,
				}));
			}
		}
	}, [globalChatMessages?.[sessionId]?.messages?.length]);

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

	const handleActiveUserMessageIndexChange = useCallback(
		(index) => {
			if (index === info?.activeUserMessageIndex) return;

			smoothScrollToParticularMessage?.(2 * info?.userMessages?.[index]?.index);
			setInfo((prev) => ({
				...prev,
				activeUserMessageIndex: index,
				chatDropdownExpanded: false,
			}));
		},
		[info?.activeUserMessageIndex, info?.userMessages, smoothScrollToParticularMessage],
	);

	const handleMouseEnter = useCallback(() => {
		// timeoutRef.current = setTimeout(() => {
		setInfo((prev) => {
			const chatDropdownExpanded = prev.chatDropdownExpanded;
			if (chatDropdownExpanded) {
				return prev;
			}
			return {
				...prev,
				chatDropdownExpanded: true,
			};
		});
		// }, [300]);
	}, []);

	const handleMouseLeave = useCallback(() => {
		// if (timeoutRef.current) {
		// 	clearTimeout(timeoutRef.current);
		// 	timeoutRef.current = null;
		// 	return;
		// }
		setInfo((prev) => {
			const chatDropdownExpanded = prev.chatDropdownExpanded;
			if (!chatDropdownExpanded) {
				return prev;
			}
			return {
				...prev,
				chatDropdownExpanded: false,
			};
		});
	}, []);

	return (
		<div className={s.wrapper}>
			<div className={`${s.chatHeader} ${info?.chatDropdownExpanded ? s.expanded : ''}`}>
				<div className={`${s.headerInfo} headerInfo`} onMouseLeave={handleMouseLeave}>
					{info?.userMessages?.length > 1 && (
						<div className={s.nonActiveQuestionsContainer}>
							{info?.userMessages?.map((message) =>
								message?.index !== info?.activeUserMessageIndex ? (
									<div
										className={`${s.nonActiveQuestion}`}
										role="button"
										onClick={() =>
											handleActiveUserMessageIndexChange(message?.index)
										}
										key={message?.index}
									>
										{message?.message || ''}
									</div>
								) : (
									''
								),
							)}
						</div>
					)}

					<div
						className={s.leftContainer}
						onMouseEnter={info?.userMessages?.length > 1 ? handleMouseEnter : undefined}
					>
						<div
							className={`${s.questionWrapper} ${
								info?.chatDropdownExpanded ? s.expanded : ''
							}`}
						>
							<div className={s.chatQuestionContainer}>
								{info?.userMessages?.length > 1 && (
									<div
										className={`${s.iconContainer} ${
											info?.chatDropdownExpanded ? s.expanded : ''
										}`}
									>
										<ChevronRightThinSvg width={18} height={18} />
									</div>
								)}

								<div className={s.activeQuestion}>
									{info?.userMessages?.[info?.activeUserMessageIndex]?.message ||
										''}
								</div>
							</div>
						</div>
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
			</div>
			{info?.chatDropdownExpanded && (
				<div
					className={s.overlay}
					onClick={() => setInfo((prev) => ({ ...prev, chatDropdownExpanded: false }))}
				/>
			)}
		</div>
	);
};

export default memo(ChatHeader);
