import React, { useState, useContext, useEffect } from 'react';
import { Drawer } from 'antd';
import './meetBot.scss';
import { ReactComponent as Clock } from '../../../assets/svg/activity/clock.svg';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/loaders/Spinner';
import EmptyMeetBotList from './emptyMeetBotList';
import InfiniteScroll from '../../components/globalComponents/InfiniteScroll';

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
		meetingUrl: '',
		selectedMode: 'meeting_bot',
		meetingsByDate: {},
		creating: false,
		loadingMeetings: false,
		hasMore: true, // For infinite scroll
		totalMeetings: 0, // Track total meetings count
	});

	const fetchMeetings = async () => {
		setInfo((prev) => ({ ...prev, loadingMeetings: true }));
		const response = await getExistingBots({
			input: {
				limit: info.limit,
				page: info.page,
			},
		});
		const bots = response?.[1]?.data?.listTranscriptionPages?.data || [];
		const totalCount = response?.[1]?.data?.listTranscriptionPages?.count || 0;

		// Check if we have more data to load
		const hasMore = info.page * info.limit < totalCount;

		// Group the new bots by date
		const grouped = { ...info.meetingsByDate };
		bots.forEach((bot) => {
			const dateStr = formatDate(bot.createdAt);
			if (!grouped[dateStr]) grouped[dateStr] = [];
			grouped[dateStr].push(bot);
		});

		setInfo((prev) => ({
			...prev,
			meetingsByDate: grouped,
			loadingMeetings: false,
			hasMore: hasMore,
			totalMeetings: totalCount,
		}));
	};

	// Function to load more meetings when scrolling
	const loadMoreMeetings = () => {
		if (info.loadingMeetings || !info.hasMore) return;

		setInfo((prev) => ({
			...prev,
			page: prev.page + 1,
		}));
	};

	// Effect to fetch meetings when page changes
	useEffect(() => {
		fetchMeetings();
	}, [info.page]);

	// Initial load
	useEffect(() => {
		// Reset page to 1 and clear meetings when component mounts
		setInfo((prev) => ({
			...prev,
			page: 1,
			meetingsByDate: {},
			hasMore: true,
		}));
	}, []);

	const handleCreateMeet = async () => {
		let input = {
			title:
				info.selectedMode === 'meeting_bot'
					? 'test page with recall'
					: 'Start a Note Taker',
			transcriptionSource: info.selectedMode,
		};
		if (info.selectedMode === 'meeting_bot') {
			if (!isValidUrl(info.meetingUrl)) return;
			input.meetingLink = info.meetingUrl;
		}
		setInfo((prev) => ({ ...prev, creating: true }));
		try {
			const response = await createMeetBot({ input });
			setInfo((prev) => ({ ...prev, meetingUrl: '' }));
			await fetchMeetings();
			const pageId = response?.[1]?.data?.startTranscription?.data?.pageId;
			const type = response?.[1]?.data?.startTranscription?.data?.transcriptionSource;
			const success = response?.[1]?.data?.startTranscription?.success;
			if (success && pageId && type) {
				navigate(`/meet/${pageId}?type=${type}`);
			}
		} finally {
			setInfo((prev) => ({ ...prev, creating: false }));
		}
	};

	const handleInputKeyDown = (e) => {
		if (
			info.selectedMode === 'meeting_bot' &&
			e.key === 'Enter' &&
			isValidUrl(info.meetingUrl) &&
			!info.creating
		) {
			handleCreateMeet();
		}
		if (info.selectedMode === 'desktop' && e.key === 'Enter' && !info.creating) {
			handleCreateMeet();
		}
	};

	return (
		<div className="meetbot">
			<div className="leftContainer">
				<div className="listContainer" id="meetbot-list-container">
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
						{/* Meetings list with infinite scroll */}
						<InfiniteScroll
							dataLength={Object.values(info.meetingsByDate).flat().length}
							next={loadMoreMeetings}
							hasMore={info.hasMore}
							loader={
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										padding: '20px 0',
									}}
								>
									<Spinner
										width="32px"
										height="32px"
										color="var(--primary-button)"
										borderTopColor="var(--background-color)"
									/>
								</div>
							}
							endMessage={
								<div
									style={{
										textAlign: 'center',
										padding: '20px 0',
										color: 'var(--secondary-font)',
									}}
								>
									No more meetings to load
								</div>
							}
							scrollableTarget="meetbot-list-container"
						>
							{info.loadingMeetings && info.page === 1 ? (
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										minHeight: 200,
									}}
								>
									<Spinner
										width="32px"
										height="32px"
										color="var(--primary-button)"
										borderTopColor="var(--background-color)"
									/>
								</div>
							) : Object.keys(info.meetingsByDate).length === 0 ? (
								<div className="empty-meet-bot-list">
									<EmptyMeetBotList />
								</div>
							) : (
								Object.keys(info.meetingsByDate).map((date) => (
									<React.Fragment key={date}>
										<div className="listSection">
											<div className="listSectionTitle">{date}</div>
											{!info.meetingsByDate[date].length ? (
												<div className="empty-meet-bot-list">
													<EmptyMeetBotList />
												</div>
											) : (
												info.meetingsByDate[date].map((meeting) => (
													<div
														className="meetingCard"
														onClick={() =>
															navigate(`/meet/${meeting._id}`)
														}
														key={meeting._id}
													>
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
															<div className="meetingTitle">
																{meeting.title}
															</div>
															<div className="meetingMeta">
																{meeting.createdBy?.name || ''}
															</div>
														</div>
													</div>
												))
											)}
										</div>
									</React.Fragment>
								))
							)}
						</InfiniteScroll>
					</div>
				</div>
			</div>
			<div className="rightContainer" style={{ width: info.drawerOpen ? `400px` : `0px` }}>
				<Drawer
					open={info.drawerOpen}
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
					<SidebarClosingSvg
						className="sidebarClosingSvg"
						onClick={() => setInfo({ ...info, drawerOpen: false })}
					/>
					<div className="meetbot__drawer-tabs">
						<button
							className={`meetbot__drawer-tab${
								info.selectedMode === 'meeting_bot'
									? ' meetbot__drawer-tab--active'
									: ''
							}`}
							onClick={() =>
								setInfo((prev) => ({ ...prev, selectedMode: 'meeting_bot' }))
							}
						>
							Video
						</button>
						<button
							className={`meetbot__drawer-tab${
								info.selectedMode === 'desktop'
									? ' meetbot__drawer-tab--active'
									: ''
							}`}
							onClick={() =>
								setInfo((prev) => ({ ...prev, selectedMode: 'desktop' }))
							}
						>
							Audio
						</button>
					</div>
					<div className="meetbot__drawer-content">
						<div className="meetbot__drawer-label">
							{info.selectedMode === 'meeting_bot'
								? 'Record a live meeting'
								: 'Start a Note Taker'}
						</div>
						<div className="meetbot__drawer-desc">
							{info.selectedMode === 'meeting_bot'
								? 'Works with Zoom, Google meet, or Microsoft Teams'
								: 'Record audio directly from your desktop'}
						</div>
						{info.selectedMode === 'meeting_bot' && (
							<div className="meetbot__drawer-input-wrapper">
								<input
									className="meetbot__drawer-input"
									placeholder="Paste meeting URL"
									value={info.meetingUrl}
									onChange={(e) =>
										setInfo((prev) => ({ ...prev, meetingUrl: e.target.value }))
									}
									onKeyDown={handleInputKeyDown}
									disabled={info.creating}
								/>
								{info.meetingUrl &&
									isValidUrl(info.meetingUrl) &&
									!info.creating && (
										<span
											className="meetbot__drawer-tick"
											onClick={handleCreateMeet}
											title="Create meeting"
										>
											&#10003;
										</span>
									)}
								{info.creating && (
									<span className="meetbot__drawer-loader">...</span>
								)}
							</div>
						)}
						{info.selectedMode === 'desktop' && (
							<div className="meetbot__audio-btn-wrapper">
								<button
									disabled={info.creating}
									onClick={handleCreateMeet}
									className={`meetbot__audio-btn${
										info.creating ? ' meetbot__audio-btn--disabled' : ''
									}`}
								>
									{info.creating ? 'Starting...' : 'Start Note Taker'}
								</button>
							</div>
						)}
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
