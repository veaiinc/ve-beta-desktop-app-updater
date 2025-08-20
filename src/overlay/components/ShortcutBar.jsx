import React, { useState } from 'react';
import './shortcut-bar.scss';

const ShortcutBar = ({ onListenClick, isLiveIntelligenceOpen, onAskAIClick }) => {
	const [isTooltipVisible, setIsTooltipVisible] = useState(false);

	const handleMouseEnter = () => setIsTooltipVisible(true);
	const handleMouseLeave = () => setIsTooltipVisible(false);
	return (
		<div className="shortcut-bar">
			<div className="shortcut-bar__divider" />
			
			<div 
				className={`shortcut-bar__item shortcut-bar__item--clickable ${isLiveIntelligenceOpen ? 'shortcut-bar__item--active' : ''}`}
				onClick={onListenClick}
			>
				<span className="shortcut-bar__label">Listen</span>
				<div className="shortcut-bar__icon">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M3 11v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3"/>
						<path d="M12 2v18"/>
						<path d="M8 6l4-4 4 4"/>
						<path d="M8 18l4 4 4-4"/>
					</svg>
				</div>
			</div>

			<div className="shortcut-bar__separator" />

			<div 
				className="shortcut-bar__item shortcut-bar__item--clickable"
				onClick={onAskAIClick}
			>
				<span className="shortcut-bar__label">Ask AI</span>
			</div>

			<div className="shortcut-bar__separator" />

			<div className="shortcut-bar__item">
				<span className="shortcut-bar__label">Hide</span>
				<div className="shortcut-bar__keys">
					<kbd className="shortcut-bar__key">⌘</kbd>
					<kbd className="shortcut-bar__key">B</kbd>
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
									<span className="shortcut-bar__shortcut-desc">Hide Overlay</span>
									<div className="shortcut-bar__shortcut-keys">
										<kbd>⌘</kbd><kbd>⏎</kbd>
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