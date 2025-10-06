import React, { useState, useContext, useEffect, useRef, useCallback, useMemo } from 'react';
import styles from './cardMeetBot.module.scss';
import './meetBot.scss';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import EmptyMeetBotList from './emptyMeetBotList';
import { ReactComponent as ChevronDown } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as SearchSvg } from '../../../assets/svg/workflow/search.svg';
import { ReactComponent as AddIcon } from '../../../assets/svg/add.svg';
import GuideMePopup from './guideMePopup';
import CreateMeetingModal from './CreateMeetingModal';
import moment from 'moment';
import { useStore, storeActions } from '../../../store/store';
import { useDispatch } from '@zubridge/electron';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const actionTabs = [
	{
		label: 'Upcoming meetings',
		value: 'upcoming',
	},
	{
		label: 'Past meetings',
		value: 'past',
	},
];

function formatDate(timestamp) {
	const date = new Date(Number(timestamp) * 1000);
	return date.toLocaleDateString(undefined, {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

const CardMeetBot = () => {
	const {
		notes: { getExistingBots, createMeetBot, getAllCalendarEventsForMeetings },
		templates: { updateStateValues },
		aiSetup: { proactiveHeadings, getProactiveHeadings },
	} = useContext(Context);
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		modalOpen: false,
		currentIndex: 0,
		searchOpen: false,
		cards: [],
		guideMePopupOpen: false,
		apiFetching: false,
		activeTab: 'upcoming',
	});
	const searchInputRef = useRef(null);

	const dispatch = useDispatch();
	const { pastMeetings, activeMeetingId, upcomingMeetings } =
		useStore((state) => state.meeting) || {};

	// Get meetings based on active tab
	const meetings = useMemo(() => {
		if (info.activeTab === 'upcoming') {
			return upcomingMeetings?.data || [];
		}
		return pastMeetings?.data || [];
	}, [info.activeTab, pastMeetings?.data, upcomingMeetings?.data]);

	const loadingMeetings = useMemo(() => {
		if (info.activeTab === 'upcoming') {
			return upcomingMeetings?.data ? false : true;
		}
		return pastMeetings?.data ? false : true;
	}, [info.activeTab, pastMeetings?.data, upcomingMeetings?.data]);

	const hasNextPage = useMemo(() => {
		if (info.activeTab === 'upcoming') {
			return upcomingMeetings?.hasNextPage || false;
		}
		return pastMeetings?.hasNextPage || false;
	}, [info.activeTab, pastMeetings?.hasNextPage, upcomingMeetings?.hasNextPage]);

	const nextPage = useMemo(() => {
		if (info.activeTab === 'upcoming') {
			return upcomingMeetings?.nextPage || 1;
		}
		return pastMeetings?.nextPage || 1;
	}, [info.activeTab, pastMeetings?.nextPage, upcomingMeetings?.nextPage]);

	const totalDocs = useMemo(() => {
		if (info.activeTab === 'upcoming') {
			return upcomingMeetings?.totalDocs || 0;
		}
		return pastMeetings?.totalDocs || 0;
	}, [info.activeTab, pastMeetings?.totalDocs, upcomingMeetings?.totalDocs]);

	const handleTabChange = (tab) => {
		setInfo((prev) => ({ ...prev, activeTab: tab, currentIndex: 0 }));
	};

	// Modified API call handler to dispatch to store
	const handleGetExistingBots = useCallback(
		async (params) => {
			setInfo((prevInfo) => ({ ...prevInfo, apiFetching: true }));

			try {
				// Call the API function from context
				const result = await getExistingBots(params);

				let payload = {};

				if (result[0]) {
					const data = result[1].data?.listMeetings;
					const currentPageMeetingsList = data?.data || [];

					let mergedData;
					if (params.append) {
						const existing = pastMeetings?.data || [];

						// Merge + deduplicate by "_id"
						const combined = [...existing, ...currentPageMeetingsList];
						const seen = new Set();
						mergedData = combined.filter((meeting) => {
							if (!meeting?._id) return false; // skip invalid entries
							if (seen.has(meeting._id)) return false; // skip duplicates
							seen.add(meeting._id);
							return true;
						});
					} else {
						// For fresh load, still check for duplicates in the new data itself
						const seen = new Set();
						mergedData = currentPageMeetingsList.filter((meeting) => {
							if (!meeting?._id) return false; // skip invalid entries
							if (seen.has(meeting._id)) return false; // skip duplicates
							seen.add(meeting._id);
							return true;
						});
					}

					payload = {
						data: mergedData,
						hasNextPage: data.hasNextPage,
						nextPage: data.nextPage,
						totalDocs: data.totalDocs,
						append: params.append || false,
					};
				}

				dispatch({
					type: storeActions.meeting.SET_PAST_MEETINGS,
					payload,
				});
			} catch (error) {
				console.error('Error fetching meetings:', error);
			} finally {
				setInfo((prevInfo) => ({ ...prevInfo, apiFetching: false }));
			}
		},
		[getExistingBots, dispatch, pastMeetings?.data],
	);

	const handleGetUpcomingMeetings = useCallback(
		async (params) => {
			setInfo((prevInfo) => ({ ...prevInfo, apiFetching: true }));
			const now = moment();
			try {
				const result = await getAllCalendarEventsForMeetings(params.page, params.limit, {
					startDate: now.toISOString(), // current time
					endDate: now.clone().add(12, 'hours').toISOString(),
				});

				let payload = {};

				if (result[0]) {
					console.log('result==>handleGetUpcomingMeetings', result);

					const data = result[1];
					const currentPageMeetingsList = data?.data || [];

					let mergedData;
					if (params.append) {
						const existing = upcomingMeetings?.data || [];

						// Merge + deduplicate by "_id"
						const combined = [...existing, ...currentPageMeetingsList];
						const seen = new Set();
						mergedData = combined.filter((meeting) => {
							if (!meeting?._id) return false; // skip invalid entries
							if (seen.has(meeting._id)) return false; // skip duplicates
							seen.add(meeting._id);
							return true;
						});
					} else {
						// For fresh load, still check for duplicates in the new data itself
						const seen = new Set();
						mergedData = currentPageMeetingsList.filter((meeting) => {
							if (!meeting?._id) return false; // skip invalid entries
							if (seen.has(meeting._id)) return false; // skip duplicates
							seen.add(meeting._id);
							return true;
						});
					}

					payload = {
						data: mergedData,
						hasNextPage: data.hasNextPage,
						nextPage: data.nextPage,
						totalDocs: data.totalDocs,
						append: params.append || false,
					};
				}

				dispatch({
					type: storeActions.meeting.SET_UPCOMING_MEETINGS,
					payload,
				});
			} catch (error) {
				console.error('Error fetching meetings:', error);
			} finally {
				setInfo((prevInfo) => ({ ...prevInfo, apiFetching: false }));
			}
		},
		[getAllCalendarEventsForMeetings, dispatch, upcomingMeetings?.data],
	);

	// Load existing bots when component mounts
	useEffect(() => {
		// if (!pastMeetings?.data || pastMeetings.data.length === 0) {
		handleGetExistingBots({ page: 1, limit: 10, append: false });
		handleGetUpcomingMeetings({ page: 1, limit: 10, append: false });
		// }
	}, []); // Only run on mount

	// Auto-switch to past tab if upcoming meetings are empty
	useEffect(() => {
		if (
			upcomingMeetings?.data &&
			upcomingMeetings.data.length === 0 &&
			info.activeTab === 'upcoming'
		) {
			setInfo((prev) => ({ ...prev, activeTab: 'past', currentIndex: 0 }));
		}
	}, [upcomingMeetings?.data, info.activeTab]);

	// Carousel navigation handlers
	const handleLeft = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			currentIndex: (prev.currentIndex - 1 + meetings.length) % meetings.length,
		}));
	}, [meetings.length]);

	const handleRight = useCallback(() => {
		if (hasNextPage && info?.currentIndex > meetings?.length - 5) {
			if (!info?.apiFetching) {
				if (info.activeTab === 'upcoming') {
					handleGetUpcomingMeetings({ page: nextPage, limit: 10, append: true });
				} else {
					handleGetExistingBots({ page: nextPage, limit: 10, append: true });
				}
			}
		}
		setInfo((prev) => ({
			...prev,
			currentIndex: (prev.currentIndex + 1) % meetings.length,
		}));
	}, [
		hasNextPage,
		info?.currentIndex,
		info?.apiFetching,
		meetings?.length,
		nextPage,
		info.activeTab,
		handleGetExistingBots,
		handleGetUpcomingMeetings,
	]);

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
	// useEffect(() => {
	// 	getProactiveHeadings({ module: 'meeting' });
	// }, []);

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

	// Keyboard navigation for cards
	const handleKeyDown = useCallback(
		(e) => {
			// Don't handle arrow keys if search is focused or modal is open
			if (info.searchOpen || info.modalOpen) return;

			if (e?.key === 'ArrowUp' || e?.key === 'ArrowLeft') {
				handleLeft();
			} else if (e?.key === 'ArrowDown' || e?.key === 'ArrowRight') {
				handleRight();
			}
		},
		[info.searchOpen, info.modalOpen, handleLeft, handleRight],
	);
	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [handleKeyDown]);

	const closeModal = () => {
		setInfo((prev) => ({
			...prev,
			modalOpen: false,
		}));
	};

	function getMeetingStatus(meeting) {
		const now = moment();
		const start = moment(meeting.startDateTime);
		const end = moment(meeting.endDateTime);

		if (now.isBefore(start) && start.diff(now, 'minutes') <= 5) {
			return 'Starting soon';
		} else if (now.isBetween(start, end)) {
			return 'Now';
		} else {
			return '';
		}
	}

	return (
		<div className="meetbot">
			<div className="leftContainer">
				<div className={styles.cardMeetBot_listContainer}>
					<div className={styles.cardMeetBot_left}>
						<div className={styles.cardMeetBot_container}>
							<div className={styles.cardMeetBot_title}>
								{proactiveHeadings?.meeting_headlines ? (
									proactiveHeadings?.meeting_headlines
								) : (
									<>
										<span className="title-highlight">Smart</span> Meetings
									</>
								)}
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
											setInfo((prev) => ({ ...prev, modalOpen: true }))
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
												onClick={() => {
													if (
														activeMeetingId &&
														activeMeetingId === meeting?._id &&
														window.electronApi
													) {
														window.electronApi.minimizeMainWindow();
													} else {
														navigate(
															`/meet/${meeting?._id}?type=${meeting?.transcriptionSource}&history=true`,
														);
													}
												}}
											>
												<div className={styles.cardMeetBot_header}>
													{position === 0 &&
														activeMeetingId === meeting?._id && (
															<span
																className={
																	styles.cardMeetBot_liveBadge
																}
															>
																Live
															</span>
														)}

													{position === 0 &&
														info.activeTab === 'upcoming' && (
															<span
																className={
																	styles.cardMeetBot_liveBadge
																}
															>
																{getMeetingStatus(meeting)}
															</span>
														)}

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
																<div>{meeting.createdBy?.name}</div>
																{meeting.createdAt &&
																	meeting.createdBy?.name && (
																		<div
																			style={{
																				color: 'var(--secondary-font)',
																			}}
																		>
																			|
																		</div>
																	)}
																<div
																	style={{
																		textOverflow: 'ellipsis',
																		overflow: 'hidden',
																		whiteSpace: 'nowrap',
																		maxWidth: '100px',
																	}}
																>
																	{moment
																		.unix(
																			info?.activeTab ===
																				'upcoming'
																				? meeting.updatedAt
																				: meeting.createdAt,
																		)
																		.format('DD MMM YYYY')}
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
												<span className="total-docs">{totalDocs}</span>
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

							<div className={styles.cardMeetBot_actionButtonsContainer}>
								<button
									className={styles.createNewBtn}
									onClick={() =>
										setInfo((prev) => ({ ...prev, modalOpen: true }))
									}
									disabled={activeMeetingId !== null}
								>
									<div className={styles.iconContainer}>
										<AddIcon />
									</div>
									<div className={styles.text}>Create New</div>
								</button>
								{actionTabs
									.filter((tab) => {
										// Hide upcoming tab if no upcoming meetings exist
										if (
											tab.value === 'upcoming' &&
											upcomingMeetings?.data &&
											upcomingMeetings.data.length === 0
										) {
											return false;
										}
										return true;
									})
									.map((tab) => {
										return (
											<div
												className={`${styles.actionItem} ${
													info.activeTab === tab.value
														? styles.active
														: ''
												}`}
												onClick={() => handleTabChange(tab.value)}
												key={tab.value}
											>
												<div className={styles.indicatorDot}></div>
												<div className={styles.text}>{tab.label}</div>
												{/* {<div className={styles.count}>{0}</div>} */}
											</div>
										);
									})}
							</div>
						</div>
					</div>
				</div>
			</div>

			<CreateMeetingModal isOpen={info.modalOpen} onClose={closeModal} />
			<GuideMePopup
				isOpen={info.guideMePopupOpen}
				onClose={() => setInfo({ ...info, guideMePopupOpen: false })}
			/>
		</div>
	);
};

export default CardMeetBot;
