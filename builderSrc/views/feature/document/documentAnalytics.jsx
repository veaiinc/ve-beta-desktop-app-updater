import React, { useState, useContext, useEffect, useMemo } from 'react';
import '../../../assets/scss/document/documentAnalytics.scss';
import { ReactComponent as EyeSvg } from '../../../assets/svg/document/eye.svg';
import { ReactComponent as ClockSvg } from '../../../assets/svg/document/clock.svg';
import { ReactComponent as HandTapSvg } from '../../../assets/svg/document/handTap.svg';
import Context from '../../../context/context';
import moment from 'moment';
import FileTimeLine from '../../components/EditDocument/fileTimeLine';
import ViewersList from '../../components/EditDocument/viewersList';
import SessionMetric from '../../components/EditDocument/sessionMetric';

export const formatTime = (milliseconds) => {
	const duration = moment.duration(milliseconds / 1000, 'seconds');
	const hours = String(duration.hours()).padStart(2, '0');
	const minutes = String(duration.minutes()).padStart(2, '0');
	const secs = String(duration.seconds()).padStart(2, '0');
	return `${hours}:${minutes}:${secs}`;
};
const documentAnalytics = ({ workflowId }) => {
	const {
		templates: {
			getSmartFileActivity,
			smartFileActivity,
			getSmartFileViewers,
			viewersList,
			getSmartFileData,
			smartFileInfo,
		},
	} = useContext(Context);
	const [info, setInfo] = useState({
		activeTab: 'viewers',
		loading: false,
		listLoading: false,
		smartFileInfoLoading: false,
	});
	const [fileData, setFileData] = useState(null);

	useEffect(() => {
		if (!smartFileActivity) {
			fetchActivity();
		}
	}, [smartFileActivity, workflowId]);

	useEffect(() => {
		if (!viewersList) {
			fetchViewersList();
		}
	}, [viewersList, workflowId]);
	useEffect(() => {
		if (!smartFileInfo) {
			fetchSmartfileInfo();
		}
	}, [smartFileInfo, workflowId]);

	useEffect(() => {
		if (smartFileInfo) {
			setFileData((prev) => ({
				...prev,
				...smartFileInfo,
				requiredAction: smartFileInfo.requiredAction || prev?.requiredAction,
				_id: workflowId,
				status: smartFileInfo.status || prev?.status,
				clientDetails: smartFileInfo.clientDetails || prev?.clientDetails,
				title: smartFileInfo.title || prev?.title,
			}));

			if (smartFileInfo.requiredAction?.action && activeTab === 'preview') {
				setActiveTab('reqActions');
			}
		}
	}, [smartFileInfo, workflowId]);

	const fetchActivity = async () => {
		setInfo((prevState) => ({
			...prevState,
			loading: true,
		}));

		const payload = { workflowId };

		try {
			await getSmartFileActivity(payload);
		} finally {
			setInfo((prevState) => ({
				...prevState,
				loading: false,
			}));
		}
	};
	const fetchViewersList = async () => {
		setInfo((prevState) => ({
			...prevState,
			listLoading: true,
		}));

		const payload = {
			workflowId: workflowId,
		};
		try {
			await getSmartFileViewers(payload);
		} finally {
			setInfo((prevState) => ({
				...prevState,
				listLoading: false,
			}));
		}
	};
	const fetchSmartfileInfo = async () => {
		setInfo((prevState) => ({
			...prevState,
			smartFileInfoLoading: true,
		}));
		const payload = {
			getWorkflowWithModulesId: workflowId,
		};
		try {
			await getSmartFileData(payload);
		} finally {
			setInfo((prevState) => ({
				...prevState,
				smartFileInfoLoading: false,
			}));
		}
	};
	const tabs = useMemo(() => {
		return {
			timeLine: {
				label: 'Time Line',
				comp: <FileTimeLine data={smartFileActivity} />,
			},

			viewers: {
				label: 'Viewers',
				comp: (
					<ViewersList
						loading={info?.listLoading}
						viewersList={viewersList}
						fileData={fileData}
					/>
				),
			},
			timeSpent: {
				label: 'Time Spent',
				comp: (
					<SessionMetric
						key={'Time Spent'}
						title={'Time Spent'}
						loading={info?.loading}
						labelsData={smartFileActivity?.moduleViewDuration}
						labelItemsData={smartFileActivity?.sectionViewDuration}
						formatTime={formatTime}
						showChartToolTip={false}
					/>
				),
			},
			interactions: {
				label: 'Interactions',
				comp: (
					<SessionMetric
						key={'Interactions'}
						title={'Interactions'}
						loading={info?.loading}
						labelsData={smartFileActivity?.interaction}
						labelItemsData={smartFileActivity?.interaction?.reduce((acc, item) => {
							return acc.concat(item?.interactions);
						}, [])}
						formatTime={formatTime}
						showChartToolTip={false}
					/>
				),
			},
		};
	}, [viewersList, smartFileInfo, info?.smartFileInfoLoading, info?.listLoading]);
	const handleTabChange = (tab) => {
		setInfo((prev) => ({ ...prev, activeTab: tab }));
	};

	return (
		<div className="DocsActivityParentContainer">
			<div className="activityInsightsContainer">
				<div className="insightsCard">
					<div className="title">Total No. of Views</div>
					<div className="details">
						<EyeSvg />
						<span className="value">
							{info?.loading ? (
								// <Spinner width="20px" height="20px" />
								<span>Loading...</span>
							) : (
								smartFileActivity?.totalViews || 0
							)}
						</span>
					</div>
				</div>

				<div className="insightsCard">
					<div className="title">Average time spent</div>
					<div className="details">
						<ClockSvg />
						<span className="value">
							{info?.loading ? (
								// <Spinner width="20px" height="20px" />
								<span>Loading...</span>
							) : (
								formatTime(smartFileActivity?.averageTimeSpent || 0) || 0
							)}
						</span>
					</div>
				</div>

				<div className="insightsCard">
					<div className="title">Interactions</div>
					<div className="details">
						<HandTapSvg />
						<span className="value">
							{info?.loading ? (
								// <Spinner width="20px" height="20px" />
								<span>Loading...</span>
							) : (
								smartFileActivity?.totalInteractions || 0
							)}
						</span>
					</div>
				</div>
			</div>

			<div className="tabsPreviewContainer">
				<div className="activityTabsContainer">
					{Object?.keys(tabs)?.map((tab) => (
						<div
							key={tab}
							className={`tab ${info?.activeTab === tab ? 'active' : ''}`}
							onClick={() => handleTabChange(tab)}
						>
							{tabs?.[tab]?.label}
						</div>
					))}
				</div>
				<div className="activityTabView">{tabs[info?.activeTab]?.comp || ''}</div>
			</div>
		</div>
	);
};

export default documentAnalytics;
