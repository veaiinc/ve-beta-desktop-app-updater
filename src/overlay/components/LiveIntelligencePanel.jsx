import React, { useState } from 'react';
import './live-intelligence-panel.scss';
import { AudioLines, CircleX } from 'lucide-react';

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
}) => {
	const [activeTab, setActiveTab] = useState('all-threads');

	// Handle tab click - only change active tab, don't send content to Ask AI
	const handleTabClick = (tabKey) => {
		setActiveTab(tabKey);
		// Removed the content sending logic - tabs should only change the view
		// Individual thread items will handle sending content to Ask AI
	};

	// Handle individual thread item click and send specific content to Ask AI
	const handleThreadItemClick = async (item, tabKey) => {
		// Extract the main content text
		const contentText = item.prompt || item.name || item.description || 'No content available';

		// Prepare item content to send to Ask AI
		const itemContent = {
			type: 'individual-item',
			tabKey,
			tabLabel: tabs.find((tab) => tab.key === tabKey)?.label || tabKey,
			itemContent: contentText,
			itemData: item,
			timestamp: new Date().toISOString(),
		};

		console.log('🚀 Sending item content to Ask AI:', itemContent);
		console.log('🎯 Is need-help tab?', tabKey === 'need-help');

		// Check if window is already visible, if not, show it
		try {
			if (window.electronApi?.askAI?.isWindowVisible) {
				const result = await window.electronApi.askAI.isWindowVisible();
				if (!result.success || !result.isVisible) {
					// Window is not visible, show it
					if (window.electronApi?.askAI?.showWindow) {
						await window.electronApi.askAI.showWindow();
					}
					// Wait for window to be ready after opening
					setTimeout(() => {
						if (window.electronApi?.overlay?.sendTabContentToAskAI) {
							window.electronApi.overlay.sendTabContentToAskAI(itemContent);
						}
					}, 300);
				} else {
					// Window is already visible, send content immediately
					if (window.electronApi?.overlay?.sendTabContentToAskAI) {
						window.electronApi.overlay.sendTabContentToAskAI(itemContent);
					}
				}
			} else {
				// Fallback to toggle if new API not available
				if (window.electronApi?.askAI?.toggleWindow) {
					window.electronApi.askAI.toggleWindow();
				}
				setTimeout(() => {
					if (window.electronApi?.overlay?.sendTabContentToAskAI) {
						window.electronApi.overlay.sendTabContentToAskAI(itemContent);
					}
				}, 300);
			}
		} catch (error) {
			console.error('Error checking/showing Ask AI window:', error);
			// Fallback to toggle if there's an error
			if (window.electronApi?.askAI?.toggleWindow) {
				window.electronApi.askAI.toggleWindow();
			}
			setTimeout(() => {
				if (window.electronApi?.overlay?.sendTabContentToAskAI) {
					window.electronApi.overlay.sendTabContentToAskAI(itemContent);
				}
			}, 300);
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
		{ key: 'all-threads', label: 'All Threads', count: getBadgeCount('all-threads') },
		...(getBadgeCount('ask-user') > 0
			? [{ key: 'ask-user', label: 'Ask user', count: getBadgeCount('ask-user') }]
			: []),
		...(getBadgeCount('need-help') > 0
			? [{ key: 'need-help', label: 'Need help?', count: getBadgeCount('need-help') }]
			: []),
		...(getBadgeCount('actions') > 0
			? [{ key: 'actions', label: 'Actions', count: getBadgeCount('actions') }]
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
			if (entity === 'user' || entity === 'other_user') return 'Ask user';
			if (entity === 'agent' && type === 'search') return 'Need help?';
			if (entity === 'agent' && type === 'action') return 'Actions';
			if (entity === 'file') return 'Files';
			return 'Unknown';
		};

		switch (activeTab) {
			case 'all-threads':
				return (
					<div className="tab-content">
						{socketData.allThreads?.length > 0 ? (
							[...socketData.allThreads].reverse().map((thread, index) => (
								<div
									key={index}
									className="thread-item clickable"
									onClick={() => handleThreadItemClick(thread, 'all-threads')}
									title="Click to ask AI about this thread"
								>
									<div className="thread-category">
										{getCategoryLabel(thread.entity, thread.type)}
									</div>
									<div className="thread-question">
										{thread.prompt || thread.name || 'No content available'}
									</div>
									{thread.description && (
										<div className="thread-description">
											({thread.description})
										</div>
									)}
									<div className="thread-time">
										{formatTime(thread.timestamp || thread.created_at)}
									</div>
								</div>
							))
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
							[...socketData.askUser].reverse().map((item, index) => (
								<div
									key={index}
									className="thread-item clickable"
									//onClick={() => handleThreadItemClick(item, 'ask-user')}
									title="Click to ask AI about this question"
								>
									<div className="thread-category">Ask user</div>
									<div className="thread-question">{item.prompt}</div>
									{item.description && (
										<div className="thread-description">
											({item.description})
										</div>
									)}
									<div className="thread-time">
										{formatTime(item.timestamp || item.created_at)}
									</div>
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
							socketData.needHelp?.reverse().map((item, index) => (
								<div
									key={index}
									className="thread-item clickable"
									onClick={() => handleThreadItemClick(item, 'need-help')}
									title="Click to ask AI about this help suggestion"
								>
									<div className="thread-category">Need help?</div>
									<div className="thread-question">{item.prompt}</div>
									{item.description && (
										<div className="thread-description">
											({item.description})
										</div>
									)}
									<div className="thread-time">
										{formatTime(item.timestamp || item.created_at)}
									</div>
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
							[...socketData.actions].reverse().map((item, index) => (
								<div
									key={index}
									className="thread-item clickable"
									onClick={() => handleThreadItemClick(item, 'actions')}
									title="Click to ask AI about this action item"
								>
									<div className="thread-category">Actions</div>
									<div className="thread-question">{item.prompt}</div>
									{item.description && (
										<div className="thread-description">
											({item.description})
										</div>
									)}
									<div className="thread-time">
										{formatTime(item.timestamp || item.created_at)}
									</div>
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
							[...socketData.files].reverse().map((item, index) => (
								<div
									key={index}
									className="thread-item clickable"
									onClick={() => handleThreadItemClick(item, 'files')}
									title="Click to ask AI about this file"
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
									<div className="thread-time">
										{formatTime(item.timestamp || item.created_at)}
									</div>
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
					<span className="live-intelligence-panel__title-text">Live Intelligence</span>
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
						<span>View Transcription</span>
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
			<div className="live-intelligence-panel__tabs">
				{tabs.map((tab) => (
					<button
						key={tab.key}
						className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
						onClick={() => handleTabClick(tab.key)}
					>
						<span className="tab-label">{tab.label}</span>
						{tab.count > 0 && <span className="tab-badge">{tab.count}</span>}
					</button>
				))}
			</div>

			{/* Tab Content */}
			<div className="live-intelligence-panel__content">{renderTabContent()}</div>
		</div>
	);
};

export default LiveIntelligencePanel;
