import React, { memo, useState, useCallback, useMemo } from 'react';
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
import TimeLineSession from './TimeLineSession.jsx';
import ChatSession from './ChatSession.jsx';
import SessionMetric from './SessionMetric.jsx';

const SessionActivityModal = ({ modalIsOpen, showDrawer, selectedViewer }) => {
	const [info, setInfo] = useState({
		viewMore: false,
		isSessionTabActive: 'TimeLine',
		currentSessionIndex: 0,
	});

	const sessionIds = selectedViewer?.sessionIds || [];
	const totalSessions = sessionIds.length;

	const handleNextSession = () => {
		setInfo((prevState) => ({
			...prevState,
			currentSessionIndex: Math.min(prevState.currentSessionIndex + 1, totalSessions - 1),
		}));
	};

	const handlePrevSession = () => {
		setInfo((prevState) => ({
			...prevState,
			currentSessionIndex: Math.max(prevState.currentSessionIndex - 1, 0),
		}));
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

	const componentMapper = useMemo(() => {
		return {
			TimeLine: <TimeLineSession />,
			TimeSpent: (
				<SessionMetric
					title={'Time Spent'}
					viewerSessionId={sessionIds[info?.currentSessionIndex]}
				/>
			),
			Interaction: (
				<SessionMetric
					title={'Interactions'}
					viewerSessionId={sessionIds[info?.currentSessionIndex]}
				/>
			),
			AIChat: <ChatSession />,
			// Add more tabs if needed
		};
	}, [info?.currentSessionIndex, sessionIds]);

	// Function to render selected tab component
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
										Session {info.currentSessionIndex + 1}/{totalSessions}
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
											<spna className="labelDescription">
												16 Sept 2024, 4:23PM - 23 Sept 2024, 6:23PM
											</spna>
										</div>
									</div>
									<div className="sessionInfoLabel">
										<div className="labelKey">Delivery</div>
										<div className="labelValue">
											<DurationSvg />
											<spna className="labelDescription">00:32:23</spna>
										</div>
									</div>
									<div className="sessionInfoLabel">
										<div className="labelKey">Location</div>
										<div className="labelValue">
											<LocationSvg />
											<spna className="labelDescription">Hyderabad</spna>
										</div>
									</div>
									<div className="sessionInfoLabel">
										<div className="labelKey">Device</div>
										<div className="labelValue">
											<PhoneSvg />
											<spna className="labelDescription">Apple 16 pro</spna>
										</div>
									</div>
									<div className="sessionInfoLabel">
										<div className="labelKey">IP Address</div>
										<div className="labelValue">
											<WebSvg />
											<spna className="labelDescription">172.32.67.567</spna>
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

						{/* {info?.isSessionTabActive === 'Time Line' ? <TimeLineSession /> : ''}

						{info?.isSessionTabActive === 'Time Spent' ? <SessionMetric /> : ''}

						{info?.isSessionTabActive === 'Interaction' ? <SessionMetric /> : ''}

						{info?.isSessionTabActive === 'AI Chat' ? <ChatSession /> : ''} */}

						{renderActiveTab(info?.isSessionTabActive)}
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(SessionActivityModal);
