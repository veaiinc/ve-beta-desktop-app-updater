import '@blocknote/core/fonts/inter.css';
// import { createBlock } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import '../../../assets/scss/notes/noteComponent.scss';
import {
	useEffect,
	memo,
	useContext,
	useCallback,
	useState,
	useRef,
	useMemo,
	createContext,
} from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import Context from '../../../context/context';
import moment from 'moment';
import { message } from '../../components/globalComponents/CustomToast';
import { Helmet } from 'react-helmet';
import ObjectID from 'bson-objectid';
import jwtDecode from 'jwt-decode';
import DatabaseSidebar from '../../components/modalsV2/notes/DatabaseSidebar';
import useWorkspaceMode from '../../../hooks/useWorkspaceMode';
import useLiveIntelligenceStream from '../../../hooks/useLiveIntelligenceStream';
import useRecallStream from '../../../hooks/useRecallStream';
export const NotesRefContext = createContext(null);
import RecentChat from '../chat/RecentChat';
import NotesHeader from '../../components/notes/DatabseComponents/NotesHeader';
import Editor from '../../components/notes/Editor';
import NotesTitleArea from '../../components/notes/DatabseComponents/NotesTitleArea';

const initialState = {
	title: '',
	updatedAt: '',
	notesConfigs: {
		smallText: false,
		fullWidth: false,
	},
	isFavorite: false,
	loading: true,
	aiResonse: '',
	myAccess: 'view',
	isDeleted: false,
	lastUpdated: null,
	deleteLoading: false,
	updatedBy: null,
	showAiTranscriptionSuggestions: false,
	coverImageError: false,
	localCoverImage: false, // cover image or link that is selected/uploaded before refreshing the page
	showRemoveCoverBtn: false,
	showRemoveIconBtn: false,
	selectedEmoji: null,
	coverImageRemoved: false,
	iconImageRemoved: false,
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
	transcriptionsLoading: false,
};

const accessLevels = {
	full: 0,
	edit: 1,
	view: 2,
};

let userId = null;

const getRandomWidth = () => {
	const min = 70;
	const max = 100;
	return `${Math.floor(Math.random() * (max - min + 1) + min)}%`;
};

const skeletonLines = [...Array(10)]?.map(() => ({
	width: getRandomWidth(),
	height: 14,
}));

const NotesEditor = ({ outerContainerStyle, innerContainerStyle, showTranscriptTabs = false }) => {
	const { workspaceMode } = useWorkspaceMode();
	const [searchParams] = useSearchParams();
	const noteId = useParams()?.noteId;
	const meetingId = useParams()?.meetingId;
	const sessionId = meetingId;
	const type = searchParams.get('type');
	const history = searchParams.get('history') === 'true' ? true : false;
	const chat = searchParams.get('chat') === 'true' ? true : false;
	const transcription = searchParams.get('transcription') === 'true' ? true : false;
	const isAiIntelligenceEnabled =
		searchParams.get('isAiIntelligenceEnabled') === 'true' ? true : false;
	const navigate = useNavigate();
	const aiResponseRef = useRef('');
	const originalFaviconRef = useRef(null);
	const titleTimeoutRef = useRef(null);

	// const { createWebSocketConnection, sendMessage } = useChatStream();

	const {
		notes: {
			getMeetTranscriptHistory,
			aiLiveIntelligenceHistory,
			getAiLiveIntelligenceHistory,
			getNotesPageData,
			notesPageData,
			notesAccess,
			updatePage,
			addToFavorite,
			removeFromFavorite,
			deletePage,
			duplicatePage,
			updateNotesState,
			getNotesAccess,
			globalAccess,
			notesDeleteCoverImage,
			notesDeleteIcon,
			getBlocks,
			blocks,
			createBlock,
			updateBlock,
			deleteBlock,
			updateStateValues: updateNotesStateValues,
		},
		chatStream: { createWebSocketConnection, sendMessage, closeWebSocketConnection },
		companyInfo: { getTeamMembers, tenantsUserList },
		templates: {
			handleTranscriptionSuggestions,
			aiTranscriptionSuggestions,
			updateStateValues,
		},
		profileInfo: { tennantSettingsData, getTenantSettings },
	} = useContext(Context);

	const [info, setInfo] = useState(initialState);
	const [transcriptList, setTranscriptList] = useState([]);
	const [activeTab, setActiveTab] = useState(type === 'desktop' ? 'transcript' : 'all');
	const [isLoadingHistory, setIsLoadingHistory] = useState(false);
	const location = useLocation();
	const transcriptContainerRef = useRef(null);

	// Add hooks for live intelligence and recall stream
	const {
		createWebSocketConnection: recallConnection,
		sendMessage: recallSendMessage,
		closeWebSocketConnection: closeRecallConnection,
	} = useRecallStream();
	const { createWebSocketConnection: createLiveIntelligenceStream, updateCurrentContext } =
		useLiveIntelligenceStream();

	useEffect(() => {
		if (!aiLiveIntelligenceHistory) {
			getAiLiveIntelligenceHistory({ meetingId: meetingId, limit: 20, page: 1 }, false);
		} else {
			handleTranscriptionSuggestions({ data: aiLiveIntelligenceHistory?.data || [] });
		}
	}, [aiLiveIntelligenceHistory]);

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
		} catch (error) {
			console.error('Error fetching meeting bot transcriptions:', error);
			setTranscriptList([]);
		}
	}, [meetingId, showTranscriptTabs, type, getMeetTranscriptHistory]);

	// Handler for transcript socket messages
	// const handleLiveIntelligenceMessageFunc = useCallback(
	// 	(event) => {
	// 		const data = JSON.parse(event?.data || null);
	// 		handleTranscriptionSuggestions(data);
	// 	},
	// 	[handleTranscriptionSuggestions],
	// );

	// Handler for noteTakerTranscript socket messages
	const handleNoteTakerTranscriptMessage = useCallback((event) => {
		try {
			const data = JSON.parse(event?.data || '{}');
			console.log('🔍 Received socket message:', data);

			// Check if this is a noteTakerTranscript response
			if (data.noteTakerTranscript) {
				console.log('🔍 Processing noteTakerTranscript:', data.noteTakerTranscript);
				handleSocketTranscription({
					...data.noteTakerTranscript,
					isFinal: true, // Assume final since it's from server
					id: data.noteTakerTranscript._id || Date.now().toString(),
				});
			}
		} catch (error) {
			console.error('Error parsing socket message:', error);
		}
	}, []);
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
				} else {
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

	// When new socket data comes in:
	const handleSocketTranscription = useCallback((newTranscript) => {
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
			const isContinuation =
				lastTranscript &&
				!lastTranscript.isFinal &&
				// Check if the new text contains the last text (continuation)
				transcriptText.includes(lastTranscript.text || lastTranscript.transcript || '');

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
	}, []);

	// Auto-scroll to bottom when new transcripts are added
	useEffect(() => {
		if (transcriptContainerRef.current && info.transcriptions?.length > 0) {
			transcriptContainerRef.current.scrollTo({
				top: transcriptContainerRef.current.scrollHeight,
				behavior: 'smooth',
			});
		}
	}, [info.transcriptions?.length]);

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
				} else if (msg?.noteTakerTranscript) {
					// Handle noteTakerTranscript responses
					handleSocketTranscription({
						...msg.noteTakerTranscript,
						isFinal: true, // Assume final since it's from server
						id: msg.noteTakerTranscript._id || Date.now().toString(),
					});
				}
			} catch (e) {
				console.error('Error in handleSocketMessage:', e);
			}
		},
		[updateCurrentContext, handleSocketTranscription],
	);

	// Derived states
	const coverImage = useMemo(() => {
		if (info?.coverImageRemoved) return false;
		return info?.localCoverImage
			? info.localCoverImage
			: info?.coverImageError
			? false
			: notesPageData?.data?.coverImage ?? false;
	}, [
		info?.localCoverImage,
		notesPageData?.data?.coverImage,
		info?.coverImageError,
		info?.coverImageRemoved,
	]);

	const iconImage = useMemo(() => {
		if (info?.iconImageRemoved) return false;
		let icon = notesPageData?.data?.iconImage;

		try {
			if (info?.selectedEmoji?.native) {
				return { native: info.selectedEmoji.native };
			}

			if (typeof icon === 'string') {
				icon = JSON.parse(icon);
				if (typeof icon === 'string') {
					icon = JSON.parse(icon);
				}
			}

			if (icon?.native) {
				return icon;
			}
		} catch (e) {
			console.error('Failed to parse iconImage:', e);
		}

		return null;
	}, [notesPageData?.data?.iconImage, info?.selectedEmoji?.native]);

	useEffect(() => {
		if (noteId) {
			const isDatabase = true;
			getBlocks(
				{
					pageId: noteId,
					listBlockInput: { limit: 100, page: 1 },
				},
				isDatabase,
			);
		}
	}, [noteId]);
	useEffect(() => {
		if (!tennantSettingsData) {
			getTenantSettings();
		}
	}, [tennantSettingsData]);

	useEffect(() => {
		const token = localStorage.getItem('usertoken');
		const { user_id } = jwtDecode(token);
		userId = user_id;
	}, []);

	useEffect(() => {
		const originalFaviconTag = document.querySelector("link[rel~='icon']");

		if (originalFaviconRef.current === null) {
			originalFaviconRef.current = originalFaviconTag?.href ?? null;
		}

		if (!iconImage?.native) {
			document.querySelectorAll("link[rel~='icon']").forEach((el) => el.remove());

			if (originalFaviconRef.current) {
				const link = document.createElement('link');
				link.rel = 'icon';
				link.href = originalFaviconRef.current;
				document.head.appendChild(link);
			}
			return;
		}

		const canvasSize = 256;
		const canvas = document.createElement('canvas');
		canvas.width = canvasSize;
		canvas.height = canvasSize;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.font = '200px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(iconImage.native, canvasSize / 2, canvasSize / 2);

		const faviconUrl = canvas.toDataURL();

		document.querySelectorAll("link[rel~='icon']").forEach((el) => el.remove());
		const link = document.createElement('link');
		link.rel = 'icon';
		link.href = faviconUrl;
		document.head.appendChild(link);

		return () => {
			document.querySelectorAll("link[rel~='icon']").forEach((el) => el.remove());

			if (originalFaviconRef.current) {
				const restoreLink = document.createElement('link');
				restoreLink.rel = 'icon';
				restoreLink.href = originalFaviconRef.current;
				document.head.appendChild(restoreLink);
			}
		};
	}, [iconImage]);

	// useEffect(() => {
	// 	getNotesAccess({ pageId: noteId });
	// }, [noteId]);

	useEffect(() => {
		if (noteId) {
			getNotesPageDataFunc();
		}

		return () => {
			updateNotesState({
				notesPageData: null,
				blocks: null,
			});
		};
	}, [noteId]);

	// useEffect(() => {
	// 	const sessionId = ObjectID()?.toString();
	// 	if (noteId && workspaceMode) {
	// 		createWebSocketConnection(sessionId, handleAiResponse, '', false, workspaceMode);
	// 	}
	// 	return () => {
	// 		closeWebSocketConnection([sessionId]);
	// 	};
	// }, [noteId, workspaceMode]);

	useEffect(() => {
		if (!tenantsUserList) {
			getTeamMembers();
		} else if (info?.updatedBy) {
			const lastUpdated = tenantsUserList?.find((item) => item._id === info?.updatedBy);
			setInfo((prevInfo) => ({ ...prevInfo, lastUpdated }));
		}
	}, [tenantsUserList, info?.updatedBy]);

	useEffect(() => {
		if (noteId) {
			const isDatabase = true;
			getNotesAccess({ pageId: noteId }, isDatabase);
		}
	}, [noteId]);

	// Process access logic when relevant data changes
	useEffect(() => {
		if (notesAccess && userId && noteId) {
			const hasAccess = notesAccess.find((access) => access?.userId === userId);
			if (hasAccess) {
				let myAccess = hasAccess.access;

				if (globalAccess?.isEnabled) {
					const myAccessLevel = accessLevels?.[myAccess];
					const teamAccessLevel = accessLevels?.[globalAccess?.access];
					myAccess = myAccessLevel > teamAccessLevel ? globalAccess.access : myAccess;
				}

				setInfo((prev) => ({
					...prev,
					myAccess,
				}));
			}
		}
	}, [notesAccess, userId, noteId, globalAccess]);

	useEffect(() => {
		const handleKeyDown = (e) => {
			const isMac = navigator.platform.toUpperCase().includes('MAC');
			const isSaveShortcut =
				(isMac && e.metaKey && e.key === 's') || (!isMac && e.ctrlKey && e.key === 's');

			if (isSaveShortcut) {
				e.preventDefault();
				e.stopPropagation();
			}
		};

		window.addEventListener('keydown', handleKeyDown, true); // true = capture phase

		return () => {
			window.removeEventListener('keydown', handleKeyDown, true);
		};
	}, []);

	useEffect(() => {
		if (notesPageData?.data) {
			const {
				blocks = [],
				title = '',
				updatedAt = '',
				isFavorite = false,
				isDeleted = false,
				updatedBy = null,
			} = notesPageData?.data || {};
			setInfo((prev) => ({
				...prev,
				title,
				updatedAt,
				isFavorite,
				isDeleted,
				updatedBy,
			}));
		} else if (notesPageData?.error) {
			const messageText =
				notesPageData?.error?.message ||
				'Something went wrong while fetching this note, please try again';
			message.error(messageText);
			setTimeout(() => {
				window.history.length > 1 ? navigate(-1) : navigate('/');
			}, 3100);
		}
	}, [notesPageData]);

	useEffect(() => {
		return () => {
			// Clear title timeout on unmount
			if (titleTimeoutRef.current) {
				clearTimeout(titleTimeoutRef.current);
			}
		};
	}, []);

	const getNotesPageDataFunc = useCallback(async () => {
		const payload = {
			pageId: noteId,
		};
		const isDatabase = true;
		getNotesPageData(payload, isDatabase);
	}, [noteId]);

	// Generic debounce function for title updates
	const handleTitleDebounce = useCallback((callback, delay = 500) => {
		if (titleTimeoutRef.current) {
			clearTimeout(titleTimeoutRef.current);
		}
		titleTimeoutRef.current = setTimeout(callback, delay);
	}, []);

	const handleTitleChange = (e) => {
		const newTitle = e?.target?.value;
		setInfo((prev) => ({ ...prev, title: newTitle }));
		const isDatabase = true;
		handleTitleDebounce(() => {
			updatePage(
				{
					pageId: noteId,
					input: { title: newTitle },
				},
				isDatabase,
			);
			setInfo((prev) => ({ ...prev, updatedAt: moment().unix() }));
		}, 500);
	};

	const handleFavorite = useCallback(
		(value) => {
			setInfo((prev) => ({ ...prev, isFavorite: value }));

			// Simple timeout for favorite action
			setTimeout(async () => {
				const payload = { pageId: noteId };
				const [success] = value
					? await addToFavorite(payload)
					: await removeFromFavorite(payload);

				if (!success) {
					setInfo((prev) => ({ ...prev, isFavorite: !value }));
				}
			}, 500);
		},
		[noteId],
	);

	const handleMoreOptionsChange = useCallback(
		(key, value) => {
			setInfo((prev) => ({
				...prev,
				notesConfigs: { ...prev.notesConfigs, [key]: value },
			}));
		},
		[setInfo],
	);

	const handleDeletePage = useCallback(
		async (permanent = false) => {
			if (info?.deleteLoading) return;
			setInfo((prev) => ({ ...prev, deleteLoading: true }));
			const isDatabase = true;
			// const [success] = await deletePage({ pageId: noteId, isPermanent: permanent });
			const [success] = await deletePage(
				{ pageId: noteId, isPermanent: permanent },
				isDatabase,
			);
			if (success) {
				message.success(`Page ${permanent ? 'permanently ' : ''}deleted successfully`);
				navigate(-1);
			} else {
				message.error('Failed to delete page');
			}
			setInfo((prev) => ({ ...prev, deleteLoading: false }));
		},
		[info?.deleteLoading, info?.notesConfigs, navigate, noteId, setInfo],
	);

	const handleDuplicatePage = useCallback(async () => {
		if (info?.loading) return;
		setInfo((prev) => ({ ...prev, loading: true }));
		const [success, data] = await duplicatePage({ pageId: noteId });
		if (success) {
			message.success('Page duplicated successfully');
			// navigate(`/note/${data?._id}`);
		} else {
			message.error('Failed to duplicate page');
		}
		setInfo((prev) => ({ ...prev, loading: false }));
	}, [info?.loading, info?.notesConfigs, navigate, noteId, setInfo]);

	const handleAiResponse = (event) => {
		let { data = '' } = event || {};
		const dataObject = JSON.parse(data);

		if (dataObject.hasOwnProperty('answer')) {
			aiResponseRef.current = aiResponseRef.current + dataObject?.answer;

			if (dataObject?.stream_end) {
				setInfo((prevInfo) => ({
					...prevInfo,
					aiResonse: aiResponseRef.current,
				}));
			}
		}
	};

	const resetAiResponse = useCallback(() => {
		setInfo((prevInfo) => ({ ...prevInfo, aiResonse: '' }));
		aiResponseRef.current = '';
	}, []);

	const customSendMessage = useCallback((query) => {
		const location = localStorage?.getItem('locationDetails') || {};
		const locationData = JSON?.parse(location);
		sendMessage({
			date: [],
			deep_research: false,
			knowledge_base_search: false,
			modules: [],
			query,
			timezone: 'Asia/Calcutta',
			web_search: true,
			location: locationData,
		});
	}, []);

	const restorePage = useCallback(async () => {
		if (info?.deleteLoading) return;
		setInfo((prev) => ({ ...prev, deleteLoading: true }));
		const isDatabase = true;
		const response = await updatePage(
			{
				pageId: noteId,
				input: { isDeleted: false },
			},
			isDatabase,
		);
		if (response?.[0]) {
			setInfo((prev) => ({
				...prev,
				updatedAt: moment().unix(),
				isDeleted: false,
				deleteLoading: false,
			}));
			message?.success('Page restored!');
		} else {
			setInfo((prev) => ({ ...prev, deleteLoading: false }));
			message?.error(`Couldn't restore page`);
		}
	}, [info?.deleteLoading, noteId]);

	const handleCoverImageError = () => {
		setInfo((prev) => ({ ...prev, coverImageError: true }));
	};

	const handleRemoveCover = async () => {
		const response = await notesDeleteCoverImage({ pageId: noteId });
		const success = response?.[0];
		if (success) {
			message.success('Cover image removed successfully');
			setInfo((prev) => ({
				...prev,
				showRemoveCoverBtn: false,
				localCoverImage: false,
				coverImageError: false,
				coverImageRemoved: true,
			}));
		} else {
			message.error('Failed to remove cover image');
		}
	};

	const handleRemoveIcon = async () => {
		const response = await notesDeleteIcon({ pageId: noteId });
		const success = response?.[0];
		if (success) {
			message.success('Icon removed successfully');
			setInfo((prev) => ({
				...prev,
				showRemoveIconBtn: false,
				selectedEmoji: null,
				iconImageRemoved: true,
			}));
		} else {
			message.error('Failed to remove icon');
		}
	};

	const handleChatBoxClick = () => {
		if (info?.chatClicked) return;

		setInfo((prev) => ({
			...prev,
			chatClicked: true,
		}));
	};

	const handleInfoChange = useCallback((data) => {
		setInfo((prev) => ({ ...prev, ...data }));
	}, []);

	return (
		<div className="notes-container" style={outerContainerStyle || {}}>
			{!(type === 'meeting_bot' || type === 'desktop') && (
				<div className="notesChatArea">
					<RecentChat
						showIconText={false}
						isPreview={true}
						autoFocus={false}
						customChatBoxClick={handleChatBoxClick}
						// {...(info?.chatClicked && {
						// 	sId: info?.chatSessionId,
						// })}
						sId={info?.chatSessionId}
						showCitationsButton={false}
					/>
				</div>
			)}
			<div className="notesContentWrapper">
				{info?.title && (
					<Helmet>
						<meta charSet="utf-8" />
						<title>VE - {info?.title}</title>
					</Helmet>
				)}

				<NotesHeader
					isDeleted={info?.isDeleted}
					title={info?.title}
					isFavorite={info?.isFavorite}
					noteId={noteId}
					notesConfigs={info?.notesConfigs}
					myAccess={info?.myAccess}
					lastUpdated={info?.lastUpdated}
					updatedAt={info?.updatedAt}
					handleFavorite={handleFavorite}
					handleMoreOptionsChange={handleMoreOptionsChange}
					handleDeletePage={handleDeletePage}
					handleDuplicatePage={handleDuplicatePage}
					restorePage={restorePage}
					isDatabase={true}
				/>

				<div className="notes-editor-container">
					<>
						{coverImage && (
							<div
								onMouseEnter={() =>
									setInfo((prev) => ({ ...prev, showRemoveCoverBtn: true }))
								}
								onMouseLeave={() =>
									setInfo((prev) => ({ ...prev, showRemoveCoverBtn: false }))
								}
								className="notes-cover-image-container"
							>
								<img
									src={coverImage}
									onError={handleCoverImageError}
									alt="cover image"
								/>
								{info?.showRemoveCoverBtn && (
									<button
										onClick={handleRemoveCover}
										className="remove-cover-btn"
									>
										Remove
									</button>
								)}
							</div>
						)}
						<div
							className="notes-editor-wrapper"
							style={{
								maxWidth: info?.notesConfigs?.fullWidth ? '100%' : '898px',
							}}
						>
							<NotesTitleArea
								iconImage={info?.iconImage}
								coverImage={info?.coverImage}
								updateParentState={handleInfoChange}
								handleRemoveIcon={handleRemoveIcon}
								handleTitleChange={handleTitleChange}
								title={info?.title}
								showRemoveIconBtn={info?.showRemoveIconBtn}
							/>
							<Editor
								innerContainerStyle={innerContainerStyle}
								myAccess={info?.myAccess}
								isDeleted={info?.isDeleted}
								customSendMessage={customSendMessage}
								aiResonse={info?.aiResonse}
								resetAiResponse={resetAiResponse}
								noteId={noteId}
								initialBlocks={blocks}
								createBlock={createBlock}
								updateBlock={updateBlock}
								deleteBlock={deleteBlock}
							/>
						</div>
					</>
				</div>
			</div>
			<DatabaseSidebar pageId={noteId} />
		</div>
	);
};

export default memo(NotesEditor);
