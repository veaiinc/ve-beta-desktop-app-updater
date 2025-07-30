import styles from '../../../assets/scss/notes/transcriptionWidget.module.scss';
import { memo } from 'react';
import TranscriptionWidget from './TranscriptionWidget.jsx';
import { useSearchParams } from 'react-router-dom';
const TranscriptionWrapper = ({ chat, transcription, transcriptList = [] }) => {
	const [searchParams, setSearchParams] = useSearchParams();

	const onChatButtonClick = () => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set('chat', 'true');
		newParams.delete('transcription');
		setSearchParams(newParams, { replace: true });
	};
	return (
		<div
			className={styles.transcriptionWrapper}
			style={{
				right: chat || transcription ? '400px' : '0px',
			}}
		>
			{/* {!chat && ( */}
			<div className={styles.transcriptionWrapperButtonContainer}>
				<button className={styles.transcriptionWrapperButton} onClick={onChatButtonClick}>
					Ask Ve
				</button>
			</div>
			{/* )} */}
			{/* {!transcription && */}
			<TranscriptionWidget transcriptList={transcriptList} />
			{/* // } */}
		</div>
	);
};

export default memo(TranscriptionWrapper);
