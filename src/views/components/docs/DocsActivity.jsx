import React, { memo, useCallback, useState, useEffect, useMemo, useContext } from 'react';
import '../../../assets/scss/docs/docsActivity.scss';
import '../../../assets/scss/sales/activity/activityComponents.scss';
import { ReactComponent as ClockSvg } from '../../../assets/svg/activity/clock.svg';
import { ReactComponent as HandTapSvg } from '../../../assets/svg/activity/handTap.svg';
import { ReactComponent as EyeSvg } from '../../../assets/svg/activity/eye.svg';
import FileViewersList from './FileViewersList.jsx';
import SessionMetric from '../activity/SessionMetric.jsx';
import FileTimeLine from './FileTimeLine.jsx';
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
	activeTab: 'viewers', //timeLine, viewers, timeSpent, interactions
};

const DocsActivity = ({ data, fileActivityData, fileViewerList, loading }) => {
	const [info, setInfo] = useState({
		...initialState,
	});

	const tabs = useMemo(() => {
		return {
			timeLine: {
				label: 'Time Line',
				comp: <FileTimeLine data={fileActivityData} />,
			},

			viewers: {
				label: 'Viewers',
				comp: (
					<FileViewersList
						loading={loading}
						viewersList={fileViewerList}
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
						loading={loading}
						labelsData={fileActivityData?.moduleViewDuration}
						labelItemsData={fileActivityData?.sectionViewDuration}
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
						loading={loading}
						labelsData={fileActivityData?.interaction}
						labelItemsData={fileActivityData?.interaction?.reduce((acc, item) => {
							return acc.concat(item?.interactions);
						}, [])}
						formatTime={formatTime}
						showChartToolTip={false}
					/>
				),
			},
		};
	}, [fileViewerList, loading, fileActivityData, data]);

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
								{loading ? (
									<Spinner width="20px" height="20px" />
								) : (
									fileActivityData?.totalViews || 0
								)}
							</span>
						</div>
					</div>

					<div className="insightsCard">
						<div className="title">Average time spent</div>
						<div className="details">
							<ClockSvg />
							<span className="value">
								{loading ? (
									<Spinner width="20px" height="20px" />
								) : (
									formatTime(fileActivityData?.averageTimeSpent || 0) || 0
								)}
							</span>
						</div>
					</div>

					<div className="insightsCard">
						<div className="title">Interactions</div>
						<div className="details">
							<HandTapSvg />
							<span className="value">
								{loading ? (
									<Spinner width="20px" height="20px" />
								) : (
									fileActivityData?.totalInteractions || 0
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
