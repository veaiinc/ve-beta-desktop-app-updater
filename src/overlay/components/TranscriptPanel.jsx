import { useEffect, useRef, memo, useState } from 'react';
import { Clock, Expand, Mic, MicOff, CircleX, AlertCircle } from 'lucide-react';
import './transcript-panel.scss';
import moment from 'moment';

// Memoized TranscriptionItem component
const TranscriptionItem = memo(({ text, timestamp, source }) => {
	return (
		<div
			className="transcript-item"
			style={{
				alignSelf: source === 'mic' ? 'flex-end' : 'flex-start',
				// backgroundColor: source === 'mic' ? '#50c39d2e' : '#64b8e938',
			}}
		>
			{/* <div className="transcript-item-avatar" style={{ backgroundColor: avatarColor }}>
				{speakerInitial}
			</div> */}
			<div
				className="transcript-item-content"
				style={{
					justifyContent: source === 'mic' ? 'flex-end' : 'flex-start',
				}}
			>
				<div
					className="transcript-item-header"
					style={{
						justifyContent: source === 'mic' ? 'flex-end' : 'flex-start',
					}}
				>
					<span className="transcript-item-speaker">
						{source === 'mic' ? 'You' : 'Speaker'}
					</span>
					<span className="transcript-item-time">
						{moment(timestamp).format('HH:mm')}
					</span>
				</div>
				<div
					className="transcript-item-text"
					style={{
						alignSelf: source === 'mic' ? 'flex-end' : 'flex-start',
						color:
							source === 'mic'
								? 'var(--primary-button,#79ECC9)'
								: 'var(--primary-font,#f2f2f3)',
					}}
				>
					{text}
				</div>
			</div>
		</div>
	);
});

TranscriptionItem.displayName = 'TranscriptionItem';

const TranscriptPanel = ({
	onClose,
	onShowLiveIntelligence,
	// Shared state from parent
	transcriptions,
	isRecording,
	isPaused = false,
	timer,
	isMuted = false,
	isConnected,
	// localAudioTrack,
	formatTime,
	// Control functions from parent
	onStartTranscription,
	onStopTranscription,
	onMuteAudio,
	onUnmuteAudio,
	onClearTranscripts,
	// Live intelligence data for badge
	liveIntelligenceData = {},
	// Seen thread count from parent
	lastSeenThreadCount = 0,
}) => {
	const containerRef = useRef(null);

	// Auto-scroll to bottom when new transcriptions are added
	useEffect(() => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [transcriptions]);

	// Debug logging for live intelligence data
	useEffect(() => {
		const currentThreadCount = liveIntelligenceData?.allThreads?.length || 0;
		const newThreadsCount = currentThreadCount - lastSeenThreadCount;

		console.log('📊 TranscriptPanel Badge Logic:', {
			currentThreadCount,
			lastSeenThreadCount,
			newThreadsCount,
			badgeVisible: newThreadsCount > 0,
			badgeNumber: newThreadsCount > 0 ? newThreadsCount : 'none',
		});
	}, [liveIntelligenceData, lastSeenThreadCount]);

	// Function to handle showing live intelligence
	const handleShowLiveIntelligence = () => {
		// console.log('👁️ User clicked Show Live Intelligence');
		onShowLiveIntelligence();
	};

	return (
		<div className="transcript-panel">
			<div className="transcript-panel-header">
				<div className="transcript-panel-header-left">
					<h2 className="transcript-panel-header-left-title">
						Transcript{' '}
						{/* {isRecording && (
							<span className={`recording-timer ${isPaused ? 'paused' : ''}`}>
								{isPaused ? '⏸ ' : ''}
								{formatTime(timer)}
							</span>
						)} */}
					</h2>
				</div>
				<div className="transcript-panel-header-right">
					<button
						className="transcript-panel-header-right-button"
						onClick={handleShowLiveIntelligence}
						title="Show Live Intelligence"
						style={{ position: 'relative' }}
					>
						<Clock size={16} />
						<span>Show Live Intelligence</span>
						{(() => {
							// Show only NEW/unseen threads count
							const currentThreadCount =
								liveIntelligenceData?.allThreads?.length || 0;
							const newThreadsCount = currentThreadCount - lastSeenThreadCount;

							return newThreadsCount > 0 ? (
								<span
									className="transcript-panel__live-intelligence-badge"
									title={`${newThreadsCount} new thread${
										newThreadsCount > 1 ? 's' : ''
									} available`}
								>
									{newThreadsCount}
								</span>
							) : null;
						})()}
					</button>
					{/* <button
						className="transcript-panel-header-action"
						onClick={() => {
							// Toggle debug mode by setting a global flag
							window.echoDebugMode = !window.echoDebugMode;
							console.log('🔧 Echo debug mode:', window.echoDebugMode ? 'ENABLED' : 'DISABLED');
						}}
						title="Toggle Echo Debug Mode"
						style={{ fontSize: '12px' }}
					>
						🔧
					</button> */}
					<button
						className="transcript-panel-header-action"
						onClick={onClose}
						title="Hide Overlay"
					>
						<CircleX size={16} />
					</button>
				</div>
			</div>

			<div className="transcript-content-container">
				<div className="transcript-content" ref={containerRef}>
					{transcriptions.length > 0 ? (
						transcriptions.map((item) => (
							<TranscriptionItem
								key={item.id}
								speaker={item.speaker}
								text={item.text}
								timestamp={item.timestamp}
								source={item.source}
							/>
						))
					) : (
						<div className="transcript-placeholder">
							{isRecording
								? 'Listening...'
								: 'Click Listen to start recording and see transcript'}
						</div>
					)}
				</div>
			</div>
			{/* 
			<div className="transcript-controls">
				<div className="transcript-timer">{formatTime(timer)}</div>

				<div className="transcript-status">
					{isRecording ? (
						isPaused ? (
							<div className="status-paused">Paused</div>
						) : isMuted ? (
							<div className="status-muted">Muted</div>
						) : (
							<div className="status-recording">
								<span>Recording</span>
								<div className="recording-wave-animation">
									<div className="wave-bar"></div>
									<div className="wave-bar"></div>
									<div className="wave-bar"></div>
									<div className="wave-bar"></div>
									<div className="wave-bar"></div>
								</div>
							</div>
						)
					) : (
						<div className="status-inactive">Click Listen to start recording</div>
					)}
				</div>

				<div className="transcript-actions">
					{isRecording && (
						<button
							className={`control-btn mic-btn ${isMuted ? 'muted' : ''}`}
							onClick={isMuted ? onUnmuteAudio : onMuteAudio}
							disabled={!localAudioTrack || !isConnected}
							title={isMuted ? 'Unmute' : 'Mute'}
						>
							{isMuted ? <MicOff size={18} /> : <Mic size={18} />}
						</button>
					)}
				</div>
			</div> */}
		</div>
	);
};

export default TranscriptPanel;
