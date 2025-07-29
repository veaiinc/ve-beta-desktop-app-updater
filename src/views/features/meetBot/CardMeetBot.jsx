import React, { useState, useContext, useEffect, useRef, useCallback, useMemo } from 'react';
import { Drawer, Switch } from 'antd';
import styles from './cardMeetBot.module.scss';
import './meetBot.scss';
import { ReactComponent as MicorPhoneIcon } from './micorPhoneIcon.svg';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosing.svg';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import EmptyMeetBotList from './emptyMeetBotList';
import { ReactComponent as ChevronDown } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as SearchSvg } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as AddIcon } from '../../../assets/svg/add.svg';
import Spinner from '../../components/loaders/Spinner';
import GuideMePopup from './guideMePopup';

const drawerStyles = {
	header: { display: 'none' },
	body: { padding: 0, background: 'var(--background-color)', height: '100vh', overflow: 'auto' },
};

const meetingModeOptions = [
	{ value: 'meeting', label: 'Meeting' },
	{ value: 'sales', label: 'Sales Mode' },
	{ value: 'support', label: 'Support' },
	{ value: 'interview', label: 'Interview' },
	{ value: 'ideas', label: 'Ideas' },
];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

const CardMeetBot = () => {
	const {
		notes: { getExistingBots, createMeetBot, existingBots },
	} = useContext(Context);
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		drawerOpen: false,
		meetingUrl: '',
		selectedMode: 'meeting_bot',
		creating: false,
		isAiIntelligenceEnabled: false,
		meetingMode: 'meeting',
		agenda: '',
		title: '',
		currentIndex: 0,
		searchOpen: false,
		cards: [],
		guideMePopupOpen: false,
	});
	const searchInputRef = useRef(null);

	const meetings = useMemo(() => existingBots?.data || [], [existingBots?.data]);
	const loadingMeetings = existingBots ? false : true;

	// Load existing bots when component mounts
	useEffect(() => {
		if (!existingBots) {
			getExistingBots({ page: 1, limit: 10, append: false });
		}
	}, []);

	// Carousel navigation handlers
	const handleLeft = () => {
		setInfo((prev) => ({
			...prev,
			currentIndex: (prev.currentIndex - 1 + meetings.length) % meetings.length,
		}));
	};
	const handleRight = () => {
		setInfo((prev) => ({
			...prev,
			currentIndex: (prev.currentIndex + 1) % meetings.length,
		}));
	};

	useEffect(() => {
		if (meetings.length > 0) {
			const length = meetings.length;
			const cards = meetings.map((meeting, i) => {
				let diff = i - info.currentIndex;

				// Handle circular navigation
				if (diff > length / 2) diff -= length;
				if (diff < -length / 2) diff += length;

				return {
					...meeting,
					position: Math.abs(diff) <= 2 ? diff : null,
				};
			});

			setInfo((prev) => ({
				...prev,
				cards: cards,
			}));
		} else {
			setInfo((prev) => ({
				...prev,
				cards: [],
			}));
		}
	}, [info.currentIndex, meetings]);

	// Touch/swipe support
	const [touchStartX, setTouchStartX] = useState(null);
	const [touchEndX, setTouchEndX] = useState(null);
	const minSwipeDistance = 50;
	const handleTouchStart = (e) => {
		setTouchStartX(e.targetTouches[0].clientX);
		setTouchEndX(null);
	};
	const handleTouchMove = (e) => {
		setTouchEndX(e.targetTouches[0].clientX);
	};
	const handleTouchEnd = () => {
		if (!touchStartX || !touchEndX) return;
		const distance = touchStartX - touchEndX;
		const isLeftSwipe = distance > minSwipeDistance;
		const isRightSwipe = distance < -minSwipeDistance;
		if (isLeftSwipe) {
			handleRight();
		} else if (isRightSwipe) {
			handleLeft();
		}
		setTouchStartX(null);
		setTouchEndX(null);
	};

	// Focus the search input when searchOpen is true
	useEffect(() => {
		if (info.searchOpen && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [info.searchOpen]);

	// Search open/close toggle handler
	const handleSearchToggle = () => {
		setInfo((prev) => ({ ...prev, searchOpen: !prev.searchOpen }));
	};

	// Click outside to close search
	useEffect(() => {
		if (!info.searchOpen) return;
		function handleClickOutside(event) {
			if (
				searchInputRef.current &&
				!searchInputRef.current.contains(event.target) &&
				!event.target.closest('.search-btn')
			) {
				setInfo((prev) => ({ ...prev, searchOpen: false }));
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [info.searchOpen]);

	function formatCustomDate(date) {
		const month = months[date.getMonth()];
		const day = date.getDate();
		const year = date.getFullYear();
		let hours = date.getHours();
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const ampm = hours >= 12 ? 'PM' : 'AM';
		hours = hours % 12;
		hours = hours ? hours : 12;
		return `${month} ${day} ${year} ${hours}:${minutes}${ampm}`;
	}

	const handleCreateMeet = async () => {
		if (!info.title.trim()) {
			// You can add a toast notification here if needed
			return;
		}
		let input = {
			title: info.title.trim(),
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
				title: '',
				isAiIntelligenceEnabled: false,
				meetingMode: 'meeting',
			}));
			const pageId = response?.[1]?.data?.startTranscription?.data?.pageId;
			const type = response?.[1]?.data?.startTranscription?.data?.transcriptionSource;
			const success = response?.[1]?.data?.startTranscription?.success;

			if (success && pageId && type) {
				await getExistingBots({ page: 1, limit: 10, append: false });
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
			info.title.trim() &&
			!info.creating
		) {
			handleCreateMeet();
		}
		if (
			info.selectedMode === 'desktop' &&
			e.key === 'Enter' &&
			info.title.trim() &&
			!info.creating
		) {
			handleCreateMeet();
		}
	};

	// Keyboard navigation for cards
	const handleKeyDown = useCallback(
		(e) => {
			// Don't handle arrow keys if search is focused or drawer is open
			if (info.searchOpen || info.drawerOpen) return;

			if (e?.key === 'ArrowUp' || e?.key === 'ArrowLeft') {
				handleLeft();
			} else if (e?.key === 'ArrowDown' || e?.key === 'ArrowRight') {
				handleRight();
			}
		},
		[info.searchOpen, info.drawerOpen, handleLeft, handleRight],
	);
	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyDown]);

	return (
		<div className="meetbot">
			<div className="leftContainer">
				<div className={styles.cardMeetBot_listContainer}>
					<div className={styles.cardMeetBot_left}>
						<div className={styles.cardMeetBot_container}>
							<div className={styles.cardMeetBot_title}>
								<span className="title-highlight">Smart</span> Live Chat
							</div>
							<div
								className={styles.cardMeetBot_cardsContainer}
								onTouchStart={handleTouchStart}
								onTouchMove={handleTouchMove}
								onTouchEnd={handleTouchEnd}
							>
								{loadingMeetings ? (
									[0, 1, 2, -1, -2].map((pos, idx) => {
										const positionClassMap = {
											0: styles.cardMeetBot_selected,
											1: styles.cardMeetBot_right1,
											2: styles.cardMeetBot_right2,
											'-1': styles.cardMeetBot_left1,
											'-2': styles.cardMeetBot_left2,
										};
										return (
											<div
												key={idx}
												className={`${styles.cardMeetBot_card} ${positionClassMap[pos]}`}
											></div>
										);
									})
								) : meetings.length === 0 ? (
									<div
										className={
											styles.cardMeetBot_card +
											' ' +
											styles.cardMeetBot_selected
										}
										style={{ background: 'var(--popup)', cursor: 'pointer' }}
										onClick={() =>
											setInfo((prev) => ({ ...prev, drawerOpen: true }))
										}
									>
										<div className={styles.cardMeetBot_header}>
											<div className={styles.cardMeetBot_cardTitle}>
												Create Meeting
											</div>
											<div className={styles.cardMeetBot_cardDescription}>
												Easily schedule a new meeting and invite
												participants in just a few clicks.
											</div>
											<div className={styles.cardMeetBot_cardAgenda}>
												<p>
													Easily schedule a new meeting and invite
													participants in just a few clicks.
												</p>
											</div>
										</div>
									</div>
								) : (
									info.cards?.map((meeting, idx) => {
										const position = meeting.position;
										const positionClassMap = {
											0: styles.cardMeetBot_selected,
											1: styles.cardMeetBot_right1,
											2: styles.cardMeetBot_right2,
											'-1': styles.cardMeetBot_left1,
											'-2': styles.cardMeetBot_left2,
										};
										const classList = [
											styles.cardMeetBot_card,
											positionClassMap[position] || '',
										];
										if (position === null) return null;
										return (
											<div
												key={meeting._id}
												className={classList.join(' ')}
												style={{
													background: classList.includes(
														styles.cardMeetBot_selected,
													)
														? 'var(--popup)'
														: 'var(--background-color)',
												}}
												onClick={() =>
													navigate(
														`/meet/${meeting?._id}?type=${meeting?.transcriptionSource}&history=true`,
													)
												}
											>
												<div className={styles.cardMeetBot_header}>
													<div className={styles.cardMeetBot_cardTitle}>
														{meeting.title}
													</div>
													<div
														className={
															styles.cardMeetBot_cardDescription
														}
													>
														{meeting.agenda || 'No agenda provided.'}
													</div>
												</div>
												{classList.includes(
													styles.cardMeetBot_selected,
												) && (
													<div className={styles.cardMeetBot_footer}>
														<div
															className={
																styles.cardMeetBot_moduleType
															}
														>
															{meeting.meetingMode}
														</div>
														<div
															className={
																styles.cardMeetBot_modulePriority
															}
														>
															<div
																className={
																	styles.cardMeetBot_modulePriorityText
																}
															>
																<div>
																	{meeting.createdBy?.name ||
																		'Unknown'}
																</div>
																{meeting.createdAt && (
																	<div
																		style={{
																			color: 'var(--secondary-font)',
																		}}
																	>
																		|
																	</div>
																)}
																<div>
																	{formatDate(meeting.createdAt)}
																</div>
															</div>
														</div>
													</div>
												)}
											</div>
										);
									})
								)}
							</div>
							<div className={styles.cardMeetBot_actionMainContainer}>
								<div className={styles.cardMeetBot_rightContainer}>
									<div className={styles.cardMeetBot_optionsContainer}>
										<div className={styles.cardMeetBot_searchMainContainer}>
											{/* <button
												className={`search-btn${info.searchOpen ? ' expanded' : ''}`}
												onClick={handleSearchToggle}
												aria-label="Toggle search"
											>
												<SearchSvg stroke="var(--secondary-font)" />
											</button> */}
											{info.searchOpen && (
												<div className={`search-wrapper expanded`}>
													<input
														className="search-input"
														placeholder="Search"
														ref={searchInputRef}
													/>
												</div>
											)}
										</div>
										{/* <div className="action-left">
											<button className="filter-btn" data-tooltip="Filter">
												</button>
										</div> */}
									</div>
								</div>
								<div className={styles.cardMeetBot_optionsRightMainContainer}>
									{meetings.length > 0 && (
										<div className={styles.cardMeetBot_actionRight}>
											<button
												className={styles.cardMeetBot_cardChangeBtn}
												style={{ marginRight: 8 }}
												onClick={handleLeft}
											>
												<ChevronDown
													className={styles.cardMeetBot_leftChevron}
												/>
											</button>
											<div className="card-number">
												<span>{info.currentIndex + 1}</span>/
												<span className="total-docs">
													{meetings.length}
												</span>
											</div>
											<button
												className={styles.cardMeetBot_cardChangeBtn}
												onClick={handleRight}
											>
												<ChevronDown />
											</button>
										</div>
									)}
								</div>
							</div>
							<button
								className={styles.cardMeetBot_createNewBtn}
								onClick={() => setInfo((prev) => ({ ...prev, drawerOpen: true }))}
							>
								<AddIcon />
								Create New
							</button>
						</div>
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

							{/* Title Input Field */}
							<div className="meetbot__drawer-title-wrapper">
								<div className="meetbot__drawer-title-label">Title</div>
								<input
									className="meetbot__drawer-title-input"
									placeholder="Enter meeting title..."
									value={info.title}
									onChange={(e) =>
										setInfo((prev) => ({
											...prev,
											title: e.target.value,
										}))
									}
									disabled={info.creating}
								/>
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
																guideMePopupOpen: checked
																	? true
																	: false,
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
													!isValidUrl(info.meetingUrl) ||
													!info.title.trim()
														? ' meetbot__drawer-tick--disabled'
														: ''
												}`}
												onClick={handleCreateMeet}
												disabled={
													!isValidUrl(info.meetingUrl) ||
													!info.title.trim()
												}
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
											disabled={info.creating || !info.title.trim()}
											onClick={handleCreateMeet}
											className={`meetbot__audio-btn${
												info.creating || !info.title.trim()
													? ' meetbot__audio-btn--disabled'
													: ''
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
			<GuideMePopup
				isOpen={info.guideMePopupOpen}
				onClose={() => setInfo({ ...info, guideMePopupOpen: false })}
			/>
		</div>
	);
};

export default CardMeetBot;
