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
// import { useDispatch } from '@zubridge/electron';
import { message } from '../../components/globalComponents/CustomToast';
import Spinner from '../../components/loaders/Spinner';

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
		creatingMeetingId: null,
	});
	const [currentTime, setCurrentTime] = useState(moment.utc());
	const searchInputRef = useRef(null);

	// const dispatch = useDispatch();
	// const { pastMeetings, activeMeetingId, upcomingMeetings } =
	//     useStore((state) => state.meeting) || {};
	const pastMeetings = null; // Temporarily set to null
	const activeMeetingId = null; // Temporarily set to null
	const upcomingMeetings = null; // Temporarily set to null

	// Get meetings based on active tab
	const meetings = useMemo(() => {
		if (info.activeTab === 'upcoming') {
			const upcomingData = upcomingMeetings?.data || [];
			const pastData = pastMeetings?.data || [];

			// Filter out past meetings (endDateTime <= now) and meetings that have already been created
			const now = moment.utc();
			return upcomingData.filter((meeting) => {
				// Filter out meetings that have already ended
				if (meeting.endDateTime) {
					const endTime = moment.utc(meeting.endDateTime);
					if (endTime.isSameOrBefore(now)) {
						return false;
					}
				}

				// Filter out meetings that have already been converted to actual meetings
				// Check if there's a past meeting with similar title and time
				const hasBeenCreated = pastData.some((pastMeeting) => {
					// Compare titles (case insensitive)
					const titleMatch =
						pastMeeting.title &&
						meeting.title &&
						pastMeeting.title.toLowerCase().trim() ===
							meeting.title.toLowerCase().trim();

					// Compare start times (within 30 minutes window)
					let timeMatch = false;
					if (pastMeeting.createdAt && meeting.startDateTime) {
						const pastMeetingTime = moment.unix(pastMeeting.createdAt);
						const upcomingMeetingTime = moment.utc(meeting.startDateTime);
						timeMatch = pastMeetingTime.isBetween(
							upcomingMeetingTime.clone().subtract(30, 'minutes'),
							upcomingMeetingTime.clone().add(30, 'minutes'),
						);
					}

					return titleMatch && timeMatch;
				});

				return !hasBeenCreated;
			});
		}
		return pastMeetings?.data || [];
	}, [info.activeTab, pastMeetings?.data, upcomingMeetings?.data, currentTime]);

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

				// dispatch({
				//     type: storeActions.meeting.SET_PAST_MEETINGS,
				//     payload,
				// });
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

				// dispatch({
				//     type: storeActions.meeting.SET_UPCOMING_MEETINGS,
				//     payload,
				// });
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

	// Update current time every minute to refresh meeting status
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(moment.utc());
		}, 60000); // Update every minute

		return () => clearInterval(timer);
	}, []);

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

	// Transform attendees array to participants format for meeting creation
	const transformAttendeesToParticipants = (attendees, organizer) => {
		const list = Array.isArray(attendees) ? attendees : [];
		const organizerEmail = typeof organizer === 'string' ? organizer : organizer?.email;

		// Collect all unique emails
		const emailSet = new Set();

		// Add attendee emails
		list.forEach((attendee) => {
			if (attendee?.email) {
				emailSet.add(attendee.email.toLowerCase());
			}
		});

		// Add organizer email if it exists
		if (organizerEmail) {
			emailSet.add(organizerEmail.toLowerCase());
		}

		// Convert set back to array of email strings
		return Array.from(emailSet);
	};

	// Handle creating meeting from upcoming meeting
	const handleCreateMeetingFromUpcoming = async (meeting) => {
		setInfo((prev) => ({ ...prev, creatingMeetingId: meeting._id }));

		try {
			// Transform attendees to participants format
			const participants = transformAttendeesToParticipants(
				meeting.attendees,
				meeting.organizer,
			);

			// Generate default title with current date and time
			const now = new Date();
			const day = now.getDate().toString().padStart(2, '0');
			const month = now.toLocaleString('en-US', { month: 'short' });
			const year = now.getFullYear();
			const hours = now.getHours().toString().padStart(2, '0');
			const minutes = now.getMinutes().toString().padStart(2, '0');
			const defaultTitle = `${day} ${month} ${year} ${hours}:${minutes}`;

			const input = {
				title: meeting.title || defaultTitle,
				transcriptionSource: 'desktop', // Default to desktop mode
				isAiIntelligenceEnabled: true,
				meetingMode: 'meeting',
				agenda: meeting.description || '',
				participants: participants,
			};

			const response = await createMeetBot({ input });
			const isSuccess = response?.[0];

			if (!isSuccess) {
				message.error('Error creating meeting');
				return;
			}

			const meetingId = response?.[1]?.data?.startMeeting?._id;
			const type = response?.[1]?.data?.startMeeting?.transcriptionSource;
			const meetingData = response[1]?.data?.startMeeting;

			// Update store with new meeting
			const payload = {
				...(pastMeetings || {}),
				data: [meetingData, ...(pastMeetings?.data || [])],
				totalDocs: (pastMeetings?.totalDocs ?? 0) + 1,
			};

			// dispatch({
			//     type: storeActions.meeting.SET_PAST_MEETINGS,
			//     payload,
			// });

			// Remove the upcoming meeting from the upcoming meetings list since it's now created
			if (upcomingMeetings?.data) {
				const updatedUpcomingData = upcomingMeetings.data.filter(
					(upcomingMeeting) => upcomingMeeting._id !== meeting._id,
				);

				// dispatch({
				//     type: storeActions.meeting.SET_UPCOMING_MEETINGS,
				//     payload: {
				//         ...upcomingMeetings,
				//         data: updatedUpcomingData,
				//         totalDocs: Math.max(0, (upcomingMeetings.totalDocs || 0) - 1),
				//     },
				// });
			}

			if (meetingId && window.electronApi) {
				window.electronApi.overlay.startRecording({
					...(response?.[1]?.data?.startMeeting || {}),
				});

				window.electronApi.minimizeMainWindow();

				// Trigger Dynamic Island recording
				try {
					console.log('🏝️ Triggering Dynamic Island recording from upcoming meeting');
					const result = await window.electronApi.dynamicIsland.startRecordingFromModal();
					if (result.success) {
						console.log('✅ Successfully started Dynamic Island recording');
					} else {
						console.warn('⚠️ Dynamic Island recording failed:', result.error);
					}
				} catch (error) {
					console.error('❌ Error triggering Dynamic Island recording:', error);
				}
			}
		} catch (error) {
			console.error('Error creating meeting from upcoming:', error);
			message.error('Error creating meeting');
		} finally {
			setInfo((prev) => ({ ...prev, creatingMeetingId: null }));
		}
	};

	function getMeetingStatus(meeting) {
		const now = currentTime; // Use the state time that updates every minute

		const toMoment = (value) => {
			if (value == null) return null;
			// Handle numeric epoch values (seconds vs milliseconds)
			if (typeof value === 'number') {
				return value < 1e12 ? moment.unix(value) : moment(value);
			}
			// Handle numeric strings
			if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) {
				const num = Number(value);
				return num < 1e12 ? moment.unix(num) : moment(num);
			}
			// Handle ISO strings - keep as UTC for consistent comparison
			return moment.utc(value);
		};

		// Convert current local time to UTC for comparison with meeting times
		const nowUTC = moment.utc();
		const start = toMoment(meeting.startDateTime);
		const end = toMoment(meeting.endDateTime);

		if (!start || !start.isValid() || !end || !end.isValid()) {
			return '';
		}

		// Check if meeting is currently happening (using UTC times)
		if (nowUTC.isBetween(start, end, null, '[]')) {
			return 'Now';
		}

		// Check if meeting is starting within 5 minutes
		if (nowUTC.isBefore(start) && start.diff(nowUTC, 'minutes') <= 5) {
			return 'Starting soon';
		}

		return '';
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
												style={
													{
														// Remove inline background to allow CSS glass morphism to work
														// The CSS classes handle the glass morphism effect with proper backdrop-filter
													}
												}
												onClick={() => {
													// Don't allow interaction while creating meeting
													if (info.creatingMeetingId) return;

													// Handle upcoming meetings differently
													if (info.activeTab === 'upcoming') {
														// Check if meeting is starting soon (within 5 minutes) or happening now
														const status = getMeetingStatus(meeting);
														if (
															status === 'Now' ||
															status === 'Starting soon'
														) {
															handleCreateMeetingFromUpcoming(
																meeting,
															);
														} else {
															// For other upcoming meetings, show a message or navigate
															message.info(
																"Meeting is not starting yet. You can create a meeting when it's starting soon.",
															);
														}
													} else {
														// Handle past meetings as before
														if (
															activeMeetingId &&
															activeMeetingId === meeting?._id &&
															window.electronApi
														) {
															navigate('/ongoing-meeting');
														} else {
															navigate(
																`/meet/${meeting?._id}?type=${meeting?.transcriptionSource}&history=true`,
															);
														}
													}
												}}
											>
												<div className={styles.cardMeetBot_header}>
													{position === 0 &&
														(() => {
															const status =
																activeMeetingId === meeting?._id
																	? 'Live'
																	: info.activeTab === 'upcoming'
																	? getMeetingStatus(meeting)
																	: '';

															// Show "Creating" badge only for the currently creating meeting
															if (
																info.creatingMeetingId ===
																	meeting._id &&
																info.activeTab === 'upcoming'
															) {
																return (
																	<span
																		className={
																			styles.cardMeetBot_liveBadge
																		}
																		style={{
																			display: 'flex',
																			alignItems: 'center',
																			gap: '6px',
																		}}
																	>
																		<Spinner
																			width="12px"
																			height="12px"
																			color="white"
																			borderTopColor="transparent"
																			borderWidth={2}
																		/>
																		Creating...
																	</span>
																);
															}

															return status ? (
																<span
																	className={
																		styles.cardMeetBot_liveBadge
																	}
																>
																	{status}
																</span>
															) : null;
														})()}

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
								{/* <button
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
								</button> */}
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
