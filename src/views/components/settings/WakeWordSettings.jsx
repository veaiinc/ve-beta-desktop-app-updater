import React from 'react';
import { useWakeWord } from '../../../hooks/useWakeWord';

const WakeWordSettings = () => {
	const { isEnabled, isDetecting, startDetection, stopDetection, checkStatus } = useWakeWord();

	const handleToggle = async () => {
		if (isEnabled) {
			await stopDetection();
		} else {
			await startDetection();
		}
	};

	return (
		<div className="wake-word-settings">
			<h3>Wake Word Detection</h3>
			<p>Say "Hey Ve" to activate the AI assistant</p>

			<div className="settings-controls">
				<button
					onClick={handleToggle}
					className={`toggle-btn ${isEnabled ? 'enabled' : 'disabled'}`}
				>
					{isEnabled ? 'Disable' : 'Enable'} Wake Word
				</button>

				<div className="status">Status: {isDetecting ? 'Listening...' : 'Stopped'}</div>
			</div>
		</div>
	);
};

export default WakeWordSettings;
