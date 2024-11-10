import React, { memo } from 'react';
import '../../../assets/scss/calendar/askAi.scss';

const AskAI = () => {
	return (
		<div className="askAiParentContainer">
			<div className="aiHeadWrapper">Ask Ai</div>
			<div className="aiBodyWrapper">Try AI to Schedule your meetings effortless</div>
			<div className="aiFootWrapper">Try Now</div>
		</div>
	);
};

export default memo(AskAI);
