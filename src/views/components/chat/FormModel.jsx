import React, { useState, useRef, useContext, useCallback, useEffect } from 'react';
import '../../../assets/scss/chat/formModel.scss';
import { ReactComponent as ExpandIcon } from '../../../assets/svg/docs/expand.svg';
import { fetchOriginSelection } from '../../../helpers';
import Context from '../../../context/context';
import ChatBox from './ChatBox';
import Markdown from 'react-markdown';
import { ReactComponent as LinkLightSvg } from '../../../assets/svg/notes/loop-light.svg';
import { ReactComponent as LinkDarkSvg } from '../../../assets/svg/notes/loop-dark.svg';
import { useParams, useSearchParams } from 'react-router-dom';
import AIMessage from './AIMessage';
const FormModel = ({
	workflowTemplateId,
	moduleTemplateId,
	handleSendWebsocketMessage,
	latestStreamMesage,
	lastQuery,
	toggleLatestStreamMessage,
	handleViewDocument,
	showViewDocument,
	messageData,
	isLastMessage = false,
}) => {
	const [isExpanded, setIsExpanded] = useState(false);
	const formRef = useRef(null);
	const origin = fetchOriginSelection();

	useEffect(() => {
		if (showViewDocument || isExpanded) return;
		setTimeout(() => {
			let isExpanded =
				messageData?.stream_end && isLastMessage && !messageData?.isOldMessage
					? true
					: false;
			setIsExpanded(isExpanded);
			if (handleViewDocument) {
				handleViewDocument(isExpanded);
			}
		}, 1000);
	}, [showViewDocument, messageData?.stream_end, isLastMessage]);

	const handleExpand = () => {
		setIsExpanded(!isExpanded);
		if (handleViewDocument) {
			handleViewDocument(!isExpanded);
		}
	};
	return (
		<div className={`form-modal-wrapper ${isExpanded ? 'form-modal-wrapper-expanded' : ''}`}>
			<div
				className={`form-model-container ${isExpanded ? 'expanded' : ''}`}
				ref={formRef}
				style={{
					...(isExpanded && {
						'--top': `${formRef.current?.getBoundingClientRect()?.top}px`,
						'--left': `${formRef.current?.getBoundingClientRect()?.left}px`,
					}),
					willChange: 'transform, width, height',
					transform: 'translate3d(0, 0, 0)',
				}}
			>
				<div className="form-model-header">
					<span className="form-model-header-title">VE.AI Form</span>
					<ExpandIcon
						className={`expand-icon ${isExpanded ? 'expanded' : ''}`}
						onClick={handleExpand}
					/>
				</div>
				<div className="form-content">
					{!isExpanded ? (
						<div className="section-not-expanded">
							<iframe
								src={`${origin}/preview/short/${workflowTemplateId}?module=${moduleTemplateId}&isPubic=${moduleTemplateId?.isPublic}&restrictClick=true`}
								title="Builder Preview"
								onClick={(e) => e.stopPropagation()}
								onMouseDown={(e) => e.stopPropagation()}
								onMouseUp={(e) => e.stopPropagation()}
								style={{
									backgroundColor: '#fff',
									opacity: isExpanded ? 0 : 1,
									transition: 'opacity 0.3s ease',
									transform: 'translate3d(0, 0, 0)',
									willChange: 'transform, opacity',
								}}
								width="100%"
								height="100%"
							/>
						</div>
					) : (
						<>
							<div className="section-30">
								<Section1
									handleSendWebsocketMessage={handleSendWebsocketMessage}
									latestStreamMesage={latestStreamMesage}
									lastQuery={lastQuery}
									toggleLatestStreamMessage={toggleLatestStreamMessage}
								/>
							</div>
							<div className="section-70">
								<Section2 workflowTemplateId={workflowTemplateId} />
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

const Section1 = ({
	handleSendWebsocketMessage,
	latestStreamMesage,
	lastQuery,
	toggleLatestStreamMessage,
}) => {
	const {
		templates: { globalChatMessages, updateStateValues, updateAiChatMessageRating },
	} = useContext(Context);
	const [info, setInfo] = useState({
		lastQuery: '',
		latestStreamMesage: null,
	});
	const chatContentRef = useRef(null);
	const chatMessagesRef = useRef(globalChatMessages || []);
	const scrollToBottomRef = useRef(true);

	useEffect(() => {
		const lastMessage = globalChatMessages[globalChatMessages?.length - 1];
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
	}, [globalChatMessages]);

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
		<div className="form-model-chat-bar-container">
			{/* <div className="chat-to-note-link-container">
				<div className="title">Link all chat to note</div>
				<div
					className={`link-icon-container ${info?.chatToNoteLoopOn ? 'active' : ''}`}
					// onClick={handleChatToNoteLoopClick}
				>
					{info?.chatToNoteLoopOn ? <LinkDarkSvg /> : <LinkLightSvg />}
				</div>
			</div> */}
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
											<AIMessage
												text={chat?.message}
												smoothScrollToBottom={smoothScrollToBottom}
												handleRatingClick={handleRatingClick}
												messageId={chat?.messageId}
												showTypingEffect={chat?.typingEffect}
												rating={chat?.rating}
												messageData={chat}
												citations={chat?.citations}
												showCanvas={false}
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
					showIconText={false}
					handleSendWebsocketMessage={handleSendWebsocketMessage}
					latestStreamMesage={latestStreamMesage}
					lastQuery={lastQuery}
					toggleLatestStreamMessage={toggleLatestStreamMessage}
				/>
			</div>
		</div>
	);
};

const Section2 = ({ workflowTemplateId: workflowTemplateIdFromProps }) => {
	const {
		templates: { documentPreviewIds },
	} = useContext(Context);
	const { workflowTemplateId, moduleTemplateId } = documentPreviewIds;
	const [showIframe, setShowIframe] = useState(false);
	workflowTemplateIdFromProps = workflowTemplateId || workflowTemplateIdFromProps;
	const origin = fetchOriginSelection();
	useEffect(() => {
		// Delay iframe loading to wait for expansion animation
		const timer = setTimeout(() => {
			setShowIframe(true);
		}, 300); // Match the expansion animation duration

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="section-content">
			{showIframe && (
				<iframe
					src={`${origin}/${workflowTemplateIdFromProps}?isEmbed=true`} //dont change to fixed url only use origin
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
			)}
		</div>
	);
};

export default FormModel;
