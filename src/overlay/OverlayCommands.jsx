import React, { useState } from 'react';

const OverlayCommands = ({ screenshots, onTakeScreenshot }) => {
	const [isTooltipVisible, setIsTooltipVisible] = useState(false);

	const handleMouseEnter = () => setIsTooltipVisible(true);
	const handleMouseLeave = () => setIsTooltipVisible(false);

	return (
		<div className="overlay-commands">
			<div className="commands-bar">
				{/* Show/Hide Command */}
				<div className="command-item">
					<span className="command-label">Show/Hide</span>
					<div className="command-keys">
						<kbd className="key">⌘</kbd>
						<kbd className="key">B</kbd>
					</div>
				</div>

				{/* Screenshot Command */}
				<div className="command-item">
					<span className="command-label">
						{screenshots.length === 0 ? 'Take Screenshot' : 'Screenshot'}
					</span>
					<div className="command-keys">
						<kbd className="key">⌘</kbd>
						<kbd className="key">H</kbd>
					</div>
				</div>

				{/* Move Commands */}
				<div className="command-item">
					<span className="command-label">Move</span>
					<div className="command-keys">
						<kbd className="key">⌘</kbd>
						<kbd className="key">↑↓←→</kbd>
					</div>
				</div>

				{/* Manual Screenshot Button */}
				<button 
					className="screenshot-button"
					onClick={onTakeScreenshot}
					title="Take screenshot manually"
				>
					📸
				</button>

				{/* Help tooltip */}
				<div 
					className="help-container"
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<div className="help-button">?</div>
					
					{isTooltipVisible && (
						<div className="help-tooltip">
							<div className="tooltip-content">
								<h3>Keyboard Shortcuts</h3>
								<div className="shortcut-list">
									<div className="shortcut-item">
										<span className="shortcut-desc">Toggle Window</span>
										<div className="shortcut-keys">
											<kbd>⌘</kbd><kbd>B</kbd>
										</div>
									</div>
									<div className="shortcut-item">
										<span className="shortcut-desc">Take Screenshot</span>
										<div className="shortcut-keys">
											<kbd>⌘</kbd><kbd>H</kbd>
										</div>
									</div>
									<div className="shortcut-item">
										<span className="shortcut-desc">Move Window</span>
										<div className="shortcut-keys">
											<kbd>⌘</kbd><kbd>Arrow Keys</kbd>
										</div>
									</div>
								</div>
								<p className="tooltip-note">
									Screenshots are automatically saved and displayed here.
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default OverlayCommands;