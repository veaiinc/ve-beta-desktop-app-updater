import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../../store/store';
import s from './ongoingMeeting.module.scss';
import { ArrowLeftRight, CircleX, Maximize2, Plus, X } from 'lucide-react';
import moment from 'moment';
const OngoingMeeting = () => {
	const navigate = useNavigate();

	const [info, setInfo] = useState({
		showingTranscripts: false,
	});

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
	}, []);

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

	return (
		<div className={s.ongoingMeetingContainer}>
			<div className={s.ongoingMeetingHeader}>
				<button className={s.ongoingMeetingHeaderButton}>
					<Maximize2 size={16} />
				</button>
				<button className={s.ongoingMeetingHeaderButtonClose}>
					<X size={16} />
				</button>
			</div>
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
					{info.showingTranscripts ? 'Show Live Intelligence' : 'View Transcriptions'}
				</button>
			</div>
			<div className={s.ongoingMeetingContent}>
				{info.showingTranscripts ? <TranscriptPanel /> : <LiveIntelligencePanel />}
			</div>
			<div className={s.ongoingMeetingFooter}>
				<button className={s.newChatButton}>
					<Plus size={16} /> New Chat
				</button>
			</div>
		</div>
	);
};

export default OngoingMeeting;

const TranscriptPanel = () => {
	const [transcripts, setTranscripts] = useState([
		{
			text: 'Hello, how are you?',
			source: 'mic',
			timestamp: new Date().toISOString(),
		},
		{
			text: 'I am fine, thank you',
			source: 'screen',
			timestamp: new Date().toISOString(),
		},
	]);

	return (
		<>
			{transcripts.map((transcript) => (
				<div key={transcript.timestamp} className={s.transcriptItem}>
					<div className="">
						<div className="">{transcript.source}</div>
						<span className="">
							<div className="">{moment(transcript.timestamp).format('HH:mm')}</div>
						</span>
					</div>
					<div className="">{transcript.text}</div>
				</div>
			))}
		</>
	);
};

const LiveIntelligencePanel = () => {
	return <div>LiveIntelligencePanel</div>;
};
