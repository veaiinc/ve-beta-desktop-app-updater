import React, { useContext, useEffect, useState, memo } from 'react';
import Context from '../../../context/context';
import '../../../assets/scss/chat/aiMessageLoader.scss';
import ChatLoader from './ChatLoader';

const defaultMessage = 'Thinking'; // Default text when globalLoadingMessage is null or empty
const AIMessageLoader = () => {
	const {
		templates: { globalChatMessages, currentSessionId },
	} = useContext(Context);

	const [message, setMessage] = useState(
		globalChatMessages?.[currentSessionId]?.loadingMessage || defaultMessage,
	);

	useEffect(() => {
		const loadingMessage = globalChatMessages?.[currentSessionId]?.loadingMessage;
		if (!loadingMessage) {
			setMessage(defaultMessage);
		} else {
			setMessage(loadingMessage);
		}
	}, [globalChatMessages]);

	return (
		<div className="ai-message-loader">
			<div className="loader-text-container">{message}</div>
		</div>
	);
};

export default memo(AIMessageLoader);
