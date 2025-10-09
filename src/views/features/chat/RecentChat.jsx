import React, {
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
import ChatHistory from '../../components/sidebar/chatHistory/ChatHistory';
import { ReactComponent as DoubleRightArrowSvg } from '../../../assets/svg/tasks/doubleRightArrow.svg';
import InfiniteScroll from '../../components/globalComponents/InfiniteScroll';
import ChatRightBar from '../../components/chat/chatComponents/ChatRightBar';
import NoteComponentModal from '../../components/notes/NoteComponentModal';
import Browser from '../../components/chat/chatComponents/Browser';

const RecentChat = ({
	isPublicChat = false,
	isPreview = false,
	sId = null,
	autoFocus = true,
	customChatBoxClick = null,
	showCitationsButton = false,
	showDeleteChat = false,
	animateChatBox = true,
	showChatHistory = false,
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

	// below props are for desktop app
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
			newChatSessionIds,
			getFollowUpQueries,
		},
		aiSetup: { updateAiChatSessions },
		chatStream: { sendMessage, closeWebSocketConnection, removeCurrentSessionId },
	} = useContext(Context);

	let { sessionId } = useParams();
	const [searchParams] = useSearchParams();
	let agentType = searchParams?.get('agentType');
	let assistantId = searchParams?.get('assistantId');

	const [info, setInfo] = useState(() => {
		let isChatHistoryClosed = false;
		try {
			const stored = localStorage.getItem('chatHistorySidebarClosed');
			if (stored) {
				const parsed = JSON.parse(stored);
				if (typeof parsed === 'boolean') {
					isChatHistoryClosed = parsed;
				}
			}
		} catch (e) {
			isChatHistoryClosed = false;
		}

		return {
			position: { x: window?.innerWidth / 2 - 900, y: 0 },
			chatSessionId: null,
			uploadedImages: [],
			chatLoading: false,
			voiceIntegration: false,
			noteModalIsOpen: false,
			page: 1,
			currentPage: true,
			scrollExecuted: false,
			latestStreamMesage: null,
			activeAIMessageIndex: null,
			activeAIMessageId: null,
			activeUserMessageIndex: null,
			renderingTwice: false,
			initialRendering: false,
			previousAgentType: null,
			showScrollButton: false,
			showViewDocument: false,
			deleteChatSessionLoading: false,
			isNewChat: true,
			currentUserMessageIndex: null,
			// getFollowUpQueries: false,
			chatQuery: '',
			citationsAiMessageIndex: null,
			isMobileView: false,
			isChatHistoryClosed,
			openBrowser: false,
			browserDataAvailable: false,
			chatPaddingBottom: 70,
			rightBarOpen: false,
			activeRightBar: null,
			rightBarWidth: 0,
		};
	});

	const chatContentRef = useRef(null);
	const userMessagesRefs = useRef({});
	const agentTimeoutIdRef = useRef(null);
	const navigate = useNavigate();
	const location = useLocation();
	const newChatSessionIdsRef = useRef(newChatSessionIds);
	const globalChatMessagesRef = useRef(globalChatMessages);
	const currentUserMessageTimeoutRef = useRef(null);
	const followUpQueryTimeoutRef = useRef(null);
	const rightBarRef = useRef(null);

	sessionId = isPreview ? sId : sessionId;

	const browserData = globalChatMessages?.[sessionId]?.browserData;

	// Save whenever it changes
	useEffect(() => {
		localStorage.setItem('chatHistorySidebarClosed', JSON.stringify(info.isChatHistoryClosed));
	}, [info.isChatHistoryClosed]);

	useEffect(() => {
		return () => {
			if (currentUserMessageTimeoutRef.current) {
				clearTimeout(currentUserMessageTimeoutRef.current);
				currentUserMessageTimeoutRef.current = null;
			}

			setTimeout(() => {
				userMessagesRefs.current = {};
				if (followUpQueryTimeoutRef.current) {
					clearTimeout(followUpQueryTimeoutRef.current);
					followUpQueryTimeoutRef.current = null;
				}
				if (agentTimeoutIdRef.current) {
					clearTimeout(agentTimeoutIdRef.current);
					agentTimeoutIdRef.current = null;
				}
				updateStateValues({
					moreRecentChatStorage: null,
					recentChatStorage: null,
					chatPayload: {
						workflowTemplateId: null,
						moduleTemplateId: null,
					},
					chatReplyData: null,
					aiMessagesInfo: null,
					isBrowserScreenActive: false,
				});
			}, 0);

			const sessionIdsToClose = newChatSessionIdsRef?.current?.filter(
				(id) => !globalChatMessagesRef?.current?.[id]?.isStreaming,
			);
			if (sessionIdsToClose?.length > 0) {
				closeWebSocketConnection(sessionIdsToClose);
			}
			handleGlobalChatMessages({
				removeChatSessions: true,
				updateExtraInfo: true,
			});
			removeCurrentSessionId();
			updateStateValues({
				newChatSessionIds: [],
				currentSessionId: null,
				currentChatData: null,
			});
		};
	}, []);

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

	useEffect(() => {
		if (rightBarRef.current) {
			setInfo((prev) => ({
				...prev,
				rightBarWidth: rightBarRef.current?.clientWidth,
			}));
		}
	}, [info?.rightBarOpen, info?.activeRightBar]);

	// useEffect(() => {
	// 	if (info?.getFollowUpQueries) {
	// 		if (agentType !== 'knowledge_agent' && info?.chatQuery?.trim()?.length === 0) {
	// 			followUpQueryTimeoutRef.current = setTimeout(() => {
	// 				getFollowUpQueries(sessionId, info?.latestStreamMesage?.message_id);
	// 			}, 5000);
	// 		}
	// 		setInfo((prev) => ({
	// 			...prev,
	// 			getFollowUpQueries: false,
	// 		}));
	// 	}
	// }, [info?.getFollowUpQueries]);

	useEffect(() => {
		if (info?.chatQuery?.trim()?.length > 0) {
			if (followUpQueryTimeoutRef.current) {
				clearTimeout(followUpQueryTimeoutRef.current);
				followUpQueryTimeoutRef.current = null;
			}
		}
	}, [info?.chatQuery]);

	useEffect(() => {
		const { workflow_template_id, module_template_id } = info?.latestStreamMesage || {};
		if (workflow_template_id && module_template_id && info?.showViewDocument) {
			updateStateValues({
				documentPreviewIds: {
					workflowTemplateId: workflow_template_id,
					moduleTemplateId: module_template_id,
				},
			});
			setInfo((prev) => ({
				...prev,
				latestStreamMesage: null,
			}));
		}
	}, [info?.latestStreamMesage]);

	useEffect(() => {
		if (sessionId) {
			if (info?.renderingTwice) {
				//clearing context state when rendering different session
				updateStateValues({
					chatPayload: {
						workflowTemplateId: null,
						moduleTemplateId: null,
					},
					aiMessagesInfo: null,
					isBrowserScreenActive: false,
				});
				userMessagesRefs.current = {};
				setInfo((prev) => ({
					...prev,
					scrollExecuted: false,
					citationsAiMessageIndex: null,
					rightBarOpen: false,
					activeRightBar: null,
					rightBarWidth: 0,
				}));
			}
			if (currentUserMessageTimeoutRef.current) {
				clearTimeout(currentUserMessageTimeoutRef.current);
				currentUserMessageTimeoutRef.current = null;
			}

			if (agentTimeoutIdRef.current) {
				clearTimeout(agentTimeoutIdRef.current);
				agentTimeoutIdRef.current = null;
			}

			if (!globalChatMessages?.[sessionId]?.open_browser && fetchRecentChatMessages) {
				getRecentChatMessages({
					sessionId,
					page: 1,
					fetchMore: false,
					isPublicChat,
					removeSessionId: false,
				});
			}

			const sessionIdsToClose = newChatSessionIds?.filter(
				(id) => !globalChatMessages?.[id]?.isStreaming,
			);
			const sessionIdsStillOpen = newChatSessionIds?.filter(
				(id) => globalChatMessages?.[id]?.isStreaming,
			);
			if (sessionIdsToClose?.length > 0) {
				closeWebSocketConnection(sessionIdsToClose);
			}
			newChatSessionIdsRef.current = [...sessionIdsStillOpen, sessionId];

			handleGlobalChatMessages({
				sessionId,
				removeChatSessions: true,
				updateExtraInfo: true,
			});

			setInfo((prev) => ({
				...prev,
				chatLoading: true,
				chatSessionId: sessionId,
				renderingTwice: true,
			}));
			updateStateValues({
				currentSessionId: sessionId,
				newChatSessionIds: newChatSessionIdsRef.current,
			});
		}
	}, [sessionId, fetchRecentChatMessages]);

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

	useLayoutEffect(() => {
		if (!info?.scrollExecuted && globalChatMessages?.[sessionId]?.messages) {
			requestAnimationFrame(() => {
				smoothScrollToLastMessage('instant');
			});

			setInfo((prev) => ({
				...prev,
				scrollExecuted: true,
			}));
		}
	}, [globalChatMessages, sessionId]);

	useEffect(() => {
		globalChatMessagesRef.current = globalChatMessages;
		if (!sessionId) return;

		if (globalChatMessages?.[sessionId]?.messages?.length && info?.isNewChat) {
			setInfo((prev) => ({
				...prev,
				isNewChat: false,
			}));
		}

		// const container = chatContentRef.current;
		// if (!container) return;
		// const visibleUserMessagesSet = new Set();

		// const observer = new IntersectionObserver(
		// 	(entries) => {
		// 		entries?.forEach((entry) => {
		// 			const bounding = entry?.boundingClientRect;
		// 			const rootBounds = entry?.rootBounds;

		// 			// Check if it is entering the top half
		// 			if (entry?.isIntersecting) {
		// 				visibleUserMessagesSet?.add(entry?.target);
		// 			} else {
		// 				// If it scrolled past the top (i.e. fully out of view and above)
		// 				const isAboveTop = bounding?.bottom < rootBounds?.top;

		// 				if (isAboveTop) {
		// 					visibleUserMessagesSet?.add(entry?.target);
		// 				} else {
		// 					visibleUserMessagesSet?.delete(entry?.target);
		// 				}
		// 			}
		// 		});

		// 		const visibleUserMessages = [...visibleUserMessagesSet]?.map(
		// 			(m) => m?.dataset?.index,
		// 		);
		// 		if (visibleUserMessages?.length > 0) {
		// 			const activeUserMessageIndex = Number(
		// 				visibleUserMessages?.[visibleUserMessages?.length - 1],
		// 			);
		// 			const activeAIMessageIndex = activeUserMessageIndex + 1;
		// 			setInfo((prev) => ({
		// 				...prev,
		// 				activeUserMessageIndex,
		// 				activeAIMessageIndex,
		// 			}));
		// 		}
		// 	},
		// 	{
		// 		root: container,
		// 		rootMargin: '-10% 0px -50% 0px',
		// 		threshold: 0,
		// 	},
		// );

		// // Observe each user message element
		// Object?.values(userMessagesRefs.current)?.forEach((el) => {
		// 	observer.observe(el);
		// });
		// return () => {
		// 	visibleUserMessagesSet?.clear();
		// 	observer.disconnect();
		// };
	}, [globalChatMessages, sessionId]);

	useEffect(() => {
		if (recentChatStorage?.[sessionId]) {
			const firstTimeApiCall = true;
			recentChatHandler(recentChatStorage?.[sessionId], false, firstTimeApiCall);
			// updateStateValues({
			// 	recentChatStorage: null,
			// });
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

	useEffect(() => {
		if (moreRecentChatStorage?.[sessionId]) {
			const firstTimeApiCall = false;
			recentChatHandler(moreRecentChatStorage?.[sessionId], true, firstTimeApiCall);
			// updateStateValues({
			// 	moreRecentChatStorage: null,
			// });
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

	const handleChatHistoryToggle = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			isChatHistoryClosed: !prev?.isChatHistoryClosed,
		}));
	}, []);

	const handleChatQueryChange = useCallback((query) => {
		setInfo((prev) => ({
			...prev,
			chatQuery: query,
		}));
	}, []);

	const handleScroll = useCallback(() => {
		if (!chatContentRef?.current) return;

		//logic related to scroll button
		const { scrollTop, scrollHeight, clientHeight } = chatContentRef.current;
		const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
		const isNearBottom = distanceFromBottom < 50;

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

			// if (messages?.length > 0) {
			handleGlobalChatMessages({
				sessionId,
				fetchMore,
				recentChatMessages: messages,
				recentChatInfo,
				updateExtraInfo: true,
				...(chatPayload?.moduleTemplateId &&
					chatPayload?.workflowTemplateId && { chatPayload }),
			});
			// }

			setInfo((prev) => ({ ...prev, chatLoading: false, hasNextPage, currentPage }));
		},
		[sessionId, agentType],
	);

	const handleNoteComponentModalClose = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			noteModalIsOpen: false,
		}));
	}, []);

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
		(event, currentSessionId) => {
			let { data = '' } = event || {};
			data = JSON?.parse(data);

			if (data?.user_id) {
				localStorage?.setItem('user_id', data?.user_id);
			}

			if (data?.stream_end) {
				if (sessionId !== currentSessionId) {
					closeWebSocketConnection([sessionId]);
					updateChatLoadingSessions({ sessionId, isStreaming: false, isNotSeen: true });
				} else {
					updateChatLoadingSessions({ sessionId, removeSessionId: true });
				}

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
				setInfo((prev) => ({
					...prev,
					latestStreamMesage: data,
					// ...(sessionId === currentSessionId &&
					// 	!data?.used_agents?.includes('custom_agents_manager_agent') && {
					// 		getFollowUpQueries: true,
					// 	}),
				}));
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
					...(data?.stream_end &&
						sessionId !== currentSessionId && {
							removeChatSession: true,
						}),
				});
			}
		},
		[globalChatMessages, sessionId],
	);

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

	const handleRightBarToggle = useCallback(({ open = false, activeRightBar = null }) => {
		setInfo((prev) => ({
			...prev,
			rightBarOpen: open,
			activeRightBar: activeRightBar,
		}));
	}, []);

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
				{showChatHistory && !info?.isMobileView && (
					<div
						className={`chat-history-wrapper${
							info?.isChatHistoryClosed ? ' closed' : ''
						}`}
					>
						<div
							className={`chat-history-toggle-btn${
								info?.isChatHistoryClosed ? ' closed' : ''
							}`}
							onClick={handleChatHistoryToggle}
						>
							<DoubleRightArrowSvg
								className="chat-history-toggle-btn__icon"
								style={{
									transform: info?.isChatHistoryClosed
										? 'none'
										: 'rotate(180deg)',
								}}
							/>
						</div>
						<ChatHistory isClosed={info?.isChatHistoryClosed} />
					</div>
				)}

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

					{/* chat body */}
					<div className="chatBodyWrapper">
						<div
							className={`chatBodyParentContainer`}
							ref={chatContentRef}
							id="scrollableDiv"
						>
							<InfiniteScroll
								dataLength={globalChatMessages?.[sessionId]?.messages?.length || 0}
								next={fetchMoreData}
								hasMore={
									globalChatMessages?.[sessionId]?.recentChatInfo?.hasNextPage ||
									false
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
																// style={{
																// 	opacity:
																// 		index ===
																// 		info?.activeAIMessageIndex
																// 			? 1
																// 			: 0.6,
																// }}
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
																// style={{
																// 	opacity:
																// 		index ===
																// 		info?.activeUserMessageIndex
																// 			? 1
																// 			: 0.6,
																// }}

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
									onChatQueryChange={handleChatQueryChange}
									animateChatBox={animateChatBox}
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
						/>
					)}
				</div>
			</div>

			{info?.noteModalIsOpen && (
				<NoteComponentModal
					modalIsOpen={info?.noteModalIsOpen}
					closeModal={handleNoteComponentModalClose}
					sessionId={sessionId}
				/>
			)}
		</>
	);
};

export default memo(RecentChat);
