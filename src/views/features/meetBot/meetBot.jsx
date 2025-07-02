import React, { useState, useContext, useEffect } from 'react';
import { Drawer } from 'antd';
import './meetBot.scss';
import { ReactComponent as Clock } from '../../../assets/svg/activity/clock.svg';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';

function formatDate(timestamp) {
	const date = new Date(Number(timestamp) * 1000);
	return date.toLocaleDateString(undefined, {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

function isValidUrl(url) {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}

const MeetBot = () => {
	const {
		notes: { getExistingBots, createMeetBot },
	} = useContext(Context);
	const navigate = useNavigate();

	const [info, setInfo] = useState({
		limit: 10,
		page: 1,
		drawerOpen: true,
	});
	const [meetingsByDate, setMeetingsByDate] = useState({});
	const [meetingUrl, setMeetingUrl] = useState('');
	const [creating, setCreating] = useState(false);

	const fetchMeetings = async () => {
		const response = await getExistingBots({
			input: {
				limit: info.limit,
				page: info.page,
			},
		});
		const bots = response?.[1]?.data?.listTranscriptionPages?.data || [];
		const grouped = {};
		bots.forEach((bot) => {
			const dateStr = formatDate(bot.createdAt);
			if (!grouped[dateStr]) grouped[dateStr] = [];
			grouped[dateStr].push(bot);
		});
		setMeetingsByDate(grouped);
	};

	useEffect(() => {
		fetchMeetings();
	}, []);

	const handleCreateMeet = async () => {
		if (!isValidUrl(meetingUrl)) return;
		setCreating(true);
		try {
			const response = await createMeetBot({
				meetingLink: meetingUrl,
				title: 'test page with recall',
			});
			setMeetingUrl('');
			await fetchMeetings();
			// Navigate if success and pageId present
			const pageId = response?.[1]?.data?.startRecallBot?.data?.pageId;
			const success = response?.[1]?.data?.startRecallBot?.success;
			if (success && pageId) {
				navigate(`/note/${pageId}`);
			}
		} finally {
			setCreating(false);
		}
	};

	const handleInputKeyDown = (e) => {
		if (e.key === 'Enter' && isValidUrl(meetingUrl) && !creating) {
			handleCreateMeet();
		}
	};

	return (
		<div className="meetbot">
			<div className="leftContainer">
				<div className="left">
					{/* Upcoming meeting */}
					{/* <div className="upcomingTitle">Upcoming meeting</div>
                    <div className="upcoming">
                        {upcomingMeeting && (
                            <div className="upcomingCard">
                                <div className="upcomingTimeContainer">
                                    <span className="upcomingTime">
                                        <Clock />
                                        {upcomingMeeting.time}
                                    </span>
                                    <span className="upcomingdot"></span>
                                    <span className="upcomingUser">{upcomingMeeting.user}</span>
                                </div>
                                <div className="meetingTitle">{upcomingMeeting.title}</div>
                                <div className="upcomingDesc">{upcomingMeeting.desc}</div>
                                <button className="guideBtn">Guide me</button>
                            </div>
                        )}
                    </div>
                    <div className="listSectionTitle">{meetingDate}</div>
                    <div className="listSection">
                        {meetingList.map((meeting) => (
                            <div className="meetingCard" key={meeting.id}>
                                <div className="meetingInfo">
                                    <div className="meetingAvatar">{meeting.avatar}</div>
                                    <div className="meetingTitle">{meeting.title}</div>
                                    <div className="meetingMeta">{meeting.meta}</div>
                                    <div className="meetingDesc">{meeting.desc}</div>
                                </div>
                                <div className="meetingImg">
                                    {meeting.image ? (
                                        <img src={meeting.image} alt="meeting" className="img" />
                                    ) : (
                                        <div className="imgPlaceholder" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div> */}
					{/* Upcoming meeting (optional, can be removed if not needed) */}
					{/* <div className="upcomingTitle">Upcoming meeting</div>
                    <div className="upcoming">...</div> */}
					{/* Grouped meetings by date */}
					{Object.keys(meetingsByDate).map((date) => (
						<React.Fragment key={date}>
							<div className="listSectionTitle">{date}</div>
							<div className="listSection">
								{meetingsByDate[date].map((meeting) => (
									<div className="meetingCard" key={meeting._id}>
										<div className="meetingInfo">
											<div className="meetingAvatar">
												{meeting.coverImage ? (
													<img
														src={meeting.coverImage}
														alt="avatar"
														className="img"
													/>
												) : (
													(meeting.createdBy?.name || '')
														.trim()
														.charAt(0)
														.toUpperCase() || '?'
												)}
											</div>
											<div className="meetingTitle">{meeting.title}</div>
											<div className="meetingMeta">
												{meeting.createdBy?.name || ''}
											</div>
										</div>
									</div>
								))}
							</div>
						</React.Fragment>
					))}
				</div>
			</div>
			<div className="rightContainer">
				<Drawer
					open={info.drawerOpen}
					width={'30%'}
					placement="right"
					closable={false}
					mask={false}
					headerStyle={{ display: 'none' }}
					bodyStyle={{
						padding: 0,
						background: 'var(--background-color)',
						height: '100vh',
						overflow: 'auto',
					}}
					style={{ position: 'relative', background: 'var(--background-color)' }}
					className="meetbot__right meetbot__right--open"
					getContainer={false}
				>
					<div className="meetbot__drawer-header">
						<div className="meetbot__drawer-tabs">
							<button className="meetbot__drawer-tab meetbot__drawer-tab--active">
								Video
							</button>
						</div>
						<button
							className="meetbot__drawer-close"
							style={{
								marginLeft: 'auto',
								background: 'none',
								border: 'none',
								color: '#b3b3b3',
								fontSize: '1.5rem',
								cursor: 'pointer',
							}}
							onClick={() => setInfo({ ...info, drawerOpen: false })}
							title="Close Drawer"
						>
							&#10005;
						</button>
					</div>
					<div className="meetbot__drawer-content">
						<div className="meetbot__drawer-label">Record a live meeting</div>
						<div className="meetbot__drawer-desc">
							Works with Zoom, Google meet, or Microsoft Teams
						</div>
						<div
							style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
						>
							<input
								className="meetbot__drawer-input"
								placeholder="Paste meeting URL"
								value={meetingUrl}
								onChange={(e) => setMeetingUrl(e.target.value)}
								onKeyDown={handleInputKeyDown}
								disabled={creating}
								style={{ paddingRight: 40 }}
							/>
							{meetingUrl && isValidUrl(meetingUrl) && !creating && (
								<span
									style={{
										position: 'absolute',
										right: 12,
										cursor: 'pointer',
										color: 'var(--success, #79ecc9)',
										fontSize: 22,
									}}
									onClick={handleCreateMeet}
									title="Create meeting"
								>
									&#10003;
								</span>
							)}
							{creating && (
								<span
									style={{
										position: 'absolute',
										right: 12,
										color: 'var(--secondary-font, #94989e)',
										fontSize: 18,
									}}
								>
									...
								</span>
							)}
						</div>
					</div>
				</Drawer>
				{!info.drawerOpen && (
					<SidebarClosingSvg
						className="sidebarClosingSvg"
						onClick={() => setInfo({ ...info, drawerOpen: true })}
					/>
				)}
			</div>
		</div>
	);
};

export default MeetBot;
