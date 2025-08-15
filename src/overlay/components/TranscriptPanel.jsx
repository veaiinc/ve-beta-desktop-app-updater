import React, { useState } from 'react';
import './transcript-panel.scss';
import { Clock, Copy, Expand, Mic, X } from 'lucide-react';

const TranscriptPanel = ({ onClose, onShowLiveIntelligence }) => {
	const [isRecording, setIsRecording] = useState(false);
	
	// Debug: Log component render
	console.log('TranscriptPanel component rendered');

	const transcriptData = [
		{
			id: 1,
			speaker: 'Interviewer',
			initial: 'Z',
			color: '#d89420',
			timestamp: '0:05',
			text: 'Thanks for joining today! To kick things off, can you tell me how you typically use our product in your day-to-day work?',
		},
		{
			id: 2,
			speaker: 'Candidate',
			initial: 'C',
			color: '#dc60a2',
			timestamp: '0:08',
			text: 'Sure. I mostly use it to manage client proposals and share timelines internally. I really like the auto-fill templates, but sometimes I wish there was a faster way to switch between different document types.',
		},
	];

	const handleRecordingToggle = () => {
		setIsRecording((prev) => !prev);
	};

	const handleCopyClick = () => {
		console.log('Copy transcript clicked');
	};

	const handleExpandClick = () => {
		console.log('Expand transcript clicked');
	};

	const renderAudioVisualization = () => {
		const bars = Array.from({ length: 80 }, (_, index) => {
			const heights = [
				6, 12, 14, 6, 9, 4, 12, 6, 14, 8, 4, 6, 12, 14, 6, 9, 6, 12, 6, 14, 14, 4, 6, 14,
				14, 12, 6, 12, 14, 4, 4, 8, 12, 6, 12, 14, 14, 12, 4, 12, 12, 12, 4, 4, 4, 4, 4, 4,
				4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 12, 8, 8, 8, 8, 8, 8, 8, 4, 4, 4, 4, 4, 4, 4, 4, 4,
				4, 4, 4, 4,
			];
			const height = heights[index % heights.length];

			return (
				<div
					key={index}
					className="transcript-panel__audio-bar"
					style={{ height: `${height}px` }}
				/>
			);
		});

		return bars;
	};

	return (
		<div className="transcript-panel">
			{/* Border overlay */}
			<div className="transcript-panel__border" />

			{/* Header */}
			<div className="transcript-panel__header">
				<div className="transcript-panel__title">
					<span className="transcript-panel__title-text">Transcript</span>
					<span className="transcript-panel__duration">01:10</span>
				</div>

				<div className="transcript-panel__controls">
					<button
						className="transcript-panel__control-button"
						onClick={onShowLiveIntelligence}
					>
						<div className="transcript-panel__icon">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="14"
								height="14"
								viewBox="0 0 14 14"
								fill="none"
							>
								<g clipPath="url(#clip0_11853_899)">
									<path
										d="M7 4.8125C7.48325 4.8125 7.875 4.42075 7.875 3.9375C7.875 3.45425 7.48325 3.0625 7 3.0625C6.51675 3.0625 6.125 3.45425 6.125 3.9375C6.125 4.42075 6.51675 4.8125 7 4.8125Z"
										stroke="#F2F2F3"
										strokeWidth="0.875"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M7.875 8.3125C8.35825 8.3125 8.75 7.92075 8.75 7.4375C8.75 6.95425 8.35825 6.5625 7.875 6.5625C7.39175 6.5625 7 6.95425 7 7.4375C7 7.92075 7.39175 8.3125 7.875 8.3125Z"
										stroke="#F2F2F3"
										strokeWidth="0.875"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M6.56249 11.8125H3.93749C3.82146 11.8125 3.71018 11.7664 3.62813 11.6844C3.54609 11.6023 3.49999 11.491 3.49999 11.375V9.39586L1.99171 8.70516C1.89205 8.65521 1.81522 8.5691 1.7769 8.46441C1.73858 8.35972 1.74167 8.24436 1.78554 8.14188L3.06249 5.6875C3.06249 4.94175 3.25312 4.20838 3.61627 3.55703C3.97943 2.90568 4.50305 2.35797 5.13742 1.9659C5.77179 1.57384 6.49585 1.35044 7.24084 1.31692C7.98584 1.2834 8.72703 1.44087 9.39405 1.77438C10.0611 2.10789 10.6318 2.60637 11.0519 3.22247C11.4721 3.83858 11.7278 4.55187 11.7948 5.2946C11.8618 6.03734 11.7378 6.78486 11.4346 7.46619C11.1314 8.14753 10.6591 8.74005 10.0625 9.1875L10.5 12.6875"
										stroke="#F2F2F3"
										strokeWidth="0.875"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M7 3.06266V1.33398"
										stroke="#F2F2F3"
										strokeWidth="0.875"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M11.7237 4.8125H10.0623L8.43481 6.76539"
										stroke="#F2F2F3"
										strokeWidth="0.875"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</g>
								<defs>
									<clipPath id="clip0_11853_899">
										<rect width="14" height="14" fill="white" />
									</clipPath>
								</defs>
							</svg>
						</div>
						<span>Show Live Intelligence</span>
					</button>

					<div className="transcript-panel__separator" />

					<button
						className="transcript-panel__icon-button"
						onClick={handleCopyClick}
						title="Copy"
					>
						<Copy />
					</button>

					<button
						className="transcript-panel__icon-button"
						onClick={handleExpandClick}
						title="Expand"
					>
						<Expand />
					</button>
				</div>
			</div>

			{/* Divider */}
			<div className="transcript-panel__divider-line" />

			{/* Transcript Messages */}
			<div className="transcript-panel__messages">
				{transcriptData.map((message) => (
					<div key={message.id} className="transcript-panel__message">
						<div className="transcript-panel__message-avatar">
							<div
								className="transcript-panel__avatar"
								style={{ backgroundColor: message.color }}
							>
								{message.initial}
							</div>
						</div>

						<div className="transcript-panel__message-content">
							<div className="transcript-panel__message-header">
								<span className="transcript-panel__speaker">{message.speaker}</span>
								<div className="transcript-panel__dot" />
								<div className="transcript-panel__timestamp">
									<Clock />
									<span>{message.timestamp}</span>
								</div>
							</div>
							<div className="transcript-panel__message-text">{message.text}</div>
						</div>
					</div>
				))}
			</div>

			{/* Bottom Controls */}
			<div className="transcript-panel__bottom">
				<div className="transcript-panel__time">
					<span className="transcript-panel__time-current">1:23</span>
					<span className="transcript-panel__time-unit">Min</span>
				</div>

				<div className="transcript-panel__audio-viz">{renderAudioVisualization()}</div>

				<div className="transcript-panel__record-controls">
					<button
						className="transcript-panel__close-button"
						onClick={onClose}
						title="Close"
					>
						<X />
					</button>

					<button
						className={`transcript-panel__record-button ${
							isRecording ? 'transcript-panel__record-button--active' : ''
						}`}
						onClick={handleRecordingToggle}
						title={isRecording ? 'Stop Recording' : 'Start Recording'}
					>
						<Mic />
					</button>
				</div>
			</div>
		</div>
	);
};

export default TranscriptPanel;
