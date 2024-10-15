import React, { memo } from 'react';
import '../.././../../assets/scss/sales/smartFile.scss';
import ActivityOverview from '../../../components/activity/ActivityOverview';
import TimeLine from '../../../components/activity/TimeLine';
import ViewersList from '../../../components/activity/ViewersList';

const ActivityDashboard = () => {
	return (
		<div className="activityParentContainer">
			<ActivityOverview />

			<div className="activityDetailsContainer">
				<TimeLine />
				<ViewersList />
			</div>
		</div>
	);
};

export default memo(ActivityDashboard);
