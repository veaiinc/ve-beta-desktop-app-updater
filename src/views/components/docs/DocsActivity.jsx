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

const InitialState = {
	loading: true,
	fileActivityData: null,
	fileViewerList: null,
};

const DocsActivity = ({ data }) => {
	const {
		activityInfo: {
			activityData,
			getSmartFileActivity,
			getSmartFileViewers,
			viewersList,
			resetActivityState,
		},
	} = useContext(Context);

	const [info, setInfo] = useState({
		...InitialState,
		activeTab: 'viewers',
	});

	useEffect(() => {
		fetchFileActivity();
		fetchFileViewerList();
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
		setInfo((prev) => ({
			...prev,
			loading: true,
		}));
		await getSmartFileActivity({ workflowId: data?._id });
	}, [data]);

	const fetchFileViewerList = useCallback(async () => {
		setInfo((prev) => ({
			...prev,
			loading: true,
		}));
		await getSmartFileViewers({ workflowId: data?._id });
	}, [data]);

	const tabs = useMemo(
		() => [
			// {
			// 	id: 'timeLine',
			// 	label: 'Time Line',
			// 	Component: () => <div>Time Line</div>,
			// 	// Component: () => <RequiredActions />,
			// },
			{
				id: 'viewers',
				label: 'Viewers',
				Component: () => (
					<FileViewersList loading={info?.loading} viewersList={info?.fileViewerList} />
				),
			},
			{
				id: 'timeSpent',
				label: 'Time Spent',
				Component: () => (
					<SessionMetric
						key={'Time Spent'}
						title={'Time Spent'}
						loading={info?.loading}
						labelsData={info?.fileActivityData?.moduleViewDuration}
						labelItemsData={info?.fileActivityData?.sectionViewDuration}
						formatTime={formatTime}
					/>
				),
			},
			{
				id: 'interactions',
				label: 'Interactions',
				Component: () => (
					<SessionMetric
						key={'Interactions'}
						title={'Interactions'}
						loading={info?.loading}
						labelsData={info?.fileActivityData?.interaction}
						labelItemsData={info?.fileActivityData?.interaction?.reduce((acc, item) => {
							return acc.concat(item.interactions); //reducing the "interactionsssss" array for sending each "interaction" array data
						}, [])}
						formatTime={formatTime}
					/>
				),
			},
		],
		[info?.fileViewerList, info?.loading, info?.fileActivityData],
	);

	const handleTabChange = useCallback((tabId) => {
		setInfo((prev) => ({ ...prev, activeTab: tabId }));
	}, []);

	const renderActiveComponent = useCallback(() => {
		const activeTabConfig = tabs?.find((tab) => tab?.id === info?.activeTab);
		if (!activeTabConfig) return null;

		const { Component } = activeTabConfig;
		return <Component />;
	}, [info?.activeTab, tabs]);

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
						{tabs?.map((tab) => (
							<div
								key={tab?.id}
								className={`tab ${info?.activeTab === tab?.id ? 'active' : ''}`}
								onClick={() => handleTabChange(tab?.id)}
							>
								{tab?.label}
							</div>
						))}
					</div>
					<div className="respectiveView">{renderActiveComponent() || ''}</div>
				</div>
			</div>
		</>
	);
};

export default memo(DocsActivity);
