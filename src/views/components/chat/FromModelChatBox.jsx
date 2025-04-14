import React, { useContext, useState, useCallback, useRef } from 'react';
import ChatBox from '../homePage/ChatBox';
import Context from '../../../context/context';
import { TypingEffect } from '../../../helpers/markdownHelper';
import '../../../assets/scss/chat/formModelChat.scss';
import Markdown from 'react-markdown';
import { ReactComponent as LinkLightSvg } from '../../../assets/svg/notes/loop-light.svg';
import { ReactComponent as LinkDarkSvg } from '../../../assets/svg/notes/loop-dark.svg';
import useChatStream from '../../hooks/useChatStream';
import { useParams, useSearchParams } from 'react-router-dom';
const FromModelChatBox = () => {
	const {
		templates: {
			globalChatMessages,
			globalLoadingMesssage,
			updateStateValues,
			updateAiChatMessageRating,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({
		lastQuery: '',
		latestStreamMesage: null,
	});
	const { socketRef, createWebSocketConnection, sendMessage } = useChatStream();
	const chatContentRef = useRef(null);
	const loadingMessageRef = useRef(globalLoadingMesssage);
	const chatMessagesRef = useRef(globalChatMessages || []);
	let { sessionId } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const smoothScrollToBottom = useCallback(
		(type) => {
			const scrollElement = chatContentRef?.current;
			if (!scrollElement) return;

			const scrollToPosition = (position) => {
				scrollElement.scrollTo({
					top: position,
					behavior: type === 'instant' ? 'auto' : 'smooth',
				});
			};

			if (type === 'custom') {
				const scrollHeight = scrollElement.scrollHeight;
				const scrollOffset = 100;
				scrollToPosition(scrollHeight - scrollOffset);
			} else {
				scrollToPosition(scrollElement.scrollHeight);
			}
		},
		[chatContentRef?.current, info?.initialRendering],
	);
	const handleSendWebsocketMessage = useCallback(
		async (data, lastQuery) => {
			try {
				await sendMessage(data);
				smoothScrollToBottom();
				setInfo((prev) => ({ ...prev, lastQuery: lastQuery }));
			} catch (error) {
				console.error('Failed to send message:', error);
				// Handle error appropriately (show notification, etc.)
			}
		},
		[sendMessage, setInfo],
	);

	const toggleLatestStreamMessage = useCallback(() => {
		setInfo((prev) => ({ ...prev, latestStreamMesage: null }));
	}, []);
	const handleRatingClick = useCallback(async (type, messageId) => {
		try {
			if (messageId) {
				const message = [...(chatMessagesRef.current || [])]?.find(
					(chat) => chat?.messageId === messageId,
				);
				if (message?.rating === null || message?.rating !== type) {
					await updateAiChatMessageRating({ rating: type }, messageId);
					let messages = [...(chatMessagesRef.current || [])];
					messages = messages?.map((chat) => {
						if (chat?.messageId === messageId) {
							chat.rating = type;
						}
						return chat;
					});
					updateStateValues({ globalChatMessages: messages });
				}
			}
		} catch (error) {
			console.log('error', error);
		}
	}, []);
	return (
		<div>
			<div className="form-model-chat-bar-container">
				<div className="chat-to-note-link-container">
					<div className="title">Link all chat to note</div>
					<div
						className={`link-icon-container ${info?.chatToNoteLoopOn ? 'active' : ''}`}
						// onClick={handleChatToNoteLoopClick}
					>
						{info?.chatToNoteLoopOn ? <LinkDarkSvg /> : <LinkLightSvg />}
					</div>
				</div>
				{/* chat body */}
				<div className={`chatBodyParentContainer`} ref={chatContentRef}>
					<div className="chatContent">
						{globalChatMessages?.map((chat, index) =>
							chat?.content ? (
								chat?.content
							) : (
								<div
									key={index}
									className={`chat-message ${chat?.type?.toLowerCase()}-message`}
								>
									<div className="message-content">
										{chat?.type?.toLowerCase() === 'ai' ? (
											<div className="content">
												<TypingEffect
													text={chat?.message}
													smoothScrollToBottom={smoothScrollToBottom}
													handleRatingClick={handleRatingClick}
													messageId={chat?.messageId}
													showTypingEffect={chat?.typingEffect}
													rating={chat?.rating}
													messageData={chat}
													citations={chat?.citations}
												/>
											</div>
										) : (
											<Markdown>{chat?.message}</Markdown>
										)}
									</div>
								</div>
							),
						)}
					</div>
				</div>
				<div className="chat-box-wrapper">
					<ChatBox
						showChatLabels={false}
						handleSendWebsocketMessage={handleSendWebsocketMessage}
						latestStreamMesage={info?.latestStreamMesage}
						lastQuery={info?.lastQuery}
						toggleLatestStreamMessage={toggleLatestStreamMessage}
					/>
				</div>
			</div>
		</div>
	);
};

export default FromModelChatBox;
