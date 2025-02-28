import React, { memo, useCallback, useState, useRef, useEffect, useContext, useMemo } from 'react';
// import '../../../assets/scss/ai_agents/bottomToolbar.scss';
import '../../../assets/scss/chat/chat.scss';
import { ReactComponent as Plus } from '../../../assets/svg/ai_agents/Plus.svg';
import { ReactComponent as Home } from '../../../assets/svg/ai_agents/home.svg';
import { ReactComponent as Settings } from '../../../assets/svg/ai_agents/settings.svg';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import { ReactComponent as Expand } from '../../../assets/svg/bottomToolbar/expand.svg';
import { ReactComponent as ArrowUp } from '../../../assets/svg/ai_agents/arrow-up.svg';
import { ReactComponent as ExpandChatIcon } from '../../../assets/svg/ai_agents/expand-chat-icon.svg';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { Alert, Image, message, Spin, Tooltip } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import Context from '../../../context/context';
import ObjectID from 'bson-objectid';
import { useLocation } from 'react-router-dom';
import Markdown from 'react-markdown';
import { TypingEffect } from '../../../helpers/markdownHelper';
import { ReactComponent as Filter } from '../../../assets/svg/ai_agents/filter.svg';
import { ReactComponent as Arroba } from '../../../assets/svg/ai_agents/arroba.svg';
import { ReactComponent as PaperClip } from '../../../assets/svg/ai_agents/paper-clip.svg';
import { ReactComponent as Mic } from '../../../assets/svg/ai_agents/mic.svg';
import { getBase64 } from '../../../helpers';
import WorkflowSlugSelector from '../../components/calendar/WorkflowSlugSelector';
import { ReactComponent as AiSparkel } from '../../../assets/svg/calendar/aiSparkel.svg';
import useVoiceIntegration from '../../hooks/useVoiceIntegration';
import CitationsModal from '../../components/modalsV2/chat/CitationsModal';
import NoteComponentModal from '../../components/notes/NoteComponentModal';
import Skeleton from 'react-loading-skeleton';
import { CitationsTooltip } from '../../components/modalsV2/chat/CitationsTooltip';
import ChatBox from '../../components/homePage/ChatBox';

const moduleHelper = {
	tasks: 'tasks',
	'smart-file': 'form_filling',
	calendar: 'calendar',
};
const Chat = ({
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

export default memo(Chat);
