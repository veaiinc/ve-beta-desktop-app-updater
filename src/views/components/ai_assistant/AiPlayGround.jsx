import React, { memo } from 'react';

const AiPlayGround = ({ assistant }) => {
	if (!assistant?._id) return null;

	const aiChatUrl = `https://widget.ve.ai/${assistant._id}?aiAssistantName=${encodeURIComponent(
		assistant?.name || '',
	)}`;

	return (
		<div className="ai-playground-container">
			<h3 className="ai-playground-header">Ve AI Chat Playground – Your AI, Your Way</h3>
			<iframe className="ai-playground-iframe" src={aiChatUrl} title="AI Assistant Chat" />
		</div>
	);
};

export default memo(AiPlayGround);
