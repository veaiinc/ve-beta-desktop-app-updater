import { useContext, useRef, useState, useEffect, useCallback } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
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
import assemblyAIService from '../../../services/assemblyaiService';
import '../../../assets/scss/notes/noteComponent.scss';
import { ReactComponent as ShareIcon } from '../../../assets/svg/docs/meetshare.svg';
import { ReactComponent as DotIcon } from '../../../assets/svg/docs/dot.svg';
import { ReactComponent as ClockPersonIcon } from './clockPerson.svg';
import './meetBot.scss';
import './meetBotContainer.scss';
import moment from 'moment';
import Spinner from '../../components/loaders/Spinner';
import InfiniteScroll from '../../components/globalComponents/InfiniteScroll';

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
		(type === 'desktop' && searchParams.get('useAssemblyAI') !== 'false');
	const isAiIntelligenceEnabled =
		searchParams.get('isAiIntelligenceEnabled') === 'true' ? true : false;

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
	const [activeTab, setActiveTab] = useState(type === 'desktop' ? 'all' : 'all');
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
	const [assemblyaiApiKey, setAssemblyaiApiKey] = useState('');
	const [isUploadingToAssemblyAI, setIsUploadingToAssemblyAI] = useState(false);
	const [assemblyaiUploadStatus, setAssemblyaiUploadStatus] = useState(null);
	const location = useLocation();

	// Add hooks for live intelligence and recall stream
	const {
		createWebSocketConnection: recallConnection,
		sendMessage: recallSendMessage,
		closeWebSocketConnection: closeRecallConnection,
	} = useRecallStream();

	// useEffect(() => {
	// 	if (!aiLiveIntelligenceHistory) {
	// 		getAiLiveIntelligenceHistory({ meetingId: meetingId, limit: 20, page: 1 }, false);
	// 	} else {
	// 		handleTranscriptionSuggestions({ data: aiLiveIntelligenceHistory?.data || [] });
	// 	}
	// }, [aiLiveIntelligenceHistory]);
	// Function to fetch historical transcriptions for desktop
	const fetchHistoricalTranscriptions = useCallback(async () => {
		if (!meetingId || !showTranscriptTabs || type !== 'desktop') return;

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
		if (!meetingId || !showTranscriptTabs || type !== 'meeting_bot') return;

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

	useEffect(() => {
		if (aiTranscriptionSuggestions) {
			const userQuestions = [];
			const aiQuestions = [];
			const actions = [];
			const files = [];

			for (const suggestion of aiTranscriptionSuggestions?.suggestions || []) {
				if (suggestion?.entity === 'user' || suggestion?.entity === 'other_user') {
					userQuestions.push(suggestion);
				} else if (
					suggestion?.entity === 'agent' ||
					suggestion?.entity?.includes('agent')
				) {
					if (suggestion?.type === 'search') {
						aiQuestions.push(suggestion);
					} else if (suggestion?.type === 'action') {
						actions.push(suggestion);
					}
				} else if (suggestion?.entity === 'file') {
					files.push(suggestion);
				}
			}

			setInfo((prev) => ({
				...prev,
				userQuestions,
				aiQuestions,
				actions,
				files,
				allSuggestions: aiTranscriptionSuggestions?.suggestions || [],
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
			setInfo((prev) => ({
				...prev,
				botJoined: createBotInfo?.status === 'live',
				botJoinedTime: createBotInfo?.botJoinedAt,
				meetingPlatform: createBotInfo?.meetingPlatform,
			}));
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

	// When new socket data comes in:
	// const handleSocketTranscription = useCallback(
	// 	(newTranscript) => {
	// 		const lastTranscript = info.transcriptions?.at(-1);
	// 		console.log(lastTranscript, info?.transcriptions);

	// 		setInfo((prev) => {
	// 			const transcriptions = prev.transcriptions || [];

	// 			// Get the transcript text from various possible sources
	// 			const transcriptText =
	// 				newTranscript.transcript ||
	// 				newTranscript.displayedText ||
	// 				newTranscript.text ||
	// 				'';

	// 			// Check if this transcript already exists (to avoid duplicates)
	// 			const existingTranscript = transcriptions.find(
	// 				(t) =>
	// 					t.text === transcriptText ||
	// 					t.transcript === transcriptText ||
	// 					t.id === newTranscript.id, // Also check by ID
	// 			);

	// 			if (existingTranscript) {
	// 				return prev; // Don't add duplicate
	// 			}

	// 			// Check if this is a continuation of the last transcript (same session)
	// 			const lastTranscript = transcriptions[transcriptions.length - 1];
	// 			const isContinuation = lastTranscript && !lastTranscript.isFinal;

	// 			// console.log('is continuation', isContinuation);

	// 			if (!newTranscript.isFinal) {
	// 				// Partial transcript - update the last entry if it's a continuation
	// 				if (isContinuation) {
	// 					// Update the last entry with the new partial text
	// 					const updated = [...transcriptions];
	// 					updated[updated.length - 1] = {
	// 						...updated[updated.length - 1],
	// 						...newTranscript,
	// 						text: transcriptText,
	// 						transcript: transcriptText,
	// 						time: new Date().toLocaleTimeString(),
	// 					};
	// 					return { ...prev, transcriptions: updated };
	// 				} else {
	// 					// New partial transcript - add as new entry
	// 					return {
	// 						...prev,
	// 						transcriptions: [
	// 							...transcriptions,
	// 							{
	// 								...newTranscript,
	// 								text: transcriptText,
	// 								transcript: transcriptText,
	// 								time: new Date().toLocaleTimeString(),
	// 							},
	// 						],
	// 					};
	// 				}
	// 			} else {
	// 				// Final transcript - update the last entry if it's a continuation, otherwise append
	// 				if (isContinuation) {
	// 					// Finalize the last entry
	// 					const updated = [...transcriptions];
	// 					updated[updated.length - 1] = {
	// 						...updated[updated.length - 1],
	// 						...newTranscript,
	// 						text: transcriptText,
	// 						transcript: transcriptText,
	// 						time: new Date().toLocaleTimeString(),
	// 						isFinal: true,
	// 					};
	// 					return { ...prev, transcriptions: updated };
	// 				} else {
	// 					// New final transcript - append as new entry
	// 					return {
	// 						...prev,
	// 						transcriptions: [
	// 							...transcriptions,
	// 							{
	// 								...newTranscript,
	// 								text: transcriptText,
	// 								transcript: transcriptText,
	// 								time: new Date().toLocaleTimeString(),
	// 								isFinal: true,
	// 							},
	// 						],
	// 					};
	// 				}
	// 			}
	// 		});
	// 	},
	// 	[info.transcriptions],
	// );

	const handleSocketTranscription = (newTranscript) => {
		setInfo((prev) => {
			const transcriptions = prev.transcriptions || [];

			// Get the transcript text from various possible sources
			const transcriptText =
				newTranscript.transcript || newTranscript.displayedText || newTranscript.text || '';

			// Check if this transcript already exists (to avoid duplicates)
			const existingTranscript = transcriptions.find(
				(t) =>
					t.text === transcriptText ||
					t.transcript === transcriptText ||
					t.id === newTranscript.id, // Also check by ID
			);

			if (existingTranscript) {
				return prev; // Don't add duplicate
			}

			// Check if this is a continuation of the last transcript (same session)
			const lastTranscript = transcriptions[transcriptions.length - 1];
			let isContinuation = false;
			if (newTranscript?.isTurnFormatted) {
				isContinuation = true;
			} else {
				isContinuation = lastTranscript && !lastTranscript.isFinal;
			}

			if (!newTranscript.isFinal) {
				// Partial transcript - update the last entry if it's a continuation
				if (isContinuation) {
					// Update the last entry with the new partial text
					const updated = [...transcriptions];
					updated[updated.length - 1] = {
						...updated[updated.length - 1],
						...newTranscript,
						text: transcriptText,
						transcript: transcriptText,
						time: new Date().toLocaleTimeString(),
					};
					return { ...prev, transcriptions: updated };
				} else {
					// New partial transcript - add as new entry
					return {
						...prev,
						transcriptions: [
							...transcriptions,
							{
								...newTranscript,
								text: transcriptText,
								transcript: transcriptText,
								time: new Date().toLocaleTimeString(),
							},
						],
					};
				}
			} else {
				// Final transcript - update the last entry if it's a continuation, otherwise append
				if (isContinuation) {
					// Finalize the last entry
					const updated = [...transcriptions];
					updated[updated.length - 1] = {
						...updated[updated.length - 1],
						...newTranscript,
						text: transcriptText,
						transcript: transcriptText,
						time: new Date().toLocaleTimeString(),
						isFinal: true,
					};
					return { ...prev, transcriptions: updated };
				} else {
					// New final transcript - append as new entry
					return {
						...prev,
						transcriptions: [
							...transcriptions,
							{
								...newTranscript,
								text: transcriptText,
								transcript: transcriptText,
								time: new Date().toLocaleTimeString(),
								isFinal: true,
							},
						],
					};
				}
			}
		});
	};

	const handleSocketMessage = useCallback(
		(event) => {
			try {
				const msg = JSON.parse(event?.data || null);

				if (msg?.event === 'transcript.received' && msg?.data) {
					// Append new transcript data to existing list
					setTranscriptList((prev) => [
						...prev,
						{
							speakerName: msg?.data?.speakerName,
							transcript: msg?.data?.transcript,
							timestamp: msg?.data?.timestamp,
						},
					]);
					// const data = msg?.data;
					// if (data?.speakerName?.length > 0 || data?.transcript?.length > 0) {
					// 	updateCurrentContext &&
					// 		updateCurrentContext(
					// 			(data?.speakerName || '') + ' : ' + (data?.transcript || ''),
					// 		);
					// }
				} else if (msg?.event === 'live_intelligence.response' && msg?.data) {
					handleTranscriptionSuggestions(msg?.data);
				} else if (msg?.event === 'transcript.done') {
					closeRecallConnection();
					setSearchParams({
						...Object.fromEntries(searchParams.entries()),
						history: 'true',
					});
					getMeetSummary({ meetingId });
				} else if (msg?.noteTakerTranscript) {
					// Handle noteTakerTranscript responses
					handleSocketTranscription({
						...msg.noteTakerTranscript,
						isFinal: true, // Assume final since it's from server
						id: msg.noteTakerTranscript._id || Date.now().toString(),
					});
				} else if (msg?.event === 'bot.join') {
					setInfo((prev) => ({
						...prev,
						botJoined: true,
						botJoinedTime: moment().unix(),
					}));
				}
			} catch (e) {
				console.error('Error in handleSocketMessage:', e);
			}
		},
		[handleSocketTranscription],
	);

	// Fetch historical data when component mounts
	useEffect(() => {
		fetchHistoricalTranscriptions();
		// Also fetch meeting bot transcriptions if needed
		if (type === 'meeting_bot' && showTranscriptTabs) {
			fetchMeetingBotTranscriptions();
		}
	}, []);

	useEffect(() => {
		if (showTranscriptTabs && location?.pathname?.includes('meet') && type === 'meeting_bot') {
			recallConnection(sessionId, meetingId, handleSocketMessage, isAiIntelligenceEnabled);
			// createLiveIntelligenceStream(
			// 	sessionId,
			// 	noteId,
			// 	handleLiveIntelligenceMessageFunc,
			// 	false,
			// );
		}
		//  else if (showTranscriptTabs && type === 'desktop') {
		// 	// Connect to recall for note taker mode as well
		// 	recallConnection(sessionId, meetingId, handleSocketMessage, isAiIntelligenceEnabled);
		// }
		// No cleanup needed, useRecallStream handles it
	}, [showTranscriptTabs, sessionId, type]);

	useEffect(() => {
		if (showTranscriptTabs && type === 'desktop' && !history) {
			sentinalScrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
		}
	}, [info?.transcriptions?.length]);

	const handleShowAiTranscriptionSuggestions = () => {
		setInfo((prev) => ({
			...prev,
			showAiTranscriptionSuggestions: !prev.showAiTranscriptionSuggestions,
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

	// AssemblyAI upload functionality
	const uploadToAssemblyAI = useCallback(async () => {
		if (!assemblyaiApiKey.trim()) {
			setAssemblyaiUploadStatus({
				type: 'error',
				message: 'Please enter your AssemblyAI API key',
			});
			return;
		}

		if (!info.hasAudioRecording) {
			setAssemblyaiUploadStatus({
				type: 'error',
				message: 'No audio recording available for this meeting',
			});
			return;
		}

		setIsUploadingToAssemblyAI(true);
		setAssemblyaiUploadStatus({
			type: 'info',
			message: 'Uploading audio to AssemblyAI...',
		});

		try {
			const result = await audioStorageService.uploadToAssemblyAI(
				meetingId,
				assemblyaiApiKey,
			);

			if (result.success) {
				setAssemblyaiUploadStatus({
					type: 'success',
					message: `Audio uploaded to AssemblyAI successfully!\nUpload URL: ${result.uploadUrl}`,
					uploadUrl: result.uploadUrl,
				});

				// Now send to workspace API
				const jwtToken = localStorage.getItem('usertoken');
				if (jwtToken) {
					setAssemblyaiUploadStatus(prev => ({
						...prev,
						message: `${prev.message}\n\nSending to workspace API...`
					}));

					const workspaceResult = await assemblyAIService.sendToWorkspaceAPI(
						meetingId, 
						result.uploadUrl, 
						jwtToken
					);
					
					if (workspaceResult.success) {
						setAssemblyaiUploadStatus(prev => ({
							...prev,
							message: `${prev.message}\n\n✅ Sent to workspace API successfully!`
						}));
					} else {
						setAssemblyaiUploadStatus(prev => ({
							...prev,
							message: `${prev.message}\n\n⚠️ Workspace API error: ${workspaceResult.error}`
						}));
					}
				} else {
					setAssemblyaiUploadStatus(prev => ({
						...prev,
						message: `${prev.message}\n\n⚠️ No JWT token found - cannot send to workspace API`
					}));
				}
			} else {
				setAssemblyaiUploadStatus({
					type: 'error',
					message: `Upload failed: ${result.error}`,
				});
			}
		} catch (error) {
			console.error('Error uploading to AssemblyAI:', error);
			setAssemblyaiUploadStatus({
				type: 'error',
				message: `Upload failed: ${error.message}`,
			});
		} finally {
			setIsUploadingToAssemblyAI(false);
		}
	}, [assemblyaiApiKey, info.hasAudioRecording, meetingId]);

	// Start AssemblyAI transcription
	const startAssemblyAITranscription = useCallback(async () => {
		if (!assemblyaiApiKey.trim()) {
			setAssemblyaiUploadStatus({
				type: 'error',
				message: 'Please enter your AssemblyAI API key',
			});
			return;
		}

		if (!info.hasAudioRecording) {
			setAssemblyaiUploadStatus({
				type: 'error',
				message: 'No audio recording available for this meeting',
			});
			return;
		}

		setIsUploadingToAssemblyAI(true);
		setAssemblyaiUploadStatus({
			type: 'info',
			message: 'Starting AssemblyAI transcription...',
		});

		try {
			const result = await audioStorageService.startAssemblyAITranscription(
				meetingId,
				assemblyaiApiKey,
			);

			if (result.success) {
				setAssemblyaiUploadStatus({
					type: 'success',
					message: 'AssemblyAI transcription started successfully!',
					transcriptionId: result.transcriptionId,
				});
			} else {
				setAssemblyaiUploadStatus({
					type: 'error',
					message: `Transcription start failed: ${result.error}`,
				});
			}
		} catch (error) {
			console.error('Error starting AssemblyAI transcription:', error);
			setAssemblyaiUploadStatus({
				type: 'error',
				message: `Transcription start failed: ${error.message}`,
			});
		} finally {
			setIsUploadingToAssemblyAI(false);
		}
	}, [assemblyaiApiKey, info.hasAudioRecording, meetingId]);

	const handleInfoChange = (data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	};

	const handleChatBoxClick = () => {
		setInfo((prev) => ({
			...prev,
			chatClicked: !prev.chatClicked,
		}));
	};

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
							<h2 className="meeting-title">{createBotInfo.title}</h2>
							<DotIcon />
							<span className="meeting-created-by-time">
								{moment.unix(createBotInfo?.createdAt).format('dddd, MMMM D, YYYY')}
							</span>
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
					(type === 'desktop' || type === 'meeting_bot') && (
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
													{type === 'meeting_bot' && (
														<span
															className="avatar"
															style={{
																backgroundColor: getSpeakerColor(
																	item.speakerName,
																),
															}}
														>
															{item.speakerName
																?.split(' ')[0]
																?.charAt(0)}
														</span>
													)}

													<span className="meet-transcript-participant">
														{item.speakerName || 'Note Taker'}
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

				{showTranscriptTabs && activeTab === 'audio' && (
					<div className="audio-tab-container">
						<AudioPlayback meetingId={meetingId} />

						{/* AssemblyAI Upload Section */}
						{info.hasAudioRecording && (
							<div className="assemblyai-upload-section">
								<div className="assemblyai-upload-header">
									<h3>AssemblyAI Transcription</h3>
									<p>
										Upload your meeting audio to AssemblyAI for AI-powered
										transcription
									</p>
								</div>

								<div className="assemblyai-upload-controls">
									<div className="api-key-input">
										<label htmlFor="assemblyai-api-key">
											AssemblyAI API Key:
										</label>
										<input
											id="assemblyai-api-key"
											type="password"
											value={assemblyaiApiKey}
											onChange={(e) => setAssemblyaiApiKey(e.target.value)}
											placeholder="Enter your AssemblyAI API key"
											disabled={isUploadingToAssemblyAI}
										/>
									</div>

									<div className="upload-buttons">
										<button
											onClick={uploadToAssemblyAI}
											disabled={
												isUploadingToAssemblyAI || !assemblyaiApiKey.trim()
											}
											className="upload-btn"
										>
											{isUploadingToAssemblyAI
												? 'Uploading...'
												: 'Upload to AssemblyAI'}
										</button>

										<button
											onClick={startAssemblyAITranscription}
											disabled={
												isUploadingToAssemblyAI || !assemblyaiApiKey.trim()
											}
											className="transcribe-btn"
										>
											{isUploadingToAssemblyAI
												? 'Starting...'
												: 'Start Transcription'}
										</button>
									</div>
								</div>

								{/* Status Messages */}
								{assemblyaiUploadStatus && (
									<div
										className={`assemblyai-status assemblyai-status-${assemblyaiUploadStatus.type}`}
									>
										<div className="status-message">
											{assemblyaiUploadStatus.type === 'success' && '✓ '}
											{assemblyaiUploadStatus.type === 'error' && '✗ '}
											{assemblyaiUploadStatus.type === 'info' && 'ℹ '}
											{assemblyaiUploadStatus.message}
										</div>

										{assemblyaiUploadStatus.uploadUrl && (
											<div className="upload-details">
												<strong>Upload URL:</strong>
												<code>{assemblyaiUploadStatus.uploadUrl}</code>
											</div>
										)}

										{assemblyaiUploadStatus.transcriptionId && (
											<div className="transcription-details">
												<strong>Transcription ID:</strong>
												<code>
													{assemblyaiUploadStatus.transcriptionId}
												</code>
											</div>
										)}
									</div>
								)}
							</div>
						)}
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

				{showTranscriptTabs && type === 'meeting_bot' && !history && (
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
				{showTranscriptTabs && type === 'desktop' && !history && !useAssemblyAI && (
					<NoteTakerTranscript
						sendMessage={recallSendMessage}
						tenantId={tennantSettingsData?._id}
						sessionId={sessionId}
						pageId={'688b653dde81dd3d71a41584'}
						visible={activeTab === 'transcript'}
						onTranscriptionUpdate={handleSocketTranscription}
					/>
				)}
				{/* Assembly AI Transcription option */}
				{showTranscriptTabs && type === 'desktop' && !history && useAssemblyAI && (
					<AssemblyTranscriptWrapper
						sendMessage={(data) => handleTranscriptionSuggestions(data)}
						tenantId={tennantSettingsData?._id}
						sessionId={sessionId}
						visible={activeTab === 'transcript'}
						onTranscriptionUpdate={handleSocketTranscription}
						jwtToken={userToken}
						isAiIntelligenceEnabled={isAiIntelligenceEnabled}
					/>
				)}
			</div>
		</div>
	);
};

export default MeetBotContainer;
