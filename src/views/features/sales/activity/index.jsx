import React, { memo } from 'react';
import '../.././../../assets/scss/sales/smartFile.scss';
import ActivityOverview from '../../../components/activity/ActivityOverview';
import TimeLine from '../../../components/activity/TimeLine';
import ViewersList from '../../../components/activity/ViewersList';
import ActivityMetrics from '../../../components/activity/ActivityMetrics';

const ActivityDashboard = () => {
	return (
		<div className="activityParentContainer">
			<ActivityOverview />

			<div className="activityDetailsContainer">
				<TimeLine />
				<ViewersList />
			</div>

			{/* Metric Component */}
			<ActivityMetrics title="Time Spent" />
			<ActivityMetrics title="Interactions" />
		</div>
	);
};

export default memo(ActivityDashboard);
