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
import moment from 'moment';

const ActivityDashboard = () => {
	const { workflowId } = useParams();

	//Context
	const {
		activityInfo: { activityData, getSmartFileActivity, getSmartFileViewers, viewersList },
	} = useContext(Context);

	//States
	const [info, setInfo] = useState({
		modalIsOpen: false,
		selectedViewer: null,
		viewersListData: null,
		activitySummaryData: null,
		activityDataLoading: false,
		viewersListLoading: false,
	});

	//Functions
	// Fetch Activity Data
	const fetchActivityData = useCallback(() => {
		setInfo((prev) => ({ ...prev, activityDataLoading: true }));
		getSmartFileActivity({ workflowId }).finally(() => {
			setInfo((prev) => ({ ...prev, activityDataLoading: false }));
		});
	}, [workflowId]);

	// Fetch Viewers List Data
	const fetchViewersListData = useCallback(() => {
		setInfo((prev) => ({ ...prev, viewersListLoading: true }));
		getSmartFileViewers({ workflowId }).finally(() => {
			setInfo((prev) => ({ ...prev, viewersListLoading: false }));
		});
	}, [workflowId]);

	// UseEffect to fetch data on component mount or workflowId change
	useEffect(() => {
		if (workflowId) {
			console.log('Fetching ActivityDataAPI');
			fetchActivityData();
			console.log('Fetching ViewersListData');
			fetchViewersListData();
		}
	}, [workflowId]);

	// Update local state when context data changes
	useEffect(() => {
		if (activityData) {
			setInfo((prev) => ({ ...prev, activitySummaryData: activityData }));
		}
		if (viewersList) {
			setInfo((prev) => ({ ...prev, viewersListData: viewersList }));
		}
	}, []);

	const formatTime = useCallback((seconds) => {
		const duration = moment.duration(seconds, 'seconds');
		const hours = String(duration.hours()).padStart(2, '0');
		const minutes = String(duration.minutes()).padStart(2, '0');
		const secs = String(duration.seconds()).padStart(2, '0');
		return `${hours}:${minutes}:${secs}`;
	}, []);

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
	// const fetchActivityData = useCallback(() => {
	// 	if (!activityData) {
	// 		getSmartFileActivity({ workflowId });
	// 	}
	// }, [getSmartFileActivity, workflowId, activityData]);

	//API Viewers List ====>
	// const fetchViewersListData = useCallback(() => {
	// 	if (!viewersList) {
	// 		getSmartFileViewers({ workflowId });
	// 	}
	// }, [getSmartFileViewers, workflowId, viewersList]);

	//UseEffect
	// useEffect(() => {
	// 	if (workflowId) {
	// 		console.log('Fetching ActivityDataAPI');
	// 		fetchActivityData();
	// 		console.log('Fetching ViewersListData');
	// 		fetchViewersListData();
	// 	}
	// }, [workflowId]);

	// console.log('Fetching ActivityData: ' + JSON.stringify(activityData, null, 2));
	// console.log('Fetching viewersList: ' + JSON.stringify(viewersList, null, 2));

	return (
		<div className="activityParentContainer">
			<ActivityOverview
				formatTime={formatTime}
				activityDataLoading={info?.activityDataLoading}
			/>

			<div className="activityDetailsContainer">
				{/* <TimeLine showDrawer={showDrawer} /> */}

				<ViewersList
					showDrawer={showDrawer}
					viewersListData={info?.viewersListData || []}
					handelViewerSelection={handelViewerSelection}
					formatTime={formatTime}
					viewersListLoading={info?.viewersListLoading}
				/>
			</div>

			{/* Metric Component */}
			<ActivityMetrics
				title="Time Spent"
				labelsData={info?.activitySummaryData?.moduleViewDuration || []}
				labelItemsData={info?.activitySummaryData?.sectionViewDuration || []}
				formatTime={formatTime}
				activityDataLoading={info?.activityDataLoading}
			/>
			<ActivityMetrics
				title="Interactions"
				labelsData={info?.activitySummaryData?.interaction || []}
				labelItemsData={
					info?.activitySummaryData?.interaction?.reduce((acc, item) => {
						return acc.concat(item.interactions); //reducing the "interactionsssss" array for sending only each "interaction" array data
					}, []) || []
				}
				formatTime={formatTime}
				activityDataLoading={info?.activityDataLoading}
			/>

			{/* /Modals */}
			{info?.selectedViewer ? (
				<SessionActivityModal
					modalIsOpen={info?.modalIsOpen}
					showDrawer={showDrawer}
					selectedViewer={info?.selectedViewer}
					formatTime={formatTime}
					activityDataLoading={info?.activityDataLoading}
				/>
			) : (
				''
			)}
			{/* <EmailModal modalIsOpen={info?.modalIsOpen} showDrawer={showDrawer} /> */}
		</div>
	);
};

export default memo(ActivityDashboard);
