import { useContext, useRef, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ObjectID from 'bson-objectid';
import Context from '../../../context/context';
import useRecallStream from '../../../hooks/useRecallStream';
import useMeetingAudioRecorder from '../../../hooks/useMeetingAudioRecorder';
import TranscriptionTabs from '../../components/notes/TranscriptionTabs';
import MeetSummary from '../notesModule/MeetSummary';
import NoteTakerTranscript from '../notesModule/NoteTakerTranscript';
import AssemblyTranscriptWrapper from '../assembly-transcription/AssemblyTranscriptWrapper';
import AiTranscriptionSuggestions from '../../components/chat/AiTranscriptionSuggestions';
import TranscriptionWrapper from '../notesModule/TranscriptionWrapper';
import AudioPlayback from '../../components/notes/AudioPlayback';
import audioStorageService from '../../../services/audioStorageService';
import '../../../assets/scss/notes/noteComponent.scss';
import { ReactComponent as ShareIcon } from '../../../assets/svg/docs/meetshare.svg';
import { ReactComponent as DotIcon } from '../../../assets/svg/docs/dot.svg';
import { ReactComponent as ClockPersonIcon } from './clockPerson.svg';
import './meetBot.scss';
import './meetBotContainer.scss';
import moment from 'moment';
import Spinner from '../../components/loaders/Spinner';
import InfiniteScroll from '../../components/globalComponents/InfiniteScroll';
import { StepForward, Trash2 } from 'lucide-react';
import DeleteModal from '../../components/modalsV2/DeleteModal/DeleteModal';
import MeetingAnalytics from './MeetingAnalytics';
import CustomTextArea from '../../components/globalComponents/CustomTextArea';
import { debounce } from 'lodash';
import ChatBox from '../../components/chat/ChatBox';

const initialState = {
	files: [],
	userQuestions: [],
	aiQuestions: [],
	actions: [],
	allSuggestions: [],
	sessionId: ObjectID()?.toString(),
	chatSessionId: ObjectID()?.toString(),
	chatClicked: false,
	transcriptions: [],
	transcriptionsPage: 1,
	transcriptionsHasMore: true,
	transcriptionsLoading: true,
	botJoined: false,
	botJoinedTime: 0,
	meetingPlatform: '',
	hasAudioRecording: false,
	audioRecordingStarted: false,
	isDeleteModalOpen: false,
	isDeleteModalLoading: false,
	meetingTitle: '',
};
const userToken = localStorage.getItem('usertoken');
const getSpeakerColor = (speakerName) => {
	if (!speakerName) return '#9e9e9e';

	// Deterministic color based on name
	const colors = [
		'#FF5733', // Red-Orange
		'#33C4FF', // Blue
		'#33FF57', // Green
		'#FF33A8', // Pink
		'#B833FF', // Purple
		'#FFC300', // Yellow
		'#33FFF6', // Cyan
		'#FF8C33', // Orange
		'#7D33FF', // Indigo
		'#33FFAA', // Mint
	];

	// Generate a hash of the speaker name
	let hash = 0;
	for (let i = 0; i < speakerName.length; i++) {
		hash = speakerName.charCodeAt(i) + ((hash << 5) - hash);
	}

	// Use hash to pick a consistent color
	const index = Math.abs(hash) % colors.length;
	return colors[index];
};

const infiniteScrollStyles = {
	width: '100%',
	paddingBottom: 80,
};

const MeetBotContainer = ({ showTranscriptTabs = false }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const meetingId = useParams()?.meetingId;
	const sentinalScrollRef = useRef(null);
	const sessionId = meetingId;
	const type = searchParams.get('type');
	const history = searchParams.get('history') === 'true' ? true : false;
	const chat = searchParams.get('chat') === 'true' ? true : false;
	const transcription = searchParams.get('transcription') === 'true' ? true : false;
	const useAssemblyAI =
		searchParams.get('useAssemblyAI') === 'true' ||
		(type === 'in_app_meeting' && searchParams.get('useAssemblyAI') !== 'false');
	const isAiIntelligenceEnabled =
		searchParams.get('isAiIntelligenceEnabled') === 'true' ? true : false;

	const valuesInitializedRef = useRef(false);

	const navigate = useNavigate();

	// Audio recording hook
	const {
		isRecording,
		startRecording,
		stopRecording,
		pauseRecording,
		resumeRecording,
		audioBlob,
		recordingDuration,
		error: audioError,
		getAudioInfo,
		formatDuration,
	} = useMeetingAudioRecorder(meetingId);

	const {
		notes: {
			getMeetTranscriptHistory,
			aiLiveIntelligenceHistory,
			getAiLiveIntelligenceHistory,
			updateStateValues: updateNotesStateValues,
			createBotInfo,
			getMeetBotById,
			getMeetSummary,
			meetSummary,
			deleteMeeting,
			updateMeeting,
		},
		templates: {
			handleTranscriptionSuggestions,
			aiTranscriptionSuggestions,
			updateStateValues,
		},
		profileInfo: { tennantSettingsData, getTenantSettings },
	} = useContext(Context);

	const [info, setInfo] = useState(initialState);
	const [transcriptList, setTranscriptList] = useState([]);
	const [activeTab, setActiveTab] = useState(type === 'in_app_meeting' ? 'summary' : 'summary');
	const [isLoadingHistory, setIsLoadingHistory] = useState(false);

	// Check if audio recording exists for this meeting
	const checkAudioRecording = useCallback(async () => {
		try {
			console.log('Checking audio recording for meeting:', meetingId);
			const hasAudio = await audioStorageService.hasAudio(meetingId);
			console.log('Audio recording exists:', hasAudio);
			setInfo((prev) => ({ ...prev, hasAudioRecording: hasAudio }));
		} catch (error) {
			console.error('Error checking audio recording:', error);
		}
	}, [meetingId]);

	// Save audio when recording stops
	const saveAudioRecording = useCallback(async () => {
		if (!audioBlob) {
			console.log('No audio blob to save');
			return;
		}

		try {
			console.log('Saving audio for meeting:', meetingId, 'Blob size:', audioBlob.size);
			const result = await audioStorageService.saveAudio(meetingId, audioBlob);
			if (result.success) {
				setInfo((prev) => ({ ...prev, hasAudioRecording: true }));
				console.log('Audio saved successfully:', result.filePath);
			} else {
				console.error('Failed to save audio:', result.error);
			}
		} catch (error) {
			console.error('Error saving audio:', error);
		}
	}, [audioBlob, meetingId]);

	// Start audio recording when meeting starts (for live meetings)
	const initializeAudioRecording = useCallback(async () => {
		console.log(
			'initializeAudioRecording called - history:',
			history,
			'audioRecordingStarted:',
			info.audioRecordingStarted,
		);
		if (!history && !info.audioRecordingStarted) {
			try {
				console.log('Starting audio recording for meeting:', meetingId);
				await startRecording();
				setInfo((prev) => ({ ...prev, audioRecordingStarted: true }));
				console.log('Audio recording started successfully');
			} catch (error) {
				console.error('Error starting audio recording:', error);
			}
		}
	}, [history, info.audioRecordingStarted, startRecording, meetingId]);

	// Stop audio recording when meeting ends
	const stopAudioRecording = useCallback(async () => {
		if (isRecording) {
			try {
				await stopRecording();
				// Audio will be saved automatically when recording stops
			} catch (error) {
				console.error('Error stopping audio recording:', error);
			}
		}
	}, [isRecording, stopRecording]);
	const [isLoadingMeetingDetails, setIsLoadingMeetingDetails] = useState(false);
	const [meetingNotFound, setMeetingNotFound] = useState(false);
	const location = useLocation();

	// Convert hashmap to categorized arrays for UI
	const categorizeLiveIntelligenceData = useCallback((hashmap) => {
		const allThreads = [];
		const askUser = [];
		const needHelp = [];
		const actions = [];
		const files = [];

		Object.values(hashmap || {}).forEach((suggestion) => {
			if (suggestion?.entity === 'user' || suggestion?.entity === 'other_user') {
				askUser.push(suggestion);
			} else if (suggestion?.entity === 'agent' && suggestion?.type === 'search') {
				needHelp.push(suggestion);
			} else if (suggestion?.entity === 'agent' && suggestion?.type === 'action') {
				actions.push(suggestion);
			} else if (suggestion?.entity === 'file') {
				files.push(suggestion);
			}
			allThreads.push(suggestion);
		});

		// Sort by timestamp (newest first)
		const sortByTimestamp = (a, b) => new Date(b?.timestamp || 0) - new Date(a?.timestamp || 0);

		return {
			askUser: askUser.sort(sortByTimestamp),
			needHelp: needHelp.sort(sortByTimestamp),
			actions: actions.sort(sortByTimestamp),
			files: files.sort(sortByTimestamp),
			allThreads: allThreads.sort(sortByTimestamp),
		};
	}, []);

	// Add hooks for live intelligence and recall stream
	const {
		createWebSocketConnection: recallConnection,
		sendMessage: recallSendMessage,
		closeWebSocketConnection: closeRecallConnection,
	} = useRecallStream();

	const handleActionClick = useCallback(
		(data) => {
			const newParams = new URLSearchParams(searchParams);
			newParams.set('chat', 'true');
			setSearchParams(newParams);
			updateStateValues({
				activePayloadForChat: data,
			});
		},
		[sessionId],
	);

	// useEffect(() => {
	// 	if (!aiLiveIntelligenceHistory) {
	// 		getAiLiveIntelligenceHistory({ meetingId: meetingId, limit: 20, page: 1 }, false);
	// 	} else {
	// 		handleTranscriptionSuggestions({ data: aiLiveIntelligenceHistory?.data || [] });
	// 	}
	// }, [aiLiveIntelligenceHistory]);
	// Function to fetch historical transcriptions for desktop
	const fetchHistoricalTranscriptions = useCallback(async () => {
		if (!meetingId || !showTranscriptTabs || type !== 'in_app_meeting') return;

		setIsLoadingHistory(true);
		try {
			// Fetch historical transcriptions for desktop
			const response = await getMeetTranscriptHistory(
				{ meetingId: meetingId, limit: 20, page: 1 },
				false,
			);
			if (response?.[0]) {
				const rawData = response[1]?.data?.listTranscriptions?.data || [];
				const hasMore = response[1]?.data?.listTranscriptions?.hasNextPage;

				// Transform the data to match UI expectations
				const transformedData = rawData.map((item) => ({
					...item,
					text: item.transcript, // Map transcript to text
					time: item.createdAt
						? new Date(parseInt(item.createdAt) * 1000).toLocaleTimeString()
						: '', // Convert timestamp to readable time
					speakerName: item.speakerName || 'Note Taker', // Default speaker name
				}));

				setInfo((prev) => ({
					...prev,
					transcriptions: transformedData,
					transcriptionsHasMore: hasMore,
					transcriptionsPage: 1,
					transcriptionsLoading: false,
				}));
			} else {
				setInfo((prev) => ({
					...prev,
					transcriptions: [],
					transcriptionsLoading: false,
				}));
			}
		} catch (error) {
			console.error('Error fetching historical transcriptions:', error);
			setInfo((prev) => ({
				...prev,
				transcriptions: [],
				transcriptionsLoading: false,
			}));
		} finally {
			setIsLoadingHistory(false);
		}
	}, [meetingId, showTranscriptTabs, type]);

	// Function to fetch historical transcriptions for meeting_bot
	const fetchMeetingBotTranscriptions = useCallback(async () => {
		if (!meetingId || !showTranscriptTabs || type !== 'third_party_meeting') return;

		try {
			const response = await getMeetTranscriptHistory(
				{ meetingId: meetingId, limit: 20, page: 1 },
				false,
			);
			if (response?.[0]) {
				const rawData = response[1]?.data?.listTranscriptions?.data || [];
				// Transform the data to match the existing transcriptList format
				const transformedData = rawData.map((item) => ({
					...item,
					text: item.transcript,
					time: item.createdAt
						? new Date(parseInt(item.createdAt) * 1000).toLocaleTimeString()
						: '',
					speakerName: item.speakerName || 'Note Taker',
				}));

				setTranscriptList(transformedData);
			} else {
				setTranscriptList([]);
			}
			handleInfoChange({ transcriptionsLoading: false });
		} catch (error) {
			console.error('Error fetching meeting bot transcriptions:', error);
			setTranscriptList([]);
			handleInfoChange({ transcriptionsLoading: false });
		}
	}, [meetingId, showTranscriptTabs, type, getMeetTranscriptHistory]);

	// Process aiTranscriptionSuggestions with simplified logic
	useEffect(() => {
		if (aiTranscriptionSuggestions && aiTranscriptionSuggestions?.suggestions?.length > 0) {
			const allThreads = [];
			const askUser = [];
			const needHelp = [];
			const actions = [];
			const files = [];
			aiTranscriptionSuggestions.suggestions.forEach((suggestion) => {
				if (suggestion.entity === 'user') {
					askUser.push(suggestion);
				} else if (suggestion.entity === 'agent' && suggestion.type === 'search') {
					needHelp.push(suggestion);
				} else if (suggestion.entity === 'agent' && suggestion.type === 'action') {
					actions.push(suggestion);
				} else if (suggestion.entity === 'file') {
					files.push(suggestion);
				}
				allThreads.push(suggestion);
			});

			setInfo((prev) => ({
				...prev,
				userQuestions: askUser,
				aiQuestions: needHelp,
				actions,
				files,
				allSuggestions: allThreads,
			}));
		}
	}, [aiTranscriptionSuggestions]);

	useEffect(() => {
		return () => {
			updateNotesStateValues({
				meetSummary: null,
				aiLiveIntelligenceHistory: null,
				transcriptHistory: null,
			});
			updateStateValues({
				aiTranscriptionSuggestions: null,
			});
		};
	}, []);

	useEffect(() => {
		if (transcriptList?.length > 0) {
			updateNotesStateValues({
				transcriptionList: transcriptList,
			});
		}
	}, [transcriptList]);

	// Fetch meeting details if not available
	useEffect(() => {
		if (meetingId && (!createBotInfo || createBotInfo?._id !== meetingId)) {
			setIsLoadingMeetingDetails(true);
			setMeetingNotFound(false);
			getMeetBotById({ meetingId }).finally(() => {
				setIsLoadingMeetingDetails(false);
			});
		}
	}, [createBotInfo, meetingId]);

	// Check if meeting was not found after loading
	useEffect(() => {
		if (!isLoadingMeetingDetails && !createBotInfo && meetingId) {
			setMeetingNotFound(true);
		}
	}, [isLoadingMeetingDetails, createBotInfo, meetingId]);

	useEffect(() => {
		if (createBotInfo) {
			if (!valuesInitializedRef.current) {
				valuesInitializedRef.current = true;
				setInfo((prev) => ({
					...prev,
					botJoined: createBotInfo?.status === 'live',
					botJoinedTime: createBotInfo?.botJoinedAt,
					meetingPlatform: createBotInfo?.meetingPlatform,
					meetingTitle: createBotInfo?.title,
				}));
			}
		}
	}, [createBotInfo]);

	useEffect(() => {
		if ((activeTab === 'summary' || activeTab === 'all') && !meetSummary) {
			getMeetSummary({ meetingId });
		}
	}, [activeTab, meetSummary]);

	useEffect(() => {
		if (meetSummary) {
			handleTranscriptionSuggestions({
				revampedPrompt: meetSummary?.revampedPrompt,
			});
		}
	}, [meetSummary]);

	// Fetch historical data when component mounts
	useEffect(() => {
		fetchHistoricalTranscriptions();
		// Also fetch meeting bot transcriptions if needed
		if (type === 'third_party_meeting' && showTranscriptTabs) {
			fetchMeetingBotTranscriptions();
		}
	}, []);

	// useEffect(() => {
	// 	if (showTranscriptTabs && location?.pathname?.includes('meet') && type === 'meeting_bot') {
	// 		recallConnection(sessionId, meetingId, handleSocketMessage, isAiIntelligenceEnabled);
	// 		// createLiveIntelligenceStream(
	// 		// 	sessionId,
	// 		// 	noteId,
	// 		// 	handleLiveIntelligenceMessageFunc,
	// 		// 	false,
	// 		// );
	// 	}
	// 	//  else if (showTranscriptTabs && type === 'desktop') {
	// 	// 	// Connect to recall for note taker mode as well
	// 	// 	recallConnection(sessionId, meetingId, handleSocketMessage, isAiIntelligenceEnabled);
	// 	// }
	// 	// No cleanup needed, useRecallStream handles it
	// }, [showTranscriptTabs, sessionId, type]);

	useEffect(() => {
		if (showTranscriptTabs && type === 'in_app_meeting' && !history) {
			sentinalScrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [info?.transcriptions?.length]);

	const handleShowAiTranscriptionSuggestions = () => {
		setInfo((prev) => ({
			...prev,
			showAiTranscriptionSuggestions: !prev.showAiTranscriptionSuggestions,
		}));
	};

	const updateTranscriptionHelper = (transcriptionArray, newTranscript) => {
		const { source } = newTranscript;

		if (transcriptionArray.length > 0) {
			// Find the most recent transcript from the same source
			for (let i = transcriptionArray.length - 1; i >= 0; i--) {
				if (transcriptionArray[i].source === source) {
					const oldTranscript = transcriptionArray[i];

					// Logic based on the state of the previous transcript:
					// - Final AND formatted → Append new transcript (start new entry)
					// - Final but NOT formatted → Replace with new transcript
					// - Not final → Replace with new transcript
					if (oldTranscript.isFinal && oldTranscript.isTurnFormatted) {
						return [...transcriptionArray, newTranscript];
					} else {
						// Replace existing transcript (whether final-unformatted or not-final)
						const updatedArray = [...transcriptionArray];
						updatedArray[i] = newTranscript;
						return updatedArray;
					}
				}
			}
		}

		// If no match found or array is empty, append the new transcript
		return [...transcriptionArray, newTranscript];
	};

	const handleUpdateTranscription = (newTranscript) => {
		setInfo((prev) => ({
			...prev,
			transcriptions: updateTranscriptionHelper(prev.transcriptions, newTranscript),
		}));
	};

	const fetchTranscriptionHistory = useCallback(
		async (page = 1, append = false) => {
			setInfo((prev) => ({ ...prev, transcriptionsLoading: true }));
			try {
				const response = await getMeetTranscriptHistory(
					{ meetingId: meetingId, limit: 20, page },
					append,
				);
				if (response?.[0]) {
					const rawData = response[1]?.data?.listTranscriptions?.data || [];
					const hasMore = response[1]?.data?.listTranscriptions?.hasNextPage;

					// Transform the data to match UI expectations
					const transformedData = rawData.map((item) => ({
						...item,
						text: item.transcript, // Map transcript to text
						time: item.createdAt
							? new Date(parseInt(item.createdAt) * 1000).toLocaleTimeString()
							: '', // Convert timestamp to readable time
						speakerName: item.speakerName || 'Note Taker', // Default speaker name
					}));

					setInfo((prev) => ({
						...prev,
						transcriptions: append
							? [...(prev.transcriptions || []), ...transformedData]
							: transformedData,
						transcriptionsHasMore: hasMore,
						transcriptionsPage: page,
						transcriptionsLoading: false,
					}));
				} else {
					setInfo((prev) => ({ ...prev, transcriptionsLoading: false }));
				}
			} catch {
				setInfo((prev) => ({ ...prev, transcriptionsLoading: false }));
			}
		},
		[meetingId],
	);

	const loadMoreTranscriptions = () => {
		if (info.transcriptionsLoading || !info.transcriptionsHasMore) return;
		fetchTranscriptionHistory((info.transcriptionsPage || 1) + 1, true);
	};

	useEffect(() => {
		if (activeTab === 'transcript' && history) {
			fetchTranscriptionHistory(1, false);
		}
	}, [activeTab]);

	// Check for existing audio recording when component mounts
	useEffect(() => {
		if (meetingId) {
			checkAudioRecording();
		}
	}, [meetingId, checkAudioRecording]);

	// Save audio when recording stops
	useEffect(() => {
		if (audioBlob && !isRecording) {
			saveAudioRecording();
		}
	}, [audioBlob, isRecording, saveAudioRecording]);

	// Start audio recording for live meetings
	useEffect(() => {
		if (!history && meetingId && !info.audioRecordingStarted) {
			// Small delay to ensure meeting is properly initialized
			const timer = setTimeout(() => {
				initializeAudioRecording();
			}, 2000);
			return () => clearTimeout(timer);
		}
	}, [history, meetingId, info.audioRecordingStarted, initializeAudioRecording]);

	// Cleanup audio recording on unmount
	useEffect(() => {
		return () => {
			if (isRecording) {
				stopAudioRecording();
			}
		};
	}, [isRecording, stopAudioRecording]);

	const handleInfoChange = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	};

	const handleChatBoxClick = (e) => {
		e.stopPropagation();
		const newParams = new URLSearchParams(searchParams);
		newParams.set('chat', 'true');
		setSearchParams(newParams);
	};

	// useEffect(() => {
	// 	console.log('info.transcriptions', info.transcriptions);
	// }, [info.transcriptions]);

	const toggleDeleteModal = (value) => {
		setInfo((prev) => ({ ...prev, isDeleteModalOpen: value }));
	};

	const handleDeleteMeeting = async () => {
		if (info?.isDeleteModalLoading) return;
		setInfo((prev) => ({ ...prev, isDeleteModalLoading: true }));
		await deleteMeeting({ meetingId });
		toggleDeleteModal(false);
		setInfo((prev) => ({ ...prev, isDeleteModalLoading: false }));
		navigate('/meet');
	};

	const debouncedUpdateMeetingTitle = useCallback(
		debounce(async (title) => {
			if (!title.trim()) return; // Don't save empty titles

			setInfo((prev) => ({ ...prev, isSaving: true, saveStatus: 'saving' }));

			const result = await updateMeeting({
				meetingId: meetingId,
				input: {
					title: title,
				},
			});
		}, 500), // 500ms debounce delay
		[meetingId],
	);

	// Handle input change
	const handleTitleChange = (e) => {
		const newTitle = e.target.value;

		// Update local state immediately
		setInfo((prev) => ({
			...prev,
			meetingTitle: newTitle,
		}));

		// Trigger debounced API call
		debouncedUpdateMeetingTitle(newTitle);
	};

	const handleResumeMeeting = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set('history', 'false');
		setSearchParams(newParams, { replace: true });
		setActiveTab('all');
		if (window.electronApi) {
			window.electronApi.overlay.startRecording(createBotInfo);
			window.electronApi.minimizeMainWindow();
		}
	};

	// Cleanup debounced function on unmount
	useEffect(() => {
		return () => {
			debouncedUpdateMeetingTitle.cancel();
		};
	}, [debouncedUpdateMeetingTitle]);

	return (
		<div className="meetbot-container">
			<div className="meeting-header">
				{isLoadingMeetingDetails ? (
					<div className="meeting-loading">
						<div className="loading-spinner"></div>
						<span>Loading meeting details...</span>
					</div>
				) : createBotInfo ? (
					<div className="meeting-info">
						<div className="meeting-title-container">
							<div className="meeting-title-input-container">
								<CustomTextArea
									value={info?.meetingTitle}
									onChange={handleTitleChange}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault();
											// handleUpdateMeetingTitle();
										}
									}}
									autoResize={true}
									placeholder="Enter meeting title"
									replacePlaceholder={true}
									className="meeting-title"
								/>
								{/* <h2 className="meeting-title">{createBotInfo.title}</h2> */}
								<span className="meeting-created-by-time">
									{moment
										.unix(createBotInfo?.createdAt)
										.format('dddd, MMMM D, YYYY')}
								</span>
							</div>

							{/* {createBotInfo?.createdBy && (
								<div className="meeting-meta-info">
									<span className="meeting-created-by-name">
										{createBotInfo?.createdBy?.name}
									</span>
									<DotIcon />
									<span className="meeting-created-by-email">
										{createBotInfo?.createdBy?.email}
									</span>
									<DotIcon />
									<span className="meeting-created-by-time">
										{moment
											.unix(createBotInfo?.createdAt)
											.format('DD MMM YYYY HH:mm')}
									</span>
								</div>
							)} */}
							<button
								className="delete-meeting-button"
								onClick={() => toggleDeleteModal(true)}
							>
								<Trash2 size={18} style={{ color: 'var(--error)' }} />
							</button>
						</div>
						{showTranscriptTabs && (
							<TranscriptionTabs
								activeTab={activeTab}
								setActiveTab={setActiveTab}
								userQuestions={info?.userQuestions}
								aiQuestions={info?.aiQuestions}
								actions={info?.actions}
								files={info?.files}
								history={history}
								allSuggestions={info?.allSuggestions}
								type={type}
							/>
						)}
					</div>
				) : meetingNotFound ? (
					<div className="meeting-error">
						<span>Meeting not found</span>
					</div>
				) : null}
			</div>
			<div className="transcript-tabs-container">
				{/* {showTranscriptTabs && (
					<TranscriptionTabs
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						userQuestions={info?.userQuestions}
						aiQuestions={info?.aiQuestions}
						actions={info?.actions}
						files={info?.files}
						history={history}
						allSuggestions={info?.allSuggestions}
						type={type}
						hasAudioRecording={info?.hasAudioRecording}
					/>
				)}
				{/* Debug info */}
				{(() => {
					console.log(
						'TranscriptionTabs props - hasAudioRecording:',
						info?.hasAudioRecording,
						'history:',
						history,
					);
					return null;
				})()}
				{showTranscriptTabs &&
					activeTab === 'transcript' &&
					(type === 'in_app_meeting' || type === 'third_party_meeting') && (
						// <div style={{ paddingBottom: 80, width: '100%' }}>
						<div className="transcript-list-container">
							{info.transcriptionsLoading && info.transcriptions?.length === 0 ? (
								<div className="meet-transcript-empty">
									<Spinner size={24} />
								</div>
							) : info.transcriptions && info.transcriptions.length === 0 ? (
								<div className="meet-transcript-empty">No transcript yet.</div>
							) : (
								<InfiniteScroll
									dataLength={info.transcriptions?.length || 0}
									next={loadMoreTranscriptions}
									hasMore={!history ? false : info.transcriptionsHasMore}
									height={'100%'}
									style={infiniteScrollStyles}
									loader={
										<div className="infinite-loader-container">
											{<Spinner size={24} />}
										</div>
									}
								>
									<div className="meet-transcript-list">
										{info.transcriptions?.map((item, idx) => (
											<div
												className={`meet-transcript-item`}
												key={item._id || item.id || idx}
											>
												<div className="meet-transcript-meta">
													{type === 'third_party_meeting' && (
														<span
															className="avatar"
															style={{
																backgroundColor: getSpeakerColor(
																	item.source,
																),
															}}
														>
															{item.source === 'mic' ? 'Y' : 'S'}
														</span>
													)}

													<span className="meet-transcript-participant">
														{item.source === 'mic' ? 'You' : 'Screen'}
													</span>
													<DotIcon />
													<span className="meet-transcript-time">
														<ClockPersonIcon />
														{item.time || ''}
													</span>
												</div>
												<div className="meet-transcript-text">
													{item.text || item.transcript || ''}
												</div>
											</div>
										))}
									</div>
									<div className="sentinalScrollRef" ref={sentinalScrollRef} />
								</InfiniteScroll>
							)}
						</div>
					)}
				{showTranscriptTabs && activeTab === 'summary' && (
					<MeetSummary activeTab={activeTab} meetingId={meetingId} />
				)}
				{showTranscriptTabs && activeTab === 'analytics' && (
					<MeetingAnalytics meetingId={meetingId} />
				)}

				{showTranscriptTabs && activeTab === 'audio' && (
					<div className="audio-tab-container">
						<AudioPlayback meetingId={meetingId} />
					</div>
				)}

				{(showTranscriptTabs || info?.showAiTranscriptionSuggestions) &&
					(activeTab === 'userQuestions' ||
						activeTab === 'aiQuestions' ||
						activeTab === 'actions' ||
						activeTab === 'files' ||
						activeTab === 'all') && (
						<AiTranscriptionSuggestions
							userQuestions={info?.userQuestions}
							aiQuestions={info?.aiQuestions}
							actions={info?.actions}
							files={info?.files}
							activeTab={activeTab}
							allSuggestions={info?.allSuggestions}
						/>
					)}

				{showTranscriptTabs && type === 'third_party_meeting' && !history && (
					<TranscriptionWrapper
						chat={chat}
						transcription={transcription}
						transcriptList={transcriptList}
						botJoined={info?.botJoined}
						botJoinedTime={info?.botJoinedTime}
						meetingPlatform={info?.meetingPlatform}
					/>
				)}
				{/* Always render NoteTakerTranscript or AssemblyTranscript at the root level */}
				{showTranscriptTabs && type === 'in_app_meeting' && !history && !useAssemblyAI && (
					<NoteTakerTranscript
						sendMessage={recallSendMessage}
						tenantId={tennantSettingsData?._id}
						sessionId={sessionId}
						pageId={'688b653dde81dd3d71a41584'}
						visible={activeTab === 'transcript'}
						onTranscriptionUpdate={handleUpdateTranscription}
					/>
				)}
				{/* Assembly AI Transcription option */}
				{/* {showTranscriptTabs && type === 'desktop' && !history && useAssemblyAI && (
					<AssemblyTranscriptWrapper
						handleLiveIntelligenceResponse={handleTranscriptionSuggestions}
						tenantId={tennantSettingsData?._id}
						sessionId={sessionId}
						visible={activeTab === 'transcript'}
						onTranscriptionUpdate={handleUpdateTranscription}
						jwtToken={userToken}
						isAiIntelligenceEnabled={isAiIntelligenceEnabled}
					/>
				)} */}

				{history && (
					<div className="chatbox-wrapper">
						{/* <button className="resume-meeting-button" onClick={handleResumeMeeting}>
							<StepForward size={18} />
							Resume
						</button> */}
						{!chat && (
							<div className="chatbox-container">
								<ChatBox
									onSend={handleActionClick}
									customChatActions={true}
									showUpgradeSubscriptionBtn={false}
									sessionId={sessionId}
									animateChatBox={false}
									placeholder="Ask anything about the meeting"
									showBottomTools={false}
								/>
							</div>
						)}
					</div>
				)}
			</div>

			<DeleteModal
				isOpen={info?.isDeleteModalOpen}
				onClose={() => toggleDeleteModal(false)}
				onConfirm={handleDeleteMeeting}
				title="Delete Meeting?"
				description="Are you sure you want to delete this meeting?"
				warning="This action cannot be undone"
				cancelText="Cancel"
				confirmText="Delete Permanently"
				itemType="meeting"
			/>
		</div>
	);
};

export default MeetBotContainer;
