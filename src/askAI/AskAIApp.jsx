import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { X } from 'lucide-react';
import './askAI.scss';
import ObjectID from 'bson-objectid';
import { getLocationsDetails } from '../helpers';
import Context from '../context/context';
import RecentChat from '../views/features/chat/RecentChat';
import CustomToast from '../views/components/globalComponents/CustomToast';
import { ReactComponent as ExpandSvg } from './expand.svg';
import { ReactComponent as MinimizeSvg } from './minimize.svg';

const AskAIApp = () => {
	const {
		templates: { updateStateValues },
	} = useContext(Context);

	const [info, setInfo] = useState({
		sessionId: ObjectID()?.toString(),
		expandChat: false,
		workarea: null,
	});
	const containerRef = useRef(null);
	const expandChatRef = useRef(false);

	useEffect(() => {
		if (!containerRef.current) return;

		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				if (expandChatRef.current) return;

				const { height } = entry.contentRect;
				const updatedHeight = Math.min(height, 600);

				// If you want to notify main process (Electron)
				// window.electron?.ipcRenderer?.send('element-height-change', height);

				window?.electronApi?.askAI?.updateDimensions({ width: 600, height: updatedHeight });
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
			expandChatRef.current = !prev?.expandChat;
			return { ...prev, expandChat: !prev?.expandChat };
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
			position: { x: (workarea.width || 0) - 600, y: 0 },
		});

		if (!info?.workarea) {
			setInfo((prev) => ({ ...prev, workarea }));
		}
	}, [info?.workarea]);

	return (
		<div
			className={`ask-ai-app`}
			ref={containerRef}
			style={{
				maxHeight: info?.expandChat ? 'unset' : '600px',
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
					/>
				</div>
			</div>
			<CustomToast />
		</div>
	);
};

export default AskAIApp;
