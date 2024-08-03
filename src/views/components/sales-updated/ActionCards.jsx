import React, { memo } from 'react';
import '../../../assets/scss/sales/MyWorkflowsCard.scss';
const ActionCards = ({ bgcolor, textColor, customStyles, cardData, onClickfunc }) => {
	return (
		<div className="actionCardContainer" onClick={onClickfunc}>
			<span className="headerStyling">{cardData?.headerText}</span>
			<span className="textStyling">{cardData?.subText}</span>
		</div>
	);
};

export default memo(ActionCards);
