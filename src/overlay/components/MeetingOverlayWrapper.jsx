import React from 'react';
import ShortcutBar from './ShortcutBar';
import OverlayCommands from '../OverlayCommands';
import LiveIntelligencePanel from './LiveIntelligencePanel';
import TranscriptPanel from './TranscriptPanel';
import useAssemblyTranscription from '../hooks/useAssemblyTranscription';

const MeetingOverlayWrapper = ({
	showShortcutBar,
	handleListenClick,
	handleAskAIClick,
	handleStopTranscription,
	handlePauseTranscription,
	handleResumeTranscription,
	activePanel,
	transcriptions,
	isRecording,
	isPaused,
	timer,
	formatTime,
	liveIntelligenceData,
	isConnected,
	localAudioTrack,
	muteAudio,
	unmuteAudio,
	handleClosePanel,
	handleShowTranscript,
	handleShowLiveIntelligence,
	handleStartTranscription,
	handleClearTranscripts,
	isAskAIInputFocused,
	notification,
	isMuted,
	meetingId,
	jwtToken,
	isAiIntelligenceEnabled,
	tenantId,
	sessionId,
	onTranscriptionUpdate,
	onLiveIntelligenceResponse,
}) => {
	const {
		// isConnected,
		// isRecording,
		// isMuted,
		// timer,
		connectionStatus,
		startAudioCapture,
		stopRecording,
		toggleMute,
		// formatTime,
		startRecording,
	} = useAssemblyTranscription({
		onTranscriptionUpdate,
		onLiveIntelligenceResponse,
		tenantId,
		sessionId,
		meetingId,
		jwtToken,
		isAiIntelligenceEnabled,
	});
	return (
		<>
			<div className="overlay-container overlay-content" data-overlay-content="true">
				{/* Shortcut bar - only show when not controlled by Dynamic Island */}
				{showShortcutBar && (
					<ShortcutBar
						onListenClick={handleListenClick}
						isLiveIntelligenceOpen={activePanel === 'live-intelligence'}
						onAskAIClick={handleAskAIClick}
						isRecording={isRecording}
						onStopRecording={handleStopTranscription}
						onPauseRecording={handlePauseTranscription}
						onResumeRecording={handleResumeTranscription}
						isPaused={isPaused}
						isAskAIInputFocused={isAskAIInputFocused}
					/>
				)}

				{/* Commands section - only show when not controlled by Dynamic Island */}
				{showShortcutBar && <OverlayCommands />}
			</div>

			{/* Live Intelligence panel */}
			{activePanel === 'live-intelligence' && (
				<div className="live-intelligence-container">
					<LiveIntelligencePanel
						onClose={handleClosePanel}
						onShowTranscript={handleShowTranscript}
						transcriptions={transcriptions}
						isRecording={isRecording}
						isPaused={isPaused}
						timer={timer}
						formatTime={formatTime}
						socketData={liveIntelligenceData}
					/>
				</div>
			)}

			{/* Transcript panel */}
			{activePanel === 'transcript' && (
				<div className="transcript-container">
					<TranscriptPanel
						onClose={handleClosePanel}
						onShowLiveIntelligence={handleShowLiveIntelligence}
						transcriptions={transcriptions}
						isRecording={isRecording}
						isPaused={isPaused}
						timer={timer}
						isMuted={isMuted}
						isConnected={isConnected}
						localAudioTrack={localAudioTrack}
						formatTime={formatTime}
						onStartTranscription={handleStartTranscription}
						onStopTranscription={handleStopTranscription}
						onMuteAudio={muteAudio}
						onUnmuteAudio={unmuteAudio}
						onClearTranscripts={handleClearTranscripts}
					/>
				</div>
			)}
		</>
	);
};

export default MeetingOverlayWrapper;
