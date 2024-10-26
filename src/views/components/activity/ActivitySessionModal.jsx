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
import TimeLineSession from './TimeLineSession.jsx';
import ChatSession from './ChatSession.jsx';
import SessionMetric from './SessionMetric.jsx';

const SessionActivityModal = ({ modalIsOpen, showDrawer, selectedViewer }) => {
	// console.log('selectedViewer======>', JSON.stringify(selectedViewer, null, 2));
	const { workflowId } = useParams();

	const {
		activityInfo: { getViewersSessionDetails, viewerSessionDetails },
	} = useContext(Context);

	console.log('viewerSessionDetails======>', JSON.stringify(viewerSessionDetails, null, 2));

	const [info, setInfo] = useState({
		viewMore: false,
		isSessionTabActive: 'TimeLine',
		currentSessionIndex: 0,
		sessionIds: selectedViewer?.sessionIds || [],
		totalSessions: (selectedViewer?.sessionIds || []).length,
		currentSessionId: selectedViewer?.sessionIds[0] || null,
	});

	//API call getSessionSummary ===>
	const fetchViewersSessionDetails = useCallback(() => {
		if (
			info.currentSessionId &&
			(!viewerSessionDetails || viewerSessionDetails?._id !== info.currentSessionId)
		) {
			console.log('Calling getSessionSummary====>');
			getViewersSessionDetails({ workflowId, getSessionSummaryId: info.currentSessionId });
		}
	}, [getViewersSessionDetails, viewerSessionDetails, info.currentSessionId, workflowId]);

	useEffect(() => {
		if (info.currentSessionId) {
			console.log('Calling UseEffect====>');
			fetchViewersSessionDetails();
		}
	}, [fetchViewersSessionDetails, info.currentSessionId]);

	//Handle Session Next Session ===>
	const handleNextSession = () => {
		setInfo((prevState) => {
			const newIndex = Math.min(prevState.currentSessionIndex + 1, info?.totalSessions - 1);
			return {
				...prevState,
				currentSessionIndex: newIndex,
				currentSessionId: prevState.sessionIds[newIndex], // Update currentSessionId
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

	const convertSecondsToFormattedDate = (seconds) => {
		const date = new Date(seconds * 1000);
		const options = {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		};
		return date.toLocaleString('en-GB', options);
	};

	const durationFormater = (duration) => {
		const hours = String(Math.floor(duration / 3600)).padStart(2, '0');
		const minutes = String(Math.floor((duration % 3600) / 60)).padStart(2, '0');
		const seconds = String(duration % 60).padStart(2, '0');

		return `${hours}:${minutes}:${seconds}`;
	};

	const componentMapper = useMemo(() => {
		return {
			TimeLine: <TimeLineSession />,
			TimeSpent: (
				<SessionMetric title={'Time Spent'} labelsData={true} labelItemsData={true} />
			),
			Interaction: (
				<SessionMetric title={'Interactions'} labelsData={true} labelItemsData={true} />
			),
			AIChat: <ChatSession />,
			// Add more tabs if needed
		};
	}, [info?.currentSessionIndex, info?.sessionIds]);

	// Render selected tab component
	const renderActiveTab = useMemo(() => {
		return (activeTab) => {
			// console.log('renderActiveTab with activeTab:', activeTab);
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
					<div className="headParentContianer">
						<div className="headContainer">
							<div className="headerInfo">
								<div className="logoContainer">
									<ActivitySvg />
									<span className="logoText">Session Activity</span>
								</div>
								<span className="headerTitle">James Stark - Smart File</span>
							</div>
							<div className="closeBtn" onClick={showDrawer}>
								<CloseSvg />
							</div>
						</div>
					</div>

					<div className="profileCardContainer">
						{/* <!-- User Information Section --> */}
						<div className="profileInfoContainer">
							<div className="profileAvatar">JS</div>
							<div className="profileDetailsWrapper">
								<div className="profileTitle">
									<span className="titleName">Jhon Michael</span>
									<span className="titleIcon">
										<LinkedinSvg />
									</span>
								</div>
								<div className="profileDescription">
									<p>
										Digital Marketing Strategist | Growth Hacker | Storyteller
									</p>
									<p>johnmichael@gmail.com</p>
								</div>
							</div>
						</div>

						{/* <!-- Session Navigation Section --> */}
						<div className="sessionParentContainer">
							<div className="sessionNavWrapper">
								<div className="sessionNavigationContainer">
									<LeftSvg onClick={handlePrevSession} />
									<span>
										Session {info.currentSessionIndex + 1}/{info?.totalSessions}
									</span>
									<RightSvg onClick={handleNextSession} />
								</div>

								{/* View More  */}
								<div className="viewMoreButton" onClick={handleViewMore}>
									<span className="textContainer">
										{info?.viewMore ? 'View Less' : 'View More'}
									</span>
									<span
										className={`viewMoreSvg ${info?.viewMore ? 'rotated' : ''}`}
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
												{convertSecondsToFormattedDate(
													viewerSessionDetails?.createdAt,
												)}
											</span>
											-
											<span className="labelDescription">
												{convertSecondsToFormattedDate(
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
												{durationFormater(viewerSessionDetails?.duration)}
											</spna>
										</div>
									</div>
									<div className="sessionInfoLabel">
										<div className="labelKey">Location</div>
										<div className="labelValue">
											<LocationSvg />
											<spna className="labelDescription">
												{viewerSessionDetails?.clientDetails?.location}
											</spna>
										</div>
									</div>
									<div className="sessionInfoLabel">
										<div className="labelKey">Device</div>
										<div className="labelValue">
											<PhoneSvg />
											<spna className="labelDescription">
												{viewerSessionDetails?.clientDetails?.device}
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
							<div
								className={`sessionTab ${
									info.isSessionTabActive === 'TimeLine' ? 'sessionTabActive' : ''
								}`}
								onClick={() => setActiveTab('TimeLine')}
							>
								Time Line
							</div>
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
							<div
								className={`sessionTab ${
									info.isSessionTabActive === 'AIChat' ? 'sessionTabActive' : ''
								}`}
								onClick={() => setActiveTab('AIChat')}
							>
								AI Chat
							</div>
						</div>

						{renderActiveTab(info?.isSessionTabActive)}
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(SessionActivityModal);
