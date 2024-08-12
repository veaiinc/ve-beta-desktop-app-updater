import React, { memo } from 'react';
import '../../../assets/scss/sales/MyWorkflowsCard.scss';
const StatsCard = ({ showDot, dotColor, dotText, title, subTitle, cardsData, onClickfunc }) => {
	return (
		<div className="statsCardParentCotnainer" onClick={onClickfunc}>
			<div className="dotContainer">
				<div className="dot"></div>
				<span className="dotText">LIVE</span>
			</div>
			<div className="contentContainer">
				<span className="titletextStyling">{cardsData?.subText}</span>
				<span className="enquiryText">{cardsData?.headerText}</span>
			</div>
		</div>
	);
};

export default memo(StatsCard);
