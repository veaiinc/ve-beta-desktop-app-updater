import React, { memo, useState, useCallback, useMemo, useContext, useEffect } from 'react';
import '../../../assets/scss/sales/activity/activitySessionModal.scss';
import { ReactComponent as CloseSvg } from '../../../assets/svg/activity/close.svg';
import { ReactComponent as ActivitySvg } from '../../../assets/svg/activity/activity.svg';
import { ReactComponent as LinkedinSvg } from '../../../assets/svg/activity/linkedin.svg';
import { ReactComponent as DownSvg } from '../../../assets/svg/activity/down.svg';
import { ReactComponent as RightSvg } from '../../../assets/svg/activity/right.svg';
import { ReactComponent as LeftSvg } from '../../../assets/svg/activity/left.svg';
import { ReactComponent as CalendarSvg } from '../../../assets/svg/activity/calendar.svg';
import { ReactComponent as DurationSvg } from '../../../assets/svg/activity/duration.svg';
import { ReactComponent as LocationSvg } from '../../../assets/svg/activity/location.svg';
import { ReactComponent as PhoneSvg } from '../../../assets/svg/activity/phone.svg';
import { ReactComponent as WebSvg } from '../../../assets/svg/activity/web.svg';
import { Drawer } from 'antd';
import { useParams } from 'react-router-dom';
import Context from '../../../context/context';
// import TimeLineSession from './TimeLineSession.jsx';
// import ChatSession from './ChatSession.jsx';
import SessionMetric from './SessionMetric.jsx';
import Skeleton from 'react-loading-skeleton';
import moment from 'moment';

const SessionActivityModal = ({
	modalIsOpen,
	showDrawer,
	selectedViewer,
	formatTime,
	workflowData,
}) => {
	const { workflowId } = useParams();

	const {
		activityInfo: { getViewersSessionDetails, viewerSessionDetails },
	} = useContext(Context);

	const [info, setInfo] = useState({
		viewMore: false,
		isLoading: false,
		// isSessionTabActive: 'TimeLine',
		isSessionTabActive: 'TimeSpent',
		currentSessionIndex: 0,
		sessionIds: selectedViewer?.sessionIds || [],
		totalSessions: (selectedViewer?.sessionIds || []).length,
		currentSessionId: selectedViewer?.sessionIds[0] || null,
	});

	useEffect(() => {
		if (selectedViewer) {
			setInfo((prev) => ({
				...prev,
				sessionIds: selectedViewer?.sessionIds || [],
				totalSessions: (selectedViewer?.sessionIds || []).length,
				currentSessionId: selectedViewer?.sessionIds[0] || null,
			}));
		}
	}, [selectedViewer]);

	useEffect(() => {
		if (info?.currentSessionId) {
			fetchViewersSessionDetails();
		}
	}, [info?.currentSessionId, selectedViewer]);

	//API call getSessionSummary ===>
	const fetchViewersSessionDetails = useCallback(async () => {
		if (
			info?.currentSessionId &&
			(!viewerSessionDetails || viewerSessionDetails?._id !== info?.currentSessionId)
		) {
			setInfo((prevInfo) => ({ ...prevInfo, isLoading: true }));
			await getViewersSessionDetails({
				workflowId: workflowId || workflowData?._id,
				getSessionSummaryId: info?.currentSessionId,
			});
			setInfo((prevInfo) => ({ ...prevInfo, isLoading: false }));
		}
	}, [info?.currentSessionId, workflowId, workflowData]);

	//Handle Session Next Session ===>
	const handleNextSession = () => {
		setInfo((prevState) => {
			const newIndex = Math.min(prevState.currentSessionIndex + 1, info?.totalSessions - 1);
			return {
				...prevState,
				currentSessionIndex: newIndex,
				currentSessionId: prevState.sessionIds[newIndex],
			};
		});
	};

	//Handle Session Prev Session ===>
	const handlePrevSession = () => {
		setInfo((prevState) => {
			const newIndex = Math.max(prevState.currentSessionIndex - 1, 0);
			return {
				...prevState,
				currentSessionIndex: newIndex,
				currentSessionId: prevState.sessionIds[newIndex],
			};
		});
	};

	const handleViewMore = useCallback(() => {
		setInfo((prevInfo) => ({
			...prevInfo,
			viewMore: !prevInfo.viewMore,
		}));
	}, []);

	const setActiveTab = (tabName) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			isSessionTabActive: tabName,
		}));
	};

	const formatDate = (epochTimestamp) => {
		return moment.unix(epochTimestamp).format('D MMM YYYY, h:mm a');
	};

	//miliseconds for viewers duration ===>
	const formatTimeMiliSec = useCallback((milliseconds) => {
		const duration = moment.duration(milliseconds / 1000, 'seconds');
		const hours = String(duration.hours()).padStart(2, '0');
		const minutes = String(duration.minutes()).padStart(2, '0');
		const secs = String(duration.seconds()).padStart(2, '0');
		const millisecs = String(milliseconds % 1000).padStart(1, '0');
		return `${hours}:${minutes}:${secs}.${millisecs}`;
	}, []);

	const componentMapper = useMemo(() => {
		return {
			// TimeLine: <TimeLineSession />,

			TimeSpent: (
				<SessionMetric
					key={'Time Spent'}
					title={'Time Spent'}
					loading={info?.isLoading}
					labelsData={viewerSessionDetails?.moduleViewDuration || []}
					labelItemsData={viewerSessionDetails?.sectionViewDuration || []}
					formatTime={formatTime}
				/>
			),

			Interaction: (
				<SessionMetric
					key={'Interactions'}
					title={'Interactions'}
					loading={info?.isLoading}
					labelsData={viewerSessionDetails?.interaction}
					labelItemsData={viewerSessionDetails?.interaction?.reduce((acc, item) => {
						return acc.concat(item.interactions); //reducing the "interactionsssss" array for sending each "interaction" array data
					}, [])}
					formatTime={formatTime}
				/>
			),

			// AIChat: <ChatSession />,
			// Add more tabs if needed
		};
	}, [info?.isLoading, viewerSessionDetails]);

	// Render selected tab component
	const renderActiveTab = useMemo(() => {
		return (activeTab) => {
			return componentMapper[activeTab] || null;
		};
	}, [componentMapper]);

	return (
		<Drawer
			onClose={showDrawer}
			open={modalIsOpen}
			width={480}
			style={{ padding: '0px', backgroundColor: 'transparent' }}
			headerStyle={{ display: 'none' }}
			bodyStyle={{ padding: '0px' }}
		>
			<div className="activitySidePanel">
				<div className="innerContainer">
					{!viewerSessionDetails || viewerSessionDetails.length === 0 ? (
						Array.from({ length: 9 }).map((ele, index) => (
							<div className="spinnerWrapper" key={index}>
								<Skeleton
									width={'418px'}
									height={'59px'}
									style={{ borderRadius: '16px' }}
									key={index}
								/>
							</div>
						))
					) : (
						<>
							<div className="headParentContianer">
								<div className="headContainer">
									<div className="headerInfo">
										<div className="logoContainer">
											<ActivitySvg />
											<span className="logoText">Session Activity</span>
										</div>
										<span
											className="headerTitle"
											style={{ textTransform: 'capitalize' }}
										>
											{workflowData?.name || workflowData?.title || ''} -
											Smart File
										</span>
									</div>
									<div className="closeBtn" onClick={showDrawer}>
										<CloseSvg />
									</div>
								</div>
							</div>

							<div className="profileCardContainer">
								{/* <!-- User Information Section --> */}
								<div className="profileInfoContainer">
									<div className="profileAvatar">
										{selectedViewer?.isAnonymus ? (
											<span className="viewerName">A</span>
										) : (
											selectedViewer?.name
												?.split(' ')
												.map((word) => word[0])
												.join('')
												.toUpperCase() || null
										)}
									</div>
									<div className="profileDetailsWrapper">
										<div className="profileTitle">
											<span className="titleName">
												{selectedViewer?.isAnonymus ? (
													<span>Anonymous</span>
												) : (
													<span>
														{selectedViewer?.name || 'Anonymous'}
													</span>
												)}
											</span>
											<a
												href={`https://www.linkedin.com/search/results/all?keywords=${selectedViewer?.name}`}
												target="_blank"
												rel="noopener noreferrer"
												className="titleIconLink"
											>
												<span className="titleIcon">
													<LinkedinSvg />
												</span>
											</a>
										</div>
										<div className="profileDescription">
											{/* <p>
												Digital Marketing Strategist | Growth Hacker |
												Storyteller
											</p> */}
											<p>{selectedViewer?.email || 'anonymous@domain.com'}</p>
										</div>
									</div>
								</div>

								{/* <!-- Session Navigation Section --> */}
								<div className="sessionParentContainer">
									<div className="sessionNavWrapper">
										<div className="sessionNavigationContainer">
											<LeftSvg onClick={handlePrevSession} />
											<span>
												Session {info.currentSessionIndex + 1}/
												{info?.totalSessions}
											</span>
											<RightSvg onClick={handleNextSession} />
										</div>

										{/* View More  */}
										<div className="viewMoreButton" onClick={handleViewMore}>
											<span className="textContainer">
												{info?.viewMore ? 'View Less' : 'View More'}
											</span>
											<span
												className={`viewMoreSvg ${
													info?.viewMore ? 'rotated' : ''
												}`}
											>
												<DownSvg />
											</span>
										</div>
									</div>

									{info?.viewMore ? (
										<div className="sessionInfoWrapper">
											<div className="sessionInfoLabel">
												<div className="labelKey">Session Time</div>
												<div className="labelValue">
													<CalendarSvg />
													<span className="labelDescription">
														{formatDate(
															viewerSessionDetails?.createdAt,
														)}
													</span>
													-
													<span className="labelDescription">
														{formatDate(
															viewerSessionDetails?.updatedAt,
														)}
													</span>
												</div>
											</div>
											<div className="sessionInfoLabel">
												<div className="labelKey">Duration</div>
												<div className="labelValue">
													<DurationSvg />
													<spna className="labelDescription">
														{formatTimeMiliSec(
															viewerSessionDetails?.duration,
														)}
													</spna>
												</div>
											</div>
											<div className="sessionInfoLabel">
												<div className="labelKey">Location</div>
												<div className="labelValue">
													<LocationSvg />
													<spna className="labelDescription">
														{
															viewerSessionDetails?.clientDetails
																?.location
														}
													</spna>
												</div>
											</div>
											<div className="sessionInfoLabel">
												<div className="labelKey">Device</div>
												<div className="labelValue">
													<PhoneSvg />
													<spna className="labelDescription">
														{viewerSessionDetails?.clientDetails?.device
															? `${
																	JSON.parse(
																		viewerSessionDetails
																			.clientDetails.device,
																	).vendor
															  } ${
																	JSON.parse(
																		viewerSessionDetails
																			.clientDetails.device,
																	).model
															  }`
															: ''}
													</spna>
												</div>
											</div>
											<div className="sessionInfoLabel">
												<div className="labelKey">IP Address</div>
												<div className="labelValue">
													<WebSvg />
													<spna className="labelDescription">
														{viewerSessionDetails?.clientDetails?.ip}
													</spna>
												</div>
											</div>
										</div>
									) : (
										''
									)}
								</div>
							</div>

							<div className="sessionActivityParentContainer">
								{/* NavBar Container  */}
								<div className="sessionNavbar">
									{/* <div
										className={`sessionTab ${
											info.isSessionTabActive === 'TimeLine'
												? 'sessionTabActive'
												: ''
										}`}
										onClick={() => setActiveTab('TimeLine')}
									>
										Time Line
									</div> */}
									<div
										className={`sessionTab ${
											info.isSessionTabActive === 'TimeSpent'
												? 'sessionTabActive'
												: ''
										}`}
										onClick={() => setActiveTab('TimeSpent')}
									>
										Time Spent
									</div>
									<div
										className={`sessionTab ${
											info.isSessionTabActive === 'Interaction'
												? 'sessionTabActive'
												: ''
										}`}
										onClick={() => setActiveTab('Interaction')}
									>
										Interaction
									</div>
									{/* <div
										className={`sessionTab ${
											info.isSessionTabActive === 'AIChat'
												? 'sessionTabActive'
												: ''
										}`}
										onClick={() => setActiveTab('AIChat')}
									>
										AI Chat
									</div> */}
								</div>

								{renderActiveTab(info?.isSessionTabActive)}
							</div>
						</>
					)}
				</div>
			</div>
		</Drawer>
	);
};

export default memo(SessionActivityModal);
