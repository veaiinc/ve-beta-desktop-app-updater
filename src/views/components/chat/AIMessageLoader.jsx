import React, { useContext, useEffect, useState } from 'react';
import Context from '../../../context/context';
import '../../../assets/scss/chat/aiMessageLoader.scss';
import ChatLoader from './ChatLoader';

const AIMessageLoader = () => {
	const {
		templates: { globalLoadingMesssage },
	} = useContext(Context);

	const defaultMessage = 'Thinking'; // Default text when globalLoadingMessage is null or empty
	const [message, setMessage] = useState(globalLoadingMesssage || defaultMessage);
	const [highlightIndex, setHighlightIndex] = useState(-3); // Start off-screen
	const highlightLength = 3; // Number of highlighted characters

	useEffect(() => {
		if (!globalLoadingMesssage || globalLoadingMesssage?.length === 0) {
			setMessage(defaultMessage);
		} else {
			setMessage(globalLoadingMesssage);
		}
		setHighlightIndex(-highlightLength); // Restart animation
	}, [globalLoadingMesssage]);

	useEffect(() => {
		const speed = message?.length > 15 ? 40 : 100; // Adjust speed dynamically

		const interval = setInterval(() => {
			setHighlightIndex((prev) => {
				if (prev < message?.length) {
					return prev + 1; // Move highlight forward
				} else {
					return -highlightLength; // Restart off-screen
				}
			});
		}, speed);

		return () => clearInterval(interval);
	}, [message]); // Restart animation when message changes

	return (
		<div className="ai-message-loader">
			<div className="loader-tabs-wrapper">
				<div className={`loader-tab-btn active`}>
					<div className="loader-wrapper">
						<ChatLoader />
					</div>
					Answer
				</div>
			</div>
			<div className="text-container">
				{message?.split('')?.map((char, index) => (
					<span
						key={index}
						className={`char ${
							index >= highlightIndex && index < highlightIndex + highlightLength
								? 'highlight-char'
								: ''
						}`}
					>
						{char}
					</span>
				))}
			</div>
		</div>
	);
};

export default AIMessageLoader;
