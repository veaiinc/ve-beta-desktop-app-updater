import { memo, useContext, useState, useRef, useCallback, useEffect } from 'react';
import '../../../assets/scss/chat/formModal.scss';
import ReactModal from '../modalsV2';
import Context from '../../../context/context';
import AIMessage from './AIMessage';
import ChatBox from '../chat/ChatBox';
import { fetchOriginSelection } from '../../../helpers';
import { ReactComponent as ExpandIcon } from '../../../assets/svg/docs/expand.svg';

const FormModal = ({
	isOpen,
	closeModal,
	handleSendWebsocketMessage,
	latestStreamMesage,
	lastQuery,
	toggleLatestStreamMessage,
	workflowTemplateId,
	builderAgentMapper,
	agent,
}) => {
	return (
		<ReactModal
			isOpen={isOpen}
			closeModal={closeModal}
			modalType={'center'}
			customStyles={{
				overlay: { zIndex: 1111 },
				content: { zIndex: 1112 },
			}}
		>
			<div className="form-modal-container">
				<div className="section-30">
					<Section1
						handleSendWebsocketMessage={handleSendWebsocketMessage}
						latestStreamMesage={latestStreamMesage}
						lastQuery={lastQuery}
						toggleLatestStreamMessage={toggleLatestStreamMessage}
					/>
				</div>
				<div className="section-70">
					<Section2
						workflowTemplateId={workflowTemplateId}
						builderAgentMapper={builderAgentMapper}
						agent={agent}
						closeModal={closeModal}
					/>
				</div>
			</div>
		</ReactModal>
	);
};

const Section1 = ({
	handleSendWebsocketMessage,
	latestStreamMesage,
	lastQuery,
	toggleLatestStreamMessage,
}) => {
	const {
		templates: {
			globalChatMessages,
			currentSessionId,
			updateAiChatMessageRating,
			handleGlobalChatMessages,
		},
	} = useContext(Context);
	const chatContentRef = useRef(null);
	const chatMessagesRef = useRef(globalChatMessages?.[currentSessionId]?.messages || []);
	const scrollToBottomRef = useRef(true);

	useEffect(() => {
		const lastMessage =
			globalChatMessages?.[currentSessionId]?.messages?.[
				globalChatMessages?.[currentSessionId]?.messages?.length - 1
			];
		if (scrollToBottomRef.current && lastMessage?.contentType === 'loading') {
			smoothScrollToBottom();
			scrollToBottomRef.current = false;
		} else {
			if (
				!scrollToBottomRef.current &&
				lastMessage?.type?.toLowerCase() === 'ai' &&
				lastMessage?.stream_end
			) {
				scrollToBottomRef.current = true;
			}
		}
	}, [globalChatMessages?.[currentSessionId]?.messages]);

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
		[chatContentRef?.current],
	);

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

					handleGlobalChatMessages({
						updateExtraInfo: true,
						recentChatMessages: messages,
						sessionId: currentSessionId,
					});
					chatMessagesRef.current = messages;
				}
			}
		} catch (error) {
			console.log('error', error);
		}
	}, []);
	return (
		<div className="form-widget-chat-bar-container">
			{/* chat body */}
			<div className={`chatBodyParentContainer`} ref={chatContentRef}>
				<div className="chatContent">
					{globalChatMessages?.[currentSessionId]?.messages?.map((chat, index) =>
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
											<AIMessage
												text={chat?.message}
												smoothScrollToBottom={smoothScrollToBottom}
												handleRatingClick={handleRatingClick}
												messageId={chat?.messageId}
												rating={chat?.rating}
												messageData={chat}
												citations={chat?.citations}
												showCanvas={false}
											/>
										</div>
									) : (
										chat?.message || ''
									)}
								</div>
							</div>
						),
					)}
				</div>
			</div>
			<div className="chat-box-wrapper">
				<ChatBox
					showIconText={false}
					handleSendWebsocketMessage={handleSendWebsocketMessage}
					latestStreamMesage={latestStreamMesage}
					lastQuery={lastQuery}
					toggleLatestStreamMessage={toggleLatestStreamMessage}
					autoFocus={true}
				/>
			</div>
		</div>
	);
};

const Section2 = ({
	workflowTemplateId: workflowTemplateIdFromProps,
	builderAgentMapper,
	agent,
	closeModal,
}) => {
	const {
		templates: { documentPreviewIds },
	} = useContext(Context);
	const { workflowTemplateId } = documentPreviewIds;
	workflowTemplateIdFromProps = workflowTemplateId || workflowTemplateIdFromProps;

	return (
		<div className="section-content">
			<div className="form-modal-header">
				<span className="form-modal-header-title">
					VE.AI {builderAgentMapper[agent]?.label || 'Form'}
				</span>
				<ExpandIcon onClick={closeModal} style={{ cursor: 'pointer' }} />
			</div>
			<div className="builder-component">
				<iframe
					src={`/builder/${workflowTemplateIdFromProps}?isEmbed=true`} //dont change to fixed url only use origin
					title="Builder Preview"
					onClick={(e) => e.stopPropagation()}
					onMouseDown={(e) => e.stopPropagation()}
					onMouseUp={(e) => e.stopPropagation()}
					style={{
						backgroundColor: '#fff',
						opacity: 0,
						animation: 'fadeIn 0.3s ease forwards',
						transform: 'translate3d(0, 0, 0)',
						willChange: 'transform, opacity',
					}}
					width="100%"
					height="100%"
				/>
			</div>
		</div>
	);
};

export default memo(FormModal);
