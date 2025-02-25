import React, { memo, useCallback, useState, useRef, useEffect, useContext, useMemo } from 'react';
import '../../../assets/scss/chat/chat.scss';
import { ReactComponent as ExpandChatIcon } from '../../../assets/svg/ai_agents/expand-chat-icon.svg';
import Context from '../../../context/context';
import ObjectID from 'bson-objectid';
import Markdown from 'react-markdown';
import { TypingEffect } from '../../../helpers/markdownHelper';
import useVoiceIntegration from '../../hooks/useVoiceIntegration';
import CitationsModal from '../../components/modalsV2/chat/CitationsModal';
import NoteComponentModal from '../../components/notes/NoteComponentModal';
import ChatBox from '../../components/homePage/ChatBox';

const moduleHelper = {
	tasks: 'tasks',
	'smart-file': 'form_filling',
	calendar: 'calendar',
};
const RecentChat = ({
	outerContainerStyle = {},
	chatList = [],
	onSend,
	aiChatLoading,
	handleAiUploadImage,
	customChatActions = false,
}) => {
	const {
		templates: {
			globalChatMessages,
			updateStateValues,
			citations,
			currentSessionId,
			updateAiChatMessageRating,
		},
	} = useContext(Context);

	const {
		isConnected,
		isMuted,
		audioLevel,
		connectToRoom,
		disconnect,
		toggleMute,
		toggleKrispNoiseFilter,
	} = useVoiceIntegration();

	const [info, setInfo] = useState({
		expanded: false,
		inputExpanded: false,
		bigToolbarIsOpen: false,
		chatQuery: '',
		position: { x: window.innerWidth / 2 - 900, y: 0 },
		addQuickAction: false,
		chatSessionId: null,
		uploadedImages: [],
		chatLoading: false,
		showFullPage: true,
		voiceIntegration: false,
		noteModalIsOpen: false,
		citationsModalIsOpen: false,
		chatList: [],
	});

	const chatContentRef = useRef(null);

	useEffect(() => {
		setInfo((prev) => ({
			...prev,
			chatList: globalChatMessages,
		}));
	}, [globalChatMessages]);

	useEffect(() => {
		smoothScrollToBottom();
	}, [globalChatMessages, chatList]);

	useEffect(() => {
		if (citations?.length > 0) {
			setInfo((prev) => ({
				...prev,
				citationsModalIsOpen: true,
			}));
		}
	}, [citations]);

	useEffect(() => {
		if (currentSessionId) {
			setInfo((prev) => ({ ...prev, chatSessionId: currentSessionId }));
		} else {
			updateStateValues({ currentSessionId: ObjectID().toString() });
		}
	}, [currentSessionId]);

	const handleRatingClick = async (type, messageId) => {
		try {
			if (messageId) {
				const message = info?.chatList?.find((chat) => chat?.messageId === messageId);
				if (message?.rating === null || message?.rating !== type) {
					await updateAiChatMessageRating({ rating: type }, messageId);
					let messages = [...info?.chatList];
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
	};

	const handleNoteComponentModalClose = () => {
		setInfo((prev) => ({
			...prev,
			noteModalIsOpen: false,
		}));
	};
	const handleCloseCitationsModal = () => {
		setInfo((prev) => ({
			...prev,
			citationsModalIsOpen: false,
		}));
	};

	const handleNoteComponentModalOpen = () => {
		setInfo((prev) => ({
			...prev,
			noteModalIsOpen: true,
		}));
	};

	const smoothScrollToBottom = useCallback(() => {
		if (chatContentRef?.current) {
			chatContentRef.current.scrollTo({
				top: chatContentRef.current.scrollHeight,
				behavior: 'smooth', // Enables smooth scrolling
			});
		}
	}, [chatContentRef]);
	const handleStopTypingEffect = () => {
		let messages = [...globalChatMessages];
		messages = messages?.map((message) => {
			if (message?.typingEffect) {
				message.typingEffect = false;
			}
			return message;
		});
		updateStateValues({ globalChatMessages: messages });
	};

	return (
		<>
			<div className="chat-container">
				<div className="chatBarContainer" style={{ width: '100%' }}>
					{/* header */}
					<div className="containerHeader" style={{ width: '100%' }}>
						<h1 className="containerHeaderTitle"></h1>
						<div className="iconContainer">
							{!info?.citationsModalIsOpen && (
								<ExpandChatIcon
									onClick={() => {
										setInfo((prev) => ({
											...prev,
											citationsModalIsOpen: true,
										}));
									}}
								/>
							)}
						</div>
					</div>

					{/* chat body */}

					<div
						className="chatBodyContainer"
						style={{
							width: `${info?.citationsModalIsOpen ? 'calc(100% - 400px)' : '100%'}`,
						}}
					>
						<div className={`chatBodyParentContainer`} ref={chatContentRef}>
							<div className="chatContent">
								{info?.chatList?.map((chat, index) =>
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
															messageId={chat?.messageId}
															customePencilClickFunc={
																handleNoteComponentModalOpen
															}
															smoothScrollToBottom={
																smoothScrollToBottom
															}
															handleRatingClick={handleRatingClick}
															showTypingEffect={chat?.typingEffect}
															onComplete={handleStopTypingEffect}
															rating={chat?.rating}
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

						<ChatBox autoFocus={true} />
					</div>
				</div>
			</div>
			<CitationsModal
				modalIsOpen={info?.citationsModalIsOpen}
				closeModal={handleCloseCitationsModal}
			/>
			<NoteComponentModal
				modalIsOpen={info?.noteModalIsOpen}
				closeModal={handleNoteComponentModalClose}
				handleRatingClick={handleRatingClick}
				chatList={info?.chatList}
			/>
		</>
	);
};

export default memo(RecentChat);
