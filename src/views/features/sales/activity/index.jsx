import React, { memo, useCallback, useState } from 'react';
import '../../../../assets/scss/sales/activity/activityComponents.scss';
import ActivityOverview from '../../../components/activity/ActivityOverview';
import TimeLine from '../../../components/activity/TimeLine';
import ViewersList from '../../../components/activity/ViewersList';
import ActivityMetrics from '../../../components/activity/ActivityMetrics';
import SessionActivityModal from '../../../components/activity/ActivitySessionModal.jsx';

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
				<TimeLine showDrawer={showDrawer} />

				<ViewersList showDrawer={showDrawer} />
			</div>

			{/* Metric Component */}
			<ActivityMetrics title="Time Spent" />
			<ActivityMetrics title="Interactions" />

			{/* /Modals */}
			<SessionActivityModal modalIsOpen={info?.modalIsOpen} showDrawer={showDrawer} />
		</div>
	);
};

export default memo(ActivityDashboard);
