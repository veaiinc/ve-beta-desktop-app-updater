import { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { X, Send, Copy, ChevronDown, ChevronUp, GripHorizontal, Square } from 'lucide-react';
import './askAI.scss';
import ObjectID from 'bson-objectid';
import { getLocationsDetails } from '../helpers';
import { copyToClipboard } from '../helpers/clipboardHelper';
import Context from '../context/context';
import RecentChat from '../views/features/chat/RecentChat';
import CustomToast from '../views/components/globalComponents/CustomToast';

const sessionId = ObjectID().toString();

const AskAIApp = () => {
	const {
		templates: { updateStateValues },
	} = useContext(Context);

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
			setTimeout(() => {
				handleSubmit(prompt, shouldUseDirectSearch);
			}, 100); // Small delay to ensure everything is ready
		};

		// Listen for chat messages from Dynamic Island or NotchDrop
		const handleChatMessage = (chatMessage) => {
			console.log('💬 Received chat message:', chatMessage);

			const isDynamicIsland = chatMessage.type === 'dynamic-island-chat';
			const isNotchDrop = chatMessage.type === 'notchdrop-chat';
			const isOverlayThread = chatMessage.type === 'overlay-thread-question';
			const isNeedHelp = chatMessage.tabKey === 'need-help';

			if ((isDynamicIsland || isNotchDrop || isOverlayThread) && chatMessage.message) {
				// Process the message directly without showing it in input
				setTimeout(() => {
					handleSubmit(chatMessage.message, isNeedHelp);
				}, 100); // Small delay to ensure everything is ready
			}
		};

		// Set up listeners
		if (window.electronApi?.askAI?.onReceiveTabContent) {
			window.electronApi.askAI.onReceiveTabContent(handleTabContent);
		}

		if (window.electronApi?.askAI?.onReceiveChatMessage) {
			window.electronApi.askAI.onReceiveChatMessage(handleChatMessage);
		}

		// Cleanup
		return () => {
			if (window.electronApi?.askAI?.removeTabContentListener) {
				window.electronApi.askAI.removeTabContentListener();
			}
			if (window.electronApi?.askAI?.removeChatMessageListener) {
				window.electronApi.askAI.removeChatMessageListener();
			}
		};
	}, []);

	// Generate prompt based on tab content
	const generatePromptFromTabContent = (tabContent) => {
		const { tabKey, tabLabel, content, type, itemContent, itemData } = tabContent;

		// Handle individual item clicks
		if (type === 'individual-item' && itemContent) {
			return `Please help me with this: "${itemContent}". Provide insights, suggestions, or guidance on how to approach this.`;
		}

		// Handle empty content
		if (!content || content.length === 0) {
			return `I'm looking at the "${tabLabel}" tab but there's no content yet. Can you help me understand what this tab is for and how I might use it?`;
		}

		const itemCount = content.length;
		const firstItem = content[0];

		switch (tabKey) {
			case 'all-threads':
				return `I have ${itemCount} threads in my conversation history. The latest one is: "${
					firstItem.prompt || firstItem.name || 'No prompt available'
				}". Please analyze these threads and provide insights or suggestions.`;

			case 'ask-user':
				return `I have ${itemCount} questions that need user input. The latest one is: "${firstItem.prompt}". Please help me formulate better questions or suggest how to approach these user interactions.`;

			case 'need-help':
				return `I have ${itemCount} help suggestions. The latest one is: "${firstItem.prompt}". Please help me understand these suggestions better or provide additional guidance.`;

			case 'actions':
				return `I have ${itemCount} action items. The latest one is: "${firstItem.prompt}". Please help me prioritize these actions or suggest the best approach to handle them.`;

			case 'files':
				return `I have ${itemCount} files to work with. The latest one is: "${
					firstItem.prompt || firstItem.name
				}". Please help me understand how to work with these files or suggest next steps.`;

			default:
				return `I'm looking at the "${tabLabel}" tab with ${itemCount} items. Please help me understand and work with this content.`;
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
				messageData.direct_search_agent = true;
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
		if (window.electronApi?.askAI?.toggleWindow) {
			window.electronApi.askAI.toggleWindow();
		}
	};

	return (
		<div className="ask-ai-app">
			{/* Response Window - Top */}
			<div className={`ai-response-window`}>
				<div className="ai-response-header">
					<div className="ai-response-drag-handle">
						<GripHorizontal size={16} color="rgba(255, 255, 255, 0.7)" />
					</div>
					<div className="ai-response-title">
						<span>Chat</span>
					</div>
					<div className="ai-response-controls">
						<button className="close-button" onClick={handleClose} title="Close">
							<X size={16} />
						</button>
					</div>
				</div>

				<div className="chatWrapper">
					<RecentChat
						sId={sessionId}
						showChatHistory={false}
						isPreview={true}
						showHeader={false}
						showBottomTools={false}
						showMicBtn={false}
						showRecentFiles={false}
						isDesktopApp={true}
						showResponseEditBtn={false}
						fetchRecentChatMessages={false}
						handleDesktopAppPayload={handleDesktopAppPayload}
					/>
				</div>
			</div>
			<CustomToast />
		</div>
	);
};

export default AskAIApp;
