import React, { memo } from 'react';
import '../../../assets/scss/sales/activity/modalSessionComponents.scss'; //Delete modalSessionComponents scss file and create 4 seperate css file for easch type of tab sessions
import { ReactComponent as PageAlignSvg } from '../../../assets/svg/activity/pagealign.svg';
import { ReactComponent as ReviewsSvg } from '../../../assets/svg/activity/reviews.svg';

const TimeLineSession = () => {
	return (
		<div className="timeLineWrapper">
			<div className="blockParentContainer">
				<div className="blockIcon">
					<PageAlignSvg />
				</div>
				<div className="blockContentContainer">
					<div className="blockHeader">
						<span className="blockTitle">Page Alignment</span>
						<div className="headerIcon">?</div>
					</div>
					<div className="blockDescription">
						<span className="blockKey">Duration:</span>
						<span className="blockValue">00:06:32</span>
					</div>
					<div className="blockElementsContainer">
						<div className="blockElementWrapper">
							<div className="blockElementIcon">
								<ReviewsSvg />
							</div>
							<div className="blockElementInfo">
								<span className="elementTitle">Header Block</span> -
								<span className="elementValue">“Block text first line” </span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(TimeLineSession);
