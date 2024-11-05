import React, { memo, useContext } from 'react';
import '../../../assets/scss/sales/activity/activityComponents.scss';
import { ReactComponent as ClockSvg } from '../../../assets/svg/activity/clock.svg';
import { ReactComponent as HandTapSvg } from '../../../assets/svg/activity/handTap.svg';
import { ReactComponent as EyeSvg } from '../../../assets/svg/activity/eye.svg';
import Context from '../../../context/context';
import Spinner from '../loaders/Spinner.jsx';

const ActivityOverview = ({ formatTime, activityDataLoading }) => {
	const {
		activityInfo: { activityData },
	} = useContext(Context);

	return (
		<div className="activityOverviewParentContainer">
			<div className="summaryOverviewContainer">
				<div className="summaryTitle">Total No. of Views</div>
				<div className="summaryDetails">
					<span className="summaryIcon">
						<EyeSvg />
					</span>
					<span className="summaryValue">
						{activityDataLoading ? (
							<Spinner width="20px" height="20px" />
						) : (
							activityData?.totalViews || 0
						)}
					</span>
				</div>
			</div>
			<div className="summaryOverviewContainer">
				<div className="summaryTitle">Average time spent</div>
				<div className="summaryDetails">
					<span className="summaryIcon">
						<ClockSvg />
					</span>
					<span className="summaryValue">
						{activityDataLoading ? (
							<Spinner width="20px" height="20px" />
						) : (
							formatTime(activityData?.averageTimeSpent || 0) || 0
						)}
					</span>
				</div>
			</div>
			<div className="summaryOverviewContainer">
				<div className="summaryTitle">Interactions</div>
				<div className="summaryDetails">
					<span className="summaryIcon">
						<HandTapSvg />
					</span>
					<span className="summaryValue">
						{activityDataLoading ? (
							<Spinner width="20px" height="20px" />
						) : (
							activityData?.totalInteractionsCount || 0
						)}
					</span>
				</div>
			</div>
		</div>
	);
};
export default memo(ActivityOverview);
