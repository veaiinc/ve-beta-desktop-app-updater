import React, { memo, useCallback, useState, useContext, useEffect } from 'react';
import '../../../../assets/scss/sales/activity/activityComponents.scss';
import ActivityOverview from '../../../components/activity/ActivityOverview';
import TimeLine from '../../../components/activity/TimeLine';
import ViewersList from '../../../components/activity/ViewersList';
import ActivityMetrics from '../../../components/activity/ActivityMetrics';
import SessionActivityModal from '../../../components/activity/ActivitySessionModal.jsx';
// import EmailModal from '../../../components/activity/EmailModal.jsx';
import Context from '../../../../context/context';
import { useParams } from 'react-router-dom';

const ActivityDashboard = () => {
	const { workflowId } = useParams();

	//Context
	const {
		activityInfo: { getSmartFileActivity, activityData },
	} = useContext(Context);

	//States
	const [info, setInfo] = useState({
		modalIsOpen: false,
	});

	//UseEffect
	useEffect(() => {
		fetchActivityData();
	}, []);

	//Functions
	const showDrawer = useCallback(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			modalIsOpen: !prevInfo.modalIsOpen,
		}));
	}, []);

	const fetchActivityData = useCallback(() => {
		if (!activityData) {
			getSmartFileActivity({ workflowId });
		}
	}, [getSmartFileActivity, workflowId, activityData]);

	return (
		<div className="activityParentContainer">
			<ActivityOverview />

			<div className="activityDetailsContainer">
				<TimeLine showDrawer={showDrawer} />

				<ViewersList showDrawer={showDrawer} />
			</div>

			{/* Metric Component */}
			<ActivityMetrics
				title="Time Spent"
				labelsData={activityData?.moduleViewDuration}
				labelItemsData={activityData?.sectionViewDuration}
			/>
			<ActivityMetrics
				title="Interactions"
				labelsData={activityData?.interaction}
				labelItemsData={activityData?.interaction}
			/>

			{/* /Modals */}
			<SessionActivityModal modalIsOpen={info?.modalIsOpen} showDrawer={showDrawer} />
			{/* <EmailModal modalIsOpen={info?.modalIsOpen} showDrawer={showDrawer} /> */}
		</div>
	);
};

export default memo(ActivityDashboard);
