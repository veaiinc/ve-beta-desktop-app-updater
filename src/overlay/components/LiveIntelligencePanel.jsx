import React, { useState } from 'react';
import './live-intelligence-panel.scss';
import { AudioLines, X } from 'lucide-react';

const LiveIntelligencePanel = ({ 
	onClose, 
	onShowTranscript,
	// Shared transcription data from parent (for future socket integration)
	transcriptions = [],
	isRecording = false,
	timer = 0,
	formatTime,
	// Socket data for tabs (will be passed from parent)
	socketData = {
		allThreads: [],
		askUser: [],
		needHelp: [],
		actions: [],
		files: []
	}
}) => {
	const [activeTab, setActiveTab] = useState('all-threads');

	// Get badge counts from socket data
	const getBadgeCount = (tabKey) => {
		switch (tabKey) {
			case 'all-threads': return socketData.allThreads?.length || 0;
			case 'ask-user': return socketData.askUser?.length || 0;
			case 'need-help': return socketData.needHelp?.length || 0;
			case 'actions': return socketData.actions?.length || 0;
			case 'files': return socketData.files?.length || 0;
			default: return 0;
		}
	};

	const tabs = [
		{ key: 'all-threads', label: 'All Threads', count: getBadgeCount('all-threads') },
		{ key: 'ask-user', label: 'Ask user', count: getBadgeCount('ask-user') },
		{ key: 'need-help', label: 'Need help?', count: getBadgeCount('need-help') },
		{ key: 'actions', label: 'Actions', count: getBadgeCount('actions') },
		{ key: 'files', label: 'Files', count: getBadgeCount('files') },
	];

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
							socketData.allThreads.map((thread, index) => (
								<div key={index} className="thread-item">
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
							<div className="empty-content">No threads yet. Start recording to see live intelligence suggestions.</div>
						)}
					</div>
				);
			case 'ask-user':
				return (
					<div className="tab-content">
						{socketData.askUser?.length > 0 ? (
							socketData.askUser.map((item, index) => (
								<div key={index} className="thread-item">
									<div className="thread-category">Ask user</div>
									<div className="thread-question">{item.prompt}</div>
									{item.description && (
										<div className="thread-description">({item.description})</div>
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
							socketData.needHelp.map((item, index) => (
								<div key={index} className="thread-item">
									<div className="thread-category">Need help?</div>
									<div className="thread-question">{item.prompt}</div>
									{item.description && (
										<div className="thread-description">({item.description})</div>
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
							socketData.actions.map((item, index) => (
								<div key={index} className="thread-item">
									<div className="thread-category">Actions</div>
									<div className="thread-question">{item.prompt}</div>
									{item.description && (
										<div className="thread-description">({item.description})</div>
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
							socketData.files.map((item, index) => (
								<div key={index} className="thread-item">
									<div className="thread-category">Files</div>
									<div className="thread-question">{item.name || item.prompt}</div>
									{item.description && (
										<div className="thread-description">({item.description})</div>
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
			<div className="live-intelligence-panel__divider" />

			{/* Header */}
			<div className="live-intelligence-panel__header">
				<div className="live-intelligence-panel__title">
					<span className="live-intelligence-panel__title-text">Live Intelligence</span>
					{isRecording && formatTime && (
						<span className="recording-indicator">
							● {formatTime(timer)}
						</span>
					)}
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
						<AudioLines size={15} />
						<span>Show Transcript</span>
						{transcriptions.length > 0 && (
							<span className="transcript-count">({transcriptions.length})</span>
						)}
					</button>

					<button
						className="live-intelligence-panel__icon-button"
						onClick={onClose}
						title="Close"
					>
						<X size={15} />
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
						onClick={() => setActiveTab(tab.key)}
					>
						<span className="tab-label">{tab.label}</span>
						{tab.count > 0 && (
							<span className="tab-badge">{tab.count}</span>
						)}
					</button>
				))}
			</div>

			{/* Tab Content */}
			<div className="live-intelligence-panel__content">
				{renderTabContent()}
			</div>

		</div>
	);
};

export default LiveIntelligencePanel;
