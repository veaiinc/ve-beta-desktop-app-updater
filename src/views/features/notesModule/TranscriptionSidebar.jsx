import { memo, useContext } from 'react';
import styles from '../../../assets/scss/notes/transcriptionSidebar.module.scss';
import { ReactComponent as SidebarClosingSvg } from '../../../assets/svg/sidebar/SidebarClosingPrimary.svg';
import { ReactComponent as TimerIcon } from '../../../assets/svg/notes/timerIcon.svg';
import { Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Context from '../../../context/context';
import moment from 'moment';

const Options = [
	{
		id: 1,
		label: 'Testing1',
		value: 'testing1',
	},
	{ id: 2, label: 'Testing2', value: 'testing2' },
	{ id: 3, label: 'Testing3', value: 'testing3' },
];

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
const transcriptionList = [
	{
		speakerName: 'Speaker 1',
		transcript:
			"The beauty of nature is truly mesmerizing. Just think about the vibrant colors of a sunset or the soothing sound of a flowing river. It's a reminder of the tranquility that surrounds us, urging us to appreciate the world we live in.",
		timestamp: '2021-01-01 10:00:00',
	},
	{
		speakerName: 'Speaker 2',
		transcript: 'Nature has an incredible way of inspiring creativity.',
		timestamp: '2021-01-01 10:00:00',
	},
	{
		speakerName: 'Speaker 3',
		transcript: 'This is the transcript of the third speaker',
		timestamp: '2021-01-01 10:00:00',
	},
	{
		speakerName: 'Speaker 1',
		transcript:
			"The beauty of nature is truly mesmerizing. Just think about the vibrant colors of a sunset or the soothing sound of a flowing river. It's a reminder of the tranquility that surrounds us, urging us to appreciate the world we live in.",
		timestamp: '2021-01-01 10:00:00',
	},
	{
		speakerName: 'Speaker 3',
		transcript: 'This is the transcript of the third speaker',
		timestamp: '2021-01-01 10:00:00',
	},
	{
		speakerName: 'Speaker 2',
		transcript: 'Nature has an incredible way of inspiring creativity.',
		timestamp: '2021-01-01 10:00:00',
	},
];
const TranscriptionSidebar = () => {
	// const {
	// 	notes: { transcriptionList },
	// } = useContext(Context);

	return (
		<div className={styles.transcriptionSidebar}>
			<div className={styles.transcriptionHeaderContainer}>
				<div className={styles.transcriptionHeaderLeft}>
					<SidebarClosingSvg />
					<div className={styles.transcriptionHeaderLeftTitle}>Transcription</div>
				</div>

				{/* <div className={styles.transcriptionHeaderRight}>
					<Dropdown
						menu={{ items: Options }}
						overlayClassName={styles.transcriptionHeaderRightDropdownOverlay}
						trigger={['click']}
						placement="bottom"
					>
						<div className={styles.transcriptionHeaderRightDropdown}>
							View Only <DownOutlined />
						</div>
					</Dropdown>
				</div> */}
			</div>
			<div className={styles.transcriptionListContainer}>
				{transcriptionList.map((item, index) => (
					<div key={item.id} className={styles.transcriptionItem}>
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
									{moment(item?.timestamp)?.format('HH:mm:ss')}
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
