import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/store';
import s from './ongoingMeeting.module.scss';
import {
	ArrowLeftRight,
	ChevronDown,
	ChevronUp,
	CircleX,
	Clock,
	Maximize2,
	Plus,
	X,
	ChevronRight,
} from 'lucide-react';
import moment from 'moment';
import Context from '../../../context/context';
import RecentChat from '../chat/RecentChat';
import ObjectID from 'bson-objectid';
import { useNotchDropSync } from '../../../hooks/useNotchDropSync';

const CHAT_WIDTH = 373;
const SIDEBAR_WIDTH = 256;

const dropdownOptions = [
	{
		label: 'Meeting Mode',
		value: 'meeting',
	},
	{
		label: 'Sales Mode',
		value: 'sales',
	},
	{
		label: 'Support',
		value: 'support',
	},
	{
		label: 'Interview',
		value: 'interview',
	},
	{
		label: 'Ideas',
		value: 'ideas',
	},
];

const OngoingMeeting = memo(() => {
	const navigate = useNavigate();

	const {
		notes: { activeMeetingDetails },
		templates: { updateStateValues },
	} = useContext(Context);

	// Use global NotchDrop sync hook
	const { hasActiveMeeting } = useNotchDropSync();

	const [info, setInfo] = useState({
		showingTranscripts: false,
		chatOpen: false,
		dropdownOpen: false,
		selectedDropdownOption: {
			label: 'Meeting Mode',
			value: 'meeting',
		},
		dimentions: {
			width: 522,
			height: 436,
		},
		isSelectedResponseId: null,
		isResponseSelected: false,
	});

	const { liveIntelligenceData = {}, transcriptions = [], meetingId } = activeMeetingDetails;
	const sessionId = meetingId;
	useEffect(() => {
		if (window?.electronApi?.resizeMainWindow) {
			window?.electronApi?.resizeMainWindow({
				dimensions: {
					width: 522,
					height: 436,
				},
				exitFullScreen: true,
				animate: true,
				duration: 300,
				easing: 'easeInOutCubic',
			});
		}

		// Initialize NotchDrop panel mode - show transcription initially (main app shows live intelligence)
		if (window?.electronApi?.overlay?.setPanelMode) {
			window.electronApi.overlay.setPanelMode('live-intel');
			console.log(
				'🧭 OngoingMeeting: Initialized NotchDrop to show transcription (main shows live-intel)',
			);
		}

		// Send initial transcription data to NotchDrop if available
		if (transcriptions?.length > 0 && window?.electronApi?.notchdrop?.replaceTranscriptions) {
			console.log(
				'📝 OngoingMeeting: Sending initial transcription data to NotchDrop:',
				transcriptions.length,
				'transcriptions',
			);
			const messages = transcriptions.map((t) => ({
				sender: t.source || 'overlay',
				content: t.text || '',
				isFromAgent: false,
				timestamp: t.timestamp || new Date().toISOString(),
				confidence: t.confidence,
				words: t.words,
				type: 'transcription',
			}));
			window.electronApi.notchdrop.replaceTranscriptions(messages);
			console.log('✅ OngoingMeeting: Initial transcription data sent to NotchDrop');
		}

		const newState = { overlay: false, open: false };
		updateStateValues({ sidebarState: newState });

		return () => {
			if (window?.electronApi?.resizeMainWindow) {
				window?.electronApi?.resizeMainWindow({
					dimensions: {
						width: 1366,
						height: 768,
					},
					animate: true,
					duration: 300,
					easing: 'easeOutCubic',
				});
				setInfo((prev) => ({
					...prev,
					chatOpen: false,
					isResponseSelected: false,
					isSelectedResponseId: null,
				}));
			}

			// Only clear NotchDrop data if there's no active meeting
			// This prevents clearing data when just navigating away from OngoingMeeting
			if (!hasActiveMeeting) {
				try {
					console.log(
						'🧹 OngoingMeeting: No active meeting - clearing data in NotchDrop on component unmount',
					);

					// Clear transcriptions in notch
					if (window.electronApi?.notchdrop?.replaceTranscriptions) {
						window.electronApi.notchdrop.replaceTranscriptions([]);
						console.log(
							'✅ OngoingMeeting: Sent empty transcription array to NotchDrop for cleanup',
						);
					} else {
						console.warn(
							'⚠️ OngoingMeeting: replaceTranscriptions method not available for cleanup',
						);
					}

					// Clear live intelligence data in notch
					if (window.electronApi?.notchdrop?.clearLiveIntelligenceData) {
						window.electronApi.notchdrop.clearLiveIntelligenceData();
						console.log(
							'✅ OngoingMeeting: Cleared live intelligence data in NotchDrop for cleanup',
						);
					} else {
						console.warn(
							'⚠️ OngoingMeeting: clearLiveIntelligenceData method not available for cleanup',
						);
					}
				} catch (e) {
					console.error(
						'❌ OngoingMeeting: Failed to clear data in NotchDrop during component cleanup:',
						e,
					);
				}
			} else {
				console.log(
					'🔄 OngoingMeeting: Active meeting detected - preserving NotchDrop data during navigation',
				);
			}
		};
	}, []);

	useEffect(() => {
		if (!activeMeetingDetails?.meetingId) {
			navigate('/home');
		}

		if (activeMeetingDetails?.meetingId) {
			updateStateValues({ sidebarState: { open: false, overlay: false } });
		}
	}, []);

	// useEffect(() => {
	// 	if (sidebarState?.open === true) {
	// 		toggleSidebar(true);
	// 	}
	// 	if (sidebarState?.open === false) {
	// 		toggleSidebar(false);
	// 	}
	// }, [sidebarState?.open]);

	// Data sending is now handled by the global useNotchDropSync hook
	// This ensures data flows to NotchDrop regardless of which component is active

	const handleStateChange = (data) => {
		setInfo((prev) => ({
			...prev,
			...data,
		}));
	};

	const toggleTranscripts = (open) => {
		console.log('🔄 OngoingMeeting: Toggling transcripts:', open);

		try {
			if (open === true) {
				// Showing transcripts in main app → Notch should show live intelligence
				if (window?.electronApi?.overlay?.setPanelMode) {
					window.electronApi.overlay.setPanelMode('transcription');
					console.log(
						'🧭 OngoingMeeting: Set panel mode to transcription (Notch will show live intelligence)',
					);

					// Ensure live intelligence data is sent to NotchDrop when switching to transcript view
					const allThreads = liveIntelligenceData?.allThreads || [];
					if (
						allThreads.length > 0 &&
						window?.electronApi?.overlay?.sendLiveIntelligenceData
					) {
						console.log(
							'🧠 OngoingMeeting: Sending live intelligence data to NotchDrop on toggle:',
							allThreads.length,
							'threads',
						);
						allThreads.forEach((thread) => {
							const message = {
								source: 'ai-agent',
								text: thread.prompt || thread.name || thread.description || '',
								timestamp:
									thread.timestamp ||
									thread.created_at ||
									new Date().toISOString(),
								confidence: thread.confidence,
								metadata: thread,
							};
							window.electronApi.overlay.sendLiveIntelligenceData(message);
						});
						console.log(
							'✅ OngoingMeeting: Live intelligence data sent to NotchDrop on toggle',
						);
					}
				} else {
					console.warn('⚠️ OngoingMeeting: setPanelMode method not available');
				}
			} else {
				// Showing live intelligence in main app → Notch should show transcription
				if (window?.electronApi?.overlay?.setPanelMode) {
					window.electronApi.overlay.setPanelMode('live-intel');
					console.log(
						'🧭 OngoingMeeting: Set panel mode to live-intel (Notch will show transcription)',
					);

					// Ensure transcription data is sent to NotchDrop when switching to live intelligence view
					if (
						transcriptions?.length > 0 &&
						window?.electronApi?.notchdrop?.replaceTranscriptions
					) {
						console.log(
							'📝 OngoingMeeting: Sending transcription data to NotchDrop on toggle:',
							transcriptions.length,
							'transcriptions',
						);
						const messages = transcriptions.map((t) => ({
							sender: t.source || 'overlay',
							content: t.text || '',
							isFromAgent: false,
							timestamp: t.timestamp || new Date().toISOString(),
							confidence: t.confidence,
							words: t.words,
							type: 'transcription',
						}));
						window.electronApi.notchdrop.replaceTranscriptions(messages);
						console.log(
							'✅ OngoingMeeting: Transcription data sent to NotchDrop on toggle',
						);
					}
				} else {
					console.warn('⚠️ OngoingMeeting: setPanelMode method not available');
				}
			}
		} catch (e) {
			console.error('❌ OngoingMeeting: Failed to send panel mode to Notch:', e);
		}

		setInfo((prev) => ({
			...prev,
			showingTranscripts: open,
		}));
	};

	// const { activeMeetingId } = useStore((state) => state.meeting) || {};

	// useEffect(() => {
	// 	if (activeMeetingId) {
	// 		navigate(`/meet/${activeMeetingId}`, { replace: true });
	// 	} else {
	// 		navigate('/home', { replace: true });
	// 	}
	// }, [activeMeetingId]);

	const toggleChat = (open) => {
		console.log('toggleChat', open, info.chatOpen);
		if (open === info.chatOpen) {
			return;
		}
		let newWidth;
		if (open) {
			newWidth = info?.dimentions?.width + CHAT_WIDTH;
		} else {
			newWidth = info?.dimentions?.width - CHAT_WIDTH;
			newWidth = newWidth < 522 ? 522 : newWidth;
		}
		window?.electronApi?.resizeMainWindow({
			dimensions: {
				width: newWidth,
			},
			exitFullScreen: true,
			animate: true,
			duration: 250,
			easing: 'easeInOutCubic',
		});

		handleStateChange({
			chatOpen: open,
			dimentions: {
				width: newWidth,
				height: info?.dimentions?.height,
			},
		});
	};

	// const toggleSidebar = (open) => {
	// 	if (open === info.sidebarOpen) {
	// 		return;
	// 	}
	// 	let newWidth;
	// 	if (open) {
	// 		newWidth = info?.dimentions?.width + SIDEBAR_WIDTH;
	// 	} else {
	// 		newWidth = info?.dimentions?.width - SIDEBAR_WIDTH;
	// 		newWidth = newWidth < 522 ? 522 : newWidth;
	// 	}
	// 	window?.electronApi?.resizeMainWindow({
	// 		dimensions: {
	// 			width: newWidth,
	// 			height: info?.dimentions?.height,
	// 		},
	// 		exitFullScreen: true,
	// 	});
	// 	handleStateChange({
	// 		sidebarOpen: open,
	// 		dimentions: {
	// 			width: newWidth,
	// 			height: info?.dimentions?.height,
	// 		},
	// 	});
	// };

	const handleActionClick = (prompt, isAskAi = false, id = null) => {

		setInfo((prev) => ({
			...prev,
			isSelectedResponseId: id,
			isResponseSelected: true,
		}));

		if (prompt && sessionId) {
			console.log('prompt', prompt);
			toggleChat(true);
			updateStateValues({
				activePromptForChat: {
					prompt,
					sessionId,
				},
				...(isAskAi && {
					isDirectSearchAgent: true,
				}),
			});
		}
	};


	const handleOpenChatResponse = (open) => {
		if (open === info.chatOpen) {
			return;
		}
		toggleChat(open);
	}




	return (
		<div className={s.ongoingMeetingWrapper}>
			<div className={s.ongoingMeetingHeader}>
				{!info?.sidebarOpen && <div className={s.sidebarButton} />}
				<div className={s.dragArea}></div>
				{/* <button className={s.ongoingMeetingHeaderButton}>
					<Maximize2 size={16} />
				</button> */}
				{/* <button
					onClick={() => navigate('/home')}
					className={s.ongoingMeetingHeaderButtonClose}
				>
					<X size={16} />
				</button> */}
				{info.isResponseSelected && (
					<button className={s.ongoingMeetingHeaderButton} onClick={() =>
						handleOpenChatResponse(true)
					}>
						<ChevronRight size={16} />
					</button>
				)}
			</div>
			<div className={s.ongoingMeetingContentWrapper}>
				<div className={s.ongoingMeetingContainer}>
					<div className={s.ongoingMeetingNav}>
						<div className={s.ongoingMeetingNavTitle}>
							{info.showingTranscripts ? 'LIVE TRANSCRIPT' : 'LIVE INTELLIGENCE'}
						</div>
						<button
							className={s.ongoingMeetingNavButton}
							onClick={() => toggleTranscripts(!info.showingTranscripts)}
						>
							<ArrowLeftRight size={16} />{' '}
							{info.showingTranscripts
								? 'Show Live Intelligence'
								: 'View Transcriptions'}
						</button>

						{/* <div className={s.dropDownContainer}>
							<div className={s.dropDownBody}>
								<div
									className={s.dropDownSelectedItem}
									onClick={() =>
										setInfo((prev) => ({
											...prev,
											dropdownOpen: !prev.dropdownOpen,
										}))
									}
								>
									{info?.selectedDropdownOption?.label}
									<button>
										{info?.dropdownOpen ? (
											<ChevronUp size={16} />
										) : (
											<ChevronDown size={16} />
										)}
									</button>
								</div>
								{info?.dropdownOpen && (
									<>
										<div className={s.dropDownDivider} />
										<div className={s.dropDownOptions}>
											{dropdownOptions
												.filter(
													(option) =>
														option.value !==
														info?.selectedDropdownOption?.value,
												)
												.map((option) => (
													<div
														className={s.dropDownOption}
														onClick={() =>
															handleStateChange({
																selectedDropdownOption: option,
																dropdownOpen: false,
															})
														}
													>
														{option.label}
													</div>
												))}
										</div>
									</>
								)}
							</div>
						</div> */}
					</div>
					<div className={s.ongoingMeetingContent}>
						{info.showingTranscripts ? (
							<TranscriptPanel transcripts={transcriptions} />
						) : (
							<LiveIntelligencePanel
								liveIntelligence={liveIntelligenceData?.allThreads}
								handleActionClick={handleActionClick}
							/>
						)}
					</div>
					<div className={s.ongoingMeetingFooter}>
						<button className={s.newChatButton} onClick={() => navigate(`/new-chat`)}>
							<Plus size={16} /> New Chat
						</button>
					</div>
				</div>
				{info.chatOpen && sessionId && (
					<div className={s.recentChatWrapper}>
						<div className={s.recentChatHeader}>
							<div className={s.recentChatHeaderTitle}>AI Response</div>
							<button
								className={s.recentChatHeaderButton}
								onClick={() => toggleChat(false)}
							>
								<X size={16} />
							</button>
						</div>
						<div className={s.recentChatContent}>
							<RecentChat
								isPreview={true}
								sId={sessionId}
								showResponseEditBtn={false}
								showHeader={false}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
});
OngoingMeeting.displayName = 'OngoingMeeting';
export default OngoingMeeting;

const TranscriptPanel = ({ transcripts = [] }) => {
	const bottomRef = useRef(null);

	// Auto-scroll to bottom when new transcripts arrive
	useEffect(() => {
		if (bottomRef.current && transcripts.length > 0) {
			bottomRef.current.scrollIntoView({ behavior: 'smooth' });
			console.log('📜 TranscriptPanel: Auto-scrolled to bottom for new transcript');
		}
	}, [transcripts.length]);

	console.log(transcripts);

	return (
		<div className={s.transcriptList}>
			{transcripts?.length > 0 ? (
				transcripts?.map((transcript) => (
					<div
						key={transcript.id}
						className={`
						${s.transcriptItem}
						${transcript.source === 'mic' ? s.transcriptItemMic : s.transcriptItemScreen}
				`}
					>
						<div className={s.transcriptItemHeader}>
							<span className={s.transcriptItemSpeaker}>
								{transcript.source === 'mic' ? 'YOU' : 'SPEAKER'}
							</span>
							<span className={s.transcriptItemSeparator} />
							<span className={s.transcriptItemTimestamp}>
								<Clock size={12} className={s.transcriptItemTimestampIcon} />
								<div className={s.transcriptItemTimestampText}>
									{moment(transcript.timestamp).format('HH:mm')}
								</div>
							</span>
						</div>
						<div className={s.transcriptItemText}>{transcript.text}</div>
					</div>
				))
			) : (
				<div className={s.noTranscripts}>
					<div className={s.noTranscriptsText}>No transcripts yet</div>
				</div>
			)}
			<div ref={bottomRef} />
		</div>
	);
};

const typeMap = {
	askUser: 'Ask Speaker',
	needHelp: 'Need Help?',
	actions: 'Actions',
	files: 'Files',
};

const LiveIntelligencePanel = ({ liveIntelligence = [], handleActionClick }) => {
	const bottomRef = useRef(null);

	// Auto-scroll to bottom when new live intelligence arrives
	useEffect(() => {
		if (bottomRef.current && liveIntelligence.length > 0) {
			bottomRef.current.scrollIntoView({ behavior: 'smooth' });
			console.log(
				'🧠 LiveIntelligencePanel: Auto-scrolled to bottom for new live intelligence',
			);
		}
	}, [liveIntelligence.length]);

	const getLiveIntelligenceType = (data) => {
		if (data.entity === 'user') {
			return 'askUser';
		}
		if (data.entity === 'agent' && data.type === 'search') {
			return 'needHelp';
		}
		if (data.entity === 'agent' && data.type === 'action') {
			return 'actions';
		}
		if (data.entity === 'file') {
			return 'files';
		}
	};
	return (
		<div className={s.liveIntelligenceList}>
			{liveIntelligence.length > 0 ? (
				liveIntelligence.map((item, index) => (
					<div
						key={item.id || index}
						className={s.liveIntelligenceItem}
						onClick={() =>
							handleActionClick(
								item.prompt,
								getLiveIntelligenceType(item) === 'needHelp',
								item.id,
							)
						}
					>
						<div className={s.promptText}>{item.prompt}</div>
						<div className={s.liveIntelligenceSeperator}></div>
						<div className={s.liveIntelligenceType}>
							{typeMap[getLiveIntelligenceType(item)]}
						</div>
					</div>
				))
			) : (
				<div className={s.noLiveIntelligence}>
					<div className={s.noLiveIntelligenceText}>No live intelligence yet</div>
				</div>
			)}
			<div ref={bottomRef} />
		</div>
	);
};
