import React, { useState, useContext, useEffect } from 'react';
import { Drawer, Switch } from 'antd';
import './meetBot.scss';
import { ReactComponent as MicorPhoneIcon } from './micorPhoneIcon.svg';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/loaders/Spinner';
import EmptyMeetBotList from './emptyMeetBotList';
import InfiniteScroll from '../../components/globalComponents/InfiniteScroll';
import { FetchMoreLoaderComp } from '../../../helpers';
import { message } from '../../components/globalComponents/CustomToast';
import { ReactComponent as ChevronDown } from '../../../assets/svg/tasks/chevronRightThin.svg';

const drawerStyles = {
	header: { display: 'none' },
	body: { padding: 0, background: 'var(--background-color)', height: '100vh', overflow: 'auto' },
};

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

const limit = 10;
const append = true;
const infiniteScrollHeight = 'calc(100vh - 100px)';

// Meeting mode options
const meetingModeOptions = [
	{ value: 'meeting', label: 'Meeting' },
	{ value: 'sales', label: 'Sales Mode' },
	{ value: 'support', label: 'Support' },
	{ value: 'interview', label: 'Interview' },
	{ value: 'ideas', label: 'Ideas' },
];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MeetBot = () => {
	const {
		notes: { getExistingBots, createMeetBot, existingBots },
	} = useContext(Context);

	const navigate = useNavigate();

	const [info, setInfo] = useState({
		drawerOpen: true,
		meetingUrl: '',
		selectedMode: 'meeting_bot',
		creating: false,
		isAiIntelligenceEnabled: false,
		meetingMode: 'meeting',
		agenda: '',
	});

	const meetings = existingBots?.data;
	const loadingMeetings = existingBots ? false : true;
	const currentPage = existingBots?.currentPage ?? 1;
	const hasNextPage = existingBots?.hasNextPage ?? false;

	// Function to load meetings
	const loadMeetings = async (page = 1, append = false) => {
		try {
			const response = await getExistingBots({
				page,
				limit,
				append,
			});
			const success = response[0];
			if (!success) {
				const errMsg = response[1].message;
				message.error(errMsg || 'Oops! Unable to fetch existing bots!');
			}
		} catch (error) {
			setInfo((prev) => ({ ...prev, loadingMeetings: false }));
		}
	};

	// Load existing bots when component mounts
	useEffect(() => {
		if (!existingBots) {
			loadMeetings();
		}
	}, []);

	// Function to load more meetings when scrolling
	const loadMoreMeetings = () => {
		if (!hasNextPage) return;
		const page = currentPage + 1;
		loadMeetings(page, append);
	};

	// Group meetings by date
	const groupMeetingsByDate = (meetings) => {
		const grouped = {};
		meetings.forEach((meeting) => {
			const dateStr = formatDate(meeting.createdAt);
			if (!grouped[dateStr]) grouped[dateStr] = [];
			grouped[dateStr].push(meeting);
		});
		return grouped;
	};

	function formatCustomDate(date) {
		const month = months[date.getMonth()];
		const day = date.getDate();
		const year = date.getFullYear();
		let hours = date.getHours();
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		return `${month} ${day} ${year} ${hours}:${minutes}${ampm}`;
	}

	const handleCreateMeet = async () => {
		let now = new Date();
		let input = {
			title:
				info.selectedMode === 'meeting_bot'
					? `Meeting at ${formatCustomDate(now)}`
					: `Note at ${formatCustomDate(now)}`,
			transcriptionSource: info.selectedMode,
			isAiIntelligenceEnabled: info.isAiIntelligenceEnabled,
			meetingMode: info.meetingMode,
			agenda: info.agenda,
		};
		if (info.selectedMode === 'meeting_bot') {
			if (!isValidUrl(info.meetingUrl)) return;
			input.meetingLink = info.meetingUrl;
		}
		setInfo((prev) => ({ ...prev, creating: true }));
		try {
			const response = await createMeetBot({ input });
			setInfo((prev) => ({
				...prev,
				meetingUrl: '',
				agenda: '',
				isAiIntelligenceEnabled: false,
				meetingMode: 'meeting',
			}));
			const pageId = response?.[1]?.data?.startTranscription?.data?.pageId;
			const type = response?.[1]?.data?.startTranscription?.data?.transcriptionSource;
			const success = response?.[1]?.data?.startTranscription?.success;

			if (success && pageId && type) {
				await loadMeetings(1, false);
				navigate(
					`/meet/${pageId}?type=${type}&isAiIntelligenceEnabled=${info.isAiIntelligenceEnabled}`,
				);
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
	// Group meetings by date for display
	const meetingsByDate = groupMeetingsByDate(meetings || []);
	const meetingsLength = Object.values(meetingsByDate).flat().length;
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
						{loadingMeetings ? (
							<div className="loading-container">
								<Spinner
									width="32px"
									height="32px"
									color="var(--primary-button)"
									borderTopColor="var(--background-color)"
								/>
							</div>
						) : Object.keys(meetingsByDate).length === 0 ? (
							<div className="empty-meet-bot-list">
								<EmptyMeetBotList />
							</div>
						) : (
							<InfiniteScroll
								dataLength={meetingsLength}
								next={loadMoreMeetings}
								hasMore={hasNextPage}
								height={infiniteScrollHeight}
								loader={<FetchMoreLoaderComp />}
							>
								{Object.keys(meetingsByDate).map((date) => (
									<React.Fragment key={date}>
										<div className="listSection">
											<div className="listSectionTitle">{date}</div>

											{meetingsByDate[date].map((meeting) => (
												<div
													className="meetingCard"
													onClick={() =>
														navigate(
															`/meet/${meeting._id}?type=meeting_bot&history=true`,
														)
													}
													key={meeting._id}
												>
													<div className="meetingInfo">
														<div className="meetingAvatar">
															{(meeting.createdBy?.name || '')
																.trim()
																.charAt(0)
																.toUpperCase() || '?'}
														</div>
														<div className="meetingTitle">
															{meeting.title}
														</div>
														<div className="meetingMeta">
															{meeting.createdBy?.name || ''}
														</div>
													</div>
													<div className="meetingImg">
														{meeting.coverImage && (
															<img
																src={meeting.coverImage}
																alt="avatar"
															/>
														)}
														{!meeting.coverImage && (
															<div className="imgPlaceholder">
																{meeting.title
																	.trim()
																	.charAt(0)
																	.toUpperCase() || '?'}
															</div>
														)}
													</div>
												</div>
											))}
										</div>
									</React.Fragment>
								))}
							</InfiniteScroll>
						)}
					</div>
				</div>
			</div>
			<div className="rightContainer" style={{ width: info.drawerOpen ? `400px` : `0px` }}>
				<Drawer
					open={info.drawerOpen}
					placement="right"
					closable={false}
					mask={false}
					styles={drawerStyles}
					style={{ position: 'relative', background: 'var(--background-color)' }}
					className="meetbot__right meetbot__right--open"
					getContainer={false}
				>
					<div className="meetbot__drawer-header">
						<SidebarClosingSvg
							className="sidebarClosingSvg"
							onClick={() => setInfo({ ...info, drawerOpen: false })}
						/>
						<div className="meetbot__drawer-tabs-container">
							<div className="meetbot__drawer-tabs">
								<button
									className={`meetbot__drawer-tab${
										info.selectedMode === 'meeting_bot'
											? ' meetbot__drawer-tab--active'
											: ''
									}`}
									onClick={() =>
										setInfo((prev) => ({
											...prev,
											selectedMode: 'meeting_bot',
										}))
									}
								>
									Online
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
									Offline
								</button>

								{/* Selection Indicator */}
								<span
									className="meetbot__drawer-indicator"
									style={{
										left:
											info.selectedMode === 'meeting_bot'
												? '0%'
												: info.selectedMode === 'desktop'
												? '60%'
												: '0%',
										transition: 'left 0.3s ease',
									}}
								/>
							</div>
						</div>
					</div>

					<div className="meetbot__drawer-content">
						<div className="meetbot__drawer-content-container">
							<div>
								<div className="meetbot__drawer-label">
									{info.selectedMode === 'meeting_bot'
										? 'Record a live meeting'
										: 'Record a private note'}
								</div>
								<div className="meetbot__drawer-desc">
									{info.selectedMode === 'meeting_bot'
										? 'Works with Zoom, Google meet, or Microsoft Teams'
										: `Only you know you're recording—no visible participants join your meeting.`}
								</div>
							</div>
							{info.selectedMode === 'meeting_bot' && (
								<>
									{/* Meeting Mode Selection */}
									<div className="meetbot__drawer-mode-wrapper">
										<div className="meetbot__drawer-mode-label">
											Meeting Mode
										</div>
										<div className="meetbot__drawer-mode-select-container">
											<select
												className="meetbot__drawer-mode-select"
												value={info.meetingMode}
												onChange={(e) =>
													setInfo((prev) => ({
														...prev,
														meetingMode: e.target.value,
													}))
												}
												disabled={info.creating}
											>
												{meetingModeOptions.map((option) => (
													<option key={option.value} value={option.value}>
														{option.label}
													</option>
												))}
											</select>
											<div className="meetbot__drawer-mode-select-arrow">
												<ChevronDown />
											</div>
										</div>
									</div>

									{/* Agenda Text Field */}
									<div className="meetbot__drawer-agenda-wrapper">
										<div className="meetbot__drawer-agenda-label">Agenda</div>
										<textarea
											className="meetbot__drawer-agenda-textarea"
											placeholder="Enter meeting agenda..."
											value={info.agenda}
											onChange={(e) =>
												setInfo((prev) => ({
													...prev,
													agenda: e.target.value,
												}))
											}
											disabled={info.creating}
											rows={3}
										/>
									</div>

									{info.selectedMode === 'meeting_bot' && (
										<>
											<div className="meetbotGuideMeContainer">
												<div className="meetbotGuideMeContainerItemContainer">
													<div className="meetbotGuideMeContainerItem">
														<div className="meetbotGuideMeContainerItemTitle">
															Ambient assistance
														</div>
														<div className="meetbotGuideMeDescriptionContainer">
															Your AI actively captures key points,
															summarizes conversations, and highlights
															actions in real-time.
														</div>
													</div>
													<Switch
														checked={info.isAiIntelligenceEnabled}
														onChange={(checked) =>
															setInfo((prev) => ({
																...prev,
																isAiIntelligenceEnabled: checked,
															}))
														}
													/>
												</div>
											</div>
										</>
									)}
									<div className="meetbot__drawer-input-wrapper">
										<input
											className="meetbot__drawer-input"
											placeholder="Paste meeting URL"
											value={info.meetingUrl}
											onChange={(e) =>
												setInfo((prev) => ({
													...prev,
													meetingUrl: e.target.value,
												}))
											}
											onKeyDown={handleInputKeyDown}
											disabled={info.creating}
										/>
										{!info.creating && (
											<button
												className={`meetbot__drawer-tick${
													!isValidUrl(info.meetingUrl)
														? ' meetbot__drawer-tick--disabled'
														: ''
												}`}
												onClick={handleCreateMeet}
												disabled={!isValidUrl(info.meetingUrl)}
												title="Create meeting"
											>
												Create
											</button>
										)}
										{info.creating && (
											<span className="meetbot__drawer-loader">
												<Spinner
													width="16px"
													height="16px"
													color="var(--primary-button)"
													borderTopColor="var(--background-color)"
													borderWidth={1}
												/>
											</span>
										)}
									</div>
								</>
							)}
							{info.selectedMode === 'desktop' && (
								<>
									{/* Meeting Mode Selection */}
									<div className="meetbot__drawer-mode-wrapper">
										<div className="meetbot__drawer-mode-label">
											Meeting Mode
										</div>
										<div className="meetbot__drawer-mode-select-container">
											<select
												className="meetbot__drawer-mode-select"
												value={info.meetingMode}
												onChange={(e) =>
													setInfo((prev) => ({
														...prev,
														meetingMode: e.target.value,
													}))
												}
												disabled={info.creating}
											>
												{meetingModeOptions.map((option) => (
													<option key={option.value} value={option.value}>
														{option.label}
													</option>
												))}
											</select>
											<div className="meetbot__drawer-mode-select-arrow">
												<ChevronDown />
											</div>
										</div>
									</div>

									{/* Agenda Text Field */}
									<div className="meetbot__drawer-agenda-wrapper">
										<div className="meetbot__drawer-agenda-label">Agenda</div>
										<textarea
											className="meetbot__drawer-agenda-textarea"
											placeholder="Enter meeting agenda..."
											value={info.agenda}
											onChange={(e) =>
												setInfo((prev) => ({
													...prev,
													agenda: e.target.value,
												}))
											}
											disabled={info.creating}
											rows={3}
										/>
									</div>
									<div className="meetbotGuideMeContainer">
										<div className="meetbotGuideMeContainerItemContainer">
											<div className="meetbotGuideMeContainerItem">
												<div className="meetbotGuideMeContainerItemTitle">
													Ambient assistance
												</div>
												<div className="meetbotGuideMeDescriptionContainer">
													Your AI actively captures key points, summarizes
													conversations, and highlights actions in
													real-time.
												</div>
											</div>
											<Switch
												checked={info.isAiIntelligenceEnabled}
												onChange={(checked) =>
													setInfo((prev) => ({
														...prev,
														isAiIntelligenceEnabled: checked,
													}))
												}
											/>
										</div>
									</div>
									<div className="meetbot__audio-btn-wrapper">
										<button
											disabled={info.creating}
											onClick={handleCreateMeet}
											className={`meetbot__audio-btn${
												info.creating ? ' meetbot__audio-btn--disabled' : ''
											}`}
										>
											<MicorPhoneIcon />
											{info.creating ? 'Starting...' : 'Record'}
										</button>
									</div>
								</>
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
