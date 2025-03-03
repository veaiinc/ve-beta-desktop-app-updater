import React, { memo, useCallback, useState, useRef, useEffect, useContext, useMemo } from 'react';
import '../../../assets/scss/chat/chat.scss';
import { ReactComponent as ExpandChatIcon } from '../../../assets/svg/ai_agents/expand-chat-icon.svg';
import Context from '../../../context/context';
import Markdown from 'react-markdown';
import { TypingEffect } from '../../../helpers/markdownHelper';
import CitationsModal from '../../components/modalsV2/chat/CitationsModal';
import NoteComponentModal from '../../components/notes/NoteComponentModal';
import ChatBox from '../../components/homePage/ChatBox';
import { useParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';
import { debounce } from 'lodash';
import useChatStream from '../../hooks/useChatStream';

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
			updateAiChatMessageRating,
			getRecentChatMessages,
			recentChatStorage,
			moreRecentChatStorage,
			handleStreamIncomingMessage,
			handleStreamMessageChunk,
		},
	} = useContext(Context);

	const { socketRef, createWebSocketConnection, sendMessage } = useChatStream();
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
		latestStreamMesage: null,
		lastQuery: '',
		lastVisibleMessageId: null,
		lastVisibleUserMessageIndex: null,
		renderingTwice: false,
	});

	const chatContentRef = useRef(null);
	const chatMessagesRef = useRef(globalChatMessages || []);
	const { sessionId } = useParams();

	const aiMessagesRef = useRef([]);
	const aiCitationsByIdRef = useRef({});

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
			if (info?.renderingTwice) {
				//clearing context state when rendering different session
				updateStateValues({
					moreRecentChatStorage: null,
					recentChatStorage: null,
					globalChatMessages: [],
				});
			}

			getRecentChatMessages(sessionId);
			setInfo((prev) => ({
				...prev,
				chatLoading: true,
				chatSessionId: sessionId,
				renderingTwice: true,
			}));
			updateStateValues({ currentSessionId: sessionId });
			createWebSocketConnection(sessionId, onMessageFunc);

			return () => {
				socketRef?.current?.close();
			};
		}
	}, [sessionId]);

	useEffect(() => {
		chatMessagesRef.current = [...(globalChatMessages || [])];

		chatMessagesRef.current?.forEach((message) => {
			if (message?.type?.toLowerCase() === 'ai') {
				const messageId = message?.messageId;
				if (message?.citations && !aiCitationsByIdRef.current[messageId]) {
					aiCitationsByIdRef.current[messageId] = message?.citations;
				}
			}
		});
		smoothScrollToBottom();

		const visibleMessagesSet = new Set();
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						visibleMessagesSet.add(entry.target);
					} else {
						visibleMessagesSet.delete(entry.target);
					}
				});
				const visibleMessages = Array.from(visibleMessagesSet).sort(
					(a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
				);
				if (visibleMessages.length > 0) {
					const lastVisibleMessage = visibleMessages[visibleMessages.length - 1];

					let lastVisibleAIMessageIndex = -1;
					for (let i = 0; i < chatMessagesRef.current.length; i++) {
						if (
							chatMessagesRef.current[i].messageId ===
								lastVisibleMessage.dataset.messageId &&
							chatMessagesRef.current[i]?.type?.toLowerCase() === 'ai'
						) {
							lastVisibleAIMessageIndex = i;
							break;
						}
					}
					let lastVisibleUserMessageIndex = null;

					if (lastVisibleAIMessageIndex > 0) {
						lastVisibleUserMessageIndex = lastVisibleAIMessageIndex - 1;

						if (
							chatMessagesRef.current[
								lastVisibleUserMessageIndex
							]?.type?.toLowerCase() !== 'user'
						) {
							lastVisibleUserMessageIndex = null;
						}
					}
					setInfo((prev) => ({
						...prev,
						lastVisibleMessageId: lastVisibleMessage.dataset.messageId,
						lastVisibleUserMessageIndex,
					}));
				}
			},
			{
				root: chatContentRef.current,
				threshold: 0.01,
			},
		);
		aiMessagesRef.current.forEach((msg) => observer.observe(msg));
		return () => {
			aiMessagesRef.current.forEach((msg) => observer.unobserve(msg));
			visibleMessagesSet.clear();
		};
	}, [globalChatMessages]);

	useEffect(() => {
		if (info?.lastVisibleMessageId) {
			updateStateValues({
				citations: aiCitationsByIdRef.current[info?.lastVisibleMessageId],
			});
		}
	}, [info?.lastVisibleMessageId]);

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
				const { originalQuery = '', response, _id: messageId, citations } = data?.[i] || {};

				messages = [
					{
						message: originalQuery,
						type: 'user',
						typingEffect: false,
					},
					{
						message: response,
						type: 'AI',
						messageId,
						typingEffect: false,
						rating: null,
						citations,
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

	// stream chat

	const onMessageFunc = useCallback(
		(event) => {
			let { data = '' } = event || {};
			data = JSON.parse(data);

			if (data?.stream_end) {
				handleStreamIncomingMessage(data);
				setInfo((prev) => ({ ...prev, latestStreamMesage: data }));
			}
			const { message_chunk_id } = data;
			if (message_chunk_id) {
				handleStreamMessageChunk(data, message_chunk_id);
			}
		},
		[info],
	);

	const handleSendWebsocketMessage = useCallback(
		async (data, lastQuery) => {
			try {
				await sendMessage(data);
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
									// justifyContent: 'flex-end',
								}}
								height={'calc(100vh - 180px)'}
								scrollThreshold={0.8}
								className="smooth-scroll"
							>
								<div className="chatContent" style={{ flex: 1 }}>
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
														<div
															className="content"
															style={{
																opacity:
																	chat?.messageId ===
																	info?.lastVisibleMessageId
																		? 1
																		: 0.6,
															}}
															ref={(el) => {
																if (
																	el &&
																	!aiMessagesRef.current.includes(
																		el,
																	)
																) {
																	aiMessagesRef?.current?.push(
																		el,
																	);
																}
															}}
															data-message-id={chat?.messageId}
														>
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
																rating={chat?.rating}
																citations={chat?.citations}
																messageData={chat}
															/>
														</div>
													) : (
														<div
															style={{
																transition: 'opacity 0.3s ease',
																opacity:
																	index ===
																	info?.lastVisibleUserMessageIndex
																		? 1
																		: 0.6,
															}}
														>
															<Markdown>{chat?.message}</Markdown>
														</div>
													)}
												</div>
											</div>
										),
									)}
								</div>
							</InfiniteScroll>
						</div>

						<ChatBox
							handleSendWebsocketMessage={handleSendWebsocketMessage}
							latestStreamMesage={info?.latestStreamMesage}
							lastQuery={info?.lastQuery}
							toggleLatestStreamMessage={toggleLatestStreamMessage}
						/>
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
				chatList={globalChatMessages || []}
			/>
		</>
	);
};

export default memo(RecentChat);
