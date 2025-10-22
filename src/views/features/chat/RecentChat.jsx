import {
	memo,
	useCallback,
	useState,
	useRef,
	useEffect,
	useContext,
	Fragment,
	useLayoutEffect,
} from 'react';
import '../../../assets/scss/chat/chat.scss';
import {
	handleChainOfThought,
	handleDeepResearchChainOfThought,
	handleBrowserData,
} from '../../../helpers/chat/chatHelpers';
import Context from '../../../context/context';
import { UserMessageRenderer } from '../../../helpers/markdownHelper';
import ChatBox from '../../components/chat/ChatBox';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { FetchMoreLoaderComp } from '../../../helpers';
import AIMessageRenderer from '../../components/chat/AIMessageRenderer';
import ChatHeader from '../../components/chat/ChatHeader';
import { message } from '../../components/globalComponents/CustomToast';
import InfiniteScroll from '../../components/globalComponents/InfiniteScroll';
import ChatRightBar from '../../components/chat/chatComponents/ChatRightBar';
import Browser from '../../components/chat/chatComponents/Browser';
import { ReactComponent as LinkLightSvg } from '../../../assets/svg/notes/loop-light.svg';
import { ReactComponent as LinkDarkSvg } from '../../../assets/svg/notes/loop-dark.svg';

const RecentChat = ({
	isPublicChat = false,
	isPreview = false,
	sId = null,
	autoFocus = true,
	customChatBoxClick = null,
	showCitationsButton = false,
	showDeleteChat = false,
	showChats = false,
	showHeader = true,
	showBrowser = false,
	showBottomTools = true,
	showMicBtn = true,
	showRecentFiles = true,
	showResponseEditBtn = true,
	fetchRecentChatMessages = true,
	showChatBox = true, // New prop to control ChatBox visibility
	showRightBar = false,

	// props for desktop app behavior
	isDesktopApp = false,
	handleDesktopAppPayload = null,
}) => {
	const {
		templates: {
			globalChatMessages,
			updateStateValues,
			getRecentChatMessages,
			recentChatStorage,
			moreRecentChatStorage,
			handleGlobalChatMessages,
			updateChatLoadingSessions,
			getFollowUpQueries,
		},
		aiSetup: { updateAiChatSessions },
		chatStream: { sendMessage },
	} = useContext(Context);

	let { sessionId } = useParams();
	const [searchParams] = useSearchParams();
	let agentType = searchParams?.get('agentType');
	let assistantId = searchParams?.get('assistantId');

	// State to store various chat UI info
	const [info, setInfo] = useState({
		chatLoading: false,
		chatToNoteLoopOn: false,
		scrollExecuted: false,
		renderingTwice: false,
		showScrollButton: false,
		showViewDocument: false,
		isNewChat: true,
		currentUserMessageIndex: null,
		latestStreamMessage: null,
		citationsAiMessageIndex: null,
		openBrowser: false,
		browserDataAvailable: false,
		chatPaddingBottom: 70,
		rightBarOpen: false,
		activeRightBar: null,
		rightBarWidth: 0,
		ready: true,
		isCompactMode: false, // Track if we're in compact chat mode from AskAI overlay
	});

	// Refs for chat elements and timers
	const chatContentRef = useRef(null);
	const userMessagesRefs = useRef({});
	const agentTimeoutIdRef = useRef(null);
	const navigate = useNavigate();
	const location = useLocation();
	const globalChatMessagesRef = useRef(globalChatMessages);
	const currentUserMessageTimeoutRef = useRef(null);
	const rightBarRef = useRef(null);

	sessionId = isPreview ? sId : sessionId;

	const browserData = globalChatMessages?.[sessionId]?.browserData;

	/**
	 * Handle desktop app compact mode (e.g., AskAI overlay)
	 * Resize main window if in compact mode on mount
	 */
	useEffect(() => {
		if (isDesktopApp && window?.electronApi?.resizeMainWindow) {
			const checkCompactMode = async () => {
				try {
					const bounds = await window?.electronApi?.getWindowBounds?.();
					if (bounds && bounds.width <= 571 && bounds.height <= 626) {
						console.log(
							'📐 RecentChat: Detected compact mode from AskAI overlay (571x626)',
						);
						setInfo((prev) => ({ ...prev, isCompactMode: true }));
					}
				} catch (e) {
					console.log('RecentChat: Could not check window bounds:', e);
				}
			};
			checkCompactMode();
		}

		return () => {
			// Only restore normal window size when leaving chat if not in preview mode
			// Preview mode (e.g., in OngoingMeeting) should not override window sizing
			if (!isPreview && window?.electronApi?.resizeMainWindow) {
				window.electronApi.resizeMainWindow({
					dimensions: {
						width: 1366,
						height: 768,
					},
					exitFullScreen: false,
					animate: true,
					duration: 300,
					easing: 'easeOutCubic',
				});
				console.log(
					'📐 RecentChat: Restored normal window size on unmount (1366x768) with smooth animation',
				);
			} else if (isPreview) {
				console.log(
					'📐 RecentChat: Skipping window resize on unmount (preview mode - letting parent handle sizing)',
				);
			}
		};
	}, []);

	/**
	 * Handle window resize, cleanup timers, and reset chat context on unmount
	 */
	useEffect(() => {
		window.addEventListener('resize', handleResizeWindow);
		return () => {
			window.removeEventListener('resize', handleResizeWindow);

			// Clear user message timeout
			if (currentUserMessageTimeoutRef.current) {
				clearTimeout(currentUserMessageTimeoutRef.current);
				currentUserMessageTimeoutRef.current = null;
			}

			setTimeout(() => {
				// Clear user message refs
				userMessagesRefs.current = {};
				if (agentTimeoutIdRef.current) {
					clearTimeout(agentTimeoutIdRef.current);
					agentTimeoutIdRef.current = null;
				}
				// Reset chat context state
				updateStateValues({
					chatReplyData: null,
					aiMessagesInfo: null,
					isBrowserScreenActive: false,
					currentChatData: null,
				});
			}, 0);

			// Clear global chat messages if needed
			handleGlobalChatMessages({
				removeChatSessions: true,
				updateExtraInfo: true,
			});
		};
	}, []);

	/**
	 * Show or hide browser component based on globalChatMessages state
	 */
	useEffect(() => {
		if (globalChatMessages?.[sessionId]?.open_browser) {
			setInfo((prev) => {
				if (prev?.openBrowser && prev?.browserDataAvailable) return prev;
				return {
					...prev,
					openBrowser: true,
					browserDataAvailable: true,
				};
			});
			updateStateValues({ isBrowserScreenActive: true });
		} else {
			setInfo((prev) => {
				if (!prev?.openBrowser && !prev?.browserDataAvailable) return prev;
				return {
					...prev,
					openBrowser: false,
					browserDataAvailable: false,
				};
			});
		}
	}, [globalChatMessages?.[sessionId]?.open_browser]);

	/**
	 * Track latest AI streaming message
	 */
	useEffect(() => {
		const latestStreamMessage = globalChatMessages?.[sessionId]?.latestStreamMessage;
		if (latestStreamMessage) {
			setInfo((prev) => ({
				...prev,
				latestStreamMessage,
			}));
		}
	}, [globalChatMessages?.[sessionId]?.latestStreamMessage]);

	/**
	 * Update right bar width when active right bar changes or toggled
	 */
	useEffect(() => {
		if (rightBarRef.current) {
			setInfo((prev) => ({
				...prev,
				rightBarWidth: rightBarRef.current?.clientWidth,
			}));
		}
	}, [info?.rightBarOpen, info?.activeRightBar]);

	/**
	 * Handle opening document preview from latest streaming message
	 */
	useEffect(() => {
		const { workflow_template_id, module_template_id } = info?.latestStreamMessage || {};
		if (workflow_template_id && module_template_id && info?.showViewDocument) {
			updateStateValues({
				documentPreviewIds: {
					workflowTemplateId: workflow_template_id,
					moduleTemplateId: module_template_id,
				},
			});
			setInfo((prev) => ({
				...prev,
				latestStreamMessage: null,
			}));
		}
	}, [info?.latestStreamMessage]);

	/**
	 * Layout effect to handle session rendering, loading state, and smooth transition
	 */
	useLayoutEffect(() => {
		let timer = null;
		if (sessionId) {
			if (info?.renderingTwice) {
				// Clear AI messages and browser state for different session
				updateStateValues({
					aiMessagesInfo: null,
					isBrowserScreenActive: false,
				});
				userMessagesRefs.current = {};

				// Delay showing previous chat messages for a smoother transition.
				// This ensures the chat area briefly appears blank when revisiting a session,
				// since old messages are preserved and not cleared from state.
				timer = setTimeout(
					() =>
						setInfo((prev) => ({
							...prev,
							ready: true,
						})),
					500,
				);

				setInfo((prev) => ({
					...prev,
					scrollExecuted: false,
					citationsAiMessageIndex: null,
					rightBarOpen: false,
					activeRightBar: null,
					rightBarWidth: 0,
					ready: false,
				}));
			}

			// Clear pending timeouts
			if (currentUserMessageTimeoutRef.current) {
				clearTimeout(currentUserMessageTimeoutRef.current);
				currentUserMessageTimeoutRef.current = null;
			}
			if (agentTimeoutIdRef.current) {
				clearTimeout(agentTimeoutIdRef.current);
				agentTimeoutIdRef.current = null;
			}

			// Fetch recent chat messages if not already loaded
			if (!globalChatMessages?.[sessionId]?.messages) {
				getRecentChatMessages({
					sessionId,
					page: 1,
					fetchMore: false,
					isPublicChat,
					removeSessionId: false,
				});
			}

			setInfo((prev) => ({
				...prev,
				chatLoading: true,
				renderingTwice: true,
			}));
		}

		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, [sessionId, fetchRecentChatMessages]);

	/**
	 * Update chat session agent type and assistantId if changed
	 */
	useEffect(() => {
		if (
			agentType &&
			sessionId &&
			globalChatMessages?.[sessionId]?.chatInfo?.agentType !== agentType &&
			globalChatMessages?.[sessionId]?.chatInfo?.assistantId !== assistantId
		) {
			handleGlobalChatMessages({
				sessionId,
				updateExtraInfo: true,
				chatInfo: { agentType, assistantId },
			});
		}
	}, [sessionId, agentType, assistantId]);

	/**
	 * Scroll to last message if not already executed
	 */
	useLayoutEffect(() => {
		if (!info?.scrollExecuted && globalChatMessages?.[sessionId]?.messages && info?.ready) {
			requestAnimationFrame(() => {
				smoothScrollToLastMessage('instant');
			});

			setInfo((prev) => ({
				...prev,
				scrollExecuted: true,
			}));
		}
	}, [globalChatMessages, info?.scrollExecuted, info?.ready]);

	/**
	 * Mark chat as not new once messages are loaded
	 */
	useEffect(() => {
		globalChatMessagesRef.current = globalChatMessages;
		if (!sessionId) return;

		if (globalChatMessages?.[sessionId]?.messages?.length && info?.isNewChat) {
			setInfo((prev) => ({
				...prev,
				isNewChat: false,
			}));
		}
	}, [globalChatMessages, sessionId]);

	/**
	 * Handle initial recent chat data from storage
	 * From context state, here this will store in globalchatmessages and making context state empty
	 */
	useEffect(() => {
		if (recentChatStorage?.[sessionId]) {
			const firstTimeApiCall = true;
			recentChatHandler(recentChatStorage?.[sessionId], false, firstTimeApiCall);
			getRecentChatMessages({
				sessionId,
				page: 1,
				fetchMore: false,
				limit: 1000,
				isPublicChat,
				removeSessionId: true,
			});
		}
	}, [recentChatStorage?.[sessionId]]);

	/**
	 * Handle loading more chat data when fetching older messages
	 * From context state, here this will store in globalchatmessages and making context state empty
	 */
	useEffect(() => {
		if (moreRecentChatStorage?.[sessionId]) {
			const firstTimeApiCall = false;
			recentChatHandler(moreRecentChatStorage?.[sessionId], true, firstTimeApiCall);
			getRecentChatMessages({
				sessionId,
				page: 1,
				fetchMore: true,
				limit: 1000,
				isPublicChat,
				removeSessionId: true,
			});
		}
	}, [moreRecentChatStorage?.[sessionId]]);

	/**
	 * Scroll button toggle based on distance from bottom
	 */
	const handleScroll = useCallback(() => {
		if (!chatContentRef?.current) return;

		const { scrollTop, scrollHeight, clientHeight } = chatContentRef.current;
		const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
		const isNearBottom = distanceFromBottom < 50;

		if (isNearBottom && info?.showScrollButton) {
			setInfo((prev) => ({ ...prev, showScrollButton: false }));
		} else if (!isNearBottom && !info?.showScrollButton) {
			setInfo((prev) => ({ ...prev, showScrollButton: true }));
		}
	}, [info?.showScrollButton]);

	/**
	 * Attach scroll listener to chat container
	 */
	useEffect(() => {
		const chatContent = chatContentRef.current;
		if (chatContent) {
			chatContent.addEventListener('scroll', handleScroll);
			return () => {
				chatContent.removeEventListener('scroll', handleScroll);
			};
		}
	}, [handleScroll]);

	/**
	 * Update right bar width on window resize
	 */
	const handleResizeWindow = useCallback(() => {
		setInfo((prev) => {
			if (!prev?.rightBarOpen) {
				return prev;
			}
			return {
				...prev,
				rightBarWidth: rightBarRef.current?.clientWidth,
			};
		});
	}, []);

	/**
	 * Process incoming chat messages and update context state
	 * Here i will update recent messages data into required format and storing in globalchatmessages based on sessionId
	 */
	const recentChatHandler = useCallback(
		(inComingData, fetchMore = false, firstTimeApiCall = false) => {
			const { data = [], hasNextPage, currentPage } = inComingData ?? {};
			let messages = [];
			let chatPayload = {
				workflowTemplateId: null,
				moduleTemplateId: null,
			};

			for (let i = 0; i < data?.length; i++) {
				const {
					originalQuery = '',
					response,
					status,
					_id: messageId,
					citations,
					workflowTemplateId,
					moduleTemplateId,
					followUpQuery,
					chainOfThought,
					rating,
					designAgentsUsed,
					toolInvocations,
					agentType: agentTypeFromResponse,
					userFeedbackReasons,
					userRemarks,
					unintegratedApps,
					conversationMessages,
				} = data?.[i] || {};

				// Skip knowledge agent responses if current agent type is different
				if (
					agentTypeFromResponse === 'knowledge_agent' &&
					agentType !== 'knowledge_agent'
				) {
					continue;
				}

				let images = [];
				const content = conversationMessages?.[0]?.content;
				if (Array.isArray(content)) {
					content?.forEach((item) => {
						if (item?.type === 'image_url') {
							images?.push({
								preview: item?.['image_url']?.url,
							});
						}
					});
				}

				if (firstTimeApiCall) {
					chatPayload = {
						workflowTemplateId: workflowTemplateId || null,
						moduleTemplateId: moduleTemplateId || null,
					};
				}

				let processing = null,
					browserChainOfThought = null,
					openBrowser = false,
					hasChainOfThought = false;

				let deepResearch = {},
					cot = [];

				if (chainOfThought?.length > 0) {
					for (let i = 0; i < chainOfThought?.length; i++) {
						const { cot, deep_research, open_browser } = chainOfThought?.[i] || {};
						if (cot) {
							hasChainOfThought = true;
							break;
						} else if (deep_research) {
							processing = 'Deep Research';
							break;
						} else if (open_browser) {
							openBrowser = true;
							break;
						}
					}

					if (hasChainOfThought) {
						cot = handleChainOfThought(chainOfThought);
					} else if (processing === 'Deep Research') {
						deepResearch = handleDeepResearchChainOfThought(chainOfThought);
					} else if (openBrowser) {
						browserChainOfThought = handleBrowserData(chainOfThought);
					}
				}

				messages = [
					{
						message: originalQuery,
						type: 'user',
						images,
					},
					{
						message: response,
						status,
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
						tool_invocations: toolInvocations || [],
						userFeedbackReasons,
						userRemarks,
						unintegrated_apps: unintegratedApps,
						...(hasChainOfThought && { chainOfThought: cot }),
						...(processing === 'Deep Research' && { deepResearch }),
						...(browserChainOfThought && { browserChainOfThought }),
					},
				]?.concat(messages);
			}

			const recentChatInfo = { hasNextPage, currentPage };

			handleGlobalChatMessages({
				sessionId,
				fetchMore,
				recentChatMessages: messages,
				recentChatInfo,
				updateExtraInfo: true,
				...(chatPayload?.moduleTemplateId &&
					chatPayload?.workflowTemplateId && { chatPayload }),
			});

			setInfo((prev) => ({ ...prev, chatLoading: false }));
		},
		[sessionId, agentType],
	);

	// This is used to open notes in chat
	const handleNoteComponentModalOpen = useCallback(() => {
		handleRightBarToggle({ open: true, activeRightBar: 'notes' });
	}, []);

	const smoothScrollToBottom = useCallback((type) => {
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
	}, []);

	const smoothScrollToLastMessage = useCallback((scrollBehavior = 'smooth') => {
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
			behavior: scrollBehavior,
		});
	}, []);

	const smoothScrollToParticularMessage = useCallback((index) => {
		const messageElement = userMessagesRefs.current?.[index];
		if (!messageElement) return;

		const messageElementTop = messageElement?.getBoundingClientRect()?.top;
		const scrollElementTop = chatContentRef?.current?.getBoundingClientRect()?.top;
		const scrollOffset = messageElementTop - scrollElementTop;
		chatContentRef?.current?.scrollBy({
			top: scrollOffset,
			behavior: 'smooth',
		});

		if (currentUserMessageTimeoutRef.current) {
			clearTimeout(currentUserMessageTimeoutRef.current);
		}
		setInfo((prev) => ({
			...prev,
			currentUserMessageIndex: index,
		}));
		currentUserMessageTimeoutRef.current = setTimeout(() => {
			setInfo((prev) => ({
				...prev,
				currentUserMessageIndex: null,
			}));
			currentUserMessageTimeoutRef.current = null;
		}, 2000);
	}, []);

	const fetchMoreData = useCallback(() => {
		const recentChatInfo = globalChatMessages?.[sessionId]?.recentChatInfo;
		if (!recentChatInfo?.hasNextPage) return;

		getRecentChatMessages({
			sessionId,
			page: recentChatInfo?.currentPage + 1,
			fetchMore: true,
			isPublicChat,
			removeSessionId: false,
		});
	}, [sessionId, isPublicChat, globalChatMessages?.[sessionId]?.recentChatInfo]);

	const handleBrowserButtonClick = useCallback(() => {
		if (location?.pathname?.split('/')?.[1] !== 'chat') {
			navigate(`/chat/${sessionId}`);
			return;
		}
		setInfo((prev) => {
			updateStateValues({ isBrowserScreenActive: !prev?.openBrowser });
			return { ...prev, openBrowser: !prev?.openBrowser };
		});
	}, [location, sessionId, updateStateValues]);

	// stream chat
	const onMessageFunc = useCallback(
		(event) => {
			let { data = '' } = event || {};
			data = JSON?.parse(data);

			if (data?.user_id) {
				localStorage?.setItem('user_id', data?.user_id);
			}

			if (data?.stream_end) {
				updateChatLoadingSessions({ sessionId, isStreaming: false, isNotSeen: true });

				if (data?.agent_id) {
					agentTimeoutIdRef.current = setTimeout(() => {
						navigate(
							`/agent/${data?.agent_id}?config=prompt&agentAction=buildAgent&sId=${sessionId}`,
						);
					}, 1000);
				}

				handleGlobalChatMessages({
					removeLoadingMessage: true,
					sessionId,
					updateExtraInfo: true,
					removeStreaming: true,
					...(data?.module_template_id &&
						data?.workflow_template_id && {
							chatPayload: {
								moduleTemplateId: data?.module_template_id,
								workflowTemplateId: data?.workflow_template_id,
							},
						}),
					latestStreamMessage: data,
				});

				if (!globalChatMessages?.[sessionId]?.messages?.length) {
					const payload = {
						sessionId,
						page: 1,
						limit: 5,
					};
					updateAiChatSessions(payload);
				}
			}
			const { message_chunk_id, url_type, browserMetadata } = data;

			if (message_chunk_id && (url_type === 'live_view' || browserMetadata)) {
				handleGlobalChatMessages({
					payload: data,
					chunkId: message_chunk_id,
					sessionId,
					updateExtraInfo: true,
				});
				return;
			}

			if (message_chunk_id) {
				handleGlobalChatMessages({
					payload: data,
					chunkId: message_chunk_id,
					sessionId,
					updateExtraInfo: false,
				});
			}
		},
		[globalChatMessages, sessionId],
	);
	// This will send message to socket
	const handleSendWebsocketMessage = useCallback(
		async (data, lastQuery) => {
			try {
				await sendMessage({ data, sessionId, onMessageFunc, isPublicChat, agentType });
				if (data?.action !== 'stop') {
					setTimeout(() => {
						smoothScrollToLastMessage();
					}, 0);
					handleGlobalChatMessages({
						sessionId,
						lastQuery,
						updateExtraInfo: true,
					});
				}
			} catch (error) {
				const info = typeof error?.message === 'string' ? error?.message || '' : '';
				message.error(info);
				console.error('Failed to send message:', error);

				handleGlobalChatMessages({
					sessionId,
					updateExtraInfo: true,
					removeStreaming: true,
				});
			}
		},
		[sendMessage, sessionId, onMessageFunc, agentType, isPublicChat],
	);

	const handleViewDocument = useCallback((value) => {
		setInfo((prev) => ({ ...prev, showViewDocument: value }));
	}, []);

	const handleCloseCitationsModal = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			rightBarOpen: false,
			activeRightBar: null,
			rightBarWidth: 0,
			citationsAiMessageIndex: null,
		}));
	}, []);

	const handleSourcesClick = useCallback(
		(index) => {
			if (index !== info?.citationsAiMessageIndex) {
				updateStateValues({
					chatSources: globalChatMessages?.[sessionId]?.messages?.[index]?.citations,
				});
			}
			setInfo((prev) => {
				return {
					...prev,
					rightBarOpen: index !== prev?.citationsAiMessageIndex,
					activeRightBar: index !== prev?.citationsAiMessageIndex ? 'citations' : null,
					citationsAiMessageIndex: index !== prev?.citationsAiMessageIndex ? index : null,
				};
			});
		},
		[globalChatMessages, sessionId, updateStateValues, info?.citationsAiMessageIndex],
	);

	// This is used to open right bar in chat, currently it contains sources and notes
	const handleRightBarToggle = useCallback(({ open = false, activeRightBar = null }) => {
		setInfo((prev) => ({
			...prev,
			rightBarOpen: open,
			activeRightBar: activeRightBar,
		}));
	}, []);

	// Adjust chat container's bottom padding dynamically based on the chatbox height
	// This ensures that messages at the bottom remain visible when the chatbox expands or resizes
	const handleChatBoxHeight = useCallback((chatboxHeight) => {
		setInfo((prev) => {
			if (prev?.chatPaddingBottom === chatboxHeight - 31) {
				return prev;
			}

			return {
				...prev,
				chatPaddingBottom: chatboxHeight - 31,
			};
		});
	}, []);

	const handleChatToNoteLoopClick = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			chatToNoteLoopOn: !prev?.chatToNoteLoopOn,
		}));
	}, []);

	return (
		<>
			<div
				className="chat-page-container-wrapper"
				style={{
					...(showRightBar && {
						paddingRight: info?.rightBarOpen ? `${info?.rightBarWidth}px` : '0px',
					}),
				}}
			>
				<div
					className="chat-container"
					style={{
						height: isPublicChat ? 'calc(100% - 32px)' : '',
					}}
				>
					{/* header */}
					{!isPublicChat && showHeader && (
						<ChatHeader
							sessionId={sessionId}
							isNewChat={info?.isNewChat}
							smoothScrollToParticularMessage={smoothScrollToParticularMessage}
							showDeleteChat={showDeleteChat}
							showChats={showChats}
						/>
					)}

					{info?.activeRightBar === 'notes' && (
						<div className="chat-to-note-link-container">
							<div className="title">Link all chat to note</div>
							<div
								className={`link-icon-container ${
									info?.chatToNoteLoopOn ? 'active' : ''
								}`}
								onClick={handleChatToNoteLoopClick}
							>
								{info?.chatToNoteLoopOn ? <LinkDarkSvg /> : <LinkLightSvg />}
							</div>
						</div>
					)}

					{/* chat body */}
					<div className="chatBodyWrapper">
						<div
							className={`chatBodyParentContainer`}
							ref={chatContentRef}
							id="scrollableDiv"
						>
							{info?.ready && (
								<InfiniteScroll
									dataLength={
										globalChatMessages?.[sessionId]?.messages?.length || 0
									}
									next={fetchMoreData}
									hasMore={
										globalChatMessages?.[sessionId]?.recentChatInfo
											?.hasNextPage || false
									}
									loader={<FetchMoreLoaderComp />}
									scrollableTarget="scrollableDiv"
									inverse={true}
									style={{
										overflow: 'unset',
									}}
								>
									<div
										className="chatContent"
										style={{ paddingBottom: `${info?.chatPaddingBottom}px` }}
									>
										{(globalChatMessages?.[sessionId]?.messages || [])?.map(
											(chat, index) =>
												chat?.content ? (
													<Fragment key={index}>{chat?.content}</Fragment>
												) : (
													<div
														key={index}
														className={`chat-message ${chat?.type?.toLowerCase()}-message chat-${index}`}
														style={{
															minHeight:
																index ===
																globalChatMessages?.[sessionId]
																	?.messages?.length -
																	1
																	? `${
																			chatContentRef?.current
																				?.clientHeight - 160
																	  }px`
																	: 'auto',
														}}
													>
														<div className="message-content">
															{chat?.type?.toLowerCase() === 'ai' ? (
																<div
																	className="content"
																	style={{
																		...(info?.currentUserMessageIndex !==
																			null && {
																			opacity:
																				index ===
																				info?.currentUserMessageIndex +
																					1
																					? 1
																					: 0.6,
																		}),
																	}}
																	data-message-id={
																		chat?.messageId
																	}
																	data-index={index}
																>
																	<AIMessageRenderer
																		messageData={chat}
																		handleNoteComponentModalOpen={
																			handleNoteComponentModalOpen
																		}
																		handleViewDocument={
																			handleViewDocument
																		}
																		showViewDocument={
																			info?.showViewDocument
																		}
																		isPublicChat={isPublicChat}
																		handleSourcesClick={
																			handleSourcesClick
																		}
																		messageIndex={index}
																		showCitationsButton={
																			showCitationsButton
																		}
																		isLastMessage={
																			index ===
																			globalChatMessages?.[
																				sessionId
																			]?.messages?.length -
																				1
																		}
																		sessionId={sessionId}
																		showResponseEditBtn={
																			showResponseEditBtn
																		}
																	/>
																</div>
															) : (
																<div
																	ref={(el) => {
																		if (
																			el &&
																			!userMessagesRefs
																				.current?.[index]
																		) {
																			userMessagesRefs.current[
																				index
																			] = el;
																		}
																	}}
																	data-index={index}
																	key={index}
																	style={{
																		...(info?.currentUserMessageIndex !==
																			null && {
																			opacity:
																				index ===
																				info?.currentUserMessageIndex
																					? 1
																					: 0.6,
																		}),
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
							)}
						</div>
						{showChatBox && (
							<div className="chatBoxWrapper">
								<ChatBox
									isPublicChat={isPublicChat}
									handleSendWebsocketMessage={handleSendWebsocketMessage}
									hideDeepResearch={agentType === 'search_agent'}
									autoFocus={autoFocus}
									customChatBoxClick={customChatBoxClick}
									showScrollButton={info?.showScrollButton}
									smoothScrollToBottom={smoothScrollToBottom}
									sessionId={sessionId}
									handleBrowserButtonClick={handleBrowserButtonClick}
									showBrowserButton={
										!info?.openBrowser && info?.browserDataAvailable
									}
									browserImage={
										globalChatMessages?.[sessionId]?.browserData
											?.browserMetadata?.signedUrl
									}
									showBottomTools={showBottomTools}
									showMicBtn={showMicBtn}
									showRecentFiles={showRecentFiles}
									isDesktopApp={isDesktopApp}
									handleDesktopAppPayload={handleDesktopAppPayload}
									handleChatBoxHeight={handleChatBoxHeight}
									getChatBoxHeight={true}
								/>
							</div>
						)}
					</div>

					<div className="ve-mistake-text">
						Ve can make mistakes. Double check important info.
					</div>
				</div>

				{showBrowser && (
					<div
						className="browser-container"
						style={{
							width: info?.openBrowser ? '50vw' : '0px',
						}}
					>
						{info?.openBrowser && (
							<Browser
								sessionId={sessionId}
								isOpen={info?.openBrowser}
								browserData={browserData}
								handleBrowserButtonClick={handleBrowserButtonClick}
							/>
						)}
					</div>
				)}

				<div className="chat-right-bar-container" ref={rightBarRef}>
					{showRightBar && (
						<ChatRightBar
							activeRightBar={info?.activeRightBar}
							handleRightBarToggle={handleRightBarToggle}
							handleCloseCitationsModal={handleCloseCitationsModal}
							chatToNoteLoopOn={info?.chatToNoteLoopOn}
							sessionId={sessionId}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default memo(RecentChat);
