import React, { useContext } from 'react';
import Context from '../../../context/context';

const AIMessageLoader = () => {
	const {
		templates: { globalLoadingMesssage },
	} = useContext(Context);

	return (
		<div className="ai-message-loader">
			<div className="animated-bar"></div>
			<p className="message-text-content">
				{globalLoadingMesssage?.length ? globalLoadingMesssage : 'Thinking'}
			</p>
		</div>
	);
};

export default AIMessageLoader;
