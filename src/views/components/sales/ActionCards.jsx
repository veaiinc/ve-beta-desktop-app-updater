import React, { memo } from 'react';
import '../../../assets/scss/sales/MyWorkflowsCard.scss';
const ActionCards = ({ cardData, onClickfunc }) => {
	return cardData?.status === 'actionRequired' ? (
		<div className="actionRequiredCardContainer" onClick={onClickfunc}>
			<span className="headerStyling">{cardData?.headerText}</span>
			<span className="textStyling">{cardData?.subText}</span>
		</div>
	) : (
		<div className="actionCardContainer" onClick={onClickfunc}>
			<span className="headerStyling">{cardData?.headerText}</span>
			<span className="textStyling">{cardData?.subText}</span>
		</div>
	);
};

export default memo(ActionCards);
