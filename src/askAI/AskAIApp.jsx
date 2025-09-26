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

const AskAIApp = () => {
	const {
		templates: { updateStateValues, globalChatMessages, handleGlobalChatMessages },
		chatStream: { sendMessage },
	} = useContext(Context);

	const [info, setInfo] = useState({
		sessionId: ObjectID()?.toString(),
		expandChat: false,
		workarea: null,
	});
	const containerRef = useRef(null);
	const expandChatRef = useRef(false);
	const lastWindowHeightRef = useRef(null);
	const userResizingRef = useRef(false);
	const chatContainerRef = useRef(null); // Ref for auto-scrolling

	useEffect(() => {
		if (!containerRef.current) return;

		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				// Skip auto-resize if chat is expanded
				if (expandChatRef.current) return;

				// Skip if user is manually resizing the window
				if (userResizingRef.current) return;

				const { height } = entry.contentRect;

				// Only auto-resize if the content height is significantly different
				// and smaller than current window height (content shrinking)
				if (lastWindowHeightRef.current !== null) {
					const heightDifference = Math.abs(height - lastWindowHeightRef.current);
					// Only auto-resize if content is shrinking or if it's a significant change
					if (height >= lastWindowHeightRef.current && heightDifference < 50) {
						return; // Don't interfere with manual resizing
					}
				}

				const updatedHeight = Math.min(height, 600);

				// Only auto-adjust height for content changes, not user resize
				// This prevents interference with manual window resizing
				window?.electronApi?.askAI?.updateDimensions({
					width: null, // Don't override width - let user control it
					height: updatedHeight,
					position: { isExpanding: false }, // Not an expand operation
				});

				lastWindowHeightRef.current = updatedHeight;
			}
		});

		observer.observe(containerRef.current);

		return () => {
			observer.disconnect();
		};
	}, []);

	useEffect(() => {
		if (info?.expandChat) {
			handleExpandChat();
		}
	}, [info?.expandChat]);

	// Track window resize events to prevent ResizeObserver interference
	useEffect(() => {
		let resizeTimeout;

		const handleWindowResize = () => {
			userResizingRef.current = true;

			// Clear any existing timeout
			if (resizeTimeout) {
				clearTimeout(resizeTimeout);
			}

			// Reset the flag after a delay to allow content-based resizing again
			resizeTimeout = setTimeout(() => {
				userResizingRef.current = false;
			}, 1000); // 1 second delay
		};

		// Listen for window resize events
		window.addEventListener('resize', handleWindowResize);

		return () => {
			window.removeEventListener('resize', handleWindowResize);
			if (resizeTimeout) {
				clearTimeout(resizeTimeout);
			}
		};
	}, []);

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
			handleSubmit(prompt, shouldUseDirectSearch);
		};

		// Listen for chat messages from Dynamic Island or NotchDrop
		const handleChatMessage = (chatMessage) => {
			const isDynamicIsland = chatMessage.type === 'dynamic-island-chat';
			const isNotchDrop = chatMessage.type === 'notchdrop-chat';
			const isOverlayThread = chatMessage.type === 'overlay-thread-question';
			const isNeedHelp = chatMessage?.isNeedHelp;

			if ((isDynamicIsland || isNotchDrop || isOverlayThread) && chatMessage.message) {
				// Process the message directly without showing it in input
				handleSubmit(chatMessage.message, isNeedHelp);
			}
		};

		// Set up listeners
		window?.electronApi.askAI.onReceiveTabContent(handleTabContent);

		window?.electronApi.askAI.onReceiveChatMessage(handleChatMessage);

		// Cleanup
		return () => {
			window?.electronApi.askAI.removeTabContentListener();
			window?.electronApi.askAI.removeChatMessageListener();
		};
	}, []);

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
			} finally {
				return base64Image;
			}
		} else {
			return base64Image;
		}
	};

	const handleSubmit = async (customInput = null, isNeedHelp = null) => {
		const queryValue = customInput;
		if (!queryValue) return;

		// Use the passed isNeedHelp parameter if provided, otherwise use state
		const shouldUseDirectSearch = isNeedHelp;

		try {
			let base64Image = await getCapturedScreenshot();
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
		} finally {
			return payload;
		}
	};

	const handleClose = async () => {
		// Close the window immediately - no delay needed
		window?.electronApi.askAI.toggleWindow();
	};

	const handleChatToggle = useCallback(() => {
		setInfo((prev) => {
			const newExpandState = !prev?.expandChat;
			expandChatRef.current = newExpandState;

			// If collapsing from expanded state, reset to normal size
			if (!newExpandState && prev?.expandChat) {
				window?.electronApi?.askAI?.updateDimensions({
					width: 600,
					height: 600, // Reset to default height
					position: { isExpanding: false }, // Keep current position but set expanding flag
				});

				// Update height reference to prevent ResizeObserver conflicts
				lastWindowHeightRef.current = 600;
			}

			return { ...prev, expandChat: newExpandState };
		});
	}, []);

	const handleExpandChat = useCallback(async () => {
		let workarea = info?.workarea;
		if (!workarea) {
			workarea = await window?.electronApi?.askAI?.getWorkArea();
		}

		window?.electronApi?.askAI?.updateDimensions({
			width: 600,
			height: workarea.height,
			position: { x: (workarea.width || 0) - 600, y: 0, isExpanding: true },
		});

		// Update height reference to match the expanded height
		lastWindowHeightRef.current = workarea.height;

		if (!info?.workarea) {
			setInfo((prev) => ({ ...prev, workarea }));
		}
	}, [info?.workarea]);

	// Handler functions for ChatBox
	const handleChatQueryChange = useCallback((query) => {
		// This function is called when the chat query changes
		// We don't need to store it in state since ChatBox manages its own state
	}, []);

	const handleSendWebsocketMessage = useCallback(
		async (data, lastQuery) => {
			try {
				await sendMessage({
					data,
					sessionId: info?.sessionId,
					onMessageFunc: (event, currentSessionId) => {
						// Handle incoming messages
						let { data: messageData = '' } = event || {};
						messageData = JSON?.parse(messageData);

						if (messageData?.stream_end) {
							handleGlobalChatMessages({
								sessionId: info?.sessionId,
								removeLoadingMessage: true,
								updateExtraInfo: true,
								removeStreaming: true,
								latestStreamMessage: messageData,
							});
						}

						if (messageData?.message_chunk_id) {
							handleGlobalChatMessages({
								payload: messageData,
								chunkId: messageData.message_chunk_id,
								sessionId: info?.sessionId,
								updateExtraInfo: false,
							});
						}
					},
					isPublicChat: false,
					agentType: 'multi_agent',
				});

				handleGlobalChatMessages({
					sessionId: info?.sessionId,
					lastQuery,
					updateExtraInfo: true,
				});

				// Auto-scroll after sending message
				setTimeout(() => {
					scrollToBottom();
				}, 100);
			} catch (error) {
				console.error('Failed to send message:', error);
				handleGlobalChatMessages({
					sessionId: info?.sessionId,
					updateExtraInfo: true,
					removeStreaming: true,
				});
			}
		},
		[sendMessage, info?.sessionId, handleGlobalChatMessages],
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

	// Handle window resize to fix scrolling issues
	useEffect(() => {
		const handleResize = () => {
			console.log('🔄 Ask AI window resized, recalculating layout...');

			// Force layout recalculation by temporarily changing and restoring a style
			const chatBodyContainer = document.querySelector(
				'.ask-ai-app .chatBodyParentContainer',
			);
			if (chatBodyContainer) {
				// Force a reflow to recalculate dimensions
				const originalHeight = chatBodyContainer.style.height;
				chatBodyContainer.style.height = 'auto';

				// Use requestAnimationFrame to ensure the change is applied
				requestAnimationFrame(() => {
					chatBodyContainer.style.height = originalHeight;

					// Trigger a scroll to bottom to ensure everything is working
					setTimeout(() => {
						scrollToBottom();
					}, 100);
				});
			}
		};

		// Listen for window resize events
		window.addEventListener('resize', handleResize);

		// Also listen for Electron window resize events
		if (window.electronApi?.askAI?.onWindowResize) {
			window.electronApi.askAI.onWindowResize(handleResize);
		}

		// Use ResizeObserver to watch for container size changes
		let resizeObserver;
		const chatBodyContainer = document.querySelector('.ask-ai-app .chatBodyParentContainer');
		if (chatBodyContainer && window.ResizeObserver) {
			resizeObserver = new ResizeObserver((entries) => {
				for (let entry of entries) {
					console.log('📏 Chat container resized:', {
						width: entry.contentRect.width,
						height: entry.contentRect.height,
					});

					// Force scroll recalculation when container size changes
					setTimeout(() => {
						scrollToBottom();
					}, 50);
				}
			});

			resizeObserver.observe(chatBodyContainer);
		}

		// Cleanup
		return () => {
			window.removeEventListener('resize', handleResize);
			if (resizeObserver) {
				resizeObserver.disconnect();
			}
		};
	}, [scrollToBottom]);

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
						handleChatBoxHeight={null}
						getChatBoxHeight={false}
					/>
				</div>
			</div>

			{/* Note: Window resizing is handled natively by Electron since resizable: true is set */}

			<CustomToast />
		</div>
	);
};

export default AskAIApp;
