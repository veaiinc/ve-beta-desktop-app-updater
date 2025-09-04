import '../../../assets/scss/noteTranscription/note-transcription.scss';
import Waveform from '../../../assets/svg/note-transcription.gif';
import { ReactComponent as Mic } from '../../../assets/svg/microphone.svg';
import { ReactComponent as MuteMic } from '../../../assets/svg/ai_agents/mutemic.svg';
import { ReactComponent as Close } from '../../../assets/svg/ai_agents/close.svg';
import useAssemblyTranscription from '../../../hooks/useAssemblyTranscription';
import { useEffect } from 'react';

const AssemblyTranscription = (props) => {
	const {
		isConnected,
		isRecording,
		isMuted,
		timer,
		connectionStatus,
		startRecording,
		stopRecording,
		toggleMute,
		formatTime,
	} = useAssemblyTranscription(props);

	const isElectron = !!window.electronApi;

	if (isElectron) return null;

	// Helper function to determine if start button should be disabled
	const isStartDisabled = () => {
		return connectionStatus === 'error' || connectionStatus === 'connecting';
	};

	// Helper function to get appropriate button title/tooltip
	const getStartButtonTitle = () => {
		if (connectionStatus === 'error') {
			return 'Connection error - please try again';
		}
		if (connectionStatus === 'connecting') {
			return 'Connecting...';
		}
		if (!isConnected) {
			return 'Click to connect and start recording';
		}
		return 'Start recording';
	};

	return (
		<div className="note-transcription">
			<div className="transcription-bar">
				<span className="transcription-timer">
					{isRecording ? formatTime(timer) : '0:00'}
				</span>
				<span className="transcription-waveform">
					{isRecording ? (
						isMuted ? (
							<div className="straight-line"></div>
						) : (
							<img src={Waveform} alt="Audio waveform animation" />
						)
					) : (
						<div className="transcription-waveform-placeholder">
							<span className="transcription-waveform-placeholder-text">
								{connectionStatus === 'connecting'
									? 'Connecting...'
									: 'Start recording'}
							</span>
						</div>
					)}
				</span>
				{isRecording ? (
					<>
						<button
							className="transcription-btn stop"
							onClick={stopRecording}
							title="Stop recording"
							aria-label="Stop recording"
						>
							<Close />
						</button>
						<button
							className={`transcription-btn mic ${isMuted ? 'muted' : ''}`}
							onClick={toggleMute}
							title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
							aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
						>
							{isMuted ? <MuteMic /> : <Mic />}
						</button>
					</>
				) : (
					<button
						className={`transcription-btn mic ${isStartDisabled() ? 'disabled' : ''}`}
						onClick={startRecording}
						disabled={isStartDisabled()}
						title={getStartButtonTitle()}
						aria-label="Start recording"
					>
						<Mic />
					</button>
				)}
			</div>
		</div>
	);
};

export default AssemblyTranscription;
