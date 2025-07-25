import { memo } from 'react';
import s from '../../../assets/scss/notes/transcriptionWidget.module.scss';
import { ReactComponent as ExpandIcon } from '../../../assets/svg/docs/expand.svg';
import { ReactComponent as TimerIcon } from '../../../assets/svg/notes/timerIcon.svg';
import moment from 'moment';
import { useSearchParams } from 'react-router-dom';

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
const TranscriptionWidget = ({
	transcriptList = [
		{
			speakerName: 'John',
			transcript: 'Hello lorem ipsum dolor sit amet',
			timestamp: 1234567890,
		},
		{
			speakerName: 'John',
			transcript: 'Hello lorem ipsum dolor sit amet',
			timestamp: 1234567890,
		},
	],
}) => {
	const [searchParams, setSearchParams] = useSearchParams();
	const handleExpand = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set('transcription', 'true');
		newParams.delete('chat');
		setSearchParams(newParams, { replace: true });
	};

	return (
		<div className={s.transcriptionWidget}>
			{transcriptList?.length > 0 ? (
				<div className={s.transcriptionContainer}>
					<div className={s.transcriptionHeader}>
						<div className={s.transcriptionHeaderText}></div>
						<div className={s.expandIcon} onClick={handleExpand}>
							<ExpandIcon />
						</div>
					</div>
					<div className={s.transcriptionListContainer}>
						{transcriptList.map((item, index) => (
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
											{moment(item?.timestamp)?.format('HH:mm:ss')}
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
			) : (
				<div className={s.noTranscription}>No transcription yet.</div>
			)}
			<div className={s.transcriptionContent}>
				<div className={s.text}>Transcription</div>
			</div>
		</div>
	);
};

export default memo(TranscriptionWidget);
