import React, { memo, useCallback, useState } from 'react';
import '../../../../assets/scss/sales/activity/activityComponents.scss';
import ActivityOverview from '../../../components/activity/ActivityOverview';
import TimeLine from '../../../components/activity/TimeLine';
import ViewersList from '../../../components/activity/ViewersList';
import ActivityMetrics from '../../../components/activity/ActivityMetrics';

const ActivityDashboard = () => {
	const [info, setInfo] = useState({
		modalIsOpen: false,
	});

	const showDrawer = useCallback(() => {
		console.log(`Drawer Clicked: ${info.modalIsOpen}`);
		setInfo((prevInfo) => ({
			...prevInfo,
			modalIsOpen: !prevInfo.modalIsOpen,
		}));
	}, [info?.modalIsOpen]);

	return (
		<div className="activityParentContainer">
			<ActivityOverview />

			<div className="activityDetailsContainer">
				<TimeLine modalIsOpen={info?.modalIsOpen} showDrawer={showDrawer} />

				<ViewersList modalIsOpen={info?.modalIsOpen} showDrawer={showDrawer} />
			</div>

			{/* Metric Component */}
			<ActivityMetrics title="Time Spent" />
			<ActivityMetrics title="Interactions" />
		</div>
	);
};

export default memo(ActivityDashboard);
