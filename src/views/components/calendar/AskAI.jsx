import React, { memo } from 'react';
import '../../../assets/scss/calendar/askAi.scss';
import { ReactComponent as AiStar } from '../../../assets/svg/calendar/aiStar.svg';

const AskAI = ({ toggleAskAi }) => {
	return (
		<div className="askAiParentContainer">
			<div className="aiHeadWrapper">
				{/* <div className="aiIcon"></div> */}
				<AiStar />

				<span className="aiLabel">Ask Ai</span>
			</div>
			<div className="aiBodyWrapper">Try AI to Schedule your meetings effortless</div>
			<div className="aiActionBtn" onClick={toggleAskAi}>
				<span>Try Now</span>
			</div>
		</div>
	);
};

export default memo(AskAI);
