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

	useEffect(() => {
		if (!globalLoadingMesssage || globalLoadingMesssage?.length === 0) {
			setMessage(defaultMessage);
		} else {
			setMessage(globalLoadingMesssage);
		}
	}, [globalLoadingMesssage]);

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
			<div className="text-container">{message}</div>
		</div>
	);
};

export default AIMessageLoader;
