import React, { memo } from 'react';
import '../../../assets/scss/sales/MyWorkflowsCard.scss';
const StatsCard = ({ showDot, dotColor, dotText, title, subTitle }) => {
	return (
		<div className="statsCardParentCotnainer">
			<div className="dotContainer">
				<div className="dot"></div>
				<span className="dotText">LIVE</span>
			</div>
			<div className="contentContainer">
				<span className="titletextStyling">11</span>
				<span className="enquiryText">Enquiry Form</span>
			</div>
		</div>
	);
};

export default memo(StatsCard);
