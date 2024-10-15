import React, { memo } from 'react';
import '../../../assets/scss/sales/activity/activityComponents.scss';
import { ReactComponent as ClockSvg } from '../../../assets/svg/activity/clock.svg';
import { ReactComponent as HandTapSvg } from '../../../assets/svg/activity/handTap.svg';
import { ReactComponent as EyeSvg } from '../../../assets/svg/activity/eye.svg';

const ActivityOverview = () => {
	return (
		<div className="activityOverviewParentContainer">
			<div className="summaryOverviewContainer">
				<div className="summaryTitle">Total No. of Views</div>
				<div className="summaryDetails">
					<span className="summaryIcon">
						<EyeSvg />
					</span>
					<span className="summaryValue">12</span>
				</div>
			</div>
			<div className="summaryOverviewContainer">
				<div className="summaryTitle">Average time spent</div>
				<div className="summaryDetails">
					<span className="summaryIcon">
						<ClockSvg />
					</span>
					<span className="summaryValue">3m 8s</span>
				</div>
			</div>
			<div className="summaryOverviewContainer">
				<div className="summaryTitle">Interactions</div>
				<div className="summaryDetails">
					<span className="summaryIcon">
						<HandTapSvg />
					</span>
					<span className="summaryValue">127</span>
				</div>
			</div>
		</div>
	);
};
export default memo(ActivityOverview);
