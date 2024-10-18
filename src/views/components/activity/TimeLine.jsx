import React, { memo } from 'react';
import '../../../assets/scss/sales/activity/activityComponents.scss';
import { ReactComponent as SortSvg } from '../../../assets/svg/activity/sortIcon.svg';

const TimeLine = () => {
	return (
		<div className="timelineContainer">
			<div className="timelineHeader">
				<span className="timelineHeaderText">TimeLine</span>

				<div className="timelineSortContainer">
					<div className="timelineHeaderIcon">
						<SortSvg />
					</div>
					<span className="timelineHeaderText">Earliest</span>
				</div>
			</div>
			{/* Body Section */}
			<div className="timelineViewParentContainer">
				<div className="timelineEventContainer">
					{/* Date Block */}
					<div className="timelineDateBlock">
						<div className="dateTimeWrapper">
							{/* Map the event date and time with Api data  */}
							<p className="dateLable">Mon, 24 Sep 2024</p>
							<p className="timeLable">10:20 pm</p>
						</div>
						<div className="dateTimeWrapper">
							{/* Map the event date and time with Api data  */}
							<p className="dateLable">Mon, 24 Sep 2024</p>
							<p className="timeLable">10:20 pm</p>
						</div>
						<div className="dateTimeWrapper">
							{/* Map the event date and time with Api data  */}
							<p className="dateLable">Mon, 24 Sep 2024</p>
							<p className="timeLable">10:20 pm</p>
						</div>
					</div>

					{/* Event Block */}
					<div className="timelineEventBlock">
						<p>Events Block</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(TimeLine);
