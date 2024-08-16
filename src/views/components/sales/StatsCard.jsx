import React, { memo } from 'react';
import '../../../assets/scss/sales/MyWorkflowsCard.scss';
const StatsCard = ({ cardsData, onClickfunc }) => {
	return (
		<div className="statsCardParentCotnainer" onClick={onClickfunc}>
			{cardsData?.status === 'enquiry' ? (
				<div className="dotContainer">
					<div className="dot"></div>
					<span className="dotText">LIVE</span>
				</div>
			) : (
				<span>{'  '}</span>
			)}
			<div
				className="contentContainer"
				style={{ marginTop: cardsData?.status !== 'enquiry' ? '14px' : '' }}
			>
				<span className="titletextStyling">{cardsData?.subText}</span>
				<span className="enquiryText">{cardsData?.headerText}</span>
			</div>
		</div>
	);
};

export default memo(StatsCard);
