import React, { memo, useCallback, useState } from 'react';
import '../../../assets/scss/sales/activity/modalSessionComponents.scss'; //Delete modalSessionComponents scss file and create 4 seperate css file for easch type of tab sessions
import { ReactComponent as PageAlignSvg } from '../../../assets/svg/activity/pagealign.svg';
import { ReactComponent as ReviewsSvg } from '../../../assets/svg/activity/reviews.svg';

const TimeLineSession = () => {
	const [info, setInfo] = useState({
		isExpanded: true,
	});

	// Toggle expand/collapse function
	const toggleExpand = useCallback(() => {
		setInfo((prevState) => ({
			...prevState,
			isExpanded: !prevState.isExpanded,
		}));
	}, []);
	return (
		<div className="timeLineWrapper">
			<div className="blockParentContainer">
				<div className="blockIcon">
					<PageAlignSvg />
				</div>
				<div className="blockContentContainer" onClick={toggleExpand}>
					{/* blockHeader  */}
					<div className="blockHeader">
						<span className="blockTitle">Blocks Entered Screen in Proposal</span>
						<div className="headerIcon">?</div>
					</div>
					{/* blockDescription  */}
					<div className="blockDescription">
						<span className="blockKey">Duration:</span>
						<span className="blockValue">00:06:32</span>
					</div>
					{/* blockElementsContainer */}
					<div
						className={
							info?.isExpanded === true
								? 'blockElementsContainer'
								: 'hideBlockElementsContainer'
						}
					>
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
