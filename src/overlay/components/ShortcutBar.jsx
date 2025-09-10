import React from 'react';
import { Mic, Square, Pause, Play } from 'lucide-react';
import './shortcut-bar.scss';

const ShortcutBar = ({
	onListenClick,
	isLiveIntelligenceOpen,
	onAskAIClick,
	isRecording,
	onStopRecording,
	onPauseRecording,
	onResumeRecording,
	isPaused,
	isAskAIInputFocused = false,
}) => {
	return (
		<div className="shortcut-bar">
			<div className="shortcut-bar__divider" />

			{!isRecording ? (
				<div
					className={`shortcut-bar__item shortcut-bar__item--clickable ${
						isLiveIntelligenceOpen ? 'shortcut-bar__item--active' : ''
					}`}
					onClick={onListenClick}
				>
					<span className="shortcut-bar__label">Listen</span>
					<div className="shortcut-bar__icon">
						<Mic size={14} />
					</div>
				</div>
			) : (
				<>
					{/* Pause/Resume Button */}
					<div
						className={`shortcut-bar__item shortcut-bar__item--clickable ${
							isPaused ? 'shortcut-bar__item--paused' : ''
						}`}
						onClick={isPaused ? onResumeRecording : onPauseRecording}
						title={isPaused ? 'Resume Recording' : 'Pause Recording'}
					>
						<span className="shortcut-bar__label">{isPaused ? 'Resume' : 'Pause'}</span>
						<div className="shortcut-bar__icon">
							{isPaused ? <Play size={14} /> : <Pause size={14} />}
						</div>
					</div>

					{/* Stop Button */}
					<div
						className="shortcut-bar__item shortcut-bar__item--clickable shortcut-bar__item--stop"
						onClick={onStopRecording}
						title="Stop Recording"
					>
						<span className="shortcut-bar__label">Stop</span>
						<div className="shortcut-bar__icon">
							<Square size={14} />
						</div>
					</div>
				</>
			)}

			<div className="shortcut-bar__separator" />

			<div
				className={`shortcut-bar__item shortcut-bar__item--clickable ${
					isAskAIInputFocused ? 'shortcut-bar__item--active' : ''
				}`}
				onClick={onAskAIClick}
				title={isAskAIInputFocused ? 'Ask AI (Input Active)' : 'Ask AI'}
			>
				<span className="shortcut-bar__label">Ask AI</span>
			</div>

			<div className="shortcut-bar__separator" />

			<div
				className="shortcut-bar__item shortcut-bar__item--clickable"
				onClick={() => {
					if (window.electronApi?.overlay?.hideAllWindows) {
						window.electronApi.overlay.hideAllWindows();
					}
				}}
			>
				<span className="shortcut-bar__label">Hide</span>
				<div className="shortcut-bar__keys">
					<kbd className="shortcut-bar__key">⌘</kbd>
					<kbd className="shortcut-bar__key">\</kbd>
				</div>
			</div>

			{/* Help tooltip */}
			{/* <div 
				className="shortcut-bar__help"
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			>
				<div className="shortcut-bar__help-button">?</div>
				
				{isTooltipVisible && (
					<div className="shortcut-bar__tooltip">
						<div className="shortcut-bar__tooltip-content">
							<h3>Keyboard Shortcuts</h3>
							<div className="shortcut-bar__shortcut-list">
								<div className="shortcut-bar__shortcut-item">
									<span className="shortcut-bar__shortcut-desc">Ask AI</span>
									<div className="shortcut-bar__shortcut-keys">
										<kbd>⌘</kbd><kbd>⏎</kbd>
									</div>
								</div>
								<div className="shortcut-bar__shortcut-item">
									<span className="shortcut-bar__shortcut-desc">Hide All Windows</span>
									<div className="shortcut-bar__shortcut-keys">
										<kbd>⌘</kbd><kbd>\</kbd>
									</div>
								</div>
							</div>
							<p className="shortcut-bar__tooltip-note">
								Click Ask AI to open the query input or use keyboard shortcuts for quick actions.
							</p>
						</div>
					</div>
				)}
			</div> */}
		</div>
	);
};

export default ShortcutBar;
