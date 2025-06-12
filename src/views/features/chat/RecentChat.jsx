import React, { memo, useCallback, useState, useRef, useEffect, useContext, Fragment } from 'react';
import '../../../assets/scss/chat/chat.scss';
import { ReactComponent as ExpandChatIcon } from '../../../assets/svg/ai_agents/expand-chat-icon.svg';
import {
	handleDeepSearchChainOfThought,
	handleDeepResearchChainOfThought,
} from '../../../helpers/chatHelpers';
import { ReactComponent as LeftSvg } from '../../../assets/svg/activity/left.svg';
import Context from '../../../context/context';
import { UserMessageRenderer } from '../../../helpers/markdownHelper';
import CitationsModal from '../../components/modalsV2/chat/CitationsModal';
import NoteComponentModal from '../../components/notes/NoteComponentModal';
import ChatBox from '../../components/chat/ChatBox';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';
import { debounce } from 'lodash';
import useChatStream from '../../hooks/useChatStream';
import ObjectID from 'bson-objectid';
import { ReactComponent as PlusCircleSvg } from '../../../assets/svg/ai_agents/plus-cricle.svg';
import AIMessageRenderer from '../../components/chat/AIMessageRenderer';
import { Tooltip } from 'antd';

let throttleTimer = null;
const RecentChat = ({
	outerContainerStyle = {},
	chatList = [],
	onSend,
	aiChatLoading,
	handleAiUploadImage,
	customChatActions = false,
	isPublicChat = false,
	isPreview = false,
	sId = null,
	showIconText = true,
	autoFocus = true,
	customChatBoxClick = null,
	sessionIdChanged = false,
	onChangeSessionId = null,
	chatActive = false,
	onNewChatBtnClick = null,
	onNavigateBack = null,
}) => {
	const {
		templates: {
			globalChatMessages,
			updateStateValues,
			updateAiChatMessageRating,
			getRecentChatMessages,
			recentChatStorage,
			moreRecentChatStorage,
			handleStreamIncomingMessage,
			handleStreamMessageChunk,
			globalLoadingMesssage,
			chatInfo,
			currentChatData,
			chatHistoryDrawerIsOpen,
			currentSessionId,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		position: { x: window?.innerWidth / 2 - 900, y: 0 },
		chatSessionId: null,
		uploadedImages: [],
		chatLoading: false,
		voiceIntegration: false,
		noteModalIsOpen: false,
		citationsModalIsOpen: false,
		page: 1,
		currentPage: true,
		latestStreamMesage: null,
		lastQuery: '',
		activeAIMessageIndex: null,
		activeAIMessageId: null,
		activeUserMessageIndex: null,
		renderingTwice: false,
		initialRendering: false,
		scrollExecuted: false,
		previousAgentType: null,
		showScrollButton: false,
		showViewDocument: false,
	});

	const { createWebSocketConnection, sendMessage } = useChatStream();
	const chatContentRef = useRef(null);
	const loadingMessageRef = useRef(globalLoadingMesssage);
	const chatMessagesRef = useRef(globalChatMessages || []);
	let { sessionId } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const userMessagesRefs = useRef({});
	// const aiMessagesRef = useRef([]);
	// const previousAiMessagesRef = useRef([]);
	// const aiCitationsByIdRef = useRef({});
	const tabsRefs = useRef({});
	const previousTabsRefs = useRef({});
	const isFirstTimeConnectingToPublicChatRef = useRef(true);
	const navigate = useNavigate();
	const location = useLocation();

	sessionId = isPreview ? sId : sessionId;

	useEffect(() => {
		if (sessionIdChanged && chatActive) {
			const agentType = 'mulit_agent';
			createWebSocketConnection(sessionId, onMessageFunc, agentType, isPublicChat);
			onChangeSessionId?.();
		}
	}, [sessionIdChanged, chatActive]);

	useEffect(() => {
		window?.addEventListener('resize', handleResize);

		handleResize(0);

		return () => {
			window?.removeEventListener('resize', handleResize);
			clearTimeout(throttleTimer);

			setTimeout(() => {
				tabsRefs.current = {};
				userMessagesRefs.current = {};
				updateStateValues({
					moreRecentChatStorage: null,
					recentChatStorage: null,
					globalChatMessages: [],
					citations: null,
					chatPayload: {
						workflowTemplateId: null,
						moduleTemplateId: null,
					},
				});
			}, 0);
			updateStateValues({ currentSessionId: ObjectID()?.toString() });
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
					citations: null,
					chatPayload: {
						workflowTemplateId: null,
						moduleTemplateId: null,
					},
				});
				tabsRefs.current = {};
				userMessagesRefs.current = {};
				setInfo((prev) => ({
					...prev,
					scrollExecuted: false,
				}));
				// aiMessagesRef.current = [];
			}

			getRecentChatMessages(sessionId, 1, false, 1000, isPublicChat);
			setInfo((prev) => ({
				...prev,
				chatLoading: true,
				chatSessionId: sessionId,
				renderingTwice: true,
			}));
			if (currentSessionId !== sessionId) {
				updateStateValues({ currentSessionId: sessionId });
			}
		}
	}, [sessionId]);

	useEffect(() => {
		const agentType = searchParams?.get('agentType');
		const assistantId = searchParams?.get('assistantId') || null;
		if ((!agentType && location?.pathname?.includes('knowledge-agent')) || chatActive) {
			return;
		}

		if (agentType) {
			updateStateValues({ chatInfo: { ...chatInfo, agentType, assistantId } });
		}

		if (sessionId && !isPublicChat) {
			createWebSocketConnection(sessionId, onMessageFunc, agentType, isPublicChat);
		}

		if (sessionId && isPublicChat && isFirstTimeConnectingToPublicChatRef.current) {
			createWebSocketConnection(sessionId, onMessageFunc, agentType, isPublicChat);
			isFirstTimeConnectingToPublicChatRef.current = false;
		}
	}, [sessionId, searchParams]);

	useEffect(() => {
		if (globalChatMessages?.length > 2 && !info?.scrollExecuted) {
			setTimeout(() => {
				smoothScrollToLastMessage();
			}, 0);
			setInfo((prev) => ({ ...prev, scrollExecuted: true }));
		}
	}, [globalChatMessages]);

	useEffect(() => {
		if (!chatContentRef?.current || !tabsRefs?.current) return;
		previousTabsRefs.current = tabsRefs.current;
		const observer = new IntersectionObserver(
			() => {
				Object?.values(tabsRefs?.current)?.forEach((entry) => {
					if (
						entry?.getBoundingClientRect()?.top <
						chatContentRef?.current?.getBoundingClientRect()?.top
					) {
						if (!entry?.classList?.contains('sticky-element')) {
							entry?.classList?.add('sticky-element');
						}
					} else {
						if (entry?.classList?.contains('sticky-element')) {
							entry?.classList?.remove('sticky-element');
						}
					}
				});
			},
			{
				root: chatContentRef?.current, // Observe within the parent
				threshold: [0.99, 1], // Triggers when any part enters
			},
		);

		Object?.values(tabsRefs?.current)?.forEach((tab) => {
			observer?.observe(tab);
		});
		return () => {
			Object?.values(previousTabsRefs?.current)?.forEach((tab) => {
				observer.unobserve(tab);
			});
		};
	}, [globalChatMessages]);

	useEffect(() => {
		chatMessagesRef.current = [...(globalChatMessages || [])];

		const container = chatContentRef.current;
		if (!container) return;
		const visibleUserMessagesSet = new Set();

		const observer = new IntersectionObserver(
			(entries) => {
				entries?.forEach((entry) => {
					const bounding = entry?.boundingClientRect;
					const rootBounds = entry?.rootBounds;

					// Check if it is entering the top half
					if (entry?.isIntersecting) {
						visibleUserMessagesSet?.add(entry?.target);
					} else {
						// If it scrolled past the top (i.e. fully out of view and above)
						const isAboveTop = bounding?.bottom < rootBounds?.top;

						if (isAboveTop) {
							visibleUserMessagesSet?.add(entry?.target);
						} else {
							visibleUserMessagesSet?.delete(entry?.target);
						}
					}
				});

				const visibleUserMessages = [...visibleUserMessagesSet]?.map(
					(m) => m?.dataset?.index,
				);
				if (visibleUserMessages?.length > 0) {
					const activeUserMessageIndex = Number(
						visibleUserMessages?.[visibleUserMessages?.length - 1],
					);
					const activeAIMessageIndex = activeUserMessageIndex + 1;
					setInfo((prev) => ({
						...prev,
						activeUserMessageIndex,
						activeAIMessageIndex,
					}));
				}
			},
			{
				root: container,
				rootMargin: '-10% 0px -50% 0px',
				threshold: 0,
			},
		);

		// Observe each user message element
		Object?.values(userMessagesRefs.current)?.forEach((el) => {
			observer.observe(el);
		});
		return () => {
			visibleUserMessagesSet?.clear();
			observer.disconnect();
		};
	}, [globalChatMessages]);

	// useEffect(() => {
	// 	if (info?.activeAIMessageId) {
	// 		updateStateValues({
	// 			citations: aiCitationsByIdRef.current[info?.activeAIMessageId],
	// 		});
	// 	}
	// }, [info?.activeAIMessageId]);

	useEffect(() => {
		if (recentChatStorage) {
			const firstTimeApiCall = true;
			recentChatHandler(recentChatStorage, true, firstTimeApiCall);
		}
	}, [recentChatStorage]);

	useEffect(() => {
		if (moreRecentChatStorage) {
			const firstTimeApiCall = false;
			recentChatHandler(moreRecentChatStorage, true, firstTimeApiCall);
		}
	}, [moreRecentChatStorage]);

	const handleScroll = useCallback(() => {
		if (!chatContentRef?.current) return;

		//logic related to scroll button
		const { scrollTop, scrollHeight, clientHeight } = chatContentRef.current;
		const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
		const isNearBottom = distanceFromBottom < 5;

		if (isNearBottom && info?.showScrollButton) {
			setInfo((prev) => ({
				...prev,
				showScrollButton: false,
			}));
		} else if (!isNearBottom && !info?.showScrollButton) {
			setInfo((prev) => ({
				...prev,
				showScrollButton: true,
			}));
		}
	}, [info?.showScrollButton]);

	useEffect(() => {
		const chatContent = chatContentRef.current;
		if (chatContent) {
			chatContent.addEventListener('scroll', handleScroll);
			return () => {
				chatContent.removeEventListener('scroll', handleScroll);
			};
		}
	}, [handleScroll]);

	const handleResize = (time = 300) => {
		if (throttleTimer) return;

		throttleTimer = setTimeout(() => {
			if (window.innerWidth < 1400) {
				setInfo((prev) => ({
					...prev,
					citationsModalIsOpen: false,
				}));
			}
			throttleTimer = null;
		}, time);
	};

	const recentChatHandler = useCallback(
		(inComingData, fetcMore = false, firstTimeApiCall = false) => {
			const { data, hasNextPage, currentPage } = inComingData;
			let messages = [];
			let chatPayload = {
				workflowTemplateId: null,
				moduleTemplateId: null,
			};
			for (let i = 0; i < data?.length; i++) {
				const {
					originalQuery = '',
					response,
					_id: messageId,
					citations,
					workflowTemplateId,
					moduleTemplateId,
					followUpQuery,
					chainOfThought,
					rating,
					designAgentsUsed,
				} = data?.[i] || {};

				if (firstTimeApiCall) {
					chatPayload = {
						workflowTemplateId: workflowTemplateId || null,
						moduleTemplateId: moduleTemplateId || null,
					};
				}
				let processing = null;
				let deepSearch = {},
					deepResearch = {};

				if (chainOfThought?.length > 0) {
					for (let i = 0; i < chainOfThought?.length; i++) {
						const { deep_search, deep_research } = chainOfThought?.[i] || {};
						if (deep_search) {
							processing = 'Deep Search';
							break;
						} else if (deep_research) {
							processing = 'Deep Research';
							break;
						}
					}

					if (processing === 'Deep Search') {
						deepSearch = handleDeepSearchChainOfThought(chainOfThought);
					} else if (processing === 'Deep Research') {
						deepResearch = handleDeepResearchChainOfThought(chainOfThought);
					}
				}

				messages = [
					{
						message: originalQuery,
						type: 'user',
					},
					{
						message: response,
						type: 'AI',
						messageId,
						rating: rating || null,
						citations,
						follow_up_query: followUpQuery || [],
						workflow_template_id: workflowTemplateId || null,
						module_template_id: moduleTemplateId || null,
						isOldMessage: true,
						stream_end: true,
						processing,
						used_agents: designAgentsUsed || [],
						...(processing === 'Deep Search' && { deepSearch }),
						...(processing === 'Deep Research' && { deepResearch }),
					},
				]?.concat(messages);
			}

			if (fetcMore) {
				updateStateValues({
					globalChatMessages: messages?.concat(chatMessagesRef?.current),
					...(chatPayload?.moduleTemplateId &&
						chatPayload?.workflowTemplateId && { chatPayload }),
				});
				// if (chatContentRef?.current) {
				// 	chatContentRef.current.scrollBy({
				// 		top: 300, // Reduced from 500 for smoother feel
				// 		behavior: 'smooth',
				// 	});
				// }
			} else {
				updateStateValues({
					globalChatMessages: messages,
					...(chatPayload?.moduleTemplateId &&
						chatPayload?.workflowTemplateId && { chatPayload }),
				});
				// setTimeout(() => {
				// 	// smoothScrollToBottom();
				// }, 1000);
			}

			setInfo((prev) => ({ ...prev, chatLoading: false, hasNextPage, currentPage }));
		},
		[],
	);

	const handleRatingClick = useCallback(async (type, messageId) => {
		try {
			if (messageId) {
				const message = [...(chatMessagesRef.current || [])]?.find(
					(chat) => chat?.messageId === messageId,
				);
				if (message?.rating === null || message?.rating !== type) {
					await updateAiChatMessageRating({ rating: type }, messageId, isPublicChat);
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

	const handleNoteComponentModalOpen = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			noteModalIsOpen: true,
		}));
	}, []);

	const smoothScrollToBottom = useCallback(
		(type) => {
			const scrollElement = chatContentRef?.current;
			if (!scrollElement) return;

			const scrollToPosition = (position) => {
				scrollElement?.scrollTo({
					top: position,
					behavior: type === 'instant' ? 'auto' : 'smooth',
				});
			};

			if (type === 'custom') {
				const scrollHeight = scrollElement.scrollHeight;
				const scrollOffset = 100;
				scrollToPosition(scrollHeight - scrollOffset);
			} else {
				scrollToPosition(scrollElement?.scrollHeight);
			}
		},
		[chatContentRef?.current, info?.initialRendering],
	);

	const smoothScrollToLastMessage = useCallback(() => {
		const scrollElement = chatContentRef?.current;
		const lastUserMessage = Object?.values(userMessagesRefs.current)?.[
			Object?.values(userMessagesRefs.current)?.length - 1
		];

		if (!scrollElement || !lastUserMessage) return;

		const lastUserMessageTop = lastUserMessage?.getBoundingClientRect()?.top;
		const scrollElementTop = scrollElement?.getBoundingClientRect()?.top;
		const scrollOffset = lastUserMessageTop - scrollElementTop;
		scrollElement?.scrollBy({
			top: scrollOffset,
			behavior: 'smooth',
		});
	}, []);

	const fetchMoreData = useCallback(
		debounce(async () => {
			if (!info?.hasNextPage || info?.chatLoading) {
				return;
			}
			getRecentChatMessages(sessionId, info?.currentPage + 1, true, isPublicChat);
			setInfo((prev) => ({ ...prev, chatLoading: true }));
		}, 1000),
		[info, sessionId, isPublicChat],
	);

	// stream chat
	const onMessageFunc = useCallback((event) => {
		let { data = '' } = event || {};
		data = JSON?.parse(data);

		if (data?.hasOwnProperty('intermediate_response')) {
			if (data?.intermediate_response_done === true) {
				loadingMessageRef.current = null;
				return;
			}

			loadingMessageRef.current = loadingMessageRef?.current || '';
			loadingMessageRef.current += data?.intermediate_response || '';
			updateStateValues({ globalLoadingMesssage: loadingMessageRef.current });
			return;
		}
		if (data?.memory_thinking) {
			updateStateValues({ globalLoadingMesssage: data?.memory_thinking });
			return;
		}
		if (data?.type === 'variableRequirement') {
			loadingMessageRef.current = null;
		}
		if (data?.user_id) {
			localStorage?.setItem('user_id', data?.user_id);
		}
		let chatPayload = null;
		if (data?.stream_end) {
			const { workflow_template_id, module_template_id } = data;
			if (workflow_template_id || module_template_id) {
				chatPayload = {
					workflowTemplateId: workflow_template_id,
					moduleTemplateId: module_template_id,
				};
			}
			handleStreamIncomingMessage(data);
			updateStateValues({
				globalLoadingMesssage: null,
				...(chatPayload && { chatPayload }),
				...(chatMessagesRef?.current?.length === 2 && { refetchChatHistoryList: true }),
			});
			setInfo((prev) => ({ ...prev, latestStreamMesage: data }));
		}
		const { message_chunk_id } = data;

		if (message_chunk_id) {
			handleStreamMessageChunk(data, message_chunk_id);
		}
	}, []);

	const handleSendWebsocketMessage = useCallback(
		async (data, lastQuery) => {
			try {
				await sendMessage(data);
				smoothScrollToLastMessage();
				setInfo((prev) => ({ ...prev, lastQuery: lastQuery }));
			} catch (error) {
				console.error('Failed to send message:', error);
				// Handle error appropriately (show notification, etc.)
			}
		},
		[sendMessage],
	);

	const toggleLatestStreamMessage = useCallback(() => {
		setInfo((prev) => ({ ...prev, latestStreamMesage: null }));
	}, []);
	const handleViewDocument = useCallback((value) => {
		setInfo((prev) => ({ ...prev, showViewDocument: value }));
	}, []);

	// const handleNewChatClick = useCallback(() => {
	// 	const pathname = location?.pathname?.split('/')?.[1];
	// 	const sessionId = ObjectID()?.toString();

	// 	if (pathname === 'chat') {
	// 		navigate(`/chat/${sessionId}`);
	// 	} else if (pathname === 'c') {
	// 		navigate(`/c/${sessionId}`);
	// 	} else if (
	// 		pathname === 'calendar' ||
	// 		pathname === 'contacts' ||
	// 		pathname === 'tasks' ||
	// 		pathname === 'contact'
	// 	) {
	// 		onNewChatBtnClick?.();
	// 	}
	// }, [location?.pathname]);

	const handleNavigateBack = useCallback(() => {
		const pathname = location?.pathname?.split('/')?.[1];
		if (pathname === 'calendar' || pathname === 'contacts' || pathname === 'tasks') {
			onNavigateBack?.();
		} else {
			navigate(-1);
		}
	}, [location?.pathname]);

	return (
		<>
			<div
				className="chat-container"
				style={{
					height: isPublicChat ? 'calc(100% - 32px)' : '',
				}}
			>
				<div className="chatBarContainer" style={{ width: '100%' }}>
					{/* header */}
					{!isPublicChat && (
						<div className="chat-header">
							<div className="left-container">
								<div className="icon-container" onClick={handleNavigateBack}>
									<LeftSvg />
								</div>
								<div className="chat-title">
									{currentChatData?.title || 'New Chat'}
								</div>
							</div>
							{/* <div className="right-container">
								<Tooltip title="New Chat" placement="bottom">
									<button className="new-chat-btn" onClick={handleNewChatClick}>
										<PlusCircleSvg />
									</button>
								</Tooltip>
							</div> */}
						</div>
					)}

					{/* chat body */}
					<div
						className="chatBodyContainer"
						style={{
							width: `${info?.citationsModalIsOpen ? 'calc(100% - 400px)' : '100%'}`,
							paddingLeft: `${chatHistoryDrawerIsOpen ? '250px' : '0px'}`,
						}}
					>
						<div
							className={`chatBodyParentContainer`}
							ref={chatContentRef}
							id="scrollableDiv"
							style={{
								'--chat-content-height': `${chatContentRef?.current?.clientHeight}px`,
							}}
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
									overflow: 'visible',
								}}
								scrollThreshold={0.8}
								className="smooth-scroll"
							>
								<div className="chatContent" style={{ flex: 1 }}>
									{(globalChatMessages || [])?.map((chat, index) =>
										chat?.content ? (
											<Fragment key={index}>{chat?.content}</Fragment>
										) : (
											<div
												key={index}
												className={`chat-message ${chat?.type?.toLowerCase()}-message chat-${index}`}
											>
												<div className="message-content">
													{chat?.type?.toLowerCase() === 'ai' ? (
														<div
															className="content"
															style={{
																opacity:
																	index ===
																	info?.activeAIMessageIndex
																		? 1
																		: 0.6,
															}}
															// ref={(el) => {
															// 	if (
															// 		el &&
															// 		!aiMessagesRef.current.includes(
															// 			el,
															// 		)
															// 	) {
															// 		aiMessagesRef?.current?.push(
															// 			el,
															// 		);
															// 	}
															// }}
															data-message-id={chat?.messageId}
															data-index={index}
														>
															<AIMessageRenderer
																messageData={chat}
																userMessageElement={
																	userMessagesRefs.current?.[
																		index - 1
																	]
																}
																chatContentElement={
																	chatContentRef?.current
																}
																handleNoteComponentModalOpen={
																	handleNoteComponentModalOpen
																}
																handleRatingClick={
																	handleRatingClick
																}
																tabsRefs={tabsRefs}
																index={index}
																handleSendWebsocketMessage={
																	handleSendWebsocketMessage
																}
																toggleLatestStreamMessage={
																	toggleLatestStreamMessage
																}
																latestStreamMesage={
																	info?.latestStreamMesage
																}
																lastQuery={info?.lastQuery}
																handleViewDocument={
																	handleViewDocument
																}
																showViewDocument={
																	info?.showViewDocument
																}
																isPublicChat={isPublicChat}
															/>
														</div>
													) : (
														<div
															ref={(el) => {
																if (
																	el &&
																	!userMessagesRefs.current?.[
																		index
																	]
																) {
																	userMessagesRefs.current[
																		index
																	] = el;
																}
															}}
															data-index={index}
															key={index}
															style={{
																opacity:
																	index ===
																	info?.activeUserMessageIndex
																		? 1
																		: 0.6,
															}}
														>
															<UserMessageRenderer
																messageData={chat}
															/>
														</div>
													)}
												</div>
											</div>
										),
									)}
								</div>
							</InfiniteScroll>
						</div>
						<div className="chatBoxWrapper">
							<ChatBox
								showIconText={showIconText}
								isPublicChat={isPublicChat}
								handleSendWebsocketMessage={handleSendWebsocketMessage}
								latestStreamMesage={info?.latestStreamMesage}
								lastQuery={info?.lastQuery}
								toggleLatestStreamMessage={toggleLatestStreamMessage}
								hideDeepResearch={searchParams?.get('agentType') === 'search_agent'}
								autoFocus={autoFocus}
								customChatBoxClick={customChatBoxClick}
								showScrollButton={info?.showScrollButton}
								smoothScrollToBottom={smoothScrollToBottom}
							/>
						</div>
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
				handleSendWebsocketMessage={handleSendWebsocketMessage}
				latestStreamMesage={info?.latestStreamMesage}
				lastQuery={info?.lastQuery}
				toggleLatestStreamMessage={toggleLatestStreamMessage}
			/>
		</>
	);
};

export default memo(RecentChat);
