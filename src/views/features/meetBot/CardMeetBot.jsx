import React, { useState, useContext, useEffect, useCallback, useMemo } from 'react';
import styles from './cardMeetBot.module.scss';
import './meetBot.scss';
import Context from '../../../context/context';
import { useNavigate } from 'react-router-dom';
import GuideMePopup from './guideMePopup';
import CreateMeetingModal from './CreateMeetingModal';
import moment from 'moment';
import { useStore, storeActions } from '../../../store/store';
import { useDispatch } from '@zubridge/electron';
import { message } from '../../components/globalComponents/CustomToast';
import Spinner from '../../components/loaders/Spinner';



// Upcoming Meetings List Component
const UpcomingMeetingsList = ({ meetings, onMeetingClick, creatingMeetingId, getMeetingStatus }) => {
	// Group meetings by date (same as past meetings)
	const groupMeetingsByDate = (meetings) => {
		const grouped = {};

		// Sort meetings by start time (earliest first - most recent upcoming first)
		const sortedMeetings = [...meetings].sort((a, b) => {
			const aTime = a?.googleCalendarMeta?.start?.dateTime || a.startDateTime;
			const bTime = b?.googleCalendarMeta?.start?.dateTime || b.startDateTime;
			if (!aTime || !bTime) return 0;
			return moment.utc(aTime).valueOf() - moment.utc(bTime).valueOf();
		});

		sortedMeetings.forEach(meeting => {
			const meetingTime = meeting?.startDateTime || meeting?.googleCalendarMeta?.start?.dateTime;
			if (!meetingTime) return;

			const date = moment.utc(meetingTime).format('DD MMM YYYY');

			if (!grouped[date]) {
				grouped[date] = [];
			}
			grouped[date].push(meeting);
		});

		return grouped;
	};

	const formatTime = (dateTime) => {
		const localTime = new Date(dateTime).toLocaleString();
		return moment.utc(localTime).format('h:mm A');
		// return moment.utc(dateTime).format('h:mm A');
	};

	const getParticipantsDisplay = (meeting) => {
		let participants = [];

		// Collect all participants
		if (meeting.participants && meeting.participants.length > 0) {
			participants = meeting.participants;
		} else if (meeting.attendees && meeting.attendees.length > 0) {
			participants = meeting.attendees.map(attendee => attendee.email || attendee.name);
		} else if (meeting.organizer?.name) {
			participants = [meeting.organizer.name];
		}

		if (participants.length === 0) {
			return <span className="no-participants">No participants</span>;
		}

		// Show first participant name, then +count for others
		const firstParticipant = participants[0];
		const remainingCount = participants.length - 1;

		return (
			<div className="participants-display">
				<span className="first-participant">{firstParticipant}</span>
				{remainingCount > 0 && (
					<div className="participant-count-container">
						<span className="participant-count">+{remainingCount}</span>
						<div className="participants-popup">
							<div className="popup-header">Attendees</div>
							<div className="popup-separator"></div>
							<div className="popup-list">
								{participants.map((participant, index) => (
									<div key={index} className="popup-participant">
										<span className="participant-email">{participant}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		);
	};

	const groupedMeetings = groupMeetingsByDate(meetings);

	// Sort date groups by date (earliest first)
	const sortedDateKeys = Object.keys(groupedMeetings).sort((a, b) => {
		return moment(a, 'DD MMM YYYY').valueOf() - moment(b, 'DD MMM YYYY').valueOf();
	});

	return (
		<div className='upcoming-meetings-list'>
			{sortedDateKeys.map((date) => (
				<div key={date} className='meetings-group'>
					<div className='meetings-group-title'>{date}</div>
					{groupedMeetings[date].map((meeting) => {
						const status = getMeetingStatus(meeting);
						const isCreating = creatingMeetingId === meeting._id;
						const isClickable = status === 'Now' || status === 'Starting soon';

						return (
							<div
								key={meeting._id}
								className={`card-meet-bot-list-item upcoming ${isCreating ? 'creating' : ''} ${!isClickable ? 'non-clickable' : ''}`}
								onClick={() => {
									if (isCreating || !isClickable) return;
									onMeetingClick(meeting);
								}}
							>
								<div className='card-meet-bot-list-item-header'>
									<div className='card-meet-bot-list-item-title'>{meeting.title}</div>
									<div className='card-meet-bot-list-item-time'>{formatTime(meeting.startDateTime)}</div>
								</div>
								<div className='card-meet-bot-list-item-description'>
									{getParticipantsDisplay(meeting)}
								</div>
								{status && (
									<div className='card-meet-bot-list-item-status'>
										{isCreating ? (
											<>
												<Spinner width="12px" height="12px" color="white" borderTopColor="transparent" borderWidth={2} />
												Creating...
											</>
										) : (
											status
										)}
									</div>
								)}
							</div>
						);
					})}
				</div>
			))}

			{meetings.length === 0 && (
				<div className='card-meet-empty-state'>
					<div className='card-meet-empty-title'>No upcoming meetings</div>
					<div className='card-meet-empty-description'>
						Your upcoming meetings will appear here
					</div>
				</div>
			)}
		</div>
	);
};

// Past Meetings List Component
const PastMeetingsList = ({ meetings, onMeetingClick }) => {
	// Group meetings by date
	const groupMeetingsByDate = (meetings) => {
		const grouped = {};

		meetings.forEach(meeting => {
			if (!meeting.createdAt) return;

			const date = moment.unix(meeting.createdAt).format('DD MMM YYYY');

			if (!grouped[date]) {
				grouped[date] = [];
			}
			grouped[date].push(meeting);
		});

		return grouped;
	};

	const formatTime = (timestamp) => {
		return moment.unix(timestamp).format('h:mm A');
	};

	const getParticipantsDisplay = (meeting) => {
		let participants = [];

		// Collect all participants
		if (meeting.participants && meeting.participants.length > 0) {
			participants = meeting.participants;
		} else if (meeting.attendees && meeting.attendees.length > 0) {
			participants = meeting.attendees.map(attendee => attendee.email || attendee.name);
		} else if (meeting.createdBy?.name) {
			participants = [meeting.createdBy.name];
		}

		if (participants.length === 0) {
			return <span className="no-participants">No participants</span>;
		}

		// Show first participant name, then +count for others
		const firstParticipant = participants[0];
		const remainingCount = participants.length - 1;

		return (
			<div className="participants-display">
				<span className="first-participant">{firstParticipant}</span>
				{remainingCount > 0 && (
					<div className="participant-count-container">
						<span className="participant-count">+{remainingCount}</span>
						<div className="participants-popup">
							<div className="popup-header">Attendees</div>
							<div className="popup-separator"></div>
							<div className="popup-list">
								{participants.map((participant, index) => (
									<div key={index} className="popup-participant">
										<span className="participant-email">{participant}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		);
	};

	const groupedMeetings = groupMeetingsByDate(meetings);

	return (
		<div className='past-meetings-list'>
			{Object.keys(groupedMeetings).map((date) => (
				<div key={date} className='meetings-group'>
					<div className='meetings-group-title'>{date}</div>
					{groupedMeetings[date].map((meeting) => (
						<div
							key={meeting._id}
							className='card-meet-bot-list-item past'
							onClick={() => onMeetingClick(meeting)}
						>
							<div className='card-meet-bot-list-item-header'>
								<div className='card-meet-bot-list-item-title'>{meeting.title}</div>
								<div className='card-meet-bot-list-item-time'>{formatTime(meeting.createdAt)}</div>
							</div>
							<div className='card-meet-bot-list-item-description'>
								{getParticipantsDisplay(meeting)}
							</div>
						</div>
					))}
				</div>
			))}

			{meetings.length === 0 && (
				<div className='card-meet-empty-state'>
					<div className='card-meet-empty-title'>No past meetings</div>
					<div className='card-meet-empty-description'>
						Your completed meetings will appear here
					</div>
				</div>
			)}
		</div>
	);
};



const CardMeetBot = () => {
	const {
		notes: { getExistingBots, createMeetBot, getAllCalendarEventsForMeetings },
		templates: { updateStateValues },
		aiSetup: { proactiveHeadings, getProactiveHeadings },
	} = useContext(Context);
	const navigate = useNavigate();
	const [info, setInfo] = useState({
		modalOpen: false,
		searchOpen: false,
		guideMePopupOpen: false,
		apiFetching: false,
		activeTab: 'upcoming',
		creatingMeetingId: null,
		userSwitchedTab: false, // Track if user manually switched tabs
	});
	const [currentTime, setCurrentTime] = useState(moment.utc());

	const dispatch = useDispatch();
	const { pastMeetings, activeMeetingId, upcomingMeetings } =
		useStore((state) => state.meeting) || {};

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
					const upcomingMeetingTime = meeting?.googleCalendarMeta?.start?.dateTime || meeting.startDateTime;
					if (pastMeeting.createdAt && upcomingMeetingTime) {
						const pastMeetingTime = moment.unix(pastMeeting.createdAt);
						const upcomingTime = moment.utc(upcomingMeetingTime);
						timeMatch = pastMeetingTime.isBetween(
							upcomingTime.clone().subtract(30, 'minutes'),
							upcomingTime.clone().add(30, 'minutes'),
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
		setInfo((prev) => ({ ...prev, activeTab: tab, userSwitchedTab: true }));
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

	// Update current time every minute to refresh meeting status
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(moment.utc());
		}, 60000); // Update every minute

		return () => clearInterval(timer);
	}, []);

	// Auto-switch to past tab only on initial load when no upcoming meetings exist
	useEffect(() => {
		if (
			info.activeTab === 'upcoming' &&
			meetings.length === 0 &&
			!loadingMeetings &&
			!info.userSwitchedTab && // Don't auto-switch if user has manually switched
			upcomingMeetings?.data !== undefined // Only auto-switch if data has been loaded
		) {
			// Small delay to prevent flickering
			const timer = setTimeout(() => {
				setInfo((prev) => ({ ...prev, activeTab: 'past' }));
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [meetings.length, info.activeTab, loadingMeetings, info.userSwitchedTab, upcomingMeetings?.data]);

	// Reset userSwitchedTab flag when upcoming meetings are added
	useEffect(() => {
		if (meetings.length > 0 && info.userSwitchedTab) {
			setInfo((prev) => ({ ...prev, userSwitchedTab: false }));
		}
	}, [meetings.length, info.userSwitchedTab]);






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

			dispatch({
				type: storeActions.meeting.SET_PAST_MEETINGS,
				payload,
			});

			// Remove the upcoming meeting from the upcoming meetings list since it's now created
			if (upcomingMeetings?.data) {
				const updatedUpcomingData = upcomingMeetings.data.filter(
					(upcomingMeeting) => upcomingMeeting._id !== meeting._id,
				);

				dispatch({
					type: storeActions.meeting.SET_UPCOMING_MEETINGS,
					payload: {
						...upcomingMeetings,
						data: updatedUpcomingData,
						totalDocs: Math.max(0, (upcomingMeetings.totalDocs || 0) - 1),
					},
				});
			}

			if (meetingId && window.electronApi) {
				window.electronApi.overlay.startRecording({
					...(response?.[1]?.data?.startMeeting || {}),
				});

				// window.electronApi.minimizeMainWindow();

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
		const startTime = meeting?.googleCalendarMeta?.start?.dateTime || meeting.startDateTime;
		const endTime = meeting?.googleCalendarMeta?.end?.dateTime || meeting.endDateTime;
		const start = toMoment(startTime);
		const end = toMoment(endTime);

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
							{/* Always show both tabs */}
							<div className='card-meet-tab-container'>
								<div
									className={`card-meet-tab-item ${info.activeTab === 'upcoming' ? 'active' : ''}`}
									onClick={() => handleTabChange('upcoming')}
								>
									<div className='card-meet-tab-indicator'></div>
									<div className='card-meet-tab-item-title'>Upcoming</div>
									<div className='card-meet-tab-item-count'>{upcomingMeetings?.data?.length || 0}</div>
								</div>
								<div
									className={`card-meet-tab-item ${info.activeTab === 'past' ? 'active' : ''}`}
									onClick={() => handleTabChange('past')}
								>
									<div className='card-meet-tab-indicator'></div>
									<div className='card-meet-tab-item-title'>Past</div>
									<div className='card-meet-tab-item-count'>{pastMeetings?.data?.length || 0}</div>
								</div>
							</div>

							<div className='card-meet-bot-list'>
								{loadingMeetings ? (
									<div className='card-meet-loading'>
										<Spinner width="20px" height="20px" color="var(--primary-button)" />
										<span>Loading meetings...</span>
									</div>
								) : info.activeTab === 'upcoming' ? (
									// Show upcoming meetings or empty state
									meetings.length > 0 ? (
										<UpcomingMeetingsList
											meetings={meetings}
											onMeetingClick={handleCreateMeetingFromUpcoming}
											creatingMeetingId={info.creatingMeetingId}
											getMeetingStatus={getMeetingStatus}
										/>
									) : (
										<div className='card-meet-empty-state'>
											<div className='card-meet-empty-title'>No upcoming meetings</div>
											<div className='card-meet-empty-description'>
												Your upcoming meetings will appear here
											</div>
										</div>
									)
								) : (
									// Show past meetings or create new meeting option
									pastMeetings?.data && pastMeetings.data.length > 0 ? (
										<PastMeetingsList
											meetings={meetings}
											onMeetingClick={(meeting) => {
												if (activeMeetingId && activeMeetingId === meeting?._id && window.electronApi) {
													navigate('/ongoing-meeting');
												} else {
													navigate(`/meet/${meeting?._id}?type=${meeting?.transcriptionSource}&history=true`);
												}
											}}
										/>
									) : (
										<div className='card-meet-empty-state'>
											<div className='card-meet-empty-title'>No past meetings</div>
											<div className='card-meet-empty-description'>
												Start your first meeting to see it here
											</div>
											<button
												className='create-meeting-btn'
												onClick={() => setInfo((prev) => ({ ...prev, modalOpen: true }))}
											>
												Create New Meeting
											</button>
										</div>
									)
								)}
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
