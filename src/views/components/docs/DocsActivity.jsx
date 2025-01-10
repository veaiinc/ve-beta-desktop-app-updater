import React, { memo, useCallback, useState, useEffect, useMemo, useContext } from 'react';
import '../../../assets/scss/docs/docsActivity.scss';
import '../../../assets/scss/sales/activity/activityComponents.scss';
import { ReactComponent as ClockSvg } from '../../../assets/svg/activity/clock.svg';
import { ReactComponent as HandTapSvg } from '../../../assets/svg/activity/handTap.svg';
import { ReactComponent as EyeSvg } from '../../../assets/svg/activity/eye.svg';
import FileViewersList from './FileViewersList.jsx';
import SessionMetric from '../activity/SessionMetric.jsx';
import Context from '../../../context/context.js';
import Spinner from '../loaders/Spinner.jsx';
import moment from 'moment';

export const formatTime = (milliseconds) => {
	const duration = moment.duration(milliseconds / 1000, 'seconds');
	const hours = String(duration.hours()).padStart(2, '0');
	const minutes = String(duration.minutes()).padStart(2, '0');
	const secs = String(duration.seconds()).padStart(2, '0');
	return `${hours}:${minutes}:${secs}`;
};

const initialState = {
	loading: true,
	fileActivityData: null,
	fileViewerList: null,
};

const DocsActivity = ({ data }) => {
	const {
		activityInfo: { activityData, getSmartFileActivity, getSmartFileViewers, viewersList },
	} = useContext(Context);

	const [info, setInfo] = useState({
		...initialState,
		activeTab: 'viewers', //timeLine, viewers, timeSpent, interactions
	});

	useEffect(() => {
		if (data) {
			fetchFileActivity();
			fetchFileViewerList();
		}
	}, [data]);

	useEffect(() => {
		if (activityData) {
			setInfo((prev) => ({
				...prev,
				fileActivityData: activityData,
				loading: false,
			}));
		}
	}, [activityData]);

	useEffect(() => {
		if (viewersList) {
			setInfo((prev) => ({
				...prev,
				fileViewerList: viewersList,
				loading: false,
			}));
		}
	}, [viewersList]);

	const fetchFileActivity = useCallback(async () => {
		getSmartFileActivity({ workflowId: data?._id });
	}, [data]);

	const fetchFileViewerList = useCallback(async () => {
		getSmartFileViewers({ workflowId: data?._id });
	}, [data]);

	const tabs = useMemo(() => {
		return {
			viewers: {
				label: 'Viewers',
				comp: (
					<FileViewersList
						loading={info?.loading}
						viewersList={info?.fileViewerList}
						fileData={data}
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
						labelsData={info?.fileActivityData?.moduleViewDuration}
						labelItemsData={info?.fileActivityData?.sectionViewDuration}
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
						labelsData={info?.fileActivityData?.interaction}
						labelItemsData={info?.fileActivityData?.interaction?.reduce((acc, item) => {
							return acc.concat(item?.interactions); //reducing the "interactionsssss" array for sending each "interaction" array data
						}, [])}
						formatTime={formatTime}
						showChartToolTip={false}
					/>
				),
			},

			// timeLine: '',
		};
	}, [info?.fileViewerList, info?.loading, info?.fileActivityData]);

	const handleTabChange = useCallback(
		(tab) => {
			if (tab === info?.activeTab) return;
			setInfo((prev) => ({ ...prev, activeTab: tab }));
		},
		[info?.activeTab],
	);

	return (
		<>
			<div className="DocsActivityParentContainer">
				<div className="activityInsightsContainer">
					<div className="insightsCard">
						<div className="title">Total No. of Views</div>
						<div className="details">
							<EyeSvg />
							<span className="value">
								{info?.loading ? (
									<Spinner width="20px" height="20px" />
								) : (
									info?.fileActivityData?.totalViews || 0
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
									<Spinner width="20px" height="20px" />
								) : (
									formatTime(info?.fileActivityData?.averageTimeSpent || 0) || 0
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
									<Spinner width="20px" height="20px" />
								) : (
									info?.fileActivityData?.totalInteractions || 0
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
		</>
	);
};

export default memo(DocsActivity);
