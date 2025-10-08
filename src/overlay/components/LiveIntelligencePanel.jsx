import React, { useState, useRef, useEffect } from 'react';
import './live-intelligence-panel.scss';
import { AudioLines, CircleX } from 'lucide-react';
import ObjectID from 'bson-objectid';
import userIcon from '../../assets/svg/transcription/user.svg';
import needHelpIcon from '../../assets/svg/transcription/question.svg';
import actionsIcon from '../../assets/svg/transcription/thunder.svg';
import filesIcon from '../../assets/svg/files/file.svg';
import VELogo from '../../assets/svg/transcription/velogo.svg';

const LiveIntelligencePanel = ({
	onClose,
	onShowTranscript,
	// Shared transcription data from parent (for future socket integration)
	transcriptions = [],
	isRecording = false,
	isPaused = false,
	timer = 0,
	formatTime,
	// Socket data for tabs (will be passed from parent)
	socketData = {
		allThreads: [],
		askUser: [],
		needHelp: [],
		actions: [],
		files: [],
	},
	sessionId,
}) => {
	const [activeTab, setActiveTab] = useState('all-threads');
	const contentRef = useRef(null);

	// Auto-scroll to bottom when new responses are added
	useEffect(() => {
		if (contentRef.current) {
			contentRef.current.scrollTop = contentRef.current.scrollHeight;
		}
	}, [socketData]);

	// Send live intelligence items to Notch whenever they change
	useEffect(() => {
		try {
			if (!window?.electronApi?.overlay?.sendLiveIntelligenceData) return;

			// Flatten the "threads" style data into individual messages
			const threads = socketData?.allThreads || [];
			threads.forEach((thread) => {
				const message = {
					source: 'ai-agent',
					text: thread.prompt || thread.name || thread.description || '',
					timestamp: thread.timestamp || thread.created_at || new Date().toISOString(),
					type: 'live-intelligence',
					confidence: thread.confidence,
					metadata: thread,
				};
				window.electronApi.overlay.sendLiveIntelligenceData(message);
			});
		} catch (e) {
			console.error('Failed to send live intelligence data to Notch:', e);
		}
	}, [socketData?.allThreads]);

	// Auto-scroll to latest item when new content is added
	useEffect(() => {
		// Use setTimeout to ensure DOM has updated after tab switch
		setTimeout(() => {
			const scrollContainer = document.querySelector('.live-intelligence-panel__content');
			if (scrollContainer) {
				const scrollHeight = scrollContainer.scrollHeight;
				const clientHeight = scrollContainer.clientHeight;

				// console.log('🔄 Auto-scrolling to latest item:', {
				// 	activeTab,
				// 	scrollHeight,
				// 	clientHeight,
				// 	canScroll: scrollHeight > clientHeight,
				// });

				// Only scroll if content is actually scrollable
				if (scrollHeight > clientHeight) {
					// Smooth scroll to bottom to show the latest item
					scrollContainer.scrollTo({
						top: scrollHeight,
						behavior: 'smooth',
					});
				}
			} else {
				console.log('❌ Scroll container not found');
			}
		}, 150);
	}, [socketData, activeTab]);

	// Handle tab click - only change active tab, don't send content to Ask AI
	const handleTabClick = (tabKey) => {
		// setActiveTab(tabKey);
		// Removed the content sending logic - tabs should only change the view
		// Individual thread items will handle sending content to Ask AI
	};

	// Handle individual thread item click and navigate to main window chat
	const handleThreadItemClick = async (item, tabKey, isNeedHelp = false) => {
		// Extract the main content text (the thread question)
		const questionText = item.prompt || item.name || item.description || 'No content available';

		// Build navigation payload to open main window chat
		const navData = {
			type: 'chat',
			message: questionText,
			timestamp: new Date().toISOString(),
			source: 'overlay-live-intelligence',
			path: `/chat/${ObjectID().toString()}`,
			updateObject: {
				type: 'chat',
				payload: {
					query: questionText,
				},
			},
			metadata: {
				tabKey,
				tabLabel: tabs.find((tab) => tab.key === tabKey)?.label || tabKey,
				itemData: item,
				isNeedHelp,
				sessionId: sessionId,
			},
		};

		// Navigate to main window chat
		try {
			await window?.electronApi?.navigateMainWindow(navData);
		} catch (error) {
			console.error('Failed to navigate main window for chat:', error);
		}
	};

	// Get badge counts from socket data
	const getBadgeCount = (tabKey) => {
		switch (tabKey) {
			case 'all-threads':
				return socketData.allThreads?.length || 0;
			case 'ask-user':
				return socketData.askUser?.length || 0;
			case 'need-help':
				return socketData.needHelp?.length || 0;
			case 'actions':
				return socketData.actions?.length || 0;
			case 'files':
				return socketData.files?.length || 0;
			default:
				return 0;
		}
	};

	const tabs = [
		{ key: 'all-threads', label: 'All threads', count: getBadgeCount('all-threads') },
		...(getBadgeCount('ask-user') > 0
			? [
					{
						key: 'ask-user',
						label: 'Ask Speaker',
						icon: userIcon,
						count: getBadgeCount('ask-user'),
					},
			  ]
			: []),
		...(getBadgeCount('need-help') > 0
			? [
					{
						key: 'need-help',
						label: 'Ask AI',
						icon: needHelpIcon,
						count: getBadgeCount('need-help'),
					},
			  ]
			: []),
		...(getBadgeCount('actions') > 0
			? [
					{
						key: 'actions',
						label: 'Actions',
						icon: actionsIcon,
						count: getBadgeCount('actions'),
					},
			  ]
			: []),
		...(getBadgeCount('files') > 0
			? [{ key: 'files', label: 'Files', count: getBadgeCount('files') }]
			: []),
	];

	// const tabs = [
	// 	{ key: 'all-threads', label: 'All Threads', count: 0 },
	// 	...(true ? [{ key: 'ask-user', label: 'Ask user', count: 8 }] : []),
	// 	...(true ? [{ key: 'need-help', label: 'Need help?', count: 8 }] : []),
	// 	...(true ? [{ key: 'actions', label: 'Actions', count: 8 }] : []),
	// 	...(true ? [{ key: 'files', label: 'Files', count: 8 }] : []),
	// ];

	const renderTabContent = () => {
		const formatTime = (timestamp) => {
			if (!timestamp) return '';
			const date = new Date(timestamp);
			return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
		};

		const getCategoryLabel = (entity, type) => {
			if (entity === 'user' || entity === 'other_user') return 'Ask Speaker';
			if (entity === 'agent' && type === 'search') return 'Ask AI';
			if (entity === 'agent' && type === 'action') return 'Actions';
			if (entity === 'file') return 'Files';
			return 'Unknown';
		};

		const getCategoryIcon = (entity, type) => {
			if (entity === 'user' || entity === 'other_user') return userIcon;
			if (entity === 'agent' && type === 'search') return needHelpIcon;
			if (entity === 'agent' && type === 'action') return actionsIcon;
			if (entity === 'file') return filesIcon;
			return null; // No icon for unknown categories
		};

		switch (activeTab) {
			case 'all-threads':
				return (
					<div className="tab-content">
						{socketData.allThreads?.length > 0 ? (
							socketData.allThreads.map((thread, index) => {
								const categoryIcon = getCategoryIcon(thread.entity, thread.type);
								return (
									<div
										key={thread.reference_id || thread.id || index}
										className={`thread-item clickable ${
											''
											// thread.entity === 'user' ? 'ask-user-item' : 'clickable'
										}`}
										onClick={() =>
											handleThreadItemClick(
												thread,
												'all-threads',
												thread?.type === 'search',
											)
										}
										title="Click to chat about this thread in main window"
									>
										{/* <div className="thread-category">
										{getCategoryLabel(thread.type,thread.entity)}
										</div> */}
										<div className="thread-question">
											{categoryIcon && (
												<img
													src={categoryIcon}
													alt={getCategoryLabel(
														thread.entity,
														thread.type,
													)}
												/>
											)}
											{thread.prompt || thread.name || 'No content available'}
										</div>
										{thread.description && (
											<div className="thread-description">
												({thread.description})
											</div>
										)}
										{/* <div className="thread-time">
											{formatTime(thread.timestamp || thread.created_at)}
										</div> */}
									</div>
								);
							})
						) : (
							<div className="empty-content">
								Start speaking to see live intelligence suggestions.
							</div>
						)}
					</div>
				);
			case 'ask-user':
				return (
					<div className="tab-content">
						{socketData.askUser?.length > 0 ? (
							socketData.askUser.map((item, index) => (
								<div
									key={item.reference_id || item.id || index}
									className="thread-item ask-user-item"
									onClick={() => handleThreadItemClick(item, 'ask-user')}
									title="Click to chat about this question in main window"
								>
									{/* <div className="thread-category">Ask user</div> */}
									<div className="thread-question">
										<img src={userIcon} alt="user" /> {item.prompt}
									</div>
									{item.description && (
										<div className="thread-description">
											({item.description})
										</div>
									)}
									{/* <div className="thread-time">
										{formatTime(item.timestamp || item.created_at)}
									</div> */}
								</div>
							))
						) : (
							<div className="empty-content">No user questions yet.</div>
						)}
					</div>
				);
			case 'need-help':
				return (
					<div className="tab-content">
						{socketData.needHelp?.length > 0 ? (
							socketData.needHelp.map((item, index) => (
								<div
									key={item.reference_id || item.id || index}
									className="thread-item clickable"
									onClick={() => handleThreadItemClick(item, 'need-help', true)}
									title="Click to chat about this help suggestion in main window"
								>
									{/* <div className="thread-category">Need help?</div> */}
									<div className="thread-question">
										<img src={needHelpIcon} alt="need help" /> {item.prompt}
									</div>
									{item.description && (
										<div className="thread-description">
											({item.description})
										</div>
									)}
									{/* <div className="thread-time">
										{formatTime(item.timestamp || item.created_at)}
									</div> */}
								</div>
							))
						) : (
							<div className="empty-content">No help suggestions yet.</div>
						)}
					</div>
				);
			case 'actions':
				return (
					<div className="tab-content">
						{socketData.actions?.length > 0 ? (
							socketData.actions.map((item, index) => (
								<div
									key={item.reference_id || item.id || index}
									className="thread-item clickable"
									onClick={() => handleThreadItemClick(item, 'actions')}
									title="Click to chat about this action item in main window"
								>
									{/* <div className="thread-category">Actions</div> */}
									<div className="thread-question">
										<img src={actionsIcon} alt="actions" /> {item.prompt}
									</div>
									{item.description && (
										<div className="thread-description">
											({item.description})
										</div>
									)}
									{/* <div className="thread-time">
										{formatTime(item.timestamp || item.created_at)}
									</div> */}
								</div>
							))
						) : (
							<div className="empty-content">No action suggestions yet.</div>
						)}
					</div>
				);
			case 'files':
				return (
					<div className="tab-content">
						{socketData.files?.length > 0 ? (
							socketData.files.map((item, index) => (
								<div
									key={item.reference_id || item.id || index}
									className="thread-item clickable"
									onClick={() => handleThreadItemClick(item, 'files')}
									title="Click to chat about this file in main window"
								>
									<div className="thread-category">Files</div>
									<div className="thread-question">
										{item.name || item.prompt}
									</div>
									{item.description && (
										<div className="thread-description">
											({item.description})
										</div>
									)}
									{/* <div className="thread-time">
										{formatTime(item.timestamp || item.created_at)}
									</div> */}
								</div>
							))
						) : (
							<div className="empty-content">No file suggestions yet.</div>
						)}
					</div>
				);
			default:
				return null;
		}
	};

	return (
		<div className="live-intelligence-panel">
			{/* <div className="live-intelligence-panel__divider" /> */}

			{/* Header */}
			<div className="live-intelligence-panel__header">
				<div className="live-intelligence-panel__title">
					<span className="live-intelligence-panel__title-text">
						<img src={VELogo} alt="VE Logo" />
					</span>
					{/* {isRecording && formatTime && (
						<span className={`recording-indicator ${isPaused ? 'paused' : ''}`}>
							{isPaused ? '⏸' : '●'} {formatTime(timer)}
						</span>
					)} */}
				</div>

				<div className="live-intelligence-panel__controls">
					<button
						className="live-intelligence-panel__control-button"
						onClick={() => {
							if (onShowTranscript) {
								onShowTranscript();
							}
						}}
						style={{ pointerEvents: 'auto' }}
					>
						<span>View Transcriptions</span>
					</button>

					<div className="live-intelligence-panel__control-divider" />

					<button
						className="live-intelligence-panel__icon-button"
						onClick={onClose}
						title="Close"
					>
						{/* <X size={15} /> */}
						<CircleX size={15} />
					</button>
				</div>
			</div>

			{/* Divider */}
			<div className="live-intelligence-panel__divider-line" />

			{/* Tabs */}
			{/* <div className="live-intelligence-panel__tabs">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
						onClick={() => handleTabClick(tab.key)}
					>
						<span className="tab-label">
							{tab.icon && <img src={tab.icon} />} {tab.label}
						</span>
						{tab.count > 0 && <span className="tab-badge">{tab.count}</span>}
					</button>
				))}
			</div> */}

			{/* Tab Content */}
			<div className="live-intelligence-panel__content" ref={contentRef}>
				{renderTabContent()}
			</div>
		</div>
	);
};

export default LiveIntelligencePanel;
