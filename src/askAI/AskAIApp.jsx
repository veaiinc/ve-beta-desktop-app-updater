import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { X } from 'lucide-react';
import './askAI.scss';
import ObjectID from 'bson-objectid';
import { getLocationsDetails } from '../helpers';
import Context from '../context/context';
import RecentChat from '../views/features/chat/RecentChat';
import ChatBox from '../views/components/chat/ChatBox';
import CustomToast from '../views/components/globalComponents/CustomToast';
import { ReactComponent as ExpandSvg } from './expand.svg';
import { ReactComponent as MinimizeSvg } from './minimize.svg';
import { flushSync } from 'react-dom';

const AskAIApp = () => {
	const {
		templates: { updateStateValues, globalChatMessages, handleGlobalChatMessages },
		chatStream: { sendMessage },
	} = useContext(Context);

	const [info, setInfo] = useState({
		sessionId: ObjectID()?.toString(),
		expandChat: false,
		workarea: null,
		mode: 'chatbox', // 'chatbox' or 'response' - determines which component to show
		hasMessages: false, // Track if there are any messages to determine initial state
	});
	const containerRef = useRef(null);
	const expandChatRef = useRef(false);
	// Fixed-size overlay (match NewUi chatbox sizing)
	const FIXED_WIDTH = 450;
	const FIXED_HEIGHT = 280;

	const setFixedDimensions = useCallback(() => {
		try {
			window?.electronApi?.askAI?.updateDimensions({
				width: FIXED_WIDTH,
				height: FIXED_HEIGHT,
				position: { isExpanding: false },
			});
		} catch (err) {
			// noop
		}
	}, []);

	const lastWindowHeightRef = useRef(null);
	const userResizingRef = useRef(false);
	const chatContainerRef = useRef(null); // Ref for auto-scrolling

	// Disable auto-resize; enforce fixed dimensions on mount
	useEffect(() => {
		setFixedDimensions();
		lastWindowHeightRef.current = FIXED_HEIGHT;
	}, [setFixedDimensions]);

	useEffect(() => {
		if (info?.expandChat) {
			handleExpandChat();
		}
	}, [info?.expandChat]);



	// Listen for tab content from overlay
	useEffect(() => {
		const handleTabContent = (tabContent) => {
			console.log('Received tab content from overlay:', tabContent);

			// Auto-generate a prompt based on the tab content
			const prompt = generatePromptFromTabContent(tabContent);

			// Check if this is from "All Threads" or "Need Help" tabs
			const shouldUseDirectSearch =
				tabContent.tabKey === 'all-threads' && tabContent.tabKey === 'need-help';
			// Automatically send the request to Ask AI with the generated prompt
			// Skip screenshot for tab content from overlay
			handleSubmit(prompt, shouldUseDirectSearch, true);
		};

		// Listen for chat messages from Dynamic Island or NotchDrop
		const handleChatMessage = (chatMessage) => {
			const isDynamicIsland = chatMessage.type === 'dynamic-island-chat';
			const isNotchDrop = chatMessage.type === 'notchdrop-chat';
			const isOverlayThread = chatMessage.type === 'overlay-thread-question';
			const isNeedHelp = chatMessage?.isNeedHelp;

			if (chatMessage?.sessionId) {
				flushSync(() => {
					setInfo((prev) => ({ ...prev, sessionId: chatMessage?.sessionId }));
				});
			}

			if ((isDynamicIsland || isNotchDrop || isOverlayThread) && chatMessage.message) {
				// Skip screenshot for ALL meeting intelligence insights (overlay thread questions)
				const shouldSkipScreenshot = isOverlayThread;
				handleSubmit(chatMessage.message, isNeedHelp, shouldSkipScreenshot);
			}
		};

		// Set up listeners
		window?.electronApi.askAI.onReceiveTabContent(handleTabContent);

		window?.electronApi.askAI.onReceiveChatMessage(handleChatMessage);

		// Listen for show chatbox command
		const handleShowChatbox = () => {
			setInfo((prev) => ({ ...prev, mode: 'chatbox' }));
			setFixedDimensions();
		};

		// Listen for show response command
		const handleShowResponse = () => {
			setInfo((prev) => ({ ...prev, mode: 'response' }));
			setFixedDimensions();
		};

		window?.electronApi.askAI.onShowChatbox(handleShowChatbox);
		window?.electronApi.askAI.onShowResponse(handleShowResponse);

		// Cleanup
		return () => {
			window?.electronApi.askAI.removeTabContentListener();
			window?.electronApi.askAI.removeChatMessageListener();
		window?.electronApi.askAI.removeShowChatboxListener();
		window?.electronApi.askAI.removeShowResponseListener();
		};
	}, []);

	// Determine initial mode based on existing messages
	useEffect(() => {
		const messages = globalChatMessages?.[info?.sessionId]?.messages;
		const hasExistingMessages = messages && messages.length > 0;

		if (hasExistingMessages && info?.mode === 'chatbox') {
			setInfo((prev) => ({ ...prev, mode: 'response', hasMessages: true }));
			setFixedDimensions();
		} else if (!hasExistingMessages && info?.mode === 'chatbox') {
			setFixedDimensions();
		}
	}, [globalChatMessages?.[info?.sessionId]?.messages?.length, info?.sessionId, info?.mode, setFixedDimensions]);

	// Generate prompt based on tab content
	const generatePromptFromTabContent = (tabContent) => {
		const { tabKey, tabLabel, content, type, itemContent, itemData } = tabContent;

		// Handle individual item clicks
		if (type === 'individual-item' && itemContent) {
			return itemContent;
		}

		// Handle empty content
		if (!content || content.length === 0) {
			return tabLabel;
		}

		const itemCount = content.length;
		const firstItem = content[0];

		switch (tabKey) {
			case 'all-threads':
				return firstItem.prompt || firstItem.name || 'No prompt available';

			case 'ask-user':
			case 'need-help':
			case 'actions':
				return firstItem.prompt;
			case 'files':
				return firstItem.prompt || firstItem.name;
			default:
				return tabLabel;
		}
	};

	const requestScreenPermissionIfNeeded = async () => {
		try {
			// ✅ Use the exposed API method, not .invoke()
			const checkResult = await window.electronApi.checkScreenPermission();
			if (checkResult.hasPermission) {
				return true;
			}

			// ✅ Use the exposed request method
			const requestResult = await window.electronApi.requestScreenPermission();
			if (requestResult.granted) {
				return true;
			} else {
				alert(
					'Please enable screen recording in System Settings > Privacy & Security > Screen Recording.',
				);
				return false;
			}
		} catch (err) {
			console.error('Permission check failed:', err);
			return false;
		}
	};

	const getCapturedScreenshot = async () => {
		const hasPermission = await requestScreenPermissionIfNeeded();

		// 📸 Capture screenshot using Electron API
		let base64Image = null;
		if (window.electronApi?.desktop?.captureScreen) {
			try {
				base64Image = await window.electronApi.desktop.captureScreen();
			} catch (err) {
				console.warn('Failed to capture screenshot:', err);
				// Optionally continue without image
			}
		}
		return base64Image;
	};

	const handleSubmit = async (customInput = null, isNeedHelp = null, skipScreenshot = false) => {
		const queryValue = customInput;
		if (!queryValue) return;

		// Use the passed isNeedHelp parameter if provided, otherwise use state
		const shouldUseDirectSearch = isNeedHelp;

		try {
			let base64Image = null;
			// Skip screenshot capture for overlay thread questions (Need Help insights)
			if (!skipScreenshot) {
				base64Image = await getCapturedScreenshot();
			}
			const imageArray = base64Image ? [base64Image] : [];
			// Prepare message data
			const messageData = {
				query: queryValue,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				web_search: true,
				knowledge_base_search: true,
				deep_research: false,
				deep_search: false,
				modules: [],
				date: [],
				selected_model: null,
				location: null,
				image_data_base64: imageArray,
			};

			// Only set direct_search_agent to true for "Need Help" tab requests
			if (shouldUseDirectSearch) {
				messageData.direct_agent = 'search_agent';
			}

			// Add location details
			let location_details = JSON?.parse(localStorage?.getItem('locationDetails'));
			if (!location_details) {
				location_details = await getLocationsDetails();
			}
			messageData.location = location_details;

			const activePayloadForChat = {
				payload: messageData,
				localPayload: {},
				recentFiles: [],
				currentQuery: queryValue,
			};

			updateStateValues({ activePayloadForChat });

			// Switch to response mode when a message is sent
			setInfo((prev) => ({ 
				...prev, 
				mode: 'response',
				hasMessages: true 
			}));

			setFixedDimensions();
		} catch (error) {
			console.error('Failed to send message:', error);
			// Reset the need help flag on error as well
		}
	};

	const handleDesktopAppPayload = async () => {
		let payload = {};
		try {
			const base64Image = await getCapturedScreenshot();
			if (base64Image) {
				payload.imagesArray = [base64Image];
			}
		} catch (err) {
			console.log('error while getting desktop payload', err);
		}
		return payload;
	};

	const handleClose = async () => {
		// If in response mode, stop streaming and reset to clean chatbox state
		if (info?.mode === 'response') {
			// Stop any ongoing message streaming
			try {
				// Clear any loading messages and stop streaming
				handleGlobalChatMessages({
					sessionId: info?.sessionId,
					removeLoadingMessage: true,
					removeStreaming: true,
					updateExtraInfo: true,
				});
			} catch (error) {
				console.warn('Error stopping message streaming:', error);
			}

			// Reset to clean chatbox state with new session
			const newSessionId = ObjectID()?.toString();
			setInfo((prev) => ({ 
				...prev, 
				mode: 'chatbox',
				sessionId: newSessionId,
				hasMessages: false
			}));

			setFixedDimensions();
		} else {
			// If in chatbox mode, close the window completely
			window?.electronApi.askAI.toggleWindow();
		}
	};

	const handleChatToggle = useCallback(() => {
		setInfo((prev) => {
			const newExpandState = !prev?.expandChat;
			expandChatRef.current = newExpandState;

			// If collapsing from expanded state, stop streaming and reset to clean chatbox state
			if (!newExpandState && prev?.expandChat) {
				// Stop any ongoing message streaming
				try {
					// Clear any loading messages and stop streaming
					handleGlobalChatMessages({
						sessionId: info?.sessionId,
						removeLoadingMessage: true,
						removeStreaming: true,
						updateExtraInfo: true,
					});
				} catch (error) {
					console.warn('Error stopping message streaming:', error);
				}

				// Reset to clean chatbox state with new session
				const newSessionId = ObjectID()?.toString();
				setInfo((current) => ({ 
					...current, 
					mode: 'chatbox', 
					expandChat: false,
					sessionId: newSessionId,
					hasMessages: false
				}));

				setFixedDimensions();

				// Update height reference
				lastWindowHeightRef.current = FIXED_HEIGHT;
				return prev; // Don't update state here since we're setting it above
			}

			return { ...prev, expandChat: newExpandState };
		});
	}, [info?.sessionId, handleGlobalChatMessages, setFixedDimensions]);

	const handleExpandChat = useCallback(async () => {
		// Expansion disabled – keep fixed size
		setFixedDimensions();
	}, [setFixedDimensions]);

	// Handler functions for ChatBox
	const handleChatQueryChange = useCallback((query) => {
		// This function is called when the chat query changes
		// We don't need to store it in state since ChatBox manages its own state
	}, []);

	const handleSendWebsocketMessage = useCallback(
		async (_data, lastQuery) => {
			try {
				// Build navigation payload similar to NotchDrop Swift submitChat
				const navData = {
					type: 'chat',
					message: lastQuery,
					timestamp: new Date().toISOString(),
					source: 'askai-overlay',
					path: `/chat/${ObjectID().toString()}`,
					updateObject: {
						type: 'chat',
						payload: {
							query: lastQuery,
						},
					},
				};

				// Ask main process to open/focus main window and navigate
				await window?.electronApi?.navigateMainWindow(navData);

				// Optionally hide AskAI window after navigation
				try { window?.electronApi?.askAI?.toggleWindow(); } catch (e) {}
			} catch (error) {
				console.error('Failed to navigate main window for chat:', error);
			}
		},
		[info?.sessionId],
	);

	// Auto-scroll functionality for Ask AI overlay
	const scrollToBottom = useCallback(() => {
		// Find the chat content container with more specific targeting
		const chatBodyContainer = document.querySelector('.ask-ai-app .chatBodyParentContainer');
		if (chatBodyContainer) {
			console.log('📜 Ask AI scrollToBottom:', {
				scrollHeight: chatBodyContainer.scrollHeight,
				clientHeight: chatBodyContainer.clientHeight,
				scrollTop: chatBodyContainer.scrollTop,
				canScroll: chatBodyContainer.scrollHeight > chatBodyContainer.clientHeight,
				containerStyle: {
					overflow: chatBodyContainer.style.overflow,
					height: chatBodyContainer.style.height,
					position: chatBodyContainer.style.position,
				},
			});

			// Ensure the container is properly configured for scrolling
			chatBodyContainer.style.overflowY = 'auto';
			chatBodyContainer.style.height = '100%';

			// Force scroll to bottom
			requestAnimationFrame(() => {
				chatBodyContainer.scrollTo({
					top: chatBodyContainer.scrollHeight,
					behavior: 'smooth',
				});
			});
		} else {
			console.log('🚫 Ask AI scrollToBottom: No chat container found');
		}
	}, []);

	// Auto-scroll when new messages are added (Ask AI specific)
	useEffect(() => {
		if (!info?.sessionId) return;

		const messages = globalChatMessages?.[info.sessionId]?.messages;
		if (!messages || !messages.length) return;

		// Get the last message
		const lastMessage = messages[messages.length - 1];
		if (!lastMessage) return;

		// Auto-scroll for AI responses or when stream ends
		const shouldAutoScroll =
			lastMessage?.type?.toLowerCase() === 'ai' || // AI response
			lastMessage?.stream_end || // Stream finished
			lastMessage?.contentType === 'loading'; // Loading state

		if (shouldAutoScroll) {
			// Use multiple attempts to ensure DOM has updated and scroll works
			const attemptScroll = (attempts = 3) => {
				const chatBodyContainer = document.querySelector(
					'.ask-ai-app .chatBodyParentContainer',
				);
				if (!chatBodyContainer && attempts > 0) {
					setTimeout(() => attemptScroll(attempts - 1), 50);
					return;
				}

				if (!chatBodyContainer) return;

				// Force layout recalculation before checking scroll position
				chatBodyContainer.style.height = 'auto';
				requestAnimationFrame(() => {
					chatBodyContainer.style.height = '';

					const { scrollTop, scrollHeight, clientHeight } = chatBodyContainer;
					const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
					const isNearBottom = distanceFromBottom < 100; // Auto-scroll if within 100px of bottom

					console.log('📊 Auto-scroll check after layout fix:', {
						scrollTop,
						scrollHeight,
						clientHeight,
						distanceFromBottom,
						isNearBottom,
					});

					// Only auto-scroll if user is near the bottom (to not interrupt manual scrolling)
					if (isNearBottom) {
						scrollToBottom();
					}
				});
			};

			setTimeout(() => attemptScroll(), 100);
		}
	}, [globalChatMessages?.[info?.sessionId]?.messages?.length, info?.sessionId, scrollToBottom]);

	// Auto-scroll when user sends a message
	useEffect(() => {
		if (!info?.sessionId) return;

		const messages = globalChatMessages?.[info.sessionId]?.messages;
		if (!messages || !messages.length) return;

		const lastMessage = messages[messages.length - 1];
		if (lastMessage?.type?.toLowerCase() === 'user') {
			// Always scroll to bottom when user sends a message
			setTimeout(() => {
				scrollToBottom();
			}, 100);
		}
	}, [globalChatMessages?.[info?.sessionId]?.messages?.length, info?.sessionId, scrollToBottom]);

	// Disable reacting to window/container resizes; maintain fixed overlay size

	// Initialize scroll container when component mounts
	useEffect(() => {
		const initializeScrollContainer = () => {
			const chatBodyContainer = document.querySelector(
				'.ask-ai-app .chatBodyParentContainer',
			);
			if (chatBodyContainer) {
				console.log('🔧 Initializing scroll container...');

				// Ensure proper scroll configuration
				chatBodyContainer.style.overflowY = 'auto';
				chatBodyContainer.style.overflowX = 'hidden';
				chatBodyContainer.style.height = '100%';
				chatBodyContainer.style.position = 'relative';

				// Force a layout recalculation
				// eslint-disable-next-line no-unused-expressions
				chatBodyContainer.offsetHeight;

				console.log('✅ Scroll container initialized:', {
					scrollHeight: chatBodyContainer.scrollHeight,
					clientHeight: chatBodyContainer.clientHeight,
					canScroll: chatBodyContainer.scrollHeight > chatBodyContainer.clientHeight,
				});
			}
		};

		// Initialize immediately and after a short delay
		initializeScrollContainer();
		setTimeout(initializeScrollContainer, 500);
	}, []);

	// Debug function to test scrolling manually
	useEffect(() => {
		// Add a global function for debugging
		window.testAskAIScroll = () => {
			console.log('🧪 Testing Ask AI scroll manually...');
			scrollToBottom();
		};

		// Add a function to force layout recalculation
		window.forceAskAILayout = () => {
			console.log('🔧 Forcing Ask AI layout recalculation...');
			const chatBodyContainer = document.querySelector(
				'.ask-ai-app .chatBodyParentContainer',
			);
			if (chatBodyContainer) {
				chatBodyContainer.style.height = 'auto';
				requestAnimationFrame(() => {
					chatBodyContainer.style.height = '';
					scrollToBottom();
				});
			}
		};

		// Add a function to check scroll status
		window.checkAskAIScroll = () => {
			const chatBodyContainer = document.querySelector(
				'.ask-ai-app .chatBodyParentContainer',
			);
			if (chatBodyContainer) {
				console.log('📊 Ask AI scroll status:', {
					element: chatBodyContainer,
					scrollHeight: chatBodyContainer.scrollHeight,
					clientHeight: chatBodyContainer.clientHeight,
					scrollTop: chatBodyContainer.scrollTop,
					canScroll: chatBodyContainer.scrollHeight > chatBodyContainer.clientHeight,
					computedStyle: {
						overflow: window.getComputedStyle(chatBodyContainer).overflow,
						height: window.getComputedStyle(chatBodyContainer).height,
						position: window.getComputedStyle(chatBodyContainer).position,
					},
				});
			}
		};

		// Cleanup
		return () => {
			delete window.testAskAIScroll;
			delete window.forceAskAILayout;
			delete window.checkAskAIScroll;
		};
	}, [scrollToBottom]);

	// Note: Resize handling is now done natively by Electron

	return (
		<div
			className={`ask-ai-app`}
			ref={containerRef}
			style={{
				height: info?.expandChat ? '100%' : 'unset',
			}}
		>
			{info?.mode === 'chatbox' ? (
				/* Chatbox Mode - Show only input */
				<div className="ask-ai-chatbox-mode">
			
					<div className="chatbox-input-wrapper">
						<ChatBox
							isPublicChat={false}
							handleSendWebsocketMessage={handleSendWebsocketMessage}
							hideDeepResearch={false}
							autoFocus={true}
							customChatBoxClick={null}
							showScrollButton={false}
							smoothScrollToBottom={scrollToBottom}
							onChatQueryChange={handleChatQueryChange}
							animateChatBox={true}
							sessionId={info?.sessionId}
							handleBrowserButtonClick={null}
							showBrowserButton={false}
							browserImage={null}
							showBottomTools={false}
							showMicBtn={true}
							showRecentFiles={false}
							isDesktopApp={true}
							handleDesktopAppPayload={handleDesktopAppPayload}
							showMoveHandle={true}
							handleChatBoxHeight={null}
							getChatBoxHeight={false}
						/>
					</div>
				</div>
			) : (
				/* Response Mode - Show chat history and input */
				<div className="ask-ai-response-mode">
					{/* Response Window - Top */}
					<div className={`ai-response-window`}>
						<div className={`ai-response-header ${info?.expandChat ? 'chat-expanded' : ''}`}>
							<div className="ai-response-title">
								<span>Chat</span>
							</div>
							<div className="ai-response-controls">
								<button className="chat-btn" onClick={handleChatToggle} title="Close">
									{!info?.expandChat ? <ExpandSvg /> : <MinimizeSvg />}
								</button>

								<button className="close-button" onClick={handleClose} title="Close">
									<X size={16} />
								</button>
							</div>
						</div>

						<div className="divider"></div>

						<div className="chatWrapper">
							<RecentChat
								sId={info?.sessionId}
								showChatHistory={false}
								isPreview={true}
								showHeader={false}
								showBottomTools={false}
								showRecentFiles={false}
								isDesktopApp={true}
								showResponseEditBtn={false}
								fetchRecentChatMessages={false}
								handleDesktopAppPayload={handleDesktopAppPayload}
								showUpgradeSubscriptionBtn={false}
								showChatBox={false} // Disable ChatBox in RecentChat to prevent duplicate messages
							/>
						</div>
					</div>
					{/* Separate chat input outside the scrollable area */}
					<div className="ask-ai-chat-input-wrapper">
						<ChatBox
							isPublicChat={false}
							handleSendWebsocketMessage={handleSendWebsocketMessage}
							hideDeepResearch={false}
							autoFocus={true}
							customChatBoxClick={null}
							showScrollButton={false}
							smoothScrollToBottom={scrollToBottom}
							onChatQueryChange={handleChatQueryChange}
							animateChatBox={true}
							sessionId={info?.sessionId}
							handleBrowserButtonClick={null}
							showBrowserButton={false}
							browserImage={null}
							showBottomTools={false}
							showMicBtn={true}
							showRecentFiles={false}
							isDesktopApp={true}
							handleDesktopAppPayload={handleDesktopAppPayload}
							showMoveHandle={true}
							handleChatBoxHeight={null}
							getChatBoxHeight={false}
						/>
					</div>
				</div>
			)}

			{/* Note: Window resizing is handled natively by Electron since resizable: true is set */}

			<CustomToast />
		</div>
	);
};

export default AskAIApp;
