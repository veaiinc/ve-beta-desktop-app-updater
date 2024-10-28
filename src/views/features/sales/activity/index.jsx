import React, { memo, useCallback, useState, useContext, useEffect } from 'react';
import '../../../../assets/scss/sales/activity/activityComponents.scss';
import ActivityOverview from '../../../components/activity/ActivityOverview';
// import TimeLine from '../../../components/activity/TimeLine';
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
		activityInfo: { activityData, getSmartFileActivity, getSmartFileViewers, viewersList },
	} = useContext(Context);
	// console.log('activityData: ' + activityData);
	// console.log('viewersList: ' + JSON.stringify(viewersList, null, 2));

	//States
	const [info, setInfo] = useState({
		modalIsOpen: false,
		selectedViewer: null,
		viewersListData: null,
		loading: false,
	});

	//Functions

	//To open Modal
	const showDrawer = useCallback(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			modalIsOpen: !prevInfo.modalIsOpen,
		}));
	}, []);

	//To handle selected viewer
	const handelViewerSelection = useCallback((selectedViewerItem) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			selectedViewer: selectedViewerItem,
		}));
	}, []);

	//API Activity Summary ====>
	const fetchActivityData = useCallback(() => {
		if (!activityData) {
			getSmartFileActivity({ workflowId });
		}
	}, [getSmartFileActivity, workflowId, activityData]);

	//API Viewers List ====>
	const fetchViewersListData = useCallback(() => {
		if (!viewersList) {
			getSmartFileViewers({ workflowId });
		}
	}, [getSmartFileViewers, workflowId, viewersList]);

	//UseEffect
	useEffect(() => {
		fetchActivityData();
		fetchViewersListData();
	}, [fetchActivityData, fetchViewersListData, workflowId]);

	return (
		<div className="activityParentContainer">
			<ActivityOverview />

			<div className="activityDetailsContainer">
				{/* <TimeLine showDrawer={showDrawer} /> */}

				<ViewersList
					showDrawer={showDrawer}
					viewersListData={viewersList}
					handelViewerSelection={handelViewerSelection}
				/>
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
				labelItemsData={activityData?.interaction?.reduce((acc, item) => {
					return acc.concat(item.interactions); //reducing the "interactionsssss" array for sending only each "interaction" array data
				}, [])}
			/>

			{/* /Modals */}
			{info?.selectedViewer ? (
				<SessionActivityModal
					modalIsOpen={info?.modalIsOpen}
					showDrawer={showDrawer}
					selectedViewer={info?.selectedViewer}
				/>
			) : (
				''
			)}
			{/* <EmailModal modalIsOpen={info?.modalIsOpen} showDrawer={showDrawer} /> */}
		</div>
	);
};

export default memo(ActivityDashboard);
