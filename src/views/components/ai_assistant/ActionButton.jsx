import React from 'react';
import '../../../assets/scss/ai_assistant/actionButton.scss';

const ActionButton = ({ children, ...props }) => {
	return (
		<button {...props} className="action-button">
			{children}
		</button>
	);
};

export default ActionButton;
