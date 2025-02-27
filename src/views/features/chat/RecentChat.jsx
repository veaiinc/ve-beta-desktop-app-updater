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
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';
import { debounce } from 'lodash';

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
			getRecentChatMessages,
			recentChatStorage,
			moreRecentChatStorage,
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
		page: 1,
		currentPage: true,
	});

	const chatContentRef = useRef(null);
	const chatMessagesRef = useRef(globalChatMessages || []);
	const { sessionId } = useParams();

	useEffect(() => {
		return () => {
			updateStateValues({
				moreRecentChatStorage: null,
				recentChatStorage: null,
				globalChatMessages: [],
			});
		};
	}, []);

	useEffect(() => {
		if (sessionId) {
			getRecentChatMessages(sessionId);
			setInfo((prev) => ({ ...prev, chatLoading: true, chatSessionId: sessionId }));
			updateStateValues({ currentSessionId: sessionId });
		}
	}, [sessionId]);

	useEffect(() => {
		chatMessagesRef.current = [...(globalChatMessages || [])];
		smoothScrollToBottom();
	}, [globalChatMessages]);

	useEffect(() => {
		if (citations?.length > 0) {
			setInfo((prev) => ({
				...prev,
				citationsModalIsOpen: true,
			}));
		}
	}, [citations]);

	useEffect(() => {
		if (recentChatStorage) {
			recentChatHandler(recentChatStorage, true);
		}
	}, [recentChatStorage]);

	useEffect(() => {
		if (moreRecentChatStorage) {
			recentChatHandler(moreRecentChatStorage, true);
		}
	}, [moreRecentChatStorage]);

	const recentChatHandler = useCallback(
		(inComingData, fetcMore = false) => {
			const { data, hasNextPage, currentPage } = inComingData;
			let messages = [];
			for (let i = 0; i < data?.length; i++) {
				const { originalQuery = '', response, messageId } = data?.[i] || {};
				messages = [
					{
						message: originalQuery,
						type: 'user',
						typingEffect: false,
						messageId,
					},
					{
						message: response,
						type: 'AI',
						messageId,
						typingEffect: false,
						rating: null,
					},
				]?.concat(messages);
			}

			if (fetcMore) {
				updateStateValues({ globalChatMessages: messages?.concat(globalChatMessages) });
				if (chatContentRef?.current) {
					chatContentRef.current.scrollBy({
						top: 300, // Reduced from 500 for smoother feel
						behavior: 'smooth',
					});
				}
			} else {
				updateStateValues({ globalChatMessages: messages });
				setTimeout(() => {
					smoothScrollToBottom();
				}, 1000);
			}

			setInfo((prev) => ({ ...prev, chatLoading: false, hasNextPage, currentPage }));
		},
		[info, chatContentRef],
	);

	const handleRatingClick = async (type, messageId) => {
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
		[chatContentRef],
	);
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

	const fetchMoreData = useCallback(
		debounce(async () => {
			if (!info?.hasNextPage || info.chatLoading) {
				return;
			}
			getRecentChatMessages(sessionId, info?.currentPage + 1, true);
			setInfo((prev) => ({ ...prev, chatLoading: true }));
		}, 1000),
		[info, sessionId],
	);

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
						<div
							className={`chatBodyParentContainer`}
							ref={chatContentRef}
							id="scrollableDiv"
						>
							<InfiniteScroll
								dataLength={globalChatMessages?.length || 0}
								next={fetchMoreData}
								hasMore={info?.hasNextPage}
								loader={<FetchMoreLoaderComp />}
								scrollableTarget="scrollableDiv"
								inverse={true}
								style={{
									display: 'flex',
									flexDirection: 'column-reverse',
									transition: 'all 0.3s ease',
								}}
								height={'700px'}
								scrollThreshold={0.8}
								className="smooth-scroll"
							>
								<div className="chatContent">
									{(globalChatMessages || [])?.map((chat, index) =>
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
																handleRatingClick={
																	handleRatingClick
																}
																showTypingEffect={
																	chat?.typingEffect
																}
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
							</InfiniteScroll>
						</div>

						<ChatBox />
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
				chatList={chatMessagesRef.current || []}
			/>
		</>
	);
};

export default memo(RecentChat);
