// WAKE WORD FUNCTIONALITY DISABLED FOR BUILD
import React from 'react';
// import { useWakeWord } from '../../../hooks/useWakeWord';

const WakeWordSettings = () => {
	// const { isEnabled, isDetecting, startDetection, stopDetection, checkStatus } = useWakeWord();

	// const handleToggle = async () => {
	// 	if (isEnabled) {
	// 		await stopDetection();
	// 	} else {
	// 		await startDetection();
	// 	}
	// };

	return (
		<div className="wake-word-settings">
			<h3>Wake Word Detection</h3>
			<p style={{ color: '#666', fontStyle: 'italic' }}>
				Wake word functionality is currently disabled for this build
			</p>

			<div className="settings-controls">
				<button
					disabled
					className="toggle-btn disabled"
					style={{ opacity: 0.5, cursor: 'not-allowed' }}
				>
					Wake Word Disabled
				</button>

				<div className="status">Status: Disabled</div>
			</div>
		</div>
	);
};

export default WakeWordSettings;
