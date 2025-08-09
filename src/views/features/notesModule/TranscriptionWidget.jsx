import { memo, useEffect, useRef, useState } from 'react';
import s from '../../../assets/scss/notes/transcriptionWidget.module.scss';
import { ReactComponent as ExpandIcon } from '../../../assets/svg/docs/expand.svg';
import { ReactComponent as TimerIcon } from '../../../assets/svg/notes/timerIcon.svg';
import { ReactComponent as GoogleMeetIcon } from '../../../assets/svg/notes/googleMeet.svg';
import { ReactComponent as ZoomIcon } from '../meetBot/zoom.svg';
import { ReactComponent as TeamsIcon } from '../meetBot/micromeet.svg';
import { ReactComponent as SlackIcon } from '../meetBot/slack.svg';
import Waveform from '../../../assets/svg/note-transcription.gif';
import moment from 'moment';
import { useSearchParams } from 'react-router-dom';

const logoMapper = {
	google_meet: <GoogleMeetIcon />,
	zoom: <ZoomIcon style={{ width: '20px', height: '20px' }} />,
	microsoft_teams: <TeamsIcon style={{ width: '20px', height: '20px' }} />,
	slack: <SlackIcon style={{ width: '20px', height: '20px' }} />,
};

const nameMapper = {
	google_meet: 'Google Meet',
	zoom: 'Zoom',
	microsoft_teams: 'Teams',
	slack: 'Slack',
};

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

const formatElapsedTime = (elapsedSeconds) => {
	const hours = Math.floor(elapsedSeconds / 3600);
	const minutes = Math.floor((elapsedSeconds % 3600) / 60);
	const seconds = elapsedSeconds % 60;

	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`;
	} else {
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	}
};

const TranscriptionWidget = ({ transcriptList = [], botJoinedTime, meetingPlatform }) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const listContainerRef = useRef(null);
	const [info, setInfo] = useState({ expand: false });
	const [elapsedTime, setElapsedTime] = useState(0);

	// Timer effect to calculate elapsed time from botJoinedTime
	useEffect(() => {
		if (!botJoinedTime) return;

		const updateTimer = () => {
			const now = Math.floor(Date.now() / 1000); // Current time in seconds
			const elapsed = now - botJoinedTime;
			setElapsedTime(Math.max(0, elapsed));
		};

		// Update immediately
		updateTimer();

		// Update every second
		const interval = setInterval(updateTimer, 1000);

		return () => clearInterval(interval);
	}, [botJoinedTime]);

	useEffect(() => {
		if (!listContainerRef?.current) return;

		listContainerRef.current.scrollTo({
			top: listContainerRef.current.scrollHeight,
			behavior: 'smooth',
		});
	}, [transcriptList?.length]);

	const handleExpand = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set('transcription', 'true');
		newParams.delete('chat');
		setSearchParams(newParams, { replace: true });
	};
	const handleMouseEnter = () => {
		if (transcriptList?.length > 0) {
			setInfo((prev) => ({ ...prev, expand: true }));
		}
	};
	const handleMouseLeave = () => {
		setInfo((prev) => ({ ...prev, expand: false }));
	};

	return (
		<div
			className={s.transcriptionWidget}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			style={{
				width: info.expand ? '500px' : '365px',
				height: info.expand ? '500px' : '52px',
			}}
		>
			{transcriptList?.length > 0 ? (
				<div className={s.transcriptionContainer}>
					<div className={s.transcriptionHeader}>
						<div className={s.transcriptionHeaderText}>Transcription</div>
						<div className={s.expandIcon} onClick={handleExpand}>
							<ExpandIcon />
						</div>
					</div>
					<div className={s.transcriptionListContainer} ref={listContainerRef}>
						{transcriptList?.map((item, index) => (
							<div key={index} className={s.transcriptionItem}>
								<div
									style={{ backgroundColor: getSpeakerColor(item.speakerName) }}
									className={s.transcriptionItemSpeaker}
								>
									{item.speakerName
										.split(' ')
										.map((n) => n[0])
										.join('')}
								</div>
								<div className={s.transcriptionItemContent}>
									<div className={s.transcriptionItemSpeakerDetails}>
										<div className={s.transcriptionItemSpeakerName}>
											{item.speakerName}
										</div>
										<div className={s.transcriptionItemDot}></div>
										<div className={s.transcriptionItemTimestamp}>
											<TimerIcon />
											{item?.timestamp
												? moment?.unix(item?.timestamp).format('HH:mm:ss')
												: item?.time}
										</div>
									</div>
									<div className={s.transcriptionItemTranscript}>
										{item.transcript}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			) : // <div className={s.noTranscription}>No transcription yet.</div>
			null}
			<div
				className={s.transcriptionContent}
				style={{
					width: info.expand ? '0px' : '100%',
					height: info.expand ? '0px' : '32px',
				}}
			>
				{!info?.expand && (
					<div className={s.transcriptionContentWrapper}>
						<div className={s.timerDiv}>{formatElapsedTime(elapsedTime)}</div>
						<div className={s.waveDiv}>
							<img src={Waveform} alt="wave" />
						</div>
						<div className={s.statusDiv}>
							{logoMapper[meetingPlatform]}
							Connected to {nameMapper[meetingPlatform]}
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(TranscriptionWidget);
