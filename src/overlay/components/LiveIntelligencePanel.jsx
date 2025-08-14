import React, { useState } from 'react';
import './live-intelligence-panel.scss';
import { Copy, X } from 'lucide-react';

const LiveIntelligencePanel = ({ onClose, onShowTranscript }) => {
	const actions = [
		'What should I say next?',
		'Suggest follow-up questions',
		'Fact-check recent statements',
		'Summarize key points discussed',
	];

	const handleActionClick = (action) => {
		console.log('Action clicked:', action);
		// Here you can implement the actual action functionality
	};

	const handleCopyClick = () => {
		console.log('Copy clicked');
		// Here you can implement copy functionality
	};

	return (
		<div className="live-intelligence-panel">
			<div className="live-intelligence-panel__divider" />

			{/* Header */}
			<div className="live-intelligence-panel__header">
				<div className="live-intelligence-panel__title">
					<span>Live Intelligence</span>
				</div>

				<div className="live-intelligence-panel__controls">
					<button
						className="live-intelligence-panel__control-button"
						onClick={onShowTranscript}
					>
						<div className="live-intelligence-panel__icon">
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M9 18V5l12 13v-1M9 9v1" />
								<circle cx="3" cy="12" r="2" />
								<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
							</svg>
						</div>
						<span>Show Transcript</span>
					</button>

					<div className="live-intelligence-panel__separator" />

					<button
						className="live-intelligence-panel__icon-button"
						onClick={handleCopyClick}
						title="Copy"
					>
						<Copy />
					</button>

					<button
						className="live-intelligence-panel__icon-button"
						onClick={onClose}
						title="Close"
					>
						<X />
					</button>
				</div>
			</div>

			{/* Divider */}
			<div className="live-intelligence-panel__divider-line" />

			{/* Live Intelligence Actions */}
			<div className="live-intelligence-panel__actions">
				<div className="live-intelligence-panel__actions-header">
					<span>Actions</span>
				</div>

				<div className="live-intelligence-panel__actions-list">
					{actions.map((action, index) => (
						<button
							key={index}
							className="live-intelligence-panel__action-item"
							onClick={() => handleActionClick(action)}
						>
							{action}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default LiveIntelligencePanel;
