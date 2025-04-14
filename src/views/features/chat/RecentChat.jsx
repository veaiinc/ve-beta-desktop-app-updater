import React, { memo, useCallback, useState, useRef, useEffect, useContext } from 'react';
import '../../../assets/scss/chat/chat.scss';
import { ReactComponent as ExpandChatIcon } from '../../../assets/svg/ai_agents/expand-chat-icon.svg';
import Context from '../../../context/context';
import { TypingEffect, UserMessageRenderer } from '../../../helpers/markdownHelper';
import CitationsModal from '../../components/modalsV2/chat/CitationsModal';
import NoteComponentModal from '../../components/notes/NoteComponentModal';
import ChatBox from '../../components/homePage/ChatBox';
import { useParams, useSearchParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp, getLocationsDetails } from '../../../helpers';
import { debounce } from 'lodash';
import useChatStream from '../../hooks/useChatStream';
import ObjectID from 'bson-objectid';
import { ReactComponent as ArrowUpRightSvg } from '../../../assets/svg/sidebar/arrowupright.svg';
import { ReactComponent as LinkIcon } from '../../../assets/svg/ai_agents/link.svg';
import { ReactComponent as Logo } from '../../../assets/svg/loader/loaderLogo.svg';

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
			chatHistoryDrawerIsOpen,
			leftSidebarState,
		},
	} = useContext(Context);

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
		activeAIMessageIndex: null,
		activeAIMessageId: null,
		activeUserMessageIndex: null,
		renderingTwice: false,
		initialRendering: false,
		scrollExecuted: false,
		previousAgentType: null,
		showScrollButton: false,
		activeTabs: {},
		stickyTabs: {},
	});

	const { socketRef, createWebSocketConnection, sendMessage } = useChatStream();
	const chatContentRef = useRef(null);
	const loadingMessageRef = useRef(globalLoadingMesssage);
	const chatMessagesRef = useRef(globalChatMessages || []);
	let { sessionId } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const aiMessagesRef = useRef([]);
	const previousAiMessagesRef = useRef([]);
	const aiCitationsByIdRef = useRef({});
	const tabsRefs = useRef({});
	const previousTabsRefs = useRef({});
	const isFirstTimeConnectingToPublicChatRef = useRef(true);

	sessionId = isPreview ? sId : sessionId;

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		if (leftSidebarState === 'open') {
			updateStateValues({ leftSidebarState: 'close' });
		}

		handleResize(0);

		const agentType = searchParams?.get('agentType');
		const assistantId = searchParams?.get('assistantId');

		if (agentType && assistantId) {
			updateStateValues({ chatInfo: { ...chatInfo, agentType, assistantId } });
		} else if (agentType) {
			updateStateValues({ chatInfo: { ...chatInfo, agentType } });
		}

		return () => {
			window.removeEventListener('resize', handleResize);
			clearTimeout(throttleTimer);

			updateStateValues({
				moreRecentChatStorage: null,
				recentChatStorage: null,
				globalChatMessages: [],
				currentSessionId: ObjectID()?.toString(),
				citations: null,
				citationChunks: {},
				chatPayload: {
					workflowTemplateId: null,
					moduleTemplateId: null,
				},
			});
		};
	}, []);

	useEffect(() => {
		if (sessionId && !isPublicChat) {
			if (info?.renderingTwice) {
				//clearing context state when rendering different session
				updateStateValues({
					moreRecentChatStorage: null,
					recentChatStorage: null,
					globalChatMessages: [],
					citations: null,
					citationChunks: {},
					chatPayload: {
						workflowTemplateId: null,
						moduleTemplateId: null,
					},
				});
				tabsRefs.current = {};
				setInfo((prev) => ({
					...prev,
					scrollExecuted: false,
				}));
				aiMessagesRef.current = [];
			}

			getRecentChatMessages(sessionId);
			setInfo((prev) => ({
				...prev,
				chatLoading: true,
				chatSessionId: sessionId,
				renderingTwice: true,
			}));
			updateStateValues({ currentSessionId: sessionId });
		}
	}, [sessionId]);

	useEffect(() => {
		if (!chatInfo?.agentType) return;
		if (isPublicChat) {
			return;
		}

		const agentType = searchParams?.get('agentType');
		const assistantId = searchParams?.get('assistantId');

		// Prepare desired search params based on chatInfo
		let desiredParams = {};

		if (chatInfo?.agentType === 'knowledge_agent') {
			desiredParams = {
				agentType: 'knowledge_agent',
				assistantId: chatInfo?.assistantId,
			};

			// If both params are already correct, no update needed
			if (
				agentType === desiredParams?.agentType &&
				assistantId === desiredParams?.assistantId
			) {
				return;
			}
		} else {
			desiredParams = {
				agentType: chatInfo?.agentType,
			};

			// If agentType matches and is not 'knowledge_agent', no update needed
			if (agentType === desiredParams?.agentType) {
				return;
			}
		}

		// Update the URL search params
		setSearchParams(desiredParams);
	}, [chatInfo?.agentType, chatInfo?.assistantId, sessionId]);

	useEffect(() => {
		const agentType = searchParams?.get('agentType');
		if (sessionId && agentType && !isPublicChat) {
			createWebSocketConnection(sessionId, onMessageFunc, agentType, isPublicChat);
		}

		if (sessionId && isPublicChat && isFirstTimeConnectingToPublicChatRef.current) {
			createWebSocketConnection(sessionId, onMessageFunc, agentType, isPublicChat);
			isFirstTimeConnectingToPublicChatRef.current = false;
		}
	}, [searchParams]);

	useEffect(() => {
		if (globalChatMessages?.length > 4 && !info?.scrollExecuted) {
			setTimeout(() => {
				let lastMessageSelector = globalChatMessages?.length - 1;
				const lastMessage = document.querySelector(`.chat-${lastMessageSelector}`);
				if (lastMessage) {
					lastMessage?.scrollIntoView({
						behavior: 'smooth',
					});
				}
			}, 500);
			setInfo((prev) => ({ ...prev, scrollExecuted: true }));
		}
	}, [globalChatMessages, chatContentRef, info?.scrollExecuted]);

	useEffect(() => {
		// Set default active tab as 'response' for all AI messages
		if (globalChatMessages?.length > 0) {
			const defaultTabs = {};
			globalChatMessages.forEach((message, index) => {
				if (message?.type?.toLowerCase() === 'ai') {
					defaultTabs[index] = 'response';
				}
			});
			setInfo((prev) => ({
				...prev,
				activeTabs: defaultTabs,
			}));
		}

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
		chatMessagesRef.current?.forEach((message) => {
			if (message?.type?.toLowerCase() === 'ai') {
				const messageId = message?.messageId;
				if (message?.citations && !aiCitationsByIdRef.current[messageId]) {
					aiCitationsByIdRef.current[messageId] = message?.citations;
				}
			}
		});
		// smoothScrollToBottom();

		// if (aiMessagesRef?.current?.length === 0) return;

		// previousAiMessagesRef.current = [...aiMessagesRef.current];

		// const visibleMessagesSet = new Set();
		// const observer = new IntersectionObserver(
		// 	(entries) => {
		// 		entries.forEach((entry) => {
		// 			if (entry.isIntersecting) {
		// 				visibleMessagesSet.add(entry.target);
		// 			} else {
		// 				visibleMessagesSet.delete(entry.target);
		// 			}
		// 		});
		// 		const visibleMessages = Array.from(visibleMessagesSet).sort(
		// 			(a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top,
		// 		);

		// 		// Change to get the first visible message instead of the last
		// 		if (visibleMessages.length > 0) {
		// 			const firstVisibleMessage = visibleMessages[0]; // Get the first visible message

		// 			let activeAIMessageIndex = firstVisibleMessage.dataset.index;
		// 			let activeUserMessageIndex = null;

		// 			if (activeAIMessageIndex > 0) {
		// 				activeUserMessageIndex = activeAIMessageIndex - 1;
		// 				while (activeUserMessageIndex) {
		// 					if (
		// 						chatMessagesRef.current[
		// 							activeUserMessageIndex
		// 						]?.type?.toLowerCase() === 'user'
		// 					) {
		// 						break;
		// 					}
		// 					activeUserMessageIndex--;
		// 				}

		// 				if (
		// 					chatMessagesRef.current[activeUserMessageIndex]?.type?.toLowerCase() !==
		// 					'user'
		// 				) {
		// 					activeUserMessageIndex = null;
		// 				}
		// 			}
		// 			setInfo((prev) => ({
		// 				...prev,
		// 				activeAIMessageIndex: parseInt(activeAIMessageIndex),
		// 				activeAIMessageId: firstVisibleMessage.dataset.messageId,
		// 				activeUserMessageIndex,
		// 			}));
		// 		}
		// 	},
		// 	{
		// 		root: chatContentRef.current,
		// 		threshold: 0.01,
		// 	},
		// );
		// aiMessagesRef.current.forEach((msg) => observer.observe(msg));

		// smoothScrollToBottom();
		// return () => {
		// 	previousAiMessagesRef.current.forEach((msg) => observer.unobserve(msg));
		// 	visibleMessagesSet.clear();
		// };
	}, [globalChatMessages, chatContentRef]);

	useEffect(() => {
		if (info?.activeAIMessageId) {
			updateStateValues({
				citations: aiCitationsByIdRef.current[info?.activeAIMessageId],
			});
		}
	}, [info?.activeAIMessageId]);

	useEffect(() => {
		if (recentChatStorage) {
			const firstTimeApiCall = true;
			recentChatHandler(recentChatStorage, true, firstTimeApiCall);
		}
	}, [recentChatStorage]);

	useEffect(() => {
		if (moreRecentChatStorage) {
			const firstTimeApiCall = false;
			recentChatHandler(moreRecentChatStorage, firstTimeApiCall);
		}
	}, [moreRecentChatStorage]);

	const handleScroll = useCallback(() => {
		if (!chatContentRef.current) return;
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

	const getFaviconUrl = useCallback((url) => {
		try {
			const domain = new URL(url).hostname;
			return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
		} catch (error) {
			return null;
		}
	}, []);

	const getWebsiteName = useCallback((url) => {
		try {
			const domain = new URL(url).hostname;
			// Remove common TLDs and www
			let name = domain.replace(/^www\./i, '').split('.')[0];
			// Capitalize first letter
			return name.charAt(0).toUpperCase() + name.slice(1);
		} catch (error) {
			return url;
		}
	}, []);

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
					followUpQuery,
					workflowTemplateId,
					moduleTemplateId,
				} = data?.[i] || {};

				if (firstTimeApiCall) {
					chatPayload = {
						workflowTemplateId,
						moduleTemplateId,
					};
				}

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
						follow_up_query: followUpQuery || [],
						workflow_template_id: workflowTemplateId,
						module_template_id: moduleTemplateId,
					},
				]?.concat(messages);
			}

			if (fetcMore) {
				updateStateValues({
					globalChatMessages: messages?.concat(globalChatMessages),
					chatPayload,
				});
				// if (chatContentRef?.current) {
				// 	chatContentRef.current.scrollBy({
				// 		top: 300, // Reduced from 500 for smoother feel
				// 		behavior: 'smooth',
				// 	});
				// }
			} else {
				updateStateValues({ globalChatMessages: messages, chatPayload });
				// setTimeout(() => {
				// 	// smoothScrollToBottom();
				// }, 1000);
			}

			setInfo((prev) => ({ ...prev, chatLoading: false, hasNextPage, currentPage }));
		},
		[info, chatContentRef],
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
			if (data?.type === 'variableRequirement') {
				loadingMessageRef.current = null;
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
				});
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

	return (
		<>
			<div className="chat-container">
				<div className="chatBarContainer" style={{ width: '100%' }}>
					{/* header */}
					{/* {!isPublicChat && !isPreview && (
						<div className="containerHeader">
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
					)} */}

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
											chat?.content
										) : (
											<div
												key={index}
												className={`chat-message ${chat?.type?.toLowerCase()}-message chat-${index}`}
											>
												<div className="message-content">
													{chat?.type?.toLowerCase() === 'ai' ? (
														<div
															className="content"
															// style={{
															// 	opacity:
															// 		index ===
															// 		info?.activeAIMessageIndex
															// 			? 1
															// 			: 0.6,
															// }}
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
															data-index={index}
														>
															<div
																className={`tabs-wrapper `}
																ref={(el) => {
																	if (el) {
																		tabsRefs.current[
																			chat?.messageId
																		] = el;
																	}
																}}
															>
																<div className="user-message-wrapper">
																	{globalChatMessages[
																		index - 1
																	]?.type?.toLowerCase() ===
																		'user' && (
																		<div className="user-message-content">
																			{
																				globalChatMessages[
																					index - 1
																				]?.message
																			}
																		</div>
																	)}
																</div>

																<div className="tab-buttons">
																	<div
																		className={`tab-btn ${
																			info?.activeTabs[
																				index
																			] === 'response'
																				? 'active'
																				: ''
																		}`}
																		onClick={() =>
																			setInfo((prev) => ({
																				...prev,
																				activeTabs: {
																					...prev.activeTabs,
																					[index]:
																						'response',
																				},
																			}))
																		}
																	>
																		<Logo
																			width={'24px'}
																			height={'24px'}
																		/>
																		Answer
																	</div>
																	{chat?.citations &&
																		chat?.citations.length >
																			0 && (
																			<div
																				className={`tab-btn ${
																					info
																						?.activeTabs[
																						index
																					] === 'source'
																						? 'active'
																						: ''
																				}`}
																				onClick={() =>
																					setInfo(
																						(prev) => ({
																							...prev,
																							activeTabs:
																								{
																									...prev.activeTabs,
																									[index]:
																										'source',
																								},
																						}),
																					)
																				}
																			>
																				Sources
																				<span className="citation-badge">
																					{
																						chat
																							?.citations
																							.length
																					}
																				</span>
																			</div>
																		)}
																</div>
															</div>
															{info?.activeTabs[index] ==
															'response' ? (
																<TypingEffect
																	text={chat?.message}
																	messageId={chat?.messageId}
																	customePencilClickFunc={
																		handleNoteComponentModalOpen
																	}
																	handleRatingClick={
																		handleRatingClick
																	}
																	rating={chat?.rating}
																	citations={chat?.citations}
																	messageData={chat}
																	isNewMessage={
																		index ===
																		globalChatMessages?.length -
																			1
																	}
																/>
															) : (
																<div className="source-content">
																	{chat?.citations &&
																	chat?.citations.length > 0
																		? chat?.citations.map(
																				(citation, idx) => (
																					<div
																						key={
																							citation.id ||
																							idx
																						}
																						className="citation-item"
																						onClick={() =>
																							window.open(
																								citation.name,
																								'_blank',
																							)
																						}
																					>
																						<div className="citation-header">
																							<div className="citation-icon">
																								{getFaviconUrl(
																									citation.name,
																								) ? (
																									<img
																										src={getFaviconUrl(
																											citation.name,
																										)}
																										alt="favicon"
																										className="favicon-image"
																									/>
																								) : (
																									<div className="company-icon">
																										{getWebsiteName(
																											citation.name,
																										).charAt(
																											0,
																										)}
																									</div>
																								)}
																							</div>
																							<div className="citation-details">
																								<div className="website-name">
																									{getWebsiteName(
																										citation.name,
																									)}
																								</div>
																								<div className="citation-url">
																									<LinkIcon className="link-icon" />
																									{
																										citation.name
																									}
																								</div>
																								<div className="citation-title">
																									{
																										citation.snippet
																									}
																								</div>
																							</div>
																						</div>
																					</div>
																				),
																		  )
																		: null}
																</div>
															)}
														</div>
													) : (
														<UserMessageRenderer
															messageData={chat}
															// activeUserMessageIndex={
															// 	index ===
															// 	info?.activeUserMessageIndex
															// }
														/>
													)}
												</div>
											</div>
										),
									)}
								</div>
							</InfiniteScroll>
						</div>
						{info.showScrollButton && (
							<button className="scroll-button" onClick={smoothScrollToBottom}>
								<ArrowUpRightSvg className="arrow-up" />
							</button>
						)}
						<div className="chatBoxWrapper">
							<ChatBox
								isPublicChat={isPublicChat}
								handleSendWebsocketMessage={handleSendWebsocketMessage}
								latestStreamMesage={info?.latestStreamMesage}
								lastQuery={info?.lastQuery}
								toggleLatestStreamMessage={toggleLatestStreamMessage}
								hideDeepResearch={searchParams?.get('agentType') === 'search_agent'}
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
