import React, { memo, useCallback, useState, useRef, useEffect, useContext, Fragment } from 'react';
import '../../../assets/scss/chat/chat.scss';
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
import ObjectID from 'bson-objectid';
import { ReactComponent as DeleteSvg } from '../../../assets/svg/delete.svg';
import AIMessageRenderer from '../../components/chat/AIMessageRenderer';
import TextSelector from '../../components/chat/chatComponents/TextSelector';
import useWorkspaceMode from '../../../views/hooks/useWorkspaceMode';
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
	const { workspaceMode } = useWorkspaceMode();
	const {
		templates: {
			globalChatMessages,
			updateStateValues,
			updateAiChatMessageRating,
			getRecentChatMessages,
			recentChatStorage,
			moreRecentChatStorage,
			handleGlobalChatMessages,
			chatInfo,
			currentChatData,
			chatHistoryDrawerIsOpen,
			currentSessionId,
			updateChatLoadingSessions,
			newChatSessionIds,
			deleteChatSession,
		},
		aiSetup: { updateAiChatSessions },
		chatStream: {
			createWebSocketConnection,
			sendMessage,
			closeWebSocketConnection,
			removeCurrentSessionId,
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
		previousAgentType: null,
		showScrollButton: false,
		showViewDocument: false,
		tooltipStyles: { visible: false, styles: { top: 0, left: 0 }, selectedText: '' },
		deleteChatSessionLoading: false,
	});

	const chatContentRef = useRef(null);
	const chatMessagesRef = useRef([]);
	let { sessionId } = useParams();
	const [searchParams, setSearchParams] = useSearchParams();
	const userMessagesRefs = useRef({});
	// const previousAiMessagesRef = useRef([]);
	// const aiCitationsByIdRef = useRef({});
	const tabsRefs = useRef({});
	const previousTabsRefs = useRef({});
	const isFirstTimeConnectingToPublicChatRef = useRef(true);
	const navigate = useNavigate();
	const location = useLocation();
	const newChatSessionIdsRef = useRef(newChatSessionIds);
	const globalChatMessagesRef = useRef(globalChatMessages);
	sessionId = isPreview ? sId : sessionId;

	useEffect(() => {
		if (sessionIdChanged && chatActive) {
			const agentType = 'mulit_agent';
			createWebSocketConnection(
				sessionId,
				onMessageFunc,
				agentType,
				isPublicChat,
				workspaceMode,
			);
			onChangeSessionId?.();
		}
	}, [sessionIdChanged, chatActive]);

	useEffect(() => {
		window?.addEventListener('resize', handleResize);
		document.addEventListener('mouseup', handleMouseUp);

		handleResize(0);

		return () => {
			window?.removeEventListener('resize', handleResize);
			document.removeEventListener('mouseup', handleMouseUp);
			clearTimeout(throttleTimer);

			setTimeout(() => {
				tabsRefs.current = {};
				userMessagesRefs.current = {};
				updateStateValues({
					moreRecentChatStorage: null,
					recentChatStorage: null,
					citations: null,
					chatPayload: {
						workflowTemplateId: null,
						moduleTemplateId: null,
					},
					chatReplyData: null,
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
		const { workflow_template_id, module_template_id } = info?.latestStreamMesage || {};
		if (workflow_template_id && module_template_id && info?.showViewDocument) {
			updateStateValues({
				documentPreviewIds: {
					workflowTemplateId: workflow_template_id,
					moduleTemplateId: module_template_id,
				},
			});
		}
	}, [info?.latestStreamMesage]);

	useEffect(() => {
		if (sessionId) {
			if (info?.renderingTwice) {
				//clearing context state when rendering different session
				updateStateValues({
					moreRecentChatStorage: null,
					recentChatStorage: null,
					// globalChatMessages: [],
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
			}

			if (!globalChatMessages?.[sessionId]) {
				getRecentChatMessages(sessionId, 1, false, 1000, isPublicChat);
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
		const agentType = searchParams?.get('agentType');
		const assistantId = searchParams?.get('assistantId') || null;
		if ((!agentType && location?.pathname?.includes('knowledge-agent')) || chatActive) {
			return;
		}

		if (agentType) {
			updateStateValues({ chatInfo: { ...chatInfo, agentType, assistantId } });
		}
		if (sessionId && !isPublicChat && workspaceMode) {
			createWebSocketConnection(
				sessionId,
				onMessageFunc,
				agentType,
				isPublicChat,
				workspaceMode,
			);
		}

		if (
			sessionId &&
			isPublicChat &&
			isFirstTimeConnectingToPublicChatRef.current &&
			workspaceMode
		) {
			createWebSocketConnection(
				sessionId,
				onMessageFunc,
				agentType,
				isPublicChat,
				workspaceMode,
			);
			isFirstTimeConnectingToPublicChatRef.current = false;
		}
	}, [sessionId, searchParams, workspaceMode]);

	useEffect(() => {
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
		chatMessagesRef.current = [...(globalChatMessages?.[sessionId]?.messages || [])];

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
			recentChatHandler(recentChatStorage, false, firstTimeApiCall);
		}
	}, [recentChatStorage]);

	useEffect(() => {
		if (moreRecentChatStorage) {
			const firstTimeApiCall = false;
			recentChatHandler(moreRecentChatStorage, true, firstTimeApiCall);
		}
	}, [moreRecentChatStorage]);

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
				const relativeY = y - 50 - (containerRect?.top || 0);

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
		(inComingData, fetchMore = false, firstTimeApiCall = false) => {
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
		[sessionId],
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

					handleGlobalChatMessages({
						updateExtraInfo: true,
						recentChatMessages: messages,
						sessionId: currentSessionId,
					});
					chatMessagesRef.current = messages;
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
	const onMessageFunc = useCallback(
		(event, currentSessionId) => {
			let { data = '' } = event || {};
			data = JSON?.parse(data);

			if (data?.hasOwnProperty('intermediate_response') || data?.memory_thinking) {
				handleGlobalChatMessages({
					payload: data,
					sessionId,
					updateExtraInfo: true,
				});
				return;
			}
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

				if (chatMessagesRef?.current?.length === 2) {
					const payload = {
						sessionId,
						page: 1,
						limit: 5,
					};
					updateAiChatSessions(payload);
				}
				setInfo((prev) => ({ ...prev, latestStreamMesage: data }));
			}
			const { message_chunk_id } = data;

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
				await sendMessage(data);
				smoothScrollToLastMessage();
				setInfo((prev) => ({ ...prev, lastQuery: lastQuery }));
				handleGlobalChatMessages({
					sessionId,
					lastQuery,
					updateExtraInfo: true,
				});
			} catch (error) {
				console.error('Failed to send message:', error);
				// Handle error appropriately (show notification, etc.)
			}
		},
		[sendMessage, sessionId],
	);

	const toggleLatestStreamMessage = useCallback(() => {
		setInfo((prev) => ({ ...prev, latestStreamMesage: null }));
	}, []);
	const handleViewDocument = useCallback((value) => {
		setInfo((prev) => ({ ...prev, showViewDocument: value }));
	}, []);

	const handleDeleteChatClick = useCallback(async () => {
		if (info?.deleteChatSessionLoading) {
			return;
		}
		setInfo((prev) => ({ ...prev, deleteChatSessionLoading: true }));
		const response = await deleteChatSession(sessionId);
		if (response?.[0] === true) {
			navigate('/home');
			updateStateValues({
				refetchChatHistoryList: true,
			});
		} else {
			message.error('Failed to delete chat session');
		}
		setInfo((prev) => ({ ...prev, deleteChatSessionLoading: false }));
	}, [deleteChatSession, sessionId, info?.deleteChatSessionLoading]);

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
							<div className="right-container">
								<Tooltip
									title={<div className="recent-chat-tooltip">Delete Chat</div>}
									placement="bottom"
									color="transparent"
									arrow={false}
								>
									<button
										className="delete-chat-btn"
										onClick={handleDeleteChatClick}
									>
										<DeleteSvg />
									</button>
								</Tooltip>
							</div>
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
																// style={{
																// 	opacity:
																// 		index ===
																// 		info?.activeUserMessageIndex
																// 			? 1
																// 			: 0.6,
																// }}
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
