import React, { memo } from 'react';
import '../../../assets/scss/sales/MyWorkflowsCard.scss';
const ActionCards = ({ bgcolor, textColor, customStyles }) => {
	return (
		<div className="actionCardContainer">
			<span className="headerStyling">All Enquires</span>
			<span className="textStyling">290</span>
		</div>
	);
};

export default memo(ActionCards);
