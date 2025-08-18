import React, { memo, useCallback, useState, useRef, useEffect, useContext, Fragment } from 'react';
import '../../../assets/scss/chat/chat.scss';
import {
	handleDeepSearchChainOfThought,
	handleDeepResearchChainOfThought,
	getBrowserUrls,
} from '../../../helpers/chat/chatHelpers';
import { establishSocketConnection } from '../../../helpers/chat/browserSocket';
import Context from '../../../context/context';
import { UserMessageRenderer } from '../../../helpers/markdownHelper';
import NoteComponentModal from '../../components/notes/NoteComponentModal';
import ChatBox from '../../components/chat/ChatBox';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FetchMoreLoaderComp } from '../../../helpers';
import { debounce } from 'lodash';
import AIMessageRenderer from '../../components/chat/AIMessageRenderer';
import TextSelector from '../../components/chat/chatComponents/TextSelector';
import ChatHeader from '../../components/chat/ChatHeader';
import CitationsModal from '../../components/modalsV2/chat/CitationsModal';
import { message } from '../../components/globalComponents/CustomToast';
import ChatHistory from '../../components/sidebar/chatHistory/ChatHistory';
import Browser from '../../components/chat/chatComponents/Browser';
import { ReactComponent as DoubleRightArrowSvg } from '../../../assets/svg/tasks/doubleRightArrow.svg';

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
	showBrowser = false,
	showHeader = true,
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
			latestStreamMesage: null,
			activeAIMessageIndex: null,
			activeAIMessageId: null,
			activeUserMessageIndex: null,
			renderingTwice: false,
			initialRendering: false,
			previousAgentType: null,
			showScrollButton: false,
			showViewDocument: false,
			tooltipStyles: { visible: false, styles: { top: 0, left: 0 }, selectedText: '' },
			deleteChatSessionLoading: false,
			isNewChat: true,
			currentUserMessageIndex: null,
			getFollowUpQueries: false,
			chatQuery: '',
			citationsAiMessageIndex: null,
			citationsModalIsOpen: false,
			openBrowser: false,
			browserDataAvailable: false,
			browserPreviousActiveTabIndex: null,
			isMobileView: false,
			isChatHistoryClosed,
		};
	});

	const chatContentRef = useRef(null);
	const userMessagesRefs = useRef({});
	// const previousAiMessagesRef = useRef([]);
	// const aiCitationsByIdRef = useRef({});
	const tabsRefs = useRef({});
	const previousTabsRefs = useRef({});
	const isFirstTimeConnectingToPublicChatRef = useRef(true);
	const agentTimeoutIdRef = useRef(null);
	const navigate = useNavigate();
	const location = useLocation();
	const newChatSessionIdsRef = useRef(newChatSessionIds);
	const globalChatMessagesRef = useRef(globalChatMessages);
	const currentUserMessageTimeoutRef = useRef(null);
	const followUpQueryTimeoutRef = useRef(null);

	sessionId = isPreview ? sId : sessionId;

	const browserData = globalChatMessages?.[sessionId]?.browserData;

	// Save whenever it changes
	useEffect(() => {
		localStorage.setItem('chatHistorySidebarClosed', JSON.stringify(info.isChatHistoryClosed));
	}, [info.isChatHistoryClosed]);

	useEffect(() => {
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mouseup', handleMouseUp);

			if (currentUserMessageTimeoutRef.current) {
				clearTimeout(currentUserMessageTimeoutRef.current);
				currentUserMessageTimeoutRef.current = null;
			}

			setTimeout(() => {
				tabsRefs.current = {};
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
					citations: null,
					chatPayload: {
						workflowTemplateId: null,
						moduleTemplateId: null,
					},
					chatReplyData: null,
					aiMessagesInfo: null,
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
		if (browserData) {
			setInfo((prev) => ({
				...prev,
				browserPreviousActiveTabIndex: browserData?.activeTabIndex,
			}));
		}
	}, [browserData]);

	useEffect(() => {
		if (info?.getFollowUpQueries) {
			if (agentType !== 'knowledge_agent' && info?.chatQuery?.trim()?.length === 0) {
				followUpQueryTimeoutRef.current = setTimeout(() => {
					getFollowUpQueries(sessionId, info?.latestStreamMesage?.message_id);
				}, 5000);
			}
			setInfo((prev) => ({
				...prev,
				getFollowUpQueries: false,
			}));
		}
	}, [info?.getFollowUpQueries]);

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
					// globalChatMessages: [],
					citations: null,
					chatPayload: {
						workflowTemplateId: null,
						moduleTemplateId: null,
					},
					aiMessagesInfo: null,
				});
				tabsRefs.current = {};
				userMessagesRefs.current = {};
				setInfo((prev) => ({
					...prev,
					scrollExecuted: false,
					citationsModalIsOpen: false,
					citationsAiMessageIndex: null,
					browserDataAvailable: false,
					browserPreviousActiveTabIndex: null,
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

			if (!globalChatMessages?.[sessionId]?.open_browser) {
				getRecentChatMessages({
					sessionId,
					page: 1,
					fetchMore: false,
					limit: 1000,
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
	}, [sessionId]);

	useEffect(() => {
		// const agentType = searchParams?.get('agentType');
		// const assistantId = searchParams?.get('assistantId') || null;
		// if (!agentType && location?.pathname?.includes('knowledge-agent')) {
		// 	return;
		// }

		if (
			agentType &&
			sessionId &&
			globalChatMessages?.[sessionId]?.chatInfo?.agentType !== agentType &&
			globalChatMessages?.[sessionId]?.chatInfo?.assistantId !== assistantId
		) {
			// updateStateValues({ chatInfo: { agentType, assistantId } });
			handleGlobalChatMessages({
				sessionId,
				updateExtraInfo: true,
				chatInfo: { agentType, assistantId },
			});
		}
		// if (sessionId && !isPublicChat) {
		// 	createWebSocketConnection(sessionId, onMessageFunc, agentType, isPublicChat);
		// }

		// if (sessionId && isPublicChat && isFirstTimeConnectingToPublicChatRef.current) {
		// 	createWebSocketConnection(sessionId, onMessageFunc, agentType, isPublicChat);
		// 	isFirstTimeConnectingToPublicChatRef.current = false;
		// }
	}, [sessionId, agentType, assistantId]);

	useEffect(() => {
		if (globalChatMessages?.[sessionId]?.messages?.length && info?.isNewChat) {
			setInfo((prev) => ({
				...prev,
				isNewChat: false,
			}));
		}
		if (globalChatMessages?.[sessionId]?.messages?.length > 2 && !info?.scrollExecuted) {
			setTimeout(() => {
				smoothScrollToLastMessage();
			}, 0);
			setInfo((prev) => ({
				...prev,
				scrollExecuted: true,
			}));
		}
	}, [globalChatMessages, sessionId]);

	// useEffect(() => {
	// 	if (globalChatMessages?.[sessionId]?.browserData) {
	// 		setInfo((prev) => {
	// 			return {
	// 				...prev,
	// 				openBrowser: true,
	// 				browserDataAvailable: true,
	// 			};
	// 		});
	// 	}
	// }, [globalChatMessages?.[sessionId]?.browserData]);

	// useEffect(() => {
	// 	if (!chatContentRef?.current || !tabsRefs?.current) return;
	// 	previousTabsRefs.current = tabsRefs.current;
	// 	const observer = new IntersectionObserver(
	// 		() => {
	// 			Object?.values(tabsRefs?.current)?.forEach((entry) => {
	// 				if (
	// 					entry?.getBoundingClientRect()?.top <
	// 					chatContentRef?.current?.getBoundingClientRect()?.top
	// 				) {
	// 					if (!entry?.classList?.contains('sticky-element')) {
	// 						entry?.classList?.add('sticky-element');
	// 					}
	// 				} else {
	// 					if (entry?.classList?.contains('sticky-element')) {
	// 						entry?.classList?.remove('sticky-element');
	// 					}
	// 				}
	// 			});
	// 		},
	// 		{
	// 			root: chatContentRef?.current, // Observe within the parent
	// 			threshold: [0.99, 1], // Triggers when any part enters
	// 		},
	// 	);

	// 	Object?.values(tabsRefs?.current)?.forEach((tab) => {
	// 		observer?.observe(tab);
	// 	});
	// 	return () => {
	// 		Object?.values(previousTabsRefs?.current)?.forEach((tab) => {
	// 			observer.unobserve(tab);
	// 		});
	// 	};
	// }, [globalChatMessages]);

	useEffect(() => {
		globalChatMessagesRef.current = globalChatMessages;
		if (!sessionId) return;

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

	const handleBrowserButtonClick = useCallback(() => {
		if (!location?.pathname?.includes('chat')) {
			navigate(`/chat/${sessionId}`);
			return;
		}
		setInfo((prev) => ({
			...prev,
			openBrowser: !prev?.openBrowser,
		}));
	}, [sessionId]);

	const handleChatHistoryToggle = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			isChatHistoryClosed: !Boolean(prev?.isChatHistoryClosed),
		}));
	}, []);

	const handleChatQueryChange = useCallback((query) => {
		setInfo((prev) => ({
			...prev,
			chatQuery: query,
		}));
	}, []);

	const handleMouseUp = useCallback(() => {
		const selection = window?.getSelection();
		if (!selection?.isCollapsed) {
			const range = selection?.getRangeAt(0);
			const rects = range?.getClientRects();
			const selectedText = selection?.toString();

			if (rects?.length > 0) {
				const firstRect = rects[0];
				const x = firstRect?.left + window?.scrollX;
				const y = firstRect?.top + window?.scrollY;

				// Get the infinite scroll container height
				const infiniteScrollContainer = document?.querySelector(
					'.infinite-scroll-component__outerdiv',
				);
				const containerRect = infiniteScrollContainer?.getBoundingClientRect();

				// Calculate x and y relative to the infinite scroll container
				const relativeX = x - (containerRect?.left || 0);
				const relativeY = y - 44 - (containerRect?.top || 0);

				setInfo((prev) => ({
					...prev,
					tooltipStyles: {
						selectedText,
						visible: true,
						styles: { top: relativeY, left: relativeX },
					},
				}));
			}
		} else {
			setInfo((prev) => {
				const { visible, styles } = prev?.tooltipStyles || {};
				if (visible === false && styles?.top === 0 && styles?.left === 0) return prev;

				return {
					...prev,
					tooltipStyles: {
						selectedText: prev?.tooltipStyles?.selectedText,
						visible: false,
						styles: { top: 0, left: 0 },
					},
				};
			});
		}
	}, []);

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
				} = data?.[i] || {};

				if (
					agentTypeFromResponse === 'knowledge_agent' &&
					agentType !== 'knowledge_agent'
				) {
					continue;
				}

				if (firstTimeApiCall) {
					chatPayload = {
						workflowTemplateId: workflowTemplateId || null,
						moduleTemplateId: moduleTemplateId || null,
					};
				}
				let processing = null,
					memoryThinking = null;
				let deepSearch = {},
					deepResearch = {},
					normalSearch = {};

				if (chainOfThought?.length > 0) {
					for (let i = 0; i < chainOfThought?.length; i++) {
						const { deep_search, deep_research, memory_thinking, normal_search } =
							chainOfThought?.[i] || {};
						if (deep_search) {
							processing = 'Deep Search';
							break;
						} else if (deep_research) {
							processing = 'Deep Research';
							break;
						} else if (normal_search) {
							processing = 'Normal Search';
							break;
						} else if (memory_thinking) {
							memoryThinking = memory_thinking;
						}
					}

					if (processing === 'Deep Search') {
						deepSearch = handleDeepSearchChainOfThought(chainOfThought);
					} else if (processing === 'Deep Research') {
						deepResearch = handleDeepResearchChainOfThought(chainOfThought);
					} else if (processing === 'Normal Search') {
						normalSearch = handleDeepSearchChainOfThought(chainOfThought);
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
						tool_invocations: toolInvocations || [],
						userFeedbackReasons,
						userRemarks,
						unintegrated_apps: unintegratedApps,
						...(processing === 'Deep Search' && { deepSearch }),
						...(processing === 'Deep Research' && { deepResearch }),
						...(processing === 'Normal Search' && { normalSearch }),
						...(memoryThinking && { memory_thinking: memoryThinking }),
					},
				]?.concat(messages);
			}

			if (messages?.length > 0) {
				handleGlobalChatMessages({
					sessionId,
					fetchMore,
					recentChatMessages: messages,
					updateExtraInfo: true,
					...(chatPayload?.moduleTemplateId &&
						chatPayload?.workflowTemplateId && { chatPayload }),
				});
			}
			// updateStateValues({
			// 	...(chatPayload?.moduleTemplateId &&
			// 		chatPayload?.workflowTemplateId && { chatPayload }),
			// });

			// if (fetcMore) {
			// 	updateStateValues({
			// 		globalChatMessages: {
			// 			...(globalChatMessages || {}),
			// 			[sessionId]: {
			// 				...(globalChatMessages?.[sessionId] || {}),
			// 				messages: messages?.concat(chatMessagesRef?.current),
			// 			},
			// 		},
			// 		...(chatPayload?.moduleTemplateId &&
			// 			chatPayload?.workflowTemplateId && { chatPayload }),
			// 	});
			// 	// if (chatContentRef?.current) {
			// 	// 	chatContentRef.current.scrollBy({
			// 	// 		top: 300, // Reduced from 500 for smoother feel
			// 	// 		behavior: 'smooth',
			// 	// 	});
			// 	// }
			// } else {
			// 	updateStateValues({
			// 		globalChatMessages: {
			// 			...(globalChatMessages || {}),
			// 			[sessionId]: {
			// 				...(globalChatMessages?.[sessionId] || {}),
			// 				messages,
			// 			},
			// 		},
			// 		...(chatPayload?.moduleTemplateId &&
			// 			chatPayload?.workflowTemplateId && { chatPayload }),
			// 	});
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

	const fetchMoreData = useCallback(
		debounce(async () => {
			if (!info?.hasNextPage || info?.chatLoading) {
				return;
			}
			getRecentChatMessages({
				sessionId,
				page: info?.currentPage + 1,
				fetchMore: true,
				isPublicChat,
				removeSessionId: false,
			});
			setInfo((prev) => ({ ...prev, chatLoading: true }));
		}, 1000),
		[info, sessionId, isPublicChat],
	);

	// browser socket
	const onBrowserMessageFunc = useCallback((event, sessionId) => {
		let { data = '' } = event || {};
		data = JSON?.parse(data);
		if (data?.type === 'new-tab-activated') {
			handleGlobalChatMessages({
				sessionId,
				browserTabsInfo: {
					...data,
					browserDisconnected: false,
				},
				updateExtraInfo: true,
			});
		}
	}, []);

	const handleBrowserSocketConnection = useCallback((sessionId) => {
		establishSocketConnection(sessionId, onBrowserMessageFunc);
	}, []);

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
					...(sessionId === currentSessionId &&
						!data?.used_agents?.includes('custom_agents_manager_agent') && {
							getFollowUpQueries: true,
						}),
				}));
			}
			const { message_chunk_id, open_browser } = data;

			if (open_browser) {
				// getBrowserUrls(
				// 	sessionId,
				// 	handleGlobalChatMessages,
				// 	info?.browserPreviousActiveTabIndex,
				// );
				handleBrowserSocketConnection(sessionId);
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
		[
			globalChatMessages,
			sessionId,
			handleBrowserSocketConnection,
			info?.browserPreviousActiveTabIndex,
		],
	);

	const handleSendWebsocketMessage = useCallback(
		async (data, lastQuery) => {
			try {
				await sendMessage({ data, sessionId, onMessageFunc, isPublicChat, agentType });
				setTimeout(() => {
					smoothScrollToLastMessage();
				}, 0);
				handleGlobalChatMessages({
					sessionId,
					lastQuery,
					updateExtraInfo: true,
				});
			} catch (error) {
				const info = typeof error?.message === 'string' ? error?.message || '' : '';
				message.error(info);
				console.error('Failed to send message:', error);

				handleGlobalChatMessages({
					sessionId,
					updateExtraInfo: true,
					removeStreaming: true,
				});

				// Handle error appropriately (show notification, etc.)
			}
		},
		[
			sendMessage,
			sessionId,
			onMessageFunc,
			agentType,
			isPublicChat,
			handleBrowserSocketConnection,
		],
	);

	const handleViewDocument = useCallback((value) => {
		setInfo((prev) => ({ ...prev, showViewDocument: value }));
	}, []);

	const handleCloseCitationsModal = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			citationsModalIsOpen: false,
			citationsAiMessageIndex: null,
		}));
	}, []);

	const handleSourcesClick = useCallback(
		(index) => {
			setInfo((prev) => {
				if (index !== prev?.citationsAiMessageIndex) {
					updateStateValues({
						chatSources: globalChatMessages?.[sessionId]?.messages?.[index]?.citations,
					});
				}
				return {
					...prev,
					citationsModalIsOpen: index !== prev?.citationsAiMessageIndex,
					citationsAiMessageIndex: index !== prev?.citationsAiMessageIndex ? index : null,
				};
			});
		},
		[globalChatMessages, sessionId, updateStateValues],
	);

	return (
		<>
			<div
				className="chat-page-container-wrapper"
				style={{
					width: info?.citationsModalIsOpen ? 'calc(100% - 400px)' : '100%',
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
							// style={{
							// 	'--chat-content-height': `${chatContentRef?.current?.clientHeight}px`,
							// }}
						>
							<TextSelector
								styles={info?.tooltipStyles?.styles}
								text={info?.tooltipStyles?.selectedText}
								visible={info?.tooltipStyles?.visible}
							/>
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
																			?.clientHeight - 177
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
									!info?.openBrowser && info?.browserDataAvailable && showBrowser
								}
								browserImage={
									globalChatMessages?.[sessionId]?.browserData?.browserMetadata
										?.signedUrl
								}
							/>
						</div>
					</div>
				</div>

				<div
					className="browser-container"
					style={{
						width: info?.openBrowser && showBrowser ? '50vw' : '0px',
					}}
				>
					<Browser
						sessionId={sessionId}
						isOpen={info?.openBrowser && showBrowser}
						browserData={browserData}
						handleBrowserButtonClick={handleBrowserButtonClick}
					/>
				</div>
			</div>

			<CitationsModal
				modalIsOpen={info?.citationsModalIsOpen}
				closeModal={handleCloseCitationsModal}
			/>
			<NoteComponentModal
				modalIsOpen={info?.noteModalIsOpen}
				closeModal={handleNoteComponentModalClose}
				sessionId={sessionId}
			/>
		</>
	);
};

export default memo(RecentChat);
