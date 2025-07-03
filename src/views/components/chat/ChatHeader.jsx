import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import s from '../../../assets/scss/chat/chatHeader.module.scss';
import { ReactComponent as LeftSvg } from '../../../assets/svg/activity/left.svg';
import { ReactComponent as DeleteSvg } from '../../../assets/svg/delete.svg';
import { ReactComponent as ChevronRightThinSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as TickSvg } from '../../../assets/svg/tick.svg';
import { ReactComponent as StarSvg } from '../../../assets/svg/home_page/star.svg';

import { Tooltip } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import Context from '../../../context/context';
import jwtDecode from 'jwt-decode';
import { message } from '../globalComponents/CustomToast';

const ChatHeader = ({
	sessionId,
	onNavigateBack,
	isNewChat = false,
	smoothScrollToParticularMessage = null,
	showDeleteChat = true,
}) => {
	const navigate = useNavigate();
	const location = useLocation();
	const {
		templates: {
			currentChatData,
			deleteChatSession,
			globalChatMessages,
			updatechatSessionFavourite,
		},
		aiSetup: { aiChatSessions, updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState({
		chatDropdownExpanded: false,
		userMessages: [],
		activeUserMessageIndex: -1,
		isFavourite: false,
		userId: null,
	});
	const deleteChatSessionLoadingRef = useRef(false);

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

	useEffect(() => {
		const userId = jwtDecode(localStorage.getItem('usertoken'))?.user_id;
		setInfo((prev) => ({ ...prev, userId }));
	}, []);

	useEffect(() => {
		if (currentChatData) {
			const favorites = currentChatData?.favorites || [];
			const isFavourite = favorites?.includes(info?.userId) || false;
			setInfo((prev) => ({ ...prev, isFavourite }));
		}
	}, [currentChatData, info?.userId]);

	const handleNavigateBack = useCallback(() => {
		const pathname = location?.pathname?.split('/')?.[1];
		if (pathname === 'calendar' || pathname === 'contacts' || pathname === 'tasks') {
			onNavigateBack?.();
		} else {
			navigate(-1);
		}
	}, [location?.pathname]);

	const handleDeleteChatClick = useCallback(async () => {
		if (deleteChatSessionLoadingRef.current || globalChatMessages?.[sessionId]?.isStreaming) {
			return;
		}
		deleteChatSessionLoadingRef.current = true;
		const response = await deleteChatSession(sessionId);
		if (response?.[0] === true) {
			navigate('/home');
			updateStateValues({
				refetchChatHistoryList: true,
			});
		} else {
			message.error('Failed to delete chat session');
		}
		deleteChatSessionLoadingRef.current = false;
	}, [deleteChatSession, sessionId, globalChatMessages]);

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

	const handleFavouriteClick = useCallback(async () => {
		if (globalChatMessages?.[sessionId]?.isStreaming) {
			return;
		}
		const isFavourite = !info?.isFavourite;
		const response = await updatechatSessionFavourite(sessionId, isFavourite);
		if (response?.[0] === true) {
			const data = [...(aiChatSessions?.data || [])];
			const sessionIndex = data?.findIndex((session) => session?._id === sessionId);
			if (sessionIndex !== -1) {
				const favorites = data[sessionIndex]?.favorites || [];
				if (isFavourite) {
					favorites?.push(info?.userId);
				} else {
					const index = favorites?.indexOf(info?.userId);
					if (index !== -1) {
						favorites?.splice(index, 1);
					}
				}
				data[sessionIndex] = {
					...(data[sessionIndex] || {}),
					favorites,
				};
			}
			updateStateValues({
				aiChatSessions: {
					...(aiChatSessions || {}),
					data,
				},
			});
		} else {
			message.error('Failed to update favourites');
		}
	}, [
		info?.isFavourite,
		info?.userId,
		sessionId,
		currentChatData,
		updatechatSessionFavourite,
		aiChatSessions,
		updateStateValues,
		globalChatMessages,
	]);

	return (
		<div className={s.wrapper}>
			<div className={`${s.chatHeader} ${info?.chatDropdownExpanded ? s.expanded : ''}`}>
				<div className={`${s.headerInfo} headerInfo`} onMouseLeave={handleMouseLeave}>
					{info?.userMessages?.length > 1 && (
						<div
							className={`${s.nonActiveQuestionsContainer} nonActiveQuestionsContainer`}
						>
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
							<>
								<Tooltip
									title={
										<div className={s.tooltip}>
											{info?.isFavourite
												? 'Remove from favourites'
												: 'Add to favourites'}
										</div>
									}
									placement="bottom"
									color="transparent"
									arrow={false}
								>
									<button
										className={`${s.favouriteBtn} ${
											info?.isFavourite ? s.active : ''
										}`}
										onClick={handleFavouriteClick}
									>
										<StarSvg />
									</button>
								</Tooltip>
								<Tooltip
									title={<div className={s.tooltip}>Delete Chat</div>}
									placement="bottom"
									color="transparent"
									arrow={false}
								>
									<button
										className={s.deleteChatBtn}
										onClick={handleDeleteChatClick}
									>
										<DeleteSvg />
									</button>
								</Tooltip>
							</>
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
