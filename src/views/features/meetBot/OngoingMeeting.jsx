import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/store';
import s from './ongoingMeeting.module.scss';
import { ArrowLeftRight, CircleX, Clock, Maximize2, Plus, X } from 'lucide-react';
import moment from 'moment';
import Context from '../../../context/context';
import RecentChat from '../chat/RecentChat';
import ObjectID from 'bson-objectid';

const CHAT_WIDTH = 373;
const SIDEBAR_WIDTH = 256;

const OngoingMeeting = memo(() => {
	const navigate = useNavigate();

	const {
		notes: { activeMeetingDetails },
		templates: { updateStateValues, sidebarState },
	} = useContext(Context);

	const [info, setInfo] = useState({
		showingTranscripts: false,
		chatOpen: false,
		dimentions: {
			width: 522,
			height: 436,
		},
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
			});
		}
		return () => {
			if (window?.electronApi?.resizeMainWindow) {
				window?.electronApi?.resizeMainWindow({
					dimensions: {
						width: 1366,
						height: 768,
					},
				});
				setInfo((prev) => ({
					...prev,
					chatOpen: false,
				}));
			}
		};
	}, []);

	useEffect(() => {
		if (sidebarState?.open === true) {
			toggleSidebar(true);
		}
		if (sidebarState?.open === false) {
			toggleSidebar(false);
		}
	}, [sidebarState?.open]);

	useEffect(() => {
		console.log('activeMeetingDetails', activeMeetingDetails);
	}, [activeMeetingDetails]);

	const handleStateChange = (data) => {
		setInfo((prev) => ({
			...prev,
			...data,
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
		});

		handleStateChange({
			chatOpen: open,
			dimentions: {
				width: newWidth,
				height: info?.dimentions?.height,
			},
		});
	};

	const toggleSidebar = (open) => {
		if (open === info.sidebarOpen) {
			return;
		}
		let newWidth;
		if (open) {
			newWidth = info?.dimentions?.width + SIDEBAR_WIDTH;
		} else {
			newWidth = info?.dimentions?.width - SIDEBAR_WIDTH;
			newWidth = newWidth < 522 ? 522 : newWidth;
		}
		window?.electronApi?.resizeMainWindow({
			dimensions: {
				width: newWidth,
				height: info?.dimentions?.height,
			},
			exitFullScreen: true,
		});
		handleStateChange({
			sidebarOpen: open,
			dimentions: {
				width: newWidth,
				height: info?.dimentions?.height,
			},
		});
	};

	const handleActionClick = (prompt, isAskAi = false) => {
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

	return (
		<div className={s.ongoingMeetingWrapper}>
			<div className={s.ongoingMeetingHeader}>
				<button className={s.ongoingMeetingHeaderButton}>
					<Maximize2 size={16} />
				</button>
				<button
					onClick={() => navigate('/home')}
					className={s.ongoingMeetingHeaderButtonClose}
				>
					<X size={16} />
				</button>
			</div>
			<div className={s.ongoingMeetingContentWrapper}>
				<div className={s.ongoingMeetingContainer}>
					<div className={s.ongoingMeetingNav}>
						<div className={s.ongoingMeetingNavTitle}>
							{info.showingTranscripts ? 'LIVE TRANSCRIPT' : 'LIVE INTELLIGENCE'}
						</div>
						<button
							className={s.ongoingMeetingNavButton}
							onClick={() =>
								handleStateChange({ showingTranscripts: !info.showingTranscripts })
							}
						>
							<ArrowLeftRight size={16} />{' '}
							{info.showingTranscripts
								? 'Show Live Intelligence'
								: 'View Transcriptions'}
						</button>
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
				liveIntelligence.map((item) => (
					<div
						className={s.liveIntelligenceItem}
						onClick={() =>
							handleActionClick(
								item.prompt,
								getLiveIntelligenceType(item) === 'needHelp',
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
		</div>
	);
};
