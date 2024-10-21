import React, { memo, useState, useCallback } from 'react';
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
import TimeSpentSession from './TimeSpentSession.jsx';
import InteractionSession from './InteractionSession.jsx';

const SessionActivityModal = ({ modalIsOpen, showDrawer }) => {
	const [info, setInfo] = useState({
		viewMore: false,
		textTransition: false,
		isSessionTabActive: 'Time Line',
	});

	const handleViewMore = useCallback(() => {
		// Start the text exit transition
		setInfo((prevInfo) => ({
			...prevInfo,
			textTransition: true,
		}));

		// Switch the text after the exit animation completes
		setTimeout(() => {
			setInfo((prevInfo) => ({
				...prevInfo,
				viewMore: !prevInfo.viewMore,
				textTransition: false,
			}));
		}, 100);
	}, []);

	const setActiveTab = (tabName) => {
		setInfo((prevInfo) => ({
			...prevInfo,
			isSessionTabActive: tabName,
		}));
	};

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

					<div class="profileCardContainer">
						{/* <!-- User Information Section --> */}
						<div class="profileInfoContainer">
							<div class="profileAvatar">JS</div>
							<div class="profileDetailsWrapper">
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
							<div class="sessionNavWrapper">
								<div className="sessionNavigationContainer">
									<LeftSvg />
									<span>Session 2/5</span>
									<RightSvg />
								</div>

								{/* View More  */}
								<div className="viewMoreButton" onClick={handleViewMore}>
									<span
										// className={`textContainer ${
										// 	info?.textTransition
										// 		? 'textContainerExit'
										// 		: 'textContainerEnter'
										// }`}
										className="textContainer"
									>
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
									info.isSessionTabActive === 'Time Line'
										? 'sessionTabActive'
										: ''
								}`}
								onClick={() => setActiveTab('Time Line')}
							>
								Time Line
							</div>
							<div
								className={`sessionTab ${
									info.isSessionTabActive === 'Time Spent'
										? 'sessionTabActive'
										: ''
								}`}
								onClick={() => setActiveTab('Time Spent')}
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
									info.isSessionTabActive === 'AI Chat' ? 'sessionTabActive' : ''
								}`}
								onClick={() => setActiveTab('AI Chat')}
							>
								AI Chat
							</div>
						</div>

						{info?.isSessionTabActive === 'Time Line' ? <TimeLineSession /> : ''}

						{info?.isSessionTabActive === 'Time Spent' ? <TimeSpentSession /> : ''}

						{info?.isSessionTabActive === 'Interaction' ? <TimeSpentSession /> : ''}

						{info?.isSessionTabActive === 'AI Chat' ? <ChatSession /> : ''}
					</div>
				</div>
			</div>
		</Drawer>
	);
};

export default memo(SessionActivityModal);
