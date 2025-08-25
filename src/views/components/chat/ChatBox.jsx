import { memo, useCallback, useState, useRef, useEffect, useContext } from 'react';
import '../../../assets/scss/chat/chatbox.scss';
import { ReactComponent as Close } from '../../../assets/svg/close.svg';
import { ReactComponent as ArrowUp } from '../../../assets/svg/ai_agents/arrow-up-dark.svg';
import { ReactComponent as SpeechMicSvg } from '../../../assets/svg/ai_agents/mic.svg';
import { ReactComponent as ChevronSvg } from '../../../assets/svg/tasks/chevronRightThin.svg';
import { ReactComponent as CloseSvg } from '../../../assets/svg/calendar/close.svg';
import { ReactComponent as PlusSvg } from '../../../assets/svg/ai_assistant/plus.svg';
import { ReactComponent as AtomSvg } from '../../../assets/svg/ai_agents/atom.svg';
import { ReactComponent as SparkSvg } from '../../../assets/svg/spark.svg';
import { ReactComponent as ArrowDownSvg } from '../../../assets/svg/ai_agents/arrow-down.svg';
import { ReactComponent as ArrowUpRightSvg } from '../../../assets/svg/sidebar/arrowupright.svg';
import { ReactComponent as BulbSvg } from '../../../assets/svg/home_page/bulb.svg';
import { ReactComponent as TrendUpSvg } from '../../../assets/svg/trendUp.svg';
import { ReactComponent as ArrowsOut } from '../../../assets/svg/gallery/arrowsOut.svg';
import { ReactComponent as StopIconSvg } from '../../../assets/svg/notesPage/cancel.svg';
import CreditCoinImage from '../../../assets/images/creditCoin.png';
import Context from '../../../context/context';
import ObjectID from 'bson-objectid';
import { useLocation, useParams } from 'react-router-dom';
import { checkDevices, getBase64, getLocationsDetails } from '../../../helpers';
import WorkflowSlugSelector from '../calendar/WorkflowSlugSelector';
import SearchDropdown from './SearchDropdown';
import UploadFileTooltip from './UploadFileTooltip';
import DateRangeDropdown from './DateRangeDropdown';
import moment from 'moment';
import { Image, Spin, Tooltip } from 'antd';
// import AIMessageLoader from './AIMessageLoader';
import WebSvg from '../../../assets/svg/ai_agents/webSvg';
import BookSvg from '../../../assets/svg/ai_agents/bookSvg';
import { message } from '../globalComponents/CustomToast';
// import SearchTypeTooltip from './SearchTypeTooltip';
import ChatBoxPlaceholder from './ChatBoxPlaceholder';
import { fileTypeIcons } from '../../../helpers';
import BuildTooltip from './BuildTooltip';
import RecentFileTooltip from './RecentFileTooltip';
import AskTooltip from './AskTooltip';
import AddOnCards from '../settings/planbilling/addOnCards';
import useWorkspaceMode from '../../../hooks/useWorkspaceMode';
import { ReactComponent as VoiceAgentSvg } from '../../../assets/svg/ai_agents/voiceagent.svg';
import VoiceAgentParent from '../../features/voiceAgent/VoiceAgentParent';
import useNote from '../../../hooks/useNote';
import useAudioVisualizer from '../../../hooks/useAudioVisualizer';
import { Track } from 'livekit-client';
import { useTrackTranscription } from '@livekit/components-react';
// import VoiceWrapper from '../../layouts/VoiceWrapper';

const moduleHelper = {
	tasks: 'tasks',
	'smart-file': 'form_filling',
	calendar: 'calendar',
	meet: 'meeting',
	note: 'notes',
};

const initialChatFilters = {
	modules: {},
	integrations: {},
	dateRange: null,
};

const integrationsOptions = {
	meeting: 'Meeting',
	notion: 'Notion',
	'q&a': 'Q & A',
	website: 'Website',
};

const modulesOptions = {
	calendar: 'Calendar',
	tasks: 'Tasks',
	// storage: 'Storage',
	// gallery: 'Gallery',
	clients: 'Clients',
};

const searchTypeOptionsForReason = {
	webSearch: {
		icon: WebSvg,
		title: 'Web Search',
		subTitle: 'Deep research web search',
	},
	workspaceSearch: {
		icon: BookSvg,
		title: 'Internal Search',
		subTitle: 'Effortless access to insights',
	},
};

const searchTypeOptionsForAsk = {
	webSearch: {
		icon: WebSvg,
		title: 'Web Search',
		subTitle: 'web search',
	},
	workspaceSearch: {
		icon: BookSvg,
		title: 'Internal Search',
		subTitle: 'internal search',
	},
};

const chatboxPlaceholders = [
	'Start typing or use @ to mention a source.',
	'Summarize all emails from today',
	'Schedule a meeting for next week',
	'Draft and send a follow-up email',
	'Deep research "latest industry trends" with sources',
	'Generate a professional-looking form in seconds',
	'Search across Gmail, Drive, and Notion for "invoice"',
];

const initialChatBoxInfo = {
	deepResearch: false,
	webSearch: true,
	workspaceSearch: true,
	ask: true,
	goals: false,
	selectedLLMModel: null,
	build: false,
	deepSearch: false,
};
/*
Note:
We are using useRef at some places along with useState,
This is because we want to avoid re-rendering the component when the state changes,
and useRef does not cause re-rendering when the state changes and it always gives the latest value of the state.
Dont change this otherwise chat functionality will break.
*/
const ChatBox = ({
	onSend,
	aiChatLoading,
	handleAiUploadImage,
	customChatActions = false,
	uploadedImages = [],
	handleSendWebsocketMessage,
	isPublicChat = false,
	autoFocus = true,
	animatePlaceholder = false,
	customChatBoxClick = null,
	showScrollButton = false,
	smoothScrollToBottom = null,
	startPage = false,
	onChatQueryChange = null,
	isBuildEnbled = true,
	showUpgradeSubscriptionBtn = true,
	animateChatBox = true,
	sessionId = null,
	getSuggestions = false,
	placeholder = 'Start typing or use @ to mention a source.',
	showBrowserButton = false,
	handleBrowserButtonClick = null,
	browserImage = null,
	showBottomTools = true,
}) => {
	const location = useLocation();
	const params = useParams();
	const { workspaceMode } = useWorkspaceMode();

	const textAreaRef = useRef(null);
	const placeholderIntervalId = useRef(null);
	const textAreaWrapperRef = useRef(null);
	const suggestionsTimeoutRef = useRef(null);
	const suggestionRef = useRef(null);
	const chatSessionIdRef = useRef(null);
	const previousChatQueryRef = useRef('');
	const {
		templates: {
			globalChatMessages,
			handleGlobalChatMessages,
			updateStateValues,
			handleGlobalUploadImage,
			checkIndividualImageUploadedStatus,
			deleteUploadedImageThroughChat,
			activeWorkflowSlugForSmartFile,
			updateApplicationChat,
			activePromptForChat,
			handleStreamSendMessage,
			activePayloadForChat,
			activeInputForChat,
			userEditedQuery,
			galleryFile,
			chatReplyData,
			deleteMultiAgentFile,
			proactiveInfoForChat,
			isDirectSearchAgent,
			isBrowserScreenActive,
		},
		chatBoxSuggestionsSocket: { sendMessage, closeWebSocketConnection },
		subscriptionInfo: { currentPlan },
		calendarInfo: { updateCalendarState },
		tasks: { updateTaskState },
		aiSetup: { voiceIntegrationData, updateAiChatSessions, aiChatSessions, updateAiSetupState },
		notes: { getLiveKitToken },
	} = useContext(Context);

	const [info, setInfo] = useState({
		bigToolbarIsOpen: false,
		chatQuery: '',
		widgetQuery: '',
		position: { x: window?.innerWidth / 2 - 900, y: 0 },
		addQuickAction: false,
		chatSessionId: null,
		uploadedImages: uploadedImages,
		chatLoading: false,
		showFullPage: true,
		voiceIntegration: false,
		noteModalIsOpen: false,
		citationsModalIsOpen: false,
		filtersEnabled: false,
		isUploadFileOpen: false,
		isRecentFileOpen: false,
		showFilters: false,
		chatFilters: initialChatFilters,
		isIntegrationsDropdownOpen: false,
		isModulesDropdownOpen: false,
		recentFiles: [],
		isVoiceMuted: false,
		isLLMModelOpen: false,
		searchTypeOpenForReason: false,
		activePlaceholderIndex: 0,
		openUpgradeModal: false,
		askTooltipOpen: false,
		chatBoxInfo: initialChatBoxInfo,
		chatboxMinimized: true,
		chatBoxContainerHeight: 60,
	});

	const [previewOpen, setPreviewOpen] = useState(false);
	const [previewImage, setPreviewImage] = useState('');

	// Speech-to-text state
	const [isTranscribing, setIsTranscribing] = useState(false);
	const [liveKitToken, setLiveKitToken] = useState(null);
	const [transcriptionText, setTranscriptionText] = useState('');
	const transcriptionSessionId = useRef(ObjectID().toString());
	const isMountedRef = useRef(true);

	// LiveKit transcription setup
	const wsUrl = 'wss://ve-ai-transcriptions-8p8k0b44.livekit.cloud';

	const {
		connect,
		disconnect,
		isConnected,
		localAudioTrack,
		localParticipant,
		isMuted,
		muteAudio,
		unmuteAudio,
	} = useNote({
		wsUrl,
		token: liveKitToken,
		isRecording: isTranscribing,
	});

	// Audio visualizer hook
	const { canvasRef } = useAudioVisualizer(isTranscribing, localAudioTrack);

	// Track reference for transcription
	const trackRef =
		localParticipant && localAudioTrack
			? {
					publication: localParticipant.getTrackPublication(Track.Source.Microphone),
					source: Track.Source.Microphone,
					participant: localParticipant,
			  }
			: undefined;

	const { segments } = useTrackTranscription(trackRef);

	// Process transcription segments
	useEffect(() => {
		if (!segments || segments.length === 0) return;

		let fullText = '';
		segments.forEach((segment) => {
			fullText += segment.text + ' ';
		});

		if (fullText.trim()) {
			setTranscriptionText(fullText.trim());
			// Update chat query with transcription
			setInfo((prev) => ({
				...prev,
				chatQuery: fullText.trim(),
			}));
			onChatQueryChange?.(fullText.trim());
		}
	}, [segments]);

	const uploadedImagesRef = useRef(info?.uploadedImages || []);
	const recentFilesRef = useRef(info?.recentFiles || []);
	const showPlaceholder = info?.chatQuery?.length === 0 && info?.widgetQuery?.length === 0;
	const totalCreditsUsed = currentPlan?.totalAiCreditUsed || 0,
		totalCreditsLimit =
			typeof currentPlan?.totalAiCreditLimit === 'number'
				? currentPlan?.totalAiCreditLimit
				: 1;

	useEffect(() => {
		isMountedRef.current = true;

		// if (
		// 	!chatInfo?.agentType ||
		// 	(location?.pathname?.split('/')?.[1] !== 'chat' &&
		// 		location?.pathname?.split('/')?.[1] !== 'knowledge-agent' &&
		// 		chatInfo?.agentType === 'knowledge_agent')
		// ) {
		// 	updateStateValues({
		// 		chatInfo: { ...chatInfo, agentType: 'multi_agent', assistantId: null },
		// 	});
		// }
		document.addEventListener('click', handleWindowClick);
		return () => {
			isMountedRef.current = false;
			document.removeEventListener('click', handleWindowClick);
			if (chatSessionIdRef.current) {
				closeWebSocketConnection(chatSessionIdRef.current);
			}

			if (suggestionsTimeoutRef.current) {
				clearTimeout(suggestionsTimeoutRef.current);
			}

			// Cleanup transcription
			if (isTranscribing) {
				setIsTranscribing(false);
				setLiveKitToken(null);
				disconnect();
			}
		};
	}, [isTranscribing, disconnect]);

	useEffect(() => {
		if (!animateChatBox) return;
		setInfo((prev) => {
			const height = info?.chatboxMinimized
				? '60px'
				: `${Math.min(textAreaRef?.current?.scrollHeight, 200) + 58 + 28}px`;
			if (height === prev?.chatBoxContainerHeight) {
				return prev;
			}
			return {
				...prev,
				chatBoxContainerHeight: height,
			};
		});
	}, [info?.chatboxMinimized]);

	useEffect(() => {
		const sessionData = globalChatMessages?.[info?.chatSessionId],
			isStreaming = sessionData?.isStreaming || false,
			latestStreamMessage = sessionData?.latestStreamMessage,
			lastQuery = sessionData?.lastQuery;

		if (sessionData?.chatBoxInfo) {
			const deepResearch = sessionData?.chatBoxInfo?.deepResearch;
			const goals = sessionData?.chatBoxInfo?.goals;
			const webSearch = sessionData?.chatBoxInfo?.webSearch;
			const workspaceSearch = sessionData?.chatBoxInfo?.workspaceSearch;
			const ask = sessionData?.chatBoxInfo?.ask;
			const selectedLLMModel = sessionData?.chatBoxInfo?.selectedLLMModel;
			const build = sessionData?.chatBoxInfo?.build;
			const deepSearch = sessionData?.chatBoxInfo?.deepSearch;
			if (
				info?.chatBoxInfo?.deepResearch !== deepResearch ||
				info?.chatBoxInfo?.goals !== goals ||
				info?.chatBoxInfo?.webSearch !== webSearch ||
				info?.chatBoxInfo?.workspaceSearch !== workspaceSearch ||
				info?.chatBoxInfo?.ask !== ask ||
				info?.chatBoxInfo?.selectedLLMModel !== selectedLLMModel ||
				info?.chatBoxInfo?.build !== build ||
				info?.chatBoxInfo?.deepSearch !== deepSearch
			) {
				setInfo((prev) => ({
					...prev,
					chatBoxInfo: sessionData?.chatBoxInfo,
				}));
			}
		}

		if (info?.chatLoading !== isStreaming) {
			setInfo((prev) => ({ ...prev, chatLoading: isStreaming }));
		}

		if (latestStreamMessage) {
			const { deep_research, db_updates, variables_required } = latestStreamMessage;
			if (db_updates?.calendar_db_update) {
				updateCalendarState({ refetchCalendarState: true });
			}
			if (db_updates?.task_db_update) {
				updateTaskState({ refetchTasks: true });
			}
			if (db_updates?.proposal_db_update) {
				updateStateValues({ smartFileRefetch: true });
			}
			if (variables_required) {
				handleVariablesRequired(variables_required, lastQuery);
			}

			if (deep_research) {
				let chatBoxData = info?.chatBoxInfo;
				chatBoxData = {
					...chatBoxData,
					goals: false,
					deepResearch: false,
					ask: true,
					build: false,
					deepSearch: false,
				};
				handleGlobalChatMessages({
					sessionId: info?.chatSessionId,
					chatBoxInfo: chatBoxData,
					removeLatestStreamMessage: true,
					updateExtraInfo: true,
				});
			} else {
				handleGlobalChatMessages({
					sessionId: info?.chatSessionId,
					removeLatestStreamMessage: true,
					updateExtraInfo: true,
				});
			}
		}
	}, [globalChatMessages, info?.chatSessionId]);

	useEffect(() => {
		if (
			activePromptForChat &&
			info?.chatSessionId &&
			activePromptForChat?.sessionId === info?.chatSessionId
		) {
			handleSendMessageFunc(null, true, activePromptForChat?.prompt);
			updateStateValues({ activePromptForChat: null });
		}
	}, [activePromptForChat, info?.chatSessionId]);

	useEffect(() => {
		if (activeInputForChat) {
			setInfo((prev) => ({
				...prev,
				chatQuery: activeInputForChat,
			}));
			updateStateValues({ activeInputForChat: null });
		}
	}, [activeInputForChat]);

	useEffect(() => {
		if (showPlaceholder && animatePlaceholder) {
			placeholderIntervalId.current = setInterval(() => {
				setInfo((prev) => {
					const nextIndex =
						prev?.activePlaceholderIndex === chatboxPlaceholders?.length - 1
							? 0
							: prev?.activePlaceholderIndex + 1;
					return {
						...prev,
						activePlaceholderIndex: nextIndex,
					};
				});
			}, 3000);
		}
		return () => {
			clearInterval(placeholderIntervalId.current);
		};
	}, [showPlaceholder]);

	//below useeffect is for getting suggestions
	useEffect(() => {
		if (
			info?.chatQuery?.length > 0 &&
			info?.chatSessionId &&
			getSuggestions &&
			!info?.chatQuery?.includes('\n')
		) {
			const previousChatQuery = previousChatQueryRef.current?.trim().replace(/\n/g, '');
			const currentChatQuery = info?.chatQuery?.trim()?.replace(/\n/g, '');
			if (previousChatQuery === currentChatQuery) {
				return;
			}
			previousChatQueryRef.current = info?.chatQuery;
			if (suggestionsTimeoutRef.current) {
				clearTimeout(suggestionsTimeoutRef.current);
			}
			suggestionsTimeoutRef.current = setTimeout(() => {
				sendMessage({
					sessionId: info?.chatSessionId,
					query: info?.chatQuery,
					onMessageFunc: handleSuggestionsMessageFunc,
				});
				suggestionsTimeoutRef.current = null;
			}, 400);
		}
	}, [info?.chatQuery]);

	//below useeffect is for getting suggestions
	useEffect(() => {
		if (info?.showSuggestion) {
			let height = 0;
			if (suggestionRef?.current && textAreaRef?.current) {
				height = Math.max(
					suggestionRef?.current?.scrollHeight,
					textAreaRef?.current?.scrollHeight,
				);
				height = Math.min(height, 200);
				height = Math.max(height, 30);
			}
			if (suggestionRef?.current) {
				suggestionRef.current.style.height = `${height}px`;
			}
			if (textAreaRef?.current) {
				textAreaRef.current.style.height = `${height}px`;
			}
			if (textAreaWrapperRef?.current) {
				textAreaWrapperRef.current.style.height = `${height}px`;
			}
			setInfo((prev) => ({ ...prev, chatBoxContainerHeight: `${height + 58 + 28}px` }));
		}
	}, [info?.showSuggestion]);

	//below useeffect is for getting suggestions
	useEffect(() => {
		if (info?.chatQuery && info?.suggestion) {
			if (info?.suggestion?.startsWith(info?.chatQuery)) {
				setInfo((prev) => ({ ...prev, showSuggestion: true }));
			} else {
				setInfo((prev) => ({ ...prev, showSuggestion: false }));
			}
		}
	}, [info?.chatQuery, info?.suggestion]);

	useEffect(() => {
		if (galleryFile) {
			recentFilesRef.current = [...recentFilesRef?.current, galleryFile];
			updateStateValues({ galleryFile: null });
		}
	}, [galleryFile]);

	//useEffect to handle send user edited query
	useEffect(() => {
		if (userEditedQuery) {
			if (info?.chatLoading) {
				updateStateValues({ userEditedQuery: null });
				message.error('Please wait, AI is already generating a response');
				return;
			}
			handleSendMessageFunc(null, true, userEditedQuery);
			updateStateValues({ userEditedQuery: null });
		}
	}, [userEditedQuery, info?.chatLoading]);

	useEffect(() => {
		if (activePayloadForChat && info?.chatSessionId) {
			const { payload, localPayload, currentQuery, recentFiles = [] } = activePayloadForChat;
			if (handleSendWebsocketMessage) {
				handleSendWebsocketMessage(payload, currentQuery, '', info?.chatSessionId);
			}

			handleStreamSendMessage(payload, localPayload, currentQuery, info?.chatSessionId);
			updateStateValues({ activePayloadForChat: null });
			recentFilesRef.current = recentFiles;
			setInfo((prev) => ({ ...prev, recentFiles }));
		}
	}, [activePayloadForChat, info?.chatSessionId]);

	// useEffect(() => {
	// 	if (currentSessionId) {
	// 		setInfo((prev) => ({ ...prev, chatSessionId: currentSessionId }));
	// 	} else {
	// 		updateStateValues({ currentSessionId: ObjectID()?.toString() });
	// 	}
	// }, [currentSessionId]);

	useEffect(() => {
		const chatSessionId = sessionId || ObjectID()?.toString();
		setInfo((prev) => ({ ...prev, chatSessionId }));
		chatSessionIdRef.current = chatSessionId;
	}, [sessionId]);

	useEffect(() => {
		if (info?.chatSessionId && !globalChatMessages?.[info?.chatSessionId]?.chatBoxInfo) {
			handleGlobalChatMessages({
				sessionId: info?.chatSessionId,
				chatBoxInfo: initialChatBoxInfo,
				updateExtraInfo: true,
			});
		}
	}, [info?.chatSessionId]);

	useEffect(() => {
		if (!textAreaRef?.current) return;

		if (!info?.chatboxMinimized) {
			// Focus only if not already focused
			if (document.activeElement !== textAreaRef.current) {
				textAreaRef.current.focus();
			}
		}
	}, [info?.chatboxMinimized]);

	useEffect(() => {
		const newVoiceIntegration = voiceIntegrationData?.shouldConnect || false;

		// Don't set voiceIntegration to true during transcription
		// This prevents the chat interface from being hidden
		if (isTranscribing && newVoiceIntegration) {
			return;
		}

		setInfo((prev) => ({
			...prev,
			voiceIntegration: newVoiceIntegration,
		}));
	}, [voiceIntegrationData, isTranscribing]);

	const handleSuggestionsMessageFunc = (event) => {
		const data = JSON.parse(event?.data || {});
		if (data?.suggestion) {
			setInfo((prev) => ({
				...prev,
				suggestion: data?.suggestion,
			}));
		}
	};

	const handlePreview = async (file) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setPreviewImage(file.url || file.preview);
		setPreviewOpen(true);
	};

	const handleWindowClick = useCallback(() => {
		if (!animateChatBox) return;
		setInfo((prev) => {
			if (prev?.chatboxMinimized) {
				return prev;
			}
			return {
				...prev,
				chatboxMinimized: true,
			};
		});
	}, [animateChatBox]);
	const handleGoalsClick = () => {
		let chatBoxData = info?.chatBoxInfo;

		if (chatBoxData?.goals) {
			return;
		}

		chatBoxData = {
			...chatBoxData,
			goals: true,
			ask: false,
			deepResearch: false,
			build: false,
			deepSearch: false,
		};

		handleGlobalChatMessages({
			sessionId: info?.chatSessionId,
			chatBoxInfo: chatBoxData,
			updateExtraInfo: true,
		});
	};
	const handleDeepResearchClick = () => {
		if (recentFilesRef.current?.length > 0 || uploadedImagesRef.current?.length > 0) {
			return;
		}

		let chatBoxData = info?.chatBoxInfo;

		if (isPublicChat) {
			if (chatBoxData?.webSearch) {
				chatBoxData = {
					...chatBoxData,
					webSearch: false,
					deepResearch: !chatBoxData?.deepResearch,
				};
				handleGlobalChatMessages({
					sessionId: info?.chatSessionId,
					chatBoxInfo: chatBoxData,
					updateExtraInfo: true,
				});
				return;
			}
		}

		if (chatBoxData?.deepResearch) {
			return;
		}

		chatBoxData = {
			...chatBoxData,
			deepResearch: true,
			ask: false,
			goals: false,
			build: false,
		};

		handleGlobalChatMessages({
			sessionId: info?.chatSessionId,
			chatBoxInfo: chatBoxData,
			updateExtraInfo: true,
		});
	};

	// const handleShowFiltersClick = () => {
	// 	if (chatInfo?.deepResearch) return;
	// 	setInfo((prev) => ({
	// 		...prev,
	// 		showFilters: true,
	// 	}));
	// };

	const handleHideFiltersClick = () => {
		setInfo((prev) => ({
			...prev,
			showFilters: false,
		}));
	};

	const handleResetFiltersClick = () => {
		setInfo((prev) => ({
			...prev,
			chatFilters: initialChatFilters,
		}));
	};

	const handleRecentFileClick = (file) => {
		let udpatedData = [...(recentFilesRef?.current || [])];
		const isFileAlreadyPresent = recentFilesRef?.current?.some((ele) => ele?._id === file?._id);
		udpatedData = recentFilesRef?.current?.filter((ele) => ele?._id !== file?._id);
		recentFilesRef.current = udpatedData;
		if (isFileAlreadyPresent) {
			setInfo((prev) => ({
				...prev,
				recentFiles: udpatedData,
			}));
		} else {
			udpatedData?.push(file);
			recentFilesRef.current = udpatedData;
			setInfo((prev) => ({
				...prev,
				recentFiles: udpatedData,
			}));
		}
	};

	const handleRemoveFileFromRecentFileClick = (file) => {
		const updatedRecentFiles = recentFilesRef?.current?.filter(
			(ele) => ele?._id !== file?._id || ele?.uniqueId !== file?.uniqueId,
		);
		recentFilesRef.current = updatedRecentFiles;

		if (file?.loading && file?.uploadStatus?.status !== 'ready') {
			deleteMultiAgentFile(file?.fileId);
		}
		setInfo((prev) => ({
			...prev,
			recentFiles: updatedRecentFiles,
		}));
	};

	const handleIntegrationsOptionClick = (key) => {
		let currentIntegrations = { ...info?.chatFilters?.integrations };
		if (currentIntegrations[key]) {
			delete currentIntegrations[key];
		} else {
			currentIntegrations[key] = integrationsOptions[key];
		}
		setInfo((prev) => ({
			...prev,
			chatFilters: {
				...prev?.chatFilters,
				integrations: currentIntegrations,
			},
		}));
	};

	const handleModulesOptionClick = (key) => {
		let currentModules = { ...info?.chatFilters?.modules };
		if (currentModules[key]) {
			delete currentModules[key];
		} else {
			currentModules[key] = modulesOptions[key];
		}
		setInfo((prev) => ({
			...prev,
			chatFilters: {
				...prev?.chatFilters,
				modules: currentModules,
			},
		}));
	};

	const handleSendMessageFunc = useCallback(
		async (e, click = null, query = null) => {
			if (e?.key === 'Enter' || click) {
				// If Shift+Enter, allow new line

				if (e?.shiftKey) {
					return;
				}
				// Prevent default to avoid unwanted new line
				e?.preventDefault();

				if (!isPublicChat && window.location.hostname !== 'localhost') {
					const totalCreditsUsed = currentPlan?.totalAiCreditUsed || 0,
						totalCreditsLimit = currentPlan?.totalAiCreditLimit || 0;
					if (totalCreditsUsed >= totalCreditsLimit) {
						return message.error('You have reached your limit of credits');
					}
				}

				if (aiChatLoading || info?.chatLoading) {
					return message.error('Please wait for the AI response');
				}

				if (!checkAllUploadLoadingStatus()) {
					return message.error('Please wait for the files to upload');
				}

				if (info?.chatQuery?.trim()?.length > 0 || query?.trim()?.length > 0) {
					let currentQuery =
						(chatReplyData ? chatReplyData + '\n' : '') +
						(info?.chatQuery?.trim() || query?.trim());
					const routeName = location?.pathname?.split('/')?.[1];
					const sessionId = params?.sessionId || info?.chatSessionId;
					const chatBoxData =
						globalChatMessages?.[sessionId]?.chatBoxInfo || info?.chatBoxInfo;
					const chatInfo = globalChatMessages?.[sessionId]?.chatInfo;

					const chatPayload = globalChatMessages?.[sessionId]?.chatPayload || {};
					const date =
						info?.chatFilters?.dateRange?.length > 0
							? [
									moment(info?.chatFilters?.dateRange[0])?.unix(),
									moment(info?.chatFilters?.dateRange[1])?.unix(),
							  ]
							: [];

					query = currentQuery;

					const payload = {
						query,
						timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
						web_search: chatBoxData?.webSearch,
						...(!isPublicChat && {
							knowledge_base_search: chatBoxData?.workspaceSearch,
						}),
						...(!isPublicChat && { modules: Object?.keys(info?.chatFilters?.modules) }),
						...(!isPublicChat && { date: date }),
						deep_research: chatBoxData?.deepResearch,
						deep_search: chatBoxData?.deepSearch,
					};

					if (chatInfo?.agentType === 'knowledge_agent') {
						payload.assistant_id = chatInfo?.assistantId;
					}

					const selected_model = chatBoxData?.selectedLLMModel || null;
					payload.selected_model = selected_model;

					if (moduleHelper?.[location?.pathname?.split('/')?.[1]]) {
						payload.screen = moduleHelper[location?.pathname?.split('/')?.[1]];
					}
					let localPayload = {};
					if (uploadedImagesRef?.current?.length) {
						const imagesPngJpeg =
							uploadedImagesRef?.current?.filter(
								(file) => file?.type === 'image/png' || file?.type === 'image/jpeg',
							) || [];

						payload.image_data_base64 = imagesPngJpeg?.map((file) => file?.preview);

						const remainingImages = uploadedImagesRef?.current?.filter(
							(file) => !(file?.type === 'image/png' || file?.type === 'image/jpeg'),
						);
						payload.files = remainingImages?.map((ele) => ({
							id: ele?.fileId || null,
							name: ele?.name || 'Untitled Image',
						}));

						localPayload = {
							files: uploadedImagesRef?.current || [],
							handlePreview,
						};
					}
					if (recentFilesRef?.current?.length > 0) {
						if (payload?.files && payload.files?.length > 0) {
							payload.files = [
								...payload.files,
								...(recentFilesRef?.current?.map((ele) => ({
									id: ele?._id || ele?.fileId || null,
									name: ele?.originalFileName || ele?.title || 'Untitled File',
								})) || []),
							];
						} else {
							payload.files = recentFilesRef?.current?.map((ele) => ({
								id: ele?._id || ele?.fileId || null,
								name: ele?.originalFileName || ele?.title || 'Untitled File',
							}));
						}
					}

					if (proactiveInfoForChat) {
						payload.proactive = true;
						if (proactiveInfoForChat?.proactiveSessionId) {
							payload.proactive_id = proactiveInfoForChat?.proactiveSessionId;
						}
						updateStateValues({
							proactiveInfoForChat: null,
						});
					}

					if (activeWorkflowSlugForSmartFile) {
						payload.workflow_slug = activeWorkflowSlugForSmartFile;
					}
					if (chatPayload?.workflowTemplateId) {
						payload.workflow_template_id = chatPayload?.workflowTemplateId;
					}
					if (chatPayload?.moduleTemplateId) {
						payload.module_template_id = chatPayload?.moduleTemplateId;
					}

					if (routeName === 'contact') {
						payload.module_id = params?.contactId;
					}

					if (routeName === 'meet') {
						payload.module_id = params?.meetingId;
					}

					if (routeName === 'note') {
						payload.module_id = params?.noteId;
					}

					if (isDirectSearchAgent) {
						payload.direct_search_agent = true;
						updateStateValues({
							isDirectSearchAgent: false,
						});
					}

					payload.is_browser_screen_active = isBrowserScreenActive;

					let location_details = JSON?.parse(localStorage?.getItem('locationDetails'));

					if (!location_details) {
						location_details = await getLocationsDetails();
					}

					//this payload props are for public chat
					if (isPublicChat) {
						const user_id = localStorage?.getItem('user_id');
						const ip_address = localStorage?.getItem('ipAddress');
						payload.user_id = user_id ?? null;
						payload.location_details = location_details || {};
						payload.ip_address = ip_address ?? null;
					} else {
						payload.location = location_details || {};
					}

					setInfo((prev) => ({
						...prev,
						uploadedImages: [],
						chatQuery: '',
						// recentFiles: [],// not clearing the recent files , because they want like sana
						chatFilters: initialChatFilters,
						chatboxMinimized: true,
						suggestion: null,
						showSuggestion: false,
					}));
					uploadedImagesRef.current = [];

					onChatQueryChange?.('');
					clearTextArea();
					if (
						!(
							globalChatMessages?.[sessionId]?.messages?.length > 0 ||
							aiChatSessions?.data?.findIndex((ele) => ele?._id === sessionId) !== -1
						)
					) {
						const payload = {
							sessionId,
							addNewSession: true,
							type: 'update',
							agentType: chatInfo?.agentType ?? 'multi_agent',
							assistantId: chatInfo?.assistantId,
						};
						updateAiChatSessions(payload);
					}
					if (customChatActions) {
						return onSend({
							payload,
							localPayload,
							currentQuery,
							recentFiles: recentFilesRef?.current || [],
						});
					}
					if (chatReplyData) {
						updateStateValues({
							chatReplyData: null,
						});
					}

					handleStreamSendMessage(payload, localPayload, currentQuery, sessionId);
					if (handleSendWebsocketMessage) {
						handleSendWebsocketMessage(payload, currentQuery);
					}
				}
			}
		},
		[
			aiChatLoading,
			onSend,
			customChatActions,
			info,
			activeWorkflowSlugForSmartFile,
			recentFilesRef.current,
			uploadedImagesRef?.current,
			location,
			params,
			currentPlan,
			globalChatMessages,
			chatReplyData,
			proactiveInfoForChat,
			onChatQueryChange,
			aiChatSessions,
			isDirectSearchAgent,
			isBrowserScreenActive,
		],
	);

	const handleWorkflowSlugSelection = useCallback(
		async (data, query) => {
			const showCustomChatOptions = [
				{
					type: 'AI',
					contentType: 'loading',
				},
			];

			const payload = {
				query: query,
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				workflow_slug: data,
			};
			const localPayload = {
				showCustomChatOptions,
			};
			if (moduleHelper?.[location?.pathname?.split('/')?.[1]]) {
				payload.module = moduleHelper?.[location?.pathname?.split('/')?.[1]];
			}

			handleSendWebsocketMessage(payload, '');
			handleStreamSendMessage(payload, localPayload, '');
		},
		[info],
	);

	const handleVariablesRequired = useCallback(
		(requiredVariables, query) => {
			if (requiredVariables?.[0] === 'workflow_slug') {
				let workflowSlug = [
					{
						type: 'AI',
						message: 'Please select a workflow to continue',
						content: (
							<WorkflowSlugSelector
								handleWorkflowSlugSelection={handleWorkflowSlugSelection}
								query={query}
							/>
						),
					},
				];
				updateApplicationChat(workflowSlug);
			}
		},
		[handleWorkflowSlugSelection],
	);

	const handleGlobalImageProcessing = useCallback(
		async (file) => {
			const uploadBatchId = ObjectID()?.toString();
			const payload = {
				sessionId: info?.chatSessionId,
				originalFileName: file?.name || 'Untitled file',
				uploadBatchId,
			};
			const response = await handleGlobalUploadImage(file, payload);
			let uploadedImages, recentFiles, requiredFileIndex;
			let isImage = file?.type?.includes('image');

			if (!response?.[0]) {
				requiredFileIndex = -1;
				if (isImage) {
					requiredFileIndex = uploadedImages?.findIndex(
						(ele) => ele?.uniqueId === file?.uniqueId,
					);
				} else {
					requiredFileIndex = recentFiles?.findIndex(
						(ele) => ele?.uniqueId === file?.uniqueId,
					);
				}

				if (requiredFileIndex === -1) {
					return;
				}

				uploadedImages = [...(uploadedImagesRef?.current || [])];
				recentFiles = [...(recentFilesRef?.current || [])];

				if (isImage) {
					uploadedImages.splice(requiredFileIndex, 1);
					uploadedImagesRef.current = uploadedImages;
				} else {
					recentFiles.splice(requiredFileIndex, 1);
					recentFilesRef.current = recentFiles;
				}

				setInfo((prev) => ({ ...prev, uploadedImages, recentFiles }));
				return message.error(response?.[1] || 'failed to upload image');
			}

			const { _id } = response?.[1] || {};
			file.fileId = _id;

			requiredFileIndex = -1;
			if (isImage) {
				requiredFileIndex = uploadedImages?.findIndex(
					(ele) => ele?.uniqueId === file?.uniqueId,
				);
			} else {
				requiredFileIndex = recentFiles?.findIndex(
					(ele) => ele?.uniqueId === file?.uniqueId,
				);
			}

			if (requiredFileIndex === -1) {
				return;
			}

			uploadedImages = [...(uploadedImagesRef?.current || [])];
			recentFiles = [...(recentFilesRef?.current || [])];

			if (isImage) {
				uploadedImages.splice(requiredFileIndex, 1, file);
				uploadedImagesRef.current = uploadedImages;
			} else {
				recentFiles.splice(requiredFileIndex, 1, file);
				recentFilesRef.current = recentFiles;
			}

			setInfo((prev) => ({ ...prev, uploadedImages, recentFiles }));
			checkIndividualImageUploadedStatusFunc(file, uploadBatchId);
		},
		[info, uploadedImagesRef?.current, recentFilesRef?.current],
	);

	const checkIndividualImageUploadedStatusFunc = useCallback(
		async (fileData, uploadBatchId) => {
			let isImage = fileData?.type?.includes('image');
			let uploadedImages, recentFiles, requiredFileIndex;

			let uploadedCount = 0,
				maxAttempts = 90,
				errorCount = 0,
				successCount = 0;

			while (!(uploadedCount && successCount) && maxAttempts) {
				if (isImage) {
					requiredFileIndex = uploadedImagesRef?.current?.findIndex(
						(ele) => ele?.uniqueId === fileData?.uniqueId,
					);
				} else {
					requiredFileIndex = recentFilesRef?.current?.findIndex(
						(ele) => ele?.uniqueId === fileData?.uniqueId,
					);
				}

				if (requiredFileIndex === -1) {
					return;
				}

				const response = await checkIndividualImageUploadedStatus(uploadBatchId);
				if (response?.[0]) {
					uploadedCount = response?.[1]?.uploadedCount;
					errorCount = response?.[1]?.errorCount;
					successCount = response?.[1]?.successCount;
					if (uploadedCount && successCount) {
						break;
					}
					if (errorCount) {
						break;
					}
				}
				//dealying the check
				await new Promise((resolve) => setTimeout(resolve, 2000));
				maxAttempts--;
			}

			if (errorCount || maxAttempts === 0) {
				requiredFileIndex = -1;

				if (isImage) {
					requiredFileIndex = uploadedImagesRef?.current?.findIndex(
						(ele) => ele?.uniqueId === fileData?.uniqueId,
					);
				} else {
					requiredFileIndex = recentFilesRef?.current?.findIndex(
						(ele) => ele?.uniqueId === fileData?.uniqueId,
					);
				}

				if (requiredFileIndex === -1) {
					return;
				}

				uploadedImages = [...(uploadedImagesRef?.current || [])];
				recentFiles = [...(recentFilesRef?.current || [])];
				let file = null;

				if (isImage) {
					file = uploadedImages[requiredFileIndex];
					uploadedImages.splice(requiredFileIndex, 1);
					uploadedImagesRef.current = uploadedImages;
				} else {
					file = recentFiles[requiredFileIndex];
					recentFiles.splice(requiredFileIndex, 1);
					recentFilesRef.current = recentFiles;
				}

				if (maxAttempts === 0) {
					deleteMultiAgentFile(file?.fileId);
				}

				setInfo((prev) => ({ ...prev, uploadedImages, recentFiles }));
				return message.error('Something went wrong while processing the image');
			}

			if (uploadedCount && uploadedCount > 0) {
				requiredFileIndex = -1;

				if (isImage) {
					requiredFileIndex = uploadedImagesRef?.current?.findIndex(
						(ele) => ele?.uniqueId === fileData?.uniqueId,
					);
				} else {
					requiredFileIndex = recentFilesRef?.current?.findIndex(
						(ele) => ele?.uniqueId === fileData?.uniqueId,
					);
				}

				if (requiredFileIndex === -1) {
					return;
				}

				uploadedImages = [...(uploadedImagesRef?.current || [])];
				recentFiles = [...(recentFilesRef?.current || [])];

				fileData.loading = false;
				if (isImage) {
					uploadedImages.splice(requiredFileIndex, 1, fileData);
					uploadedImagesRef.current = uploadedImages;
				} else {
					recentFiles.splice(requiredFileIndex, 1, fileData);
					recentFilesRef.current = recentFiles;
				}

				setInfo((prev) => ({ ...prev, uploadedImages, recentFiles }));
			}
		},
		[info, recentFilesRef?.current, uploadedImagesRef?.current],
	);

	const handleFileAttachmentChange = useCallback(
		async ({ file }) => {
			if (file?.size >= 5242880) {
				message?.error('File size must be less than 5MB');
				return;
			}

			let uploadedImages = [...(uploadedImagesRef?.current || [])];
			let recentFiles = [...(recentFilesRef?.current || [])];
			file.preview = await getBase64(file);
			file.loading = true;
			file.uniqueId = Date?.now() + '_' + Math?.floor(Math?.random() * 1000000);

			if (file?.type?.includes('image')) {
				if (file?.type === 'image/png' || file?.type === 'image/jpeg') {
					file.loading = false;
				}
				uploadedImages?.push(file);
				uploadedImagesRef.current = uploadedImages;
			} else {
				file.originalFileName = file.name;
				file.sourceType = file.type;
				recentFiles?.unshift(file);
				recentFilesRef.current = recentFiles;
			}
			if (!(file?.type === 'image/png' || file?.type === 'image/jpeg')) {
				handleGlobalImageProcessing(file);
			}

			setInfo((prev) => ({
				...prev,
				uploadedImages,
				recentFiles,
			}));
		},
		[handleAiUploadImage, info, recentFilesRef?.current, uploadedImagesRef?.current],
	);

	const checkAllUploadLoadingStatus = useCallback(() => {
		let uploadedImages = [...(uploadedImagesRef.current || [])];
		let recentFiles = [...(recentFilesRef.current || [])];
		for (let i = 0; i < uploadedImages?.length; i++) {
			if (uploadedImages[i]?.loading) {
				return false;
			}
		}
		for (let i = 0; i < recentFiles?.length; i++) {
			if (recentFiles?.[i]?.loading) {
				return false;
			}
		}
		return true;
	}, [info, recentFilesRef, uploadedImagesRef]);

	const handleRemoveImage = useCallback(
		(ele) => {
			let uploadedImages = [...(uploadedImagesRef.current || [])];

			let requiredFileIndex = -1;
			requiredFileIndex = uploadedImages?.findIndex(
				(file) => ele?.uniqueId === file?.uniqueId,
			);
			if (requiredFileIndex === -1) {
				return;
			}

			uploadedImages.splice(requiredFileIndex, 1);
			uploadedImagesRef.current = uploadedImages;
			setInfo((prev) => ({ ...prev, uploadedImages }));
			deleteUploadedImageThroughChat(ele?.fileId);
		},
		[info, uploadedImagesRef],
	);

	// Comprehensive function to clear all transcription states
	const clearTranscriptionStates = useCallback(() => {
		// Clear all transcription-related states
		setIsTranscribing(false);
		setLiveKitToken(null);
		setTranscriptionText('');

		// Clear chat query if it was set by transcription
		setInfo((prev) => ({
			...prev,
			chatQuery: '',
			voiceIntegration: false,
			suggestion: null,
			showSuggestion: false,
		}));

		// Clear transcription session ID
		transcriptionSessionId.current = ObjectID().toString();

		// Disconnect LiveKit connection
		disconnect();

		// Clear any stored segments or transcription data
		// The segments will be cleared automatically when trackRef becomes undefined

		console.log('All transcription states cleared');
	}, [disconnect]);

	const handleMicIconClick = useCallback(
		async (event) => {
			try {
				const { hasMic, hasCamera } = await checkDevices();

				if (!hasMic) {
					message.error('Mic is not available');
					return;
				}

				// Handle transcription toggle
				if (!isTranscribing) {
					try {
						// Generate new session ID for each transcription start
						transcriptionSessionId.current = ObjectID().toString();

						// Get LiveKit token
						const response = await getLiveKitToken({
							meetingId: transcriptionSessionId.current,
						});

						// Handle different response formats
						let token = null;
						if (response && response[0] === true) {
							// Check if response[1] has token or accessToken
							token = response[1]?.token || response[1]?.accessToken;
						} else if (response && response.token) {
							// Direct response format
							token = response.token;
						}

						if (token) {
							if (isMountedRef.current) {
								setLiveKitToken(token);
								setIsTranscribing(true);
								setTranscriptionText('');
								// Reset voiceIntegration to false to keep chat interface visible
								setInfo((prev) => ({ ...prev, voiceIntegration: false }));
							}
						} else {
							console.error('Failed to fetch LiveKit token:', response);
							message.error('Failed to start transcription. Please try again.');
						}
					} catch (err) {
						console.error('Error fetching LiveKit token:', err);
						message.error('Error starting transcription. Please try again.');
					}
				} else {
					// Stop transcription and clear all states
					clearTranscriptionStates();
				}

				// Don't call handleConnect during transcription to avoid voiceIntegration conflicts
				// The transcription uses its own LiveKit connection, not the voice integration

				event.stopPropagation();
			} catch (error) {
				console.error('Error in handleMicIconClick:', error);
				message.error('An error occurred while starting transcription');
			}
		},

		[info, isTranscribing, getLiveKitToken],
	);

	const handleSendBtnClick = (e) => {
		if (info?.chatQuery?.trim()?.length > 0) {
			handleSendMessageFunc(e, true);
		}
	};

	const handleTextAreaKeyDown = (e) => {
		handleSendMessageFunc?.(e);
		if (e?.key === 'Tab') {
			e?.preventDefault();
			e?.stopPropagation();
			setInfo((prev) => {
				if (
					prev?.suggestion &&
					prev?.chatQuery?.length > 0 &&
					prev?.suggestion?.startsWith(prev?.chatQuery)
				) {
					previousChatQueryRef.current = prev?.suggestion;
					return {
						...prev,
						chatQuery: prev?.suggestion,
						suggestion: null,
						showSuggestion: false,
					};
				}
				return prev;
			});
		}
	};

	const handleTextAreaFocus = () => {
		// Clear suggestions when text field is focused
		setInfo((prev) => ({
			...prev,
			suggestion: null,
			showSuggestion: false,
		}));
	};

	const handleTextAreaPaste = useCallback(
		(e) => {
			const items = e?.clipboardData?.items || [];

			for (let i = 0; i < items?.length; i++) {
				const item = items[i];
				if (item?.kind === 'file' && item?.type?.startsWith('image/')) {
					e?.preventDefault(); // stop pasting as text
					const file = item?.getAsFile();
					if (file) {
						// Call your upload logic
						handleFileAttachmentChange({ file });
					}
				}
			}
		},
		[handleFileAttachmentChange],
	);

	const handleTextAreaChange = (e) => {
		const textArea = textAreaRef?.current;
		const textAreaWrapper = textAreaWrapperRef?.current;
		const suggestionContainer = suggestionRef?.current;
		const query = e?.target?.value;
		const lastChar = query?.trim()?.slice(-1);

		let textAreaHeight = '';

		if (textArea) {
			textArea.style.height = 'auto';
			textAreaHeight = textArea?.scrollHeight;
			if (suggestionContainer) {
				const suggestionContainerHeight = suggestionContainer?.scrollHeight;
				if (textAreaHeight < suggestionContainerHeight) {
					textAreaHeight = suggestionContainerHeight;
				}
			}
			textAreaHeight = Math.min(textAreaHeight, 200);
			textArea.style.height = textAreaHeight + 'px';
		}

		if (textAreaWrapper) {
			textAreaWrapper.style.height = textAreaHeight + 'px';
		}
		if (suggestionContainer) {
			suggestionContainer.style.height = textAreaHeight + 'px';
		}

		let isRecentFileOpen = false;
		if (lastChar === '@') {
			isRecentFileOpen = true;
		} else {
			isRecentFileOpen = false;
		}

		onChatQueryChange?.(query);

		setInfo((prev) => ({
			...prev,
			chatQuery: query,
			isRecentFileOpen,
			chatBoxContainerHeight: textAreaHeight + 58 + 28 + 'px',
		}));
	};

	const clearTextArea = () => {
		const textArea = textAreaRef?.current;
		const textAreaWrapper = textAreaWrapperRef?.current;
		const suggestionContainer = suggestionRef?.current;
		if (textArea) {
			textArea.style.height = '30px'; // Reset to initial min-height
		}
		if (textAreaWrapper) {
			textAreaWrapper.style.height = '30px';
		}
		if (suggestionContainer) {
			suggestionContainer.style.height = '30px';
		}
	};

	const handleBuildClick = () => {
		let chatBoxData = info?.chatBoxInfo;
		if (chatBoxData?.build) {
			return;
		}
		chatBoxData = {
			...chatBoxData,
			build: true,
			ask: false,
			deepResearch: false,
			goals: false,
			deepSearch: false,
		};
		handleGlobalChatMessages({
			sessionId: info?.chatSessionId,
			chatBoxInfo: chatBoxData,
			updateExtraInfo: true,
		});
	};

	// const handleSearchTypeChangeForReason = (type, value) => {
	// 	const reason = { ...chatInfo?.reason, [type]: value };
	// 	let deepResearch = chatInfo?.deepResearch;

	// 	if (reason?.webSearch === false && reason?.workspaceSearch === false) {
	// 		deepResearch = false;
	// 	} else {
	// 		deepResearch = true;
	// 	}

	// 	updateStateValues({
	// 		chatInfo: {
	// 			...chatInfo,
	// 			reason,
	// 			deepResearch,
	// 			ask: deepResearch ? false : true,
	// 			build: false,
	// 		},
	// 	});
	// };

	const handleChatBoxClick = (e) => {
		if (animateChatBox) {
			e?.stopPropagation();
			if (info?.chatboxMinimized) {
				setInfo((prev) => ({
					...prev,
					chatboxMinimized: false,
				}));
			}
		}
		if (customChatBoxClick) {
			customChatBoxClick?.(e);
		}
	};

	const handleAskClick = () => {
		let chatBoxData = info?.chatBoxInfo;
		if (chatBoxData?.ask) {
			return;
		}

		chatBoxData = {
			...chatBoxData,
			ask: true,
			deepResearch: false,
			goals: false,
			build: false,
			deepSearch: false,
		};
		handleGlobalChatMessages({
			sessionId: info?.chatSessionId,
			chatBoxInfo: chatBoxData,
			updateExtraInfo: true,
		});
	};

	const handleDeepSearchClick = () => {
		let chatBoxData = info?.chatBoxInfo;
		if (chatBoxData?.deepSearch) {
			return;
		}
		chatBoxData = {
			...chatBoxData,
			deepSearch: true,
			ask: false,
			deepResearch: false,
			goals: false,
			build: false,
		};
		handleGlobalChatMessages({
			sessionId: info?.chatSessionId,
			chatBoxInfo: chatBoxData,
			updateExtraInfo: true,
		});
	};

	const handleReplyCloseClick = useCallback(() => {
		updateStateValues({
			chatReplyData: null,
		});
	}, []);

	const handleUpgradeClick = useCallback(() => {
		setInfo((prev) => ({
			...prev,
			openUpgradeModal: true,
		}));
	}, []);

	const handleCloseUpgrageModal = useCallback(() => {
		setInfo((prev) => ({ ...prev, openUpgradeModal: false }));
	}, []);

	const handleAskTooltipClick = useCallback((e) => {
		e?.stopPropagation();
		setInfo((prev) => ({
			...prev,
			askTooltipOpen: true,
		}));
	}, []);

	const handleScrollButtonClick = useCallback(
		(e) => {
			e?.stopPropagation();
			smoothScrollToBottom?.();
		},
		[smoothScrollToBottom],
	);

	const handleVoiceAgentClick = useCallback((e) => {
		e?.stopPropagation();
		// Show the global voice widget and trigger auto-connect
		updateAiSetupState({ showVoiceWidget: true });
	}, [updateAiSetupState]);


	return (
		<div className="chatParentWrapper" onClick={handleChatBoxClick}>
			<div className={`chatWrapper`}>
				<div
					className={`chat-box-container ${
						info?.voiceIntegration ? 'inactive' : 'active'
					}`}
				>
					<div className="chatcontainer">
						<div className="chatBodyContainer">
							<div
								className="chatInputContainer"
								style={{
									...(animateChatBox && {
										height: info?.chatBoxContainerHeight,
									}),
								}}
							>
								<div
									className={`chatInputParentContainer ${
										startPage ? ' startPageContainer' : ''
									}`}
								>
									<RecentFileTooltip
										fileTypeIcons={fileTypeIcons}
										handleRecentFileClick={handleRecentFileClick}
										recentFiles={recentFilesRef.current || []}
										isRecentFileOpen={info?.isRecentFileOpen}
										setIsRecentFileOpen={(value) => {
											setInfo((prev) => ({
												...prev,
												isRecentFileOpen: value,
											}));
										}}
									>
										<div className="recent-file-wrapper" />
									</RecentFileTooltip>
									<div className="chat-input-container">
										{startPage && !isPublicChat && (
											<>
												<UploadFileTooltip
													fileTypeIcons={fileTypeIcons}
													handleChange={handleFileAttachmentChange}
													isUploadFileOpen={info?.isUploadFileOpen}
													setIsUploadFileOpen={(value) => {
														if (
															info?.chatBoxInfo?.deepResearch ||
															totalCreditsUsed >= totalCreditsLimit
														)
															return;
														setInfo((prev) => ({
															...prev,
															isUploadFileOpen: value,
														}));
													}}
													handleRecentFileClick={handleRecentFileClick}
													recentFiles={recentFilesRef.current || []}
												>
													<Tooltip
														title={
															<div className="chatbox-icon-tooltip-container">
																Upload File
															</div>
														}
														color="transparent"
														arrow={false}
														rootClassName="chatbox-tooltip"
													>
														<div
															className="chat-box-icon-container start-page-icon"
															style={{
																opacity: `${
																	info?.chatBoxInfo?.deepResearch
																		? '0.5'
																		: '1'
																}`,
																background: 'var(--card)',
																padding: '6px 8px',
															}}
														>
															<div
																className="chat-icon"
																style={{ cursor: 'pointer' }}
															>
																<PlusSvg width={24} height={24} />
															</div>
														</div>
													</Tooltip>
												</UploadFileTooltip>
												<div className="vertical-line"></div>
											</>
										)}

										<div
											className={`placeholderContainer ${
												startPage ? 'startPagePlaceholderContainer' : ''
											}`}
										>
											<div
												className="textAreaWrapper"
												ref={textAreaWrapperRef}
											>
												<div
													className="suggestion-container"
													ref={suggestionRef}
													style={{
														display:
															info?.showSuggestion &&
															info?.chatQuery?.length > 0
																? 'block'
																: 'none',
													}}
												>
													{info?.suggestion}
												</div>
												<div className="textarea-container">
													<textarea
														type="text"
														value={info?.chatQuery}
														onChange={handleTextAreaChange}
														autoFocus={autoFocus}
														onKeyDown={handleTextAreaKeyDown}
														onFocus={handleTextAreaFocus}
														className={`textArea ${
															startPage ? 'startTextPage' : ''
														} ${isTranscribing ? 'transcribing' : ''}`}
														rows={1}
														ref={textAreaRef}
														onPaste={handleTextAreaPaste}
														placeholder={
															isTranscribing
																? 'Listening... Speak now'
																: !animatePlaceholder
																? placeholder
																: ''
														}
													/>
												</div>
											</div>

											{showPlaceholder && animatePlaceholder && (
												<ChatBoxPlaceholder
													activePlaceholderIndex={
														info?.activePlaceholderIndex
													}
													chatboxPlaceholders={chatboxPlaceholders}
												/>
											)}
										</div>
										{startPage &&
											(info?.chatQuery?.trim()?.length > 0 || isPublicChat ? (
												<div
													className={`click-btn ${
														startPage ? 'startPage' : ''
													}`}
													onClick={(e) => handleSendBtnClick(e)}
													style={{
														backgroundColor: 'var(--primary-button)',
													}}
												>
													<ArrowUp />
												</div>
											) : (
												<div style={{ display: 'flex', gap: '8px' }}>
													<div
														className={`click-btn speech-to-text-btn ${
															startPage ? 'startPage' : ''
														} ${isTranscribing ? 'transcribing' : ''}`}
														onClick={(e) => handleMicIconClick(e)}
														style={{
															backgroundColor: isTranscribing
																? 'var(--error-color)'
																: 'var(--secondary-button)',
														}}
														title={
															isTranscribing
																? 'Stop Recording'
																: 'Start Speech-to-Text'
														}
													>
														{isTranscribing ? (
															<StopIconSvg />
														) : (
															<SpeechMicSvg />
														)}
													</div>
												</div>
											))}
									</div>
									{!startPage && (
										<div className="chatInputParentContainer__options-container">
											{info?.showFilters ? (
												<div className="filters-parent-container">
													<div
														className="close-filters"
														onClick={handleHideFiltersClick}
													>
														<ChevronSvg />
													</div>
													<div className="filters-wrapper">
														<div className="filters-container">
															{/* <SearchDropdown
															headerTitle="Integrations"
															selectedOptions={
																info?.chatFilters?.integrations
															}
															isDropdownOpen={
																info?.isIntegrationsDropdownOpen
															}
															setIsDropdownOpen={(value) =>
																setInfo((prev) => ({
																	...prev,
																	isIntegrationsDropdownOpen:
																		value,
																}))
															}
															options={integrationsOptions}
															handleOptionClick={
																handleIntegrationsOptionClick
															}
														/> */}
															<SearchDropdown
																headerTitle="Modules"
																selectedOptions={
																	info?.chatFilters?.modules
																}
																isDropdownOpen={
																	info?.isModulesDropdownOpen
																}
																setIsDropdownOpen={(value) =>
																	setInfo((prev) => ({
																		...prev,
																		isModulesDropdownOpen:
																			value,
																	}))
																}
																options={modulesOptions}
																handleOptionClick={
																	handleModulesOptionClick
																}
															/>
															<DateRangeDropdown
																onOptionClick={(value) => {
																	setInfo((prev) => ({
																		...prev,
																		chatFilters: {
																			...prev?.chatFilters,
																			dateRange: value,
																		},
																	}));
																}}
																startDate={
																	info?.chatFilters
																		?.dateRange?.[0]
																}
																endDate={
																	info?.chatFilters
																		?.dateRange?.[1]
																}
															/>
														</div>
														<div
															className="reset-filters"
															onClick={handleResetFiltersClick}
														>
															<CloseSvg />
														</div>
													</div>
												</div>
											) : (
												<div className="buttons-container">
													<div className="chat-icons-container">
														{!isPublicChat && showBottomTools && (
															<UploadFileTooltip
																fileTypeIcons={fileTypeIcons}
																handleChange={
																	handleFileAttachmentChange
																}
																isUploadFileOpen={
																	info?.isUploadFileOpen
																}
																setIsUploadFileOpen={(value) => {
																	if (
																		info?.chatBoxInfo
																			?.deepResearch
																	)
																		return;
																	setInfo((prev) => ({
																		...prev,
																		isUploadFileOpen: value,
																	}));
																}}
																handleRecentFileClick={
																	handleRecentFileClick
																}
																recentFiles={
																	recentFilesRef.current || []
																}
															>
																<Tooltip
																	title={
																		<div className="chatbox-icon-tooltip-container upload-file-tooltip-btn-container">
																			<PlusSvg
																				width={20}
																				height={20}
																			/>
																			Upload File
																		</div>
																	}
																	color="transparent"
																	arrow={false}
																	rootClassName="chatbox-tooltip"
																>
																	<div
																		className="upload-file-icon-container"
																		style={{
																			opacity: '1',
																		}}
																	>
																		<PlusSvg
																			width={20}
																			height={20}
																		/>
																	</div>
																</Tooltip>
															</UploadFileTooltip>
														)}

														<div className="combined-chat-options">
															{!isPublicChat && showBottomTools && (
																<Tooltip
																	title={
																		<div className="chatbox-icon-tooltip-container ask-option-tooltip-container">
																			<BulbSvg />
																			Ask Ai
																		</div>
																	}
																	color="transparent"
																	arrow={false}
																	rootClassName="chatbox-tooltip"
																>
																	<div
																		className={`chat-box-icon-container ${
																			info?.chatBoxInfo?.ask
																				? 'active'
																				: ''
																		}`}
																		onClick={handleAskClick}
																	>
																		<div className="chat-icon">
																			<div
																				className="text-wrapper  ask-text-wrapper"
																				style={{
																					padding: '7px',
																				}}
																			>
																				<div className="bulb-icon">
																					<BulbSvg
																						style={{
																							width: '20px',
																							height: '20px',
																						}}
																					/>
																				</div>
																				<div className="icon-text ask-icon-text">
																					Ask
																				</div>
																				<AskTooltip
																					open={
																						info?.askTooltipOpen
																					}
																					onOpenChange={(
																						value,
																					) => {
																						setInfo(
																							(
																								prev,
																							) => ({
																								...prev,
																								askTooltipOpen:
																									value,
																							}),
																						);
																					}}
																				>
																					<div
																						className={`icon-arrow-wrapper ${
																							info
																								?.chatBoxInfo
																								?.ask
																								? 'icon-arrow-wrapper-active'
																								: ''
																						}`}
																						onClick={(
																							e,
																						) =>
																							handleAskTooltipClick(
																								e,
																							)
																						}
																					>
																						<div className="icon-arrow">
																							<ArrowDownSvg
																								fill={
																									'var(--primary-font)'
																								}
																							/>
																						</div>
																					</div>
																				</AskTooltip>
																			</div>

																			{/* <div className="icon-arrow">
																				<ArrowDownSvg
																					fill={
																						chatInfo?.ask
																							? 'var(--primary-button)'
																							: 'var(--primary-font)'
																					}
																				/>
																			</div> */}
																		</div>
																	</div>
																</Tooltip>
															)}

															{!isPublicChat && showBottomTools && (
																<Tooltip
																	title={
																		<div className="chatbox-icon-tooltip-container deep-search-tooltip-container">
																			<AtomSvg />
																			Deep Search
																		</div>
																	}
																	color="transparent"
																	arrow={false}
																	rootClassName="chatbox-tooltip"
																>
																	<div
																		className={`chat-box-icon-container ${
																			info?.chatBoxInfo
																				?.deepSearch
																				? 'active'
																				: ''
																		}`}
																		onClick={
																			handleDeepSearchClick
																		}
																	>
																		<div className="chat-icon">
																			<div className="text-wrapper goals-text-wrapper">
																				<div
																					className="trend-icon"
																					style={{
																						height: '20px',
																					}}
																				>
																					<AtomSvg />
																				</div>

																				<div
																					className="icon-text"
																					style={{
																						color: 'var(--primary-font)',
																					}}
																				>
																					Deep Search
																				</div>
																			</div>
																		</div>
																	</div>
																</Tooltip>
															)}

															{/* {!isPublicChat && (
																// <SearchTypeTooltip
																// 	isOpen={
																// 		info?.searchTypeOpenForReason
																// 	}
																// 	searchType={chatInfo?.reason}
																// 	onSearchTypeChange={
																// 		handleSearchTypeChangeForReason
																// 	}
																// 	onOpenChange={(value) => {
																// 		setInfo((prev) => ({
																// 			...prev,
																// 			searchTypeOpenForReason:
																// 				value,
																// 		}));
																// 	}}
																// 	searchTypeOptions={
																// 		searchTypeOptionsForReason
																// 	}
																// >
																<Tooltip
																	title={
																		<div className="chatbox-icon-tooltip-container research-tooltip-container">
																			<AtomSvg />
																			<span>Research</span>
																			Unlock in-depth
																			reasoning on any subject
																		</div>
																	}
																	color="transparent"
																	arrow={false}
																	rootClassName="chatbox-tooltip"
																>
																	<div
																		className={`chat-box-icon-container ${
																			info?.chatBoxInfo
																				?.deepResearch
																				? 'active'
																				: ''
																		}`}
																		onClick={
																			handleDeepResearchClick
																		}
																	>
																		<div className="chat-icon">
																			<div className="text-wrapper deep-research-text-wrapper">
																				<AtomSvg />

																				<div className="icon-text">
																					Research
																				</div>
																			</div>
																		</div>
																	</div>
																</Tooltip>
																// </SearchTypeTooltip>
															)} */}

															{!isPublicChat && showBottomTools && (
																<Tooltip
																	title={
																		<div className="chatbox-icon-tooltip-container goals-tooltip-container">
																			<TrendUpSvg />
																			Goals
																		</div>
																	}
																	color="transparent"
																	arrow={false}
																	rootClassName="chatbox-tooltip"
																>
																	<div
																		className={`chat-box-icon-container ${
																			info?.chatBoxInfo?.goals
																				? 'active'
																				: ''
																		}`}
																		onClick={handleGoalsClick}
																	>
																		<div className="chat-icon">
																			<div className="text-wrapper goals-text-wrapper">
																				<div
																					className="trend-icon"
																					style={{
																						height: '20px',
																					}}
																				>
																					<TrendUpSvg
																						style={{
																							width: '20px',
																							height: '20px',
																						}}
																					/>
																				</div>

																				<div
																					className="icon-text"
																					style={{
																						color: 'var(--primary-font)',
																					}}
																				>
																					Goals
																				</div>
																			</div>
																		</div>
																	</div>
																</Tooltip>
															)}

															{isBuildEnbled &&
																!isPublicChat &&
																showBottomTools &&
																workspaceMode !== 'stable' && (
																	<Tooltip
																		title={
																			<div className="chatbox-icon-tooltip-container  build-icon-tooltip-container">
																				<SparkSvg />
																				Build
																			</div>
																		}
																		color="transparent"
																		arrow={false}
																		rootClassName="chatbox-tooltip"
																	>
																		<div
																			className={`chat-box-icon-container ${
																				info?.chatBoxInfo
																					?.build
																					? 'active'
																					: ''
																			}`}
																			onClick={
																				handleBuildClick
																			}
																		>
																			<div className="chat-icon">
																				<div className="text-wrapper  build-text-wrapper">
																					<div
																						className="build-icon"
																						style={{
																							height: '20px',
																						}}
																					>
																						<SparkSvg />
																					</div>
																					<div
																						className="icon-text"
																						style={{
																							color: 'var(	',
																						}}
																					>
																						Build
																					</div>
																					<BuildTooltip>
																						<div
																							className={`icon-arrow-wrapper ${
																								info
																									?.chatBoxInfo
																									?.build
																									? 'icon-arrow-wrapper-active'
																									: ''
																							}`}
																							onClick={(
																								e,
																							) =>
																								e?.stopPropagation()
																							}
																						>
																							<div className="icon-arrow">
																								<ArrowDownSvg fill="var(--primary-font)" />
																							</div>
																						</div>
																					</BuildTooltip>
																				</div>
																				{isTranscribing && (
																					<div className="transcription-indicator">
																						<canvas
																							ref={
																								canvasRef
																							}
																							className="audio-visualizer"
																							width="200"
																							height="50"
																						/>
																					</div>
																				)}
																			</div>
																		</div>
																	</Tooltip>
																)}
														</div>

														{/* <Tooltip title={'Add Filters'}>
														<div
															className="icon-container"
															onClick={handleShowFiltersClick}
															style={{
																opacity: `${
																	chatInfo?.deepResearch
																		? '0.5'
																		: '1'
																}`,
															}}
														>
															<div className="icon">
																<Filter />
															</div>
														</div>
													</Tooltip> */}

														{/* {!(
														chatInfo?.deepResearch ||
														chatInfo?.webSearch ||
														chatInfo?.workspaceSearch
													) && (
														<LLMTooltip
															selectedModel={
																chatInfo?.selectedLLMModel
															}
															handleOptionClick={
										 						handleLLMModelOptionClick
															}
															setIsLLMModelOpen={(value) => {
																if (
																	chatInfo?.deepResearch ||
																	chatInfo?.webSearch ||
																	chatInfo?.workspaceSearch ||
																	uploadedImagesRef?.current
																		?.length ||
																	recentFilesRef?.current?.length
																)
																	return;
																setInfo((prev) => ({
																	...prev,
																	isLLMModelOpen: value,
																}));
															}}
															isOpen={info?.isLLMModelOpen}
														>
															<Tooltip title="Select LLM Model">
																<div
																	className="chat-box-icon-container"
																	style={{
																		opacity: `${
																			chatInfo?.deepResearch ||
																			chatInfo?.webSearch ||
																			chatInfo?.workspaceSearch ||
																			uploadedImagesRef
																				?.current?.length ||
																			recentFilesRef?.current
																				?.length
																				? '0.5'
																				: '1'
																		}`,
																	}}
																>
																	<div className="icon">
																		<LLMSvg />
																	</div>
																</div>
															</Tooltip>
														</LLMTooltip>
													)} */}
													</div>

													<div className="right-container">
														{/* {chatInfo?.agentType !== 'knowledge_agent' &&
														!isPublicChat && (
															<div className="agent-container">
																<div
																	className={`agent ${
																		chatInfo?.agentType ===
																		'multi_agent'
																			? 'active'
																			: ''
																	}`}
																	onClick={() =>
																		handleAgentClick(
																			'multi_agent',
																		)
																	}
																>
																	Generalist
																</div>
																<div
																	className={`agent ${
																		chatInfo?.agentType ===
																		'search_agent'
																			? 'active'
																			: ''
																	}`}
																	onClick={() =>
																		handleAgentClick(
																			'search_agent',
																		)
																	}
																>
																	Thinker
																</div>
															</div>
														)} */}

														{/* {info?.chatQuery?.trim()?.length > 0 ||
														isPublicChat ? (
															<div
																className="click-btn"
																onClick={(e) => {
																	e.stopPropagation();
																	handleSendBtnClick(e);
																}}
																style={{
																	backgroundColor:
																		'var(--primary-button)',
																}}
															>
																<ArrowUp />
															</div>
														) : (
															<div
																className="click-btn "
																onClick={(e) => {
																	e.stopPropagation();
																	handleMicIconClick(e);
																}}
																style={{
																	backgroundColor:
																		'var(--primary-button)',
																}}
															>
																<AudioSvg />
															</div>
														)}  */}
														{/* Separate Speech-to-Text Button */}
														<div
															className={`click-btn speech-to-text-btn ${
																isTranscribing ? 'transcribing' : ''
															}`}
															onClick={(e) => {
																e.stopPropagation();
																handleMicIconClick(e);
															}}
															style={{
																backgroundColor: isTranscribing
																	? 'var(--error-color)'
																	: 'none',
																marginLeft: '8px',
															}}
															title={
																isTranscribing
																	? 'Stop Recording'
																	: 'Start Speech-to-Text'
															}
														>
															{isTranscribing ? (
																<StopIconSvg className='voice-icon' />
															) : (
																<SpeechMicSvg className='voice-icon' />
															)}
														</div>
														<div
															className={`click-btn voice-agent-btn ${
																info?.chatQuery?.trim()?.length > 0
																	? 'active'
																	: ''
															}`}
															onClick={(e) => {
																e.stopPropagation();
																if (
																	info?.chatQuery?.trim()
																		?.length > 0
																) {
																	handleSendBtnClick(e);
																} else {
																	handleVoiceAgentClick(e);
																}
															}}
															style={{
																backgroundColor:
																	'var(--primary-button)',
															}}
														>
															{info?.chatQuery?.trim()?.length > 0 ? (
																<ArrowUp className='voice-wave-icon' />
															) : (
																<VoiceAgentSvg className="voice-wave-icon" width={20} height={20} />
															)}
														</div>
													</div>
												</div>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
						{previewImage && (
							<Image
								wrapperStyle={{
									display: 'none',
								}}
								rootClassName="preview-image-container"
								preview={{
									visible: previewOpen,
									onVisibleChange: (visible) => setPreviewOpen(visible),
									afterOpenChange: (visible) => !visible && setPreviewImage(''),
								}}
								src={previewImage}
							/>
						)}
					</div>
				</div>
				{/* )} */}
			</div>
			<div className="chatbarContainer" style={{ width: '100%' }}>
				{showScrollButton && (
					<div className="scroll-btn-wrapper">
						<button className="scroll-button" onClick={handleScrollButtonClick}>
							<ArrowUpRightSvg className="arrow-up" />
						</button>
					</div>
				)}

				{/* {showBrowserButton && ( */}
				<div
					className="browser-button-container"
					onClick={(e) => {
						e.stopPropagation();
						handleBrowserButtonClick?.(e);
					}}
					style={{
						display: showBrowserButton ? 'flex' : 'none',
					}}
				>
					{browserImage ? (
						<div className="browser-image-wrapper">
							<div className="browser-text">Browser</div>
							<img src={browserImage} className="browser-image" alt="browser" />
						</div>
					) : (
						<div className="browser-button">Browser</div>
					)}
					<div className="expand-browser-button">
						<ArrowsOut />
					</div>
				</div>
				{/* )} */}
				{uploadedImagesRef?.current?.length > 0 ? (
					<div className="imagePreviewBar">
						{uploadedImagesRef?.current?.map((ele, index) => (
							<div className="previewOfUploadedImage" key={index}>
								<img
									src={ele?.preview}
									alt="uploaded"
									width={'100%'}
									height={'100%'}
									style={{
										objectFit: 'cover',
										borderRadius: '12px',
									}}
									onClick={() => handlePreview(ele)}
								/>

								{ele?.loading ? (
									<div className="spinContainerLoaderForPreview">
										<Spin />
									</div>
								) : (
									<span
										className="removeImageIcon"
										onClick={() => handleRemoveImage(ele)}
									>
										<Close
											style={{
												width: '10px',
												height: '10px',
											}}
										/>
									</span>
								)}
							</div>
						))}
					</div>
				) : (
					''
				)}
				{recentFilesRef?.current?.length > 0 && (
					<div className="recent-files-container">
						{recentFilesRef?.current?.map((file, index) => (
							<div className="recent-file" key={index}>
								<div className="file-type-icon">
									{fileTypeIcons?.[file?.sourceType]}
								</div>
								<div className="recent-file-name">
									<div className="file-title">
										{file?.originalFileName || file?.title || ''}
									</div>

									{file?.loading && <Spin />}
								</div>
								<div
									className="close-icon-container"
									onClick={() => handleRemoveFileFromRecentFileClick(file)}
								>
									<CloseSvg />
								</div>
							</div>
						))}
					</div>
				)}
				{showUpgradeSubscriptionBtn && totalCreditsUsed >= totalCreditsLimit && (
					<div className="credits-upgrade-container">
						<div className="left-container">
							<div className="title-container">
								<img src={CreditCoinImage} className="coin-icon" alt="coin" />

								<div className="title-text-container">
									You don't have enough credits to continue.
								</div>
							</div>
							<div className="description-container">
								Please consider purchasing additional credits to unlock more
								features and enhance your experience. If you need assistance, feel
								free to reach out to our support team!
							</div>
						</div>
						<div className="right-container">
							<div className="upgrade-button" onClick={handleUpgradeClick}>
								Upgrade
							</div>
						</div>
					</div>
				)}

				{chatReplyData && (
					<div className="chat-reply-data">
						<div className="reply-icon"></div>
						<div className="reply-text">{`"${chatReplyData}"`}</div>
						<div className="reply-close-icon" onClick={handleReplyCloseClick}>
							<CloseSvg width={16} height={16} />
						</div>
					</div>
				)}
			</div>
			<AddOnCards
				isOpen={info?.openUpgradeModal}
				closeModal={handleCloseUpgrageModal}
				subscriptionState="addOnPlans"
			/>
		</div>
	);
};

export default memo(ChatBox);
