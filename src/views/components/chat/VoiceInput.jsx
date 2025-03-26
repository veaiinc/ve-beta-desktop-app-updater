import React, { useState } from 'react';
import '../../../assets/scss/chat/voiceInput.scss';

const VoiceInput = () => {
	const [isListening, setIsListening] = useState(false);

	const handleMicClick = () => {
		setIsListening(!isListening);
	};

	const handleCancelClick = () => {
		setIsListening(false);
	};

	return (
		<div className="voice-input-container">
			<div className="input-area">
				<i className="voice-icon"></i>
				<span className="placeholder">Speak I am listening</span>
			</div>

			{isListening && (
				<div className="loading-indicator">
					<div className="dot"></div>
					<div className="dot"></div>
					<div className="dot"></div>
					<div className="dot"></div>
				</div>
			)}

			<div className="controls">
				<button className="mic-button" onClick={handleMicClick}>
					<i className="mic-icon"></i>
				</button>
				<button className="cancel-button" onClick={handleCancelClick}>
					<i className="cancel-icon"></i>
				</button>
			</div>
		</div>
	);
};

export default VoiceInput;
