import { memo, useContext, useEffect, useRef } from 'react';
import styles from '../../../assets/scss/notes/transcriptionSidebar.module.scss';
import { ReactComponent as TimerIcon } from '../../../assets/svg/notes/timerIcon.svg';
import Context from '../../../context/context';
import moment from 'moment';

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

const TranscriptionSidebar = () => {
	const {
		notes: { transcriptionList },
	} = useContext(Context);
	const listContainerRef = useRef(null);

	useEffect(() => {
		if (!listContainerRef?.current) return;
		listContainerRef.current.scrollTo({
			top: listContainerRef.current.scrollHeight,
			behavior: 'smooth',
		});
	}, [transcriptionList?.length]);
	return (
		<div className={styles.transcriptionSidebar}>
			{/* <div className={styles.transcriptionHeaderContainer}>
				<div className={styles.transcriptionHeaderRight}>
					<Dropdown
						menu={{ items: Options }}
						classNames={{ root: styles.transcriptionHeaderRightDropdownOverlay }}
						trigger={['click']}
						placement="bottom"
					>
						<div className={styles.transcriptionHeaderRightDropdown}>
							View Only <DownOutlined />
						</div>
					</Dropdown>
				</div>
			</div> */}
			<div className={styles.transcriptionListContainer} ref={listContainerRef}>
				{transcriptionList?.map((item, index) => (
					<div key={index} className={styles.transcriptionItem}>
						<div
							style={{ backgroundColor: getSpeakerColor(item.speakerName) }}
							className={styles.transcriptionItemSpeaker}
						>
							{item.speakerName
								.split(' ')
								.map((n) => n[0])
								.join('')}
						</div>
						<div className={styles.transcriptionItemContent}>
							<div className={styles.transcriptionItemSpeakerDetails}>
								<div className={styles.transcriptionItemSpeakerName}>
									{item.speakerName}
								</div>
								<div className={styles.transcriptionItemDot}></div>
								<div className={styles.transcriptionItemTimestamp}>
									<TimerIcon />
									{item?.time}
								</div>
							</div>
							<div className={styles.transcriptionItemTranscript}>
								{item.transcript}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default memo(TranscriptionSidebar);
