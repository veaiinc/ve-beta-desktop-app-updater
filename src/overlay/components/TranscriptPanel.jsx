import { useEffect, useRef, memo, useState } from 'react';
import { Clock, Expand, Mic, MicOff, X, ChevronDown, AlertCircle } from 'lucide-react';
import './transcript-panel.scss';

// Memoized TranscriptionItem component
const TranscriptionItem = memo(({ speaker, text, timestamp }) => {
	const avatarColor = '#10b981'; // VE brand green color
	const speakerInitial = 'VE';

	return (
		<div className="transcript-item">
			<div className="transcript-item-avatar" style={{ backgroundColor: avatarColor }}>
				{speakerInitial}
			</div>
			<div className="transcript-item-content">
				<div className="transcript-item-header">
					<span className="transcript-item-speaker">{speaker}</span>
					<span className="transcript-item-time">{timestamp}</span>
				</div>
				<div className="transcript-item-text">{text}</div>
			</div>
		</div>
	);
});

const TranscriptPanel = ({
	onClose,
	onShowLiveIntelligence,
	// Shared state from parent
	transcriptions,
	isRecording,
	isPaused = false,
	timer,
	isMuted,
	isConnected,
	localAudioTrack,
	formatTime,
	// Control functions from parent
	onStartTranscription,
	onStopTranscription,
	onMuteAudio,
	onUnmuteAudio,
	onClearTranscripts,
}) => {
	const containerRef = useRef(null);
	const [showScrollButton, setShowScrollButton] = useState(false);

	// Check if user has scrolled up from bottom
	const handleScroll = () => {
		if (containerRef.current) {
			const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
			const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // 10px threshold
			setShowScrollButton(!isAtBottom && transcriptions.length > 0);
		}
	};

	// Scroll to bottom function
	const scrollToBottom = () => {
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	};

	// No auto-scroll - user controls scrolling manually

	return (
		<div className="transcript-panel">
			<div className="transcript-panel-header">
				<div className="transcript-panel-header-left">
					<h2 className="transcript-panel-header-left-title">
						Transcript{' '}
						{isRecording && (
							<span className={`recording-timer ${isPaused ? 'paused' : ''}`}>
								{isPaused ? '⏸ ' : ''}
								{formatTime(timer)}
							</span>
						)}
					</h2>
				</div>
				<div className="transcript-panel-header-right">
					<button
						className="transcript-panel-header-right-button"
						onClick={onShowLiveIntelligence}
						title="Show Live Intelligence"
					>
						<Clock size={16} />
						<span>Show Live Intelligence</span>
					</button>
					<button className="transcript-panel-header-action" title="Expand">
						<Expand size={16} />
					</button>
					<button
						className="transcript-panel-header-action"
						onClick={onClose}
						title="Close"
					>
						<X size={16} />
					</button>
				</div>
			</div>

			<div className="transcript-content-container">
				<div className="transcript-content" ref={containerRef} onScroll={handleScroll}>
					{transcriptions.length > 0 ? (
						transcriptions.map((item) => (
							<TranscriptionItem
								key={item.id}
								speaker={item.speaker}
								text={item.text}
								timestamp={item.timestamp}
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

				{/* Scroll to bottom button */}
				{showScrollButton && (
					<button
						className="scroll-to-bottom-btn"
						onClick={scrollToBottom}
						title="View Latest"
					>
						<ChevronDown size={16} />
						<span>View Latest</span>
					</button>
				)}
			</div>

			<div className="transcript-controls">
				<div className="transcript-timer">{formatTime(timer)}</div>

				<div className="transcript-status">
					{isRecording ? (
						isPaused ? (
							<div className="status-paused">Paused</div>
						) : isMuted ? (
							<div className="status-muted">Muted</div>
						) : (
							<div className="status-recording">Recording...</div>
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
			</div>
		</div>
	);
};

export default TranscriptPanel;
